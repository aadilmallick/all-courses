---
title: Cloudflare Sandboxes
description: Learn the current Workers and Durable Objects execution model, including the important Sandbox SDK 1.0 transition.
sidebar:
  order: 6
---

## The current model matters

Cloudflare is a useful sandbox lesson because the trusted application and the untrusted execution environment are visibly different parts of the design. A Worker handles requests and policy; a sandbox runs selected code. You will build a fixed-purpose command runner, understand environment identity, and design a task-scoped agent runner without exposing an unrestricted shell. Allow five to seven hours for the optional application.

Research date: **November 13, 2026**. The current documentation describes two environments: Linux Containers and Dynamic Workers. It also states that `@cloudflare/sandbox` **0.x** documentation is for existing applications and **1.0** uses a different model. The Linux container's Durable Object scheduling policy is documented as **public beta**. This chapter follows the current model rather than older `getSandbox` examples. [Overview](https://developers.cloudflare.com/sandbox/), [SDK reference](https://developers.cloudflare.com/sandbox/reference/).

The cloud workflow requires the relevant Cloudflare account and plan; the overview identifies Workers Paid availability. Local Linux-container development also requires a running Docker installation and a compatible Wrangler version. These are real prerequisites. No Cloudflare account, container, or deployment was created while preparing this chapter. [Linux quickstart](https://developers.cloudflare.com/sandbox/get-started/).

## The problem: your application should not execute arbitrary code in its own process

Suppose your documentation service lets an assistant generate a small program to inspect uploaded text. Running that program inside the web application's own process is dangerous to reliability even when the code is merely buggy. An endless loop can consume execution time; a large allocation can exhaust memory; a filesystem operation can alter application files.

The basic architectural response is separation. The trusted application accepts a task, checks who may perform it, chooses an execution policy, and passes only the required inputs to a separate environment. The generated program returns observations or artifacts. It does not gain authority over the parent application merely because it produced persuasive text.

Cloudflare's Worker is the request-handling and policy layer in this design. A Linux environment is appropriate when the job requires a toolchain, subprocesses, or ordinary system commands. A Dynamic Worker is a different choice for code that fits the supported runtime and capability model. Choosing between them is an architectural decision, not a matter of renaming an SDK class.

The useful analogy is a service counter and a workshop. The counter decides which jobs are accepted and which materials enter the workshop. The workshop performs the work. A customer cannot grant themselves a key to the entire building by writing “administrator approved” in the job description. In the same way, a model prompt should not determine account authorization or network policy.

## Prerequisites in dependency order

You need basic TypeScript, HTTP requests, JSON, and asynchronous functions. A Worker receives a `Request` and returns a `Response`. A Durable Object gives a named coordination identity and can own access to a container. The container is a running Linux environment with its own processes and files.

Know the difference between **binding configuration** and **application input**. A binding connects your Worker to a platform resource. A request body is untrusted data from a caller. The caller should not be able to select any arbitrary binding, account resource, or globally shared environment merely by placing a string in JSON.

Understand a command argument vector. `['node', '-e', source]` represents a program and its arguments. A shell string such as `node -e '...'` introduces shell parsing and quoting. The current container API accepts argument arrays, which helps avoid accidental shell interpretation for fixed commands. It does not make arbitrary generated code safe by itself.

Finally, understand identity scope. A fixed name such as `sandbox` in a quickstart creates a shared identity for that example. In a multi-user application, reusing one name for every user can mix files and processes across tasks. Choose a task-scoped name derived from an application-authorized task record, not directly from untrusted input.

## Start with a fixed-purpose local runner

The official quickstart creates a Worker project with Cloudflare's project generator. Use the current instructions and choose TypeScript without deploying. The documented command at research time is:

```powershell
npm create cloudflare@latest -- sandbox-learning --category=hello-world --type=hello-world --lang=ts --no-deploy --no-git --no-agents
```

Change into the created project. Keep the generated package lockfile so a successful setup can be reproduced. Confirm Docker is running before attempting the Linux-container preview. The current quickstart notes a minimum Wrangler version for its Debian image; use the current supported version rather than assuming an older global installation will work. [Run a Linux command](https://developers.cloudflare.com/sandbox/get-started/).

Use this configuration as a documentation-based learning example in `wrangler.jsonc`:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "sandbox-learning",
  "main": "src/index.ts",
  "compatibility_date": "2026-11-13",
  "observability": { "enabled": true },
  "containers": [
    { "class_name": "LearningContainer", "scheduling_policy": "durable_object" }
  ],
  "durable_objects": {
    "bindings": [
      { "class_name": "LearningContainer", "name": "LEARNING_CONTAINER" }
    ]
  },
  "exports": {
    "LearningContainer": { "type": "durable-object", "storage": "sqlite" }
  }
}
```

This follows the opened current quickstart's configuration shape. Compatibility dates are part of behavior selection, not a promise that every future feature will work with an old package. Keep the chosen date and package version in your project record. The class name and binding name must match the source below.

## A complete fixed computation

Replace `src/index.ts` with:

```typescript
import { DurableObject } from "cloudflare:workers";

export class LearningContainer extends DurableObject<Env> {
  async summarize(): Promise<{ stdout: string; exitCode: number }> {
    const container = this.ctx.container;
    if (!container) throw new Error("Container binding is unavailable");

    if (!container.running) {
      container.start({
        image: "cloudflare/debian-trixie",
        entrypoint: ["sleep", "infinity"],
        enableInternet: false,
      });
    }

    const source = [
      'const states = ["done", "open", "done"];',
      'console.log(JSON.stringify({total: states.length, done: states.filter(s => s === "done").length}));',
    ].join("\n");

    const process = await container.exec(["node", "-e", source]);
    const output = await process.output();
    return {
      stdout: new TextDecoder().decode(output.stdout),
      exitCode: output.exitCode,
    };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/summarize") {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    const sandbox = env.LEARNING_CONTAINER.getByName("learning-fixture");
    return Response.json(await sandbox.summarize());
  },
};
```

Generate binding types using `npx wrangler types`, then start the local preview using `npx wrangler dev`. Submit a POST request to `/summarize` on the printed local address. Expected stdout contains JSON with total three and done two, and exit code zero. The image, container-start, command-execution, and output-decoding pattern follow the current quickstart. [Linux quickstart](https://developers.cloudflare.com/sandbox/get-started/).

This runner accepts no arbitrary command from the request. It demonstrates a complete execution path while keeping the operation narrow. The fixed Durable Object name is suitable only for this synthetic single-fixture lesson. A real multi-user service needs authenticated task ownership and a separate environment identity per intended isolation boundary.

## Explain the path from request to result

The Worker checks the HTTP method and route. It retrieves the named Durable Object binding. The object's `summarize` method obtains its configured container, starts it if necessary, and executes a fixed Node program. The resulting bytes are decoded to text and returned as JSON.

There are two JSON layers. The remote program prints a JSON string into stdout. The Worker then returns an outer JSON object containing that stdout and an exit code. A production application should parse and validate the inner result before presenting a final task summary. Do not treat an arbitrary stdout string as a trusted application object.

`enableInternet: false` is an explicit policy choice because the fixture needs no network. The Worker can still handle incoming requests through the platform; this setting concerns the container's outbound access. Read the current security model before introducing APIs, package registries, or repository cloning. [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/).

The `sleep` entrypoint keeps the environment available for subsequent commands. That makes lifecycle important. A one-shot computation can finish while its container remains running. Your application must decide when the environment is no longer needed, rather than assuming process completion releases every resource.

The TypeScript `Env` type comes from generated bindings. If type generation fails, first check configuration and class names. Do not paper over the error by replacing everything with `any`; the type mismatch may be revealing a real missing binding.

## Linux Containers versus Dynamic Workers

Choose Linux when the task needs ordinary binaries, shell tools, a language runtime, a server process, or a repository toolchain. Choose a Dynamic Worker when the untrusted computation fits its documented languages and runtime capabilities and can operate through explicitly passed methods and data. The current overview describes both options. [Environment overview](https://developers.cloudflare.com/sandbox/).

The decision begins with required capabilities. Does the job need to spawn a compiler? Does it require a filesystem layout? Is it only transforming a small JSON object? Is a long-lived process necessary? A smaller capability surface can make a product easier to reason about, but it must actually support the workload.

Do not force a Linux dependency into a runtime that does not provide it, and do not allocate a full toolchain when a narrow transformation would do. This is similar to choosing between a database query and a whole data-processing cluster: the larger abstraction may be powerful while adding operational work the task does not need.

For a meaningful comparison, implement the same pure transformation in both supported environments and compare the integration, policy, and failure behavior. Keep claims about speed or cost limited to measurements from your own workload and current account terms. A vendor's advertised startup figure is not a complete job benchmark.

## The 0.x to 1.0 transition

Many search results and examples still show a `Sandbox` class from older SDK versions. The current documentation explicitly separates those pages from the new model. In 1.0, helper classes such as `Files` work with a container your Durable Object starts; core command execution is shown through the container API. [SDK reference](https://developers.cloudflare.com/sandbox/reference/), [legacy SDK notice](https://developers.cloudflare.com/sandbox/sdk/).

When maintaining an existing project, identify the installed package version before editing. Do not mix an old class-based example, new configuration, and a third-party tutorial's method names. A script assembled from three individually plausible generations can fail in ways that look like application bugs.

Make a migration inventory: creation identity, command calls, filesystem calls, background processes, previews, terminals, outbound rules, backups, and storage mounts. For each item, write the behavior your application requires. Then use the official migration map to select the replacement and create a small validation fixture.

A migration is complete when the behavior is validated, not when the imports compile. File bytes, exit codes, cancellation, process survival, preview authentication, and retention can change independently. Keep the old and new implementation behind a controlled test path until the evidence supports cutover.

## Files and the current helper library

The current `@cloudflare/sandbox` reference provides helpers for files and storage-related operations. For example, `Files` is constructed with a configured container; the helper does not itself start that container. This matters because a file operation and environment lifecycle are separate responsibilities. [Current SDK reference](https://developers.cloudflare.com/sandbox/reference/).

For your first file workflow, use a known text fixture with a fixed filename and a small size. Write the input, run the program, read the expected output, and compare a checksum. Add binary data and large transfers only after the small path works. Each new data shape introduces different failure modes.

Define the allowed output directory and maximum artifact sizes. Generated code can create many files or an unexpectedly large archive. Do not recursively expose the entire environment as the user-facing result. Retrieve only the outputs needed for the task and validate their type before presenting them.

Keep durable artifacts outside the transient container. A final report, patch, or source archive should remain accessible after cleanup if your product promises that behavior. A local filesystem inside a running environment is execution state; it is not automatically an application backup.

## A task-scoped agent runner

Now expand the fixed computation into an architecture for a repository agent. The Worker authenticates the user, resolves a task record, chooses the permitted environment identity, and starts a job with a known source revision. The agent works inside that environment. The controller retains outputs and offers a bounded review interval.

Use application states such as queued, preparing, working, checking, awaiting review, failed, and cleaned. Do not expose raw container state as the entire task status. A running container can contain a failed task; a stopped container can belong to a successful task whose artifacts are retained.

The model-facing tool should accept a task operation, not an arbitrary account resource name. For example, “run the approved test command for this task” is easier to authorize than “execute any command in any named environment.” If you later allow general code, keep its policy and resource bounds in trusted application code.

Treat tool output as data. A repository file or log may contain instructions aimed at the model. Those instructions do not override the application's access controls or grant permission to read secrets. Keep the control channel separate from untrusted content, and make that distinction explicit in the agent's tool interface.

## Concurrency and shared identity

Two requests can target the same environment. If both edit files or start servers, they can interfere even when each request is individually valid. Decide whether a task permits only one active writer, how a second request is queued, and how cancellation interacts with the current operation.

A useful beginner design is one task, one environment, one active agent writer. Human review is read-only until the agent yields. More collaborative designs are possible, but they require explicit coordination. Do not assume the existence of a Durable Object automatically defines all application-level editing semantics.

Use stable task identity and separate attempt identity. A failed attempt may need a fresh environment, while the user still sees one task. Record which attempt produced the selected artifact. This prevents a late response from an old attempt from overwriting a newer successful result.

If a request times out, inspect task and environment state before retrying. The remote command may still be running. Blind repetition is harmless only for a narrow class of pure computations; it can duplicate commits, messages, or external writes in a broader agent workflow.

## Networking and credentials

The current overview emphasizes that the Worker decides which application data and APIs a sandbox receives. Use that boundary. A job that needs one approved dataset can receive the dataset bytes rather than a credential that grants access to the entire storage account. [Sandbox overview](https://developers.cloudflare.com/sandbox/).

Separate setup connectivity from execution connectivity. Repository cloning and dependency installation may require network access, while the final evaluation can run offline. Where the platform supports the required policy transitions, make them explicit and test them. Otherwise design a prepared environment that avoids network during the sensitive phase.

Never put a broad provider key in a frontend bundle, generated source file, or reusable image. If the task needs a credential inside the environment, use the narrowest available capability and a clear lifetime. A container boundary cannot protect a secret from code intentionally given access to that secret.

For previews, verify both authorized access and denial. A developer's successful preview says nothing about whether an anonymous visitor can reach the same debug endpoint. Keep source visibility, terminal access, and HTTP preview access as separate checks.

## Troubleshooting by layer

| Symptom | Likely layer | First useful check |
| --- | --- | --- |
| Container unavailable in local preview | Local prerequisites | Confirm Docker and supported Wrangler version |
| `Env` binding missing | Configuration/types | Regenerate types and compare class/binding names |
| Old `Sandbox` method absent | Version mismatch | Identify 0.x versus current model |
| Program not found | Image toolchain | Inspect the selected image and required runtime |
| Request succeeds but result is wrong | Program contract | Parse and validate stdout against known fixture |
| Users see each other's files | Environment identity | Inspect task-scoped naming and ownership checks |
| Preview is stale | Process/source mismatch | Compare build marker and active process |
| Timeout produces duplicate work | Missing reconciliation | Check actual task phase before a new attempt |

Retain the exact failing operation, relevant logs, configuration version, and task phase. Do not dump all request headers or environment variables. Good observability explains where the boundary failed without turning diagnostics into a second data-exposure path.

For local-versus-cloud differences, compare environment versions and supported features before changing application logic. A beta feature can have account or rollout constraints. Record those limits honestly rather than rewriting an error into a claim that the platform is broken.

## A worked failure-recovery scenario

The task runner accepts a document-analysis job and creates an environment. It executes the program and writes `report.json`, but the Worker response is interrupted before the caller receives completion. The user retries. What should happen?

The application should resolve the same task ID, inspect the retained attempt record, and check for a validated report. If the report exists and its input/source hashes match, return it. If execution is still active, report that state. If the environment is gone and no validated result exists, create a new attempt and retain the previous uncertainty.

This requires storing authoritative task state outside an ephemeral process. It also requires a stable artifact naming scheme. A random new filename for every retry makes reconciliation harder; a task-and-attempt namespace makes the relationship explicit. Content hashes help establish that the result belongs to the expected inputs.

Add a deliberate failure immediately after artifact retention and before task completion. Restart the caller and retry with the same task ID. The controller should discover the existing result rather than execute again. Then fail immediately after environment creation and verify cleanup can find the abandoned resource. These experiments exercise the two most common orphaning windows.

Do not describe this as exactly-once execution. The useful goal is idempotent application behavior and observable attempts. Remote systems can repeat work; your application should prevent repeated external effects and make uncertainty explicit.

## Evaluation and optional application

Compare [Modal](/sandboxes/modal/) for Python-centered compute orchestration, [E2B](/sandboxes/e2b/) for an execution SDK, and [CodeSandbox](/sandboxes/codesandbox/) for app-preview workflows. Cloudflare deserves evaluation when the trusted application already lives in Workers or when its capability boundaries fit your architecture. Treat that as a workload-fit hypothesis.

Build a private task-summary service from the fixed runner. Add authenticated task records, one environment per task, structured result validation, bounded output, and durable artifacts. Keep arbitrary command execution out of the public request interface. Add a model only after the deterministic path is understandable.

Acceptance requires the known fixture to return total three and done two; unsupported routes to fail clearly; binding types to match configuration; task identity to prevent cross-user sharing; a forbidden outbound request to fail while required setup works; stale attempts not to overwrite new results; artifacts to survive cleanup; and a documented 0.x/current-version distinction.

For the advanced extension, implement the same pure transformation in a Dynamic Worker using the current official guide. Compare capabilities and failure behavior, not only elapsed time. Keep both versions small enough that you can explain every boundary to another developer.

## A version-provenance exercise

Take an existing tutorial that imports an older `Sandbox` class and compare it with the current quickstart. Do not edit the tutorial yet. Create a small table containing the tutorial date, package version, configuration shape, environment-creation call, command call, and preview mechanism. Mark every item whose current replacement has not been established by an official source.

Next, create a clean branch and implement only the fixed computation using the current model. Keep this branch independent of the old application until the known fixture works. That gives you a working reference against which to migrate one feature at a time. If a later file or preview migration fails, you still have a verified command-execution baseline.

Record observed differences rather than explaining them away. A changed error type, a different lifecycle default, or a preview that now requires another access path can affect users even when the final stdout is identical. The migration record should show which differences are intentional and how the application handles them.

Finally, recreate the project from its lockfile and written setup instructions. If it silently fetches an unrelated generation of the SDK, fix dependency provenance before continuing. Version provenance is a practical debugging tool: it tells the next developer which set of promises and examples the implementation was built against.

This exercise is optional for new projects and essential when maintaining old examples. It keeps the agent from treating every compiler error as an invitation to invent an API. Ask the agent to cite the source for each migration step and to leave unresolved mappings visible until they are verified.

## A prompt for Claude or Codex

```text
Build a Cloudflare task-scoped sandbox runner from this repository.
Read the current Sandboxes overview, Linux quickstart, security guide,
and @cloudflare/sandbox reference. Identify current versus 0.x APIs.
Use a fixed task-summary operation first, with a Worker policy boundary,
matching Durable Object bindings, no outbound network for the fixture,
and structured output validation. Keep task identity and ownership in
trusted application code. Add bounded output, recovery by task ID,
artifact retention, and cleanup evidence before adding general agents.
Do not expose an unauthenticated arbitrary-command endpoint.
Deliver setup, code, and actual check results; mark cloud runs unrun
unless an authorized account-backed execution occurred.
```

When adding previews, use a separate origin for untrusted pages and examine cookie scope. A generated page served under your application's own hostname can execute in that origin's browser context. The current security guide discusses this boundary explicitly. Keep preview routing in the review plan; successful command isolation does not establish browser-origin isolation. Test the preview with a harmless page that reports its origin before introducing real user content.

Keep the fixed runner as a regression fixture while expanding the product. When a later agent workflow fails, the fixture can establish whether basic binding, image startup, execution, and output decoding still work before you investigate model behavior.

## Sources and verification

- [Sandboxes overview](https://developers.cloudflare.com/sandbox/) — environments, availability, and beta scheduling status; accessed November 13, 2026.
- [Run a Linux command](https://developers.cloudflare.com/sandbox/get-started/) — current configuration, container execution, and local prerequisites; accessed November 13, 2026.
- [Current SDK reference](https://developers.cloudflare.com/sandbox/reference/) — helper-library model; accessed November 13, 2026.
- [Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/) — version boundary and migration notice; accessed November 13, 2026.
- [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) — application capability and environment-identity boundaries; accessed November 13, 2026.

All five pages were opened during research. The TypeScript example passed syntax parsing with the available Babel TypeScript parser; generated binding types were not checked. Cloud and Docker-backed execution remain unrun. The task-summary program, identity model, recovery scenario, and acceptance checks are original instructional material. Package, image, and beta-feature behavior should be pinned and revalidated in your environment.
