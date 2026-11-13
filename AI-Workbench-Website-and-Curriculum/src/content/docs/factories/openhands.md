---
title: OpenHands
description: Understand Agent Canvas, agent servers, model access, and execution backends, then build a controlled issue-to-change workflow.
sidebar:
  order: 7
---

## The learning goal

OpenHands is an ecosystem rather than one inseparable application. Its current documentation distinguishes Agent Canvas, the Software Agent SDK and Agent Server, Cloud, Enterprise, and Sandbox Server. Agent Canvas is the browser control surface; a backend owns execution and working state. The legacy CLI and `openhands serve` GUI are no longer the recommended starting point. Start with current documentation before following older Docker tutorials. [OpenHands introduction](https://docs.openhands.dev/overview/introduction).

This chapter teaches a practical consequence of that architecture: you must know where an agent runs, which files it can access, and which model-access path it uses. You will prepare a training workspace, trace a conversation through these layers, and design an issue-to-change workflow with an explicit readiness gate. Allow four to six hours. Read [Foundations](/foundations/) first; the [sandbox category](/sandboxes/) provides more detail if infrastructure is your focus.

The research snapshot is November 13, 2026. Commands and product concepts are linked to official pages. The issue fixtures, local readiness checker, debugging method, and workflow policies are original learning examples. Nothing here implies that an OpenHands service, local backend, model account, or automated pull request was actually started while writing this material.

## The problem: an agent needs more than a chat window

Suppose you want an agent to fix incoming documentation issues. You can paste an issue into a chat, copy the proposed patch, apply it, run checks, and open a review. That workflow works for a few changes, but the transitions become repetitive. You want the agent to inspect files, run the documentation build, and present the resulting patch in the same working context.

Now suppose your laptop cannot remain on overnight, or your organization requires work to run on an approved machine. The chat window alone does not solve either problem. You need to choose an execution backend, configure the project environment, and provide a model. OpenHands makes these components visible, which is powerful when you need control and confusing when you assume the browser is doing all the work.

The useful mental model is a control room connected to a workshop. Canvas is where you direct and inspect work. The backend is the workshop containing the tools and project. The model supplies decisions about what to do next. Changing the control room’s appearance does not install a missing compiler in the workshop. Changing the model does not move the project files to another machine.

## Draw the boundary before installing

Answer four questions in a short setup note: where will commands execute, which project directory will be visible, where will model requests go, and what must persist after shutdown? These are concrete decisions. “Run locally” is incomplete if a local browser connects to a remote backend. “Use Docker” is incomplete if you mount your entire home folder into the container.

For the first lab, choose a dedicated training folder with synthetic issues and a small Markdown project. Keep it independent of private repositories. Record whether your intended backend runs directly on your machine, in a container, or on a remote host. Then choose a model-access path supported by that backend. A subscription login available in your laptop’s CLI may not exist in a remote container.

Decide what “stop” means. Closing a browser, closing a terminal, stopping a container, and deleting a remote machine are different lifecycle events. Before a long task, test a harmless start-and-stop cycle and verify which conversations, settings, files, and processes remain. Do not discover persistence behavior by losing the only copy of a useful patch.

## Choose a setup path deliberately

The official Agent Canvas overview describes local, Docker, VM, and cloud backend options, and several model-access patterns. It also distinguishes the client from the execution boundary. Use a local direct setup for a small trusted training folder when simplicity matters; use a container or VM when you need a clearer file boundary; consider managed Cloud when operating the backend is not your learning goal. [Agent Canvas overview](https://docs.openhands.dev/openhands/usage/agent-canvas/overview).

The tradeoff is operational responsibility. Direct local execution can reuse your installed tools, but also inherits more machine assumptions. Containers make dependencies and mounts explicit, but introduce image, volume, and port concepts. A remote VM can remain available independently of your laptop, but requires host maintenance and access control. Managed execution transfers some operations to the provider, while account limits and supported configurations become relevant.

Do not choose self-hosting merely because the project has open-source components. You may want the source for inspection or extensibility while still preferring managed operation. Conversely, a hosted service’s convenience does not make it suitable for a workload with specific network or data requirements. Start with the constraint you actually have.

## Install current Agent Canvas

For the documented npm route, the current setup page requires Node.js 24 or later and `uv`. Verify prerequisites first:

```sh
node --version
npm --version
uv --version
```

Then follow the official installation instructions. At the researched snapshot, the npm path is:

```sh
npm install -g @openhands/agent-canvas
agent-canvas
```

The setup page documents the default local address and additional Docker, installer, and source options. Use the address actually printed by your process and follow first-time setup. A browser page loading proves the client is reachable; it does not yet prove model access or workspace execution. [Install Agent Canvas](https://docs.openhands.dev/openhands/usage/agent-canvas/setup).

This curriculum does not ask you to run those installation commands against an existing production workstation without understanding the selected path. For a dedicated learning machine, the direct route is convenient. For a container route, copy the current official command for your shell and narrow the project mount to your training directory. Windows PowerShell and Bash use different continuation and path syntax.

If prerequisites fail, repair that layer before continuing. An old Node runtime may prevent startup. A missing `uv` executable may prevent the local agent server from launching. A port conflict may make the browser point at another process. None of these is a reason to rewrite the agent prompt or change models.

## Configure one model and one workspace

Choose a supported model configuration and provide credentials through the supported settings, not a committed project file. A model profile names how the backend reaches a provider or local model. A workspace identifies where the agent reads and edits files. Confirm both before a conversation that can modify anything.

Use a read-only introductory request: “List the files in this training workspace, identify the Markdown build or check command, and do not edit yet.” The response should correspond to actual files you can inspect. If it lists a different project, stop and correct the workspace. If the model request fails, inspect authentication and provider connectivity. If listing files fails, inspect backend permissions and paths.

Then ask the agent to run one harmless command, such as the project’s version or check command, and show the result. This separates the ability to generate a response from the ability to execute project tools. A model can confidently describe a command even when the backend cannot run it. Your first milestone is observing successful execution in the intended folder.

Record the model profile and backend used for the experiment. You do not need a full infrastructure inventory, but you do need enough information to reproduce a failure. “The same chat worked yesterday” is less useful than “this profile, on this backend, at this project revision, with this runtime.”

## Define an issue that is ready for an agent

Our original training workflow accepts documentation issues only after they contain enough information to act. A useful issue has a clear goal, a relevant file or entry point, an example of the wrong behavior, and an acceptance condition. This gate protects both the agent and reviewer from a vague assignment.

Compare these issues:

```text
Weak: The installation guide is bad. Fix it.

Ready: In docs/install.md, the quickstart uses a command that no longer
exists. The current package script is "npm run preview". Replace the
outdated command, keep the explanation suitable for a first-time user,
and verify the documented sequence against the project scripts.
Do not change runtime dependencies or unrelated pages.
```

The ready issue names the observed mismatch and limits scope without dictating every sentence. It can still be wrong: perhaps `preview` requires a build first. The agent should inspect the repository and explain that dependency. Readiness means the issue is actionable enough to investigate, not that every assumption is infallible.

A triage stage can separate issues into ready, needs clarification, duplicate, and outside scope. Those are teaching states, not claims about a built-in OpenHands board. The important boundary is that an external issue does not automatically become permission for every action it requests. Treat issue text as an input to an authorized workflow.

## A runnable readiness checker

Save this original fixture as `issues.json`:

```json
[
  {
    "id": "DOC-12",
    "goal": "Repair preview instructions",
    "file": "docs/install.md",
    "example": "Guide says npm run serve; package uses preview",
    "acceptance": "Documented sequence matches package scripts",
    "labels": ["documentation", "ready-for-agent"]
  },
  {
    "id": "DOC-13",
    "goal": "Make docs better",
    "labels": ["documentation"]
  }
]
```

Save this as `readiness.mjs`:

```js
import fs from 'node:fs';

export function inspectIssue(issue) {
  const missing = ['id', 'goal', 'file', 'example', 'acceptance']
    .filter(key => typeof issue[key] !== 'string' || !issue[key].trim());
  const labels = Array.isArray(issue.labels) ? issue.labels : [];
  return {
    id: issue.id || '(missing id)',
    ready: missing.length === 0 && labels.includes('ready-for-agent'),
    missing,
    gated: !labels.includes('ready-for-agent')
  };
}

if (process.argv[2]) {
  const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (!Array.isArray(input)) throw new Error('Expected an issue array');
  console.log(JSON.stringify(input.map(inspectIssue), null, 2));
}
```

Run `node readiness.mjs issues.json`. `DOC-12` should be ready. `DOC-13` should list missing fields and remain gated. The function uses a list of required keys and checks that each contains text. The label is an additional workflow signal. A complete-looking description without the readiness signal does not start work automatically.

This checker demonstrates a policy boundary, not an OpenHands API. It does not authenticate users, parse arbitrary malicious data, or replace human triage. Its educational value is that the dispatch condition is visible and testable. You can ask an agent to improve the checker only after you understand what it currently decides.

## Delegate one ready issue through a conversation

Open a conversation against the intended backend and provide the ready issue. Ask the agent to inspect the named file and project scripts, explain any inconsistency in the issue, make the smallest coherent correction, and run the relevant documentation check. Request a patch and result report rather than immediate publication.

If the agent notices that `npm run preview` requires `npm run build`, it should update the sequence and explain why. This is a good example of following the goal rather than blindly copying the issue’s proposed replacement. Your acceptance criterion is that the documented workflow works, not that one string appears in the file.

Review the diff for scope. A documentation correction should rarely require changing a package manager, replacing the site framework, or reformatting every page. If the agent proposes a broader fix, ask it to connect the change to the observed failure. Sometimes a build script really is broken; then a broader patch may be justified, but the reason should be concrete.

Run or inspect the documented command sequence. If the backend lacks the required runtime, have the agent state the limitation and leave an explicit follow-up. Do not accept “the command is valid” as equivalent to “the command ran successfully in this environment.” The distinction is especially important when you compare backends.

## Keep conversation history and file state distinct

A conversation can describe an old version of a file. A branch can contain edits that are not mentioned in the latest message. When resuming, inspect the current files and repository state before asking for the next change. This prevents a resumed agent from reasoning about a project that has moved on.

Branching a conversation is useful for exploring an alternative, but it does not automatically guarantee independent filesystem state. Verify the workspace isolation behavior of your selected backend. If two conversations point at the same directory, their edits can interfere even if their message histories are separate. The environment, not the visual chat separation, determines file isolation.

For a controlled comparison, create two independent workspaces from the same baseline revision. Give both the same issue. Afterward, compare patches rather than allowing the agents to modify each other’s intermediate files. This lets you distinguish independent reasoning from accidental reuse of another attempt’s work.

Keep important outcomes in the repository or intended artifact store. A conversation summary is useful context but a poor substitute for a committed instruction update, an actual fixture, or saved check output. The next developer should be able to understand the change without needing access to your chat account.

## Move from a conversation to issue automation

Only automate a workflow after a manually initiated version works. The official documentation includes an issue-to-pull-request automation path; follow its current setup and event configuration rather than inventing webhook fields from memory. [Issue-to-PR documentation](https://docs.openhands.dev/openhands/usage/agent-canvas/prebuilt/issue-to-pr).

Design a narrow initial dispatch rule: a specific training repository, documentation label, readiness signal, and one allowed delivery form. Start with a proposed patch or draft review artifact. Define who can move an issue into the ready state and what happens if the issue changes while the agent is working. These decisions prevent accidental work on stale or unauthorized requirements.

An automation needs an identity key. An issue ID alone may be insufficient if its content changes. A useful conceptual key combines the issue identity with a content revision or event identity. The exact implementation depends on the platform. Without it, repeated events can create duplicate sessions or conflicting pull requests.

Make failure visible. If the automation cannot clone the repository, the output should say setup failed. If it finds the issue already resolved, it should explain the observation rather than making a cosmetic patch. If it cannot satisfy the criteria, it should leave a useful partial report. Silence is ambiguous; it can mean success, failure, or no dispatch.

## A local simulation before connecting a live issue tracker

You can learn dispatch logic without sending messages or creating real pull requests. Extend the readiness checker with a local plan output: for every ready issue, write a JSON object containing the issue ID, target file, and requested acceptance condition. For every other issue, write the reason it was held. Keep this simulation read-only with respect to project source.

Then add a duplicate event to the fixture. If the same issue appears twice, what should happen? Decide whether the simulation should reject duplicates or collapse them to one planned task. Add an assertion for the chosen behavior. This teaches event handling before a live integration creates costly or noisy duplicate work.

Next simulate a changed issue with the same ID and a new acceptance condition. Your plan should identify which version it represents. A reviewer must not approve a patch for the old requirement while assuming it addresses the new one. Recording a content hash is one option; storing an explicit issue revision is another. The concept matters more than the exact representation.

Finally, simulate a failure during checking. The task state should distinguish planned, running, failed, and reviewable output. A failed check should not be mapped to complete simply because the process exited. These local experiments expose policy errors that are difficult to see in a successful demo of a live automation.

## Understand the SDK boundary

Use the Software Agent SDK when you are building an application that needs agent behavior as a component. Use Canvas when you primarily need a working control surface. These can complement each other, but writing a custom application is additional engineering work. The official ecosystem introduction links the current SDK and Agent Server repositories. [Component map](https://docs.openhands.dev/overview/introduction).

A custom application must handle more than sending a prompt. It needs task identity, lifecycle state, error handling, output storage, and a way for a human to inspect results. If you build a queue of documentation tasks, decide how cancellation, retries, and stale inputs work. Those responsibilities remain even if the underlying model is excellent.

Do not copy an SDK example from an older major architecture and assume it matches today’s Canvas backend. Pin a documented version, use its quickstart, and record the version with your project. If the current documentation and installed package disagree, inspect the installed package’s supported interface or upgrade deliberately. A generated import that looks plausible is not enough.

For the curriculum project, a custom SDK wrapper is optional. First demonstrate the workflow through a supported interface. Then identify a concrete missing capability that justifies code. This sequence keeps you from spending an afternoon rebuilding functionality the existing control surface already provides.

## Model profiles and fair comparison

OpenHands can be part of a comparison of models, backends, or prompts, but change one dimension at a time. If you switch both model and environment, you cannot confidently attribute the result to either. Keep the issue fixture, project revision, acceptance criteria, and check command fixed while evaluating one change.

Record quality and effort separately. A model may produce the correct patch with more tool calls but less human intervention. Another may finish quickly but require careful correction of undocumented assumptions. Measure accepted output and reviewer minutes. Token totals can explain cost, but they do not establish usefulness on their own.

If you use a local model, verify that it supports the tool workflow you need and that the backend can reach it. A successful text-generation request is only one part of an agent loop. Tool-call formatting, context capacity, and reliability under multi-step work can affect the result. Test a small file-inspection task before a large automation.

Model access and subscription access are separate from the browser’s authentication to a backend. Keep errors in their proper layer. A provider quota error is not fixed by changing the workspace mount. A backend session-key problem is not fixed by giving the model a different prompt. Trace requests through the architecture.

## Troubleshoot from the outside inward

| Failure | First question | Useful observation |
| --- | --- | --- |
| Browser does not load | Is the client process running? | Printed address and startup log |
| Browser loads but cannot connect | Is the selected backend reachable? | Backend status and connection error |
| Chat fails before any tool use | Can the model profile authenticate? | Provider error without exposing credentials |
| Agent cannot read the project | Is the path visible inside this backend? | Workspace path and mount mapping |
| Shell command is missing | Is the runtime installed where tools run? | Version command executed by backend |
| Another conversation sees edits | Are they sharing a workspace? | Actual directory or sandbox identity |
| Automation repeats work | Are events deduplicated? | Event identity and existing task mapping |
| Reopening loses expected state | What persisted across shutdown? | Volume, storage, and lifecycle configuration |

Do not respond to every error by reinstalling the entire stack. Capture the failed layer and test a minimal operation there. If the backend cannot list a mounted folder, fix the mount. If model authentication fails, check the configured profile and account permissions. A focused repair is easier to explain and less likely to introduce a second problem.

## Learn remote operation without confusing it with remote viewing

Opening Canvas from another device can be convenient, but the place you view the UI is not necessarily where commands execute. A phone can control a backend on your desktop. A laptop browser can control a backend on a VM. Identify the backend and its workspace before assuming a task will survive your local machine sleeping.

For an always-on learning setup, first move a harmless training task to the remote backend and run a version command. Confirm the remote runtime and directory. Then disconnect the viewing device and verify the intended lifecycle behavior through the supported controls. Do not use a production deployment as your first persistence experiment.

When a remote backend needs source access, use credentials intended for that environment and workload. Your local authenticated browser session does not automatically authenticate Git in a container. Conversely, exposing a backend service can expose command execution if access is misconfigured. Follow the official remote-backend guidance and keep the initial setup reachable only through an approved access path.

## Optional application: a documentation maintenance queue

Create ten synthetic issues with a mix of ready, ambiguous, duplicate, and out-of-scope requests. Run your local readiness simulation and inspect every decision. Choose two ready issues that touch separate pages and process them through independent workspaces. Leave the others as explicit held tasks with reasons.

Your deliverables are the issue fixture, dispatch policy, two reviewable patches, check output, and a short operating note describing backend, model access, workspace isolation, and shutdown behavior. A second reader should be able to explain why each issue was or was not dispatched. No automated message to a real team or external issue tracker is required.

Acceptance requires more than two correct patches. The workflow must preserve issue identity, avoid duplicate work in the simulation, name the input revision, and report setup failures distinctly from successful checks. The documentation changes must stay within scope and reproduce through the project’s check command. If one backend cannot run the checks, document the limitation honestly and complete that verification elsewhere.

For an advanced extension, make a custom SDK-based dispatcher using the current official SDK quickstart. Keep the initial dispatcher read-only and compare its planned actions with your local policy simulation before allowing edits. This gives you a known reference for judging whether the integration behaves as intended.

## A prompt for OpenHands, Claude, or Codex

```text
Goal: repair one ready documentation issue in this training workspace.
Context: inspect the named file, repository instructions, and package
scripts before deciding how to change the guide.
Issue: [paste the synthetic ready issue and acceptance condition].
Constraints: keep scope to the observed problem, preserve conventions,
avoid new dependencies, and do not publish or contact external systems.
Workflow: report contradictions in the issue, make a coherent patch,
run the relevant checks where possible, and inspect the final diff.
Deliverable: changed files, observed command results, remaining limits,
and an explanation of how the patch satisfies the acceptance condition.
If setup prevents execution, name that failure separately from code
correctness. Do not mark unrun checks as passing.
```

Replace the bracketed issue with actual task context. The prompt is a reusable artifact, not a record of a tool action. Its boundaries are deliberately narrow so you can inspect the agent loop before giving it a larger queue.

## A final readiness observation

Before calling your queue reliable, remove one required fixture from a clean training copy and run the workflow again. It should report a missing prerequisite distinctly from a successful no-change result. Restore the fixture, rerun, and connect the resulting report to the current input. This small recovery drill tests whether your operating notes explain how to recover, rather than merely documenting the happy path.

## Sources and what remains account-specific

- [OpenHands introduction](https://docs.openhands.dev/overview/introduction) — ecosystem components and legacy status; accessed November 13, 2026.
- [Agent Canvas overview](https://docs.openhands.dev/openhands/usage/agent-canvas/overview) — control surface, backends, and workspace concepts; accessed November 13, 2026.
- [Install Agent Canvas](https://docs.openhands.dev/openhands/usage/agent-canvas/setup) — current installation and prerequisites; accessed November 13, 2026.
- [Backends](https://docs.openhands.dev/openhands/usage/agent-canvas/backends) — backend configuration reference; accessed November 13, 2026.
- [Issue-to-pull-request automation](https://docs.openhands.dev/openhands/usage/agent-canvas/prebuilt/issue-to-pr) — supported automation entry point; accessed November 13, 2026.

Check current package versions, provider compatibility, repository licenses, account entitlements, and remote-host requirements before deployment. The guide teaches a workflow using documented components; it does not certify a particular OpenHands installation or live provider connection.
