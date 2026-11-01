# Testing record

Tested 2026-11-01 with a fictional product ("NOOR" perfume). Live tests spent 13.5 Higgsfield credits.

## Live tool tests

These were run by hand, following the recipes that became the skill. They were not a single end-to-end conversation driven by the finished skill.

| Capability | Tool | Result |
|---|---|---|
| Text-to-image | `generate_image`, `gpt_image_2_5` | Worked |
| Product reference in a scene | `gpt_image_2_5`, `marketing_studio_image` | Both worked. `gpt_image_2_5` kept the label better; `marketing_studio_image` shrank the product and blurred small text (one comparison) |
| Cutout | `remove_background` | Clean, including on glass |
| Global or background edit by prompt | `gpt_image_2_5` | Good image, but re-rendered the product |
| Mask inpaint | `nano_banana_2` with `is_inpaint` | Good image, but did not preserve the protected area |
| Inpaint plus pasting the product back | `sandbox_exec` | Product region difference fell to 0.84/255 |
| Extend to 9:16 | `outpaint_image` | Worked. 1080 x 1920 requested, 1536 x 2752 returned, so exact size comes from compositing |
| Per-side extend | `flux_2_pro_outpaint` | **Not verified.** The one request was rejected for exceeding the 2560 px canvas limit |
| Portrait to landscape | `gpt_image_2_5` reference | Natural result, but the product is re-rendered |
| Arabic and English text, logo, exact pixels | `scripts/compose.js` in sandbox | Worked at 1080 x 1350, 1080 x 1920 and 1200 x 627. Missing fonts exit with an error |
| Upload from sandbox | `media_upload`, PUT, `media_confirm` | Worked with `If-None-Match: *` |

Product-region difference (0 = identical): prompt edit 7.46, mask inpaint 23.69, inpaint plus paste-back 0.84. Small output size differences inflate the mask figure, so treat the first two as indicative.

## Behavior tests

Independent agents ran each case with and without the skill. They could only plan and check costs. Grading was done by the skill's author, not blind, with one run per configuration, so read the numbers as a rough signal.

| Case | With skill | Without skill |
|---|---|---|
| Onboarding from a real design system | 4/5 | 4/5 |
| Inaccessible brand URL | 3/4 | 3/4 |
| Bilingual product directions | 7/7 | 6/7 |
| Format adaptation and brand switch | 8/8 | 6/8 |
| **Total** | **22/24 (89% mean)** | **19/24 (79% mean)** |

The baseline was strong, and also put text on after generation and handled the bad URL honestly. The skill's measured gain is mostly in format method, logo handling and version tracking. It used about 12% more tokens.

After this round, two fixes were made to onboarding. The two affected cases were re-run with the skill only. The inaccessible URL case then scored 4/4, as the reply stopped and asked for a source. The onboarding case asked one question, but a rights check rather than format, which is intended for a government identity. Its case was not re-graded formally, and the other two cases were not re-run.

## Studio page

The full click-through (brand analysis, directions, copy, cost check, generation, extending and recomposing formats, background edit with product restore, font failure keeping the paid image) passed in a local browser, against simulated Higgsfield, Claude and storage calls. The brand reader ran for real against a public site. The compositor ran for real in the earlier tests. Reply shapes for media import, media listing and sandbox errors were checked with real calls.

Real brand files (woff2 fonts and SVG logos) rendered correctly through the compositor's page in a local browser. Claude links are refused at once with guidance, since the page cannot open them; a design system saved in Claude is imported from chat instead.

Not tested: the chat import following its written steps in a new session, live arrival of imported projects on an open page, the published page making real calls, permission prompts, saving to the page's real storage, and direct upload from a device. That upload route may not work, so the page falls back to an image link or the user's Higgsfield uploads.

## Requirement coverage

| Requirement | Evidence |
|---|---|
| Brand onboarding, Brand DNA | Behavior tests on a real public source |
| Creative directions, three variations | Behavior tests (written); visual previews not generated |
| Image generation, product reference | Live |
| Image editing | Live |
| Format adaptation | Live, for 9:16 and 1.91:1. 2.4:1 banner and custom sizes are by the same method but not run |
| Switching brand projects | Behavior test in planning only, with no images made for a second brand |

## Not tested

- A full multi-turn user conversation with the finished skill, including real image generation
- Real customer photos, real logo files, or supplied licensed font files
- Reading a brand from a claude.ai artifact, PDF or Figma link
- Models listed as "not tested" in `references/image-generation.md`
- Whether the skill triggers reliably from its description (optimizer not run)
- Installation on another user's machine
