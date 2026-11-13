# CodeSandbox SDK


## What this tool teaches

CodeSandbox SDK is useful when your product should create an environment programmatically and let a developer inspect the resulting application. Its educational value is the connection between an agent's output and a working project: files must exist in a real workspace, commands must run, and a preview must represent the right source state. Allow four to six hours for the chapter and optional application.

The researched baseline is **November 13, 2026**. The official SDK repository documents programmatic sandboxes backed by CodeSandbox infrastructure, creation and connection, commands, templates, and source-control use cases. The main documentation URL returned an access error during research, so this lesson verifies API details against the official repository and its source instead of pretending the documentation page was read. [SDK repository](https://github.com/codesandbox/codesandbox-sdk).

You need a CodeSandbox account, workspace API token, available quota, Node.js, and Internet access for the remote examples. No CodeSandbox environment was created during curriculum preparation. The examples are documentation-based and deliberately begin with private, disposable resources.

## The problem: generated files are not a working application

An AI app builder can return a convincing screenshot while leaving basic questions unanswered. Does the project install cleanly? Does the server start? Can the user edit it? Does the preview show the latest files or an older process? What happens after the user closes the browser? These questions belong to the environment and workflow, not to the model's text response.

A programmatic development environment lets your application connect those pieces. The controller creates a workspace, transfers selected files, runs setup, starts the intended command, waits for readiness, and presents a preview. The user can inspect or continue work in an editor. A reviewable artifact is therefore more than a code block: it includes source state, execution observations, and a clear access policy.

Think of the system as a studio with a project desk. The model proposes edits, the workspace holds the actual project, and the preview is a window onto a running process. A window can be stale or pointed at the wrong desk. Always establish which source revision and server process a preview represents.

The controller should remain the owner of lifecycle and authorization. Giving the model arbitrary access to the account-level SDK is unnecessarily broad for a task such as “change this page title.” Instead, expose narrow operations tied to the user's project and enforce ownership in ordinary application code.

## Prerequisites that make the API understandable

Know basic JavaScript modules, promises, and filesystem paths. An `.mjs` file uses ECMAScript modules in Node. `await` waits for a promise in the current program; it does not mean the remote operation can be safely repeated after every network failure.

Separate four contexts: the controller process, the remote sandbox, the user's editor session, and the browser preview. Each has different files, credentials, and network access. A local path is not automatically uploaded. A key in the controller should not automatically appear in the browser. A running development server can outlive the editor connection.

Understand a template as an environment starting point. It can include dependencies and setup behavior, while a created sandbox is a specific mutable instance. Record the template identity and the source revision separately. If you only record “created from the standard template,” you cannot explain later which dependencies were present.

You also need the idea of a **readiness check**. A process can start successfully and still fail before it listens on a port. A useful preview workflow waits for a known route to respond with the expected content. “The command was launched” and “the application is ready” are different observations.

## First private sandbox

In a fresh local directory:

```powershell
npm init -y
npm install @codesandbox/sdk
```

Create a workspace API token through the current account interface and supply it as `CSB_API_KEY`. Use a secret manager or process environment; do not put it in source, browser JavaScript, or a screenshot. The SDK repository documents this environment variable. [SDK setup](https://github.com/codesandbox/codesandbox-sdk).

Save the following as `first-sandbox.mjs`:

```javascript
import { CodeSandbox } from "@codesandbox/sdk";

if (!process.env.CSB_API_KEY) {
  throw new Error("CSB_API_KEY must be configured for this process");
}

const sdk = new CodeSandbox(process.env.CSB_API_KEY);
const sandbox = await sdk.sandboxes.create({ privacy: "private" });
let client;
try {
  client = await sandbox.connect();
  const output = await client.commands.run("printf 'sandbox-ready\\n'");
  console.log(output);
  console.log("sandbox:", sandbox.id);
} finally {
  client?.dispose();
  await sdk.sandboxes.delete(sandbox.id);
}
```

The expected command output contains `sandbox-ready`. Creation, connection, and command execution follow the official README. Explicit privacy and deletion are verified in the official `Sandboxes` implementation; client disposal is a connection cleanup action, not a substitute for deleting the remote resource. [SDK README](https://github.com/codesandbox/codesandbox-sdk), [sandbox management source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/Sandboxes.ts), [client source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/index.ts).

Why set privacy explicitly? Product defaults can distinguish source visibility from preview visibility. A learning example should express its intended audience rather than inherit an unexamined default. Before presenting a preview in your own product, verify both who can inspect the project and who can reach its exposed application.

## Build a tiny project before adding an agent

Our worked project is a task-summary web server. It returns a fixed JSON summary and a health endpoint. It uses Node's standard library, so the first experiment does not depend on a package registry.

Save this as `server.mjs`:

```javascript
import http from "node:http";

const tasks = [
  { id: "T-1", status: "done" },
  { id: "T-2", status: "open" },
  { id: "T-3", status: "done" },
];

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.url === "/health") {
    response.end(JSON.stringify({ ready: true }));
    return;
  }
  if (request.url === "/summary") {
    response.end(JSON.stringify({
      total: tasks.length,
      done: tasks.filter((task) => task.status === "done").length,
    }));
    return;
  }
  response.statusCode = 404;
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, "0.0.0.0", () => {
  console.log("task-summary-ready:3000");
});
```

Run `node server.mjs` locally and open the health and summary routes. Expected summary values are total three and done two. Binding to `0.0.0.0` allows the environment's networking layer to reach the service; binding only to loopback can prevent an external preview proxy from connecting. This does not itself publish the server to the Internet. Publication depends on the surrounding environment and access configuration.

The application has no persistent user data, authentication, or side effects. That is intentional. A preview lesson should establish routing and source identity before introducing databases or real customer information. The smallest useful fixture makes wrong-port and stale-server problems easy to see.

## Write files deliberately

The SDK client has a filesystem interface. The current official source exposes `writeTextFile` for text files and a `workspacePath` getter for the connected workspace. The following complete controller writes a known program and runs a one-shot check; it does not start a persistent server yet. [Filesystem source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/filesystem.ts), [client source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/index.ts).

```javascript
import { CodeSandbox } from "@codesandbox/sdk";

const sdk = new CodeSandbox(process.env.CSB_API_KEY);
const sandbox = await sdk.sandboxes.create({ privacy: "private" });
let client;
try {
  client = await sandbox.connect();
  const programPath = `${client.workspacePath}/summary-check.mjs`;
  await client.fs.writeTextFile(programPath, [
    'const states = ["done", "open", "done"];',
    'const result = { total: states.length, done: states.filter(s => s === "done").length };',
    'console.log(JSON.stringify(result));',
  ].join("\n"));
  const output = await client.commands.run("node summary-check.mjs", {
    cwd: client.workspacePath,
  });
  const result = JSON.parse(output.trim());
  if (result.total !== 3 || result.done !== 2) {
    throw new Error("Unexpected task summary");
  }
  console.log(result);
} finally {
  client?.dispose();
  await sdk.sandboxes.delete(sandbox.id);
}
```

This introduces a useful trust boundary. The program prints JSON, and the controller validates it. The output is not assumed correct merely because a command returned. The working directory is explicit, so the script does not depend on the shell's previous `cd` state. The file path is constructed from a provider-returned workspace path and a fixed filename rather than arbitrary user input.

The command API accepts shell-oriented input; do not mistake an array of strings for an operating-system argument vector without checking the current implementation. In the opened source, command arrays are composed into a shell expression. Use fixed commands for this lesson and a proper validated interface when parameters come from users or models. [Command source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/commands.ts).

## From command execution to a live preview

A web server does not finish, so the one-shot `commands.run` pattern is unsuitable for starting it and waiting for completion. The SDK source documents background-command support. Use the current background-command and port APIs for the installed version, then wait for a health check before presenting a preview. This paragraph describes the workflow; exact preview-URL construction should come from the current API reference rather than a guessed hostname.

The steps are conceptually simple. Write the project files. Run setup and check its result. Start one server process. Retain its command identity. Poll the health route with a bounded deadline. Confirm the response identifies the intended project state. Only then show the preview to the user.

Add a build identifier to the health response, such as an application-generated source hash. If the preview shows a previous build, the mismatch becomes observable. Without this marker, a stale server can look like a successful deployment of the latest edit.

When the agent changes a file, decide whether the server supports hot reload. If it does not, restart it deliberately and repeat readiness. Do not launch another server on the same port and hope the platform chooses the right one. A useful application keeps one authoritative preview process per project state.

Preview errors should be actionable. “Starting server” differs from “server exited,” “health check failed,” “preview access denied,” and “application route returned an error.” Preserve those distinctions in the interface. Otherwise every problem becomes a generic blank preview, and the model wastes time editing frontend code when the actual issue is access or process startup.

## Templates and clean-start reproducibility

Once the tiny project works, move stable setup into a reusable template. The SDK repository documents creating sandboxes from templates and running Dockerfile-based environments. Use that capability to reduce repeated dependency installation, while retaining a written recipe for rebuilding the template. [SDK repository](https://github.com/codesandbox/codesandbox-sdk).

A template should contain shared tooling, not somebody's task-specific data. Keep a package lockfile, record the interpreter version, and avoid runtime secrets in reusable files. If a project needs private dependency access, scope that capability carefully and verify it does not become part of a shared capture.

Test a clean start. Create a fresh sandbox from the template and source revision, install through the documented path, run the checks, and start the preview. If it only works in the original sandbox, hidden mutable state remains. Find and document that state before treating the template as reliable.

The clean-start test is especially important for agent-built applications. Agents often fix environment problems interactively and forget to update the repository's setup instructions. A successful final preview can conceal a nonreproducible project. The deliverable should include enough source and configuration for another environment to reproduce it.

## Hibernation, shutdown, disconnect, and deletion

The official SDK source distinguishes disconnecting a client, hibernating a sandbox, shutting it down, resuming, and deleting it. It also describes clean boot behavior when preserved runtime state is unavailable. These are different operations with different consequences; do not collapse them into a single “close” button without a product decision. [Management source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/Sandboxes.ts), [client source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/index.ts).

For a learning app builder, a reasonable application policy is: keep a project available for review, preserve source and approved artifacts durably, and release active resources after an explicit interval. A reconnect should inspect the actual boot state and project marker before deciding whether setup or server startup is needed.

Do not confuse source durability with process durability. Files can survive while a server process needs restarting. Conversely, a resumed process may still exist, making unconditional startup incorrect. Test both preserved-state and clean-start cases on disposable environments.

An editor connection can keep a resource active. A monitoring loop can also change what the provider considers activity. Measure effective behavior before promising that environments always sleep after a particular idle period. The application should display its own retention policy and record observed resource state separately.

Deletion requires a final artifact check. Confirm the patch, source archive, or commit exists before deleting the only working environment. A chat transcript saying “done” is not the source code. A preview URL is not a backup. Preserve the material a future developer needs to continue.

## Build an application-owned project model

Use a durable record with a project ID, owner, sandbox ID, source revision, template identity, active preview identity, task phase, and cleanup deadline. This record is your coordination layer. It should survive web-server restarts and should not rely on the model's context window.

Separate project state from attempt state. A user may ask for three revisions of one app. Each revision can have an attempt history and evidence, while the project has one selected source state. This prevents a failed attempt from overwriting a previously working project without explanation.

When a request times out after creation, reconcile before retrying. If the provider created a sandbox but the response was lost, a blind second creation can leave an orphan. Store resource identity as soon as it becomes available and use application task identity to connect later observations. Where exact recovery cannot be established, record uncertainty and run bounded cleanup rather than pretending nothing happened.

Use explicit ownership checks for every operation: file read, file write, command execution, terminal attachment, preview access, and deletion. Do not authorize a user merely because they supply a valid sandbox ID. The provider's account-level key may be able to access many projects, so application authorization is essential.

## An agent workflow that produces reviewable work

Give the agent a narrow change request: add a `remaining` field to the task summary, equal to total minus done. Supply the existing project, the acceptance behavior, and the verification command. Ask it to inspect before editing and to explain the final behavior in a short handoff.

The task has three useful checks. The known fixture should return total three, done two, remaining one. Empty input should return zeros. A new unrecognized status should follow an explicit policy, such as counting as remaining, rather than being silently ignored. The product owner chooses that policy before the agent changes code.

Preserve the before-and-after source and the observed checks. If the agent rewrites the entire server, review whether that scope was necessary. A larger diff can introduce unrelated behavior even when the target field is correct. The environment makes execution possible; code review still determines whether the change is appropriate.

For parallel agents, fork from the same known source state and give each a separate environment. One can implement the summary change while another improves the page presentation. Integrate selected changes into a clean environment and repeat checks. Separate workspaces prevent file collisions but do not guarantee compatible application semantics.

## Debugging guide

| Observation | Likely boundary | Useful next step |
| --- | --- | --- |
| SDK import fails | Local Node setup | Confirm package installation and module mode |
| Creation denied | Account or token scope | Inspect workspace context without printing the token |
| File written but command cannot find it | Remote path or working directory | Compare `workspacePath` and explicit command `cwd` |
| Command never returns | Long-running process | Use the documented background workflow |
| Preview shows old content | Stale process or wrong route | Compare the build marker and active server identity |
| Private preview is inaccessible | Access configuration | Test as the intended authorized user |
| Reconnect loses process | Clean boot or shutdown | Inspect boot state and run guarded startup |
| Source is gone after deletion | Missing artifact preservation | Recover from retained commit or archive if available |

Retain relevant output and the exact operation that failed. Avoid posting a complete environment dump in logs. A useful failure report identifies phase and evidence while minimizing secrets and user data.

If the official documentation URL is inaccessible, use the official SDK repository and installed type definitions, as this lesson does, and state that limitation. Do not invent methods based on another provider's API. Package names that sound similar can expose very different object models.

## Compare with nearby tools

Compare [E2B](01-e2b.md) for a compact code-execution interface, [Daytona](02-daytona.md) for workspace-management workflows, and [GitHub Codespaces](07-github-codespaces.md) for a repository-first human development environment. CodeSandbox SDK is a relevant candidate when programmatic creation and inspectable app previews are central to your product.

Evaluate using the same tiny server and change request. Measure setup time, clean-start reliability, preview correctness, access behavior, reconnect behavior, artifact preservation, and cost per completed review. Include failed attempts and waiting time. A fast first preview is useful, but it is not the whole lifecycle.

Do not confuse CodeSandbox SDK with Sandpack. Sandpack is a separate toolkit for embedded coding experiences. A browser-based editor component and a remote VM-backed workspace solve related but different problems. Choose based on whether your application needs full remote execution state or an embedded code playground. [Sandpack introduction](https://sandpack.codesandbox.io/docs).

## Optional application: an inspectable mini app builder

Build a controller that creates the task-summary project, runs its checks, starts a private preview, accepts the narrow `remaining` change, and preserves a source archive before cleanup. Keep the master API key on the controller and use the provider's current scoped-session mechanisms if the browser needs direct environment interaction.

Acceptance requires a known-answer summary, a readiness marker tied to source state, an understandable startup failure, a tested private-access path, a clean recreation from retained source, a reconnect path that handles both resumed and clean state, and a final archive that remains available after the environment is removed.

Add a controlled failure after the archive is retained but before the task is marked complete. On restart, the controller should discover and validate that archive rather than rebuilding the project blindly. Then fail after creation but before connection and verify that resource reconciliation can still find the abandoned environment.

The final user-facing handoff should say what works, where to inspect it, and which checks were actually observed. If the preview was not opened or the remote API was not used, say so. A source bundle with honest verification is more useful than an unsupported claim of a fully tested application.

## Work through an access and preview review

Create three test identities in your application's test plan: the project owner, another authenticated user without project access, and an anonymous visitor. For each identity, record whether source inspection, command execution, terminal access, and preview access should succeed. This is a specification, not a claim about your current provider configuration.

Test every intended denial as well as every intended success. A private editor with a publicly reachable debug server can still reveal sensitive information. A private preview that prevents the owner from opening it is also a product defect. Source access and service access should be verified independently because they travel through different paths.

Now change the project while a preview is open. The health response should identify the new source state after a successful update. If it still identifies the old state, stop and reconcile the active process before presenting the change as complete. This catches a common app-builder failure in which source files update correctly but the visible application remains stale.

Finally, expire the review lease and attempt all four operations again. Retained source archives should follow the artifact policy, while live commands and previews should follow the environment policy. Do not delete a user's durable project merely because its temporary execution lease expired. Conversely, do not leave a privileged terminal available simply because the source archive remains accessible.

The exercise turns vague privacy language into observable behavior. Keep the matrix with the project README and rerun it after changes to preview routing, scoped-session handling, or visibility settings. A single successful owner login is not enough evidence to establish the entire access model.

## A prompt for Claude or Codex

```text
Build a small CodeSandbox SDK app-builder prototype for this repository.
Read the current official SDK README, source/types, and lifecycle APIs.
Use explicit private visibility and keep CSB_API_KEY on the controller.
Create the supplied standard-library Node task-summary project, write
files through the SDK, run known-answer checks, start one background
server, and wait for health with a source-state marker before previewing.
Add the remaining field with a focused patch. Handle reconnect and clean
boot separately, preserve source before deletion, and record cleanup.
Deliver code, setup instructions, and evidence. Mark account-backed and
browser checks unrun unless those actions actually occurred.
```

Keep command failures structured in the application record. The current command implementation exposes failure information rather than guaranteeing that every failed process returns an ordinary success string. Preserve the observed exit information and relevant output, then classify the task phase. A model-generated explanation should describe those observations, not replace them with a more optimistic status.

## Sources and verification

- [Official SDK repository](https://github.com/codesandbox/codesandbox-sdk) — package setup, create/connect pattern, and capabilities; accessed November 13, 2026.
- [Sandbox management source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/Sandboxes.ts) — privacy, lifecycle, and deletion; accessed November 13, 2026.
- [Client source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/index.ts) — workspace path, connection, and disposal; accessed November 13, 2026.
- [Filesystem source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/filesystem.ts) — text-file writes; accessed November 13, 2026.
- [Command source](https://github.com/codesandbox/codesandbox-sdk/blob/main/src/SandboxClient/commands.ts) — shell semantics and background commands; accessed November 13, 2026.
- [Sandpack introduction](https://sandpack.codesandbox.io/docs) — distinction from the remote SDK; accessed November 13, 2026.

The main SDK documentation endpoint returned HTTP 403 during research. The official repository was opened instead. The original server fixture was executed locally on an ephemeral test port: health, known summary, and missing-route checks passed. No account-backed environment, remote preview, or migration was run. The app-builder workflow and acceptance criteria are original learning material. Pin the installed SDK version and recheck access and lifecycle semantics before deployment.
