---
title: Paradev (formerly Superset)
description: Turn a task board into isolated agent workspaces, then review and integrate parallel work without confusing activity with completion.
sidebar:
  order: 8
---

## Start with the current name and platform boundary

Superset has become Paradev: the old website and documentation redirect to the new name. It is a workspace layer for coding agents, with a task interface that can turn work items into agent assignments. The current documentation includes list and kanban views and separate local and cloud workspaces. Do not confuse this developer tool with Apache Superset, the business-intelligence platform. [Paradev website](https://paradev.com/), [Tasks documentation](https://docs.paradev.com/tasks).

As checked November 13, 2026, the desktop installation page lists macOS, an experimental Linux x64 AppImage, and no Windows desktop release. It also says you need an existing coding agent; Paradev does not replace the agent’s subscription. Windows learners can complete the task-design and local simulation sections here, then practice the same principles using [Codex](/factories/codex/), [Claude Code](/factories/claude-code/), or another supported workspace tool. Do not spend time looking for an undocumented Windows installer. [Installation requirements](https://docs.paradev.com/install).

Allow four to six hours for the chapter. You will learn to distinguish a task from its execution, prepare independent work, stage agent commands for review, and integrate the result. The examples are an original curriculum project and do not depend on a live Paradev account. Product access, cloud availability, and plan-specific features require account verification.

## Why a board is useful when agents can already code

Imagine you have six small changes to make in ReleaseDesk: repair release sorting, improve an installation guide, add an empty state, update a fixture, correct an error message, and add a report field. A terminal agent can attempt them one by one. Several terminal agents can attempt them simultaneously. The missing capability is knowing which request belongs to which branch, which environment, and which review.

A task board makes the queue visible. A workspace gives an assignment a place to run. A diff gives the reviewer a change to inspect. A pull request connects that change to an integration decision. These are related objects, but they are not the same object. A board card moving to the right does not prove a patch works. A successful agent session does not prove the corresponding issue is fully resolved.

The core lesson is to preserve identity across transitions. Task `RD-31` should map to a named workspace, a base revision, a branch or equivalent change artifact, and a review outcome. Without those links, parallelism creates a pile of plausible changes that you cannot confidently associate with requirements.

## The worktree mental model

A Git worktree gives you another checked-out working directory connected to the same repository history. Each directory can have its own branch and files. This lets two tasks edit different working copies without repeatedly switching your main checkout. It is not a complete machine or network boundary: processes may still share ports, credentials, caches, and external services.

Paradev’s current documentation says local project workspaces use separate worktrees, while cloud workspaces use separate clones. That distinction affects file paths and lifecycle, but both provide a separate working copy for the task. [Workspaces](https://docs.paradev.com/workspaces).

Think of the repository as the history and a workspace as one desk where a particular version is laid out. Two desks can hold different branches, but they may still use the same printer or database. This is where the analogy helps: separate files prevent one class of interference, while shared services require their own isolation or coordination.

When a task finishes, inspect its patch and the current integration target. If the main branch changed while the task ran, a clean merge does not prove the result is semantically compatible. A renderer update and a report-schema update can avoid textual conflicts while disagreeing about a field name. Integration remains a separate responsibility.

## Learn the workflow with a synthetic task queue

Create a training project with a short README, a small release-note renderer, and a check command you can run. If you do not already have one, use the example in the [Codex chapter](/factories/codex/). Keep all input data fictional. Before parallel work, verify the baseline and create a checkpoint.

Write three task briefs in plain text:

```text
RD-31: Renderer order
Sort numeric priority ascending, missing priorities last, stable ties.
Do not mutate the caller's array. Preserve the exported interface.
Evidence: focused checks plus existing checks.

RD-32: Installation guide
Explain the actual setup and check commands for a fresh checkout.
Keep examples synthetic and match the repository's scripts.
Evidence: follow the documented sequence in a clean project copy.

RD-33: Review report
Design a JSON report containing input identity, check results,
and remaining limitations. Agree the schema before implementation.
Evidence: fixed input produces an inspectable, deterministic report.
```

These briefs are intentionally uneven in readiness. `RD-31` has a clear behavior contract. `RD-32` can begin by inspecting existing scripts. `RD-33` contains a design dependency: the report schema must be agreed. Do not start all three implementation tasks simply because the board allows multi-selection.

## Decide what can run independently

Write a small dependency map. Renderer ordering can proceed independently of installation prose if command names remain stable. The report design can proceed as investigation, but implementation may depend on deciding how checks are represented. A final integration task depends on all changes you plan to combine.

Separate two styles of parallelism. In complementary work, agents implement different parts of the result. In a race, agents attempt the same task independently so you can compare approaches. Complementary work needs interface coordination; a race needs independent evaluation and a choice of one result. Merging both race outputs usually defeats the purpose.

Limit work in progress to what you can review. If each result requires twenty minutes of your attention, launching eight tasks before lunch creates nearly three hours of review inventory. It may still be useful, but it is not “free productivity.” A small queue lets you improve task briefs based on feedback from the first few results.

For this lab, run `RD-31` and `RD-32` as independent workstreams, and keep `RD-33` in a design stage. This gives you enough concurrency to observe the workflow without losing track of ownership. Make integration a named task so you do not mistake two isolated successes for a completed release.

## Set up the app on a supported machine

Follow the official installation page for your platform and add the training project. Confirm the agent you intend to use is detected and authenticated. If pull-request workflows are part of the exercise, configure the documented source-control tools; otherwise a local diff is enough for the first pass. Avoid granting additional integrations simply to dismiss onboarding suggestions.

Create one workspace before launching several. Ask its agent to identify the current branch, project path, runtime, and check command. Compare those observations with the intended setup. Run the baseline check. You have now tested the chain from app to agent to working directory to project tools.

If the task runs locally, your host’s lifecycle matters. Remote access to the host is different from cloud execution. A viewer on another device cannot keep a sleeping workstation running. If you choose a cloud workspace, verify the account capability and supported environment setup separately. This chapter does not infer cloud availability from the presence of a button in a screenshot.

Capture the workspace path in your working notes. The visible task title may be renamed, while files remain in a path derived at creation time. A reliable note records both a human-readable label and a concrete revision or workspace identity. It is much easier to debug a port or file mismatch when you know which process belongs to which task.

## Bring tasks into the control surface

The current Tasks documentation describes native tasks alongside connected Linear issues and a separate GitHub-issues source. It documents filtering, list and board views, and task-to-workspace actions. When a task is launched, its content becomes the agent prompt; the per-agent Task Prompt Template controls that transformation. An Auto-run toggle can stage commands rather than starting immediately. [Task workflow](https://docs.paradev.com/tasks).

For the first lab, use native or synthetic training tasks if supported by your setup. You do not need to import a real team backlog. Create `RD-31` and inspect its full description before launch. The board’s compact card may hide the acceptance criteria that actually matter to the agent.

Stage the first command for review. Check which project and agent will receive the task, whether the acceptance criteria are included, and whether any template adds instructions you did not expect. A prompt template is part of your workflow configuration. If it silently instructs every task to publish or modify unrelated files, the problem begins before the agent reasons about the issue.

Keep the template short and stable. It can ask the agent to inspect repository conventions, preserve scope, run relevant checks, and report evidence. Task-specific behavior belongs in the task. Otherwise you end up editing a global template every time a different feature arrives, making past results difficult to reproduce.

## A useful task prompt template

Here is an original conceptual template. Adapt it using the variables and syntax actually supported by your installed version; it is not a claim about a particular placeholder language:

```text
Work on the supplied task in this workspace.
First inspect repository instructions, current branch, and check commands.
Treat the task's observable acceptance criteria as the delivery contract.
Keep the change scoped and explain contradictions before broadening it.
Use synthetic fixtures and avoid production services.
Deliver a reviewable diff and the actual checks run, with results.
Name limitations and unfinished criteria explicitly.
Do not merge or deploy as part of this training workflow.

Task title: [insert task title]
Task description: [insert complete task description]
```

The placeholders are intentionally plain English. Replace them through the application’s documented template mechanism. Do not assume that braces or dollar-sign variables from another tool work here. A surprisingly common integration bug is a task prompt containing literal unresolved placeholders, leaving the agent to guess the assignment.

Test the template with one task and inspect the resulting initial message. If a long description is truncated or important metadata is omitted, correct the transformation before launching a batch. The task board is only useful if the execution receives the same contract you reviewed.

## Observe parallel work without micromanaging

Start `RD-31` and `RD-32` in separate workspaces. Give each a clear deliverable and wait for meaningful evidence. You do not need to interrupt every tool call. You do need to respond when a worker identifies a blocked prerequisite or a requirement conflict.

Switching between workspaces should answer specific questions: is the agent operating in the right directory, is the baseline usable, has the scope changed, and is there something ready to review? Browsing every transcript line can consume the attention parallelism was supposed to save. Ask for concise milestone reports when the work is longer.

If both agents discover the same missing setup step, fix the shared project configuration and communicate the new baseline. Do not have each worker invent a different workaround. Shared environment defects belong upstream. Task-specific implementation defects belong in the relevant branch.

If an agent needs a decision, answer in terms of behavior. For `RD-32`, “The guide should work for a reader with Node and Git installed, from a fresh clone” is useful. “Make the docs polished” is less useful. Clear intervention can let a worker finish without forcing you to design the prose yourself.

## A runnable local board simulation

You can understand work-in-progress limits on any supported Node.js system, including Windows. Save this as `board.mjs`:

```js
const tasks = [
  { id: 'RD-31', state: 'ready', dependsOn: [] },
  { id: 'RD-32', state: 'ready', dependsOn: [] },
  { id: 'RD-33', state: 'blocked', dependsOn: ['SCHEMA-1'] },
  { id: 'INTEGRATE', state: 'ready', dependsOn: ['RD-31', 'RD-32'] }
];

export function dispatchable(items, limit) {
  const complete = new Set(items.filter(t => t.state === 'done').map(t => t.id));
  const running = items.filter(t => t.state === 'running').length;
  const slots = Math.max(0, limit - running);
  return items.filter(t =>
    t.state === 'ready' && t.dependsOn.every(id => complete.has(id))
  ).slice(0, slots).map(t => t.id);
}

console.log(dispatchable(tasks, 2));
tasks[0].state = 'done';
tasks[1].state = 'done';
console.log(dispatchable(tasks, 2));
```

Run `node board.mjs`. The first output should name `RD-31` and `RD-32`. The second should name `INTEGRATE`. `RD-33` remains blocked because its state and dependency have not changed. The function first gathers completed IDs, counts active work, and chooses only ready tasks whose prerequisites are complete.

This is a teaching scheduler, not a Paradev SDK or implementation of its board behavior. It omits persistence, retries, permissions, fairness, and task claiming. The small program makes one principle concrete: available workers do not make a blocked task ready. A sophisticated control surface still benefits from this basic discipline.

Try changing one task to `running` and observe that fewer slots remain. Then add an unknown dependency and see that the task never becomes dispatchable. In a real workflow, unknown dependencies should surface as a configuration error rather than sit quietly forever. This is a useful optional enhancement for the local simulation.

## Review an individual workspace

Begin with the task contract and changed-file list. Confirm the patch addresses the requested behavior and does not include incidental edits. Then inspect the check output. For `RD-31`, look for explicit order examples, stable ties, missing priorities, and nonmutation. For `RD-32`, follow the documented sequence instead of checking only spelling.

Review code and evidence together. A good explanation cannot compensate for a missing edge case. A large test suite cannot compensate for changing the wrong behavior. If the agent says a test was not run because the environment lacks a tool, that is useful honesty, but the acceptance criterion remains open until you verify it through an appropriate environment.

If you request a correction, keep it associated with the same task and workspace so the history remains coherent. Describe the observed defect, desired behavior, and a way to verify the fix. Avoid opening a separate task for every review sentence unless the change is genuinely independent and should be tracked separately.

Before accepting, inspect the final diff after all follow-ups. An early review does not cover later modifications automatically. In particular, an agent may repair a test by weakening an assertion or changing fixture data. Check that the evidence still establishes the original contract rather than making the implementation easier to pass.

## Integrate the work explicitly

Once both changes are reviewable, combine them through your normal version-control workflow. Start from the current integration target, not an old assumption about main. Resolve textual conflicts carefully and run the combined checks. Then inspect whether the README still describes the final implementation.

Semantic conflicts deserve attention even when Git reports none. Suppose the renderer task changes the default input filename and the documentation task uses the old filename. Both branches can pass isolated checks. Their combination creates a broken user workflow. The integration task’s job is to observe that complete sequence.

Record the integrated revision and the checks run against it. If you later reopen the task, you should know which state was actually accepted. A board column called Done is a useful visual signal, but a revision and acceptance report make it auditable and reproducible.

Archive or clean up workspaces only after important artifacts are safely in the intended repository or storage. Review any cleanup action’s effect on uncommitted files, running processes, and local data. A workspace can contain useful debugging notes that were never committed. Decide deliberately what belongs in the final record.

## Ports, services, and hidden shared state

Two workspaces can still collide when both start a development server on the same port. A good local workflow gives each server a known port and lets you identify which workspace owns it. If a preview looks unchanged after an edit, confirm you are viewing the correct server before assuming the code failed to rebuild.

External services can also create interference. Two branches sharing one development database may expect different schemas. Two browser tests using the same account can overwrite each other’s state. Synthetic local fixtures and per-workspace data reduce this class of confusion. When isolation is expensive, serialize the affected checks rather than pretending the service is independent.

Caches are another source of misleading success. A documentation build may pass because an old generated file exists. Test the fresh path occasionally: create outputs in a clean directory and confirm the instructions reconstruct them. Reproducibility is more valuable than preserving a magical workspace that only works after several undocumented repairs.

The same thinking applies to cloud workspaces. A separate clone is useful, but verify network, credentials, runtime, and storage behavior. The phrase “in the cloud” does not establish what survives restart or which external systems are shared. Consult current cloud documentation for your account before relying on a long unattended run.

## Keep local and cloud costs visible

Separate the workspace tool’s access or plan from the coding agent’s model usage and any remote compute. A subscription that launches an agent does not necessarily include unlimited model work. A local workflow may use your machine without a remote-compute charge but still incur provider usage. Check the current account documentation instead of assuming a single price covers everything.

For a learning comparison, record cost units without requiring precise vendor price memorization: agent usage, workspace runtime, external service calls, and human review time. If one workflow produces more retries, measure whether those retries improve accepted quality. A faster first draft can be more expensive overall if it requires extensive repair.

Set a small initial batch size and inspect the outcome before increasing it. A misconfigured prompt template multiplied across twenty tasks wastes time even if the app itself behaves perfectly. Validate the transformation, environment, and delivery on one task, then two, then a useful real batch.

## Troubleshooting the board-to-workspace chain

| Symptom | Possible cause | What to inspect |
| --- | --- | --- |
| A task is absent | Filters or wrong source | Project, assignee, state, and issue source |
| Agent receives incomplete context | Prompt transformation | Full task detail and Task Prompt Template |
| Workspace starts but agent does not | Staged command or agent setup | Auto-run setting, detected agent, authentication |
| Two tasks affect the same files unexpectedly | Shared workspace or unclear ownership | Actual workspace paths and briefs |
| Preview shows another task | Port collision | Process ownership and displayed preview address |
| Local work stops after sleep | Host lifecycle | Local versus cloud execution choice |
| Both patches pass but combined workflow fails | Semantic integration conflict | Shared interface and end-to-end sequence |
| Task looks complete but no patch exists | Weak delivery definition | Artifact location, branch, and acceptance report |

Use these as hypotheses, not automatic diagnoses. Observe one concrete fact before changing configuration. If the issue is a filter, reinstalling the agent cannot help. If a task is intentionally staged for review, clicking through authentication settings will not start it. Keeping the chain visible makes troubleshooting faster.

## When to choose another approach

Use a plain terminal agent for a single small task when a board adds overhead. Use [Factory Missions](/factories/factory/) when you want a structured orchestrator to help decompose a multi-feature effort. Use [OpenHands](/factories/openhands/) when you need to compose the control surface, backend, and model stack more directly. A workspace manager is not automatically the right abstraction for every job.

For Windows, choose a currently supported tool for hands-on execution and retain the task-design principles from this chapter. Platform compatibility is a functional requirement, not a minor detail to solve after buying access. Revisit Paradev’s installation documentation when your platform needs change; the researched snapshot is not a permanent roadmap promise.

Vibe Kanban is historically important in this space, but its hosted-service shutdown makes it a lifecycle case study rather than this course’s default managed board. Read [Emerging tools and changes](/watchlist/) before following an older Vibe Cloud tutorial. Comparing a maintained workflow with a retired hosted feature would produce a misleading tool evaluation.

## Optional application: deliver a three-task mini release

Complete the two independent tasks and one integration task using separate working copies. Keep the report-schema task as a design proposal until its contract is agreed. Produce a small delivery record linking each task to its workspace or branch, base revision, final artifact, checks, and review outcome.

The project is complete when the integrated result satisfies both original task contracts, a fresh reader can reproduce the documented sequence, and no task is marked accepted solely because an agent stopped. Your local scheduler simulation should correctly hold dependencies and respect the work-in-progress limit. If you use a supported Paradev installation, inspect the staged prompt at least once.

For an advanced extension, race two agents on `RD-31` in independent workspaces. Evaluate both with the same fixed acceptance checks and reviewer scorecard. Choose one implementation and explain the decision. Do not merge both merely to preserve effort. The learning outcome is comparative judgment, not maximizing the number of generated patches.

## A prompt for a board-driven agent task

```text
Goal: complete RD-31 in this workspace as an independently reviewable change.
Context: inspect repository guidance, branch, implementation, and checks.
Behavior: priority ascending, missing priorities last, stable ties,
and no mutation of caller input. Preserve the exported interface.
Constraints: no unrelated refactor, new dependency, merge, or deployment.
Deliverable: focused patch and an evidence report tied to this revision.
Verification: run existing and relevant new checks. Inspect the final diff.
Handoff: identify changed files, actual results, unresolved criteria,
and any shared-interface decision that affects another task.
```

This can be given to Claude, Codex, or another supported coding agent through the workspace. It is a request template, not a record that a task was executed. The small scope helps you learn the control surface while keeping review practical.

## Make board status carry a precise meaning

For your training board, define what each state means before dispatch. Ready means the task has enough context and its prerequisites are met. Running means a workspace has claimed the task. In review means an artifact and evidence are available. Accepted means the result has passed the contract and integration policy. These are original course conventions, not guaranteed built-in status names.

This distinction prevents a subtle failure: mapping an agent's final message directly to Done. The agent might have produced a correct partial result, stopped on an environment failure, or completed work against a stale requirement. Require the acceptance decision to inspect those facts. When a task returns to work after review, preserve its identity and explain the unmet criterion instead of creating an unrelated duplicate.

Also distinguish waiting from blocked. A task waiting for a review slot may be healthy; a task blocked by an unknown schema needs a decision. Both appear inactive on a board, but the useful intervention differs. Clear state definitions make the control surface informative enough to manage several agents without reading every transcript in full.

## Sources and verification limits

- [Paradev, formerly Superset](https://paradev.com/) — current identity and positioning; accessed November 13, 2026.
- [Install](https://docs.paradev.com/install) — supported platforms and agent prerequisites; accessed November 13, 2026.
- [Tasks](https://docs.paradev.com/tasks) — task sources, board/list views, and delegation controls; accessed November 13, 2026.
- [Workspaces](https://docs.paradev.com/workspaces) — local worktrees, cloud clones, and workspace concepts; accessed November 13, 2026.

The scheduler is a local teaching example. This guide does not claim to have installed Paradev, connected Linear or GitHub, launched agents through the app, or measured a live cloud workspace. Verify those capabilities and plan entitlements in your own supported environment.
