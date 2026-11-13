# Emerging tools & ecosystem changes


## Read this before following an old tutorial

Research checked November 13, 2026. This page distinguishes active learning paths from lifecycle references and early architecture projects. It is not a claim that every account can access every feature. The thirty-two full chapters are in the [tool directory](../README.md).

| Tool or surface | Verified change | Learning implication |
| --- | --- | --- |
| Vibe Kanban | Company shutdown announced April 10; remote services sunset and local workspaces described as continuing | Use the [lifecycle note](changes-vibe-kanban.md); check community-maintained source before local adoption |
| Runloop | Services winding down; transition support through November 13, 2026, 11:59 PM Pacific | Study migration concepts in [Freestyle](../02-agent-sandboxes/04-freestyle.md), not new Runloop onboarding |
| Sora Videos API | Official deprecations list September 24, 2026 shutdown for Videos API and sora-2 variants | Do not build a new API lab around those endpoints; consumer-app status is a separate, unverified question |
| Google's video APIs | Current guide reports October 22 retirement of Veo 3.1 Preview aliases | Read the [current Google suite chapter](../04-video-and-avatars/02-google-veo-flow.md) for app/API distinctions |
| HeyGen API | Current quickstart uses v3 after the v1/v2 sunset | Use the [current HeyGen chapter](../04-video-and-avatars/05-heygen.md) before adapting an old integration |
| OpenHands | Canvas/Server/SDK architecture supersedes old CLI/GUI starting points | Follow [current OpenHands setup](../01-software-factories/07-openhands.md) |
| Superset | Developer workspace product renamed Paradev | Read [Paradev](../01-software-factories/08-paradev.md); it is unrelated to Apache Superset |
| GitHub Copilot | New cloud experience documented from October 28, 2026 | Distinguish cloud sandboxes, Actions-based execution, and remote environments |
| Devin | New accounts use Skills; older Playbook routes have a migration boundary | Follow the [Devin guide](../01-software-factories/05-devin.md) for the current path |

Primary notices: [Vibe Kanban](https://www.vibekanban.com/blog/shutdown), [Runloop](https://docs.runloop.ai/docs/transitions/overview), [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations), [Google video guide](https://aistudio.google.com/docs/video), [HeyGen quickstart](https://developers.heygen.com/docs/quick-start), [OpenHands introduction](https://docs.openhands.dev/overview/introduction), [Paradev](https://paradev.com/), [Copilot cloud concepts](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github), [Devin reusable work](https://docs.devin.ai/product-guides/creating-playbooks). The individual chapters carry the fuller source and version context.

## Frontier architecture reading

These are shorter research references for advanced exploration, not drop-in replacements or full core-tool lessons.

**Symphony** connects issue-tracker work to isolated agent implementation runs. The official repository calls it an engineering preview for trusted environments and provides a specification plus an experimental reference implementation. Study the distinction between task dispatch, agent execution, and proof of work after completing the factory category. Do not interpret the demo as a managed-service entitlement or an operating guarantee. [Official Symphony repository](https://github.com/openai/symphony).

**StrongDM Attractor** publishes natural-language specifications for building an agent and software-factory workflow. It is useful for studying what must be specified when you control orchestration and the agent loop. Treat the repository as a specification and implementation exercise, not an installer for a turnkey hosted factory. Begin by implementing one bounded behavior and validating it against explicit examples. [Official Attractor repository](https://github.com/strongdm/attractor).

**Conductor** is another workspace-layer approach for parallel coding agents. Its official documentation describes per-task workspaces, branches, terminals, and a review path. Compare those concepts with Paradev and verify the current platform and cloud lifecycle before a trial. This edition does not certify Conductor account access or cloud continuity. [Official Conductor documentation](https://www.conductor.build/docs).

## How to evaluate the next tool you discover

Identify which layer it replaces, what authority it requires, what artifact you can export, and what happens when execution fails. Check an official quickstart and a current lifecycle or release notice. Run one synthetic task and inspect evidence. Add a new tool to your workflow only when it improves a concrete outcome or teaches a missing concept.

The curriculum is a dated, researched snapshot. It does not run automatic monitoring or silently update itself. Keep a short note of sources and observed changes when you revisit a tool.

