# AXR Validation

AXR v0.1.0 is validated with JSON Schema Draft 2020-12.

The schema lives at:

```text
schema/axr/v0.1.0/schema.json
```

## Included Node Validator

Install dependencies and validate examples from the repository root:

```text
cd tools
npm install
node validate-axr.js ../examples/axr/v0.1.0/*.json
```

Validate one file:

```text
node validate-axr.js ../examples/axr/v0.1.0/local-single-day.json
```

Validate multiple files:

```text
node validate-axr.js ../examples/axr/v0.1.0/*.json
```

The validator loads `../schema/axr/v0.1.0/schema.json` by default.

## Other JSON Schema Tools

Any JSON Schema Draft 2020-12 validator should work. Make sure the validator
supports standard formats such as `uri`, `date`, and `date-time`.

## Validate All Examples

The GitHub Actions workflow validates all public examples under:

```text
examples/axr/v0.1.0
```

It also checks that:

```text
schema/axr/latest/schema.json
```

is byte-identical to:

```text
schema/axr/v0.1.0/schema.json
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
must match pattern "^([0-9]+\\.[0-9]+(\\([0-9]+\\))?|No Time|DNF|DNS|DQ|RUN|DSQ|RRN)$"
```

When validation fails, fix the AXR file or propose a schema change if the file
represents a valid real-world result that AXR cannot express.
