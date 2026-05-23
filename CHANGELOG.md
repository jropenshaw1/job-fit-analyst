# Changelog — Job Fit Analyst

All notable changes to this skill are documented here.

---

## [v2.9] — 2026-05-23

### Removed
- **Agent 5 (Resume Optimizer)** — Removed from the pipeline entirely. Agent 5 was designed to produce a JD-tailored resume as a .docx, but never achieved reliable output quality. The effort to fix it was not justified by its value relative to the other agents. Removing it eliminates wasted tokens and processing time on every run — significant when running multiple JFAs in sequence.

### Changed
- Skill version: v2.8 6-Agent → v2.9 5-Agent
- Phase 2 now runs Agents 4 and 6 in parallel (previously 4, 5, and 6)
- Agent 3 Narrative Claims handoff block now consumed by Agents 4 and 6 (previously 4, 5, and 6)
- Narrative Claims grounding note updated to reference cover letter framing in Agent 4 only (previously referenced "outputs in Agents 4 and 5")
- Source Integrity Layer output list updated: "analysis, cover letter, interview prep" (previously included "optimized resume")
- Output files reduced to two .docx deliverables: CoverLetter and InterviewGuide (previously three)
- Trigger phrases updated: removed "optimize my resume for this role" and "optimized resume" references
- Frontmatter description updated to reflect cover letters and interview guides only

### Fixed
- **Output table and file list now document all four generated files**: fit_analysis.md (machine-readable, for PipelinePilot), FitAnalysis_[Company].docx (human-readable), CoverLetter, and InterviewGuide. The .md and FitAnalysis .docx were previously undocumented in both SKILL.md and README.

### Not affected
- Agents 1, 2, 3, 4, and 6: zero changes to logic, self-audit passes, or output format
- Source Integrity Layer: unchanged
- Advocate/Auditor framework: unchanged
- Narrative Claims system: unchanged (Agent 5 consumed secondary claims but was the only consumer removed — Agent 4 still anchors to primary claim, Agent 6 still stress-tests all claims)

---

## [v2.8] — 2026-03-28

### Added
- **Agent 6 boundary discipline** — Formalized the separation between core interview preparation and external context enrichment introduced in v2.7 as an explicit document-level requirement. Interview guide must always be delivered as .docx, never as in-chat text only.
- **Companion Context Skill documentation** — README expanded with full guidance on building a personal context skill: what to include, how to set it up, how it interacts with the Source Integrity Layer and Advocate/Auditor framework.
- **Persistent Memory Integration** — README subsection covering OpenBrain and similar tools for real-time interview context enrichment.

---

## [v2.7] — 2026-03-13

### Added
- **Agent 6 boundary discipline** — Core interview preparation and external context enrichment are now explicitly separated. Core sections (Strategy Overview, Strongest Talking Points, Narrative Stress Test, Anticipated Questions, Behavioral Prep, Landmines, Closing Statement) are always generated from JD + resume + Agent 3 analysis only, with no external context embedded. When external enrichment is available (e.g., from OpenBrain or a persistent memory layer), it is appended in a clearly labeled `EXTERNAL CONTEXT` section at the end of the document. External context is additive and optional — never structural.

### Design rationale
- In v2.6 testing, OpenBrain-derived context (phone screen status, recruiter names, prior screening reactions, interview stage notes) was being embedded directly into core guide sections, making those sections appear to be native skill output rather than personal enrichment. For public users without external memory, those sections would simply be absent with no structural gap — but the mixing of generic and enriched content in the same sections violated the universal usability requirement and could confuse users about what the skill itself produced vs. what came from their personal context.
- The fix preserves the full enrichment capability while making the boundary explicit in both the skill instructions and the document output.

### Architecture confirmation (from external review)
- Primary objective (Agent 3 → Agent 6 narrative alignment): Achieved
- Honesty model: Preserved
- Optional OpenBrain enrichment pattern: Working correctly
- Boundary discipline: Resolved in this version
- Universal usability requirement: Maintained

---

## [v2.6] — 2026-03-13

### Added
- **Agent 6 .docx output** — Interview Prep Guide is now always generated as a downloadable Word document and presented via `present_files` alongside the cover letter and resume. In-chat text delivery alone is no longer acceptable. Filename follows the same sanitization convention as Agents 4 and 5: `InterviewGuide_[Company]_[Role].docx`.
- **Skill overview table** — New "What This Skill Produces" section documents all four outputs (3 docx files + in-chat analysis) with agent attribution, making the full output contract explicit.
- **Trigger guidance** — New "When to Trigger This Skill" section documents positive trigger conditions and explicit non-triggers to reduce false-positive skill activation on general career advice or resume reviews without a JD.
- **Two Inputs Required section** — Moved input requirements to a prominent top-level section immediately after the overview for clarity.

### Fixed
- Agent 6 was producing interview prep as in-chat text only, with no downloadable document. This left the output set incomplete relative to Agents 4 and 5.

---

## [v2.5] — 2026-03-13

### Added
- **Agent 3 Narrative Claims block** — Agent 3 now produces a structured `NARRATIVE CLAIMS FOR DOWNSTREAM AGENTS` section as section 7 of its output. Always user-visible. Contains: primary positioning claim, secondary positioning claims, and claims most likely to face interviewer scrutiny. Block is grounded enforcement: no new claims may appear here that are not already supported by the Alignment Map or Advocate's Case.
- **Agent 6 Narrative Stress Test** — New section inserted between Strongest Talking Points and Anticipated Technical Questions. For each claim in the Agent 3 Narrative Claims block, Agent 6 produces: narrative claim, evidence signals, likely interview questions, suggested preparation areas, and potential interviewer challenge. Ensures the written narrative and the interview preparation are explicitly aligned rather than running parallel.
- **Agent 6 Self-Audit completeness check** — Self-Audit Pass now includes a fourth test: confirms every primary and secondary claim from the Agent 3 Narrative Claims block has a corresponding Narrative Stress Test entry before the guide is presented.
- **Agent 4 primary claim anchor** — Cover Letter Writer now explicitly directed to anchor its opening paragraph to the primary positioning claim from the Agent 3 Narrative Claims block.
- **Agent 5 secondary claims directive** — Resume Optimizer now explicitly directed to use secondary positioning claims from the Agent 3 Narrative Claims block to determine which resume bullets to elevate, expand, or lead with.

### Design rationale
- Previous versions could produce a polished written narrative (cover letter + resume) and interview prep that ran parallel to it rather than through it. A candidate could optimize their written story without being prepared to defend that story in the room. v2.5 closes that gap by making the positioning logic explicit, structured, and consumed by all three Phase 2 agents.
- The Narrative Claims block design merges two originally proposed fields ("claims that require interview proof" and "potential interviewer challenge areas") into a single "claims most likely to face interviewer scrutiny" field, eliminating overlap.
- All changes remain candidate-agnostic. No user-specific content embedded in the skill.

---

## [v2.4] — 2026-03-11

### Added
- **Output filename sanitization rule** — All output filenames now follow PipelinePilot's sanitization convention: spaces removed, commas/periods/special characters stripped, alphanumeric only, underscore as company/role separator.
- **Filename convention updated** — Output files now follow `CoverLetter_[Company]_[Role].docx` / `Resume_[Company]_[Role].docx` / `InterviewGuide_[Company]_[Role].docx` with sanitized components. Sanitization examples included in skill to guide correct behavior.
- **Job title accuracy rule** — Agent 4 now explicitly required to use the exact job title from the JD without paraphrasing or rewording.

### Fixed
- Cover letter filename contained a literal comma when role title included punctuation (e.g., `CoverLetter_Nielsen_Director,ITInfrastructureEngineering.docx`), causing Word title bar corruption and filesystem issues.

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
