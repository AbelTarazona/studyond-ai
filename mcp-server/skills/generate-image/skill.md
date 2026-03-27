---
name: generate-image
description: Generate brand-consistent website images via Gemini. Builds a styled prompt, user generates in Gemini and drops the file into the project, then Claude renames and wires it into the codebase.
---

## Instructions

1. Get the image description from the user (or ask what the image should show)
2. Read the base prompt below
3. Ask the user for aspect ratio: **16:9** (landscape/hero), **1:1** (square/default), **9:16** (portrait/mobile)
4. Combine base prompt + subject description + aspect ratio into a single prompt
5. Present the prompt in a code block for the user to copy into gemini.google.com
6. Tell the user to save the generated image into `src/assets/images/new/`
7. When confirmed, find the file, move/rename it following the naming convention below
8. Wire it into the relevant component (update imports, add alt text)
9. Clean up the `new/` folder

## Base Prompt

```
Documentary-style photograph. Shot on 35mm lens, f/2.8, shallow depth of field.
Warm natural light, soft shadows. Muted warm color palette — not saturated.
Realistic skin texture, visible pores, no retouching. Slight film grain.
Candid energy, caught mid-moment, unposed. No eye contact with camera.
No artificial lighting. No stock photo aesthetic.
```

## Naming Convention

| Image type | Folder | Naming |
|---|---|---|
| Hero images | `images/hero/` | `{page-context}.png` |
| Statement / CTA backgrounds | `images/statements/` | `{section-context}.png` |
| Showcase / general | `images/showcase/` | `{descriptive-name}.png` |
| People / avatars | `images/people/` | `{first-last}.png` |
