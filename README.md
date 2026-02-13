# Job Fit Analyst — Claude Agent Skill

A multi-agent career fit analyst skill for Claude that honestly evaluates job fit using dual **Advocate/Auditor** perspectives. No sugarcoating — just clear, actionable assessments.

## What It Does

Paste a resume and job description, and five specialized agents work together to deliver:

| Agent | Role |
|-------|------|
| 🔍 **Role Analyst** | Summarizes the JD so you can confirm understanding |
| 🏢 **Culture Scout** | Researches company culture from review sites |
| ⚖️ **Fit Evaluator** | Maps alignment, identifies gaps, scores fit (0.0–1.0) |
| ✉️ **Cover Letter Writer** | Generates a tailored cover letter (.docx) |
| 📄 **Resume Optimizer** | Creates a role-optimized resume (.docx) |

### The Dual Voice System

Every analysis carries two clearly labeled perspectives:

- **Advocate** 💚 — Finds the best *honest* case. Highlights transferable skills, reframes positively, spots angles you might miss.
- **Auditor** 🔴 — Tells the hard truth. Where you're underqualified, where the gap is real, where you'd be stretching credibility.

When they disagree, both sides are shown so you can make your own call.

### Fit Score Scale

| Score | Meaning |
|-------|---------|
| 0.0–0.3 | Significant gaps — long shot |
| 0.4–0.6 | Partial fit — gaps may be addressable |
| 0.7–0.8 | Strong fit — minor growth areas |
| 0.9–1.0 | Near-perfect alignment (triggers automatic recheck) |

## Installation

### Claude.ai (Web/Mobile)

Upload the `.skill` file from the [Releases](../../releases) page, or upload the `job-fit-analyst` folder as a custom skill in your Claude settings.

### Claude Code

```bash
# Option 1: Clone to personal skills directory
git clone https://github.com/YOUR_USERNAME/job-fit-analyst.git ~/.claude/skills/job-fit-analyst

# Option 2: Add to a project
git clone https://github.com/YOUR_USERNAME/job-fit-analyst.git .claude/skills/job-fit-analyst
```

### Manual Installation

Copy the `job-fit-analyst` folder (containing `SKILL.md`, `references/`, and `assets/`) into your skills directory:

- **Personal**: `~/.claude/skills/`
- **Project**: `.claude/skills/`

## Usage

Once installed, Claude automatically detects when the skill is relevant. Just say things like:

- *"Is this role a good fit for me?"* (paste resume + JD)
- *"Analyze this job posting against my resume"*
- *"Quick take on this role"* (abbreviated scoring only)
- *"Just write me a cover letter for this position"*
- *"What's the culture like at [company]?"*

### Quick Take Mode

Say **"quick take"** to skip the full analysis and get just the fit score with a 2-sentence summary.

## File Structure

```
job-fit-analyst/
├── SKILL.md                        # Main skill definition (YAML frontmatter + instructions)
├── README.md                       # This file
├── LICENSE                         # Apache 2.0
├── references/
│   └── agent-prompts.md            # System prompts for each agent
└── assets/
    └── job-fit-analyst.jsx         # Interactive React UI artifact
```

## Interactive UI

The skill includes a React artifact (`assets/job-fit-analyst.jsx`) that provides a visual multi-agent interface with:

- Side-by-side resume/JD input areas
- Agent status cards (Ready → Working → Done)
- Parallel Phase 1 execution with sequential Phase 2
- Rendered markdown output per agent
- Color-coded fit score badge

Ask Claude for the *"interactive version"* to use this UI.

## Design Philosophy

This skill was built on the principle that **honest feedback beats encouragement**. Job seekers waste time and emotional energy applying to roles that aren't a fit. A clear "this is a reach — here's why" is more valuable than a padded assessment that falls apart in the interview.

## Contributing

Contributions welcome! Some areas that could use help:

- Additional agent specializations (salary research, interview prep)
- Integration with more job board formats
- Improved ATS keyword matching logic
- Localization for non-US job markets

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
