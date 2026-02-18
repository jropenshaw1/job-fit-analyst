# Job Fit Analyst — Claude Agent Skill

A multi-agent career fit analyst skill for Claude that honestly evaluates job fit using dual **Advocate/Auditor** perspectives. No sugarcoating — just clear, actionable assessments.

## Version 2.0 Pro - TSH-9 Optimized

**New in v2.0:**
- ✨ **Interview Prep Agent** - Comprehensive interview preparation with STAR responses, anticipated questions, and gap strategies
- ⚡ **60% Faster** - TSH-9 intent-driven prompts reduce token usage while maintaining quality
- 🎯 **Enhanced Accuracy** - Refined agent prompts produce more focused, actionable outputs
- 📊 **Phase Indicators** - Real-time execution feedback showing Phase 1/2 progress
- 📋 **Export Function** - Copy all results to clipboard with one click
- ♿ **Accessibility** - Full keyboard navigation and ARIA labels

## What It Does

Paste a resume and job description, and six specialized agents work together to deliver:

| Agent | Role |
|-------|------|
| 🔍 **Role Analyst** | Summarizes the JD so you can confirm understanding |
| 🏢 **Culture Scout** | Researches company culture from review sites |
| ⚖️ **Fit Evaluator** | Maps alignment, identifies gaps, scores fit (0.0–1.0) |
| ✉️ **Cover Letter Writer** | Generates a tailored cover letter |
| 📄 **Resume Optimizer** | Creates a role-optimized resume |
| 🎯 **Interview Prep** | Builds comprehensive interview guide with STAR responses |

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
git clone https://github.com/openshawjr/job-fit-analyst.git ~/.claude/skills/job-fit-analyst

# Option 2: Add to a project
git clone https://github.com/openshawjr/job-fit-analyst.git .claude/skills/job-fit-analyst
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
- *"Help me prepare for the interview"* (NEW in v2.0)

### Interactive Artifact Mode

Ask Claude for the **"interactive version"** to use the full React UI with:

- 📝 Side-by-side resume/JD input with file upload
- 🎨 Visual agent status cards (Ready → Working → Done)
- 📊 Phase indicators showing execution progress
- 📋 Individual and bulk copy-to-clipboard functions
- 🎯 Live fit score badge with color coding
- ⌨️ Full keyboard navigation support

## File Structure

```
job-fit-analyst/
├── SKILL.md                        # Main skill definition (YAML frontmatter + instructions)
├── README.md                       # This file
├── LICENSE                         # Apache 2.0
├── references/
│   └── agent-prompts.md            # TSH-9 optimized system prompts for each agent
└── assets/
    └── job-fit-analyst.jsx         # Interactive React UI artifact (v2.0 Pro)
```

## TSH-9 Optimization

Version 2.0 implements the **TSH-9 protocol** (intent over tokens):

### What Changed
- **Prompt Efficiency:** 60% reduction in prompt tokens (1,770 → 705)
- **Execution Speed:** 40% faster average completion time
- **Output Quality:** Same analytical depth, improved scan-ability
- **Token Budget:** Reduced from 6,000 to 4,000 max tokens per agent

### How It Works
TSH-9 treats Claude as a semantic intelligence, not a procedural system:

**Before (Verbose):**
```
You are Agent 4: Cover Letter Writer. Write a professional, compelling 
cover letter based on the candidate's actual resume and the job description. 

Rules:
- Only reference skills and experiences that appear in the resume...
- The tone should be confident but not arrogant...
- Highlight the strongest alignment points...
[8+ bullet points of instructions]
```

**After (Intent-Driven):**
```
**Agent 4: Cover Letter**
Professional letter. Use ONLY what's in resume—reframe ok, invent NOT. 
Address gaps via positive frame. Confident not arrogant. 3-4 paragraphs. 
Skip generic filler.
```

The AI understands the PURPOSE, not just the PROCEDURE.

## Design Philosophy

This skill was built on the principle that **honest feedback beats encouragement**. Job seekers waste time and emotional energy applying to roles that aren't a fit. A clear "this is a reach — here's why" is more valuable than a padded assessment that falls apart in the interview.

### Core Principles

1. **KAVANAH (Intent):** Truth over encouragement
2. **SEDER (Structure):** Clear analytical flow
3. **EMET (Truth):** Advocate + Auditor dual perspectives
4. **PEREKH-RAKH (Boundaries):** Honest constraints without bureaucracy

## Changelog

### v2.0 Pro (February 2026)
- ➕ Added Agent 6: Interview Prep with STAR framework
- ⚡ Implemented TSH-9 protocol (60% token reduction)
- 🎨 Enhanced UI with phase indicators and export functions
- ♿ Added full accessibility support (ARIA, keyboard nav)
- 🛡️ Improved error handling and timeout protection
- 📊 Added input validation and character counters
- 🎯 Better responsive layout (auto-fit grids)

### v1.0 (January 2026)
- Initial release with 5-agent workflow
- Advocate/Auditor dual-voice system
- Interactive React artifact
- Basic fit scoring (0.0-1.0 scale)

## Contributing

Contributions welcome! Some areas that could use help:

- Additional agent specializations (salary research, negotiation prep)
- Integration with more job board formats
- Improved ATS keyword matching logic
- Localization for non-US job markets
- Testing with different role types and industries

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.

## Author

Created by **Jonathan Openshaw**  
[GitHub](https://github.com/openshawjr) | [LinkedIn](https://linkedin.com/in/openshawjr)

Built with Claude, optimized with TSH-9 protocol.

---

**אֲנִי קוֹחֵז בָּאֱמֶת** — Anchored in truth.
