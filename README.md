# Autocross Result Exchange

Autocross Result Exchange, AXR, is an open JSON format for publishing
autocross event results in a machine-readable way.

AXR is a practical open format for autocross results. It is a community-friendly
working draft created by AutocrossRank.com to make autocross results easier to
archive, validate, import, and analyze.

AXR is not claimed to be the official standard for all autocross organizations.
It is a public format that timing systems, clubs, archives, converters, and
analysis tools can choose to support.

## What Is AXR?

AXR describes autocross results as JSON. The format is class-centric because
that is how autocross results are commonly published: an event contains classes,
and each class contains driver results.

The format also includes metadata for where results came from, who or what
created the AXR file, and how trustworthy or complete a conversion is.

## Current Version

Current version: AXR v0.1.0 Working Draft

- Specification: [docs/axr-v0.1.0.md](docs/axr-v0.1.0.md)
- Field reference: [docs/field-reference.md](docs/field-reference.md)
- Versioning notes: [docs/versioning.md](docs/versioning.md)

Canonical hosted schema URL:

```text
https://autocrossrank.com/spec/axr/0.1.0/schema.json
```

Latest schema URL:

```text
https://autocrossrank.com/spec/axr/latest/schema.json
```

Production integrations should use a pinned versioned schema URL such as
`/0.1.0/`, not `/latest/`.

## Quick Example

```json
{
  "specVersion": "0.1.0",
  "format": "axr",
  "source": {
    "name": "Example Region Event 4 Results",
    "url": "https://example.com/results/event-4.pdf",
    "retrievedAt": "2026-07-01T15:30:00Z",
    "publishedAt": null
  },
  "producer": {
    "type": "timingSystem",
    "name": "Example Timing",
    "version": "1.0",
    "organization": "Example Region SCCA",
    "contact": null,
    "notes": null
  },
  "provenance": {
    "conversionMethod": "timingSystem",
    "success": true,
    "reviewedByHuman": true,
    "confidence": 1,
    "warnings": [],
    "failedSections": []
  },
  "event": {
    "name": "Example Region Event 4",
    "regionOrClub": "Example Region SCCA",
    "location": "Madison, IL",
    "dates": "2026-07-01",
    "startDate": "2026-07-01",
    "endDate": "2026-07-01",
    "sourceUrl": "https://example.com/results/event-4.pdf",
    "type": "Local",
    "format": "SingleDay"
  },
  "classes": [
    {
      "name": "A Street",
      "shortName": "AS",
      "drivers": [
        {
          "position": 1,
          "name": "Jane Driver",
          "carNumber": "42",
          "course1Runs": ["64.321", "63.987", "64.123(1)"],
          "totalTime": 63.987
        }
      ]
    }
  ]
}
```

## Who This Is For

- Timing systems exporting official event results.
- Clubs and regions publishing machine-readable result files.
- Archive projects converting PDFs, HTML pages, or older exports.
- AI/OCR workflows that need a public result shape with uncertainty metadata.
- Developers building importers, validators, rankings, archives, or analysis.

## Schema

The schema is JSON Schema Draft 2020-12.

- Versioned schema: [schema/axr/v0.1.0/schema.json](schema/axr/v0.1.0/schema.json)
- Latest mirror: [schema/axr/latest/schema.json](schema/axr/latest/schema.json)

For now, `latest` is byte-identical to `v0.1.0`.

## Examples

Public examples live in [examples/axr/v0.1.0](examples/axr/v0.1.0):

- [local-single-day.json](examples/axr/v0.1.0/local-single-day.json)
- [national-tour-two-course.json](examples/axr/v0.1.0/national-tour-two-course.json)
- [ai-converted-pdf.json](examples/axr/v0.1.0/ai-converted-pdf.json)

## Validation

This repository includes a Node.js validator.

```text
cd tools
npm install
node validate-axr.js ../examples/axr/v0.1.0/*.json
```

More details: [docs/validation.md](docs/validation.md)

## Versioning

AXR uses semantic-ish versioning for the specification. `0.x` releases are
working drafts. Stable production consumers should pin schema versions instead
of depending on `latest`.

More details: [docs/versioning.md](docs/versioning.md)

## Contributing

Feedback, examples, validation issues, and timing-system export suggestions are
welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

Schema changes should include updated documentation, updated examples where
needed, and validation updates.

## Relationship To AutocrossRank

AXR was created by AutocrossRank.com and is used by AutocrossRank import
workflows, but the format is intentionally public and application-neutral. You
do not need to integrate directly with AutocrossRank to support AXR.

## License

This repository is licensed under the MIT License. Timing systems, clubs,
archive projects, and developers may freely copy the schema, generate AXR,
validate AXR, and build AXR support.
