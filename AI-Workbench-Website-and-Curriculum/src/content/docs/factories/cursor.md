---
title: Cursor
description: Use local agents, cloud environments, and automations as a controlled software-delivery workflow.
sidebar:
  order: 3
---

## Understand the three working modes

Cursor combines an agent-oriented development experience with cloud execution and automations. The important distinction is where the work runs and what starts it. An interactive agent helps while you steer a development session. A cloud agent runs in its own development environment. An automation starts cloud-agent work from a schedule or event. Learning these boundaries is more useful than memorizing every button in the editor. [Agent overview](https://cursor.com/docs/agent/overview), [Cloud Agents](https://cursor.com/docs/cloud-agent), [Automations](https://cursor.com/docs/cloud-agent/automations)

This chapter uses **Workspace Health**, an original small application that turns synthetic service-check results into a concise status report. You will practice investigating a repository, specifying a bounded change, running it locally, delegating one change to a cloud agent, and designing a narrow automation. The agent should produce reviewable changes and evidence, while you retain the decision to merge or publish.

Allow four to six hours for the first complete workflow. You need basic Git, a terminal, JavaScript or a comparable language, and an account with the features you intend to try. Cloud and automation access depend on current plans and organization policy. This curriculum did not authenticate to Cursor, launch a cloud environment, or activate an automation.

## The problem: agent output is not a delivery process

An agent can write a plausible patch quickly. A team still needs to know which problem the patch solves, which files it changes, whether the environment is correct, which checks ran, and what remains uncertain. If those facts live only in a long chat, reviewing the result can take longer than writing the code.

Workspace Health gives you a concrete problem. A dashboard currently marks a workspace healthy when one required check is missing. The desired behavior is to show `unknown` until every required check has a result, show `degraded` when any required result fails, and show `healthy` only when all required results pass. That behavior can be specified and tested without access to production services.

The task is small enough for one agent. It still exercises important boundaries: understanding the existing implementation, changing logic without rewriting unrelated UI, adding meaningful cases, and reporting actual results. Starting with a bounded defect teaches more than asking an agent to “build an autonomous software factory” and accepting whatever architecture appears.

Think of the agent as a capable contributor who needs a clear work order and a usable workspace. A contributor cannot run a test suite if dependencies are absent, and cannot infer a hidden business rule from a screenshot. Better prompts help, but environment quality and acceptance criteria are equally important.

## Prerequisites in the order you need them

**Git commits** identify source states. A branch gives a line of work a name. A pull request presents proposed changes for review. A cloud agent working against one commit does not automatically include uncommitted edits on your laptop. Before delegation, decide which source state is authoritative.

**A working tree** contains files the process can edit. Multiple agents should not casually modify the same working tree at once. Independent branches or isolated workspaces reduce accidental overwrites, but merging still requires thought when changes touch the same behavior. Isolation is not conflict resolution.

**A development environment** includes language runtimes, system packages, repository contents, secrets, network access, and startup commands. “It works locally” means those ingredients happened to align on your machine. Remote execution requires making the necessary ingredients explicit.

**Acceptance criteria** describe externally meaningful behavior. “Use a helper function” is an implementation preference. “Missing required checks produce unknown status” is an observable requirement. Prefer criteria that remain valid if the implementation changes.

**Verification** establishes a claim with evidence. A test command listed in a final message may not have run. Ask for the actual result and its limitations. A successful unit test does not establish a responsive UI, and a screenshot does not establish the status logic for missing data.

Read the [foundations](/foundations/) if repositories, secrets, and tool permissions are new. Then return to the small defect rather than learning every Git feature before writing a line of code.

## Create a reviewable work order

Use this original task brief:

```text
Problem: Workspace Health reports healthy when a required service check
is absent. This hides uncertainty from the person reading the dashboard.

Required behavior:
- Any failed required check => degraded.
- Otherwise, any absent required check => unknown.
- Otherwise, all required checks passing => healthy.
- An empty required-check list => unknown for this demo.

Scope: change status aggregation and the directly related tests/wording.
Keep the current UI structure and public data shape unless required.
Use synthetic fixtures. Do not connect live services or publish the app.

Evidence: explain the old failure, show representative before/after data,
run the relevant tests, and report untested UI or environment behavior.
```

The order of rules matters. A failed required check should remain degraded even if another check is missing. Otherwise, “unknown” could hide a confirmed failure. The empty-list rule is a project choice stated explicitly because teams may reasonably choose another policy.

Give the agent a short repository orientation request first: identify the aggregation function, its callers, test commands, and any related data types. Ask it to cite file paths in its explanation. Then review the proposed change boundary. This is useful planning because it reduces uncertainty about where the defect lives, not because every tiny task needs a ceremonial plan.

## A complete local example

The following offline program models the required behavior. Save it as `workspace_health_demo.mjs` and run `node workspace_health_demo.mjs`. It uses no Cursor API or external service.

```javascript
import assert from 'node:assert/strict';

function aggregateHealth(required, results) {
  if (!Array.isArray(required) || required.length === 0) {
    return {status: 'unknown', reason: 'No required checks configured'};
  }
  const unique = [...new Set(required)];
  const failed = unique.filter(name => results[name] === 'fail');
  const missing = unique.filter(name => !['pass', 'fail'].includes(results[name]));
  if (failed.length) return {status: 'degraded', failed, missing};
  if (missing.length) return {status: 'unknown', failed: [], missing};
  return {status: 'healthy', failed: [], missing: []};
}

assert.equal(aggregateHealth(['api', 'database'], {api: 'pass'}).status, 'unknown');
assert.equal(aggregateHealth(['api', 'database'], {api: 'pass', database: 'fail'}).status,
  'degraded');
assert.equal(aggregateHealth(['api', 'database'], {api: 'fail'}).status, 'degraded');
assert.equal(aggregateHealth(['api', 'database'], {api: 'pass', database: 'pass'}).status,
  'healthy');
assert.equal(aggregateHealth([], {}).status, 'unknown');
assert.equal(aggregateHealth(['api', 'api'], {api: 'pass'}).status, 'healthy');
console.log('Six health-aggregation cases passed. No network requests made.');
```

`Set` removes duplicate required names. The function distinguishes `fail` from an absent or invalid result. The failure check runs before the missing-data check, preserving the stated priority. Returning the names of failed and missing checks makes the UI explanation possible without reverse-engineering a single status string.

The example is intentionally limited. It does not validate every possible malformed object, implement timestamps, or decide whether a stale pass remains usable. Those are separate requirements. Do not ask the agent to add all of them unless the application needs them. A focused fix is easier to review and gives stronger evidence than a broad rewrite of the status system.

## Work interactively before delegating remotely

Open the repository in Cursor and ask the agent to inspect before editing. Provide the task brief, relevant files if known, and constraints. Let it read the code and propose a small change. During implementation, inspect the diff as it develops rather than judging only the final explanation.

Ask the agent to run the repository's documented check command. If it cannot, find out why. Missing dependencies, an unsupported runtime, and a failing pre-existing test are different situations. Preserve the distinction in the report. “Tests failed” is too vague when the command never reached the test runner.

Review the semantics yourself using the small cases above. If the patch returns `healthy` for an empty list because JavaScript's `every` on an empty array is true, the implementation may be idiomatic but wrong for this project's rule. This is a useful reminder that language correctness and product correctness are different.

Once the local task is understood, delegate a similarly bounded follow-up to a cloud agent: add a user-facing explanation listing missing required checks. The initial logic fix remains a reference. A cloud task should not start with uncertainty about both the problem and the environment if you can resolve one cheaply first.

## Make the cloud environment reproducible

Cursor's cloud documentation describes isolated VMs with development environments, including repositories, dependencies, secrets, startup commands, and network access. The setup guide currently describes isolated Ubuntu machines and both guided setup and Dockerfile-based configuration. It also supports multi-repository environments. Check current plan and organization availability before assuming a route is enabled. [Cloud Agents](https://cursor.com/docs/cloud-agent), [Cloud environment setup](https://cursor.com/docs/cloud-agent/setup)

For Workspace Health, the environment needs the repository, the intended Node runtime, the package manager, and dependencies. It does not need production database credentials. Start with synthetic fixtures so the agent can complete its verification without broad network or data access.

Write down installation, test, and preview commands as separate responsibilities. Installation prepares dependencies. Tests evaluate behavior. Preview runs the application. An installation script that starts a never-ending server can prevent setup from completing. A test command that depends on an undeclared local database is not yet a reproducible check.

Prefer the repository's lockfile and documented runtime version. If the cloud environment uses a different runtime from your laptop, investigate whether the difference is intended. Do not automatically upgrade the whole project to make one remote task convenient. A focused environment repair often has less risk than a broad dependency migration.

If you choose manual environment configuration, use the current documented schema. The setup guide describes `.cursor/environment.json` and Dockerfile integration, but configuration resolution depends on saved personal/team environments and the chosen setup route. Do not assume committing a file always overrides a saved environment. [Cloud environment setup](https://cursor.com/docs/cloud-agent/setup)

## Understand Builds as environment preparation

Cursor documents Cloud Agent Builds as part of preparing environments so agents can begin from ready-to-use dependencies and tooling. Study the current Build behavior separately from a build of your own application: the same word can refer to different layers. [Cloud Agent Builds](https://cursor.com/docs/cloud-agent/builds)

For the learning project, keep a simple environment evidence sheet:

| Item | Evidence you want |
| --- | --- |
| Source | Repository and starting commit |
| Runtime | Actual version printed in the remote environment |
| Dependencies | Lockfile-based installation completed |
| Checks | Health tests ran and reported results |
| Preview | App starts and the relevant page can be inspected |
| Secrets | Only synthetic/demo credentials are present |

An environment image that starts quickly is useful only if it contains the right ingredients. If a cached environment hides an undeclared package, the next clean run may fail. Occasionally validate the setup from a clean state or an explicitly rebuilt environment when configuration changes justify it.

Keep environment changes reviewable. A Dockerfile that installs a new system package should explain why the application needs it. Avoid hiding task-specific fixes in a personal cloud machine where teammates cannot reproduce them. The goal is a usable team environment, not one successful mysterious session.

## Delegate a cloud task with a concrete boundary

Use this original cloud-agent prompt after the aggregation behavior is established:

```text
In Workspace Health, add a concise explanation for unknown status when
required checks are missing. Inspect the existing aggregation result and
UI before editing. Show the missing check names using the current design
patterns. Preserve the degraded-over-unknown priority and the public data
shape. Use synthetic data. Run the relevant checks and inspect the page
at desktop and narrow widths if browser tooling is available. Return a
reviewable patch and report which UI checks were actually performed.
Do not connect production services, merge, or publish.
```

The environment should let the agent run the software, not merely edit it. If it can only infer the UI from source, the report should say so. A claim such as “responsive layout verified” requires an actual relevant inspection, not a successful JavaScript build.

When the result arrives, review the diff before the narrative. Check for unrelated dependency changes, generated files, copied secrets, and broad style rewrites. Then examine the evidence. If the agent reports an existing test failure, compare it with the baseline rather than accepting or dismissing it automatically.

## Treat rules as maintained project guidance

Cursor documents rules as a way to provide persistent guidance to agents, with project-related configuration in the current rule system. Use the current rule format and scope controls rather than copying a legacy filename from an old tutorial. [Rules](https://cursor.com/docs/rules)

Good project guidance is specific and verifiable: use the existing package manager, keep status logic in the domain module, use synthetic fixtures in tests, and report commands actually run. Weak guidance repeats vague ambitions such as “write world-class code” without explaining the repository's conventions.

Keep instructions short enough to remain useful. A giant rule file containing every historical mistake can create contradictions and bury the current architecture. Put durable conventions in rules, task-specific requirements in the work order, and detailed reference material in linked documentation.

Review guidance when the repository changes. If the test command moves, update the instruction. If a rule refers to a deleted directory, remove it. An agent following stale instructions can waste time while appearing diligent. Treat guidance as part of the software's maintenance surface.

## Use parallel work only when it is separable

Cloud execution makes concurrency convenient. It does not make every task independent. Two agents editing the same aggregation function will produce overlapping changes and possibly incompatible assumptions. Split work by clear boundaries: one agent handles domain logic, another reviews accessibility, and a third researches a dependency only if those tasks can proceed without stepping on one another.

For Workspace Health, a useful dependency order is logic first, then explanation UI, then documentation. The UI needs the domain result shape. Documentation needs the final behavior. Starting all three with different assumptions can create rework. Parallelize investigation or independent checks while preserving dependencies in implementation.

Use an ordinary task board if that helps coordination. A card should include problem, source state, acceptance criteria, owner, evidence, and review status. Cursor's agent experience does not require you to invent an elaborate factory process. The board's purpose is to make work and blockers visible, not to turn every edit into ceremony.

Before merging parallel work, rerun the integration checks affected by the combined result. Two branches can pass independently and fail together when one changes a shared data contract. This is a reason for a final integration check, not an argument against delegation.

## Design one narrow automation

Cursor Automations currently run cloud agents on schedules or events, with selectable repositories and optional tools. The documentation lists integrations and describes configuring a trigger, instructions, tools, and repository scope. A multi-repository or no-repository automation is a different scope from a single task in one checkout. [Automations](https://cursor.com/docs/cloud-agent/automations)

For the learning project, design a weekly **status-fixture review** that inspects new check names and proposes updates to synthetic examples. Begin with a draft-only or reviewable output route supported by your configuration. Do not grant message-posting or merge capabilities merely because an example template includes them.

Write the automation contract as data:

```text
Trigger: weekly review, or manually for the first test.
Input: Workspace Health repository at the selected branch.
Task: find required-check names that lack a synthetic fixture case.
Output: a proposed patch and a concise evidence report.
Limits: no production requests, no merges, no external messages.
Verification: run relevant fixture and aggregation tests.
No-change behavior: report that no missing case was found.
```

This is a design sketch, not a Cursor automation configuration file. Create it through the current supported interface and inspect the resulting trigger, tools, and scope before activation. An automation that runs unattended needs especially clear no-change and failure behavior because no one may be watching every step.

## Prevent automation feedback loops

An event-driven agent can create the event that starts another run. For example, an automation proposes a patch, that patch updates a pull request, and the update triggers the same automation again. Plan a deduplication and eligibility policy using the controls available in your chosen workflow. Do not assume the prompt alone reliably prevents repeated work.

Use a stable task identity based on the repository, triggering change, and intended operation. Before producing another proposal, check whether the relevant proposal already exists. If a run is superseded by a newer commit, prefer reviewing the current state rather than publishing an obsolete conclusion.

Set a bounded work policy. The agent should not repeatedly rewrite the same fixture to satisfy its own previous suggestion. Ask it to report unresolved ambiguity and stop at a reviewable result. A useful unattended workflow has a clear completion condition and an understandable failure report.

Evaluate the automation manually several times before relying on its schedule. Include a no-change case, a missing-case fixture, a failing test, and an unavailable dependency. The automation should distinguish “nothing to do” from “could not inspect the repository.” Those outcomes have different implications for the person maintaining the project.

## Review the result as a software change

Reviewing an agent's output should answer four questions: does the patch satisfy the requirement, is the implementation appropriate for this codebase, what evidence supports it, and what new risk does it introduce? A long explanation cannot substitute for a small correct diff.

Use a before/after fixture in the review description. Before: required API and database checks, only API result present, dashboard says healthy. After: same data, status is unknown, missing database is explained. This makes the behavior understandable to a reviewer who did not see the conversation.

Inspect tests for meaning. A test that simply reproduces the implementation's array operations is less useful than one expressing the product rule. Include failure-plus-missing priority and empty configuration because those distinguish plausible implementations. Avoid adding dozens of trivial assertions just to inflate a coverage number.

If a generated test fails, investigate whether the test or code is wrong. Models can write incorrect tests too. The task brief remains the authority for the intended behavior. When the requirement is ambiguous, resolve it explicitly and update both implementation and tests together.

## Troubleshoot by source of failure

| Symptom | First investigation | Small next experiment |
| --- | --- | --- |
| Agent edits the wrong module | Repository orientation and scope | Ask for caller/data-flow map before another edit |
| Local tests pass, cloud tests fail | Runtime, dependency and environment differences | Print non-secret versions and run same command |
| Cloud agent cannot verify UI | Startup command and preview reachability | Start unchanged app and inspect printed endpoint |
| Rule appears ignored | Current rule scope and format | Use one small scoped instruction case |
| Two agents overwrite assumptions | Task boundary and source state | Integrate one contract change first |
| Automation repeats proposals | Trigger loop and deduplication | Replay same event identity |
| Final report overstates testing | Evidence requirements | Ask for actual commands and observed results |

Do not respond to every failure by selecting a larger model. A missing package, inaccessible endpoint, or contradictory task brief remains a problem for a stronger model. Improve the environment and contract first, then compare models on a stable task if the remaining difficulty justifies it.

## Cost, access, and choosing alternatives

Use current account pages to understand model usage, cloud execution, automation limits, and organization controls. The documentation's ability to describe a feature does not establish access for your plan. Track cost per accepted useful change, including review time and failed runs, rather than only tokens or tasks started.

Compare [GitHub Copilot](/factories/github-copilot/) when GitHub-native sessions and pull-request workflows dominate your work. Compare the broader factory and board tools in this guide when you need a different task-management model. For runtime infrastructure rather than a coding-agent product, study the [sandbox category](/sandboxes/) and ask which part of the environment you actually want to own.

Cursor is a sensible learning choice when interactive development, cloud delegation, and event-driven agent work belong in one workflow. It is not necessary to adopt every mode at once. Establish a useful local change, make the environment reproducible, then add remote and recurring work where they reduce a real bottleneck.

## Optional project and completion evidence

Deliver Workspace Health with the aggregation defect fixed, missing-check explanation, six meaningful domain cases, and a written automation design. If you run a cloud task, include its source state, environment summary, actual checks, and review outcome. If you activate an automation, record its trigger and capabilities and demonstrate no-change and failure cases.

Acceptance means missing data never becomes healthy, confirmed failure keeps priority, the UI explains uncertainty, the patch stays within scope, and reported verification matches observed evidence. A successful learning project is a repeatable workflow another developer can inspect, not merely a screenshot of an agent saying it finished.

Use this prompt with Cursor or another coding assistant:

```text
Inspect Workspace Health and current Cursor documentation. Fix the
missing-required-check behavior with the smallest coherent patch.
Preserve failure-over-unknown priority and existing public data shape.
Use synthetic fixtures and the repository's package manager. Explain
which environment the task runs in and verify its runtime/dependencies.
Run relevant checks, inspect the changed UI if tooling is available,
and report actual results with limitations. Propose a narrow recurring
fixture-review automation separately, with no merge or messaging tools.
Do not activate it, connect production services, or publish the app.
```

## A handoff drill for the complete workflow

Give another developer the task brief, starting commit, and environment notes without the original conversation. Ask them to reproduce the missing-check case and explain why degraded has priority over unknown. They should not need to read a hundred chat messages to recover the requirement. If they do, move the durable facts into the repository's documentation or review description.

Next ask them to inspect the cloud-agent result. Can they tell which checks ran remotely and which ran only on your laptop? Can they identify the environment configuration actually used? A committed configuration file is not evidence that the remote session selected it. Record the active environment and starting source state with the result so the comparison remains meaningful.

Finally, give them the automation contract and one duplicate trigger. They should be able to explain whether the workflow proposes another patch, reuses an existing proposal, or stops because a newer source state supersedes the run. If that behavior is unclear, keep the workflow manual while refining it. A useful automation removes routine coordination; it should not create a second maintenance problem that only its original author understands.

This drill is intentionally small. It tests whether the workflow is transferable, reviewable, and reproducible, which are the properties that turn a successful agent demonstration into a dependable development practice.

Keep that handoff drill as an optional team exercise whenever the workflow gains a new execution environment or unattended capability.

## Sources and verification boundary

Checked **November 13, 2026**: [Agent overview](https://cursor.com/docs/agent/overview), [Cloud Agents](https://cursor.com/docs/cloud-agent), [Cloud environment setup](https://cursor.com/docs/cloud-agent/setup), [Cloud Agent Builds](https://cursor.com/docs/cloud-agent/builds), [Rules](https://cursor.com/docs/rules), and [Automations](https://cursor.com/docs/cloud-agent/automations). These support the product's current working modes and setup entry points. Specific account access and configuration details remain live-documentation checks.

Workspace Health, its aggregation function, work orders, task-board advice, automation contract, and evaluation scenarios are original instructional examples. No Cursor account operation, cloud run, repository connection, automation activation, merge, or deployment was performed during authoring.
