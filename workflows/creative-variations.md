# Creative variations

Offer three directions when the idea is open or the user asks for options. Skip this when they already have a clear concept: being made to choose from options they did not ask for is friction.

## Make them truly different

Each direction needs its own idea. Changing the background or color grade gives you one direction three times. Test: could someone describe the difference without mentioning color or background? They should differ in at least three of these:

- The visual idea or story
- Setting and world
- Camera angle and distance
- Light quality and source
- Product scale and placement
- Where the copy lives and how it relates to the image

All three must stay recognizably the same brand, using its palette, tone and restrictions. If the brand rules exclude a territory (no lifestyle imagery, say), replace it. Do not break the rule to fill a slot.

## Starting territories

Use these as starting points and rename them for the actual idea. Replace any that do not suit the brand or brief.

- **Luxury Editorial:** premium art direction, cinematic light, elegant negative space, strong product emphasis
- **Artistic Campaign:** experimental composition, visual storytelling, an unexpected but relevant element
- **Commercial Lifestyle:** realistic environment, natural product use, authentic commercial photography

## Present them

For each direction, write the name, the idea in one sentence, and one line on what the viewer would see. Add one line on why it suits this brief. Then recommend one, and give the credit cost.

Let the user pick one, combine parts ("the setting from 02 with the lighting from 01"), or ask for others. For a combination, restate the merged brief in a line so the result is what they imagined.

## Written or visual

Default to written directions, since they cost nothing. Generate previews when the user asks to see them or cannot judge from words:

- Quote the cost first (`references/image-generation.md`).
- Use `generate_image_batch` with one request per direction. Do not use `count` on `generate_image`, which only makes variants of one prompt.
- Use a lower quality tier for previews, then re-render the chosen one at final quality with the same prompt.
- Wait with `jobs_wait`, then show them all with one `show_generation_by_ids` call.

Campaign consistency: when several images are in one campaign, reuse the brief's light, grade and palette wording, and pass an approved image as a reference.
