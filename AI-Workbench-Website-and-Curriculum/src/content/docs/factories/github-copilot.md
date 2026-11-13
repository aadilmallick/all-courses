---
title: GitHub Copilot
description: Learn repository-native agent sessions, environment choices, pull-request review, and controlled automation.
sidebar:
  order: 4
---

## Start with the current product boundary

GitHub Copilot is a family of coding-assistant experiences, not one identical agent running everywhere. GitHub's current documentation distinguishes the newer **Copilot in the cloud** experience from the older cloud-agent plus chat experience. The new web/mobile experience became available to paid-plan users starting October 28, 2026, subject to organization and enterprise policy. Check which experience and environment your account actually offers before following older tutorials. [Copilot on GitHub.com and GitHub Mobile](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)

This chapter teaches **Release Note Builder**, an original small repository tool that turns synthetic merged-change records into a draft release note. The project gives you a useful agent workflow: understand an existing repository, specify a behavior change, choose where the agent runs, inspect session evidence, review a pull request, and design an automation that proposes work without silently publishing it.

Allow four to six hours for the full learning path. You need basic Git, JavaScript, and pull-request familiarity. A live cloud task requires appropriate GitHub repository access and Copilot eligibility. The local examples need only Node.js. No GitHub repository was connected, issue assigned, cloud session started, pull request created, or automation activated during authoring.

## The problem: repository context is useful, but not sufficient

A repository holds code, tests, issues, documentation, and prior decisions. An agent can use that context to investigate and implement a change. The same abundance creates ambiguity: an old issue may describe obsolete behavior, a test fixture may contain instructions as sample data, and a README may have a stale setup command. The agent needs a clear task and a way to verify which evidence matters.

Release Note Builder currently includes unmerged changes in a draft. A human reader may interpret those notes as shipped functionality. The required fix is to include only merged records, group them by supported category, preserve a stable order, and flag unknown categories for review. The output remains a draft; generating a file is not publishing a release.

This is a good first delegated task because correctness is observable. You can supply a small fixture containing merged, closed-unmerged, and open records and inspect the result. The agent should not need production credentials or broad organization access. You can focus on the delivery process rather than debugging an entire deployment system at once.

Treat the agent as one participant in the repository workflow. It can research, propose, edit, and run checks. The repository's permissions, branch policies, review expectations, and release process still matter. A green status from one check does not mean a change satisfies every requirement, and a generated pull-request summary is not a code review.

## Learn client, session, and environment separately

GitHub's current conceptual model separates the **client** you interact with, the **session** containing the work and conversation, and the **environment** where commands execute. You may steer from a web page while the code runs elsewhere. Do not infer execution location from the device displaying the conversation. [Copilot on GitHub.com and GitHub Mobile](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)

A cloud sandbox is a GitHub-hosted isolated Linux environment for a session. GitHub Actions-based sessions use an Actions execution environment. Remote/custom environments are another route in supported clients, with the host managed separately. Local sandboxing limits resources on your own machine and is a different concept from moving the whole session into the cloud. [About cloud sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-sandboxes)

For the learning project, write down the selected client, session identifier, environment type, repository, branch, and starting commit. These are different fields. A screenshot of the chat does not identify the source state. A branch name does not establish which commit was checked out when tests ran.

Understand that repository context and write authority are also different. The ability to read several repositories does not imply permission to change all of them. Your task brief should identify the intended change scope, and the backend permissions should enforce the actual access boundary.

## Choose an environment for a concrete reason

Use the current selection controls and documentation for your client. A cloud sandbox can be appropriate when a standard remote Linux environment fits the task and session continuity matters. An Actions-based session may fit a repository that relies on Actions-specific setup, custom runners, or a Windows environment. A custom environment is an operational commitment because you manage the host and its lifecycle. [About cloud sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-sandboxes)

Do not copy an Actions setup file and expect it to configure every environment. GitHub explicitly states that `.github/workflows/copilot-setup-steps.yml` applies to sessions running on GitHub Actions, not cloud sandbox sessions. Follow the configuration path for the environment actually selected. [Configure the Actions environment](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)

For Release Note Builder, begin with the simplest environment that can run the repository's documented Node checks. It needs source code, a runtime, and dependencies if the project has them. It does not need a release-publishing token. Keep that credential absent so a wording mistake cannot become an accidental release operation.

If setup fails, distinguish environment repair from implementation work. A private package registry requiring authentication is an environment issue. A failing assertion about unmerged changes is a product issue. Ask the agent to report them separately so you can decide the next step without guessing.

## Define the work as a reviewable issue

Use this original task description in your own repository workflow:

```text
Problem: draft release notes include changes that were never merged.
This makes the draft misleading for the person preparing a release.

Required behavior:
1. Include only records with merged === true.
2. Group included records into Added, Fixed, and Changed.
3. Put unknown categories into Needs review; do not silently discard them.
4. Preserve input order within each group.
5. Label the output as a draft and do not publish a release.

Scope: parser/grouping logic, directly related tests, and usage docs.
Use synthetic input. Preserve the current public interface where possible.
Do not change dependency versions unless the fix requires it.

Verification: demonstrate merged, open, closed-unmerged, and unknown-category
cases. Run relevant checks and report actual results and limitations.
```

The issue explains the user consequence, not just the implementation request. It also prevents a tempting but incorrect simplification: dropping unknown categories. An unknown category is a review signal. Hiding it makes the generated notes appear complete while losing information.

Ask the agent to identify the existing parser and callers before editing. If the repository already has a category vocabulary, use it rather than imposing the example's names without inspection. The task brief's behavior is the important part; adapt the exact labels to the actual product deliberately.

## A complete offline implementation example

Save this as `release_notes_demo.mjs` and run `node release_notes_demo.mjs`. It uses synthetic records and no GitHub API, Copilot SDK, or network connection.

```javascript
import assert from 'node:assert/strict';

const headings = new Map([
  ['added', 'Added'], ['fixed', 'Fixed'], ['changed', 'Changed']
]);

function draftReleaseNotes(records) {
  const groups = new Map([
    ['Added', []], ['Fixed', []], ['Changed', []], ['Needs review', []]
  ]);
  for (const record of records) {
    if (record.merged !== true) continue;
    if (typeof record.title !== 'string' || !record.title.trim()) {
      throw new Error('Merged records require a title');
    }
    const heading = headings.get(record.category) ?? 'Needs review';
    groups.get(heading).push(record.title.trim());
  }
  const lines = ['# Draft release notes'];
  for (const [heading, titles] of groups) {
    if (!titles.length) continue;
    lines.push('', `## ${heading}`, '', ...titles.map(title => `- ${title}`));
  }
  if (lines.length === 1) lines.push('', 'No merged changes in this input.');
  return lines.join('\n') + '\n';
}

const input = [
  {title: 'Add demo export', category: 'added', merged: true},
  {title: 'Fix missing date', category: 'fixed', merged: true},
  {title: 'Unmerged experiment', category: 'added', merged: false},
  {title: 'Update sample data', category: 'maintenance', merged: true},
  {title: 'Second demo export', category: 'added', merged: true}
];
const output = draftReleaseNotes(input);
assert.ok(!output.includes('Unmerged experiment'));
assert.ok(output.includes('## Needs review'));
assert.ok(output.indexOf('Add demo export') < output.indexOf('Second demo export'));
assert.ok(draftReleaseNotes([]).includes('No merged changes'));
assert.throws(() => draftReleaseNotes([{merged: true, category: 'fixed'}]));
console.log(output);
```

The strict `merged !== true` check prevents a truthy string such as `"false"` from being treated as merged. `Map` preserves the specified heading order, and each array preserves input order. Unknown categories are visible. A merged record without a title fails clearly instead of producing an empty bullet.

The function is deliberately not a complete Markdown sanitizer or GitHub release publisher. If titles can contain untrusted Markdown, decide how to render them safely in your application. That is a separate requirement from selecting merged records. Keep the first patch focused, then add a specific sanitization task if the actual output surface requires it.

## Start the session from the route you use

GitHub documents several entry points for agent sessions, including repository and issue workflows, web clients, IDEs, and other integrations. Some routes create a pull request automatically; others let you request one or create it after reviewing the session's result. Use the current instructions for your chosen route rather than assuming every session behaves like an older issue-assignment tutorial. [Starting sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions)

For learning, choose one repository and one branch. Attach the task and relevant fixture. Ask for investigation first if the code location is unclear, then implementation. You can use a prompt such as:

```text
Inspect this repository and locate release-note generation, its callers,
and the documented check commands. Explain the current handling of
unmerged records. Then implement the attached issue with a small diff.
Use the selected branch and synthetic fixtures. Return a draft result
and evidence; do not publish a release or merge changes.
```

Avoid changing source under the agent without acknowledging it. If you push a new commit or make a parallel edit, the agent may be working from an older state. Decide whether to rebase, restart, or steer the session using the client's supported workflow. The right choice depends on the size and overlap of the changes.

## Steer with evidence instead of repeated broad prompts

If the first result includes unmerged changes, give a precise counterexample and expected behavior. “Record 3 has `merged: false`; it must not appear” is actionable. “Try harder” adds no information. If the agent changes unrelated formatting, point back to the scope boundary and ask it to remove that noise.

If it cannot run tests, ask for the exact failure category and smallest environment repair. Do not accept “verified” when the command failed before executing assertions. If tests reveal a pre-existing failure, compare against the starting commit or a known baseline. A new patch should not be blamed for every old problem, but old problems should not be hidden either.

Use a short acceptance table in the session:

| Input case | Expected result |
| --- | --- |
| Merged added record | Appears under Added |
| Open record | Excluded |
| Closed but unmerged record | Excluded |
| Merged unknown category | Appears under Needs review |
| Two records in one category | Preserve input order |
| Empty input | Clear empty draft message |

This table is independent of implementation. It remains useful if the agent refactors the parser, changes the data structure, or proposes a different testing style. Review the actual cases rather than the number of test files created.

## Read session logs as evidence, not as approval

GitHub documents session management and logs for following agent work. Logs can show commands and tool activity, while the resulting diff shows the source change. Both are useful, and neither replaces code review. [Managing agent sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)

For Release Note Builder, inspect whether the agent read the existing implementation, ran the relevant test command, and used the intended fixture. A command that prints a sample output is evidence about that sample. It does not establish all edge cases. A test suite that passes before and after can still miss the original defect unless a meaningful case was added.

Keep a compact report with source commit, environment, changed files, checks run, results, and limitations. The report should make the next review step easy. Do not require a reviewer to reconstruct the entire session to learn that the UI was never opened or that one dependency could not install.

If the agent claims a tool action occurred, look for its result. “I opened a pull request” should correspond to an actual repository object. “I prepared a pull-request description” is different. Precise verbs reduce confusion when work moves between clients or when a session stops before the final action.

## Review the pull request as a product change

Lead the description with the bug and resulting behavior: drafts previously included unmerged records; they now include only merged records and flag unknown categories. Include a before/after example and the relevant validation. A reviewer should understand the change without seeing the prompt that produced it.

Inspect the diff for semantic mistakes. Does `merged` come from a trustworthy field? Are closed and merged conflated? Does grouping reorder entries unexpectedly? Does an unknown category disappear? Does the output still say “draft”? These are more important than whether the agent used your preferred variable names.

Review tests critically. A generated test can encode the same wrong assumption as the implementation. Use the issue's examples as an independent reference. If the task says strict boolean `true`, a test that treats `"true"` as merged may represent scope drift rather than helpful flexibility.

Check for unrelated changes: lockfile churn, broad formatting, copied credentials, or a publishing step added to make the demo impressive. Remove unnecessary changes before review. A small patch is easier to reason about and safer to merge when the behavior is well defined.

## Use Copilot review as another reviewer

GitHub documents Copilot code review as a separate capability that identifies potential issues and suggests fixes. It has its own availability, settings, and usage behavior. A generated pull-request summary is not the same feature as reviewing the code. [Copilot code review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)

Ask review questions tied to the defect: “Can an unmerged record still enter the output?” and “Are unknown categories visible?” A broad review may find other issues, but targeted questions help you verify the change's central claim. Do not apply every suggestion automatically. Evaluate whether the finding is real, relevant, and supported by the current code.

When a review suggestion proposes a new behavior, compare it with the issue. For example, sorting alphabetically may look tidy but violate stable input order. Rejecting the suggestion is appropriate when the requirement is clear. If the suggestion reveals an ambiguity, resolve the requirement and update tests rather than silently changing scope.

Keep human review responsible for the final decision. Agreement between the authoring agent and reviewing agent is useful but not independent proof of correctness. They may share assumptions or miss the same case. The synthetic fixtures, source code, and product rule remain the evidence you can inspect directly.

## Add repository guidance that helps future work

GitHub provides customization routes for instructions, agents, skills, hooks, and tools. Use the current guide for the feature and surface you actually use. Do not assume a customization available in a cloud sandbox is applied identically to Actions-based or local sessions. [Customize Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot)

For this repository, useful guidance might say where domain logic lives, which package manager to use, how to run focused tests, and that release-note generation remains draft-only. Keep these durable facts separate from the current issue's temporary requirements. A one-off bug reproduction should not become an eternal global instruction.

Treat repository text as potentially untrusted input when it comes from issues, pull requests, logs, or external documents. A fixture may intentionally contain a string that looks like an instruction. The agent should analyze it as data. Do not give task content authority to redefine credentials, bypass review, or publish artifacts.

Keep tool access narrow. A release-note draft generator may need repository read access and branch edits. It does not need billing administration or a general-purpose production secret. More context is not always better; give the agent the information and authority the task requires.

## Understand multi-repository work without overgeneralizing

Current GitHub documentation distinguishes repository scope by environment. The older blanket statement that every delegated task is single-repository is no longer accurate for all newer cloud sessions. Conversely, cloud capabilities do not mean Actions-based restrictions disappear. Check the environment-specific documentation and your selected scope before planning a coordinated change. [Copilot on GitHub.com and GitHub Mobile](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)

For learning, keep Release Note Builder in one repository. A later extension can read synthetic change records from two related projects. Define ownership, version compatibility, and the order of proposed changes before asking an agent to coordinate them. Cross-repository access should solve a real dependency, not become the default scope for every task.

If two repositories must change, each needs a reviewable result and a clear integration plan. A patch in the library may need to land before its consumer can pass tests. An agent can help coordinate that dependency, but a single chat saying “done” does not establish that all repositories reached a compatible state.

Use contract fixtures where possible. A sample record format shared between projects can make compatibility testable without giving every agent unrestricted access to the whole organization. Keep the narrowest useful context and expand when evidence shows it is insufficient.

## Design a controlled automation

GitHub documents Copilot automations for recurring or event-driven agent work, with eligibility and repository constraints that should be checked in current documentation. It also documents GitHub Agentic Workflows as a related but distinct route. Do not treat every Markdown-based workflow example as the same automation system. [Copilot automations](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-automations)

For the project, design a weekly release-note **draft** task. It reads merged synthetic change records since a clearly defined cutoff, updates a draft file, and produces a reviewable proposal. It does not publish a release, tag a commit, send an announcement, or merge its own patch.

Original automation contract:

```text
Input: selected repository and explicit release range/cutoff.
Trigger: manual trial first; recurring schedule only after review.
Task: generate draft notes from merged changes using existing logic.
Output: proposed draft update with source references.
No-change behavior: report that no merged changes were found.
Failure behavior: report incomplete inspection; do not label draft complete.
Limits: no release publication, tags, merge, or external announcements.
Verification: run grouping tests and inspect unknown-category section.
```

This is a design artifact, not a valid workflow file. Create the actual automation using the current supported interface and inspect its configuration. Do not invent YAML keys from another product. A natural-language task still needs a precise trigger, scope, capability set, and completion condition.

## Prevent repeated work and misleading drafts

A recurring job needs an explicit release range. “Recent changes” is ambiguous and can include the same records repeatedly. Store or derive a stable cutoff appropriate to your release process. If the draft is regenerated, make the result deterministic so identical input does not create meaningless diff churn.

Handle unknown categories visibly. The automation should not quietly drop them to make the draft look clean. It can propose a category mapping for review, but that is a different action from asserting the release note is complete. Keep unresolved items in a review section until someone decides how they should be described.

Avoid feedback loops. A draft-update pull request can itself become a new repository event. Use the workflow's supported eligibility and deduplication controls so the automation does not respond endlessly to its own output. Include a duplicate-trigger test during the manual trial.

Distinguish “no changes” from “could not inspect.” An API error or permission failure should not produce an empty release note labeled complete. Return a clear failure and retain the last known good draft until a new run succeeds. This is an application truth problem, not merely a scheduler setting.

## Troubleshoot the right boundary

| Observation | First investigation | Controlled test |
| --- | --- | --- |
| Feature missing from UI | Plan, policy, current/older experience | Read account-specific availability and selected surface |
| Setup file appears ignored | Environment type | Confirm Cloud versus Actions before editing setup |
| Agent lacks latest local edits | Starting source state | Compare commit and branch explicitly |
| Tests never execute | Runtime/dependency setup | Run the documented command unchanged |
| Unmerged records remain | Business filter and field semantics | Offline fixture with strict boolean values |
| Reviewer suggests conflicting sort | Requirement versus style preference | Stable-order case from issue |
| Automation produces empty draft on failure | Error/status handling | Simulated failed inspection |
| Same patch appears repeatedly | Cutoff and trigger deduplication | Replay identical input/event |

Do not fix a permission problem by copying broader credentials into the task. Identify the required operation and use the supported access route. Do not fix an environment mismatch by assuming an old tutorial's setup file applies to a new cloud sandbox. The selected environment determines the relevant configuration boundary.

## Measure value and compare alternatives

Measure accepted useful changes, review time, regression rate, failed runs, and cost for the complete workflow. Count rework: a fast patch that needs extensive correction may save less time than a slower precise patch. Keep the task and evidence stable when comparing tools or models.

Current billing can involve AI usage and environment compute or storage according to the selected feature. Consult current account and billing documentation rather than multiplying one remembered rate by task count. Organization policy can change what is available even when your personal plan supports a feature.

Compare [Cursor](/factories/cursor/) when editor-driven iteration and its cloud/automation workflow are a better fit. Compare the other factory and board tools in this guide when you need a different orchestration or task-management model. Study the [sandbox category](/sandboxes/) if your primary need is execution infrastructure rather than a GitHub-native coding product.

## Optional project and completion evidence

Deliver Release Note Builder with strict merged selection, visible unknown categories, stable grouping, and a draft label. Include the synthetic fixture, meaningful tests, a concise review description, and an automation design. If a cloud session was used, record client, environment, source state, checks, and limitations.

Acceptance means no unmerged record appears, unknown categories remain reviewable, repeated identical input gives stable output, and no release is published. Another developer should reproduce the offline result without your account. A live Copilot run is useful evidence of the workflow, but the business behavior should also be inspectable independently.

Use this prompt with Copilot or another coding assistant:

```text
Inspect this repository and current GitHub Copilot documentation. Fix
Release Note Builder so only strict merged=true records appear, unknown
categories go to Needs review, and input order remains stable within
groups. Keep output draft-only. Confirm the selected client, environment,
branch, and starting source state before changing setup assumptions.
Use the repository's existing conventions and synthetic fixtures. Run
relevant checks and produce a small reviewable patch plus actual results.
Propose a recurring draft workflow separately with explicit cutoff,
no-change/error behavior, and deduplication. Do not activate automation,
publish releases, tag commits, merge, or send announcements.
```

## Sources and verification boundary

Checked **November 13, 2026**: [Copilot on GitHub.com and GitHub Mobile](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github), [About cloud sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-sandboxes), [Configure the Actions environment](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment), [Starting sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions), [Managing agent sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents), [Customize Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot), [Code review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review), and [Copilot automations](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-automations).

The release-note code, task brief, automation contract, and review scenarios are original teaching examples. No authenticated GitHub or Copilot operation was performed. Recheck current plan, organization policy, repository compatibility, environment selection, and billing before live use.
