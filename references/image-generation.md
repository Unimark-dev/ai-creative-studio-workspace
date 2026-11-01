# Image generation with Higgsfield

## Contents
- Discovery
- Tool map
- Choosing a model
- Costs
- Getting media in
- Writing the prompt
- Running and retrieving jobs

## Discovery

Connector tool names carry a server prefix that differs per user, so match on the base name. Other connectors may also expose `generate_image` (Figma does). Identify Higgsfield by its sibling tools: `models_explore`, `outpaint_image` and `jobs_wait`. Tools may need loading through the tool search first.

The catalog changes. Before the first generation in a session, call `models_explore` with `action: "get"` on the model you plan to use, and rely on its live `aspect_ratios`, `parameters` and `medias[].roles` over this file. The model notes below are a dated snapshot.

If Higgsfield is not connected, tell the user it is needed for image generation and how to connect it. Continue with the brand profile, directions and prompts, and do not imply any image was made.

## Tool map

| Need | Tool | Notes |
|---|---|---|
| Find models and constraints | `models_explore` | `list`, `search`, `get`, `recommend` |
| One image | `generate_image` | `count` 2–4 only for variants of the same prompt |
| Several different images | `generate_image_batch` | 1–12 requests, no `get_cost` inside |
| Wait for jobs | `jobs_wait` | Up to 12 jobs, 15 s per call. Returns `result_url`. Follow `poll_after_seconds` |
| Show results | `job_display` / `show_generation_by_ids` | One job / a batch in one call |
| Check balance | `balance` | |
| Web image to media | `media_import_url` | Returns `media_id`. Generation inputs do not accept URLs |
| Local or sandbox file to media | `media_upload`, then PUT, then `media_confirm` | See below |
| Upload when files are unreadable | `media_upload_widget` | Must be the only tool call in that turn |
| Isolate the product, make masks | `remove_background` | Takes a `media_id` or completed `job_id` |
| Extend the frame | `outpaint_image` | Keeps source pixels. Ratios: 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| Extend per side | `generate_image` with `flux_2_pro_outpaint` | `expand_top/bottom/left/right` in px. Canvas limit 2560 px per side |
| Increase resolution | `upscale_image` | Must pass the source `width` and `height` |
| Exact pixels, text, logos | `sandbox_exec` | ImageMagick, Pillow, Node, Playwright Chromium, ffmpeg |
| Destination folder | `get_preferences`, then `create_project` | See "Running and retrieving jobs" |

Not provided: exact arbitrary output dimensions from generators, or a 1.91:1 ratio on most models. Finish those by cropping (`references/resize-guidelines.md`).

## Choosing a model

Observed in testing on 2026-11-01 (small sample, so verify on your own images):

| Job | Start with | Why |
|---|---|---|
| Product in a scene, reference-based edits | `gpt_image_2_5`, `quality: medium` or `high`, `resolution: 2k` | Kept the label and product shape best. Role: `image_references` |
| Quick commercial exploration | `marketing_studio_image` | Good mood, but shrank the product and blurred small label text in the same test. Role: `image` |
| Mask-based edits | `nano_banana_2` with `is_inpaint: true` | Roles: `image_references`, `mask`. Re-rendered the protected area in testing, so always restore (see `workflows/image-editing.md`) |
| Cinematic scene, no exact product | `cinematic_studio_2_5` | Listed for cinematic stills, not tested here |
| People, fashion, UGC realism | `soul_2` | Listed for this use, not tested here. Only one reference image |
| Very wide or tall ratios | `nano_banana_2_1` (4:1, 8:1...), `ideogram_4_5` (3:1, 22:9...) | From the catalog, not tested here |

Avoid `ms_image` unless the user wants its style catalog, since it requires them to pick a `style_id` first. Do not use a text-rendering model as a way around compositing, unless the user accepts approximate text.

## Costs

Call `generate_image` with `get_cost: true` on a representative request, and state the total. The user's go-ahead on a brief with its cost is approval for that job. Ask again if the scope grows, for instance if a retry is needed beyond the first or the batch gets larger. Check `balance` before large batches.

Leave `use_unlim` and `use_free_gens` unset unless the user asks for them. If a response returns `unlim_choice`, put that question to the user. Treat `outpaint_image` and `upscale_image` the same way, using their `get_cost`.

Reference prices seen on 2026-11-01, which may change: `gpt_image_2_5` 2k at 4:5 was 1 credit on medium and 2.75 on high; `marketing_studio_image` and `nano_banana_2` at 2k were 2 credits.

## Getting media in

- **File the agent can read:** call `media_upload` with the filename, PUT the bytes to `upload_url`, then call `media_confirm` with the `type` and `media_id`.
- **File in the sandbox:** get `upload_url` before running the producing command, and do the PUT in that same `sandbox_exec` command. Sandbox files can disappear.
- **PUT headers:** if the URL's `X-Amz-SignedHeaders` includes `if-none-match`, send `-H "If-None-Match: *"` with the `Content-Type`, or the upload can be rejected.
- **File attached in chat that you cannot read:** use `media_upload_widget`. Remote tools cannot read chat attachments.

Keep the returned `media_id` in the ledger, so a product isn't uploaded twice. A completed `job_id` can be used as a reference directly.

## Writing the prompt

Write a shot description, not a list of quality words. Order:

1. **Reference instruction**, if any: "Use the bottle in the reference image as the exact product: keep its shape, proportions, materials, colors and label text exactly as shown; do not redraw or change the label."
2. **Type of image** in one line: "Luxury editorial fragrance advertisement."
3. **Subject placement:** "lower-right third of the frame"
4. **Camera:** "85mm lens at eye level, shallow depth of field"
5. **Light:** "a single low warm raking light from the left, casting a long soft shadow"
6. **Setting and brand color:** "deep midnight navy background (#14213D) falling off to near black"
7. **Negative space:** "generous empty space across the top 45% of the frame for later typography"
8. **Materials:** "realistic glass refraction and stone texture"
9. **Exclusions:** "No added text, no logos, no watermark, no extra props."

Negative space must be asked for explicitly with a location and size, or the frame fills up. Leave out font names, and logo or text descriptions, unless the text exists physically on the product.

Worked example, which produced a usable plate at the first attempt with `gpt_image_2_5` and a product reference:

> Use the bottle in the reference image as the exact product: keep its shape, proportions, amber glass, black cap and label text exactly as shown; do not redraw or change the label. Luxury editorial fragrance advertisement. The bottle stands on a slab of dark honed basalt, lower-right third of the frame, 85mm lens at eye level, shallow depth of field. A single low warm raking light from the left casts a long soft shadow and lights the amber glass from within. Deep midnight navy background (#14213D) falling off to near black, with generous empty negative space across the top 45% of the frame for later typography. Restrained colour grade, realistic glass refraction and stone texture. No added text, no logos, no watermark, no props besides the stone.

## Running and retrieving jobs

1. **Folder:** call `get_preferences` before the first generation. If `auto_create_project` is true, or the user asked for a project, create one Higgsfield project per brand and pass its `folder_id` on every generation. Otherwise omit `folder_id`. This keeps brands separate where the user wants folders, without creating clutter.
2. **Submit:** always pass a short `context`, without names or contact details. Pass `medias` as `{value, role}`, with `value` being a `media_id` or `job_id`.
3. **Wait:** `jobs_wait` until `all_terminal` is true.
4. **Failed or timed-out jobs:** report them. A transport timeout may mean the job did run, so look for returned job IDs before resubmitting, or the user could pay twice. Errors often name the limit; adjust and retry once (for example, `flux_2_pro_outpaint` rejects canvases over 2560 px).
5. **Inspect the result yourself:** download `result_url` in the sandbox and view it through `sandbox_exec` `image_paths` (PNG or JPEG, 512 KiB total, so resize to about 500 px and JPEG first). Zoom in on labels with a crop.
6. **Show it** with `job_display` or `show_generation_by_ids`.

Never publish, post, or make anything public without the user asking. Higgsfield's publishing tools are out of scope for this skill.
