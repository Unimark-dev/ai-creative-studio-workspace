# Compositing text and logos

`scripts/compose.js` renders exact copy and original logo files over a plate in a real browser engine. This gives correct Arabic shaping and direction, real fonts, exact brand colors and exact output pixels.

## Where to run it

1. **Higgsfield sandbox (`sandbox_exec`):** Node, Playwright and Chromium are already there. Write the script in with a quoted heredoc (`cat > compose.js <<'EOF'`), and fetch the plate and logo with `curl`. Python in the sandbox has no Playwright module, so use the Node script.
2. **Local Node with Playwright**, if the sandbox is unavailable.
3. **Neither available:** deliver the clean plate plus the approved copy and a layout spec for a designer, and say the text was not added. Only use model-rendered text if the user accepts that it may be inaccurate, and check it character by character.

Sandbox files are temporary. Do the upload in the same command that creates the final.

## The spec

```json
{
  "width": 1080, "height": 1350, "output": "final.png",
  "background": "plate.png",
  "focus": "50% 60%",
  "fonts": ["https://fonts.googleapis.com/css2?family=Cairo:wght@700&family=Playfair+Display:wght@700&display=swap"],
  "layers": [
    {"type": "text", "text": "عطرٌ يشبه النور", "x": 70, "y": 120, "w": 940, "font": "Cairo", "size": 92, "weight": 700, "color": "#FFFFFF", "align": "right", "dir": "rtl"},
    {"type": "text", "text": "A new light, bottled.", "x": 70, "y": 260, "w": 940, "font": "Playfair Display", "size": 48, "weight": 700, "color": "#E9C46A", "align": "right"},
    {"type": "image", "src": "logo.png", "x": 70, "y": 70, "w": 170}
  ]
}
```

- `background` fills the frame like CSS `cover`, cropping any excess, and `focus` picks which part stays. Plates smaller than the frame get upscaled softly, so check first (`references/resize-guidelines.md`).
- `fonts` takes stylesheet URLs. For licensed fonts, use `"fontFiles": [{"family": "Brand Sans", "src": "brand.woff2", "weight": 700}]`.
- Text layers also accept `lineHeight` and `tracking`. Set `dir: "rtl"` and `align: "right"` for Arabic.
- Keep the spec in the ledger, so edits and new formats reuse it.

## Exit codes

The script prints a JSON report. Exit 3 means something is wrong even though an image was written:

- `missingFonts`: the requested font did not load, and the render fell back. Do not deliver this as on-brand.
- `brokenImages`: a logo or background failed to load.
- `overflow`: a layer extends outside the frame, which is often a clipped headline.

## Fonts

Use the brand's actual fonts. If they are not on Google Fonts and no files were supplied, ask for the files. If the user wants to proceed without them, propose a close substitute by name and flag it on delivery. Never substitute silently.

## Logos

Use original files only, respecting stated clear space, minimum size and color rules. Transparent PNG or SVG is best. A logo on a white box means the file has a solid background: ask for a transparent version. Do not run a logo through a generator, trace it or redraw it. If there is no file, leave it out and say so.

## Layout

- Put type in the negative space you planned, and check contrast against the actual pixels there.
- Keep hierarchy simple: a dominant headline, one supporting level, and a logo.
- Size per frame rather than scaling proportionally. A 92 px headline for 1080 × 1350 will not suit a 1200 × 627 banner.
- Keep the edges clear. Roughly 6% of the frame width works as a margin when the brand states none.
- Bilingual layouts: give each language its own alignment, and do not mix directions on one line without a reason.

Inspect the final after rendering: Arabic letters joined, diacritics intact, numerals correct, nothing clipped, nothing touching the product. Then upload it through `media_upload` to get a link for the user.
