# Image creation

Collect only what is still unknown, one question at a time, then produce.

## Format

Offer the presets and always allow custom width and height:

| Format | Dimensions |
|---|---|
| Instagram Square | 1080 × 1080 |
| Instagram Portrait | 1080 × 1350 |
| Instagram Story | 1080 × 1920 |
| Website Banner | 1920 × 800 |
| LinkedIn Square | 1200 × 1200 |
| LinkedIn Landscape | 1200 × 627 |
| Custom | User-defined |

## Idea

Ask what the design should communicate and let them answer freely. Launch, promotion, seasonal, luxury, lifestyle, editorial, minimalist or artistic are examples to offer if they are stuck, not categories to choose from.

## Product or visual reference

If they have a product, get the image and prepare it as described in `references/image-generation.md`. If they have none, build the visual from the concept and brand identity.

Product rules, which also go into the prompt:

- Keep the original appearance, packaging, proportions, logos and labels
- Reproduce printed text as accurately as possible and do not invent details
- Integrate the product naturally into the scene, with matching light and contact shadows

A low-resolution or heavily cropped product photo limits the result. Mention this before spending credits on it.

## Copy

Ask whether they want text in the design: headline, description, offer, price, call to action.

- If they have none, propose 2–3 short options that fit the brand voice and the idea, for approval.
- Do not invent claims, prices, discounts or dates. Use a visible placeholder until the user supplies them.
- For bilingual work, confirm both versions. Write Arabic as natural copy, not word-for-word translation, and ask the user to have final Arabic reviewed if the campaign is high-stakes.
- Nothing goes in the composition until it is approved.

## Direction

If the idea is open, or the user wants options, follow `workflows/creative-variations.md`. If they already know what they want, write one brief per `references/creative-direction.md`, share it in a few lines with the credit cost, and proceed.

## Produce

1. Choose the model and write the prompt per `references/image-generation.md`. Compose for the layout: leave real negative space where the copy will go.
2. Generate the clean plate at the ratio from `references/resize-guidelines.md`.
3. Inspect it against `references/quality-standards.md`. If it fails, fix the prompt and retry once, telling the user why. If it still fails, show it and explain rather than spending repeatedly.
4. Show the plate to the user with the job widget.
5. Add the approved text and logos per `references/compositing.md`, and inspect the final at full size.
6. Deliver the final with its exact dimensions, link and any caveats. Record it in the ledger.

Keep the closing message short: what was made, the link, anything imperfect. The user can then ask for edits, variations or other formats.
