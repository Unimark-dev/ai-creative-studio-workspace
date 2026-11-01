# Format adaptation

Treat every new format as a new layout decision, not a resize. The result should look as if it had been made for that frame. Never stretch, and never crop away something that matters.

## Steps

1. Find the source version in the ledger: clean plate, layout and copy. Always adapt from the **clean plate**. Outpainting or recomposing an image with text baked in damages the text and doubles it.
   If only a flattened image exists, say that its text and logo may need to be rebuilt, and ask for the copy and logo.
2. Analyze the composition: main and secondary elements, the product's position and scale, where copy and logo sit, the hierarchy, the negative space.
3. Decide the new layout for the target frame: where the product goes, how large it is, and where copy goes. Check safe zones (`references/resize-guidelines.md`). Say the plan in a line.
4. Choose a method from `references/resize-guidelines.md`:
   - **Extend** when the composition still works with more scene around it.
   - **Recompose** when the layout must really change, such as portrait to landscape.
5. Quote the cost, generate, and inspect against the source: is the product still correct?
6. Rebuild the copy and logo for the new layout with `scripts/compose.js`, adjusting sizes and positions for the frame instead of scaling them proportionally.
7. Deliver at the exact target dimensions. Add a new ledger entry such as `v1-story`, and leave the original untouched.

## Several formats at once

Plan them all, quote the total, and do them in one batch where possible. Use each one's own layout. Show all results together with `show_generation_by_ids`.

## Honesty about the output

If you had to upscale, say so, and if an edge looks synthetic or the product shifted on recompose, say that too. If a target is extreme enough that the concept no longer works (a tall product in an 8:1 strip), propose a different layout instead of forcing it.
