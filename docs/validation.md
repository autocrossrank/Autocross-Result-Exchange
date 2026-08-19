# AXR Validation

AXR is validated with JSON Schema Draft 2020-12. Each schema version has its
own versioned schema file, for example:

```text
schema/axr/v0.1.0/schema.json
schema/axr/v0.2.0/schema.json
```

## Included Node Validator

Install dependencies and validate examples from the repository root:

```text
cd tools
npm install
node validate-axr.js ../examples/axr/v0.2.0/*.json
```

Validate one file:

```text
node validate-axr.js ../examples/axr/v0.2.0/local-single-day.json
```

Validate multiple files, including across versions in one run:

```text
node validate-axr.js ../examples/axr/v0.1.0/*.json ../examples/axr/v0.2.0/*.json
```

The validator reads each file's own `specVersion` and loads the matching
`schema/axr/v{specVersion}/schema.json` automatically — a `0.1.0` file is
checked against the `0.1.0` schema, a `0.2.0` file against the `0.2.0` schema,
in the same run. Files with no `specVersion` at all fall back to `0.1.0` so the
"missing specVersion" error still surfaces normally rather than crashing the
validator.

## Other JSON Schema Tools

Any JSON Schema Draft 2020-12 validator should work. Make sure the validator
supports standard formats such as `uri`, `date`, and `date-time`.

## Validate All Examples

The GitHub Actions workflow validates all public examples under:

```text
examples/axr/v0.1.0
examples/axr/v0.2.0
```

It also checks that:

```text
schema/axr/latest/schema.json
```

is byte-identical to the newest versioned schema (currently):

```text
schema/axr/v0.2.0/schema.json
```

## Common Errors

Missing required property:

```text
must have required property 'event'
```

Unexpected property:

```text
must NOT have additional properties
```

Invalid event type:

```text
must be equal to one of the allowed values
```

Invalid run string:

```text
must match pattern "^([0-9]+\\.[0-9]+(\\([0-9]+\\))?|No Time|DNF|DNS|DQ|RUN|DSQ|RRN|RL)$"
```

When validation fails, fix the AXR file or propose a schema change if the file
represents a valid real-world result that AXR cannot express.
