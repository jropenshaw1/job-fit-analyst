# Job Fit Analyst

**A multi-agent Claude skill that builds your complete job application package — honestly.**

Six specialized agents work together to evaluate your fit, write your cover letter, optimize your resume, and prepare you for the interview. Every output is grounded in what you actually did. No invented experience. No inflated claims. No content that falls apart when a hiring manager pushes back.

Available free under MIT license. Runs entirely within your Claude subscription — no API key, no extra costs, no sign-ups.

---

## What It Produces

A full run generates three downloadable Word documents plus a detailed in-chat analysis:

| Output | Format | What It Does |
|--------|--------|--------------|
| Fit Analysis | In-chat | Dual-voice Advocate/Auditor assessment with fit score, gap map, and Narrative Claims block for downstream agents |
| Cover Letter | .docx | Professional letter anchored to your primary positioning claim, grounded in your resume |
| Optimized Resume | .docx | ATS-friendly version tailored to the specific JD, with secondary claims driving bullet emphasis |
| Interview Prep Guide | .docx | Full coaching guide with Narrative Stress Test, anticipated questions, gap strategies, behavioral prep, and landmines |

---

## How It Works

The skill runs in two phases:

**Phase 1 — Analysis (parallel)**
- **Agent 1: Role Analyst** — Summarizes what the JD is actually asking for before any fit judgment is made
- **Agent 2: Culture Scout** — Researches the company via web search (Glassdoor, Blind, careers page) and surfaces what employees say, not just what the company says
- **Agent 3: Fit Evaluator** — Core analysis: Alignment Map, Gap Map, Advocate's Case, Auditor's Check, Fit Score (0.00–1.00), and a structured **Narrative Claims block** that becomes the handoff to Phase 2

**Phase 2 — Output Generation (parallel, using Phase 1 context)**
- **Agent 4: Cover Letter Writer** — Opens with your primary positioning claim; self-audits every metric, credential, and technology claim before generating the document
- **Agent 5: Resume Optimizer** — Uses secondary positioning claims to determine which bullets to elevate; self-audits every bullet against the source resume before generating the document
- **Agent 6: Interview Prep Guide** — Runs a **Narrative Stress Test** against each positioning claim, generates anticipated questions for both strengths and gaps, builds behavioral prep and a closing statement; self-audits for grounding and claim completeness before generating the document

---

## The Narrative Claims System (v2.5+)

The biggest structural improvement in recent versions is the **Narrative Claims handoff block** — a structured output from Agent 3 that all three Phase 2 agents consume explicitly.

Agent 3 produces:
- A **primary positioning claim** — the single sentence that defines why you belong in this role
- **Secondary positioning claims** — the 2–3 supporting arguments
- **Claims most likely to face interviewer scrutiny** — where a rigorous hiring manager will push back

Phase 2 agents use this block deliberately:
- Agent 4 anchors the cover letter's opening paragraph to the primary claim
- Agent 5 elevates the resume bullets that support the secondary claims
- Agent 6 stress-tests every claim with evidence signals, likely interview questions, preparation areas, and the specific challenge a skeptical interviewer would raise

The result: your written materials and your interview preparation tell the same story — because they're explicitly built from the same positioning logic.

---

## The Honesty Model

Every agent in the pipeline follows a **Source Integrity Layer** — a set of rules that govern what can and cannot appear in any output:

- Every claim must be traceable to a specific line in your source resume
- Scope and seniority cannot be inflated beyond what your resume documents
- JD keywords can be used where they genuinely apply; they cannot be used to imply experience you haven't claimed
- Reframing your experience for relevance is encouraged. Inventing experience is not.

Each Phase 2 agent performs a mandatory **Self-Audit Pass** before generating any document:
- Agent 4 checks every metric, credential, named technology, and compliance framework in the cover letter
- Agent 5 checks every bullet in the optimized resume — ungrounded bullets are removed silently, not flagged
- Agent 6 checks every talking point, STAR outline, and strategy recommendation, plus a completeness check confirming every Narrative Claim has a corresponding Stress Test entry

The **Inference Trap rule** prevents a specific failure pattern: if your resume says you led a cloud migration, the skill may not infer that you have experience with AWS IAM governance, user provisioning automation, or any other specific sub-discipline not named in the resume. General concepts do not license specific technical claims.

---

## The Two Voices

The Fit Evaluator holds two perspectives simultaneously and labels them clearly:

- **Advocate** 💚 — Finds the best honest case for your candidacy. Identifies transferable skills, surfaces non-obvious angles, reframes experience in its most relevant light. Not sugarcoating — genuine strengths.
- **Auditor** 🔴 — Tells the hard truth. Where you're underqualified. Where the gap is real. Where you'd be stretching credibility. No softening "this is a reach" into "you could potentially..."

When they disagree, the skill says so explicitly. The user sees both sides and makes their own call.

---

## Fit Score

Scores run from 0.00 to 1.00 in 0.05 increments only (never 0.67 or 0.83 — precision implies false accuracy). Every score is justified with specifics.

| Score | Meaning |
|-------|---------|
| 0.0–0.3 | Significant gaps. Long shot. |
| 0.4–0.6 | Partial fit. Gaps exist but may be addressable. |
| 0.7–0.8 | Strong fit. Minor gaps or growth areas. |
| 0.9–1.0 | Near-perfect alignment. (Be suspicious — recheck.) |

---

## Usage Examples

Once installed, trigger naturally with any of the following:

**Full analysis:**
> "Is this a good fit for me?" *(paste or upload resume + job description)*

**Cover letter only:**
> "Write me a cover letter for this job"

**Quick screening:**
> "Quick take" *(returns fit score + 2-sentence summary only)*

**Honest assessment:**
> "Give me the Auditor's honest take on this role"

**Interview prep only:**
> "Prep me for the interview"

**Culture research:**
> "What's the culture like at [company]?"

---

## Inputs Required

Both are required. The skill will not run without them.

1. **Job Description** — paste text or upload file
2. **Resume** — paste text or upload file

---

## Installation

```bash
git clone https://github.com/jropenshaw1/job-fit-analyst.git
```

Copy the `job-fit-analyst` folder into your Claude skills directory (typically `~/.claude/skills/`).

---

## Optional Enrichment

The skill is fully functional with just a resume and JD. However, if you maintain a persistent memory layer (such as OpenBrain or a similar tool), the Interview Prep agent can incorporate real context — active application status, recruiter screening notes, what resonated in prior conversations, hiring manager intelligence — without any changes to the skill itself. That enrichment stays outside the core skill and is never required for it to function.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

**Current version: v2.7**

### v2.7
- Agent 6 boundary discipline: core interview preparation (always generic, always generated) is now explicitly separated from external context enrichment (OpenBrain, memory layers, prior session notes). External context is appended in a clearly labeled `EXTERNAL CONTEXT` section at the end of the document when available — never embedded into core sections. Preserves universal usability while enabling full personalization.

### v2.6
- Agent 6 now generates a mandatory .docx interview guide, presented alongside the cover letter and resume via `present_files`
- Added skill overview table documenting all four outputs with agent attribution
- Added explicit trigger guidance and non-trigger conditions

### v2.5
- Added Narrative Claims handoff block to Agent 3 (section 7): primary claim, secondary claims, claims most likely to face scrutiny — always user-visible, always required
- Added Narrative Stress Test to Agent 6: structured stress-test entry for every positioning claim, inserted between Strongest Talking Points and Anticipated Technical Questions
- Added Agent 6 Self-Audit completeness check: confirms every claim has a corresponding Stress Test entry
- Agent 4 now anchors cover letter opening to primary positioning claim
- Agent 5 now uses secondary claims to drive bullet elevation decisions

### v2.4
- Output filename sanitization — filesystem-safe naming convention for all generated documents
- Job title accuracy rule — exact JD title used in all outputs, no paraphrasing

### v2.3
- Agent 6 Self-Audit Pass — claim-by-claim integrity check for all interview prep content
- Inference Trap rule — general resume concepts do not license specific technical claims

### v2.2
- Agent 4 Self-Audit Pass — claim-by-claim integrity check for cover letter, with high-risk fabrication target list

### v2.1
- Source Integrity Layer added — governs all six agents
- Agent 5 Self-Audit Pass — ungrounded resume bullets removed silently before document generation

### v2.0
- Agent 6 added: Interview Prep
- Quick Take Mode added

### v1.0
- Initial five-agent release: Role Analyst, Culture Scout, Fit Evaluator, Cover Letter Writer, Resume Optimizer
- Advocate/Auditor dual-voice framework
- Phase 1 / Phase 2 parallel execution
- Fit Score (0.0–1.0) with mandatory justification
- .docx output for cover letter and optimized resume

---

## License

MIT — free to use, fork, and build on.
