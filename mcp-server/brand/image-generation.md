# Image Generation

Generate brand-consistent images using Google Gemini (gemini.google.com) with our base prompt. This keeps all photography looking like it belongs to the same editorial world.

## Base Prompt

Prepend this to every image generation request:

> Documentary-style photograph. Shot on 35mm lens, f/2.8, shallow depth of field.
> Warm natural light, soft shadows. Muted warm color palette — not saturated.
> Realistic skin texture, visible pores, no retouching. Slight film grain.
> Candid energy, caught mid-moment, unposed. No eye contact with camera.
> No artificial lighting. No stock photo aesthetic.

## How to Generate

1. **Write your subject description** — what the image should show (e.g., "A student working on their thesis at a wooden desk in a university library, laptop open, notes spread out")

2. **Choose an aspect ratio:**
   - **Landscape 16:9** — wide cinematic, good for hero sections and statements
   - **Square 1:1** — default format
   - **Portrait 9:16** — tall format for mobile-first layouts

3. **Combine** base prompt + subject + aspect ratio into a full prompt

4. **Paste into gemini.google.com** and generate

5. **Download** and add to your project

## Image Types & Naming

| Image type | Suggested folder | Naming |
|---|---|---|
| Hero images | `images/hero/` | `{page-context}.png` |
| Statement / CTA backgrounds | `images/statements/` | `{section-context}.png` |
| Showcase / general | `images/showcase/` | `{descriptive-name}.png` |
| People / avatars | `images/people/` | `{first-last}.png` |

## Style Guidelines

- **Photography:** Natural, candid, documentary feel — caught mid-moment
- **Lighting:** Warm natural light, soft shadows, no artificial setups
- **Color:** Muted warm palette, slightly desaturated — not vivid or saturated
- **Texture:** Slight film grain, realistic skin, no retouching
- **Subjects:** Students, workspaces, academic settings, collaboration, campus life
- **Avoid:** Stock photo clichés, overly posed shots, neon/saturated colors, eye contact with camera, artificial lighting

## Claude Code Users

If you're using Claude Code, use the `/generate-image` skill — it automates the prompt building, file placement, and wiring into components.
