# Job Fit Analyst

Multi-agent Claude skill that honestly evaluates job fit using Advocate/Auditor dual voices.
No sugarcoating -- just clear, actionable assessments.

## What it does

Paste a resume and job description, and six specialized agents work together to deliver:

- **Role Analyst** -- Summarizes what the job is actually asking for
- **Culture Scout** -- Researches company culture via web search
- **Fit Evaluator** -- Honest gap analysis with Advocate/Auditor dual perspectives
- **Fit Score** -- A 0.0-1.0 score with justification (not inflated to be encouraging)
- **Cover Letter** -- Professional .docx, based only on your actual experience
- **Resume Optimizer** -- ATS-friendly .docx tailored to the specific role, with a mandatory source integrity pass before generation
- **Interview Prep** -- Personalized coaching guide with anticipated questions, talking points, gap strategies, and landmines to avoid

## Design Philosophy

Every output -- analysis, cover letter, optimized resume, interview prep -- must be traceable to something you actually did. The job description is a target, not a script. Reframing your experience for a role is fair. Inventing experience you don't have is not.

The Cover Letter, Resume Optimizer, and Interview Prep agents each perform a mandatory self-audit before generating any output. Content that can't be traced directly to your source resume is rewritten or removed -- no flags, no annotations, no residue.

## Installation

```bash
git clone https://github.com/jropenshaw1/job-fit-analyst.git ~/.claude/skills/job-fit-analyst
```

Copy the `job-fit-analyst` folder into your Claude skills directory.

## Usage

Once installed, just talk to Claude naturally:

- "Is this role a good fit for me?" (paste resume + job description)
- "Write me a cover letter for this job"
- "Give me the Auditor's honest take"
- "Quick take on this role"
- "Prep me for the interview"

## Free to use

This skill runs entirely within your claude.ai subscription.
No API key, no extra costs, no sign-ups required.

## Changelog

### v2.3
- Added mandatory Self-Audit Pass to Interview Prep (Agent 6) -- claim-by-claim integrity check before the guide is presented, covering all strategy recommendations, talking points, STAR outlines, and closing statements
- Added Inference Trap rule: general resume concepts (e.g., led a cloud migration) do not license specific technical claims (e.g., AWS IAM governance, user provisioning automation)

### v2.2
- Added mandatory Self-Audit Pass to Cover Letter Writer (Agent 4) -- claim-by-claim integrity check before document generation, with a high-risk fabrication target list covering compliance frameworks, certifications, metrics, JD-only technologies, and seniority descriptors

### v2.1
- Added Source Integrity Layer governing all six agents -- every output must be traceable to the source resume before it leaves an agent
- Added mandatory self-audit pass to Resume Optimizer (Agent 5) -- ungrounded bullets are silently removed before document generation

### v2.0
- Added Agent 6: Interview Prep -- personalized coaching guide with anticipated questions, talking points, gap strategies, and landmines to avoid
- Added Quick Take Mode -- fit score and two-sentence summary for rapid role screening
- Added "How it works" phase documentation

### v1.0
- Initial five-agent release with Advocate/Auditor dual-voice framework
- Phase 1 / Phase 2 parallel execution
- Fit score (0.0-1.0) with mandatory justification
- .docx output for cover letter and optimized resume

## License

MIT
