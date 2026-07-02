# Timing System Export Guide

This guide is for timing system vendors, clubs, and regions that can export
structured autocross results.

## Why Support AXR

AXR gives timing systems a simple public JSON export target. A valid AXR file
can be archived, validated, imported, and analyzed by tools that understand the
schema.

You do not need to integrate directly with AutocrossRank. Supporting AXR can be
as simple as adding an "Export AXR JSON" option.

## Minimum Valid AXR File

```json
{
  "specVersion": "0.1.0",
  "event": {
    "name": "Example Event"
  },
  "classes": [
    {
      "name": "A Street",
      "drivers": [
        {
          "position": 1,
          "name": "Jane Driver",
          "carNumber": "42"
        }
      ]
    }
  ]
}
```

## Recommended Fields For Timing Systems

Timing systems should include:

- `format = "axr"`
- `source.name`
- `source.url` when the official result is published online
- `producer.type = "timingSystem"`
- `producer.name`
- `producer.version` when known
- `producer.organization` when exported by a club or region
- `provenance.conversionMethod = "timingSystem"`
- `provenance.success = true`
- complete `event` metadata
- class short names, trophies awarded, and run heat when known
- driver car, location, region, division, tire, sponsor, runs, and scored times

## Populating `source`

Use `source` for the original official result location.

```json
{
  "source": {
    "name": "Official Event 4 Results",
    "url": "https://example.com/results/event-4.html",
    "retrievedAt": null,
    "publishedAt": "2026-07-01T20:00:00Z"
  }
}
```

If the AXR file is generated directly by the timing system before publication,
`source.url` can be `null`.

## Populating `producer`

Use `producer` for the software or process that created the AXR file.

```json
{
  "producer": {
    "type": "timingSystem",
    "name": "Example Timing",
    "version": "5.1",
    "organization": "Example Region SCCA",
    "contact": null,
    "notes": null
  }
}
```

## Populating `provenance`

For native timing-system exports, provenance should usually be direct and
confident.

```json
{
  "provenance": {
    "conversionMethod": "timingSystem",
    "success": true,
    "reviewedByHuman": true,
    "confidence": 1,
    "warnings": [],
    "failedSections": []
  }
}
```

Use warnings if the export omitted optional sections or if source data was known
to be incomplete.

## Representing Runs

Run values are strings. Preserve the official result notation.

```json
"course1Runs": ["64.123", "63.987", "64.123(1)"]
```

Represent cones by appending the cone count in parentheses:

```json
"64.123(1)"
```

Use the official status text for non-time runs:

```json
"course1Runs": ["DNF", "DNS", "DSQ", "No Time"]
```

## Representing DNF, DNS, And DSQ

Use status strings in run arrays when the status applies to an individual run.
Use `totalTime` when the status is the driver's final scored result.

```json
{
  "course1Runs": ["DNF", "DNS", "DSQ"],
  "totalTime": "DNF"
}
```

`totalTime` accepts `DSQ`, `DNF`, `DNS`, `RRN`, `No Time`, a non-negative
number, or `null`.

## Two-Course Events

Use `course1Runs` and `course2Runs` for two-course events. Set
`event.format = "TwoCourseSum"` when the event is scored as a sum of best runs
from two courses.

```json
{
  "event": {
    "name": "Example National Tour",
    "format": "TwoCourseSum"
  },
  "classes": [
    {
      "name": "Super Street",
      "drivers": [
        {
          "position": 1,
          "name": "Alex Fast",
          "carNumber": "11",
          "course1Runs": ["59.112", "58.901", "DNF"],
          "course2Runs": ["60.222", "59.998", "60.500(1)"],
          "totalTime": 118.899
        }
      ]
    }
  ]
}
```

## Validate Before Publishing

Run the included validator before publishing AXR files:

```text
cd tools
npm install
node validate-axr.js ../examples/axr/v0.1.0/*.json
```

## Pin Schema Versions

Vendors should validate and publish against pinned schema versions such as
`0.1.0`. The `/latest/` schema is useful for exploration and development, but
stable integrations should not depend on it.
