# Codex


## What you will learn

Codex is useful when the deliverable is a change to a real project: an implementation, investigation, test, document, or reproducible artifact. This chapter teaches the working loop rather than a particular model name. You will prepare a repository, give a bounded task, inspect the evidence, and decide when cloud execution is preferable to work on your computer. Allow about four hours for a first pass and an optional afternoon for the application project. Read [Foundations](../reference/foundations.md) first if branches, environment variables, or command-line tools are unfamiliar.

The researched product baseline is the official Codex CLI and Cloud documentation accessed November 13, 2026. The CLI works against local project files and supports interactive and noninteractive work. Cloud tasks have their own workspace, can continue while your computer sleeps, and can use reusable published environments. Available account features and organization policies still determine what you can start. These are product facts; the repository exercises and operating recommendations below are original learning material. [Official CLI documentation](https://learn.chatgpt.com/docs/cli), [official Cloud documentation](https://learn.chatgpt.com/docs/cloud).

## The problem before the tool

Imagine maintaining ReleaseDesk, a tiny application that turns software changes into release notes. A request arrives: “Sort the notes properly and improve the documentation.” A developer must discover the input format, interpret “properly,” edit the implementation, choose edge cases, run checks, and explain the outcome. A chat answer can suggest code, but you still perform all those transitions manually. A coding agent can carry context across them and operate the development tools.

The difficulty moves from producing individual lines to specifying observable behavior and judging the result. If the request does not say whether sorting should preserve original order among equal items, an agent may choose something reasonable that nevertheless breaks your workflow. Your job is to expose the decision before it becomes an accidental dependency. This is why a small, verifiable task is a better first lesson than “build my entire product.”

Treat a coding task as a contract with four parts: the starting state, desired behavior, permitted scope, and evidence of completion. “Starting state” includes the branch and any failing check. “Desired behavior” describes a user-visible effect. “Scope” says which kinds of changes belong. “Evidence” specifies a demonstration that would convince someone other than the agent. Good contracts remain useful when you change tools.

## Separate the model, session, and environment

A model proposes the next action. A session holds the conversation and working history. An environment supplies the files, commands, credentials, and network access needed to act. These three can fail independently. A capable model cannot run a missing compiler. A correct compiler cannot discover a requirement that exists only in your head. A long conversation cannot substitute for a checkout of the right commit.

Use a simple diagnostic order: first confirm the repository and revision; next confirm that the baseline checks run; then examine the prompt and implementation. This avoids spending model usage on problems that are actually setup errors. For example, if a test passes on your laptop and fails in a cloud task, compare runtime versions and fixture files before rewriting the feature.

An environment is also a boundary of authority. Access to a working folder makes edits possible; access to a deployment credential makes publication possible. Those are distinct capabilities. For this curriculum, use a training repository with synthetic data. Give the agent enough access to demonstrate its workflow, and make the delivery target a reviewable branch or patch. A productive learning session does not require production access.

## Prepare a minimal project

Install Codex using the instructions for your operating system on the official CLI page. Installation methods change, so use the current installer rather than an arbitrary copied package command. Open a new terminal afterward and confirm the CLI is available:

```sh
codex --version
```

The expected result is a version string. An unrecognized-command error means installation or PATH setup needs attention; it says nothing about your account or repository. Start Codex from the project directory with `codex`, then follow the sign-in flow. A ChatGPT sign-in and an API credential are different authentication arrangements. Use the one documented for your intended account; do not assume a subscription and API billing are interchangeable.

Create the following dependency-free example in a new training folder. Save the first block as `notes.mjs`:

```js
export function renderNotes(changes) {
  return changes.map(change => `- ${change.title}`).join('\n');
}

if (process.argv[1]?.endsWith('notes.mjs')) {
  console.log(renderNotes([
    { title: 'Refresh the help page', priority: 2 },
    { title: 'Repair saved searches', priority: 1 }
  ]));
}
```

Save this as `notes.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderNotes } from './notes.mjs';

test('renders each title on its own line', () => {
  assert.equal(renderNotes([{title: 'A'}, {title: 'B'}]), '- A\n- B');
});

test('empty input produces an empty document', () => {
  assert.equal(renderNotes([]), '');
});
```

Run `node --test notes.test.mjs` yourself. Both tests should pass on a supported modern Node.js installation. The import brings in the test runner, strict assertions, and the function being checked. Each `test` defines one observable claim. A baseline pass tells you that later failures are associated with the change, rather than an already broken exercise. This local example uses no model API and incurs no inference charge.

Initialize a Git repository if this folder is not already in one, inspect the files, and create a baseline commit. Keep a copy of any unrelated work elsewhere. The point of the checkpoint is to make the difference between “before” and “after” visible, not to memorize Git commands. Never let a learning exercise accidentally inherit a parent folder containing private projects.

## First task: understand before changing

Start a session in the folder and send this prompt:

```text
Explain how notes.mjs and notes.test.mjs work together.
Identify the command that checks the current behavior.
Do not edit yet. Tell me what remains ambiguous in a request to
"sort release notes by priority".
```

This prompt has a small but valuable deliverable: a map of the implementation and an ambiguity list. A useful response should mention ascending versus descending order, missing priorities, ties, and input mutation. It might identify other issues, but it should not invent a production architecture for two files. Compare the response with the actual files. Correct a wrong assumption now; do not let it become the foundation for several later edits.

Next, specify the behavior:

```text
Implement ascending numeric priority. Priority 1 appears before 2.
Changes without a numeric priority appear last. Preserve original
order for ties. Do not mutate the caller's array. Keep renderNotes
as the exported interface. Add focused checks for these behaviors
and run the existing and new checks. Deliver the diff and results.
```

The request intentionally avoids dictating every line of implementation. You own behavior and boundaries; the agent can choose a clear implementation. If you prescribe a brittle sort expression, you may inadvertently constrain the agent to your own bug. Conversely, if an interface is important to callers, stating it explicitly protects against an unnecessary rewrite.

## Read the diff as a reviewer

One reasonable implementation creates a copy before sorting and gives missing priorities a value that sorts last. The exact implementation may differ. Review whether the predicate treats `NaN`, numeric strings, and infinity consistently with the contract. You did not yet define those cases. A mature review distinguishes “incorrect under the contract” from “we should improve the contract.”

Inspect the tests before celebrating a green result. A test that calls the function and merely checks that the output is a string proves very little. A useful test provides out-of-order input and checks an exact order. A mutation check saves the original input order, calls the function, and confirms the array is unchanged. The test must observe the thing you care about.

Also inspect changes outside the function. Did the agent add a dependency for a problem native JavaScript already handles? Did it weaken the existing assertion? Did it replace an empty-input test with a new one and lose coverage? Did it change a runtime version without explaining why? Review should be proportional, but every unrelated change increases the space you need to reason about.

Ask for a result report with three fields: what changed, which checks actually ran, and what remains uncertain. “Tests should pass” is a prediction. “Ran `node --test notes.test.mjs`; four tests passed” is evidence if the command output supports it. A service login failure is a limitation, not a successful check. Codex can report either; the distinction matters to your next action.

## Use repository instructions carefully

The official CLI illustrates `/init` for creating an `AGENTS.md` instruction file, `/status` for configuration, `/permissions` for allowed actions, and `/review` for reviewing changes. Consult the current command help because surfaces and policies can evolve. A repository instruction file should capture stable working facts rather than repeat the entire task prompt. [CLI commands in the official documentation](https://learn.chatgpt.com/docs/cli).

For the exercise, a short file might say:

```md
# Working in ReleaseDesk

- This training project uses Node.js built-in modules only.
- Run checks with: node --test notes.test.mjs
- Keep exported functions compatible unless the task requests a change.
- Use synthetic release data in examples.
- In the final report, distinguish checks run from checks suggested.
```

These instructions encode conventions and the location of evidence. They do not decide every future feature. Long instruction files often accumulate stale commands, contradictory preferences, and rules that only applied to a previous task. When an agent repeatedly follows an obsolete convention, search the instructions as well as the latest prompt.

Instructions also form part of the project’s supply chain. A document checked out from an unfamiliar repository is source material until you understand its role. A request embedded in a test fixture or downloaded page is not automatically an instruction to send secrets or modify unrelated files. Teach yourself to distinguish project data from authorized workflow. This is especially useful when agents read issues written by external users.

## Move the same task to Cloud

Use cloud execution when the task benefits from an environment that remains available independently of your laptop. The documented workflow begins by choosing Cloud and an available environment. A default environment may permit a task without a repository; reusable published environments provide a prepared setup. Account and workspace controls affect which options you see. [Codex Cloud quickstart](https://learn.chatgpt.com/docs/cloud).

For a first repository task, connect only the training repository. Before asking for a feature, have the task confirm its working directory, current revision, runtime, and baseline test command. If the environment starts on an older revision, a correct change may still fail to apply to your current branch. If dependencies were installed from a different lockfile, you may be measuring setup drift instead of the agent.

Create a small environment readiness note:

```text
Repository: releasedesk-training
Expected base: the baseline commit for the sorting exercise
Runtime: supported Node.js, report actual version
Install: no third-party dependencies
Check: node --test notes.test.mjs
External services: none
Delivery: reviewable change with command output
```

The note is a checklist for your setup, not a guaranteed configuration syntax. Enter supported settings in the environment interface and consult its linked documentation. Do not paste conceptual notes into a JSON configuration field and expect the platform to infer a schema.

Then give the same behavior contract you used locally. Compare the result, including setup time and review effort. A cloud run that takes longer overall may still be valuable if you were able to do unrelated work during execution. Measure elapsed completion and human attention separately. They answer different questions about productivity.

## Reuse environments without freezing mistakes

A reusable environment is like a maintained workstation image plus project access. It should make the next task easier to start. It should not hide an undocumented manual fix made during the previous run. If a task required a system dependency, encode that in the supported setup process, then verify a new task can start from it.

Treat environment changes as development work with their own acceptance criteria. “A fresh task can check out the expected revision and run the baseline check without interactive repair” is stronger than “the previous session worked.” Reproducibility means being able to reconstruct the state, not merely leaving one instance alive.

Keep secrets separate from source files and examples. If the agent needs an authenticated package registry, provide the supported secret mechanism and narrow access to the registry. Copying an entire personal shell profile into a cloud environment often imports unrelated credentials and machine assumptions. A minimal setup is easier to diagnose and easier to share with a colleague.

Saved state and restart behavior are platform-specific. Before relying on a long-running service or an uncommitted file, read the current saved-state documentation linked from Cloud. Export important artifacts to the intended repository or approved storage. A session transcript is an explanation of work; it is not automatically a durable backup of every process or file.

## Work in parallel at the level of independent changes

Parallelism works when two tasks have separate implementation ownership and a clear integration boundary. For ReleaseDesk, one task could improve the renderer while another writes a user guide against an agreed interface. Two tasks editing the same sorting function are competing implementations, not automatically a coordinated team.

Start with a dependency graph written in plain language. The output format specification must settle before the renderer and documentation diverge. The renderer must exist before a performance comparison can measure it. A spelling correction in the help page can happen independently. This graph reveals what can run concurrently and what should wait.

Keep the integration task explicit. Someone must check that the final documentation matches the actual output and that the combined branch passes. Neither successful isolated task proves compatibility. This becomes especially important when agents create interfaces that look plausible but use different field names.

Use separate branches or workspaces where supported, and record the base revision of each task. A branch name is a convenient label; the revision is the exact starting point. Before merging, inspect whether the default branch moved. A conflict-free merge can still contain a semantic conflict, such as documentation that now describes a removed option.

## Make automation earn its autonomy

The CLI documentation describes `codex exec` for noninteractive workflows. Start with a read-only report before automating edits. For example, have a scheduled workflow examine synthetic release data and propose inconsistencies as a local artifact. After several useful reports, consider allowing a branch with fixes. Consult the noninteractive-mode reference for the current flags and output schema rather than inventing a command from an interactive transcript.

A robust automated task has a trigger, input revision, bounded work, completion condition, and an output location. It also has a failure path. If a dependency install fails, the system should say that setup failed; it should not substitute an empty report that resembles “no issues found.” If an API is unavailable, a retry should not create multiple identical pull requests.

Here is a conceptual automation contract, deliberately not an API payload:

```text
Trigger: release-data change on a training branch
Input: exact commit SHA and changes.json
Task: validate fields and propose documentation corrections
Limits: one active task per SHA, no deployment
Success: report plus optional patch, checks recorded
Failure: named stage and diagnostic output
Duplicate handling: reuse the task associated with the same SHA
```

The crucial idea is identity. An event can be delivered twice. A branch can change while a task runs. A report needs to identify the input it evaluated. Without that, a perfectly written recommendation may be applied to the wrong state. These are workflow engineering problems, not model-quality problems.

## Learn to steer without repeatedly restarting

Good steering supplies new evidence and preserves the objective. If a proposed solution mutates input, say “The caller reuses the array; the nonmutation requirement still applies. Change the implementation and add an observation that would fail on mutation.” This points to the defect and its consequence. “Try harder” provides neither.

Restart when the task’s basic assumptions have changed enough that the existing conversation is misleading. Before restarting, ask for a compact handoff describing the goal, verified facts, files changed, checks run, and unresolved decisions. Read the handoff yourself. A generated summary can omit the detail that caused the previous failure.

Avoid steering several dependent requests at once. “Also add a web dashboard, switch to TypeScript, and optimize startup” makes it difficult to tell what caused the next failure. Keep new work in a queue. Finish and review the sorting task, then decide whether the next feature still belongs. Small completed changes improve your ability to compare outcomes across tools.

## Troubleshoot by failure layer

| Symptom | Likely layer | Useful next observation |
| --- | --- | --- |
| CLI command is not found | Installation/PATH | New terminal, installed binary location, version command |
| Sign-in succeeds but project access fails | Account or repository authorization | Connected account, repository selection, organization policy |
| Agent edits the wrong files | Working directory or scope | Actual checkout path, task contract, changed-file list |
| Cloud tests fail before edits | Environment | Runtime version, install logs, fixture availability |
| Checks pass but behavior is wrong | Specification or weak checks | Exact input/output example, missing edge case |
| Parallel results disagree | Integration | Base revisions and shared interface contract |
| Same automation produces duplicate PRs | Workflow identity | Event ID or input SHA associated with each run |

Use one diagnostic change at a time. If you simultaneously update the CLI, rewrite the prompt, and replace the environment, a successful retry does not tell you which repair mattered. Record the smallest observed cause. The next time the failure appears, that note is more valuable than a vague memory that “restarting fixed it.”

## Evaluate the result beyond output volume

For a fair comparison, give two tools the same base project and acceptance criteria. Record setup minutes, agent elapsed time, your active review minutes, number of required corrections, and whether the result satisfied the contract. Keep the task small enough that you can independently judge correctness. Do not rank tools by how confidently they describe their output.

A useful scorecard might assign two points each to behavior, check quality, scope discipline, reproducibility, and handoff clarity. Define what earns the points before running the comparison. Otherwise you may reward the style of the first output you happen to like. Treat the result as evidence for your task and environment, not a universal benchmark.

Cost is also multidimensional. Subscription access, model usage, remote compute, and external services may follow different billing arrangements. This guide intentionally avoids a fixed price table that will age quickly. Check the current plan and usage controls in your account, set a small learning budget, and compare cost per accepted change rather than cost per generated token alone.

## Optional application: a release-note maintenance workflow

Build on the sorting exercise by adding a JSON input file, a validation command, and a generated Markdown report. Use three successive tasks: define the input contract, implement validation and rendering, then document the workflow. Review each task before beginning the next. Ask the agent to keep examples synthetic and dependencies minimal.

The finished project should reject malformed input with a useful message, preserve caller data, generate deterministic output for the same input, and explain how to reproduce the result from a fresh checkout. It should include a short result report naming the actual checks. Run the documented commands yourself. A missing installation step is a documentation defect even if the agent’s already-prepared environment works.

For an advanced extension, run one task locally and another in Cloud against separate branches, then perform an integration review. Compare environment startup and artifact handoff. Deliberately introduce a harmless mismatch in a fixture path to practice diagnosing an environment failure. Repair the setup rather than teaching the implementation to ignore missing data.

## A reusable Claude or Codex prompt

```text
Goal: improve ReleaseDesk's release-note generator.
Context: inspect this checkout and its repository instructions first.
Behavior: sort numeric priorities ascending, put missing values last,
preserve tie order, and leave the caller's array unchanged.
Constraints: keep the exported interface, use built-in Node modules,
avoid unrelated files, and do not deploy or contact external services.
Deliverable: a reviewable patch, focused checks, and updated usage notes.
Verification: run the documented baseline and relevant new checks.
Report actual commands/results, untested behavior, and any ambiguity
that prevents a sound implementation. Do not present predicted results
as observed execution.
```

A prompt is a request to a tool, not evidence that the tool ran. This chapter provides the request and a method for evaluating its result. No Codex cloud task, external account configuration, or billable model call was performed to validate the chapter.

## A worked review conversation

Consider a result that passes all sorting checks but uses `changes.sort(...)` directly. The output looks correct, yet the implementation mutates the caller's array. You can demonstrate the defect without arguing about code style. Save the original sequence of IDs, call the renderer, and compare the input sequence afterward. If the order changes, the nonmutation criterion failed. This is an observable mismatch with the task contract.

An effective follow-up is: “The rendered text is correct, but the input order changes. The caller uses that order elsewhere. Preserve the input and add a focused check that fails on the current implementation.” The agent now has the symptom, consequence, required behavior, and a verification target. You have avoided specifying a particular implementation while still making the correction concrete.

Next imagine the agent responds by sorting a shallow copy. Review what kind of mutation the contract forbids. A shallow copy protects the array's order but does not clone the objects inside it. That is enough if the renderer only reads object fields. If it also normalizes titles by assigning to `change.title`, object mutation remains. A better review examines actual writes rather than demanding a deep clone automatically. Deep copying everything can add unnecessary complexity and can mishandle values outside simple JSON data.

Finally, suppose the corrected implementation treats numeric strings as missing. Is that a defect? Under the original wording, “numeric priority” could be interpreted as a JavaScript number or a string containing digits. Settle the data contract: for this exercise, require finite JavaScript numbers and treat other values as missing. Add a clear example to the input documentation. You have improved the specification rather than merely accumulating tests around accidental behavior.

This miniature review illustrates a repeatable progression: observe, connect the observation to the requirement, request a bounded correction, and verify the final state. The same pattern works for documentation, configuration, and UI changes. It is more reliable than judging whether the patch resembles the implementation you would have written.

Keep one final distinction in your delivery note. “The example meets the synthetic fixture contract” is narrower than “the feature is production-ready.” A real application might also need schema validation, localization, accessibility review, performance measurement, or compatibility with existing consumers. Name the boundaries you actually evaluated. That precision makes your accepted changes easier to trust and your next task easier to define.

## Sources and update boundaries

- [Codex CLI](https://learn.chatgpt.com/docs/cli) — official installation and local workflow concepts; accessed November 13, 2026.
- [Codex Cloud](https://learn.chatgpt.com/docs/cloud) — official task, workspace, and reusable-environment workflow; accessed November 13, 2026.
- [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview) — a separate programmatic managed-harness product; accessed November 13, 2026. Do not confuse it with a promise that every Codex subscription exposes the same API capabilities.

The local JavaScript learning example is designed to run without third-party dependencies. Vendor installation, sign-in, Cloud access, environment persistence, and plan entitlements must be verified in your account. Product interfaces can change; the durable skills are task design, environment readiness, reproducible checks, and careful review.

For future comparisons, retain the acceptance contract alongside the patch so the next trial evaluates the same requirement.
