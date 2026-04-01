# Job Fit Analyst — Mythos Readiness Audit

**Audit date:** April 1, 2026  
**Skill version audited:** v2.8  
**Auditor:** Claude (Anthropic) with Jonathan Openshaw  
**Trigger:** Pre-release audit ahead of Claude Mythos (new capability tier above Opus)  
**Methodology:** Nate's Newsletter Prompt 1 — Compensating Complexity Audit framework

---

## Summary Dashboard

| Category | Count | % of total |
|---|---|---|
| Outcome logic | 28 | 34% |
| Constraint / guardrail | 19 | 23% |
| Procedural scaffolding | 13 | 16% |
| Compensating complexity | 22 | 27% |
| **Total components** | **82** | **100%** |

**Compensating complexity ratio: 27%**  
**Non-outcome content (scaffolding + compensating): 43%**

---

## Immutable Constraints

The following components are locked regardless of any future model capability improvements. They are not compensating complexity -- they define the product's value and user guarantee.

- **Source Integrity Layer** (three-test framework: Traceability, Scope integrity, Language ownership)
- **Advocate/Auditor dual-voice mechanism**
- **All Honesty Rules** (direct rejection language, no score inflation, no fabrication)
- **Narrative Claims handoff block** (Agent 3 Section 7 -- genuine orchestration, not scaffolding)
- **Core vs. enrichment boundary discipline** (Agent 6)
- **ATS-friendly output requirement**
- **Contact information sourced from resume only**

---

## Component-by-Component Audit

### Overview

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Career fit analyst purpose statement | Outcome logic | Defines what the system achieves | KEEP |
| Operate six specialized agents | Procedural scaffolding | Prescribes agent count; Mythos may self-organize | TEST |
| Hold two perspectives simultaneously | Outcome logic | Core value proposition and differentiator | KEEP |

### Outputs

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Four-output delivery table | Outcome logic | Defines the deliverable spec | KEEP |
| Generated using docx-js | Procedural scaffolding | Technical implementation requirement | KEEP |

### Inputs

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Do not proceed until both inputs are present | Compensating complexity | Added because model would attempt to run with one input and hallucinate the other | TEST |

### Source Integrity Layer

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Every output grounded in what candidate actually did | Constraint | Fundamental to the system's value | KEEP |
| Three tests: Traceability, Scope integrity, Language ownership | Constraint | Operationalized form of the constraint -- not compensating | KEEP |
| What reframing means and doesn't mean | Constraint | Draws a precise line; boundary is genuinely subtle | KEEP |
| When uncertain, drop it | Constraint | Default posture under uncertainty | KEEP |
| Read this section before executing any phase | Compensating complexity | Added because model would skip the integrity preamble | TEST |

### Two Voices

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Advocate definition and scope | Outcome logic | Defines one of the two core outputs | KEEP |
| Auditor definition and scope | Outcome logic | Defines the second core output | KEEP |
| When voices disagree, say so explicitly -- no blending | Constraint | Prevents diplomatic averaging of the two voices | KEEP |

### Honesty Rules

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Say so directly if someone isn't a fit | Constraint | Behavior standard -- no softening rejection | KEEP |
| Say "I'm uncertain" rather than guessing confidently | Constraint | Epistemic standard | KEEP |
| Never inflate a score to be encouraging | Constraint | Core honesty guarantee | KEEP |
| Don't fabricate company or experience details | Constraint | Safety rule -- fabricated details create candidate risk | KEEP |
| Don't assume resume covers everything | Constraint | Appropriate epistemic humility | KEEP |

### Fit Score

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Four-tier scale (0.0-1.0 with band meanings) | Constraint | Defines shared scoring vocabulary | KEEP |
| 0.05 increments only (no 0.67 or 0.83) | Compensating complexity | Added after model returned overly precise decimals | TEST |
| "Be suspicious if you score 0.9-1.0 -- recheck" | Compensating complexity | Added because model was inflating scores toward the top | TEST |

### Agent Structure

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Phase 1 / Phase 2 explicit parallel execution | Procedural scaffolding | Prescribes run order; earlier models ran sequentially | TEST |

### Agent 1

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Summarize JD in 2-3 sentences for user confirmation | Outcome logic | User-facing checkpoint before fit analysis | KEEP |
| Do NOT analyze fit -- just summarize | Compensating complexity | Added because model jumped directly to scoring | TEST |

### Agent 2

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Six-section culture research structure | Procedural scaffolding | Prescribes output format | TEST |
| Use web search to check Glassdoor, Indeed, Blind | Procedural scaffolding | Tells model which sites to use; Mythos should know this | TEST |
| If web search unavailable, use training knowledge but note it | Compensating complexity | Added after model silently used stale data without disclosure | TEST |

### Agent 3

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| "Provide ALL of these sections" | Compensating complexity | Added because model would omit sections under token pressure | TEST |
| Alignment Map with specific cite requirement | Outcome logic | Defines a required output | KEEP |
| Gap Map with Minor/Moderate/Significant severity | Outcome logic | Defines a required output with grading system | KEEP |
| Advocate's Case section | Outcome logic | One of the two core voices | KEEP |
| Auditor's Check section | Outcome logic | Second core voice | KEEP |
| Fit Score with justification requirement | Outcome logic | Primary deliverable of Agent 3 | KEEP |
| Next Steps section | Outcome logic | Action-oriented output | KEEP |
| Narrative Claims handoff block | Outcome logic | Genuine orchestration -- structured handoff to Agents 4/5/6 | KEEP |
| "Every claim will be stress-tested by Agent 6" reminder | Procedural scaffolding | Forward pointer; capable model should know from context | TEST |

### Agent 4

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Only reference skills from resume, reframing OK, inventing not OK | Constraint | Source Integrity applied to cover letter | KEEP |
| ~1 page, 3-4 paragraphs length guidance | Procedural scaffolding | Format constraint; Mythos may size appropriately from context | TEST |
| No generic filler like "I am excited to apply" | Compensating complexity | Added after model consistently opened with boilerplate | TEST |
| Professional letter format: Date, Greeting, Body, Closing | Procedural scaffolding | Basic structure instruction; Mythos knows letter format | TEST |
| Contact info: use candidate's details as found in resume | Constraint | Prevents inventing or hardcoding contact details | KEEP |
| One salutation only -- never two greeting lines | Compensating complexity | Added after model generated duplicate "Dear [Name]" lines | TEST |
| One closing only -- never repeat closing block | Compensating complexity | Added after model generated duplicate "Sincerely" blocks | TEST |
| Job title accuracy -- use exact title from JD | Compensating complexity | Added because model paraphrased or shortened job titles | TEST |
| Anchor opening to primary positioning claim | Outcome logic | Genuine orchestration -- connects letter to Agent 3 analysis | KEEP |
| Self-Audit Pass (entire block) | Compensating complexity | Added after model fabricated credentials and borrowed JD language | TEST |
| High-risk fabrication targets list | Compensating complexity | Enumerated after model specifically fabricated compliance claims | TEST |

### Agent 5

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Only use information from original resume | Constraint | Source Integrity at Agent 5 level | KEEP |
| Prioritize and reorder bullets for role relevance | Outcome logic | Defines the core task | KEEP |
| Use JD keywords where genuinely applicable | Constraint | Draws line between alignment and fabrication | KEEP |
| Keep formatting ATS-friendly | Constraint | Non-negotiable output requirement | KEEP |
| Use secondary positioning claims from Agent 3 for bullet elevation | Outcome logic | Genuine orchestration -- connects resume to Agent 3 | KEEP |
| Self-Audit Pass (Agent 5) | Compensating complexity | Added after model added bullets not in source resume | TEST |
| "Do not flag, annotate, or substitute -- remove it" | Compensating complexity | Added after model annotated uncertain bullets instead of removing | TEST |

### Agent 6

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| "Be SPECIFIC. Use actual details from the resume." | Compensating complexity | Added because model gave generic advice | TEST |
| "Structure output EXACTLY as follows" | Procedural scaffolding | Enforces section order; model reorganized or omitted sections | TEST |
| Interview Strategy Overview | Outcome logic | Defines a required output section | KEEP |
| Strongest Talking Points with STAR structure | Outcome logic | Defines a required output | KEEP |
| Narrative Stress Test | Outcome logic | Genuine orchestration -- closes loop with Agent 3 claims | KEEP |
| Ground every Stress Test entry in source resume | Constraint | Source Integrity applied to interview prep | KEEP |
| Do not generate questions for claims not in Agent 3 block | Constraint | Scope boundary preventing hallucinated claims | KEEP |
| Anticipated Questions -- Technical/Experience | Outcome logic | Defines a required output | KEEP |
| Anticipated Questions -- Gap Areas | Outcome logic | Defines a required output tied to Auditor findings | KEEP |
| Questions to Ask section | Outcome logic | Defines a required output | KEEP |
| Behavioral Question Prep | Outcome logic | Defines a required output | KEEP |
| Executive Challenge Questions | Outcome logic | Defines a required output -- elevated from standard behavioral | KEEP |
| Keep Executive Challenge Questions candidate-agnostic | Constraint | Ensures universal utility | KEEP |
| Interview Landmines | Outcome logic | Defines a required output based on Auditor findings | KEEP |
| Closing Statement | Outcome logic | Defines a required output | KEEP |
| Self-Audit Pass (Agent 6 -- largest block) | Compensating complexity | Most elaborate compensating block; added after inference errors | TEST |
| The inference trap paragraph | Compensating complexity | Explicit failure mode example; subtle enough to test last | TEST |
| Stress Test must cover every claim from Agent 3 | Compensating complexity | Added because model produced incomplete Stress Test coverage | TEST |
| Boundary discipline -- core vs. enrichment | Constraint | Keeps personal context from contaminating generic guide | KEEP |
| Document generation requirement (.docx always) | Procedural scaffolding | Technical delivery requirement | KEEP |

### Workflow

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Input Validation section | Compensating complexity | Added because model would proceed without both inputs | TEST |
| Full Analysis 5-step sequence | Procedural scaffolding | Step-by-step procedure; may be replaceable by outcome spec | TEST |
| Quick Take Mode | Outcome logic | Defines an alternate run mode -- application logic | KEEP |
| Individual Agent Run examples | Outcome logic | Defines supported run patterns -- application logic | KEEP |

### User Inputs

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Do not load resume from hardcoded path | Compensating complexity | Added after model accessed a file path from a prior session | TEST |
| Three missing-input message templates | Compensating complexity | Added because model generated inconsistent missing-input messages | TEST |

### Output Files

| Component | Category | Reasoning | Recommendation |
|---|---|---|---|
| Filename sanitization rules | Procedural scaffolding | Technical requirement -- filesystem-safe filenames necessary | KEEP |
| Sanitization examples (Nielsen, AT&T) | Compensating complexity | Added after model produced filenames with illegal characters | TEST |
| Always present files with present_files tool | Procedural scaffolding | Technical delivery requirement | KEEP |

---

## Priority Deletion Tests

All deletion tests are gated on Mythos access. Do not run against current models -- compensating complexity will predictably activate, which tells you nothing about Mythos capability.

### Priority 1 -- Highest value: The three self-audit passes (Agents 4, 5, 6)

These are the largest blocks of compensating complexity in the skill, added after the model fabricated credentials, inflated scope, and borrowed JD language as candidate claims. They account for roughly 30% of the total token footprint across the three agents.

**Test procedure:** Run the full workflow without the self-audit pass blocks. Use 5 JD + resume pairs that include genuine gaps and candidates with no experience in named compliance frameworks. Measure:
- Fabrication rate (credentials, frameworks, team sizes not in resume)
- Scope inflation (seniority or impact claims exceeding resume)
- JD-borrowed attribution (JD language attributed to candidate without resume source)

**Pass condition:** If fabrication rate is near zero across all five pairs, collapse all three self-audit passes into a single constraint statement in the Source Integrity Layer. If fabrication appears in one agent but not others, remove selectively.

### Priority 2 -- High value: Phase 1 / Phase 2 explicit parallel execution instructions

The phase sequencing exists because earlier models ran agents out of order or sequentially, producing Phase 2 outputs without Phase 1 context.

**Test procedure:** Remove the Phase 1/Phase 2 labels and parallel execution instructions. Replace with: "Run Role Analyst, Culture Scout, and Fit Evaluator before producing application documents." Verify that Mythos correctly produces Agent 3's Narrative Claims block before Agents 4, 5, and 6 consume it.

**Pass condition:** Application documents correctly reference fit analysis and positioning claims without explicit sequencing instructions.

### Priority 3 -- Quick win: Micro-format compensating rules

Four rules each added after a specific observed failure: "one salutation only," "one closing only," "0.05 increments only," and "no generic filler."

**Test procedure:** Test each independently across 3-5 runs:
- Cover letters without salutation/closing rules: check for duplicates
- Fit scores without increment rule: check for over-precision (e.g., 0.67, 0.83)
- Cover letters without anti-filler rule: check opening lines for boilerplate

**Pass condition:** Each rule that Mythos honors without instruction can be deleted individually.

---

## What Stays -- Regardless of Mythos Capability

These components survive any model upgrade because they are not about model capability. They are business rules, user guarantees, and ethical commitments:

- Source Integrity Layer (candidate credibility protection)
- Advocate/Auditor dual-voice (the product's core differentiator)
- All Honesty Rules (direct rejection language, no score inflation)
- Narrative Claims handoff block (genuine orchestration architecture)
- ATS-friendly formatting (external system requirement)
- Core vs. enrichment boundary discipline (user data separation)
- Contact information from resume only (prevents fabricated contact details)

---

## Status

| Action | Status |
|---|---|
| Audit complete | Done -- April 1, 2026 |
| Deletion tests | Pending Mythos access |
| SKILL.md changes | None -- no edits without test results |
| LinkedIn post (audit findings) | Drafting |
| LinkedIn post (test results + changes) | Pending Mythos access |

