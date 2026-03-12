# Changelog — Job Fit Analyst

All notable changes to this skill are documented here.

---

## [v2.3] — 2026-03-11

### Added
- **Agent 6 Self-Audit Pass** — Interview Prep guide now requires a claim-by-claim integrity check before being presented to the user. Covers all strategy recommendations, talking points, "Your Angle" fields, "Honest Strategy" fields, STAR outlines, behavioral frameworks, and closing statements.
- **Inference Trap rule** — Explicit prohibition added to Agent 6 preventing the model from inferring specific technical credentials (e.g., AWS IAM governance, user provisioning automation) from general resume concepts (e.g., led a cloud migration). General concepts do not license specific technical claims.

### Fixed
- Hallucination pattern in Agent 6 where interview pivot strategies fabricated specific technical experience not documented in the source resume — same failure class as the SOC 2 incident that prompted v2.2.

---

## [v2.2] — 2026-03

### Added
- **Agent 4 Self-Audit Pass** — Cover Letter now requires a claim-by-claim integrity check before .docx generation. Checks every metric, named technology, named framework, named compliance standard, and scoped accomplishment against the source resume.
- **High-risk fabrication targets list** — Agent 4 audit explicitly calls out named compliance frameworks, certifications, team sizes, budget figures, and seniority descriptors as elevated-scrutiny items.

### Fixed
- Hallucination of compliance frameworks (e.g., SOC 2) in cover letter content when frameworks were present in the JD but absent from the source resume.

---

## [v2.1] — 2026-03 (initial public release)

### Features
- Six-agent workflow: Role Analyst, Culture Scout, Fit Evaluator, Cover Letter Writer, Resume Optimizer, Interview Prep
- Advocate/Auditor dual-voice framework with explicit conflict labeling
- Source Integrity Layer governing all six agents
- Fit Score (0.00–1.00 in 0.05 increments) with mandatory justification
- Agent 5 Self-Audit Pass on Resume Optimizer (bullet-by-bullet source integrity check)
- Phase 1 / Phase 2 parallel execution model
- Quick Take mode (Fit Score + 2-sentence summary only)
- Individual agent run support
- .docx output for cover letter and optimized resume via docx-js
