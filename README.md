# AI Creative Studio

A Claude skill that turns a brand design system and an idea into on-brand advertising images through Higgsfield. It analyzes the brand, proposes creative directions, generates images, adds exact text and logos, makes edits, and adapts designs to other formats.

## Requirements

- **Higgsfield connector** for image generation. Brand analysis and creative direction work without it.
- **Web access** to read brand sources.
- **Compositing:** the Higgsfield sandbox, which already has what it needs, or local Node with Playwright.

No API keys, local paths or brand details are stored in the skill.

## Install

The repository name differs from the skill name, so set the folder name when you clone.

**Claude Code, personal:**

```bash
git clone https://github.com/Unimark-dev/ai-creative-studio-workspace.git ~/.claude/skills/ai-creative-studio
```

**Claude Code, one project:** run this from the project folder:

```bash
git clone https://github.com/Unimark-dev/ai-creative-studio-workspace.git .claude/skills/ai-creative-studio
```

**Claude apps:** put these files in a folder named `ai-creative-studio`, zip that folder, and upload it where your plan allows custom skills.

Start a new session afterwards. Then say something like "Make an Instagram ad from our brand guide at <URL>", or just mention AI Creative Studio.

## Layout

| Path | Purpose |
|---|---|
| `SKILL.md` | Core behavior and routing |
| `workflows/` | Onboarding, creation, variations, resizing, editing |
| `references/` | Brand profile, creative direction, Higgsfield tool map, compositing, formats, quality check |
| `scripts/compose.js` | Renders exact text and logos at exact pixels |
| `TESTING.md` | What was tested and what was not |

## Maintenance

The Higgsfield catalog changes. The skill checks live model details each session, but the model recommendations and prices in `references/image-generation.md` are a dated snapshot, so review them from time to time.
