# AI And Archive Conversion Guide

This guide is for people using AI tools, OCR, scripts, or manual review to
convert old PDFs, HTML pages, images, or text results into AXR.

## Core Rules

- Do not invent missing values.
- Preserve original text when structured values are uncertain.
- Use `null` when an optional value is unknown.
- Add warnings for ambiguous rows, classes, penalties, or unreadable text.
- Add failed or unreadable classes to `provenance.failedSections`.
- Validate output before importing or publishing.

Do not invent missing drivers, classes, run times, car numbers, dates, car
details, PAX values, or trophies.

## Provenance

Use `provenance.conversionMethod = "ai"` when AI extraction was used.

Use `provenance.reviewedByHuman = true` only if a person actually reviewed the
output against the source material.

Use `provenance.confidence` conservatively. A value near `1` should be reserved
for clean, complete, reviewed conversions. Use lower values when the source was
blurry, incomplete, ambiguous, or only partially reviewed.

Example:

```json
{
  "provenance": {
    "conversionMethod": "ai",
    "success": true,
    "reviewedByHuman": false,
    "confidence": 0.75,
    "warnings": [
      "One driver location was unreadable",
      "Two cone penalties were ambiguous in C Street"
    ],
    "failedSections": []
  }
}
```

## Unknown And Ambiguous Values

Use `null` for unknown optional fields:

```json
{
  "location": null,
  "tireManufacturer": null,
  "paxTime": null
}
```

If original text is ambiguous but important, preserve it in `notes` or
`provenance.warnings`.

## Failed Sections

If a class, page, or section cannot be converted, include it in
`provenance.failedSections`.

```json
{
  "failedSections": ["Page 4, Street Touring Roadster"]
}
```

Set `provenance.success = false` when important required result sections are
missing or unreadable.

## Example Prompt

```text
Convert the attached autocross results into Autocross Result Exchange AXR v0.1.0 JSON.

Rules:
- Do not invent missing drivers, classes, run times, car numbers, dates, or PAX values.
- Use null for unknown optional fields.
- Preserve ambiguous original text in notes or warnings.
- Use provenance.conversionMethod = "ai".
- Use provenance.reviewedByHuman = false unless a human has reviewed the result.
- Add warnings for uncertain rows, unreadable text, or ambiguous penalties.
- Validate the final JSON against AXR v0.1.0.
```

## Validation

Validate every converted file before importing or publishing it.

```text
cd tools
npm install
node validate-axr.js ../examples/axr/v0.1.0/ai-converted-pdf.json
```

Validation only confirms that the JSON matches the schema. It does not prove the
conversion is accurate, complete, or officially reviewed.
