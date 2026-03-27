---
name: setup-project
description: Scaffold a new Studyond-branded React + TypeScript project with Tailwind, shadcn/ui, and the full design system pre-configured. Only relevant if your team chose the React/Vite/Tailwind/shadcn stack from the brand guide.
---

## Instructions

1. Ask the user for a project name (default: `studyond-app`)
2. Run the setup commands:

```bash
npm create vite@latest {project-name} -- --template react-ts
cd {project-name}
npm install tailwindcss @tailwindcss/vite
npm install ai @ai-sdk/anthropic
npm install zustand
npm install lucide-react
npm install framer-motion
npx shadcn@latest init
```

3. When shadcn prompts for options, choose:
   - Style: **New York**
   - Base color: **Zinc**
   - CSS variables: **Yes**

4. Copy the shadcn config from the brand guide:
   - Read `brand/components.json` and write it to `{project-name}/components.json`

5. Install recommended shadcn components:

```bash
npx shadcn@latest add button card input dialog badge tabs
npx shadcn@latest add form select textarea tooltip avatar
npx shadcn@latest add sidebar sheet dropdown-menu separator
```

6. Copy the full design system CSS:
   - Read `brand/app.css` and write it to `{project-name}/src/App.css`

7. Copy the logo:
   - Copy `brand/studyond.svg` to `{project-name}/src/assets/studyond.svg`

8. Confirm the setup is complete and suggest next steps:
   - Review `brand/components.md` for layout patterns and component guidelines
   - Review `brand/README.md` for do's and don'ts
   - Run `npm run dev` to start developing
