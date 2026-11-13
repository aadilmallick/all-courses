# Sources & research methodology


## Research snapshot

This edition was researched on **November 13, 2026** for the four categories requested: software factories and agent boards; agent sandboxes and remote sessions; voice tooling; and video/avatar generation. It contains **32 core tool guides** and **164 distinct linked primary sources** in their research ledgers. Source access dates record when information was checked, not a guarantee that pages remain unchanged.

## How tools were selected

The core set balances broadly visible developer products, established infrastructure, managed applications, open frameworks, and emerging operating models. Selection is editorial; this is not a measured market-share or popularity ranking. The ecosystem has no stable, enumerable boundary, so the guide does not claim to list every AI product. Adjacent productivity tools outside the requested categories are intentionally outside this edition.

Each core tool has one substantial chapter. Tool suites are grouped when separating an application and its model family would obscure the learning path, as with Google's video ecosystem. The emerging-tools page holds shorter research references and lifecycle notes; these are not represented as full core chapters.

## Evidence standard

Official product documentation, vendor announcements, deprecation notices, and official source repositories are the primary evidence. Current notices take precedence over older examples. Direct source links appear in each chapter and below with the claim they support. No fabricated APIs, access entitlements, live benchmark scores, or paid output samples are implied.

Worked briefs, local simulations, examples, project plans, and operating recommendations are original instructional material. They explain how to reason about a tool and evaluate it. They should not be confused with vendor guarantees. Account-specific plans, geography, consent workflows, model availability, and pricing must be checked when you run a live trial.

## Verification and its limits

The deliverable includes deterministic body token counts using the named **cl100k_base** encoding from **gpt-tokenizer**, a production website build, navigation checks, and representative offline example checks. The verification report records the actual final results. A build verifies the site; it does not validate every service integration. Live paid APIs, cloud agent accounts, generated media, audio calls, telephone calls, and production integrations were not exercised.

Some guides use complete offline simulations to explain lifecycle, dispatch, or conversation behavior. Those are explicitly separated from vendor SDK examples. Any unrun Python or account-backed snippets remain unverified at runtime even when their documented interfaces were researched.

## Updating this edition

Recheck the source for the exact tool mode you will use. Record its current version and account capability, run the smallest useful example, and compare observed behavior with the chapter. If a service has retired, preserve your artifacts and move to a maintained route rather than repeatedly retrying old credentials. See [ecosystem changes](watchlist.md).

[Download the Markdown curriculum](https://ai-workbench-developer-field-guide.unison-softw-0672.chatgpt.site/downloads/ai-workbench-curriculum.zip) for offline reading. Source files, build instructions, and verification records are also included in the local project deliverable.

## Source ledger by tool

### Codex

[Read the guide](../01-software-factories/01-codex.md) · Documented · Beginner

- [Codex CLI](https://learn.chatgpt.com/docs/cli) — Local interactive workflow, documented commands, noninteractive entry point. Accessed 2026-11-13.
- [Codex Cloud](https://learn.chatgpt.com/docs/cloud) — Cloud workspaces, laptop-independent execution, reusable environments. Accessed 2026-11-13.
- [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview) — Separate managed-harness API product boundary. Accessed 2026-11-13.

### Claude Code

[Read the guide](../01-software-factories/02-claude-code.md) · Documented; Remote Control eligibility applies · Beginner

- [Claude Code overview](https://code.claude.com/docs/en/overview) — Current installation, native Windows support, terminal/IDE/desktop/browser surfaces; page opened.. Accessed 2026-11-13.
- [CLI reference](https://code.claude.com/docs/en/cli-reference) — Interactive and print mode, continue/resume commands; page opened.. Accessed 2026-11-13.
- [Project memory](https://code.claude.com/docs/en/memory) — CLAUDE.md, auto memory, instruction auditing and /memory; page opened.. Accessed 2026-11-13.
- [Settings precedence](https://code.claude.com/docs/en/settings) — User/shared/local/managed scope, command-line settings, list merge distinctions and per-key environment interactions; page opened.. Accessed 2026-11-13.
- [Skills](https://code.claude.com/docs/en/skills) — SKILL.md directory, manual invocation, disable-model-invocation and reusable procedures; page opened.. Accessed 2026-11-13.
- [MCP tools](https://code.claude.com/docs/en/mcp) — Tool integration and local-process versus remote server distinction; page opened.. Accessed 2026-11-13.
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) — /rewind, tracked edit/conversation recovery and nuanced shell/subagent limitations; page opened.. Accessed 2026-11-13.
- [Common workflows](https://code.claude.com/docs/en/common-workflows) — --worktree, independent branches and initial commit prerequisite, plan and session flow; page opened.. Accessed 2026-11-13.
- [Remote Control](https://code.claude.com/docs/en/remote-control) — Local execution versus hosted cloud sessions, cli and in-session commands, eligible subscription login and policy constraints; page opened.. Accessed 2026-11-13.

### Cursor

[Read the guide](../01-software-factories/03-cursor.md) · Documented · Intermediate

- [Agent overview](https://cursor.com/docs/agent/overview) — Interactive agent entry point and current agent-oriented product structure.. Accessed 2026-11-13.
- [Cloud Agents](https://cursor.com/docs/cloud-agent) — Isolated cloud VM execution and development-environment role.. Accessed 2026-11-13.
- [Cloud Environment Setup](https://cursor.com/docs/cloud-agent/setup) — Ubuntu environments, guided/manual configuration, multi-repo setup, saved-environment resolution.. Accessed 2026-11-13.
- [Cloud Agent Builds](https://cursor.com/docs/cloud-agent/builds) — Environment preparation/build lifecycle distinct from application build.. Accessed 2026-11-13.
- [Rules](https://cursor.com/docs/rules) — Persistent project guidance and current rule system.. Accessed 2026-11-13.
- [Automations](https://cursor.com/docs/cloud-agent/automations) — Scheduled/event-driven cloud agents, repository scope and optional tools.. Accessed 2026-11-13.

### GitHub Copilot

[Read the guide](../01-software-factories/04-github-copilot.md) · Documented · new cloud experience · Intermediate

- [GitHub Copilot on GitHub.com and GitHub Mobile](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github) — October 28 2026 cloud experience availability, client/session/environment concepts, new versus older workflow and environment-specific repository scope.. Accessed 2026-11-13.
- [About cloud sandboxes for GitHub Copilot](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-sandboxes) — Hosted isolated Linux sessions, Cloud versus Actions, local sandbox distinction and custom environment route.. Accessed 2026-11-13.
- [Configure the development environment for agents on GitHub Actions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) — Setup-step workflow applies only to Actions-based sessions; environment customization boundaries.. Accessed 2026-11-13.
- [Starting GitHub Copilot sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions) — Current session entry points and varying pull-request creation routes.. Accessed 2026-11-13.
- [Managing agent sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) — Following session activity and evidence.. Accessed 2026-11-13.
- [Customize Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot) — Current customization documentation entry point.. Accessed 2026-11-13.
- [GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review) — Separate review capability, availability and review workflow.. Accessed 2026-11-13.
- [Copilot automations](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-automations) — Recurring/event-driven automation concepts and distinction from related agentic workflows.. Accessed 2026-11-13.

### Devin

[Read the guide](../01-software-factories/05-devin.md) · Documented; Skills recommended for new reusable work · Intermediate

- [Introducing Devin](https://docs.devin.ai/get-started/devin-intro) — Product surfaces and development-tool context; vendor task-success claims not presented as independent benchmarks.. Accessed 2026-11-13.
- [Your First Session](https://docs.devin.ai/get-started/first-run) — Ask/Agent distinction, repository setup and account-dependent agent options.. Accessed 2026-11-13.
- [Instructing Devin Effectively](https://docs.devin.ai/essential-guidelines/instructing-devin-effectively) — Task context, explicit criteria and verification principles.. Accessed 2026-11-13.
- [Hand off to Devin Cloud from Any Agent](https://docs.devin.ai/work-with-devin/devin-handoff) — Devin CLI /handoff and API-based cloud handoff paths.. Accessed 2026-11-13.
- [Devin Skills](https://docs.devin.ai/product-guides/skills) — Current SKILL.md procedure mechanism and recommended repository location.. Accessed 2026-11-13.
- [Creating Playbooks](https://docs.devin.ai/product-guides/creating-playbooks) — Explicit migration note: new accounts start with Skills rather than Playbooks from October 24, 2026.. Accessed 2026-11-13.
- [Python csv library](https://docs.python.org/3/library/csv.html) — Independent sample's DictReader and parser-error semantics.. Accessed 2026-11-13.
- [Python io library](https://docs.python.org/3/library/io.html) — Independent sample's in-memory text stream.. Accessed 2026-11-13.

### Factory Droid & Missions

[Read the guide](../01-software-factories/06-factory.md) · Documented · Intermediate

- [Droid CLI quickstart](https://docs.factory.com/droid-cli/quickstart) — First interactive coding session and review. Accessed 2026-11-13.
- [Droid CLI overview](https://docs.factory.com/droid-cli/overview) — Missions, reusable skills, MCP, and headless concepts. Accessed 2026-11-13.
- [Factory Missions](https://docs.factory.com/missions/overview) — Planning, milestones, orchestration, readiness and validation. Accessed 2026-11-13.
- [Running Missions in the CLI](https://docs.factory.com/missions/running-cli) — Monitoring and intervention. Accessed 2026-11-13.

### OpenHands

[Read the guide](../01-software-factories/07-openhands.md) · Current architecture · Advanced

- [OpenHands introduction](https://docs.openhands.dev/overview/introduction) — Ecosystem components, legacy CLI and GUI status. Accessed 2026-11-13.
- [Agent Canvas overview](https://docs.openhands.dev/openhands/usage/agent-canvas/overview) — Client, backend, workspace, model and execution boundaries. Accessed 2026-11-13.
- [Install Agent Canvas](https://docs.openhands.dev/openhands/usage/agent-canvas/setup) — Current npm package, Node and uv prerequisites. Accessed 2026-11-13.
- [Backends](https://docs.openhands.dev/openhands/usage/agent-canvas/backends) — Backend configuration entry point. Accessed 2026-11-13.
- [Issue to PR automation](https://docs.openhands.dev/openhands/usage/agent-canvas/prebuilt/issue-to-pr) — Supported issue automation documentation entry point. Accessed 2026-11-13.

### Paradev (formerly Superset)

[Read the guide](../01-software-factories/08-paradev.md) · Platform-limited · Intermediate

- [Paradev website](https://paradev.com/) — Superset rebrand and workspace positioning. Accessed 2026-11-13.
- [Install](https://docs.paradev.com/install) — macOS, experimental Linux, Windows unavailable; agent subscriptions separate. Accessed 2026-11-13.
- [Tasks](https://docs.paradev.com/tasks) — Kanban/list, Linear and GitHub task sources, task-to-agent prompts and staged execution. Accessed 2026-11-13.
- [Workspaces](https://docs.paradev.com/workspaces) — Local worktrees versus cloud clones, workspace identities and lifecycle. Accessed 2026-11-13.

### E2B

[Read the guide](../02-agent-sandboxes/01-e2b.md) · Documented · Intermediate

- [Running your first Sandbox](https://docs.e2b.dev/quickstart) — Code Interpreter versus core SDK distinction, Python installation, create and run_code pattern; page opened.. Accessed 2026-11-13.
- [Sandbox lifecycle](https://docs.e2b.dev/sandbox) — Explicit timeout, sandbox information, and kill method; page opened.. Accessed 2026-11-13.
- [Sandbox persistence](https://docs.e2b.dev/sandbox/persistence) — Pause/resume state distinctions, filesystem-only alternative, terminal kill; page opened. Recheck version and rollout-specific behavior.. Accessed 2026-11-13.

### Daytona

[Read the guide](../02-agent-sandboxes/02-daytona.md) · Documented; separate v2 alpha · Intermediate

- [Python SDK Reference](https://www.daytona.io/docs/en/python-sdk/) — Documented v0.231 line, separate v2.0 Alpha link, installation, environment configuration, create pattern; page opened.. Accessed 2026-11-13.
- [Process reference](https://www.daytona.io/docs/en/python-sdk/sync/process/) — exec and code_run signatures, result and exit_code fields, cwd, timeout, sessions and PTY; page opened.. Accessed 2026-11-13.
- [Daytona lifecycle methods](https://www.daytona.io/docs/en/python-sdk/sync/daytona/) — delete with wait flag, start/get, lifecycle parameters and differing zero meanings; page opened.. Accessed 2026-11-13.
- [Snapshots](https://www.daytona.io/docs/en/snapshots/) — Reusable environment preparation; page opened. No assumption of cross-provider snapshot compatibility.. Accessed 2026-11-13.

### Modal Sandboxes

[Read the guide](../02-agent-sandboxes/03-modal.md) · Documented; some advanced features beta · Intermediate

- [Getting started with Modal](https://modal.com/docs/guide/getting-started) — modal package and CLI setup authentication; page opened.. Accessed 2026-11-13.
- [Sandboxes](https://modal.com/docs/guide/sandboxes) — App.lookup, Sandbox.create, exec, stdout, terminate, direct Python script pattern, current runtime alternatives; page opened.. Accessed 2026-11-13.
- [Running commands in Sandboxes](https://modal.com/docs/guide/sandbox-spawn) — Process command and stream semantics; page opened.. Accessed 2026-11-13.
- [Networking and security](https://modal.com/docs/guide/sandbox-networking) — block_network, CIDR and beta domain allowlist distinctions and interactions; page opened.. Accessed 2026-11-13.

### Freestyle

[Read the guide](../02-agent-sandboxes/04-freestyle.md) · Documented · Advanced

- [Freestyle quickstart](https://www.freestyle.sh/docs/quickstart) — freestyle package, CLI login/token setup, FREESTYLE_API_KEY, create and exec pattern; page opened.. Accessed 2026-11-13.
- [Freestyle VMs](https://www.freestyle.sh/docs/vms) — create return shape, vmId, stdout/statusCode, text file methods, common lifecycle calls; page opened.. Accessed 2026-11-13.
- [VM Lifecycle](https://www.freestyle.sh/docs/vms/lifecycle) — Memory-preserving pause versus stop, start, deletion, policy distinctions; page opened.. Accessed 2026-11-13.
- [Firewall](https://www.freestyle.sh/docs/vms/network/firewall) — Explicit allow rules, identity/address matchers, public network scope, deny-by-absence model; page opened.. Accessed 2026-11-13.
- [Runloop transition notice](https://docs.runloop.ai/docs/transitions/overview) — Runloop service wind-down; existing-customer transition support through November 13, 2026 11:59 PM PT. Reason Freestyle replaced Runloop as an adoption chapter; page opened.. Accessed 2026-11-13.
- [Runloop to Freestyle transition](https://docs.runloop.ai/docs/transitions/runloop-to-freestyle) — Migration is not certified; IDs, blueprints, snapshots and Axon state do not transfer automatically; page opened.. Accessed 2026-11-13.

### CodeSandbox SDK

[Read the guide](../02-agent-sandboxes/05-codesandbox.md) · Documented; official source used · Intermediate

- [CodeSandbox SDK repository](https://github.com/codesandbox/codesandbox-sdk) — Official README package installation, CSB_API_KEY, create/connect/commands.run pattern. Main codesandbox.io/docs/sdk endpoint returned 403, so source was used.. Accessed 2026-11-13.
- [Sandbox management source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/Sandboxes.ts) — Explicit private option, default preview nuance, delete, hibernate, shutdown, resume behavior; raw official source opened.. Accessed 2026-11-13.
- [Sandbox client source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/index.ts) — workspacePath, fs and commands namespaces, connection/disposal distinction; raw official source opened.. Accessed 2026-11-13.
- [Filesystem source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/filesystem.ts) — writeTextFile signature; raw official source opened.. Accessed 2026-11-13.
- [Command source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/commands.ts) — commands.run return string, cwd option, shell composition, background command support and failures; raw official source opened.. Accessed 2026-11-13.
- [Sandpack introduction](https://sandpack.codesandbox.io/docs) — Sandpack is a separate embedded coding toolkit; page opened.. Accessed 2026-11-13.

### Cloudflare Sandboxes

[Read the guide](../02-agent-sandboxes/06-cloudflare-sandbox.md) · Public beta scheduling; 1.0 transition · Advanced

- [Sandboxes overview](https://developers.cloudflare.com/sandbox/) — Two environments, Workers Paid availability, current Linux microVM model and public-beta Durable Object scheduling; page opened.. Accessed 2026-11-13.
- [Run a Linux command](https://developers.cloudflare.com/sandbox/get-started/) — Current wrangler config shape, DurableObject container start/exec/output pattern, image, type generation, Docker and Wrangler prerequisites; page opened.. Accessed 2026-11-13.
- [Current SDK reference](https://developers.cloudflare.com/sandbox/reference/) — 1.0 helper classes use caller-started container, Files constructor and lifecycle boundary; page opened.. Accessed 2026-11-13.
- [Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/) — Legacy documentation explicitly for existing applications and different 1.0 library; page opened.. Accessed 2026-11-13.
- [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) — Sandbox unit of trust, task identity, credentials, output validation and separate preview-origin boundary; page opened.. Accessed 2026-11-13.

### GitHub Codespaces

[Read the guide](../02-agent-sandboxes/07-github-codespaces.md) · Documented · Beginner

- [Codespaces quickstart](https://docs.github.com/en/codespaces/quickstart) — Browser editor, template, run, preview port, commit and publish workflow; page opened.. Accessed 2026-11-13.
- [Introduction to dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) — Configuration location, image/build patterns, shared customization versus personalization, rebuild preservation boundaries; page opened.. Accessed 2026-11-13.
- [Official Python development image](https://github.com/devcontainers/images/blob/main/src/python/README.md) — Current official image README lists mcr.microsoft.com/devcontainers/python:3.12-bookworm; page opened. Image pull and organization approval remain unrun.. Accessed 2026-11-13.
- [Codespace lifecycle](https://docs.github.com/en/codespaces/about-codespaces/understanding-the-codespace-lifecycle) — Disconnect, stop, rebuild, deletion distinctions; page opened.. Accessed 2026-11-13.
- [GitHub CLI guide](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli) — Authentication and singular gh codespace command workflow; page opened.. Accessed 2026-11-13.
- [CLI create manual](https://cli.github.com/manual/gh_codespace_create) — Creation command reference; page opened.. Accessed 2026-11-13.
- [CLI SSH manual](https://cli.github.com/manual/gh_codespace_ssh) — Remote shell command reference; page opened.. Accessed 2026-11-13.
- [CLI stop manual](https://cli.github.com/manual/gh_codespace_stop) — Stop command reference; page opened.. Accessed 2026-11-13.

### Coder

[Read the guide](../02-agent-sandboxes/08-coder.md) · Documented; Relay beta · Advanced

- [Run AI coding agents in Coder](https://coder.com/docs/ai-coder) — Native agents, Relay beta, IDE and template CLI paths; AI Governance licensing; page opened, v2.39 Mainline.. Accessed 2026-11-13.
- [Coder Agents](https://coder.com/docs/ai-coder/agents/) — Native self-hosted control-plane loop, workspace tool access and distinction from third-party wrappers; page opened.. Accessed 2026-11-13.
- [Getting started](https://coder.com/docs/ai-coder/agents/getting-started/) — Deployment, provider, template and administrative prerequisites; page opened.. Accessed 2026-11-13.
- [Manage workspaces](https://coder.com/docs/user-guides/workspace-management/) — User create-from-template workflow and lifecycle entry points; page opened.. Accessed 2026-11-13.
- [Work with templates](https://coder.com/docs/admin/templates/managing-templates/) — Terraform templates, template builder and administrative role boundary; page opened.. Accessed 2026-11-13.
- [Template optimization](https://coder.com/docs/ai-coder/agents/platform-controls/template-optimization) — Agent template discoverability, descriptions, and eligibility controls; page opened.. Accessed 2026-11-13.

### LiveKit Agents

[Read the guide](../03-voice-agents/01-livekit.md) · Documented · Intermediate

- [Voice AI quickstart](https://docs.livekit.io/agents/start/voice-ai/) — Python/Node starters, current prerequisites, CLI install and initialization.. Accessed 2026-11-13.
- [Agent Builder](https://docs.livekit.io/agents/start/builder/) — Browser prototyping route and relationship to SDK code.. Accessed 2026-11-13.
- [Coding agent support and tools](https://docs.livekit.io/intro/coding-agents/) — Current coding-agent resources, debugger and text/audio testing distinction.. Accessed 2026-11-13.
- [Agent deployment quickstart](https://docs.livekit.io/deploy/agents/quickstart/) — Initial cloud registration, deployment configuration, status and logs.. Accessed 2026-11-13.

### Pipecat

[Read the guide](../03-voice-agents/02-pipecat.md) · Documented · Intermediate

- [Pipecat quickstart](https://docs.pipecat.ai/pipecat/get-started/quickstart) — Python/uv setup, CLI scaffolding, local browser client, provider keys and cloud entry point.. Accessed 2026-11-13.
- [Pipeline and Frame Processing](https://docs.pipecat.ai/pipecat/learn/pipeline) — Core pipeline/frame composition model and current learning navigation.. Accessed 2026-11-13.

### Vapi

[Read the guide](../03-voice-agents/03-vapi.md) · Documented · Intermediate

- [Core Models](https://docs.vapi.ai/quickstart) — Transcriber/model/voice orchestration role.. Accessed 2026-11-13.
- [Assistants quickstart](https://docs.vapi.ai/assistants/quickstart) — Assistant creation/configuration entry point.. Accessed 2026-11-13.
- [Web calls](https://docs.vapi.ai/quickstart/web) — Web SDK package, public key constructor, start/stop and call events.. Accessed 2026-11-13.
- [Function tools](https://docs.vapi.ai/tools/custom-tools) — Custom server function setup and request/response contract.. Accessed 2026-11-13.
- [Vapi CLI](https://docs.vapi.ai/cli) — Documented CLI login, init and assistant create commands.. Accessed 2026-11-13.
- [Official Vapi Web SDK source](https://raw.githubusercontent.com/VapiAI/client-sdk-web/main/vapi.ts) — Asynchronous error and call-start-failed event signatures, audio failure emission, and asynchronous stop cleanup. Accessed 2026-11-13.

### Retell AI

[Read the guide](../03-voice-agents/04-retell.md) · Documented · Beginner

- [Retell documentation index](https://docs.retellai.com/llms.txt) — Current feature naming/navigation including Conductor and testing routes; not an API schema.. Accessed 2026-11-13.
- [Build your first phone agent](https://docs.retellai.com/get-started/quick-start) — Account, agent setup and first testing workflow.. Accessed 2026-11-13.
- [Single prompt vs conversation flow](https://docs.retellai.com/build/choose-agent-type) — Current agent design choices and single-prompt starting guidance.. Accessed 2026-11-13.
- [Custom functions](https://docs.retellai.com/build/single-multi-prompt/custom-function) — Calling own APIs during conversation.. Accessed 2026-11-13.
- [Website widget](https://docs.retellai.com/deploy/chat-widget) — Chat/voice and callback modes, public-key configuration, agent identifiers.. Accessed 2026-11-13.

### ElevenLabs Agents · ElevenAgents

[Read the guide](../03-voice-agents/05-elevenlabs.md) · Documented · Beginner

- [ElevenAgents overview](https://elevenlabs.io/docs/eleven-agents/overview) — Current ElevenAgents naming and platform role.. Accessed 2026-11-13.
- [Quickstart](https://elevenlabs.io/docs/eleven-agents/quickstart) — Dashboard setup, knowledge/voice test flow, widget HTML and evaluation entry point.. Accessed 2026-11-13.
- [Knowledge base](https://elevenlabs.io/docs/eleven-agents/customization/knowledge-base) — Source ingestion and full-context versus retrieval usage.. Accessed 2026-11-13.
- [Tools](https://elevenlabs.io/docs/eleven-agents/customization/tools) — Client, webhook, code, MCP and system tool types.. Accessed 2026-11-13.
- [Agent authentication](https://elevenlabs.io/docs/eleven-agents/customization/authentication) — Protected conversation access guidance.. Accessed 2026-11-13.
- [Success evaluation](https://elevenlabs.io/docs/eleven-agents/customization/agent-analysis/success-evaluation) — Conversation evaluation capabilities and criteria.. Accessed 2026-11-13.

### OpenAI Realtime API

[Read the guide](../03-voice-agents/06-openai-realtime.md) · Documented · Advanced

- [Getting started with Realtime](https://developers.openai.com/api/docs/guides/realtime) — Current SDK session pattern, documented model example and GA migration routes.. Accessed 2026-11-13.
- [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) — Media/control transport and ephemeral credential server flow.. Accessed 2026-11-13.
- [Voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad) — Current turn-detection configuration guide.. Accessed 2026-11-13.
- [Realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations) — Conversation state, audio and interruption mechanisms.. Accessed 2026-11-13.
- [Realtime with tools](https://developers.openai.com/api/docs/guides/realtime-mcp) — Tools and external integration entry point.. Accessed 2026-11-13.
- [Getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live) — Separate full-duplex/delegated-backend architecture, distinguished from Realtime.. Accessed 2026-11-13.

### Deepgram Voice Agent API

[Read the guide](../03-voice-agents/07-deepgram.md) · Documented · Intermediate

- [Voice Agent getting started](https://developers.deepgram.com/docs/voice-agent) — Combined speech pipeline role.. Accessed 2026-11-13.
- [Build a Voice Agent](https://developers.deepgram.com/docs/build-a-voice-agent) — Endpoint, lifecycle, regional routes and connection-time usage accounting.. Accessed 2026-11-13.
- [JavaScript guide](https://developers.deepgram.com/docs/build-a-voice-agent-javascript) — Official JavaScript implementation path.. Accessed 2026-11-13.
- [Configure the Voice Agent](https://developers.deepgram.com/docs/configure-voice-agent) — Settings and audio configuration fields.. Accessed 2026-11-13.
- [Voice Agent API reference](https://developers.deepgram.com/reference/voice-agent/voice-agent) — Current WebSocket protocol reference.. Accessed 2026-11-13.

### Twilio ConversationRelay

[Read the guide](../03-voice-agents/08-twilio-conversationrelay.md) · Documented · Advanced

- [ConversationRelay overview](https://www.twilio.com/docs/voice/conversationrelay) — Voice application role and documentation routes.. Accessed 2026-11-13.
- [Product overview](https://www.twilio.com/en-us/products/conversational-ai/conversationrelay) — Speech handling and own-model architecture.. Accessed 2026-11-13.
- [ConversationRelay TwiML noun](https://www.twilio.com/docs/voice/conversationrelay/conversationrelay-noun) — Connect/ConversationRelay XML structure and endpoint configuration.. Accessed 2026-11-13.
- [WebSocket messages](https://www.twilio.com/docs/voice/conversationrelay/websocket-messages) — Prompt/text/interrupt fields, final markers and token-spacing guidance.. Accessed 2026-11-13.
- [Onboarding](https://www.twilio.com/docs/voice/conversationrelay/onboarding) — Current application setup entry point.. Accessed 2026-11-13.

### Runway

[Read the guide](../04-video-and-avatars/01-runway.md) · Documented; model and account availability varies · Beginner

- [Getting Started with Generative Video](https://help.runwayml.com/hc/en-us/articles/37425232841875-Getting-Started-with-Generative-Video) — Creation surfaces, text/image modes, model selection and iteration concepts.. Accessed 2026-11-13.
- [Text to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/47313737321107-Text-to-Video-Prompting-Guide) — Gen-4.5-oriented visual and motion prompting guidance.. Accessed 2026-11-13.
- [Creating with Gen-4 Video](https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video) — Older-model status and explicit links to newer workflows; old rates not generalized.. Accessed 2026-11-13.

### Google Flow, Veo and Gemini video

[Read the guide](../04-video-and-avatars/02-google-veo-flow.md) · Flow documented; Gemini Veo Preview retired; current API alternatives documented · Intermediate

- [Create videos in Google Flow](https://support.google.com/flow/answer/16353334) — Text, references, frames and model-setting concepts.. Accessed 2026-11-13.
- [Get started with Google Flow](https://support.google.com/flow/answer/16353333) — Age, region, browser and subscription eligibility conditions.. Accessed 2026-11-13.
- [Video generation in the Gemini API](https://aistudio.google.com/docs/video) — Direct-open current page supersedes stale search result: Veo 3.1 Preview aliases shut down October 22, 2026; Gemini Omni Flash or enterprise GA Veo routes recommended.. Accessed 2026-11-13.
- [Generate and edit videos with Gemini Omni Flash](https://aistudio.google.com/docs/omni) — Current gemini-omni-1.2-flash Interactions SDK example and output_video SDK convenience field.. Accessed 2026-11-13.
- [Veo 3.1 enterprise documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) — Separate enterprise route for generally available Veo-specific work.. Accessed 2026-11-13.
- [Google Flow models and supported features](https://support.google.com/flow/answer/16352836) — Current product-specific feature-matrix reference.. Accessed 2026-11-13.

### Kling AI

[Read the guide](../04-video-and-avatars/03-kling.md) · Kling 4.0 documented; launch limits and coming-soon labels require account checks · Intermediate

- [Kling AI Quickstart and User Guide](https://kling.ai/quickstart) — Official current model-guide index.. Accessed 2026-11-13.
- [Kling 4.0 User Guide](https://kling.ai/quickstart/kling-4-model-user-guide) — November 4, 2026 guide; Omni Reference versus Keyframes; actual-interface caveat and future-feature labels.. Accessed 2026-11-13.
- [Kling VIDEO 3.0 Omni Guide](https://kling.ai/quickstart/klingai-video-3-omni-model-user-guide) — Adjacent older-generation reference, not a source of assumed 4.0 limits.. Accessed 2026-11-13.

### Luma and Dream Machine

[Read the guide](../04-video-and-avatars/04-luma.md) · Documented; workspace and individual model capabilities differ · Intermediate

- [The New Luma app](https://lumalabs.ai/learning-hub/the-new-luma-app-creative-multimodal-agent) — Board and creative-agent workspace concepts. Broad model lists can lag provider deprecations and are not treated as guaranteed active routes.. Accessed 2026-11-13.
- [Ray3.14 User Guide](https://lumalabs.ai/learning-hub/ray314-user-guide) — Model-specific workflow distinctions and stated reference/character/Reframe limitations.. Accessed 2026-11-13.
- [Dream Machine Modify Video](https://lumalabs.ai/learning-hub/modify-video-dream-machine) — Transformation concepts and source-motion stability considerations.. Accessed 2026-11-13.
- [How to use Keyframes](https://lumalabs.ai/learning-hub/how-to-use-keyframes) — Start/end image roles; older defaults not generalized to every model.. Accessed 2026-11-13.
- [How to use Extend](https://lumalabs.ai/learning-hub/how-to-use-extend) — Continuation and optional visual destination concepts.. Accessed 2026-11-13.

### HeyGen

[Read the guide](../04-video-and-avatars/05-heygen.md) · Current v3 documented; v1/v2 sunset passed October 31, 2026 · Intermediate

- [HeyGen Developer Quick Start](https://developers.heygen.com/docs/quick-start) — Direct model versus application APIs, v3 workflow and explicit v1/v2 sunset notice.. Accessed 2026-11-13.
- [Avatar 6](https://developers.heygen.com/docs/models/avatar-6) — Current direct model avatar route and image/audio input concepts.. Accessed 2026-11-13.
- [API Key](https://developers.heygen.com/docs/api-key) — Current credential setup reference.. Accessed 2026-11-13.
- [Quick Avatar Video](https://help.heygen.com/en/articles/12903996-quick-avatar-video) — Simple application workflow. Older named app engines not generalized to latest model API.. Accessed 2026-11-13.

### Synthesia

[Read the guide](../04-video-and-avatars/06-synthesia.md) · Documented; plan-specific creation routes vary · Beginner

- [Video Creation](https://docs.synthesia.io/docs/video-creation) — Starting routes and exact-script versus source-file transformation distinction.. Accessed 2026-11-13.
- [Assistant](https://docs.synthesia.io/docs/assistant) — Editable outlines, storyboard flow and current versus legacy script-import route distinctions.. Accessed 2026-11-13.
- [Script box](https://docs.synthesia.io/docs/script) — Voice, pacing, pronunciation and variable speech takes.. Accessed 2026-11-13.
- [Templates](https://docs.synthesia.io/docs/synthesia-templates) — Reusable scene designs and variable concepts.. Accessed 2026-11-13.
- [Bulk personalization](https://docs.synthesia.io/docs/bulk-personalization) — Tabular field mapping and batch production reference.. Accessed 2026-11-13.

### Tavus

[Read the guide](../04-video-and-avatars/07-tavus.md) · Documented; current PAL/Face/Voice terminology with legacy compatibility · Advanced

- [Introduction](https://docs.tavus.io/sections/introduction) — CVI, PAL, Face, Voice and legacy persona/replica compatibility.. Accessed 2026-11-13.
- [What Is a PAL?](https://docs.tavus.io/sections/conversational-video-interface/pal/what-is-a-pal) — Conceptual configuration of the conversational entity.. Accessed 2026-11-13.
- [API Conversation Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/cvi-quickstart) — PAL creation, POST /v2/conversations using pal_id and returned join URL.. Accessed 2026-11-13.
- [Models](https://docs.tavus.io/sections/models) — Current pipeline-model context; no benchmark claims inferred.. Accessed 2026-11-13.

### D-ID

[Read the guide](../04-video-and-avatars/08-d-id.md) · Documented; new live integrations should use Agents SDK/Streams · Intermediate

- [Quickstart](https://docs.d-id.com/docs/quickstart) — Current asynchronous video and real-time product paths.. Accessed 2026-11-13.
- [V2 Photo Avatar Quickstart](https://docs.d-id.com/docs/v2-photo-avatar-quickstart) — Documented asynchronous Talks route, status, result URL and limited result-URL lifetime.. Accessed 2026-11-13.
- [V4 Expressive Avatar Quickstart](https://docs.d-id.com/docs/v4-expressive-avatar-quickstart) — Avatar/sentiment discovery and render concepts.. Accessed 2026-11-13.
- [Agents](https://docs.d-id.com/docs/agent-quickstart) — Current agent configuration path, separate from fixed video.. Accessed 2026-11-13.
- [Agent Sessions](https://docs.d-id.com/docs/agent-session-quickstart) — Current live-session route.. Accessed 2026-11-13.
- [Talks Streams Overview](https://docs.d-id.com/reference/talks-streams-overview) — Explicit legacy live-streaming notice and recommendation for new integrations.. Accessed 2026-11-13.

