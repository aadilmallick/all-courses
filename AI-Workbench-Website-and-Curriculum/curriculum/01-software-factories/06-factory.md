# Factory Droid & Missions


## Why this tool belongs in a software-factory curriculum

A coding assistant can finish an edit. A software-factory workflow must coordinate several edits, preserve agreements between them, and produce evidence that the whole result works. Factory provides Droid as the working agent and Missions as structured orchestration for multi-feature efforts. The official documentation describes collaborative planning, milestones, skills, and Mission Control. Its CLI exposes `/missions`; interactive work and headless execution are separate operating styles. [Missions overview](https://docs.factory.com/missions/overview), [Droid CLI overview](https://docs.factory.com/droid-cli/overview).

This chapter is a four-to-six-hour practical introduction. You will first delegate a small task in a normal session, then design a release-readiness mission. The aim is to understand orchestration without mistaking a long list of tasks for a working delivery system. Product terminology was checked November 13, 2026. The mission design, sample data, measurement method, and examples below are original instructional material. No Factory account, remote computer, or paid mission was run in preparing the guide.

Read [Foundations](../reference/foundations.md) and ideally [Codex](01-codex.md) for a general coding-agent loop. Familiarity with a repository, a test command, and a simple JSON file is enough. You do not need to be a project manager or understand distributed-systems internals to start. You do need to recognize dependencies between work items.

## From an individual session to a production line

Suppose ReleaseDesk needs four capabilities: validate release data, render release notes, produce a reviewer report, and explain the workflow. A single agent might attempt everything in one conversation. It could succeed, but the intermediate agreements remain implicit. The report might assume one data schema while the renderer implements another. The documentation might describe a command that existed halfway through development and was later renamed.

A mission makes those agreements reviewable. It names outputs, orders dependent work, and places validation at useful points. Think of it as a small production line with inspection stations. The analogy has limits: software tasks are not interchangeable manufactured parts, and an agent can change its interpretation while working. You still need to inspect the requirements and evidence at each meaningful boundary.

The scarce resource often becomes human review. Starting ten workers does not create ten reviewers. A productive mission gives you small, coherent decisions: approve an input contract, examine a completed milestone, or resolve a specific ambiguity. An unproductive mission leaves you a giant patch and asks whether everything looks good. Design the review experience before choosing the worker count.

## Understand the vocabulary

Use “goal” for the outcome, “feature” for an observable capability, “milestone” for a meaningful checkpoint, and “validation” for evidence that an agreed condition holds. These are teaching definitions that help you write a clear plan; the current interface may attach additional product behavior to each term. Avoid making a feature out of every file. Files are implementation details; features should explain why the work exists.

A worker receives a bounded assignment. An orchestrator coordinates the assignments and reacts to progress or failure. A skill is a reusable procedure or body of working instructions, while an MCP integration connects tools or information. A skill saying “validate a release manifest” is different from a tool that can fetch the manifest. One describes how to work; the other supplies a capability.

Mission state is also different from repository state. A feature marked complete might have been validated on a branch that has since changed. A check can be green while the milestone remains incomplete because documentation is missing. Always connect status to a concrete artifact and revision. This is the simplest protection against a visually impressive control panel becoming a substitute for engineering evidence.

## Set up a normal Droid session first

Follow the current platform-specific installation instructions in the [Droid CLI quickstart](https://docs.factory.com/droid-cli/quickstart). After installation and sign-in, start `droid` from a training repository. The quickstart’s small-change workflow is a useful starting point before using orchestration. Do not begin with a mission merely to explore the dashboard.

Ask Droid to identify the project’s entry points, conventions, dependency installation, and checks. Compare that explanation with the repository. If the project has no reliable check command, create or document one before moving on. An agent that can edit code but cannot exercise it will return a large volume of uncertain work more quickly.

Give it a small request such as adding a missing input example to the README. State the existing command the example should use. Review the change and ask for evidence that the documented command works with the supplied example. This tiny trial tests repository access, editing, command execution, and delivery with very little risk. It also helps you distinguish setup failures from orchestration failures later.

Keep the first interaction’s notes: what required manual repair, which environment assumptions were missing, and how the final evidence was presented. Those observations are inputs to mission readiness. Repeating an unresolved setup problem across several workers only multiplies the cost of discovering it.

## Build a mission around an explicit release contract

Here is synthetic release data for the curriculum’s recurring application:

```json
{
  "version": "1.4.0",
  "changes": [
    {"id": "RD-21", "title": "Save filtered searches", "kind": "feature"},
    {"id": "RD-22", "title": "Repair empty results", "kind": "fix"}
  ]
}
```

Save it as `release.json` in a training project. Decide what counts as valid before asking for implementation. For this lesson, `version` must be a nonempty string, `changes` must be an array, every change needs a unique nonempty ID and title, and `kind` must be `feature`, `fix`, or `maintenance`. These are curriculum requirements, not a Factory file format.

Now identify the outputs: a validator, a Markdown renderer, a machine-readable review report, a README, and a small demonstration fixture. The validator should reject invalid input; the renderer should only receive accepted data; the report should identify what was checked. This creates a natural dependency: the input contract and validator precede trustworthy rendering and reporting.

Write an example invalid case as carefully as a valid one. A duplicated ID should produce a useful message identifying the duplicate. A missing title should identify the item. An empty `changes` array can be a legitimate no-change release if you choose to allow it. Explicitly deciding this prevents the agent from silently treating an unusual case as an error.

## Enter Missions with a bounded brief

The documented CLI entry point is `/missions` (with `/mission` also documented). Use a fresh mission for work that needs planning rather than trying to retrofit a sprawling previous conversation into one. [Factory Missions](https://docs.factory.com/missions/overview).

Provide a brief that describes the release-readiness outcome:

```text
Build a release-readiness workflow in this training repository.
Input: release.json using the schema described below.
Outputs: validator, Markdown release notes, JSON review report,
and instructions for reproducing all outputs from a fresh checkout.
Use synthetic data and existing project conventions.
Plan milestones with clear dependencies and user-observable checks.
Keep production integrations and deployment outside this mission.
Before execution, show assumptions, deliverables, and validation
for each milestone. Ask only about decisions that block a sound plan.
```

Include the schema and example after the brief. Avoid assuming the orchestrator will recover requirements from an unrelated browser tab. If you refer to a document, make sure it is in the accessible repository or supplied context. A URL in a prompt is not a guarantee the environment can read it, and a linked document can change after you wrote the task.

Collaborative planning is an opportunity to remove ambiguity. If the agent asks whether to build a web UI, say the mission’s deliverable is a command-line workflow. If it proposes a database, ask which requirement needs persistence beyond the input and output files. Do not accept architectural expansion just because it sounds professional.

## Review the proposed milestone structure

A sensible plan for this exercise could look like this:

| Milestone | Deliverable | Depends on | Demonstration |
| --- | --- | --- | --- |
| Contract | Input rules and fixtures | Nothing | Valid and invalid examples are unambiguous |
| Validation | Validation module and command | Contract | Accepted input passes; named failures are useful |
| Outputs | Notes and report generation | Validation | Exact expected output from a fixed fixture |
| Integration | One reproducible workflow | Outputs | Fresh checkout reproduces results |

This is a teaching plan, not a promise that Factory will generate identical labels or files. Judge a proposed plan by the dependency structure and inspectable outcomes. A milestone called “backend” tells you where code goes; “validator rejects duplicate change IDs” tells you what becomes true.

Look for missing integration work. If the renderer and report are separate features, who ensures they use the same validated data? If documentation is parallelized, when is it reconciled with the final command names? A plan can contain every required component and still omit the glue that makes the system usable.

Watch for circular dependencies. “Write tests after implementation” is normal in some workflows, but “define the schema after tests that depend on it” is an unresolved agreement. You can refine a contract through examples before implementing it. The important point is to avoid different workers inventing different contracts independently.

## Design validation as a ladder

Not all checks answer the same question. A syntax check asks whether code can be parsed. A unit check asks whether one behavior matches a contract. An integration check asks whether components work together. A user-flow demonstration asks whether the intended outcome can be achieved. Use the least expensive check that can establish the relevant fact, then add broader evidence at a milestone boundary.

For ReleaseDesk, a unit test can prove duplicate IDs are rejected. It cannot prove the README command points to the correct file. A fresh-checkout demonstration can prove installation and command wiring, but it may miss an edge case that a unit test isolates clearly. These forms of evidence complement each other.

Write acceptance criteria in observable terms. Replace “robust error handling” with “malformed JSON prints a concise explanation and exits unsuccessfully; it does not create an output file that looks valid.” Replace “good documentation” with “a reader can run the sample from an empty output directory using only the README.” Specific criteria reduce arguments about whether a milestone is done.

Validation should also cover absence of unwanted effects. A validator should not rewrite the source release data. A report generator should not contact a production endpoint. A failed run should not leave a stale success report that gets mistaken for current evidence. These are practical file and workflow properties you can observe directly.

## A complete local example of a validation gate

Before using an agent, understand a tiny gate yourself. Save this as `gate.mjs`:

```js
import fs from 'node:fs';

export function validateRelease(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return ['release must be an object'];
  }
  if (typeof data.version !== 'string' || !data.version.trim()) {
    errors.push('version must be a nonempty string');
  }
  if (!Array.isArray(data.changes)) return [...errors, 'changes must be an array'];
  const seen = new Set();
  data.changes.forEach((change, index) => {
    const where = `changes[${index}]`;
    if (!change || typeof change !== 'object') {
      errors.push(`${where} must be an object`);
      return;
    }
    if (typeof change.id !== 'string' || !change.id.trim()) {
      errors.push(`${where}.id is required`);
    } else if (seen.has(change.id)) {
      errors.push(`${where}.id duplicates ${change.id}`);
    } else seen.add(change.id);
    if (typeof change.title !== 'string' || !change.title.trim()) {
      errors.push(`${where}.title is required`);
    }
    if (!['feature', 'fix', 'maintenance'].includes(change.kind)) {
      errors.push(`${where}.kind is unsupported`);
    }
  });
  return errors;
}

if (process.argv[2]) {
  try {
    const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    const errors = validateRelease(data);
    console.log(JSON.stringify({valid: errors.length === 0, errors}, null, 2));
    process.exitCode = errors.length ? 1 : 0;
  } catch (error) {
    console.error(`Cannot validate release: ${error.message}`);
    process.exitCode = 1;
  }
}
```

Run `node gate.mjs release.json`. The sample should produce `valid: true` and an empty error list. Duplicate one ID and rerun; it should report the duplicate and signal failure. `Set` remembers IDs already encountered. Early return for a nonarray avoids trying to loop over invalid data. `process.exitCode` communicates failure to a surrounding workflow without abruptly interrupting normal output handling.

This is intentionally a small example, not a complete production schema validator. It demonstrates how a milestone can have an objective gate. If your project already uses a schema library, follow that convention rather than copying a new validator. The lesson is to make the condition executable and explainable, not to standardize on hand-written validation.

## Monitor Mission Control as an active collaborator

Factory’s CLI documentation describes Mission Control as the orchestration view after plan approval and explicitly says Missions need intervention when work stalls or priorities change. Treat the control view as a place to inspect evidence and unblock work. [Running in the CLI](https://docs.factory.com/missions/running-cli).

At each milestone, ask what changed, what evidence was produced, and whether the next work still rests on valid assumptions. If a worker cannot start the application, distinguish an environment problem from a product defect. Repeated attempts at an impossible command are not useful persistence. Pause, inspect the command and missing dependency, and change the plan or setup deliberately.

When redirecting, give a concise explanation of the new fact. “The release report is consumed by a script that requires a Boolean `valid` field; update the contract and affected output checks before continuing” is actionable. “Make the report more enterprise-ready” is not. A good intervention narrows the next decision and makes its consequences visible.

Keep a small decision log outside the transient stream of messages. Record the decision, why it changed, and which outputs are affected. If `kind` becomes optional midway through the mission, the validator, fixtures, renderer, and README may all need revision. The log makes it less likely that a worker continues with the old assumption.

## Reason about concurrency and bottlenecks

Parallelism is useful when tasks can progress without repeatedly changing a shared interface. The help document’s prose and a renderer’s internal implementation can often proceed together after command names and output examples are agreed. Two workers editing the same exported function may spend their time integrating rather than implementing.

A rough throughput model is `accepted work / elapsed time`. “Accepted” matters: ten unreviewed patches are inventory, not completed value. If review takes fifteen minutes per patch and you can spend an hour reviewing, producing twenty patches creates a queue. Smaller batches or stricter upstream validation may improve real throughput more than another worker.

Watch for shared resources beyond files. Parallel tests might use the same port, fixture directory, temporary filename, or test database. A worker can fail because another worker changed the environment underneath it. Give tasks separate temporary paths and isolated test data where practical. Then combine their outputs through an explicit integration step.

Do not equate orchestration with mandatory parallel execution. Some projects are mostly sequential because each feature defines the interface for the next. A good plan acknowledges that structure. For a first mission, two clean milestones with useful evidence are more educational than a complicated team graph whose behavior you cannot interpret.

## Reuse skills after the procedure stabilizes

A reusable skill should encode a procedure that has worked and is likely to recur. After completing release validation twice, you might capture the steps: locate the release input, identify the schema, run the validator, inspect failures, produce a report, and name the input revision. Avoid turning your first untested attempt into a permanent policy.

Separate stable procedure from task-specific parameters. “Validate against the project’s documented schema” is reusable. “Always require version 1.4.0” is a fixture assumption. If the skill copies an exact example, label it as an example. Otherwise a later mission may hard-code the teaching data into the implementation.

Skills also need maintenance. A renamed command can break a previously reliable workflow. Include a way for the agent to detect that a procedure is out of date: inspect current project scripts and report a mismatch instead of silently substituting a command. This makes the skill a helpful starting point rather than an instruction to ignore reality.

MCP integrations and hooks add power, but introduce them to solve observed needs. A local release validator does not require access to issue trackers, messaging services, and production monitoring. Add one integration at a time, verify the data and authority it supplies, and document the workflow’s behavior if it is unavailable.

## Handle retries, partial completion, and budget

A retry should preserve useful evidence without pretending failed work succeeded. If implementation passed but documentation failed, identify the incomplete artifact. If a milestone’s input changed, rerun checks against the new revision even if the previous attempt was green. A check belongs to the state it observed.

Set a learning budget in the account’s supported controls and monitor usage before scaling up. Model work, orchestrator reasoning, worker execution, remote compute, and third-party services can contribute differently to total cost. Check the current plan documentation for your account. A mission that retries indefinitely can be expensive even if individual calls are inexpensive.

Use a stop condition tied to progress, such as investigating after the same validation failure repeats without a new hypothesis. This is a working practice, not a product configuration claim. The aim is to prevent repeatedly paying for the same failed experiment. Ask the orchestrator to explain what changed between attempts; if nothing material changed, intervene.

Preserve a reviewable partial result. A feature branch, decision log, check output, and list of incomplete criteria make resumption possible. “Almost done” does not. Recovery becomes much easier when each milestone leaves a coherent artifact that another person can understand without replaying the entire conversation.

## Troubleshooting a mission

| Observation | What to inspect | Better intervention |
| --- | --- | --- |
| Every worker fails at setup | Shared environment and baseline command | Repair readiness before restarting workers |
| Features complete but the app fails | Interface agreements and integration ownership | Add or repair the integration milestone |
| A worker repeatedly rewrites one module | Unresolved acceptance criteria | Supply a concrete example and freeze the contract |
| Report contradicts command output | Evidence handling | Require observed output and input revision |
| Work expands beyond the goal | Plan boundaries | Move new ideas to a later mission |
| Long validation dominates runtime | Check layering | Use focused checks during work and broader gates at boundaries |
| Status is green but artifacts are missing | Delivery criteria | Make artifact existence and reproducibility explicit |

When diagnosing, distinguish a product failure from an exercise design failure. If the plan never named the output location, files appearing in an unexpected folder may reveal a weak brief. If the location was explicit and ignored, the implementation failed the contract. Both deserve correction, but they imply different improvements to your workflow.

## Compare Factory with adjacent tools

Choose Factory when you want a packaged agent workflow with explicit planning and orchestration concepts and are willing to learn its operating model. Consider [Devin](05-devin.md) for managed delegation with sessions and reusable Skills (plus legacy Playbooks), [OpenHands](07-openhands.md) when composability and control of the agent stack are central, and [Paradev](08-paradev.md) for a task-to-workspace control surface on supported platforms. The [Vibe Kanban lifecycle note](../reference/changes-vibe-kanban.md) explains an important hosted-service sunset in this category.

These are selection dimensions, not universal performance rankings. Run the same small release-readiness contract through your shortlisted tools. Compare accepted behavior, your review time, setup burden, and recovery clarity. A more elaborate orchestrator can be the wrong choice for a one-function patch. A normal Droid session remains a useful option when a mission adds no meaningful structure.

## Optional application and acceptance checks

Complete the four-milestone release-readiness workflow using your own training repository. Preserve the initial brief, approved plan, one example intervention, and final outputs. Create both a valid fixture and at least three invalid fixtures that fail for different reasons. Run the workflow from a fresh checkout or clean project copy.

The application is complete when another reader can reproduce the outputs from the instructions, invalid input does not produce a misleading success artifact, the report names the evaluated input, and all deliverables correspond to the final interface. Include a short retrospective: which work could run independently, which dependency surprised you, and which check caught a meaningful problem.

For a deeper extension, add a second release format without changing the first format’s behavior. Ask the mission to compare two implementation options before editing. Judge the plan by compatibility, migration effort, and testability. This introduces real design tradeoffs while remaining small enough to review independently.

## A prompt for planning and reviewing a mission

```text
Goal: make release readiness reproducible in this repository.
Context: inspect current conventions, input fixtures, and check commands.
Plan: separate contract, validation, output generation, and integration.
For each milestone, name dependencies, artifacts, and observable gates.
Constraints: synthetic data, existing runtime, no deployment, no unrelated
integrations, and no broad rewrite without a requirement that needs it.
Execution: surface blocked prerequisites and repeated failures clearly.
Delivery: final patch, usage instructions, input/output examples, and a
report that distinguishes observed checks from unrun recommendations.
Review: explain any criteria that remain unmet rather than marking the
mission complete because its workers stopped.
```

Use this with Factory’s planning workflow, or ask Claude or Codex to review the proposed plan against it. Reviewing a plan is separate from launching a mission. Nothing in this prompt installs tools or authorizes access beyond the training project you choose.

## Practice a milestone handoff

Before moving from validation to rendering, write a short handoff that another worker could use without reading the entire transcript. Include the exported validation interface, accepted input example, failure representation, check command, and the revision containing the agreement. Then inspect whether the renderer actually uses that interface. This exercise exposes a common orchestration weakness: a plan can declare a dependency without delivering the information needed to satisfy it.

For example, if validation returns an array of errors, the renderer should not assume it receives an object with a `valid` property. Both interfaces are reasonable in isolation. The defect is the disagreement. Resolve it in the contract, update affected checks, and rerun the combined workflow. Avoid adding an adapter merely to conceal an accidental mismatch unless compatibility with an existing consumer requires it.

The handoff is complete when the next worker can name its input, expected output, and failure behavior from a small artifact. This reduces dependence on conversation memory and makes a stopped mission easier to resume. It also gives you a useful review checkpoint before more implementation accumulates.

## Sources and verification boundary

- [Droid CLI quickstart](https://docs.factory.com/droid-cli/quickstart) — initial interactive workflow; accessed November 13, 2026.
- [Droid CLI overview](https://docs.factory.com/droid-cli/overview) — CLI, skills, integrations, and headless concepts; accessed November 13, 2026.
- [Factory Missions overview](https://docs.factory.com/missions/overview) — planning, milestones, orchestration, and readiness; accessed November 13, 2026.
- [Running Missions in the CLI](https://docs.factory.com/missions/running-cli) — monitoring and intervention; accessed November 13, 2026.

The cited pages establish documented product concepts. The mission brief, code, scorecards, and operational advice are curriculum examples. Account access, plan limits, current interface labels, and paid mission behavior require verification in your own environment.
