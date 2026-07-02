# AXR v0.1.0 Field Reference

This reference summarizes the public fields in Autocross Result Exchange v0.1.0.
The JSON Schema remains the final validation contract.

## `specVersion`

Purpose: identifies the AXR specification version.

Type: string.

Required: yes.

Example:

```json
"specVersion": "0.1.0"
```

Notes: v0.1.0 files must use exactly `0.1.0`.

## `format`

Purpose: identifies the file as Autocross Result Exchange.

Type: string.

Required: no.

Example:

```json
"format": "axr"
```

Notes: when present, the only valid value is `axr`.

## `source`

Purpose: describes where the original results came from.

Type: object.

Required: no.

Example:

```json
{
  "name": "Official Event 4 Results",
  "url": "https://example.com/results/event-4.pdf",
  "retrievedAt": "2026-07-01T15:30:00Z",
  "publishedAt": null
}
```

Notes: `source.url` should point to the original PDF, HTML page, timing-system
export, or official result location when available. `retrievedAt` and
`publishedAt` use date-time strings.

## `producer`

Purpose: identifies who or what created the AXR JSON file.

Type: object.

Required: no, but strongly recommended.

Example:

```json
{
  "type": "timingSystem",
  "name": "Example Timing",
  "version": "1.0",
  "organization": "Example Region SCCA",
  "contact": null,
  "notes": null
}
```

Notes: `producer.type` must be one of `timingSystem`, `person`,
`organization`, `script`, `ai`, or `unknown`. `producer.name` should identify
the timing system, script, person, organization, or conversion tool when known.

## `provenance`

Purpose: describes how the AXR file was created and how trustworthy or complete
it is.

Type: object.

Required: no.

Example:

```json
{
  "conversionMethod": "ai",
  "success": true,
  "reviewedByHuman": false,
  "confidence": 0.85,
  "warnings": ["One driver location was unreadable"],
  "failedSections": []
}
```

Notes: `provenance.conversionMethod` must be one of `timingSystem`, `manual`,
`ai`, `script`, or `unknown`. Use `warnings` for ambiguity and
`failedSections` for classes, pages, or sections that could not be converted.
`confidence` is a number from 0 to 1 or `null`.

## `organization`

Purpose: describes the club, region, or sanctioning body responsible for the
event/results.

Type: object.

Required: no.

Example:

```json
{
  "name": "Example Region SCCA",
  "sanctioningBody": "SCCA",
  "region": "Example",
  "division": "Midwest"
}
```

Notes: use `null` for unknown optional values.

## `event`

Purpose: describes the event represented by the result file.

Type: object.

Required: yes.

Example:

```json
{
  "name": "Example Region Event 4",
  "regionOrClub": "Example Region SCCA",
  "location": "Madison, IL",
  "dates": "2026-07-01",
  "startDate": "2026-07-01",
  "endDate": "2026-07-01",
  "sourceUrl": "https://example.com/results/event-4.pdf",
  "type": "Local",
  "format": "SingleDay"
}
```

Notes: `event.name` is required. `event.type` may be `Local`, `Regional`,
`Divisional`, `National`, `NationalChampionship`, `ProSolo`, `ChampTour`, or
`NationalTour`. `event.format` may be `SingleDay`, `TwoDay`, `TwoDaySum`,
`TwoCourseSum`, `ThreeDay`, `BestRunAcrossDays`, `Custom`, or `Standard`.

## `classes`

Purpose: contains class result groups.

Type: array of class objects.

Required: yes.

Example:

```json
[
  {
    "name": "A Street",
    "shortName": "AS",
    "trophiesAwarded": 1,
    "runHeat": 2,
    "drivers": []
  }
]
```

Notes: the array must contain at least one class. Each class must include
`name` and `drivers`.

## Class Fields

Purpose: class fields describe one competition class and its drivers.

Type: object.

Required fields: `name`, `drivers`.

Example:

```json
{
  "name": "A Street",
  "shortName": "AS",
  "trophiesAwarded": 1,
  "runHeat": 2,
  "drivers": []
}
```

Notes: `shortName`, `trophiesAwarded`, and `runHeat` are optional. `drivers`
must contain at least one driver result.

## Driver Result Fields

Purpose: driver fields describe one competitor result within a class.

Type: object.

Required fields: `position`, `name`, `carNumber`.

Example:

```json
{
  "position": 1,
  "trophy": true,
  "name": "Jane Driver",
  "carNumber": "42",
  "car": "2024 Mazda MX-5",
  "location": "St. Louis, MO",
  "rgn": "St. Louis",
  "division": "Midwest",
  "tireManufacturer": "Bridgestone",
  "sponsor": null,
  "course1Runs": ["64.321", "63.987", "64.123(1)"],
  "course2Runs": [],
  "course3Runs": [],
  "totalTime": 63.987,
  "paxTime": null,
  "paxNote": null,
  "bestTime": 63.987,
  "notes": null
}
```

Notes: `classes[].drivers[]` is where all individual competitor result data
lives. Optional fields may be omitted or set to `null` when allowed by the
schema.

## Run Strings

Purpose: run arrays preserve printed run values from results.

Type: array of strings.

Required: no.

Example:

```json
"course1Runs": ["64.123", "64.123(1)", "DNF", "No Time"]
```

Notes: `course1Runs`, `course2Runs`, and `course3Runs` each allow up to 10 run
strings. Cones are represented by appending the cone count in parentheses, such
as `64.123(1)`.

## Time Fields

Purpose: summarize scored and indexed times.

Type: number, status string, or null depending on the field.

Required: no.

Example:

```json
{
  "totalTime": 118.899,
  "paxTime": 95.834,
  "paxNote": "Provisional",
  "bestTime": 58.901
}
```

Notes: `totalTime` can be a non-negative number, `DSQ`, `DNF`, `DNS`, `RRN`,
`No Time`, or `null`. `paxTime` and `bestTime` can be non-negative numbers or
`null`. `paxNote` is a short string or `null`.

## Status Values

Purpose: preserve official non-time result statuses.

Type: string.

Required: no.

Example:

```json
"totalTime": "DNF"
```

Notes: run strings support `No Time`, `DNF`, `DNS`, `DQ`, `RUN`, `DSQ`, and
`RRN`. `totalTime` supports `DSQ`, `DNF`, `DNS`, `RRN`, and `No Time`.
