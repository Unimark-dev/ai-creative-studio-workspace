# Creative editing

Work out what is changing and, just as importantly, what must not change. Then match the method to that.

## Classify the request

| Request | Type | Method |
|---|---|---|
| Copy, price, logo position, font size | Layout | Change the compose spec and re-render. No credits, no model |
| "Change only the background", "remove this object" | Local, keep the product | Local edit with restore (below) |
| "More luxurious lighting", "more cinematic" | Global look | Reference edit, then inspect the product |
| "Make the product larger", "more space on top" | Layout of the scene | Reference edit or recompose; `outpaint_image` for more space |
| "Different camera angle", "new concept" | Redesign | New generation with the product as reference |

If it is unclear whether they want a tweak or a redesign, ask one short question. If the change affects the product itself, such as lighting that alters its color, say so.

## Local edit with restore

Prompting "keep the product unchanged" is not enough. In testing, both prompt-only edits and mask inpainting re-rendered the product and softened small label text. Restoring the original pixels afterwards brought the product region back to almost identical. So:

1. Run `remove_background` on the current **plate** to get a cutout of the protected subject. Check the cutout. It may also keep nearby objects, or lose parts of glass or thin details.
2. In the sandbox, build a mask (white = may change, black = protected) from the cutout's alpha, dilated a few pixels:
   ```bash
   convert cutout.png -alpha extract -threshold 50% -morphology Dilate Disk:6 -negate -type Grayscale mask.png
   ```
3. Upload the mask (`references/image-generation.md`, "Getting media in").
4. Run the edit with `generate_image`, using a model with a `mask` role and `is_inpaint: true`, such as `nano_banana_2`. Pass the plate as `image_references` and the mask as `mask`. Say what to change, and what to keep.
5. Paste the original subject back. Output size can differ slightly from the source, so resize first:
   ```bash
   convert edited.png -resize WxH! cutout.png -composite restored.png
   ```
   `WxH` is the plate's exact size.
6. Inspect `restored.png` at full size around the subject's edges. Look for halos, leftovers of the re-rendered product showing around the pasted one, and wrong shadows or reflections where the subject meets the new surface.
7. Upload `restored.png` as the new plate, then re-apply the layout.

Pasted pixels keep their original lighting, so a dramatic relight will look wrong on a restored product. If the new background implies very different light, tell the user. Offer a reference edit that relights the product, with the caveat that its label may soften.

## Reference edit

Use `generate_image` with the current plate as a reference, at the same aspect ratio. Name what changes first, then list what stays: product, label, position, scale, composition, camera. Change one thing at a time, so the user can follow what happened. `gpt_image_2_5` kept labels most legible in testing.

## After any edit

- Inspect against `references/quality-standards.md`, comparing to the previous version.
- Save as a new version (`v2`) and keep the old one. The user can go back at any point.
- Re-apply the layout, so copy stays exact.
- Tell the user what changed, and anything else that shifted when it should not have.

If an edit fails to hold after one retry, stop and explain the trade-off, instead of spending more credits.
