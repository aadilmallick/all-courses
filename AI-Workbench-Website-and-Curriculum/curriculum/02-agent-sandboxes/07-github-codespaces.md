# GitHub Codespaces


## Why Codespaces is in an AI-tool curriculum

Codespaces is a development environment, not an AI model. That distinction is exactly why it belongs here. An agent can only do useful repository work when the toolchain, source, checks, and review path are understandable. Codespaces lets you learn that environment layer in a familiar repository-centered workflow. By the end, you should be able to create a workspace, encode setup in a dev container, run an agent there, inspect its patch, and preserve work before stopping or deleting the environment.

Research date: **November 13, 2026**. GitHub's current quickstart covers browser-based VS Code, repository setup, forwarded ports, and committing changes. The lifecycle documentation distinguishes disconnect, stop, rebuild, and deletion. Account access, organization policy, machine availability, and billing must be checked in the current account. [Quickstart](https://docs.github.com/en/codespaces/quickstart), [lifecycle](https://docs.github.com/en/codespaces/about-codespaces/understanding-the-codespace-lifecycle).

Allow three to five hours for the first pass and another session for the optional agent exercise. No GitHub account operation or Codespaces resource was created during curriculum preparation. Commands below are instructions for a future authorized learning run.

## The problem: a repository is not its environment

A repository contains source files, but those files can assume a particular language version, system package, editor extension, and startup sequence. A developer who knows the project may carry this knowledge in memory. An agent does not. It discovers the environment through files and command results, often spending time on problems that have already been solved by previous contributors.

The goal is to move shared setup into versioned configuration. A new contributor or agent should obtain a workspace with a known toolchain, run a documented check, and begin the actual task. This reduces both onboarding friction and the temptation to “fix” application code when the real problem is a missing runtime.

Use the mental model of a repository plus a workshop recipe. Git records the source. The dev-container configuration records how the workshop should be prepared. A codespace is one running instance with its own mutable state. A branch or commit preserves reviewed code independently of that instance.

The recipe is not a complete production deployment. A development environment may include debugging tools, broad editor capabilities, and local test services that do not belong in production. Keep the purpose explicit: this chapter prepares an environment for development and review.

## Prerequisites in a practical order

First learn the minimum Git vocabulary. A **working tree** holds current files. A **commit** records a snapshot. A **branch** names a line of work. A **remote** is another repository location. Committing locally does not necessarily push the commit to GitHub. If the only copy of a commit lives inside a codespace, deleting the environment can still remove work you intended to preserve.

Next understand a dev container. The configuration describes the development container's image or build, tools, and project setup. GitHub documents `.devcontainer/devcontainer.json` as the common location, with supported alternatives. A Dockerfile can build the base toolchain, while configuration can add lifecycle commands and editor integration. [Dev-container introduction](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers).

Then learn the local/remote boundary. The editor may run in your browser or on your desktop while the terminal executes in a remote Linux environment. A path copied from Windows is not automatically present there. Files must be committed, uploaded, or transferred intentionally.

Finally, understand port forwarding. A server inside the development environment listens on a port. The platform provides a route for your browser to reach it. Visibility and access are separate product settings; starting a server does not tell you who can open it. Check the intended audience before sharing a preview.

## Create the first workspace through the UI

Use a disposable repository or GitHub's official quickstart template. Open the repository's Code menu, choose Codespaces, and create an environment using an allowed configuration and machine type. Organization policy may constrain your choices. Wait for setup to finish and inspect the terminal before asking an agent to change files.

The official quickstart uses a template application and walks through starting it, opening a forwarded port, editing a file, and publishing changes. Follow that flow once to establish the platform basics. [Codespaces quickstart](https://docs.github.com/en/codespaces/quickstart).

Your first useful observation is the workspace identity and source state. In the remote terminal, run:

```bash
pwd
git status --short
git branch --show-current
git rev-parse HEAD
```

These commands show where you are, whether uncommitted changes exist, which branch is active, and the exact base commit. They do not print credentials. Record the commit in your task notes so the final patch has a known starting point.

If setup fails, inspect creation logs before changing application source. A dependency-download error, invalid image, or organization image policy is an environment problem. An agent that starts rewriting code to compensate can make the repository worse while appearing busy.

## A small repository that teaches repeatability

Create a learning repository containing a Python task-summary program. It uses only the standard library, so environment debugging is not obscured by dependencies.

Save `summary.py`:

```python
import json


def summarize(tasks):
    return {
        "total": len(tasks),
        "done": sum(task["status"] == "done" for task in tasks),
    }


if __name__ == "__main__":
    sample = [
        {"id": "T-1", "status": "done"},
        {"id": "T-2", "status": "open"},
        {"id": "T-3", "status": "done"},
    ]
    print(json.dumps(summarize(sample), sort_keys=True))
```

Save `test_summary.py`:

```python
import unittest
from summary import summarize


class SummaryTests(unittest.TestCase):
    def test_known_fixture(self):
        tasks = [{"status": "done"}, {"status": "open"}, {"status": "done"}]
        self.assertEqual(summarize(tasks), {"total": 3, "done": 2})

    def test_empty_input(self):
        self.assertEqual(summarize([]), {"total": 0, "done": 0})


if __name__ == "__main__":
    unittest.main()
```

Run `python summary.py` and `python -m unittest -v` in the remote terminal. Expected output includes total three, done two, and two passing tests. The first command demonstrates the program; the second establishes acceptance behavior. Keep both commands in the repository README.

The boolean expression in `sum` evaluates to one for a done task and zero otherwise. The implementation assumes every task has a `status` key; that assumption is part of the current contract. Do not silently broaden it while working on an unrelated feature. A clear small contract makes an agent's change easier to assess.

## Encode the toolchain in a dev container

Add `.devcontainer/devcontainer.json`:

```json
{
  "name": "Task summary learning workspace",
  "image": "mcr.microsoft.com/devcontainers/python:3.12-bookworm",
  "postCreateCommand": "python -m unittest -v",
  "customizations": {
    "vscode": {
      "extensions": ["ms-python.python"]
    }
  }
}
```

This is a learning configuration using the documented image-property pattern and a Python/Bookworm variant listed by the official image project. Confirm it is permitted by your organization before building. For long-term reproducibility, use an image version or digest policy appropriate to your team rather than relying indefinitely on a moving tag. The important lesson is the distinction between the environment recipe and one mutable environment. [Dev-container configuration](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers), [official Python image](https://github.com/devcontainers/images/blob/main/src/python/README.md).

`name` labels the environment. `image` selects the toolchain. `postCreateCommand` runs a known check after creation. The editor extension improves the shared development workflow but does not replace the Python runtime. A syntax-highlighting extension cannot make a missing interpreter execute code.

Do not put personal themes or individual preferences into the shared configuration unless the team intentionally standardizes them. Shared configuration should contain what contributors need to work on the project. Personal settings belong in personal customization mechanisms.

Rebuild the environment after changing the configuration and inspect the result. Then create a fresh codespace from the same commit. The fresh creation is the strongest simple check that your repository actually contains the required setup. A successful rebuild in an old environment can still hide state left over from earlier work.

## Understand lifecycle commands before adding complexity

Creation, start, attach, and rebuild are different events. Dependency installation that should happen once per created environment does not necessarily belong in an every-attach action. A server that must run after restart needs guarded startup, not unconditional duplicate launch on every editor connection.

Start with one setup command and one explicit developer-run command. When a real need appears, move it into the appropriate documented lifecycle hook and test repeated execution. Idempotent setup means running it again leaves a valid environment; it does not mean every command can be repeated safely.

For a project with a lockfile, installation should use the lockfile's reproducible mode. Avoid a setup step that resolves unconstrained latest dependencies on every start. If setup changes the repository's lockfile unexpectedly, inspect why before accepting it as normal.

Keep secrets out of the dev-container file, Dockerfile, and reusable image. Repository access and model access should be scoped through the current platform and organization mechanisms. If an agent needs a credential, establish exactly what it can do and where it is available. The fact that execution is remote does not make broad credentials harmless.

## Add an agent as a development tool

Codespaces supplies the environment. The coding assistant is a separate tool with its own account, installation, permissions, and model access. Choose one supported assistant and follow its current official installation guidance. Do not assume a local desktop installation automatically appears in the remote terminal.

Give the assistant a narrow task: add a `remaining` count equal to total minus done. Before it edits, provide the existing contract, the exact test command, and the desired evidence. Ask it to inspect the repository and identify its current source state. This discourages broad rewrites and makes the environment legible.

Keep the task on a dedicated branch. The environment may be disposable, but the branch provides a reviewable unit of work. Inspect the diff after the agent finishes. Look for unrelated changes, deleted checks, hidden dependency additions, and altered configuration. Passing tests are evidence about tested behavior, not permission to skip review.

The agent should update tests for the new contract. For the known fixture, remaining is one; for empty input, it is zero. Decide beforehand how unrecognized statuses behave. A reasonable learning policy is that anything other than done remains unfinished. That is an application decision, not a property of Codespaces.

## Preserve a useful handoff

A good final handoff says what changed, why, and which checks ran. It should identify the base commit, resulting commit or patch, and any remaining limitations. A terminal transcript alone is difficult to review; a concise behavior explanation plus evidence is better.

Before stopping the environment, run:

```bash
git status --short
git diff --stat
git diff
```

Review the changes, then commit and push through your normal authorized workflow. Verify that the intended remote branch contains the commit. Do not treat a successful local commit as equivalent to durable remote preservation.

If you do not want to push, export a patch or archive to a durable location you control and verify it opens. Record that untracked files are not necessarily included in a plain Git diff. A task can produce a new file that remains absent from an exported patch if you do not account for it.

The final reproducibility check is another fresh environment from the retained revision. Run the documented checks there. If it fails, investigate hidden dependencies or missing files before deleting the original environment. This is a practical way to catch agent changes that only work in one accumulated workspace.

## CLI workflow for remote sessions

GitHub CLI can list, create, connect to, stop, and otherwise manage codespaces. Authenticate using the current `gh auth login` flow and inspect `gh codespace --help`. The official guide uses the singular `codespace` command. [CLI guide](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli).

The following commands are templates; replace the repository and codespace names with real values you obtained from your account:

```text
gh codespace list
gh codespace create -r OWNER/REPOSITORY -b learning-agent-workflow
gh codespace ssh -c RETURNED_CODESPACE_NAME
gh codespace stop -c RETURNED_CODESPACE_NAME
```

`OWNER/REPOSITORY` and `RETURNED_CODESPACE_NAME` are intentional placeholders. Do not invent a codespace name from a display label. Copy the actual identifier returned by the list or creation operation. Exact available flags should be checked with the installed CLI's help. [Create manual](https://cli.github.com/manual/gh_codespace_create), [SSH manual](https://cli.github.com/manual/gh_codespace_ssh), [stop manual](https://cli.github.com/manual/gh_codespace_stop).

SSH gives a remote terminal; it does not turn the environment into a guaranteed always-on batch service. Use Codespaces as a development workspace with its documented lifecycle and organization policies. For application-controlled high-concurrency execution, compare a dedicated sandbox SDK rather than forcing a human-workspace product into every orchestration role.

## Disconnect, stop, rebuild, and delete

Closing an editor connection does not necessarily stop the remote environment. Stopping releases active execution according to the product lifecycle but retains workspace state. Rebuilding recreates the development container from configuration and has documented preservation boundaries. Deletion removes the codespace. Read the current lifecycle guide before depending on any retention behavior. [Lifecycle](https://docs.github.com/en/codespaces/about-codespaces/understanding-the-codespace-lifecycle).

GitHub's dev-container introduction specifically distinguishes files in the workspace area from changes outside it during rebuild. Keep project work in the intended workspace and encode required toolchain changes in configuration. Installing a tool manually somewhere else may appear to work until the next rebuild. [Rebuild behavior](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers).

Test lifecycle behavior with disposable markers. Write one file in the project, another in a temporary nonproject location, and observe the documented behavior after stop/start and rebuild. Do not use important work for this experiment. Its purpose is to replace vague assumptions with direct observations.

Before deletion, verify pushed commits or exported artifacts. The correct question is not “did the agent finish?” but “does the intended deliverable exist somewhere that survives this environment?” That shift prevents the most common form of accidental loss in remote development.

## Ports and previews

For a web project, run the documented development command and use the forwarded-port interface to open the application. GitHub's quickstart demonstrates this flow. A terminal readiness line is useful, but the browser should still confirm that the expected page appears. [Quickstart](https://docs.github.com/en/codespaces/quickstart).

Check port visibility deliberately. A preview can expose debug routes, sample data, and stack traces. Keep the audience aligned with the task. Test as the intended viewer and, where relevant, as an unauthorized visitor. A successful owner preview does not establish that access is appropriately restricted.

Add an application build marker when debugging stale previews. A small footer containing the source revision or a development-only health response can distinguish an old server from a new one. If edits appear not to work, inspect the running process and port before asking the agent to rewrite the frontend.

When stopping a server, confirm which process owns the port. Avoid killing unrelated workspace processes merely to make a preview load. A shared environment can contain multiple useful services. Explicit process ownership and documented startup commands make cleanup safer and debugging faster.

## Common failures and how to reason about them

| Symptom | Likely cause | Useful first check |
| --- | --- | --- |
| Setup enters recovery mode | Invalid environment configuration | Read creation logs and inspect the first failure |
| Agent says Python is missing | Wrong environment or image | Check remote interpreter and configuration |
| Works in old workspace only | Hidden mutable setup | Recreate from the same commit in a fresh codespace |
| Files vanish after rebuild | Stored outside preservation boundary | Compare file location with documented lifecycle |
| Preview shows old behavior | Wrong process or port | Inspect server identity and build marker |
| Commit missing on GitHub | Not pushed or wrong branch | Verify remote branch and commit ID |
| Agent loses access after restart | Credential/session lifecycle | Reauthenticate through the approved mechanism |
| Unexpected cost or quota use | Idle resources or multiple workspaces | Inspect running environments and current policy |

Do not solve environment drift by continually enlarging the README with unexplained commands. Move repeatable shared setup into configuration, keep task-specific steps in the task handoff, and remove obsolete instructions. A short accurate setup path beats a long accumulation of historical workarounds.

If a command fails only for one user, compare organization policy, permissions, selected configuration, and available secrets. If it fails for everyone from a fresh environment, inspect the shared recipe. This distinction narrows the investigation before the agent changes source code.

## A worked onboarding review

Imagine a new developer joins and receives only the repository link. They create a codespace, run the documented check, make the `remaining` change with an assistant, and open a review request. Your onboarding succeeds if they can complete that path without private instructions from the original author.

Observe where they hesitate. If they ask which Python to use, the environment recipe is unclear. If they do not know the test command, the repository contract is unclear. If they cannot tell whether the agent's work is saved, the handoff is unclear. These are fixable design problems, not evidence that the learner needs a larger prompt.

Repeat the exercise after deleting the disposable environment. A retained branch should recreate the result. Then intentionally break the dev-container image tag and confirm the failure points to setup rather than masquerading as a failing application test. Finally, remove a required tracked file from the branch and verify the check catches it.

Keep a compact evidence table with the base revision, environment configuration revision, check command, result, and final artifact location. This is enough for a reviewer to understand the run without storing every keystroke. It also gives a future agent a useful starting point when reproducing an issue.

## Cost, scope, and alternatives

Evaluate current compute and storage billing separately, including stopped environments and retention policies as applicable. Do not copy a plan allowance from an old tutorial. Organization policy can affect machine choices, idle behavior, and who pays. Set a deliberate learning budget and stop or delete disposable environments when their purpose ends.

Compare [Coder](08-coder.md) when you need self-hosted workspace infrastructure, [Daytona](02-daytona.md) when programmatic environment management is central, and [E2B](01-e2b.md) when the application primarily needs code execution. Codespaces is a strong learning fit for repository-centered human and agent collaboration; that does not make it the universal backend for a high-volume agent product.

Use the same repository and change request when comparing. Measure time to a clean setup, quality of the environment recipe, ability to inspect and preserve work, recovery after disconnect, access controls, and cost per useful development session. A quick first terminal is only one part of the experience.

## Optional application and acceptance criteria

Create a GitHub-ready learning repository containing the summary program, tests, dev-container configuration, and a concise README. Use one assistant to implement the remaining count on a dedicated branch. Preserve the patch and the observed check output.

Accept the project when a fresh codespace can run the checks without undocumented setup; known and empty fixtures behave correctly; source state is recorded before and after the agent task; the diff contains only the intended change; the remote branch contains the final commit; a recreated environment reproduces the result; and the disposable environment can be removed without losing the deliverable.

For an advanced extension, add a small web interface and private preview, then test visibility and stale-process handling. Keep this separate from the first environment exercise so a frontend bug does not obscure basic lifecycle learning.

## Separate environment changes from application changes

Suppose the agent's feature patch also changes the Python image, installs a new formatter, and rewrites every file's line endings. The requested behavior may work, but review has become much harder. Ask the agent to explain which environment change is required for the feature. If none is required, keep the environment update as a separate reviewable change.

This is especially useful in remote workspaces because setup improvements can feel invisible. A different image or extension version can alter formatting, test behavior, or generated files. Record those changes as part of the patch's provenance rather than treating them as incidental machine maintenance.

Practice with two branches: one updates the environment recipe and proves clean creation; the other adds the remaining count and proves application behavior. Review them independently, then integrate and rerun. The separation is not mandatory bureaucracy. It is a way to make cause and effect understandable when a combined change fails.

If the integrated branch behaves differently, you now have a small comparison: the feature, the environment, and their combination. That is much easier to diagnose than a large unexplained diff produced during an agent session.

## A prompt for Claude or Codex

```text
Prepare this repository for repeatable GitHub Codespaces development.
Read the current Codespaces dev-container and lifecycle documentation.
Inspect the source revision, existing setup, and test commands first.
Add a minimal shared environment recipe for the standard-library Python
summary fixture, keeping personal preferences and secrets out of it.
On a dedicated branch, add remaining = total - done and meaningful tests
for known and empty inputs. Explain the status policy before changing it.
Run available checks, inspect the diff, and provide a handoff identifying
the exact source state and what survives workspace deletion.
Do not claim a fresh Codespaces run or remote push unless it occurred.
```

Keep the final README short enough to follow from a clean environment. Put historical investigations in separate notes and remove obsolete setup steps. The next developer should be able to identify the supported path without guessing which of several contradictory commands is current.

## Sources and verification

- [Codespaces quickstart](https://docs.github.com/en/codespaces/quickstart) — create, run, preview, and preserve work; accessed November 13, 2026.
- [Introduction to dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) — configuration and rebuild boundaries; accessed November 13, 2026.
- [Official Python development image](https://github.com/devcontainers/images/blob/main/src/python/README.md) — documented Python/Bookworm image variant; accessed November 13, 2026.
- [Codespace lifecycle](https://docs.github.com/en/codespaces/about-codespaces/understanding-the-codespace-lifecycle) — disconnect, stop, rebuild, and deletion; accessed November 13, 2026.
- [Using GitHub CLI](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli) — command workflow and returned names; accessed November 13, 2026.
- [Create](https://cli.github.com/manual/gh_codespace_create), [SSH](https://cli.github.com/manual/gh_codespace_ssh), and [stop](https://cli.github.com/manual/gh_codespace_stop) manuals — CLI references; accessed November 13, 2026.

No account-backed workspace, push, or preview was run. The summary fixture, onboarding exercise, and acceptance criteria are original teaching examples. Verify the chosen image tag, current CLI behavior, account limits, and organization policy before following the remote workflow.
