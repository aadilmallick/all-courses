---
title: Modal Sandboxes
description: Run agent-generated programs as bounded remote processes and distinguish sandboxes from ordinary cloud functions.
sidebar:
  order: 3
---

## The learning outcome

Modal is worth studying when your AI application needs programmable compute as well as an execution environment for agent-written code. The central lesson is choosing the right unit of work: an ordinary application function, a remote process, or a stateful workspace. You will create a sandbox, execute a known program, interpret its streams, and design a bounded evaluation worker. Plan four to six hours for the complete chapter and optional project.

Research date: **November 13, 2026**. Modal's current documentation describes Sandboxes for isolated code execution and documents both gVisor and VM runtime choices. Python is used here; the broader documentation also labels some newer language SDK and advanced networking features as beta. Use the maturity label attached to the exact feature you intend to adopt. [Sandboxes](https://modal.com/docs/guide/sandboxes).

The remote walkthrough needs a Modal account, authentication, a supported Python installation, Internet access, and quota. No paid service or remote execution was started during curriculum creation. The examples teach integration mechanics; they are not measured performance claims.

## Why a sandbox is different from a remote function

Suppose you wrote a trusted function that resizes an image. You know the implementation, choose its dependencies, and expose a narrow input/output contract. A remote-function platform can run that trusted implementation for many inputs. Now suppose a model writes a new Python program in response to a user request. The implementation itself is variable. It may run subprocesses, create files, or install dependencies. You need a process environment, not merely an ordinary call to a fixed function.

This is the distinction to keep in mind while learning Modal. A function is a natural abstraction for code you control and want to invoke repeatedly. A sandbox is a natural abstraction when the job needs an environment in which commands and generated programs can run. The two can be combined: a trusted controller can provision and supervise an untrusted execution environment.

The useful mental model is a supervised worker room. The room has a selected image, resource limits, networking policy, and a lifetime. The supervisor sends commands and collects observations. The model can propose work for the room, but it should not automatically gain the supervisor's credentials or permission to change the room's policy.

The analogy has a limit. Cloud processes fail in ways that a physical room does not: a client can lose a response while the remote job continues, a stream can be truncated, or a retry can start a second job. Your application needs explicit task identity and recovery behavior even when provisioning is only a few lines of code.

## Prerequisites: images, processes, and streams

An **image** describes a filesystem and toolchain used to start an environment. A running environment adds mutable files and processes. Installing a dependency during a job changes that instance; changing an image recipe changes how future instances are created. If you cannot tell those apart, you will eventually reproduce a job with the wrong dependencies.

A **process** executes a command. It has standard input, standard output, standard error, and a completion status. Output can arrive incrementally. Reading the entire output waits for the stream to finish, which is convenient for a small computation and unsuitable for an intentionally endless development server.

An **application namespace** organizes resources. In the current Python sandbox examples, an `App` is supplied when creating a sandbox from outside Modal. That is a product requirement, not a request to wrap every teaching script in a web application. [Sandbox creation](https://modal.com/docs/guide/sandboxes).

You also need to understand the controller/executor split. The Python script on your laptop creates the remote sandbox. The program passed to `exec` runs inside it. A local import of a data-science library does not install that library remotely. A path on a Windows machine is not a path in the Linux environment. Treat each boundary as an explicit transfer.

## Install and authenticate with the smallest experiment

Create an isolated local project. On PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install modal
.\.venv\Scripts\modal.exe setup
```

On macOS or Linux, activate the virtual environment or invoke its binaries directly. The documented setup opens a browser authentication flow. Inspect current instructions if your organization uses managed identity. Do not paste a real token into a checked-in script. [Getting started](https://modal.com/docs/guide/getting-started).

Save this as `first_sandbox.py`:

```python
import modal

app = modal.App.lookup("ai-tools-learning", create_if_missing=True)
sandbox = modal.Sandbox.create(app=app)
try:
    process = sandbox.exec(
        "python", "-c", "print(sum([4, 8, 12]))", timeout=10
    )
    print(process.stdout.read())
finally:
    sandbox.terminate()
```

Run it as an ordinary Python script. The expected printed calculation is `24`. The current sandbox guide explicitly distinguishes this direct-script pattern from a `modal run` application entrypoint. `lookup` obtains the named app, `create` obtains an execution environment, and `exec` starts a process inside it. The command is an argument list, so the Python source after `-c` is one argument rather than a shell command assembled by concatenation. [Sandbox guide](https://modal.com/docs/guide/sandboxes).

This example establishes authentication, provisioning, execution, output retrieval, and cleanup. It does not establish that a generated program is correct, that your account supports a particular resource size, or that a network policy has been applied. Add one concern at a time so failures remain diagnosable.

## A complete program with a verifiable answer

Our recurring application is an evaluator for small generated Python solutions. Begin with a trusted reference computation: calculate a weighted score for three categories. We use integers for scores and weights so the expected result can be verified manually.

```python
import json

records = [
    {"category": "correctness", "score": 8, "weight": 5},
    {"category": "clarity", "score": 6, "weight": 3},
    {"category": "coverage", "score": 9, "weight": 2},
]

weighted_total = sum(item["score"] * item["weight"] for item in records)
weight_total = sum(item["weight"] for item in records)
if weight_total <= 0:
    raise ValueError("Total weight must be positive")

result = {
    "weighted_total": weighted_total,
    "weight_total": weight_total,
    "weighted_mean": weighted_total / weight_total,
}
print(json.dumps(result, sort_keys=True))
```

Expected values are weighted total seventy-six, weight total ten, and weighted mean 7.6. Save the program as `score.py` locally. Then use a controller that reads its text and invokes remote Python with that source:

```python
from pathlib import Path
import modal

source = Path("score.py").read_text(encoding="utf-8")
app = modal.App.lookup("ai-tools-learning", create_if_missing=True)
sandbox = modal.Sandbox.create(app=app, block_network=True)
try:
    process = sandbox.exec("python", "-c", source, timeout=10)
    print("STDOUT:")
    print(process.stdout.read())
    print("STDERR:")
    print(process.stderr.read())
finally:
    sandbox.terminate()
```

The program uses no network, so the example applies the documented full outbound block. That is a policy decision made by the trusted controller. It is not a restriction the generated program should be allowed to remove. [Networking and security](https://modal.com/docs/guide/sandbox-networking).

The controller reads one known file rather than uploading the entire project. This keeps the example understandable and minimizes unintended data transfer. For large programs, use the platform's current documented file-access mechanisms instead of stretching `python -c` into an arbitrary-size transport protocol.

## Explain the important mechanics

`Path.read_text` runs locally and returns a string. `sandbox.exec` passes that string as the source argument to a remote Python interpreter. There is no implicit shared filesystem. The controller's current directory matters only when locating `score.py`; the remote process's working directory is a separate setting.

Reading stdout retrieves the program's normal output. Reading stderr retrieves diagnostics. A blank stderr stream does not prove correctness. A program can calculate the wrong answer without raising an exception. Validate the result against a known schema and a known fixture before turning it into a natural-language answer.

The `finally` block attempts termination whether the computation succeeds or raises. It cannot run if the controller process is abruptly killed or the host disappears. Production cleanup therefore needs a second path: a resource lease or reconciliation job that finds abandoned environments. That is an application reliability concern, not a reason to omit the ordinary cleanup path.

For large or simultaneous output streams, avoid designing the application around “read all stdout, then read all stderr” without understanding buffering. Stream or drain both channels using the documented process interfaces. A subprocess can block if one channel fills while the controller only reads the other. The small examples intentionally print little data so the teaching focus remains on environment boundaries. [Command execution guide](https://modal.com/docs/guide/sandbox-spawn).

## Turn the reference program into an evaluator

A model proposes a function `weighted_mean(records)`. Your evaluator should test that function against independent expectations. The model's answer and the evaluator must not share the same unchecked reasoning. If the model writes both an incorrect function and a test that repeats the same mistake, the test can pass while the behavior is wrong.

Start with this complete local fixture for the trusted logic:

```python
import unittest


def weighted_mean(records):
    total_weight = sum(weight for _, weight in records)
    if total_weight <= 0:
        raise ValueError("Total weight must be positive")
    if any(weight < 0 for _, weight in records):
        raise ValueError("Weights must be nonnegative")
    return sum(score * weight for score, weight in records) / total_weight


class WeightedMeanTests(unittest.TestCase):
    def test_known_result(self):
        self.assertAlmostEqual(weighted_mean([(8, 5), (6, 3), (9, 2)]), 7.6)

    def test_zero_weight_is_ignored(self):
        self.assertEqual(weighted_mean([(4, 2), (1000, 0)]), 4)

    def test_no_positive_total_is_rejected(self):
        with self.assertRaises(ValueError):
            weighted_mean([(5, 0)])

    def test_negative_weight_is_rejected(self):
        with self.assertRaises(ValueError):
            weighted_mean([(5, -1), (8, 3)])


if __name__ == "__main__":
    unittest.main()
```

These checks test different properties. The known result checks arithmetic; the zero-weight case checks irrelevance of an excluded observation; the final cases check the specified domain. The implementation is included so the fixture is runnable before introducing generated code. In an evaluator, keep trusted tests outside the candidate's editable files and inject the candidate through a controlled module boundary.

A sandbox isolates execution from the controller, but it does not automatically protect the evaluator from a candidate that can edit the test files. Establish which files are writable and how results are collected. For serious evaluations, distinguish “candidate produced a report claiming success” from “trusted harness observed success.” The latter is the evidence you need.

## Images and dependencies: make setup a reproducible input

The first examples use the default environment. Real jobs may require a specific interpreter or package. Put stable dependencies into an explicit image recipe and record the recipe or image identity with each run. Treat runtime package installation as an intentional operation with failure handling and a bounded deadline.

There are three sources of drift: the base image changes, a dependency resolver selects a different version, or a setup script downloads changing content. Recording only `pip install package` is weak reproducibility. Record versions and keep lockfiles when your language ecosystem supports them. For a disposable learning project, the simplest improvement is to capture the successful package version and interpreter version after the first run.

Do not place private credentials in an image recipe, a dependency URL, or a reusable snapshot. An environment can be reproducible without containing secrets. Inject a task-scoped capability only when the specific job needs it and remove or expire it afterward. A generated arithmetic function has no reason to receive your model-provider key.

Cache optimization comes after correctness. If setup is slow, measure which layer changes often. Stable dependencies belong in reusable image layers; task source belongs in a later transfer; per-user data belongs in a task-scoped location. Rebuilding everything for every small input wastes time, while sharing mutable user state across jobs creates correctness and access problems.

## Networking is a capability, not an implementation detail

The reference computation needs no outbound network. A repository-maintenance task may need a package registry during setup and no network during evaluation. A browser agent may require a tightly scoped set of destinations. Make these separate phases or explicit policies rather than allowing every job unrestricted access by default.

Modal's current guide documents full blocking, IP-range allowlists, and a beta domain-allowlist feature. It also describes interactions among these controls. Do not assume that a domain rule is equivalent to complete protocol-independent network isolation; read the documented behavior, including DNS and TLS constraints. [Networking and security](https://modal.com/docs/guide/sandbox-networking).

Test both sides of the rule. A useful network-policy check demonstrates that a required destination succeeds and an unrelated destination fails. Testing only the successful path cannot reveal an overly broad policy. Likewise, a failure to reach one host might be an outage rather than proof that the policy is correct.

If the task must access an authenticated API, prefer a narrow application-owned operation over distributing a broad credential into the sandbox. For example, the controller can fetch an approved dataset and pass the bytes into the job. This reduces the number of systems the generated code can affect and makes the input easier to reproduce.

## Runtime selection and advanced compute

The current documentation offers different sandbox runtimes. Select based on actual workload requirements and the documented isolation properties rather than on a vague assumption that “more complete” always means “better.” A program using only ordinary Python files and subprocesses has different needs from a workload requiring a full kernel environment. [Runtime choices](https://modal.com/docs/guide/sandboxes).

Write a compatibility fixture before committing to a runtime: interpreter version, filesystem writes, subprocess creation, required system tools, and any kernel-dependent behavior. Then run the same fixture after an image or runtime change. This is more informative than finding a missing capability halfway through a long agent task.

GPU access and specialized compute belong in a later stage of the curriculum. First prove a CPU-only task works and measure where time goes. A GPU does not accelerate repository cloning, ordinary shell setup, or a slow human review. If model inference is the bottleneck, compare inference architecture separately from sandbox orchestration.

Do not copy resource settings from a tutorial into production without measuring the workload. More parallel workers can increase memory pressure and make jobs slower or less reliable. Track peak memory, useful throughput, retries, and successful completion rate. Optimize the whole task, not just the fastest isolated process.

## Streaming, cancellation, and long-running jobs

A user-facing agent benefits from progress updates. Stream meaningful milestones such as environment ready, dependencies installed, tests started, and results validated. Raw terminal output can be available as a secondary view, but it should not be the only explanation of what the system is doing.

Cancellation needs a state transition. Record that cancellation was requested, stop accepting new work, request process or sandbox termination according to the documented interface, and confirm the observed outcome. A closed browser tab is not a reliable cancellation protocol. Nor is a canceled HTTP request proof that the remote process stopped.

For long-running evaluation batches, give each candidate an application run ID and keep results outside the environment. If a controller restarts, it should reconcile known runs rather than starting the entire batch again. An immutable result record with source hash, input hash, environment identity, and observed status makes this possible.

Use a bounded queue. If every incoming request immediately creates an environment, a burst can exceed quota or spend a budget before useful work is reviewed. Queueing also gives the interface honest states: waiting for capacity differs from executing slowly. Keep maximum concurrency and per-job deadlines as explicit configuration.

## Diagnose failures by their earliest boundary

| Failure | First investigation | Avoid this false fix |
| --- | --- | --- |
| Authentication setup fails | Account, token, organization context | Rewriting the candidate program |
| App lookup fails | Namespace and permissions | Creating random new names repeatedly |
| Python package missing remotely | Image or remote setup | Installing it only in the controller |
| Job times out | Execution phase and resource use | Increasing every timeout without measurement |
| Output stream stalls | Process lifetime and stream draining | Assuming provisioning is slow |
| Test report claims success but checks disagree | Harness trust boundary | Asking the model for a more confident explanation |
| Cleanup uncertain | Actual resource state and task lease | Assuming a failed request means no resource exists |

For a useful failure report, retain the failing command, relevant output, SDK version, environment identity, and task phase. Do not dump all environment variables. A concise evidence record helps both a human and an assistant reason about the problem without exposing credentials.

When a job is nondeterministic, repeat only the smallest meaningful experiment. If a calculation fails because an input field is missing, running it ten times adds little information. If a network operation is intermittent, record timing and response classification across a bounded set of attempts. Different uncertainty requires different evidence.

## Compare tools with a shared workload

Compare [E2B](/sandboxes/e2b/) for a focused code-interpreter integration, [Daytona](/sandboxes/daytona/) for broader workspace management, and [Freestyle](/sandboxes/freestyle/) for durable VM-oriented sessions. Modal is particularly worth evaluating when the surrounding application already needs programmable cloud compute. That is a fit hypothesis to test, not a performance ranking.

Run one candidate solution, one invalid solution, one timeout, and one large-output case on each candidate platform. Compare integration effort, policy control, evidence quality, cleanup behavior, and cost per validated result. Include idle resources and failed attempts when estimating cost. Do not compare only the advertised environment-start time.

## Optional application: a trustworthy solution evaluator

Build a controller that accepts one candidate implementation for `weighted_mean`, runs trusted checks in a fresh Modal sandbox, and emits a structured result. Begin with source files supplied by the developer; add a model interface only after the evaluator works independently.

Acceptance requires that the correct implementation passes; an unweighted average fails; negative weights are rejected; a deliberately endless candidate reaches the configured bound; oversized output is capped; the network policy is tested in both directions; results identify exact source and environment; and termination is requested with an externally recoverable resource record.

Add a recovery experiment. Fail the controller after the result is retained but before the user-facing task becomes complete. On restart, it should validate and publish the retained result rather than rerunning the candidate blindly. Then fail after environment creation but before execution. The cleanup path should still find the resource. These two windows often expose more useful problems than adding another happy-path arithmetic test.

The final deliverable should contain a short explanation of what was observed and what remains untested. An evaluator that reports its own uncertainty accurately is more useful than one that turns every infrastructure problem into a candidate score of zero.

## Work through a capacity and budget example

Assume a learning batch contains forty candidates. Your controller permits four environments at a time, and each candidate has an application deadline of thirty seconds. These are invented planning values, not Modal limits or prices. If every attempt consumes the full deadline and no setup overlaps, there are ten waves and roughly five minutes of execution time. Provisioning, transfer, teardown, and queueing add to that estimate.

Now suppose one candidate prints several megabytes per second. A time limit alone does not control the amount of output you must transport, store, and show. Add a byte limit and define what happens when it is reached: stop collecting beyond the cap, record truncation, and terminate according to your policy. A truncated log should be marked as truncated; otherwise a reviewer may assume the final lines were never produced.

Next suppose a transient provisioning failure affects three candidates. Retrying all forty is unnecessary. Retain per-candidate state and retry only the affected attempts within a bounded retry budget. Keep the original failure record and the new attempt ID. This lets a reviewer distinguish a candidate logic failure from an infrastructure retry and prevents hidden repetition from inflating apparent throughput.

Calculate useful throughput as validated results divided by elapsed time, rather than processes launched per second. If launching more environments causes more failures or overwhelms result validation, the higher launch rate can reduce useful throughput. Measure the entire pipeline and raise concurrency gradually.

Before connecting billing, estimate resource consumption in the provider's current units. Keep the arithmetic separate from current prices. For example, record forty attempts, measured environment durations, chosen resource shape, retained storage, and transfer volume. Then apply the live price schedule. This makes the estimate auditable when prices or account terms change.

The result schema should also distinguish failure classes. Here is an original application record:

```json
{
  "candidate_id": "weighted-mean-012",
  "attempt": 1,
  "phase": "evaluation",
  "status": "candidate_failed",
  "checks_passed": 3,
  "checks_total": 4,
  "output_truncated": false,
  "cleanup_requested": true
}
```

This record deliberately avoids using a single Boolean for the whole job. A false value cannot explain whether the candidate was wrong, authentication failed, the environment never became ready, or cleanup remained uncertain. Enumerated application states make the interface more useful and make downstream metrics less misleading.

Finally, test a trusted-harness failure. Introduce a syntax error into the test runner rather than into the candidate. The result should be “evaluation infrastructure failed,” not “candidate incorrect.” This small distinction protects the integrity of any score you show to users. A model-quality dashboard built on infrastructure errors will lead you to tune prompts when the actual problem is your evaluator.

## A prompt for Claude or Codex

```text
Build a Modal Sandbox evaluator for candidate weighted_mean functions.
Read the current Python sandbox, process, and networking documentation.
Use a trusted test harness and keep candidate files separate from tests.
Create a fresh environment per attempt, set bounded execution and output,
block outbound network for the arithmetic evaluation, and retain source
hashes, environment identity, stdout/stderr, and validated result metadata.
Keep authentication in controller configuration. Handle controller restart,
user cancellation, and cleanup uncertainty explicitly.
Deliver a small implementation and README. Run local harness logic checks;
report remote checks as unrun unless an authorized Modal run occurred.
```

Preserve the distinction between a timeout and an incorrect answer when comparing models. A candidate that never finishes, a candidate that returns the wrong number, and a candidate that cannot run in the selected environment require different corrective action. Keep those observations separate even if a later scoring policy assigns them the same numeric score.

## Sources and verification

- [Getting started with Modal](https://modal.com/docs/guide/getting-started) — installation and authentication; accessed November 13, 2026.
- [Sandboxes](https://modal.com/docs/guide/sandboxes) — creation, app requirement, direct-script pattern, and runtime choices; accessed November 13, 2026.
- [Running commands](https://modal.com/docs/guide/sandbox-spawn) — process execution and output handling; accessed November 13, 2026.
- [Networking and security](https://modal.com/docs/guide/sandbox-networking) — outbound controls and maturity labels; accessed November 13, 2026.

Account-backed examples remain unrun. The evaluator contract, arithmetic fixtures, recovery design, and acceptance criteria are original instructional material. Pin the successful SDK version and recheck feature maturity, runtime compatibility, and current account limits before using the design for a real service.
