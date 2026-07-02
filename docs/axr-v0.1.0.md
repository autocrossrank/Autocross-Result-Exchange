# Autocross Result Exchange v0.1.0

Autocross Result Exchange, abbreviated AXR, is a practical open JSON format for
publishing autocross event results in a machine-readable way.

AXR v0.1.0 is a working draft. It intentionally keeps a class-centric shape
because that is how autocross results are usually published and because timing
systems, archive scripts, humans, and AI-assisted converters can generate it
without first modeling a fully normalized database.

## Who AXR Is For

- Timing systems exporting official event results.
- Clubs and regions publishing machine-readable result files.
- Archive converters turning PDFs, HTML pages, or old exports into JSON.
- AI/PDF extraction tools that need to express uncertainty in a portable way.
- Results archives that want a public interchange format instead of an internal
  application model.

## Schema

The canonical v0.1.0 schema lives at:

```text
schema/axr/v0.1.0/schema.json
```

The hosted schema URL is:

```text
https://autocrossrank.com/spec/axr/0.1.0/schema.json
```

Production integrations should use pinned versions like `0.1.0`, not `latest`.

## Top-Level Shape

```json
{
  "specVersion": "0.1.0",
  "format": "axr",
  "source": {},
  "producer": {},
  "provenance": {},
  "organization": {},
  "event": {},
  "classes": []
}
```

Required fields are `specVersion`, `event`, and `classes`. The `format` field is
optional, but when present it must be `axr`.

Optional top-level fields are `source`, `producer`, `provenance`, and
`organization`.

## Source, Producer, Provenance

Use this distinction:

```text
source = where the original results came from
producer = who or what created the AXR JSON file
provenance = how the JSON was created and how trustworthy or complete it is
```

`source` is for the original PDF, web page, timing-system export, or official
result location:

```json
{
  "source": {
    "name": "Official STL SCCA Event 4 Results",
    "url": "https://example.com/results.pdf",
    "retrievedAt": "2026-07-01T15:30:00Z",
    "publishedAt": null
  }
}
```

`producer` is strongly recommended. It identifies the timing system, script,
person, organization, AI process, or other creator of the AXR file:

```json
{
  "producer": {
    "type": "timingSystem",
    "name": "Pronto Timing",
    "version": "5.1",
    "organization": "St. Louis Region SCCA",
    "contact": null,
    "notes": null
  }
}
```

`provenance` is intended for conversion confidence, review state, warnings, and
sections that could not be converted:

```json
{
  "provenance": {
    "conversionMethod": "ai",
    "success": true,
    "reviewedByHuman": false,
    "confidence": 0.85,
    "warnings": ["One driver location was unreadable in the source PDF"],
    "failedSections": []
  }
}
```

## Event Metadata

The `event` object requires `name` and supports `regionOrClub`, `location`,
`dates`, `startDate`, `endDate`, `sourceUrl`, `type`, and `format`.

Public event type values are:

```text
Local, Regional, Divisional, National, NationalChampionship, ProSolo, ChampTour, NationalTour
```

Public event format values are:

```text
SingleDay, TwoDay, TwoDaySum, TwoCourseSum, ThreeDay, BestRunAcrossDays, Custom, Standard
```

## Classes And Drivers

The `classes` array contains class result objects. Each class requires `name` and
`drivers`; each driver requires `position`, `name`, and `carNumber`.

Class fields can include `shortName`, `trophiesAwarded`, and `runHeat`. Driver
fields can include car, location, region, division, tire, sponsor, runs, total
time, PAX time, best time, and notes.

## Run Strings

For v0.1.0, run values remain strings. This preserves PDF/timing-system fidelity
and keeps extraction simple:

```json
{
  "course1Runs": ["64.123", "64.123(1)", "DNF", "No Time"]
}
```

Accepted run strings follow this pattern:

```regex
^([0-9]+\.[0-9]+(\([0-9]+\))?|No Time|DNF|DNS|DQ|RUN|DSQ|RRN)$
```

`totalTime` can be a non-negative number, `DSQ`, `DNF`, `DNS`, `RRN`, `No Time`,
or `null`. `paxTime` and `bestTime` can be non-negative numbers or `null`.

## Timing System Export Guidance

Timing systems should export AXR directly from their official result data,
include `producer.type = "timingSystem"`, include the timing-system version when
known, and use `source.url` for the published official result when available.

For penalties, preserve the printed run notation. For example, a 64.123 second
run with one cone is represented as `64.123(1)`. Use status strings such as
`DNF`, `DNS`, `DSQ`, `RRN`, and `No Time` when those are the official result
values.

## AI/PDF Conversion Guidance

AI/PDF converters should preserve printed run/status values, avoid inventing
data, and put uncertainty in `provenance.warnings`. If a section could not be
converted, include it in `provenance.failedSections` and set
`provenance.success` accordingly.

Use `null` for unknown optional fields. Set `provenance.reviewedByHuman = true`
only when a person actually reviewed the converted result.

## Validation Guidance

AXR v0.1.0 is validated with JSON Schema Draft 2020-12. This repository includes
a Node.js validator:

```text
cd tools
npm install
node validate-axr.js ../examples/axr/v0.1.0/*.json
```

See [validation.md](validation.md) for details.

## Feedback

Feedback is welcome through GitHub issues and pull requests. Useful feedback
includes real-world examples, timing-system export questions, ambiguous fields,
validation errors, and proposed schema changes.

For schema changes, include updated docs and examples where appropriate.

## Examples

See:

```text
examples/axr/v0.1.0/local-single-day.json
examples/axr/v0.1.0/national-tour-two-course.json
examples/axr/v0.1.0/ai-converted-pdf.json
```
