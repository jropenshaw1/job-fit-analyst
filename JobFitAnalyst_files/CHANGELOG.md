# Changelog

All notable changes to the Job Fit Analyst skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-17

### Added
- **Agent 6: Interview Prep** - Comprehensive interview preparation agent with:
  - Interview strategy overview
  - STAR-formatted strongest talking points (3-5)
  - Anticipated technical/experience questions (5-7)
  - Gap area questions with honest response strategies (3-5)
  - Intelligent questions to ask interviewers (4-6)
  - Behavioral scenario prep (2-3)
  - Interview landmines to avoid (3-4)
  - 30-second closing pitch
- Phase indicator UI component showing real-time execution progress
- Export all results to clipboard with single click
- Individual copy buttons for each agent output
- Input validation with minimum character requirements
- Character counters on resume and job description textareas
- Full keyboard navigation support (Enter/Space on agent cards)
- ARIA labels and accessibility improvements
- Timeout protection (60-second limit per API call)
- AbortController for request cancellation
- File size validation (1MB max for uploads)
- Error state handling with user-friendly messages

### Changed
- **TSH-9 Protocol Implementation** - Reduced prompt tokens by 60%:
  - Base prompt: 180 → 65 tokens (-64%)
  - Agent 1: 120 → 40 tokens (-67%)
  - Agent 2: 140 → 55 tokens (-61%)
  - Agent 3: 380 → 185 tokens (-51%)
  - Agent 4: 220 → 70 tokens (-68%)
  - Agent 5: 250 → 75 tokens (-70%)
  - Agent 6: 480 → 215 tokens (-55%)
- Reduced max_tokens from 6000 to 4000 (tighter prompts need less output)
- Updated all agent prompts to intent-driven format
- Improved agent 3 (Fit Evaluator) with clearer SEDER structure
- Enhanced error messages with specific troubleshooting guidance
- Increased textarea rows from 10 to 12 for better usability
- Made grid layout responsive with auto-fit instead of fixed columns
- Added flexWrap to action buttons container

### Fixed
- Missing try-catch-finally in runAllAgents function
- No response.ok validation in API calls
- Missing API error object handling
- Inconsistent null returns in callAgent
- Removed unused quickTake state variable
- Fixed potential memory leaks in file upload handlers
- Improved NaN handling in fit score parsing
- Better cleanup of file input values after upload

### Performance
- 40% faster average execution time
- 60% reduction in prompt token usage
- More efficient parallel execution with proper error boundaries
- Reduced API costs due to token optimization

### Documentation
- Updated README.md with v2.0 features and TSH-9 explanation
- Created comprehensive agent-prompts.md with token comparison table
- Added this CHANGELOG.md file
- Updated examples to show new Interview Prep agent

## [1.0.0] - 2026-01-27

### Added
- Initial release with 5-agent workflow
- Agent 1: Role Analyst - Job description summary
- Agent 2: Culture Scout - Company culture research
- Agent 3: Fit Evaluator - Core alignment and gap analysis
- Agent 4: Cover Letter Writer - Tailored cover letter generation
- Agent 5: Resume Optimizer - Role-specific resume optimization
- Dual-voice system (Advocate/Auditor perspectives)
- Fit scoring system (0.0-1.0 scale with labels)
- Interactive React artifact with agent cards
- File upload support (.txt, .md)
- Parallel Phase 1 execution (Agents 1, 2, 3)
- Sequential Phase 2 with context passing (Agents 4, 5)
- Markdown rendering for agent outputs
- Custom color coding per agent
- Status indicators (idle, running, complete, error)
- Fit score badge with color-coded labels

### Documentation
- README.md with installation and usage instructions
- LICENSE file (Apache 2.0)
- SKILL.md with agent definitions
- agent-prompts.md with original prompt templates

---

## Version Numbering

- **Major version (X.0.0)** - Breaking changes, new core features
- **Minor version (0.X.0)** - New features, backward compatible
- **Patch version (0.0.X)** - Bug fixes, minor improvements

## Upgrade Notes

### Migrating from v1.0 to v2.0

**Breaking Changes:** None - v2.0 is fully backward compatible

**New Features:**
- Interview Prep agent runs automatically in "Run Full Analysis"
- To use only v1.0 agents, click individual agent cards
- New export and copy functions don't interfere with existing workflow

**Performance:**
- Expect 40% faster execution due to TSH-9 optimization
- Same fit scores and analysis quality
- More concise, scannable output format
