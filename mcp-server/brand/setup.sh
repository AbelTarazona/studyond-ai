#!/usr/bin/env bash
# Studyond — Project Setup Script

# Create project
npm create vite@latest my-studyond-app -- --template react-ts

# Install core dependencies
npm install tailwindcss @tailwindcss/vite
npm install ai @ai-sdk/anthropic   # or @ai-sdk/openai
npm install zustand
npm install lucide-react
npm install framer-motion           # optional

# Initialize shadcn
# Choose: New York style, Zinc base color, CSS variables: yes
npx shadcn@latest init

# Add recommended components
npx shadcn@latest add button card input dialog badge tabs
npx shadcn@latest add form select textarea tooltip avatar
npx shadcn@latest add sidebar sheet dropdown-menu separator
