# Foundations for working with AI tools


## A map of the four categories

This guide follows a useful dependency: decide the work, give the agent somewhere to run, connect a useful interaction, and produce an artifact that someone can judge. Software factories coordinate work. Sandboxes supply execution. Voice tools handle live conversation. Video tools produce footage, presenters, or interactive audiovisual experiences. A product can span categories, but that does not make every product a substitute for every other one.

For example, a release assistant might use a coding agent to prepare a change, an isolated environment to test it, a voice interface to explain it, and a video tool to produce a training clip. You do not need all four for every task. Start with the outcome and add components only when they solve a specific problem.

This page is a prerequisite reference. The individual tool chapters contain the full worked learning material. You can return here whenever a term or boundary is unclear.

## Model, agent, harness, and workflow

A **model** maps input context to output. An **agent** uses model decisions in a loop that can inspect information, act through tools, and observe results. A **harness** supplies the machinery around that loop: tool interfaces, session state, permissions, and recovery. A **workflow** is the larger sequence that turns a request into an accepted result, including the human decisions.

The distinction explains why a better model does not automatically repair a broken workflow. If a task points at the wrong repository, the agent may produce an excellent change to the wrong project. If a voice tool has no way to look up an order, a fluent voice cannot truthfully know its status. If a video brief contains contradictory shots, a stronger generator may produce a more convincing contradiction.

Use the smallest system that can complete the job. One agent with good tools is often easier to inspect than a team of specialists. Multiple agents become useful when tasks are independently actionable and their integration is defined. A team name and a board do not create those conditions by themselves.

## Sessions, files, processes, and environments

A **session** is the working conversation and activity history. A **file** is stored data. A **process** is a running program. An **environment** is the machine, container, or sandbox where processes act on files. These have different lifetimes. Closing a browser may leave a remote process running. Reopening a session may not restore a deleted filesystem. Saving a file does not keep a server alive.

Before a remote task, answer: what survives disconnection, what survives process exit, what survives environment deletion, and where is the final artifact stored? Read the relevant tool chapter because vendors use terms such as pause, stop, snapshot, and resume differently. Never infer persistence from the word “session.”

An isolated working directory protects against one kind of interference. A container or VM can provide additional boundaries. None automatically proves that credentials, networks, and shared services are isolated. Two workspaces can still use the same development database or port. The environment chapter for your chosen tool explains the relevant scope.

## Git and reviewable changes

A **repository** stores project history. A **commit** identifies a recorded state. A **branch** is a movable reference to a line of development. A **diff** shows changes between states. A **worktree** is another working directory connected to repository history. A **pull request** or merge request packages a proposed integration and its review conversation.

For learning, create a dedicated repository or folder with synthetic data. Check the baseline, checkpoint it, then ask for one bounded change. Review the diff and the check output. This creates an observable before and after. It is much easier to judge a ten-line behavior change than a generated application whose requirements were never explicit.

Separate generating a patch from accepting and publishing it. The course projects usually stop at a reviewable artifact. If you later choose automated publication, make its trigger, authority, and failure behavior explicit. A correct code edit and a correct production release are different accomplishments.

## Command-line basics across operating systems

A terminal runs a shell, and the shell interprets commands. PowerShell, Bash, and Windows Command Prompt have different quoting, path, and line-continuation rules. Copy examples labeled for your shell. A multiline Bash command ending in backslashes will not work unchanged in PowerShell.

For the local JavaScript examples, install a supported Node.js version and run `node --version`. A file ending in `.mjs` uses JavaScript modules. Run it with `node filename.mjs`; run built-in tests with `node --test filename.test.mjs`. The course's offline examples do not require a model API. Vendor SDK examples may require additional packages and credentials, which their chapters identify.

A Python virtual environment separates project packages from other projects. If a chapter uses Python, follow its environment setup and pin the SDK version you validate. An import failure is often an environment problem, not a broken algorithm. Check the interpreter and installed package before rewriting the example.

Use an error message as evidence. “Command not found” means the shell cannot locate the executable. An HTTP authentication error means a request reached a service but was not accepted under the supplied credentials. A permission error reading a file points to a different layer. Name the failing layer before changing several things at once.

## Credentials, accounts, and billing units

A **credential** proves some authority to a service. An API key, browser login, OAuth token, and source-control token are different forms of access. A paid app subscription does not necessarily include API usage, remote compute, phone numbers, or generated media credits. Check the current account page before running a paid lab.

Keep keys out of source code, screenshots, shared prompts, and generated reports. Use the service's documented secret mechanism. Example variable names such as `SERVICE_API_KEY` are placeholders unless a chapter explicitly identifies the provider's supported name. Never invent a key or paste a real key into a teaching fixture.

Measure cost in the units the workflow actually consumes. Coding agents can use model inference and compute. Voice can combine session minutes, telephony, transcription, model output, and speech generation. Video can involve generated seconds, resolution, multiple attempts, and export. No fixed comparison table captures every account arrangement; the chapters teach how to identify the units and measure a small trial.

## Tools, APIs, MCP, and skills

A **tool** exposes an action or information source to an agent. An **API** is a programmatic contract. **MCP** is a protocol used to connect tools and resources to model applications. A **skill** is a reusable procedure or body of instructions. A skill can tell an agent how to check a release; a tool can read the release or run the check. Instructions do not create capabilities by themselves.

Start with one working tool call and inspect its input and output. Define what failure looks like. If a tool creates an external record, consider what happens when the request is retried. A timeout can leave uncertainty about whether the action happened. A repeatable operation or request identity helps avoid duplicate records.

For a read-only learning workflow, mock the external action with a local fixture. A booking assistant can return a synthetic availability result before you connect a calendar. A video integration can process a saved example job status before generating a paid clip. This lets you debug control flow without confusing it with account setup or service latency.

## Voice: the minimum pipeline you need to understand

A voice system receives audio, decides when a person has finished a turn, generates a response, and plays audio back. A modular system may use speech-to-text, a language model, and text-to-speech. A speech-native system may combine some of those stages. Transport moves the audio, while the agent application handles tools and conversation policy.

**Latency** is delay. Distinguish first audible response from complete response time. **Turn detection** decides when to respond. **Barge-in** allows a user to interrupt. **Echo** can cause the agent to hear its own output. A fluent demonstration in a quiet room does not establish good performance on a noisy phone call.

Teach the agent its task boundaries. If it cannot access live order status, it should not invent one. If a tool fails, the response should reflect the failure. Test silence, interruptions, corrections, long numbers, and a tool timeout. Use synthetic conversations before connecting real customers. These are functional quality checks, not a demand to build a large compliance program for a demo.

## Video: model output versus finished communication

A video model generates or transforms media. A finished video also needs a brief, coherent shots, pacing, audio, captions, and review. A realistic clip can still communicate the wrong feature. An avatar can pronounce a sentence clearly while showing an outdated screenshot. Judge the artifact against the purpose, not merely its visual polish.

Distinguish generated footage, a scripted presenter, and an interactive avatar. Footage is often edited into a sequence. A presenter reads a prepared script. An interactive avatar responds to conversation and has real-time system requirements. The tools overlap, but their evaluation criteria differ.

Keep a generation log with the brief, references, prompt, model or mode, output identity, and decision. This makes iteration learnable. If you change the prompt, reference image, duration, and camera direction simultaneously, you cannot easily tell which change helped. For digital people, use identities and voices you are entitled to use and follow the product's consent workflow.

## A common task contract

Use this five-part structure across categories:

1. **Goal:** the real outcome someone needs.
2. **Context:** inputs, starting state, and relevant constraints.
3. **Behavior:** what the result should do or communicate.
4. **Deliverable:** the concrete artifact and its location.
5. **Verification:** observations that establish success and known limits.

For code, verification might be a focused behavior check. For voice, it might be a set of synthetic calls with measured turn latency and tool outcomes. For video, it might be a review rubric covering factual accuracy, continuity, intelligibility, and export quality. Do not force every category into the same testing method.

## A small evidence ledger

Keep a short record for each meaningful experiment:

```text
Question: Can this workflow correct release sorting without changing inputs?
Input: training repository at a recorded revision
Tool and configuration: actual version/profile used
Action: bounded sorting task
Observed: patch, command output, review findings
Decision: accept, revise, or stop
Limit: no live production data or deployment tested
```

This is optional working material, not a mandatory progress tracker. Its purpose is to make a comparison fair and a failure explainable. A screenshot of a green dashboard is useful only if you know what state it evaluated. A generated statement that checks passed is useful only if supported by actual observations.

## Read sources with the right level of trust

Official documentation is the primary source for supported APIs, installation, and lifecycle. A changelog or deprecation notice can supersede an older quickstart. A marketing example illustrates an intended use; it does not establish a measured performance guarantee. A community tutorial can be helpful but may target a retired API.

This curriculum records its research date and direct official links. It distinguishes vendor facts from original worked examples and from account-specific behavior that was not tested. When you resume later, recheck the chapter's sources before installing an SDK or budgeting paid use. A source access date is an evidence timestamp, not a guarantee the page will remain unchanged.

The [research desk](research.md) explains selection and validation. The [ecosystem changes](watchlist.md) page highlights known retirements and renamed products. Move to [Learning paths](learning-paths.md) to choose a route that fits your objective.
