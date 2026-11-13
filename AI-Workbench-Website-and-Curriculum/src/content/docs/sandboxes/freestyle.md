---
title: Freestyle
description: Learn durable Linux VMs for long-running agents, with deliberate state, networking, and recovery.
sidebar:
  order: 4
---

## Why Freestyle belongs in this guide

Some agent tasks finish in seconds. Others need a repository, running processes, browser state, and a human who returns hours later. Freestyle is a useful tool for learning the second case: an environment has an identity and a lifecycle that outlive an individual request. This chapter builds a durable research workspace and explains what must remain outside that workspace. Allow four to six hours for the optional implementation.

The researched baseline is **November 13, 2026**. Freestyle documents persistent Linux VMs, command and file operations, snapshots, and memory-preserving pause/resume. The examples below use the documented JavaScript SDK. Feature limits and plan terms must be checked in the current account. [Freestyle VMs](https://www.freestyle.sh/docs/vms), [lifecycle](https://www.freestyle.sh/docs/vms/lifecycle).

There is also a timely ecosystem change: Runloop's official transition page says its services are winding down and existing-customer transition support ends **November 13, 2026 at 11:59 PM Pacific**. For that reason, Runloop is treated here as a migration case rather than a new-adoption recommendation. [Runloop transition notice](https://docs.runloop.ai/docs/transitions/overview). A migration guide is not a certification that your workload has migrated successfully.

## The problem: work is longer than a web request

Imagine an agent investigating a flaky test. It clones a repository, installs dependencies, runs the test repeatedly, captures logs, and starts a small preview for a developer to inspect. The developer closes the browser and returns after lunch. If the application ties all work to the browser connection, either the job disappears or the system loses track of it.

A durable environment solves only part of this problem. It keeps a place for processes and files to exist. The application still needs a record of the task, its owner, its current phase, and its deliverables. Durable compute without durable coordination can become an expensive machine that nobody knows how to resume.

Use three layers in your mental model. The **task layer** records intent and progress. The **environment layer** holds execution state. The **artifact layer** stores reviewable outputs. A task can survive environment replacement if its inputs and artifacts are retained. An environment can remain running after a task has failed. An artifact can remain useful after the environment is deleted.

For this lesson, the task is a synthetic document audit: read a small set of Markdown files, count their headings and links, and produce a JSON report. It is intentionally simpler than a general autonomous research agent. The simplicity lets you focus on persistence, recovery, and access boundaries before adding model behavior.

## Prerequisites: JavaScript and operating-system state

You need basic JavaScript promises and `async`/`await`. An awaited operation pauses the current function until its promise settles; it does not freeze the remote environment. If the caller disconnects, the remote operation may have already started. Keep that distinction in mind whenever you design retries.

A virtual machine contains a kernel, processes, memory, and disks. **Memory state** includes variables and running process state. **Disk state** includes written files. A pause that preserves memory differs from a shutdown that preserves disk but discards processes. A snapshot can be a reusable capture, while a paused instance retains the identity of the original environment. The provider's documented semantics determine the exact behavior.

Networking is separate again. A VM may exist and execute local commands while being unable to reach an external host. A public domain route is an inbound access path; an outbound firewall rule permits the VM to initiate connections. Opening one does not imply the other should be open.

Finally, understand identity. An application user, a Freestyle account, a VM ID, a human-readable slug, and a scoped client credential are different objects. A memorable slug makes an environment easier to find; it is not proof that the requester is entitled to control it.

## Install the SDK and make the first run disposable

Create a new Node project and install the documented package:

```powershell
npm init -y
npm install freestyle
```

Use a current Node release supported by the SDK. Save examples with the `.mjs` extension so Node treats them as ECMAScript modules. Authenticate using the current Freestyle CLI flow and put the resulting API credential in `FREESTYLE_API_KEY` through your environment or secret manager. The official quickstart documents the login and token-creation flow. [Quickstart](https://www.freestyle.sh/docs/quickstart).

Save this as `first-vm.mjs`:

```javascript
import { Freestyle } from "freestyle";

const freestyle = new Freestyle();
const { vm, vmId } = await freestyle.vms.create({
  firewall: { rules: [] },
});

try {
  const result = await vm.exec("printf 'vm-ready\\n'");
  console.log(result.stdout);
  console.log("status:", result.statusCode);
} finally {
  await freestyle.vms.delete(vmId);
}
```

Run `node first-vm.mjs`. Expected output includes `vm-ready` and a successful status. The example needs no Internet access from inside the VM, so its creation policy contains no allow rules. Your controller still needs network access to the provider. The create result and command-result field names follow the documented VM example; deletion follows the lifecycle reference. [VM API guide](https://www.freestyle.sh/docs/vms), [lifecycle](https://www.freestyle.sh/docs/vms/lifecycle), [firewall semantics](https://www.freestyle.sh/docs/vms/network/firewall).

This first run is deliberately short-lived. Learning persistence should not begin by accidentally leaving an environment running. Once you understand the create/execute/delete cycle, you can change the lifecycle intentionally and retain the VM identifier in an application record.

## Build the document-audit program locally

Here is a complete Node program that uses only standard-library modules. Save it as `audit.mjs`:

```javascript
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const inputDirectory = process.argv[2] ?? "./documents";
const outputFile = process.argv[3] ?? "./audit.json";
const names = (await readdir(inputDirectory))
  .filter((name) => name.endsWith(".md"))
  .sort();

const documents = [];
for (const name of names) {
  const source = await readFile(path.join(inputDirectory, name), "utf8");
  documents.push({
    name,
    headings: source.split(/\r?\n/).filter((line) => /^#{1,6} /.test(line)).length,
    markdownLinks: [...source.matchAll(/\[[^\]]+\]\([^)]+\)/g)].length,
    sha256: createHash("sha256").update(source).digest("hex"),
  });
}

const report = { documentCount: documents.length, documents };
await writeFile(outputFile, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ documentCount: documents.length, outputFile }));
```

Create a `documents` directory with two tiny Markdown files. One might contain a title, one subheading, and one link; the other a title and no links. Running `node audit.mjs` should report two documents, with counts matching the fixture. Inspect `audit.json` directly.

This is a deliberately limited parser. The heading rule counts lines beginning with Markdown heading syntax, including such lines inside code fences. The link expression does not fully implement Markdown nesting or reference links. Those limitations belong in the report. An agent should not upgrade the claim from “simple syntactic audit” to “complete semantic Markdown analysis.”

The program is useful because it creates a deterministic artifact and identifies each input with a checksum. Sorting filenames makes report order stable. Explicit UTF-8 handling prevents platform-default encoding from silently changing the input interpretation. The output file makes the result inspectable after the process ends.

## Transfer files and run in the VM

Once the local fixture works, create a remote environment and write selected files using the documented filesystem interface. Freestyle's VM guide shows `vm.fs.writeTextFile` and `readTextFile`; use those exact methods for small text fixtures. [VM file operations](https://www.freestyle.sh/docs/vms).

The following controller illustrates the complete small-file path. It assumes `audit.mjs` and the local fixture directory exist:

```javascript
import { readFile, readdir } from "node:fs/promises";
import { Freestyle } from "freestyle";

const freestyle = new Freestyle();
const { vm, vmId } = await freestyle.vms.create({ firewall: { rules: [] } });

try {
  await vm.exec("mkdir -p /tmp/audit/documents");
  await vm.fs.writeTextFile(
    "/tmp/audit/audit.mjs",
    await readFile("audit.mjs", "utf8"),
  );
  const names = (await readdir("documents"))
    .filter((name) => /^[a-z0-9-]+\.md$/.test(name));
  for (const name of names) {
    await vm.fs.writeTextFile(
      `/tmp/audit/documents/${name}`,
      await readFile(`documents/${name}`, "utf8"),
    );
  }
  const result = await vm.exec(
    "node /tmp/audit/audit.mjs /tmp/audit/documents /tmp/audit/audit.json",
  );
  console.log(result.stdout);
  console.log(await vm.fs.readTextFile("/tmp/audit/audit.json"));
} finally {
  await freestyle.vms.delete(vmId);
}
```

Check that the selected base environment contains Node before using this controller; the environment's available toolchain is a real prerequisite, not supplied by the `.mjs` extension. Choose and record a documented base snapshot that includes the required runtime, or prepare one through the provider's current instructions. This code intentionally does not invent a universal snapshot ID.

The filename filter is narrow because the example builds remote paths from local names. It is not a general upload validator. A production uploader must handle file sizes, path traversal, binary files, ownership, and storage quotas. For a learning fixture, a small allowlist makes the transfer boundary visible.

## Pause, resume, and the danger of duplicate startup

Freestyle documents `pause()` as preserving memory and `start()` as resuming existing processes. A stopped persistent VM keeps disk but loses memory; deletion is permanent. These differences affect application logic. [VM lifecycle](https://www.freestyle.sh/docs/vms/lifecycle).

Suppose an agent has started a preview server. The application pauses the VM while waiting for review. When the developer returns, the application calls `start()` and then blindly starts the server again. If the original process resumed, the second server may fail to bind the port or create duplicate workers. A generic “run setup on every reconnect” rule is therefore unsafe.

Instead, separate **initialization**, **resume**, and **recovery after reboot**. Initialization creates required directories and starts the intended services. Resume inspects known readiness markers and reconnects. Recovery after reboot starts only processes that are absent. Make initialization idempotent where practical, but do not use that word as a substitute for testing repeated execution.

Use a tiny persistence experiment. Start a process that increments a counter and writes a marker file. Observe its process identity and counter value. Pause, wait briefly, resume, and inspect again. Then perform a documented stop/reboot experiment on a disposable VM and compare the process and disk observations. The purpose is to learn which state survives each operation, not to benchmark startup speed.

Keep external effects out of this experiment. A resumed process that was in the middle of a network request can have ambiguous application-level consequences. Memory preservation does not make an external database write or an email send transactional with the VM snapshot.

## Durable task state belongs outside the VM

For the document audit, store a task record in the controller's durable storage:

```json
{
  "task_id": "docs-audit-004",
  "owner_id": "learning-user",
  "environment_id": "provider-returned-vm-id",
  "phase": "awaiting_review",
  "input_manifest": "artifact-reference-for-input-hashes",
  "result_manifest": "artifact-reference-for-validated-report",
  "cleanup_deadline": "application-selected-deadline"
}
```

The values are illustrative placeholders. The important feature is separation: the authoritative task record is not stored only inside the machine it describes. If the VM is deleted, the application still knows what happened and which artifacts survive.

Use an attempt number when rerunning. A task can have several attempts because of a changed environment, invalid input, or transient failure. Preserve the reason for each attempt. Do not overwrite the previous evidence and then claim the whole history was a single successful run.

After a controller crash, reconcile by task ID and VM ID. Check for a retained result manifest first. If the result is already validated, finish publication without recomputing. If the VM still exists but the result is incomplete, inspect its known marker and process state before taking action. If state is uncertain, explain the uncertainty and create a new attempt rather than guessing.

## Network policy for a real agent workspace

The audit fixture needs no outbound network. A repository agent may need Git access and a package registry. A browser agent may need additional websites. Write the required destinations down before opening access. Freestyle's current firewall model uses explicit allow rules, and the documentation distinguishes VM identity, private networks, public addresses, ports, and protocols. [Firewall](https://www.freestyle.sh/docs/vms/network/firewall).

Do not copy a broad public-Internet rule simply because it appears in a quickstart. It is a convenient demonstration of connectivity, not an architecture decision for every workload. Start with the smallest policy your task needs, then test a required destination and an unrelated destination separately.

DNS resolution deserves its own check. A network policy can allow HTTPS to a destination while the environment cannot resolve the hostname. A failed request might therefore be a DNS failure rather than an application outage. Capture the actual error category before changing rules.

Inbound previews require authentication decisions. A temporary URL can still expose repository contents, debug endpoints, or test credentials. The application should decide who may open it and what remains available after the review interval. A hard-to-guess URL is not a complete access policy.

For multi-user products, scope client access to the specific environment and operation. Keep the account-level provider key on the controller. If the browser needs a terminal or file view, follow the current scoped-session documentation rather than sending the master key to the browser.

## Snapshots and branching as experiments

A reusable snapshot can shorten setup and make parallel experiments more comparable. It can also preserve unwanted state. Before capturing reusable state, inspect files, running processes, environment variables, and any credentials loaded into memory. A memory-inclusive capture deserves particular care because “I deleted the token file” does not establish that the token is absent from process memory.

Use snapshots as inputs to an experiment, not as a replacement for source control. For example, start two agent attempts from the same prepared environment and source revision. Give them different implementation constraints. Compare their patches against the same tests. Preserve the source revision, snapshot identity, model configuration, and observed results so differences can be interpreted.

Branching does not solve integration. Two environments can produce incompatible changes to a shared interface. Merge selected outputs in a clean integration environment and rerun the checks. Otherwise you have demonstrated that two isolated branches work independently, not that the combined product works.

Treat snapshot retention as an explicit lifecycle. Name its purpose, owner, and expiration. A collection of unnamed captures becomes difficult to audit and can retain sensitive data long after the original task ends. Keep a rebuild recipe wherever practical so the capture is an optimization rather than the only surviving explanation of the environment.

## Runloop migration: preserve behavior, not just code syntax

The Runloop transition notice changes the learning priority. Existing users need an inventory and validation plan; new learners should not build a fresh dependency on a winding-down service. The official Freestyle transition guide maps Devboxes to VMs while explicitly warning that IDs, blueprints, snapshots, and Axon data do not transfer automatically. [Transition guide](https://docs.runloop.ai/docs/transitions/runloop-to-freestyle).

Begin with a workload inventory. List command execution, file transfer, persistent shell context, background processes, snapshots, network rules, inbound access, event streams, SQL state, and pending work. For each item, identify the application behavior you rely on. “Uses a snapshot” is too vague; “restores files and restarts the worker from its last durable cursor” is testable.

Next, create a provider-neutral fixture. Run a command that prints Unicode, writes a binary file, exits with a known nonzero code, and leaves a documented marker. Capture bytes and statuses. Reproduce those observations on the target. Add process survival and cancellation tests only after the simple fixture agrees.

Do not assume an event-coordination service is replaced by a persistent VM. Durable delivery, ordering, replay, deduplication, and database transactions are application-level requirements. If the source platform supplied those features, select or build replacements and validate them independently. A VM can run a worker; it does not automatically provide exactly-once business effects.

Before cutover, choose one authoritative writer. Freeze or drain source writes, export consistent application data, restore the target, compare manifests and invariants, and then switch traffic. Rehearse this sequence on disposable data. If rollback would require moving target writes back, test that reverse path before promising it. Otherwise the recovery plan is limited to the last validated backup.

## Troubleshooting durable sessions

| Symptom | Useful hypothesis | First observation |
| --- | --- | --- |
| Local command works, remote command missing | Base snapshot lacks runtime | Inspect the remote runtime version |
| Resume starts duplicate server | Startup confused with resume | Inspect existing process and port before starting |
| Files survive but process disappears | Stop/reboot semantics | Compare lifecycle operation and recorded state |
| Public API unreachable | Firewall or DNS | Test resolution and permitted route separately |
| User cannot reconnect | Ownership or scoped credential expired | Verify application authorization and session scope |
| Report disappears after cleanup | Artifact stored only on VM | Retrieve validated outputs before deletion |
| Controller retries duplicate work | Missing task reconciliation | Inspect prior attempt and result manifest |

Debug one layer at a time. A JavaScript import failure happens before the provider is contacted. A missing remote runtime is not a prompt failure. A blocked network request is not proof that the remote service is down. Good failure reports identify the earliest failing boundary and preserve the evidence needed to investigate it.

## Cost and capacity planning without stale price claims

Use measured resource lifetimes and the current provider schedule. Separate running compute, saved state, disk, snapshots, networking, and any plan-specific limits. This chapter deliberately does not quote a price because the useful lesson is how to model your workload.

For a review workflow, waiting can dominate. An agent may work for five minutes and wait for a developer for five hours. A pause policy can reduce active compute while preserving useful state, but saved state may still count toward account limits or storage charges. Read effective policy and current billing details rather than assuming “paused” means free or unlimited.

Set maximum concurrency and a cleanup deadline during learning. One persistent VM per user may be convenient, but one VM per task may give clearer ownership and easier cleanup. Measure how often users actually return to old state before paying to retain every environment indefinitely.

## Optional application and evidence

Build the document-audit controller with submit, inspect, resume, retrieve, and delete operations. Keep the task record outside the VM. Preserve input hashes, the exact audit program, and the validated report. Present the parser's limitations alongside the result.

Accept the project when the local and remote fixture counts agree; invalid filenames cannot escape the intended directory; the task survives a controller restart; pause/resume does not duplicate a running service; an unauthorized user cannot inspect the VM; required and forbidden network checks behave as intended; and the final report remains available after cleanup.

Add a migration rehearsal only if you already have Runloop workloads. The acceptance criterion is behavioral parity on your own inventory, not a successful package import. Record any unsupported primitive and its chosen replacement. Do not label the migration complete while pending work or authoritative data remains only in the source system.

## A recovery walkthrough with an expired review window

Suppose the audit finishes at 10:00 and the application offers a one-hour review window. At 10:40, a developer opens the task and requests another thirty minutes. Compute the new application deadline explicitly and persist it outside the VM. Do not assume that reconnecting automatically extends every provider retention policy or that all lifecycle fields measure time from the same starting point.

At 11:10, the controller restarts. It reloads the task, sees that review remains authorized, checks the actual VM state, and either resumes the environment or reconstructs a replacement from retained inputs. The final report is already stored independently, so the user can still read it even if environment recovery fails.

At the final deadline, first stop accepting new operations for that lease. Preserve any approved diagnostic outputs, request cleanup, and record confirmation. If cleanup fails because the provider is temporarily unavailable, mark cleanup pending and retry through a bounded reconciliation process. Do not show the environment as deleted until that outcome is observed.

This experiment teaches a useful separation: a user-facing lease, a provider resource lifetime, and an artifact-retention policy are three decisions. They can share a deadline, but they are not automatically synchronized. Keeping them explicit makes long-lived agent sessions understandable to both users and operators.

## A prompt for Claude or Codex

```text
Build a Freestyle-backed durable document-audit workspace in this repo.
Read current Freestyle VM, lifecycle, files, and firewall documentation.
Use a synthetic Markdown fixture and the supplied simple audit contract.
Keep provider credentials in the controller, task state outside the VM,
and validated artifacts in durable application storage.
Distinguish initial setup, memory-preserving resume, and reboot recovery.
Test controller restart, duplicate startup prevention, bounded output,
ownership checks, and cleanup. Record SDK and base snapshot versions.
If adapting Runloop code, inventory every used primitive and validate
behavior rather than mechanically renaming methods.
Deliver code, setup instructions, and an honest local/remote check record.
```

Treat an external database separately from a VM snapshot. If a process writes to that database and then the VM is restored to an earlier point, replaying the process can repeat the write. Use stable application operation IDs and reconciliation for external effects. A perfect restoration of local memory does not rewind the rest of the world.

Record effective lifecycle policy after creation, not only the values your application requested. Account-level constraints can affect what is retained or deleted. The observed policy belongs with the task evidence so a later recovery attempt has an accurate starting point.

## Sources and verification boundaries

- [Freestyle quickstart](https://www.freestyle.sh/docs/quickstart) — installation and authentication; accessed November 13, 2026.
- [Freestyle VMs](https://www.freestyle.sh/docs/vms) — creation, result fields, files, and common operations; accessed November 13, 2026.
- [VM lifecycle](https://www.freestyle.sh/docs/vms/lifecycle) — pause, stop, deletion, and policy distinctions; accessed November 13, 2026.
- [Firewall](https://www.freestyle.sh/docs/vms/network/firewall) — explicit rules and network matchers; accessed November 13, 2026.
- [Runloop transition notice](https://docs.runloop.ai/docs/transitions/overview) — service wind-down and support deadline; accessed November 13, 2026.
- [Runloop to Freestyle](https://docs.runloop.ai/docs/transitions/runloop-to-freestyle) — migration caveats and primitive mapping; accessed November 13, 2026.

The original audit program was executed locally against two synthetic Markdown files: document count, heading counts, and link counts matched expectations. Remote examples remain unrun and require an account plus an appropriate base snapshot. The controller workflow, recovery model, and validation plan are original teaching examples. No migration was performed or certified while preparing this chapter.
