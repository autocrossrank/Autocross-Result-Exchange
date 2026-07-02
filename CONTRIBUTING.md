# Contributing

Thanks for helping improve Autocross Result Exchange.

AXR is a public working draft, so practical feedback from timing systems, clubs,
archive projects, importers, and analysis tools is especially valuable.

## Suggest Schema Changes

Open a spec feedback issue and describe:

- the AXR version
- the field or structure involved
- the real-world result shape you need to represent
- the proposed change
- whether the change would break existing AXR files

Schema changes should include updated docs, updated examples where needed, and
validation updates.

Breaking changes should not be made lightly. During `0.x` working drafts,
breaking changes should increment the minor version.

## Report Validation Issues

Open a bug report if a valid AXR file fails validation, an invalid file passes
validation, or an error message is misleading.

Include the smallest example file that reproduces the issue. Do not include
private data.

## Add Examples

Examples should be public, small, and focused. Prefer fictionalized data unless
the result is already publicly available and appropriate to include.

Each example must validate against the schema. If an example requires a schema
change, include that change in the same pull request.

## Propose Timing System Support

Use the timing system support issue template to describe the timing system or
source format, available export fields, scoring formats, run notation, and any
AXR fields that are hard to populate.

## Versioning

AXR uses semantic-ish versioning. `0.x` versions are working drafts. Stable
production consumers should pin schema versions instead of using `latest`.

See [docs/versioning.md](docs/versioning.md).
