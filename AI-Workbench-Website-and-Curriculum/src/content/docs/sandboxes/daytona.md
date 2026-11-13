---
title: Daytona
description: Build repeatable agent workspaces and understand execution, sessions, snapshots, and lifecycle policies.
sidebar:
  order: 2
---

## Why study Daytona

An agent that edits a repository needs more than a text-completion interface. It needs a working directory, runtimes, dependencies, command execution, and a way for somebody to inspect its work. Daytona gives you a concrete environment-management surface to study these requirements. This chapter takes you from one remote command to a repeatable workspace for an agent-assisted maintenance task. Allow four to six hours if you follow the optional application.

The researched baseline is **November 13, 2026**. The opened Python reference identifies the documented line as **v0.231** and separately links a **v2.0 Alpha**. This chapter uses the documented v0.x Python methods shown in the cited references; do not mix them with alpha documentation without a migration check. Daytona's current SDK exposes sandbox creation and process execution. [Python SDK](https://www.daytona.io/docs/en/python-sdk/).

An account, API key, supported Python installation, network access, and available resources are prerequisites for the cloud walkthrough. No Daytona service was provisioned while preparing this lesson. Resource choices, regions, entitlements, and prices remain account-specific decisions to check before running it.

## Start with the environment, not with a prompt

Suppose you ask an agent to add a CSV export to an internal task tracker. The code change might be straightforward. The environment often is not: one command requires Node, tests require a second service, the repository assumes a particular working directory, and the application needs a known port for preview. If each new agent has to rediscover this setup, the expensive part of the workflow becomes repeated configuration.

A repeatable workspace shifts this knowledge from chat history into a versioned setup. You can describe the base environment once, create a workspace for a task, apply a change, run checks, inspect the result, and dispose of the workspace. That is the foundation of a useful software factory: explicit inputs, observable execution, and reviewable outputs.

Distinguish three objects. An **environment definition** says how to obtain a working toolchain. A **sandbox instance** is a particular environment with current files and processes. A **task record** describes what the agent is trying to accomplish and what evidence supports completion. These objects have different lifetimes. A task can fail without invalidating the environment definition; a sandbox can disappear while the task record remains useful.

Daytona's terminology includes snapshots and lifecycle operations. Learn the current product meaning before applying analogies from another provider. “Snapshot” can refer to reusable environment state, while a user's edited project files may require separate preservation. A name shared by two products does not establish compatible formats or identical memory semantics.

## The prerequisites that prevent confusing errors

Be comfortable reading a short Python script and basic shell commands. You should understand that the SDK runs on your computer while commands execute inside remote Linux. A command's `cwd` is its working directory. An environment variable belongs to a particular process context; setting one in your local terminal does not necessarily set it inside the remote sandbox.

Understand the difference between an API request timeout and an execution timeout. A request timeout describes how long the controller waits for an answer. The underlying operation might continue after that wait ends. A command timeout describes a limit on the execution operation according to the API. Neither implies that the entire sandbox has been deleted.

You also need the basic Git model: a commit identifies a source snapshot; a branch names a moving line of development; uncommitted edits exist only in the working tree until saved elsewhere. A sandbox is not a substitute for source control. If it holds the only copy of valuable code, deletion is data loss regardless of how repeatable the base image is.

For the first run, use a new empty project and synthetic data. An infrastructure lesson should not begin by connecting a production repository with broad secrets. Introducing that complexity later makes it easier to tell whether a failure belongs to provisioning, repository access, application setup, or agent behavior.

## First command, first useful boundary

Create a Python virtual environment, then install the SDK:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install daytona
```

On macOS or Linux, substitute your environment's Python path. Supply `DAYTONA_API_KEY` through your current process environment or secret manager. The SDK's documented environment configuration also includes API URL and target settings. Do not print the key while troubleshooting. [SDK configuration](https://www.daytona.io/docs/en/python-sdk/).

Save this as `first_daytona.py`:

```python
from daytona import Daytona

daytona = Daytona()
sandbox = daytona.create()
try:
    response = sandbox.process.exec(
        "printf 'workspace-ready\\n'",
        timeout=10,
    )
    print(response.result)
    print("exit:", response.exit_code)
    if response.exit_code != 0:
        raise RuntimeError("Remote readiness check failed")
finally:
    daytona.delete(sandbox, wait=True)
```

Expected output includes `workspace-ready` and exit zero. The returned object is an execution observation. `printf` runs remotely. `timeout=10` is passed to the process operation; the cleanup request is a separate API operation. `wait=True` asks deletion to wait for the documented terminal deletion state, rather than only accepting the request. [Process reference](https://www.daytona.io/docs/en/python-sdk/sync/process/), [Daytona lifecycle methods](https://www.daytona.io/docs/en/python-sdk/sync/daytona/).

The example deliberately avoids package installation and repository cloning. If it fails, examine the local interpreter, authentication, account limits, and provisioning response. You have a small enough experiment to diagnose without wondering whether a generated application contains a bug.

Do not replace the cleanup block with an assumption that closing the terminal destroys remote resources. A disconnected controller and a running sandbox are different states. In a real application, keep an external record of the sandbox identifier as soon as creation returns so a recovery process can find it after a controller crash.

## Shell commands and language execution are different tools

The process API provides shell execution and direct language execution. The current Python reference calls these `exec` and `code_run`. Shell execution is appropriate for repository tools such as a test runner. Language execution is convenient for a small program in the configured runtime. [Process reference](https://www.daytona.io/docs/en/python-sdk/sync/process/).

The difference matters because shell strings require shell quoting. Consider a filename containing spaces or a user input containing punctuation. Concatenating it into a command can change the command's meaning. A model-generated string deserves the same scrutiny as a string assembled from a web form. Prefer fixed commands and validated parameters for ordinary application operations.

For a self-contained computation, direct code execution avoids an extra layer of quoting:

```python
from daytona import Daytona

program = """
import json
prices = [1200, 800, 500]
print(json.dumps({"items": len(prices), "total_cents": sum(prices)}))
"""

daytona = Daytona()
sandbox = daytona.create()
try:
    response = sandbox.process.code_run(program, timeout=10)
    if response.exit_code != 0:
        raise RuntimeError(response.result)
    print(response.result)
finally:
    daytona.delete(sandbox, wait=True)
```

The output should contain three items and 2,500 total cents. Integer cents avoid introducing floating-point rounding into an infrastructure example. The local variable `program` contains source text; it is not executed until the remote method is called. The result still needs application validation. A program could print malformed JSON or omit required fields even while returning exit zero.

An agent's choice between these tools should reflect its task. “Run the repository's tests” is a shell workflow. “Compute a small aggregate from approved data” can be a code-execution workflow. Exposing both without explaining their consequences often makes the agent choose the broadest available option for every problem.

## A repeatable environment for a repository task

Now expand the example into a small maintenance scenario. Your synthetic repository contains a pure Python function that converts task records to CSV. The bug is that commas and quotation marks are not escaped correctly. You want an agent to repair this behavior and provide evidence.

Before the agent runs, specify the environment contract:

| Component | Decision for the learning project |
| --- | --- |
| Runtime | One recorded Python version |
| Source | A fixed commit in a disposable repository |
| Dependencies | Standard library only for the initial exercise |
| Working directory | One explicit project directory |
| Network | Only what setup and repository access require |
| Agent output | A patch, checks, and a concise explanation |
| Retention | Preserve approved artifacts before deletion |

Install dependencies as a repeatable build or setup step rather than as an unexplained sequence buried in a conversation. If a task always needs the same toolchain, moving setup into a reusable environment reduces repeated work. Keep runtime secrets out of reusable state; a template that already contains somebody's credential is a credential-distribution mechanism.

Daytona documents reusable snapshots and custom environment creation. Use those mechanisms once your setup is stable, and keep a human-readable environment recipe alongside the snapshot identifier. An identifier alone explains where an environment is, not how to reconstruct it if the provider, region, or image changes. [Snapshot documentation](https://www.daytona.io/docs/en/snapshots/).

The useful progression is: get a single run working; record every required setup action; recreate a clean environment; confirm the same checks pass; only then optimize creation with a snapshot. Optimizing an unexplained environment preserves mysteries more efficiently.

## A small repository fixture worth running

Use this complete program as the desired behavior for a CSV writer. Save it as `test_export.py` in the learning repository:

```python
import csv
import io
import unittest


def export_tasks(tasks):
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=["id", "title"])
    writer.writeheader()
    writer.writerows(tasks)
    return output.getvalue()


class ExportTests(unittest.TestCase):
    def test_round_trip_preserves_punctuation(self):
        tasks = [
            {"id": "T-1", "title": 'Review "urgent", customer issue'},
            {"id": "T-2", "title": "Write documentation"},
        ]
        exported = export_tasks(tasks)
        recovered = list(csv.DictReader(io.StringIO(exported)))
        self.assertEqual(recovered, tasks)

    def test_empty_input_still_has_header(self):
        self.assertEqual(export_tasks([]).splitlines(), ["id,title"])


if __name__ == "__main__":
    unittest.main()
```

Run `python test_export.py` in the workspace. The expected result is two passing tests. `StringIO` stores text in memory; `DictWriter` handles CSV quoting; the round-trip test verifies that reading the export recovers the original data. The test does not merely check the implementation's exact output formatting, so it tolerates valid CSV line-ending differences.

To make it an agent task, separate the implementation into `exporter.py` and tests into a different file, then deliberately replace the writer with a naive comma join. Record the failing test before asking the agent to repair it. This gives the task an observable before-and-after story. Avoid asking the agent to invent its own acceptance criteria after it has already changed the code.

## Sessions, terminals, and background processes

A one-shot command is easy to reason about: start it, wait for completion, capture output. A development server keeps running. An interactive installer expects input. A session can preserve useful execution context between commands. The current process reference includes named sessions and PTY operations; study those methods for your installed SDK rather than assuming one-shot commands retain shell state. [Process reference](https://www.daytona.io/docs/en/python-sdk/sync/process/).

The most common conceptual mistake is to run `cd project` in one independent command and assume the next command starts there. Set the working directory explicitly or use a session whose context behavior you have verified. Similar caution applies to shell environment changes. `export NAME=value` can affect one shell and vanish when that shell exits.

A background process has at least three pieces of state: its process identity, output streams, and readiness. Starting a server does not prove the server is ready to accept requests. A practical controller starts the server, polls a health endpoint with a bounded deadline, records the actual port, and then exposes the preview. If readiness fails, it retrieves logs and stops the process.

Redirecting background output prevents a detached process from holding a command's output stream open indefinitely. Do not hide output permanently, though. Keep a bounded log file or streaming channel that a reviewer can inspect. The goal is controlled observability, not a silent server whose failure appears as a broken preview link.

When building a terminal UI, separate display state from process state. Resizing a browser window can change terminal dimensions; closing the browser does not necessarily stop the remote process. Your application must decide whether reconnecting attaches to an existing session or creates a new one. Test this behavior explicitly before promising resumable agent sessions.

## Lifecycle policies are part of the product

A learning project may delete every sandbox immediately. A useful developer product often needs a review interval: the agent finishes, the user inspects the patch and preview, and only then is the environment removed. Express those states in the application:

```text
queued -> provisioning -> preparing -> working -> checking -> awaiting_review
                                      |             |
                                      +-> failed <--+
awaiting_review -> artifacts_saved -> cleanup_requested -> cleanup_confirmed
```

This is an application state model, not Daytona's API state enum. Keeping it separate prevents infrastructure status from becoming a misleading user promise. A running sandbox can contain a failed task. A deleted sandbox can belong to a successfully completed task whose patch is safely retained.

Daytona's documented lifecycle settings distinguish automatic stopping, archiving, and deletion. The units and meanings belong to the current API; inspect them before passing a numeric value. In particular, do not assume that zero always means “disabled” across different lifecycle settings. [Lifecycle reference](https://www.daytona.io/docs/en/python-sdk/sync/daytona/).

Store a cleanup deadline outside the sandbox and reconcile it periodically in the running application. The ordinary cleanup path handles successful requests; reconciliation handles crashes and abandoned browser sessions. Retain enough metadata to find the resource without retaining unnecessary user content.

For valuable work, preserve a patch or commit before deleting the environment. “The agent says it pushed” is not enough: independently verify that the expected artifact exists and identifies the right source revision. Source control, object storage, and a sandbox each solve a different durability problem.

## Observability that helps a human review

For each task, record the source commit, environment recipe or snapshot identifier, SDK version, commands requested, exit results, check summaries, and artifact identifiers. Avoid logging credentials, complete environment dumps, or raw customer data. Useful evidence is selective.

Separate the agent's narrative from execution observations. The agent may say “all tests pass,” while the test runner reports a failed exit code. Present that discrepancy clearly. A reviewer should be able to navigate from the claim to the exact command output without reconstructing the chat.

Measure provisioning, setup, agent work, checking, and waiting-for-review separately. An environment that appears expensive may actually be idle while waiting for a person. A fast startup may not matter if dependency installation takes most of the run. These measurements make optimization concrete.

If multiple agents work in parallel, give each an isolated working tree and a clear ownership boundary. Separate sandboxes avoid filesystem collisions but do not eliminate semantic conflicts. Two agents can independently modify the same public interface in incompatible ways. Integration still requires a coherent plan and a final verification step.

## Troubleshooting with specific hypotheses

| Observation | Hypothesis | Smallest useful experiment |
| --- | --- | --- |
| Import works in editor, fails in terminal | Different local Python | Print the interpreter path, not environment secrets |
| Remote `python` differs from expected | Base environment drift | Run a version command before repository setup |
| Quoted dependency expression fails | Shell interpretation | Use fixed quoted arguments and inspect the actual shell |
| Command appears to never finish | Background process holds output | Redirect output or use a documented session workflow |
| Tests cannot find files | Wrong working directory | Set `cwd` explicitly and list only the project directory |
| Delete returns but resource persists | Request accepted asynchronously | Use the documented wait behavior and inspect state |
| New instance misses a dependency | Undocumented manual setup | Rebuild from the written recipe and compare |

When a command fails, preserve its exit code and relevant output before requesting a repair. A model cannot diagnose an error accurately if the controller replaces the real failure with “something went wrong.” Conversely, giving the model thousands of irrelevant log lines can obscure the first useful error. Extract the relevant section and make the full bounded log available for inspection.

For API changes, stop and identify the SDK line. The current docs' alpha link is an explicit signal that examples from different tracks may differ. Record the installed package version with `python -m pip show daytona` and use the matching reference. Do not rename methods by guesswork until a script stops failing.

## Tradeoffs and evaluation questions

Compare Daytona with [E2B](/sandboxes/e2b/) for a focused code-execution integration, [GitHub Codespaces](/sandboxes/github-codespaces/) for a human-centered repository workspace, and [Coder](/sandboxes/coder/) for self-hosted platform control. Compare [Freestyle](/sandboxes/freestyle/) when long-lived VM state is central. These are workload-oriented comparisons, not universal rankings.

Use one maintenance task across candidates and record time to a reviewable patch, setup complexity, recovery after disconnect, policy behavior, artifact quality, and cost. Require the same acceptance tests. Otherwise a tool that performs less verification can look faster simply because it does less work.

A managed sandbox removes some infrastructure work but introduces a provider dependency, account limits, and an API integration to maintain. A self-hosted workspace gives more control but requires operating the platform. The relevant decision is which operational work your team wants to own and can perform reliably.

## Optional application and acceptance criteria

Build a Daytona-backed maintenance runner for the CSV-export fixture. It should create a workspace, obtain a fixed repository revision, run the failing check, request an agent repair, rerun checks, and retain a patch plus evidence. Begin with manual agent interaction in the workspace if a fully automated harness would distract from the infrastructure lesson.

Accept the project when the same environment recipe can create a fresh working instance; the pre-fix test failure is retained; punctuation survives the repaired CSV round trip; the patch references the correct base commit; a disconnected browser can inspect the task's retained status; and cleanup outcome is visible. Add a deliberate timeout and a deliberate invalid repository revision to ensure failures remain understandable.

The advanced extension is a review queue. Keep finished workspaces only for a bounded interval, export useful artifacts before expiration, and show the user what survives cleanup. This is where environment management becomes a product workflow rather than a collection of SDK calls.

## A review handoff that survives environment cleanup

The CSV repair is only useful if another developer can assess it. Assemble a review bundle while the workspace still exists. Include the base commit, the patch, the exact check command, the relevant output, the environment recipe identifier, and a short statement of any checks that were skipped. A preview link can be helpful, but it should supplement durable evidence because a preview may disappear when the sandbox stops.

Imagine two reviewers opening the same task at different times. The first sees the live environment and confirms that downloading CSV preserves punctuation. The second arrives after cleanup. If the second reviewer can still inspect the patch and reproduce the test from the recorded revision, the handoff is durable. If the only evidence is an expired terminal URL, the product has stored activity rather than a useful deliverable.

A good handoff explains the change in terms of behavior: titles containing commas and quotes now round-trip through CSV without corruption. It then names the mechanism, such as replacing manual joining with a CSV writer, only to help the reviewer assess the solution. Finally, it identifies the scope of evidence: unit checks passed in the disposable environment; production integration was not exercised. This order helps a human understand both the result and its limits.

Practice creating the handoff manually before automating it. Read the patch, run the meaningful check, and try reproducing the result in a newly created sandbox. If you discover that the successful run depended on a package installed by hand or an untracked file, update the environment recipe and rerun. The clean recreation is the experiment that turns a convenient workspace into a repeatable workflow.

For a multi-agent extension, create one task to repair CSV quoting and another to improve the export documentation. Give each a different branch and explicit file ownership. Review both outputs, integrate them into a third clean workspace, and rerun the checks. Separate sandboxes prevent accidental simultaneous file edits; the integration workspace establishes that the combined result still works. Avoid allowing each agent to redefine shared acceptance criteria independently.

Add a small failure ledger to the task record. For each failed attempt, store the phase, a concise cause, the evidence pointer, and the next corrective action. For example: “preparing: source revision unavailable; verify commit visibility” differs from “checking: round-trip test fails; inspect quoting logic.” This prevents an automated repair loop from repeatedly trying code changes when the actual problem is repository access.

Stop the loop after a bounded number of attempts and present the current evidence. A task that makes no progress can consume compute while producing increasingly elaborate explanations. Define progress as a changed observation: a previously failing environment check passes, a test failure narrows, or a valid artifact appears. More chat text alone is not progress.

The final acceptance check is operational: after the bundle is retained and the environment is deleted, can somebody locate the correct source revision, recreate the environment, apply the patch, and repeat the check? If yes, the workspace has served its purpose. It supplied a controlled place to work and left behind enough evidence for the next person.

## A prompt for Claude or Codex

```text
Create a Daytona workspace runner for a disposable Python CSV-export repo.
Read the current stable Python SDK and process/lifecycle references first;
identify the installed SDK line and do not mix alpha examples into it.
Provision one sandbox for one task, use explicit working directories,
record the source commit and environment recipe, run the failing fixture,
repair CSV quoting, and rerun the meaningful round-trip tests.
Keep provider keys in controller configuration. Preserve a patch and logs
before cleanup. Distinguish task state from sandbox state and handle a
lost response without assuming the remote operation did not occur.
Deliver the implementation, setup instructions, and a verification record.
Do not claim a remote run unless it actually happened with an authorized key.
```

Keep a separate record of human review. Passing a command is an execution observation; accepting a product behavior is a review decision. Recording both prevents a future dashboard from confusing automated activity with a developer's approval of the final change.

## Sources and verification boundaries

- [Daytona Python SDK](https://www.daytona.io/docs/en/python-sdk/) — installation, environment configuration, and documented version track; accessed November 13, 2026.
- [Process API](https://www.daytona.io/docs/en/python-sdk/sync/process/) — `exec`, `code_run`, results, sessions, and process behavior; accessed November 13, 2026.
- [Daytona API lifecycle methods](https://www.daytona.io/docs/en/python-sdk/sync/daytona/) — deletion and lifecycle parameters; accessed November 13, 2026.
- [Snapshots](https://www.daytona.io/docs/en/snapshots/) — reusable environment preparation; accessed November 13, 2026.

SDK snippets are documentation-based and account-backed execution remains unrun. The CSV fixture, state model, review workflow, and acceptance criteria are original learning material. Verify package versions, lifecycle units, permissions, and account availability before adapting the examples to a real repository.
