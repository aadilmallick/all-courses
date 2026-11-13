# AI Workbench — developer field guide

A researched curriculum and Astro Starlight companion website covering the four requested categories. Researched **November 13, 2026**. The edition contains **32 separate, substantial tool chapters**, four category overviews, foundations, a sixteen-week learning path, comparisons, application projects, a lifecycle watchlist, and a primary-source ledger.

## Open the guide

- Published site: [AI Workbench](https://ai-workbench-developer-field-guide.unison-softw-0672.chatgpt.site)
- Offline curriculum: [curriculum/README.md](curriculum/README.md)
- Downloadable Markdown bundle: [public/downloads/ai-workbench-curriculum.zip](public/downloads/ai-workbench-curriculum.zip)
- Content and evidence checks: [research/verification.json](research/verification.json)
- Offline example checks: [research/offline-checks.json](research/offline-checks.json)

The publication link requires the site's configured access; a URL in this README alone is not proof of successful deployment. The final publication result in the accompanying chat records deployment status.

## Categories and core tools

| Category | Guides |
| --- | --- |
| Software factories and agent boards | Codex, Factory Droid & Missions, Claude Code, Cursor, GitHub Copilot, Devin, OpenHands, Paradev (formerly Superset) |
| Agent sandboxes and remote sessions | E2B, Daytona, Modal, Freestyle, CodeSandbox SDK, Cloudflare Sandboxes, GitHub Codespaces, Coder |
| Voice agent tooling | LiveKit Agents, Pipecat, Vapi, Retell, ElevenAgents, OpenAI Realtime, Deepgram, Twilio ConversationRelay |
| Video and avatar generation | Runway, Google Flow/Veo/Gemini video, Kling, Luma, HeyGen, Synthesia, Tavus, D-ID |

Vibe Kanban, Runloop, retired Sora API routes, and selected frontier orchestration projects receive clearly labelled lifecycle or research notes. They are not counted as full core chapters. This is a curated, broad map of the requested categories; it does not claim to enumerate every AI product or rank tools by market share.

## Read and learn

Start with Foundations, select a learning path, then complete a relevant guide. A selective survey takes approximately twelve to eighteen hours. The complete route suggests sixteen weeks at eight to twelve hours weekly, depending on practice and prior experience. Each tool chapter explains the problem, prerequisites, mental model, worked workflow, examples, debugging, tradeoffs, optional application, and evidence limits.

The offline edition uses numbered Markdown files in category folders with relative navigation. The website adds full-text Pagefind search, category navigation, theme selection, section navigation, a filterable tool directory, copyable code, and responsive reading layouts. It stores no account credentials or service data.

## Run the website locally

Use a Node.js version supported by the locked Astro release. This project was built with Node.js 26.7.0 and npm 11.19.0 on Windows PowerShell. Run each command from this folder:

```sh
npm ci
npm run dev
```

Open the address printed by the server. For the built site and production search:

```sh
npm run build
npm run preview
```

Pagefind search is generated during the production build. Development preview may not expose the final search index. The wrapper disables optional Astro telemetry to keep build configuration local. No vendor service credential is required to read, build, or search the guide.

## Edit, validate, and export

Canonical chapters are in `src/content/docs/<category>/<tool>.md`. Official-source ledgers are in `research/*.json`. To update content, edit the chapter and ledger, then run:

```sh
node scripts/prepare-content.mjs
node scripts/check-examples.mjs
node scripts/export-curriculum.mjs
npm run verify
npm run build
```

After export, recreate `public/downloads/ai-workbench-curriculum.zip` from the `curriculum` folder before the final verification/build. The verification checks all 32 metadata targets, at least 5,000 body tokens per core chapter with the named cl100k_base encoding, Markdown fences, source dates, and internal source navigation. `scripts/check-built-links.mjs` checks built-site navigation and assets after a build. It does not run vendor integrations.

## Evidence and limitations

The research ledgers link official documentation, vendor notices, and official source repositories, with access dates and supported claims. Worked examples, prompts, production briefs, simulations, and decision methods are original teaching material. Paid APIs, actual generated media, audio calls, telephone calls, remote agent accounts, and production integrations were not executed. Python examples were not run in this environment. JavaScript syntax and explicitly recorded offline examples were checked; the reports distinguish those checks from live service testing.

Recheck current APIs and account entitlements before a paid trial. This edition includes material lifecycle changes found during research rather than silently reusing old quickstarts. It is a dated snapshot and has no automatic monitoring.

## Hosting

The existing `.openai/hosting.json` identifies this private Sites project and its `dist` output. Preserve the identity when updating this site. If intentionally creating a different site from a copy, register that new project through the supported workflow rather than publishing with the existing identity. Never put credentials in the manifest or source tree.
