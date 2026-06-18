# AGENTS.md

## Project overview
This repo is a public skill, not a traditional software app.
The primary artifact is `SKILL.md`, which defines a multi-agent job-fit workflow.
Supporting docs explain the product, track changes, and preserve audit context.

## Repo structure
`SKILL.md` - operational source of truth for skill behavior, triggers, workflow, and output contract.
`README.md` - public overview, usage guide, architecture summary, and companion-skill explanation.
`CHANGELOG.md` - version history and rationale for behavioral changes.
`AUDIT_MYTHOS.md` - historical audit artifact; read for context, do not update unless explicitly asked.
`LICENSE` - MIT license text; do not modify unless explicitly asked.
`AGENTS.md` - maintainer instructions for working safely and consistently in this repo.

## How to verify your work
There is no automated test suite.
Verified work means:
- the changed instructions are internally consistent inside `SKILL.md`
- `README.md` and `CHANGELOG.md` reflect any user-visible behavior changes
- agent count, version number, outputs, and phase sequencing agree across docs
- no new text weakens the Source Integrity Layer or Advocate/Auditor behavior
- no public doc introduces private data, contact details, local-path leakage, or hidden infrastructure detail
- if behavior changed, add a changelog entry and confirm version alignment
- run the standing sample-run checklist against one JD and one resume, using the expected output shape fixture maintained outside this public repo when available

## Conventions
Use the repo's current versioning scheme: `vX.Y`.
Keep changelog entries grouped under Added, Changed, Fixed, Removed, or Not affected when useful.
Treat wording in `SKILL.md` as behavioral code: small phrasing changes can change runtime behavior.
Prefer explicit, enforceable instructions over aspirational prose.
Do not silently resolve contradictions between docs; flag them.

## Boundaries
Do not modify `AUDIT_MYTHOS.md` or `LICENSE` unless the user explicitly asks.
Do not add personal context, contact info, recruiter details, search posture, or companion-skill content to this public repo.
Be cautious with local paths, runtime paths, and implementation-specific infrastructure details in public-facing docs.
All changes must be made on a `codex/*` (or equivalent feature) branch. Do not commit directly to `main`.
Do not create, edit, stage, commit, or push files without explicit user approval for that task.

## Governance
Governance source of authority is the `jonathan-governance` skill (currently deployed as a Codex skill at `~/.codex/skills/jonathan-governance/SKILL.md`; other agents reference the canonical source at `ai-team-ops/jonathan-ops/governance.md`).
Reference it; do not duplicate it here.

## Companion skill pattern
This repo contains the public core skill only.
A private companion context skill may personalize voice, proof points, and current search context, but it must live outside this repo.
Changes to companion-skill behavior should not be implemented by embedding private content into the public core.
