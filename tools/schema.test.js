const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const root = path.resolve(__dirname, "..");
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const versions = ["0.1.0", "0.2.0", "0.3.0"];
const schemas = new Map(versions.map((version) => [version,
  fs.readFileSync(path.join(root, `schema/axr/v${version}/schema.json`), "utf8")]));
const validators = new Map([...schemas].map(([version, text]) => [version, ajv.compile(JSON.parse(text))]));

function document(version = "0.3.0") {
  return { specVersion: version, event: { name: "Example" }, classes: [{
    name: "A Street", shortName: "AS", drivers: [{ position: 1, name: "Example Driver", carNumber: "42" }],
  }] };
}
function driver(data) { return data.classes[0].drivers[0]; }
function check(data, expected) {
  const validate = validators.get(data.specVersion);
  assert.equal(validate(data), expected, JSON.stringify(validate.errors));
}

test("latest is byte-identical to v0.3.0", () => {
  assert.equal(fs.readFileSync(path.join(root, "schema/axr/latest/schema.json"), "utf8"), schemas.get("0.3.0"));
});

for (const version of versions) {
  test(`${version} examples validate`, () => {
    const folder = path.join(root, `examples/axr/v${version}`);
    for (const name of fs.readdirSync(folder).filter((name) => name.endsWith(".json"))) {
      check(JSON.parse(fs.readFileSync(path.join(folder, name), "utf8")), true);
    }
  });
  test(`${version} keeps required fields and rejects unknown properties`, () => {
    const data = document(version);
    check(data, true);
    delete driver(data).position;
    check(data, false);
    driver(data).position = 1;
    driver(data).unknown = true;
    check(data, false);
  });
}

test("v0.2.0 examples can migrate by changing only specVersion", () => {
  const folder = path.join(root, "examples/axr/v0.2.0");
  for (const name of fs.readdirSync(folder)) {
    const data = JSON.parse(fs.readFileSync(path.join(folder, name), "utf8"));
    data.specVersion = "0.3.0";
    check(data, true);
  }
});

test("nullable position preserves an unplaced practice entrant and numeric attempts", () => {
  const data = document();
  data.event.type = "TestAndTune";
  Object.assign(driver(data), { position: null, totalTime: null, bestTime: 60.125, course1Runs: ["60.125", "RL", "RRN"] });
  check(data, true);
  for (const position of [0, -1, 1.5, "1"]) {
    driver(data).position = position;
    check(data, false);
  }
});

for (const status of ["DQ", "DSQ"]) {
  test(`${status} retains printed total and runs without placing or awarding a trophy`, () => {
    const data = document();
    Object.assign(driver(data), { position: null, trophy: false, totalTime: status, bestTime: status,
      sourcePrintedTotal: 131.576, course1Runs: ["64.500", "DNF"], course2Runs: ["67.076"] });
    check(data, true);
    driver(data).position = 1;
    check(data, false);
    driver(data).position = null;
    driver(data).trophy = true;
    check(data, false);
    delete driver(data).trophy;
    check(data, true);
    driver(data).sourcePrintedTotal = -1;
    check(data, false);
    driver(data).sourcePrintedTotal = "131.576";
    check(data, false);
    driver(data).sourcePrintedTotal = null;
    check(data, true);
  });
}

test("disqualification provenance cannot become an ordinary scored result", () => {
  for (const totalTime of [60.125, "DNF", null, undefined]) {
    const data = document();
    if (totalTime !== undefined) driver(data).totalTime = totalTime;
    driver(data).sourcePrintedTotal = 60.125;
    check(data, false);
    delete driver(data).sourcePrintedTotal;
    driver(data).bestTime = "DQ";
    check(data, false);
  }
});

test("index metadata accepts event-wide or mixed scoring and rejects malformed lists", () => {
  const data = document();
  data.event.isPaxed = true;
  check(data, true);
  data.event.isPaxed = false;
  data.event.paxClasses = ["AS"];
  check(data, true);
  data.event.paxClasses = [];
  check(data, true);
  for (const list of [["AS", "AS"], [""], [42], "AS", null]) {
    data.event.paxClasses = list;
    check(data, false);
  }
  delete data.event.paxClasses;
  data.event.isPaxed = "true";
  check(data, false);
});

for (const version of ["0.1.0", "0.2.0"]) {
  test(`${version} rejects each new v0.3.0 feature`, () => {
    const changes = [
      (data) => { driver(data).position = null; },
      (data) => { driver(data).totalTime = "DQ"; },
      (data) => { driver(data).bestTime = "DSQ"; },
      (data) => { driver(data).sourcePrintedTotal = null; },
      (data) => { data.event.type = "TestAndTune"; },
      (data) => { data.event.isPaxed = true; },
      (data) => { data.event.paxClasses = ["AS"]; },
    ];
    for (const change of changes) {
      const data = document(version);
      change(data);
      check(data, false);
    }
  });
}
