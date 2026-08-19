# Changelog

## Unreleased

- Added `ProSoloFinale` as an allowed `event.type` value, alongside `ProSolo`.
  Backward-compatible relaxation applied to `v0.1.0` and `v0.2.0` in place, per
  [docs/versioning.md](docs/versioning.md).

## 0.2.0 - Working Draft

- Added `course4Runs`, so a driver result can carry up to four scored
  course/run-set groups instead of three. Additive change: `0.1.0` files are
  still valid, and `course4Runs` is only accepted under `specVersion: 0.2.0`.
- Added a `national-championship-four-course` example demonstrating a
  four-course result.

## 0.1.0 - Working Draft

Initial public working draft of Autocross Result Exchange.

Includes:

- AXR JSON Schema Draft 2020-12 schema
- Event, class, and driver result structure
- Source, producer, and provenance metadata
- Run string support for times, penalties, DNF/DNS/DSQ/RRN/RL
- Examples for local, two-course, and AI-converted results
- Validation tooling

Since the initial release, `course1Runs`, `course2Runs`, and `course3Runs`
were relaxed in place to remove their fixed maximum item count, and `RL` was
added as a supported non-numeric run string status. Both were
backward-compatible schema relaxations made without a version bump, per
[docs/versioning.md](docs/versioning.md).
