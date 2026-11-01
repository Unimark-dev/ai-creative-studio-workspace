# AI Creative Studio

A Claude skill that turns a brand design system and an idea into on-brand advertising images through Higgsfield. It analyzes the brand, proposes creative directions, generates images, adds exact text and logos, makes edits, and adapts designs to other formats.

## Requirements

- **Higgsfield connector** for image generation. Brand analysis and creative direction work without it.
- **Web access** to read brand sources.
- **Compositing:** the Higgsfield sandbox, which already has what it needs, or local Node with Playwright.

No API keys, local paths or brand details are stored in the skill.

## Install

**Claude Code, personal:** copy this folder to `~/.claude/skills/ai-creative-studio/`.

**Claude Code, one project:** copy it to `.claude/skills/ai-creative-studio/` in the project.

**Claude apps:** upload `ai-creative-studio.skill` where your plan allows custom skills.

Start a new session afterwards. Then say something like "Make an Instagram ad from our brand guide at <URL>", or just mention AI Creative Studio.

## Layout

| Path | Purpose |
|---|---|
| `SKILL.md` | Core behavior and routing |
| `workflows/` | Onboarding, creation, variations, resizing, editing |
| `references/` | Brand profile, creative direction, Higgsfield tool map, compositing, formats, quality check |
| `scripts/compose.js` | Renders exact text and logos at exact pixels |
| `evals/` | Test cases (not included in the packaged `.skill`) |
| `TESTING.md` | What was tested and what was not |

## Maintenance

The Higgsfield catalog changes. The skill checks live model details each session, but the model recommendations and prices in `references/image-generation.md` are a dated snapshot, so review them from time to time.
