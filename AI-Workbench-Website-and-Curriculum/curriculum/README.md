# AI Workbench: developer field guide

Researched November 13, 2026. Thirty-two complete tool chapters across four requested categories, plus prerequisites, learning paths, comparisons, projects, and a primary-source ledger. This is a curated ecosystem curriculum, not an exhaustive inventory of all AI products.

## Start here

1. Read [Foundations](reference/foundations.md).
2. Choose a [learning path](reference/learning-paths.md).
3. Use [Compare and choose](reference/compare.md) to shortlist a tool.
4. Complete an optional [application project](reference/projects.md).
5. Check [ecosystem changes](reference/watchlist.md) before using old APIs.

The full route is approximately sixteen weeks at eight to twelve hours weekly, depending on practice and prior experience. A selective survey can fit twelve to eighteen hours. Most conceptual and offline work needs no paid account. Live services may require subscriptions, API billing, eligible regions, or supported operating systems.

## Tool chapters

### Software factories & agent boards

- [Codex](01-software-factories/01-codex.md) — Local and cloud coding tasks with reusable environments and evidence-based review.
- [Claude Code](01-software-factories/02-claude-code.md) — Terminal and editor agent workflows with project instructions, skills, tool connections, checkpoints, and worktrees.
- [Cursor](01-software-factories/03-cursor.md) — Interactive coding agents, isolated cloud development environments, and event-driven automations.
- [GitHub Copilot](01-software-factories/04-github-copilot.md) — Repository-native agent sessions, cloud execution choices, pull-request review, and automations.
- [Devin](01-software-factories/05-devin.md) — Delegate a verifiable bug fix, prepare the environment and review a focused patch with evidence.
- [Factory Droid & Missions](01-software-factories/06-factory.md) — Plan, coordinate, and validate bounded multi-feature agent work with milestone evidence.
- [OpenHands](01-software-factories/07-openhands.md) — Compose an agent control surface, model access, and local or remote execution backends.
- [Paradev (formerly Superset)](01-software-factories/08-paradev.md) — A task board and workspace layer for launching and reviewing parallel coding agents.

### Agent sandboxes & remote sessions

- [E2B](02-agent-sandboxes/01-e2b.md) — An execution SDK for agent code, analysis programs, and task-scoped Linux sessions.
- [Daytona](02-agent-sandboxes/02-daytona.md) — Programmable agent workspaces with process execution, sessions, reusable environments, and lifecycle controls.
- [Modal Sandboxes](02-agent-sandboxes/03-modal.md) — Programmable isolated processes within a broader cloud-compute platform, with Python supervision and explicit networking.
- [Freestyle](02-agent-sandboxes/04-freestyle.md) — Durable Linux VMs for long-running agent work, with deliberate pause/resume, snapshots, and network policy.
- [CodeSandbox SDK](02-agent-sandboxes/05-codesandbox.md) — Programmatically create inspectable project environments with file operations, commands, and application previews.
- [Cloudflare Sandboxes](02-agent-sandboxes/06-cloudflare-sandbox.md) — Worker-controlled execution using Linux Containers or Dynamic Workers, with a current 1.0 versus legacy SDK distinction.
- [GitHub Codespaces](02-agent-sandboxes/07-github-codespaces.md) — Repository-centered development environments for reproducible human and agent collaboration.
- [Coder](02-agent-sandboxes/08-coder.md) — Self-hosted workspace infrastructure with templates and multiple native or third-party agent execution paths.

### Voice agent tooling

- [LiveKit Agents](03-voice-agents/01-livekit.md) — Code-centered voice agents with room/session abstractions and cloud deployment.
- [Pipecat](03-voice-agents/02-pipecat.md) — Compose realtime voice applications through pipelines, processors, and frames.
- [Vapi](03-voice-agents/03-vapi.md) — Managed voice orchestration with configurable providers, web calling, and server tools.
- [Retell AI](03-voice-agents/04-retell.md) — Managed voice agents with prompt and flow designs, custom functions, and testing workflows.
- [ElevenLabs Agents · ElevenAgents](03-voice-agents/05-elevenlabs.md) — Voice-oriented agent platform with knowledge, tools, client embedding, and evaluation.
- [OpenAI Realtime API](03-voice-agents/06-openai-realtime.md) — Speech-to-speech sessions with tools, turn detection, and browser/server transports.
- [Deepgram Voice Agent API](03-voice-agents/07-deepgram.md) — Managed listening, reasoning integration, and speech over a WebSocket conversation.
- [Twilio ConversationRelay](03-voice-agents/08-twilio-conversationrelay.md) — Telephone speech handling connected to your own text-oriented agent server.

### Video generation & avatars

- [Runway](04-video-and-avatars/01-runway.md) — Direct short generated shots and assemble reliable release-video assets.
- [Google Flow, Veo and Gemini video](04-video-and-avatars/02-google-veo-flow.md) — Learn the filmmaking application and distinguish current Google video API routes.
- [Kling AI](04-video-and-avatars/03-kling.md) — Direct reference-driven clips and control key moments with a clear asset-role plan.
- [Luma and Dream Machine](04-video-and-avatars/04-luma.md) — Organize boards and compare still animation, keyframes and source-footage transformation.
- [HeyGen](04-video-and-avatars/05-heygen.md) — Build scripted avatar lessons and learn the current v3 developer workflow.
- [Synthesia](04-video-and-avatars/06-synthesia.md) — Create maintainable avatar training from approved scripts and reusable templates.
- [Tavus](04-video-and-avatars/07-tavus.md) — Build and evaluate a narrow interactive video tutor using current PAL terminology.
- [D-ID](04-video-and-avatars/08-d-id.md) — Learn asynchronous avatar rendering and the separate lifecycle of real-time agents.

## Evidence and limits

Each core chapter has at least 5,000 body tokens measured using gpt-tokenizer's cl100k_base encoding; frontmatter is excluded. See the source project's research/verification.json for exact counts and final checks. Worked examples are original teaching material. Product claims link to official documentation or source. Live paid services, generated media, remote agent accounts, telephone calls, and production integrations were not executed.

These Markdown files are the offline edition of the companion Astro Starlight site. Relative guide links work in a Markdown viewer such as GitHub or an editor. Website-specific controls and full-text search belong to the site. [Sources and methodology](reference/research.md) explain research boundaries.

[Research ledgers and verification](research/verification.json) are included with this bundle.
