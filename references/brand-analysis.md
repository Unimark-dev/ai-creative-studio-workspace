# Brand analysis

Extract what the source says and separate it from what you infer. Downstream work trusts this profile, so a sourced fact, an inference and a gap must never look alike.

## Reading for visual language

Guidelines often state rules for logos and color, and only imply photography and composition. When the source shows example imagery, describe what you can see: light direction and quality, palette in images, subject distance, how much space is left empty, how type sits on images. Label these `Observed`, because they are your reading of the examples and not stated rules.

Website CSS can supply real values when guidelines are thin. Label these `From site CSS`, since a site's colors are evidence of the palette, not a confirmed specification.

## Brand DNA Profile template

Tag each entry `Stated`, `Observed`, or `From site CSS`, with `Not specified` for gaps.

```
BRAND DNA: <brand>
Source: <URLs or files actually read>   Not readable: <any that failed>

Colors
  Primary: <name> #HEX
  Secondary: <name> #HEX
  Usage rules/ratios:

Typography
  Arabic: <family, weights>
  English: <family, weights>
  Hierarchy and direction rules:
  Font access: <Google Fonts / files supplied / unavailable>

Logo
  Files available: <URLs or uploads>
  Clear space, minimum size, allowed colors, misuse:

Visual language
  Photography style:
  Lighting:
  Composition principles:
  Graphic elements:
  Visual references:

Personality and tone:

Restrictions
  Do:
  Don't:

Suggestions (not brand rules): <only your own recommendations, always separate>
```

## Using the profile

- Convert it into generation language only as needed. Colors can go in prompts as HEX values with where they appear ("deep navy #14213D wall"). Models treat these as approximate, so check by eye and do not promise an exact match in photographic scenes. Exact color is guaranteed only for composited text and graphics.
- Do not pass font names or logo descriptions to the image model. They belong to compositing.
- If the user asks for something that breaks a stated rule, point it out once, then follow their decision. It is their brand. Do not update the profile unless they say the rule has changed.
