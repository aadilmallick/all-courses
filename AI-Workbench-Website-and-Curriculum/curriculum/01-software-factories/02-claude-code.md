# Claude Code


## What you will learn

Claude Code is an agentic development tool that can inspect a repository, edit files, run commands, and use connected tools. Its most useful lesson is disciplined delegation: give a bounded task, make project context legible, inspect execution evidence, and retain a reviewable result. This chapter develops that workflow through a configuration-provenance bug. Allow four to six hours for the complete learning project.

Research date: **November 13, 2026**. The current official overview supports terminal, IDE, desktop, and browser surfaces and documents native Windows installation. This chapter focuses on terminal sessions and portable repository practices. It does not assume WSL is required. Account eligibility, supported providers, plan limits, and organization settings should be checked before use. [Overview](https://code.claude.com/docs/en/overview).

No Claude Code account session, model request, remote connection, or paid action was run while preparing this chapter. Prompts are proposed learning tasks. Examples using the CLI require an installed supported version and an authorized account.

## The problem: delegation needs a feedback loop

Consider a bug report: “The application uses port 9000 even though the project file says 8000.” An assistant can quickly edit the project file to 9000 and declare the mismatch fixed. That patch may merely hide the real cause: an environment variable or command-line argument overrides the file. The useful task is to explain the effective value and its origin, then repair the intended behavior.

This is a good agent exercise because the answer requires investigation across files and runtime observations. A capable agent should inspect configuration loading, identify precedence, reproduce the mismatch, make a focused change, and run meaningful checks. The developer should be able to trace the final claim back to evidence.

Use the mental model of a developer operating a toolbox through a conversation. The model proposes and selects actions; tools read and change the actual environment; observations return to the model. A fluent explanation is not an execution observation. A successful command is not proof that the product requirement is satisfied. The loop needs both program checks and human review.

The most useful prompt is therefore a small contract: goal, context, constraints, deliverable, and verification. It should define the behavior you want while leaving routine implementation choices to the agent. Overly detailed keystroke instructions can prevent useful investigation; vague requests such as “fix everything” make scope and acceptance impossible to assess.

## Prerequisites before the first session

Know how to open a terminal in a project directory, inspect a Git diff, and run the project's existing checks. A branch identifies a line of work, a commit records source state, and uncommitted files remain mutable. Before an agent edits, identify the starting commit and any user changes already present.

Understand the difference between project instructions and enforced configuration. A Markdown instruction file gives the model context. A permission setting or external policy controls what an operation is allowed to do. Do not rely on a sentence in a prompt as the sole boundary for credentials, network access, or consequential external actions.

Separate the tool's configuration from your application's configuration. `.claude/settings.json` changes Claude Code behavior. `config.json` in the worked project changes the learning application's port. A provenance investigation must identify which system is being configured before reasoning about precedence.

Finally, know the execution location. A terminal session on your laptop uses that machine's files and tools. A session inside a remote workspace uses that workspace. A browser interface can be either a window into local execution or a hosted environment, depending on the feature. The interface alone does not establish where code runs.

## Install and establish a small baseline

Use the current official installation method for your operating system. On Windows, the overview documents a WinGet option:

```powershell
winget install Anthropic.ClaudeCode
```

Open a new terminal and check `claude --version`. On macOS, Linux, or WSL, follow the corresponding official method rather than translating shell syntax by guesswork. Native Windows support is documented; Git for Windows is recommended for Bash-tool use, with a PowerShell fallback described in the current overview. [Installation overview](https://code.claude.com/docs/en/overview).

Open a disposable learning repository and run `claude`. Complete the supported authentication flow for your account. Start with a read-only investigation:

```text
Inspect this repository and explain how to run its existing checks.
Identify the current branch and source revision. Do not edit files yet.
Distinguish observations from assumptions and list any missing setup.
```

This first prompt establishes whether the agent can see the intended project and understand its verification path. If it names a nonexistent test command, ask it to point to the file that defines the command. Do not build a large task on an invented setup assumption.

The CLI reference documents interactive starts, noninteractive `-p` queries, and continuation/resume commands. Use interactive mode while learning because it makes the investigation and tool decisions easier to inspect. [CLI reference](https://code.claude.com/docs/en/cli-reference).

## The worked project: show where a configuration value came from

Our application accepts a port from three sources: a default, an optional JSON file, and an optional explicit override. The learning contract says later sources win and the result must include provenance. This contract is invented for the exercise; it is not Claude Code's own settings algorithm.

Save `config_resolver.py`:

```python
import argparse
import json
from pathlib import Path


def resolve_port(project_config, explicit_port=None):
    value = 8000
    source = "default"
    if "port" in project_config:
        value = project_config["port"]
        source = "project_config"
    if explicit_port is not None:
        value = explicit_port
        source = "explicit_override"
    if isinstance(value, bool) or not isinstance(value, int):
        raise ValueError("Port must be an integer")
    if not 1 <= value <= 65535:
        raise ValueError("Port must be between 1 and 65535")
    return {"port": value, "source": source}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path)
    parser.add_argument("--port", type=int)
    arguments = parser.parse_args()
    project_config = {}
    if arguments.config is not None:
        project_config = json.loads(arguments.config.read_text(encoding="utf-8"))
        if not isinstance(project_config, dict):
            raise ValueError("Configuration must be a JSON object")
    print(json.dumps(resolve_port(project_config, arguments.port), sort_keys=True))


if __name__ == "__main__":
    main()
```

Save `test_config_resolver.py`:

```python
import unittest
from config_resolver import resolve_port


class PortTests(unittest.TestCase):
    def test_default(self):
        self.assertEqual(resolve_port({}), {"port": 8000, "source": "default"})

    def test_project(self):
        self.assertEqual(resolve_port({"port": 8100}),
                         {"port": 8100, "source": "project_config"})

    def test_explicit_wins(self):
        self.assertEqual(resolve_port({"port": 8100}, 9200),
                         {"port": 9200, "source": "explicit_override"})

    def test_boolean_is_not_a_port(self):
        with self.assertRaises(ValueError):
            resolve_port({"port": True})

    def test_range(self):
        with self.assertRaises(ValueError):
            resolve_port({}, 70000)


if __name__ == "__main__":
    unittest.main()
```

Run `python -m unittest -v`. Expected behavior is five passing checks. Create `config.json` containing `{"port": 8100}` and run `python config_resolver.py --config config.json --port 9200`. Expected output identifies port 9200 and source `explicit_override`.

The explicit `is not None` matters because presence and truthiness are different concepts. The boolean rejection matters because Python treats booleans as a subclass of integers. The source field matters because it explains why the value is effective. These are small examples of the reasoning you want an agent to preserve.

## Give the agent a real before-and-after task

To create the bug exercise, change the final source label to `project_config` even when the explicit override wins. Keep the failing test. Ask Claude Code to diagnose the discrepancy rather than to rewrite the whole resolver:

```text
The application reports the correct explicit port but the wrong source.
Inspect config_resolver.py and its tests. Reproduce the failing case,
explain the precedence path, make a focused fix, and rerun the checks.
Preserve the accepted source order and input validation. Do not add
dependencies or broaden the configuration format. Deliver the patch,
the observed before/after evidence, and any remaining limitations.
```

The prompt supplies goal, context, constraints, deliverable, and verification. It does not prescribe every edit. The agent should discover the incorrect label and repair it. If it deletes the provenance assertion to make tests pass, the task has failed even though the command becomes green.

Inspect the diff yourself. A focused patch should change the incorrect behavior and any necessary explanatory material. Unrelated formatting, new dependencies, or a broad abstraction require justification. The agent's explanation should refer to the effective-value path and the observed checks, not merely say “fixed the bug.”

After a successful repair, recreate the failing input from the command line and compare the JSON. The unit checks and the command-line example exercise related but different boundaries. The latter verifies argument parsing and file reading in addition to the pure function.

## Give recurring context a home in CLAUDE.md

Create a concise project instruction file:

```markdown
# Project context

This repository teaches configuration provenance using standard-library Python.
Run checks with: python -m unittest -v
Preserve the contract: default < project JSON < explicit override.
Every resolved port includes its winning source label.
Reject booleans, nonintegers, and ports outside 1..65535.
Keep changes focused and report what was actually checked.
```

The current memory documentation describes `CLAUDE.md` as persistent context and distinguishes it from automatically accumulated memory. It also documents auditing loaded instructions and the `/memory` interface. Keep recurring facts here; move a long occasional procedure into a skill. [Project memory](https://code.claude.com/docs/en/memory).

Do not turn the file into an encyclopedia. Long duplicated instructions can conflict and obscure the few facts that matter every session. Include the build/check path, architectural constraints, and repeated mistakes worth preventing. Link detailed documentation instead of copying it repeatedly.

If instructions appear ignored, investigate provenance: which file loaded, from which scope, and whether a more specific instruction applies. The model's assertion that it “remembers” a rule is weaker evidence than inspecting the actual loaded context and files. Also distinguish an instruction misunderstanding from an enforced policy that the user cannot override.

## Claude Code settings provenance: a separate investigation

Now apply the same reasoning to the tool itself. Current settings documentation distinguishes user, shared project, project-local, command-line, and managed sources. It also warns that lists and some special keys do not follow a simplistic scalar replacement rule. Environment-variable interactions are defined per setting rather than as one universal tier. [Settings and precedence](https://code.claude.com/docs/en/settings).

Use a harmless preference for the exercise. Suppose spinner tips appear despite your personal preference. Inspect the relevant user, project, and local settings rather than repeatedly editing the same file. The current guide uses `spinnerTipsEnabled` in its worked precedence examples. Record each observed source and the effective value; avoid changing managed settings you do not own.

The method is transferable:

1. Name the exact behavior and setting key.
2. Identify the current session and working directory.
3. Inspect only the relevant configuration sources.
4. Read the documented merge and precedence rule for that key.
5. Confirm what loaded through the tool's status/diagnostic interface.
6. Change the narrowest appropriate scope and verify a new observation.

Do not copy a tool's entire settings directory into a public bug report. It can contain account state, server definitions, and private paths. Extract the relevant key and redact sensitive values. Provenance means explaining the origin of a value, not publishing every configuration file.

Keep application provenance and tool provenance separate in your notes. The learning application's three-layer scalar contract is intentionally simple. Claude Code's real configuration has scope, merge, trust, and managed-policy behavior that must be read from its current reference.

## Skills package a repeatable procedure

A skill is useful when you repeatedly paste the same multi-step process. For the provenance investigation, create `.claude/skills/trace-config/SKILL.md`:

```markdown
---
name: trace-config
description: Trace a configuration value to its effective source in this repository.
disable-model-invocation: true
---

Inspect the requested setting without changing files first.
Find its default, file, environment, and command-line sources as applicable.
Read the implementation's precedence logic and reproduce a small case.
Report the effective value, winning source, and evidence.
If a fix is requested, make a focused patch and run the existing checks.
Do not print secrets or replace missing evidence with assumptions.
```

The current skills documentation describes this directory pattern and manual invocation through `/trace-config`. The manual-invocation field is useful for a procedure whose timing you want to control. The body is workflow guidance, not a new executable API. [Skills](https://code.claude.com/docs/en/skills).

Evaluate the skill on the known resolver bug and on a second case with no bug. A useful procedure should explain the winning source even when no edit is needed. If it always produces a patch, its instructions are biasing the agent toward unnecessary changes.

Keep the skill's description narrow enough that it does not trigger for unrelated work. Keep its body concise enough to remain usable. Supporting examples can live in separate files and be read when needed. Reusable instructions should reduce repeated explanation, not become another large source of contradictory rules.

## Skills versus MCP

A skill teaches a procedure or supplies specialized context. MCP connects tools and data sources through a supported protocol. A skill might say how to inspect an issue; an MCP server might provide the actual issue-reading operation. These mechanisms complement each other, but neither guarantees correctness or permission to act. [MCP documentation](https://code.claude.com/docs/en/mcp).

For this learning project, no external server is necessary. The repository and shell are sufficient. Add an integration only when the task has a clear need, such as retrieving a relevant issue or reading approved documentation. Every connection adds configuration, authentication, and a new trust boundary.

Before connecting a server, identify who operates it, which tools it exposes, what data it can access, and whether operations have side effects. A local stdio server is a process running on the execution machine; a remote HTTP server is another service with its own identity and availability. The current MCP guide documents both kinds.

Tool output remains untrusted content. An issue body can contain instructions attempting to redirect the agent. Those instructions do not acquire authority because they arrived through a connector. Keep the user's goal and the application's permission boundary separate from retrieved text.

## Checkpoints and Git solve different recovery problems

Claude Code documents automatic checkpoints and `/rewind` for tracked edits and conversation state. The current limitations are nuanced: restoration depends on how a file was changed, and shell-only or some delegated edits may not be covered. Read the current behavior rather than assuming every filesystem and external effect can be undone. [Checkpointing](https://code.claude.com/docs/en/checkpointing).

Use checkpoints for local exploration and Git for durable source history. Before a broad experiment, record a clean source state. After a useful result, inspect and commit the intended patch through your normal workflow. Neither mechanism reverses an email, a database write, or an external deployment automatically.

Practice with the resolver in a disposable branch. Ask for one small alternative implementation, inspect the diff, and use the documented rewind interface to return to the previous tracked state. Then run the tests again. The observation you want is that the expected files and behavior returned, not merely that the conversation looks older.

Avoid destructive blanket recovery commands in a workspace containing user changes. First inspect the diff and identify ownership. A good agent distinguishes its own edits from preexisting work and explains the recovery scope before removing valuable state.

## Worktrees for parallel sessions

The current common-workflows guide documents `claude --worktree NAME` for an isolated checkout on a separate branch. The repository needs an initial commit. Worktrees reduce filesystem collisions between sessions; they do not make incompatible changes automatically mergeable. [Common workflows](https://code.claude.com/docs/en/common-workflows).

Try two bounded tasks from the same known base: one repairs provenance labels, the other improves user-facing error messages. Give each clear file ownership and acceptance behavior. Inspect both patches, integrate selected changes, and rerun the full checks in a clean state.

Do not ask both sessions to “improve the whole project.” Parallelism helps when work boundaries are clear. It increases integration work when both agents redesign the same interfaces. The human or supervising workflow must still decide which result becomes authoritative.

Keep secrets and ignored local setup in mind. A separate worktree may not contain untracked configuration needed to run the project. Reproduce setup through documented project instructions instead of copying an entire home directory. If a worktree cannot run checks cleanly, treat that as an environment-provenance issue.

## Remote Control is a window into an execution machine

Remote Control connects a browser or mobile interface to Claude Code running on your machine. The current documentation explicitly distinguishes it from cloud sessions. Local files and tools remain on the execution machine, and that machine plus the Claude process must remain available. Eligible subscription login and organization settings apply; API-key authentication is not the Remote Control path. [Remote Control](https://code.claude.com/docs/en/remote-control).

From an existing session, the documented `/remote-control` command enables the connection flow. The CLI also documents `claude remote-control` server mode. Use the actual returned connection URL and follow the account's confirmation and trust flow. Do not invent a URL or assume a generic remote terminal is the same feature.

The distinction matters operationally. If your laptop sleeps, a browser tab does not magically move the workload into a cloud VM. If you need execution to continue independently of the laptop, choose a supported hosted session or run the CLI in an appropriate remote environment and understand that environment's lifecycle.

For a safe learning experiment, use the disposable resolver repository. Enable the connection, inspect the same conversation from another authorized device, send a small read-only request, and compare source state from the terminal. Then disconnect and confirm the local session's observed state. Do not begin with production credentials or consequential external actions.

## Session continuity and honest handoffs

The CLI documents `claude --continue` for the most recent session in a directory and `--resume` for selecting earlier sessions. Session history helps continuity, but source state may have changed since the last conversation. On resumption, inspect the branch, working tree, and relevant files before continuing an old plan. [CLI reference](https://code.claude.com/docs/en/cli-reference).

A useful handoff includes the goal, effective configuration sources, changed behavior, observed checks, and unresolved questions. It should identify which work exists in files and which remains a proposal. Avoid summaries that say “everything is ready” without an artifact or command result supporting that claim.

If context becomes crowded, retain the task contract and evidence in the repository or a concise handoff before starting a fresh session. Do not rely on a long transcript as the only specification. A clean session with accurate project context can be more effective than repeatedly extending a confused one.

## Troubleshooting by evidence

| Symptom | Useful first investigation |
| --- | --- |
| `claude` not found | Installation path and new-terminal environment |
| Wrong project inspected | Launch directory, branch, and added directories |
| Repeated instruction mistake | Loaded instruction files and conflicting scope |
| Setting seems ignored | Exact key, scope, merge rule, and diagnostic status |
| Skill missing | Directory, frontmatter, name, and current session loading |
| MCP tool unavailable | Server configuration, authentication, and connection status |
| Rewind incomplete | Documented tracked-edit limitations and Git state |
| Remote Control unavailable | Eligible login, organization policy, network, and process state |
| Tests green but behavior wrong | Acceptance contract and independent known fixture |

Debug the earliest failed boundary. Do not rewrite the resolver because Remote Control authentication failed. Do not broaden tool permissions because a unit test asserts the wrong source label. Specific evidence prevents unrelated changes from accumulating during an agent session.

## Optional project and acceptance criteria

Create the resolver repository, introduce the provenance-label bug, and repair it through a terminal session. Add concise project instructions and the manually invoked trace-config skill. Then repeat the investigation in a fresh session using the same source state.

Accept the project when default, project, and explicit cases identify the correct winning source; invalid values remain rejected; the agent reproduces the failure before fixing it; the diff remains focused; the check output is retained; the skill explains a no-bug case without editing; and the final handoff identifies what was actually run.

For advanced practice, use two worktrees and integrate their changes. Separately test Remote Control on an eligible account and explain where execution remains. These are optional extensions, not prerequisites for understanding the basic inspect-edit-check-review loop.

Compare this workflow with other factory tools using the same bug and acceptance tests. Measure time to a reviewable patch, evidence quality, scope control, recovery, and setup effort. Do not rank tools merely by how many files they edit or how confident their final explanation sounds.

## A prompt to reuse

```text
Investigate this configuration-provenance bug with Claude Code.
Inspect the current branch, user changes, resolver implementation, tests,
and project instructions before editing. Reproduce the wrong source label.
Preserve default < project JSON < explicit override and input validation.
Make a focused fix, run the meaningful checks, and inspect the final diff.
Report the effective value and winning source with evidence.
Keep tool settings, project instructions, skills, and application config
as distinct systems. Do not add integrations or broaden permissions unless
the task actually needs them. Mark unrun remote or account checks clearly.
```

Retain configuration provenance with the bug report. A source label without the observed input, relevant setting scope, and source revision can become ambiguous after the next edit. Small reproducible fixtures keep future investigations grounded in the behavior that actually failed.

## Sources and verification

- [Overview](https://code.claude.com/docs/en/overview) — installation and supported surfaces; accessed November 13, 2026.
- [CLI reference](https://code.claude.com/docs/en/cli-reference) — session and invocation commands; accessed November 13, 2026.
- [Project memory](https://code.claude.com/docs/en/memory) — instructions, auto memory, and auditing; accessed November 13, 2026.
- [Settings precedence](https://code.claude.com/docs/en/settings) — configuration scope and merge distinctions; accessed November 13, 2026.
- [Skills](https://code.claude.com/docs/en/skills) — reusable instructions and manual invocation; accessed November 13, 2026.
- [MCP](https://code.claude.com/docs/en/mcp) — tool-connection model; accessed November 13, 2026.
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) — recovery behavior and limits; accessed November 13, 2026.
- [Common workflows](https://code.claude.com/docs/en/common-workflows) — worktrees and session practices; accessed November 13, 2026.
- [Remote Control](https://code.claude.com/docs/en/remote-control) — execution location and eligibility; accessed November 13, 2026.

The resolver, tests, provenance procedure, and learning prompts are original instructional material. No Claude session or Remote Control connection was run. Recheck the installed CLI version and the exact feature's current documentation before adapting the examples to an organization workflow.
