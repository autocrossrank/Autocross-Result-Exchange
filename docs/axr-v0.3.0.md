# Autocross Result Exchange v0.3.0

AXR v0.3.0 is a working draft for class-based autocross result exchange.
It extends [v0.2.0](axr-v0.2.0.md) with unplaced entrants, disqualification
provenance, explicit indexed scoring, and test-and-tune events. All unchanged
fields retain their v0.2.0 meaning.

## Schema and consumer support

The schema is [schema/axr/v0.3.0/schema.json](../schema/axr/v0.3.0/schema.json).
Documents must declare `"specVersion": "0.3.0"`. The canonical URL reserved for
hosting is `https://autocrossrank.com/spec/axr/0.3.0/schema.json`.

This repository update does not publish that URL or deploy consumer support.
As verified on 2026-10-23, AutocrossRank production accepts only AXR v0.1.0 and
v0.2.0. Use a version your destination supports; v0.3.0 requires a separate
hosting/importer release. Do not relabel a document using new fields as v0.2.0.

## Unplaced entrants

`position` remains required, but accepts either a positive integer or `null`.
Use null when the source gives no finishing position, including disqualified or
unplaced practice entrants. Do not infer a position from the row's order. Null
does not itself imply disqualification or dictate ranking eligibility.

## Disqualifications and printed-total provenance

`totalTime` additionally accepts `DQ`, an alias of `DSQ`. `bestTime` additionally
accepts `DQ` and `DSQ` for final disqualifications; otherwise it remains a
nonnegative number or null. Individual run statuses retain their existing meaning:
a DQ run alone does not imply the whole result is disqualified.

A final DQ/DSQ requires `position: null` and cannot have `trophy: true`.
Preserve numeric attempts and penalties in their original course arrays:

```json
{
  "position": null,
  "trophy": false,
  "name": "Jordan Example",
  "carNumber": "42",
  "course1Runs": ["65.000", "64.500", "DNF"],
  "course2Runs": ["67.500", "67.076", "68.000(1)"],
  "totalTime": "DQ",
  "bestTime": "DQ",
  "sourcePrintedTotal": 131.576
}
```

`sourcePrintedTotal` is optional and accepts a nonnegative number in increments
of 0.001, or null. A numeric value requires final `totalTime: "DQ"` or `"DSQ"`.
Use it only for a numeric total actually printed in the source for a disqualified
entrant. Never reconstruct it from attempts, use it as a score, or use it to rank
the entrant. Omit it or use null when no printed numeric total is available.
Status-valued `bestTime` likewise requires a final DQ/DSQ.

## Indexed scoring

Two optional event fields describe which competition classes use indexed scores:

- `isPaxed`: boolean. True designates every class as indexed. False permits
  mixed scoring, with indexed classes identified by `paxClasses`.
- `paxClasses`: array of unique, nonempty class keys. Use the exact `shortName`
  of a class, or its `name` if `shortName` is absent or null. Matching is
  case-sensitive. Every key must resolve to exactly one class in the document.

Omission means unspecified, not an instruction to erase existing metadata.
An empty `paxClasses` explicitly lists no indexed classes; `isPaxed: true`
still designates every class regardless of that list. The schema checks field
types and duplicate keys. Reference existence and ambiguity require semantic
validation by producers and consumers; portable JSON Schema cannot express
those cross-object lookups.

For a mixed event:

```json
{
  "name": "Example Indexed Event",
  "isPaxed": false,
  "paxClasses": ["PRO"]
}
```

Run arrays always contain raw attempts, never indexed times. For an indexed
class, preserve the published indexed score in `totalTime` and, when supplied,
`paxTime`. Preserve a distinct raw best in `bestTime` and an underlying class
designation in `paxNote` when the source provides them. Do not infer indexed
scoring merely because a result includes a supplemental PAX time.

## Test-and-tune events

`event.type` additionally accepts `TestAndTune`. Preserve all published attempts
and use null positions when the source does not rank entrants. The type conveys
practice intent; each consumer owns its ranking eligibility policy. AXR does
not add application-specific ranking flags or repair commands.

## Compatibility

v0.1.0 and v0.2.0 schemas remain unchanged. Many existing documents can migrate
by changing only `specVersion`. A v0.2.0 DSQ with a numbered position or trophy
must be corrected to the v0.3.0 disqualification rules first. Consumers must
explicitly support the new version and must not silently drop its fields.

Four course arrays, unlimited runs, cone notation, run-level RL/RRN, provenance,
and ProSoloFinale remain supported. RL remains a run-only status, not an added
totalTime value.

## Examples and validation

See [v0.3.0 examples](../examples/axr/v0.3.0), including disqualified results,
mixed indexed/raw classes, test-and-tune, and four-course results.

```text
cd tools
npm ci
npm run validate
npm test
```

See [validation](validation.md) and the
[decision record](decisions/001-v0.3-production-result-fidelity.md).
