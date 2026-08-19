#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const repoRoot = path.resolve(__dirname, "..");
const defaultSpecVersion = "0.1.0";

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function schemaPathForVersion(specVersion) {
  return path.join(repoRoot, "schema", "axr", `v${specVersion}`, "schema.json");
}

function formatInstancePath(error) {
  return error.instancePath || "/";
}

function wildcardToRegex(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
}

function expandInput(inputPath) {
  if (!/[*?]/.test(inputPath)) {
    return [inputPath];
  }

  const absolutePattern = path.resolve(process.cwd(), inputPath);
  const directory = path.dirname(absolutePattern);
  const filePattern = path.basename(absolutePattern);
  const matcher = wildcardToRegex(filePattern);

  if (!fs.existsSync(directory)) {
    return [inputPath];
  }

  const matches = fs
    .readdirSync(directory)
    .filter((name) => matcher.test(name))
    .map((name) => path.join(directory, name))
    .sort();

  return matches.length > 0 ? matches : [inputPath];
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node validate-axr.js <file.json> [more-files.json ...]");
    console.log("");
    console.log("Example:");
    console.log("  node validate-axr.js ../examples/axr/v0.1.0/*.json");
    process.exit(args.length === 0 ? 1 : 0);
  }

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validatorsByVersion = new Map();

  function validatorForVersion(specVersion) {
    if (!validatorsByVersion.has(specVersion)) {
      const schema = readJson(schemaPathForVersion(specVersion));
      validatorsByVersion.set(specVersion, ajv.compile(schema));
    }
    return validatorsByVersion.get(specVersion);
  }

  let failed = false;

  const inputPaths = args.flatMap(expandInput);

  for (const inputPath of inputPaths) {
    const filePath = path.resolve(process.cwd(), inputPath);
    const displayPath = path.relative(process.cwd(), filePath) || inputPath;

    try {
      const data = readJson(filePath);
      // Each file declares the schema version it targets. Falls back to the
      // original default (0.1.0) only when specVersion is missing entirely,
      // so the "missing specVersion" validation error still surfaces normally.
      const specVersion = typeof data.specVersion === "string" ? data.specVersion : defaultSpecVersion;
      const validate = validatorForVersion(specVersion);
      const valid = validate(data);

      if (valid) {
        console.log(`PASS ${displayPath} (specVersion ${specVersion})`);
        continue;
      }

      failed = true;
      console.error(`FAIL ${displayPath}`);

      for (const error of validate.errors || []) {
        const location = formatInstancePath(error);
        console.error(`  ${location} ${error.message}`);
      }
    } catch (error) {
      failed = true;
      console.error(`FAIL ${inputPath}`);
      console.error(`  ${error.message}`);
    }
  }

  process.exit(failed ? 1 : 0);
}

main();
