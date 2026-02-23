# job-fit-analyst
# Job Fit Analyst

Multi-agent Claude skill that honestly evaluates job fit using Advocate/Auditor dual voices.
No sugarcoating — just clear, actionable assessments.

## What it does

Paste a resume and job description, and six specialized agents work together to deliver:

- **Role Analyst** — Summarizes what the job is actually asking for
- **Culture Scout** — Researches company culture via web search
- **Fit Evaluator** — Honest gap analysis with Advocate/Auditor dual perspectives
- **Fit Score** — A 0.0–1.0 score with justification (not inflated to be encouraging)
- **Cover Letter** — Professional .docx, based only on your actual experience
- **Resume Optimizer** — ATS-friendly .docx tailored to the specific role

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

## Free to use

This skill runs entirely within your claude.ai subscription.
No API key, no extra costs, no sign-ups required.

## License

Apache 2.0
