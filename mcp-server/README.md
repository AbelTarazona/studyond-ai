# Studyond -- StartHack 2026

Welcome! This repository contains everything you need to work on the Studyond hackathon challenge.

## About Studyond

**Studyond AG** is a Swiss startup (HSG spin-off, ETH startup) backed by Innosuisse. We operate a three-sided marketplace connecting **students**, **companies**, and **universities** around thesis topics, research projects, and talent sourcing.

**Website:** [studyond.com](https://studyond.com)

## The Challenge

Design and prototype an **AI-powered thesis journey** -- a modular, adaptive flow that guides students through their entire thesis process using Studyond's existing ecosystem (topics, supervisors, companies, experts, mentors, AI matching).

Full brief: [`context/Challenge Brief.md`](context/Challenge%20Brief.md)

## Studyond Brain

The `context/` folder is the **Studyond Brain** -- an interconnected knowledge graph of atomic notes about Studyond. Each note covers one concept and links to related notes via `[[wiki-links]]`.

**To explore:** Open the `context/` folder in Obsidian and use graph view, or start with [`Studyond Brain.md`](context/Studyond%20Brain.md).

**Key entry points:**

| Note                                                           | What's inside                                  |
| -------------------------------------------------------------- | ---------------------------------------------- |
| [`Studyond Brain.md`](context/Studyond%20Brain.md)             | Map of Content -- start here                   |
| [`Challenge Brief.md`](context/Challenge%20Brief.md)           | The hackathon brief, what to build             |
| [`Opportunity Space.md`](context/Opportunity%20Space.md)       | What doesn't exist yet -- where to build       |
| [`Thesis Journey.md`](context/Thesis%20Journey.md)             | The 5-stage thesis process and building blocks |
| [`Studyond.md`](context/Studyond.md)                           | Company overview                               |
| [`Platform Overview.md`](context/Platform%20Overview.md)       | Current features and capabilities              |
| [`Data Model.md`](context/Data%20Model.md)                     | Entities and relationships                     |
| [`Students.md`](context/Students.md)                           | Primary audience profile                       |
| [`Editorial Minimalism.md`](context/Editorial%20Minimalism.md) | Design philosophy                              |

## Brand & UI

The `brand/` folder contains assets and references for building on-brand interfaces:

Start with [`brand/README.md`](brand/README.md) for an overview, then grab what you need:

| File                                               | What's inside                                    |
| -------------------------------------------------- | ------------------------------------------------ |
| [`setup.md`](brand/setup.md)                       | Tech stack, install commands, shadcn config      |
| [`colors.md`](brand/colors.md)                     | Copy-pasteable CSS variables (light + dark mode) |
| [`typography.md`](brand/typography.md)             | Font stack, type scale classes                   |
| [`components.md`](brand/components.md)             | Layout, components, icons, animation             |
| [`ai-integration.md`](brand/ai-integration.md)     | Vercel AI SDK setup, AI visual style             |
| [`image-generation.md`](brand/image-generation.md) | Generate brand-consistent images with Gemini     |
| [`studyond.svg`](brand/studyond.svg)               | Logo                                             |

## Using the Brain with AI Tools

The atomic notes are designed for LLM context. Each note is self-contained but richly linked:

- **Obsidian:** Open `context/` as a vault. Use graph view to explore connections.
- **Claude Code / Cursor / Windsurf:** Open this repo -- your AI assistant can read and navigate the notes via wiki-links
- **ChatGPT / Claude chat:** Copy-paste individual notes (they're small and focused) or start with `Studyond Brain.md`
- **RAG / custom setup:** Each note is a clean, atomic chunk with consistent frontmatter tags for filtering
- **MCP server:** Expose the brain as a local tool server for any MCP-compatible client (see below)

### Optional: Expose as a local MCP server

If you want your LLM to query the Studyond Brain through [Model Context Protocol](https://modelcontextprotocol.io), the fastest way is the official filesystem server. Add this to your MCP client config (e.g. `claude_desktop_config.json` or `.claude/settings.json`):

```json
{
  "mcpServers": {
    "studyond-brain": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./context"]
    }
  }
}
```

This gives your LLM `read_file`, `list_directory`, and `search_files` tools scoped to the `context/` folder. It can navigate `[[wiki-links]]` by reading referenced notes.

For a richer experience, you could build a small custom MCP server (~100 lines) that parses the wiki-links and frontmatter tags, exposing tools like `get_note(name)`, `get_linked_notes(name)`, or `list_by_tag(tag)` -- letting the LLM traverse the knowledge graph intentionally rather than guessing filenames.

---

Good luck! Build something amazing.
