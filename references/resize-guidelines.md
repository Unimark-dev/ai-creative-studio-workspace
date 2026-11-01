# Format and resize guidelines

## Formats

Generate at the listed ratio, then finish at exact pixels with `scripts/compose.js`, whose `focus` setting controls any crop. Models return their own pixel sizes (for example `gpt_image_2_5` at 2k gave 1792 × 2240 for 4:5 and 2688 × 1520 for 16:9), so this last step is what delivers the requested size.

| Target | Exact ratio | Generate at | Finish |
|---|---|---|---|
| 1080 × 1080, 1200 × 1200 | 1:1 | 1:1 | Resize |
| 1080 × 1350 | 4:5 | 4:5 | Resize |
| 1080 × 1920 | 9:16 | 9:16 | Resize |
| 1200 × 627 | 1.91:1 | 16:9 | Crop height by about 7% |
| 1920 × 800 | 2.4:1 | 21:9 | Crop height by about 3% |
| Custom | W/H | Nearest supported ratio that is **wider or taller in the direction you can afford to lose** | Crop and resize |

Compose with the crop in mind. Keep the product and copy zone away from the edges that will be cut.

**Resolution:** the source must be at least as large as the target in both dimensions. If it is not, use `upscale_image` first and mention it. Compare after upscaling, because an upscaler can alter fine label text.

## Choosing a method

**Extend with `outpaint_image`** when the scene can just continue, such as 4:5 to 9:16 with a plain background above and below. It keeps the source pixels, so product fidelity is excellent. Pass `aspect_ratio` plus `width` and `height` to control size. The output may not match them exactly (1080 × 1920 requested gave 1536 × 2752, the right ratio), so finish with compose. It takes no prompt and gives no control over where the source lands, so plan final positions from the real output. Check that the product stays clear of safe zones, and check new areas for repeated texture or objects that do not belong. Its ratios exclude 1.91:1 and 2.4:1: outpaint to 16:9 or 21:9, then crop.

**Extend per side with `flux_2_pro_outpaint`** when the extra room must go on specific sides, such as all on the left to hold copy. Canvas limit is 2560 px per side, so a 1792 × 2240 plate cannot go much wider without downsizing first. Not tested end to end, since the only test request exceeded this limit.

**Recompose with a reference generation** when the arrangement must change, such as portrait to landscape, or moving the product across the frame. Use `generate_image` with the plate as `image_references` and the new `aspect_ratio`. Describe the new layout and name what stays: product, surface, light, palette. This gave the most natural landscape in testing, but the product is re-rendered, so compare label text to the source and fix with a product paste if it softens.

**Crop alone** only when nothing important is lost, and the new layout truly works.

| From → to | Usually |
|---|---|
| Square or 4:5 → Story | Extend |
| Square or 4:5 → 1.91:1, 16:9, banner | Recompose |
| Landscape → portrait or Story | Recompose |
| 4:5 ↔ 1:1 | Extend or crop |

## Layout by frame

- **Story, 9:16:** keep the top and bottom clear of platform UI, about 250 px on each at 1080 × 1920. Stack the product and copy vertically.
- **Portrait, 4:5:** copy above or below the product works well.
- **Square:** the tightest frame for type, so keep copy short.
- **1.91:1 and banners:** a side-by-side layout, with the product on one third and copy on the opposite side. For RTL copy, put the text on the right and the product on the left. Wide banners may also be cropped responsively on a site, so keep key content central if the user says so.

## Versions

Every format gets its own ledger entry and file name, for example `brand_concept_story_1080x1920_v1.png`. Never replace the source.
