# AXR Versioning

AXR uses semantic-ish versioning for the public specification.

The version appears in `specVersion` and in versioned schema paths such as:

```text
schema/axr/v0.1.0/schema.json
```

## Working Draft Versions

Versions beginning with `0.` are working drafts. They are intended for real use,
feedback, and early integrations, but the contract may still change.

Breaking changes should increment the minor version before `1.0`.

Examples:

- `0.1.0` is the initial public working draft.
- `0.2.0` may add fields or refine structure.
- `1.0.0` would indicate a stable public contract.

## Pin Schema Versions

Stable production consumers should pin schema versions. For AXR v0.1.0, use:

```text
https://autocrossrank.com/spec/axr/0.1.0/schema.json
```

Avoid depending on:

```text
https://autocrossrank.com/spec/axr/latest/schema.json
```

`/latest/` is for exploration and development, not stable integrations.

## Patch, Minor, And Major Changes

Patch changes should clarify documentation, fix examples, correct obvious
non-contract mistakes, or make backward-compatible schema relaxations.

Minor changes before `1.0` may add fields, refine structure, or make breaking
working-draft changes.

Major changes at or after `1.0` should be reserved for breaking public contract
changes.

## When To Change `specVersion`

Do not change `specVersion` for documentation-only updates, example fixes, or
backward-compatible schema relaxations that only allow files previously rejected
by the schema.

Change `specVersion` when the public contract changes in a way producers or
consumers need to distinguish. Breaking changes should use a new minor version
while AXR is in `0.x` working draft status.

If a version has already been tagged, released, or published as a hosted schema,
subsequent schema contract changes should use a new patch or minor version
instead of rewriting the published version in place.
