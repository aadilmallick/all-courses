# Coder


## What you will learn

Coder is the right lesson when the question changes from “where can my agent run?” to “how should our organization provide and operate agent workspaces?” You will learn the distinction between a control plane, templates, workspaces, native agents, and third-party agents. The practical project creates an inspectable workspace contract and validates a small repository task. Allow five to seven hours for the learning project; deploying an organization platform is a separate undertaking.

The researched baseline is **November 13, 2026**. The opened documentation identifies **v2.39 Mainline**. It describes Coder Agents as a native self-hosted agent whose loop runs in the control plane, while other supported paths include agents in IDEs, agents installed in templates, and Agent Relay. Agent Relay is labeled **beta**. AI Governance features have separate license requirements. [AI integration overview](https://coder.com/docs/ai-coder), [Coder Agents](https://coder.com/docs/ai-coder/agents/).

This chapter does not install Coder, provision infrastructure, configure a model provider, or claim an account-backed test. The full workflow needs an existing authorized Coder deployment, suitable templates, permissions, infrastructure capacity, and any relevant provider or license access.

## The problem: one useful workspace does not make a platform

A developer can manually create a machine, install an assistant, and begin working. That is enough for an experiment. At organization scale, the questions multiply: who owns the machine, which network can it reach, how are model credentials distributed, what happens when a template changes, and can a reviewer reproduce a task after the original environment is gone?

A workspace platform turns these decisions into managed configuration. The platform team provides approved environment recipes and access paths. Developers create workspaces from those recipes. Agents use a defined execution path. The organization retains responsibility for infrastructure, identity, updates, and operational support.

The useful mental model is a building with a front desk and standardized rooms. The control plane is the front desk and coordination system. A template is a room specification. A workspace is a particular room with current files and processes. An agent is a worker using that room through an allowed access path. The analogy ends where cloud identity and network routing begin; those must be implemented and verified rather than assumed.

Self-hosting changes ownership; it does not automatically settle data residency or confidentiality. A model provider may still receive prompts and selected tool results. A workspace may still have broad outbound access. The architecture should make each flow explicit so the team knows what it operates and what it sends elsewhere.

## Learn the core objects before configuring agents

A **control plane** coordinates users, templates, workspace access, and platform behavior. It is separate from the compute resources where project commands execute. A **template** describes how a workspace is provisioned. Coder documents Terraform-based templates and a template builder; template administration and ordinary workspace creation are different roles. [Template management](https://coder.com/docs/admin/templates/managing-templates/).

A **workspace** is the environment where a developer or agent reads files and runs commands. It has a lifecycle and often a persistent storage component. Its exact start/stop/delete behavior depends on template and infrastructure design. Do not assume every template preserves the same directories or releases the same resources when stopped.

An **agent path** defines where the reasoning loop runs and how tool execution reaches the workspace. Coder's native agent is not simply a wrapper around a third-party CLI. Conversely, installing a CLI assistant in a workspace does not turn it into the native agent. These paths have different credential, network, and operational implications. [Coder Agents architecture](https://coder.com/docs/ai-coder/agents/).

A **model configuration** chooses an upstream model and its access settings. The model is not the workspace. A failure to reach the model provider belongs to a different boundary from a missing compiler inside the workspace. Separating these concepts makes troubleshooting much faster.

## Choose the agent path deliberately

The current overview documents four useful paths. Native Coder Agents puts orchestration in the control plane. Agent Relay connects supported cloud-hosted agent sessions to Coder workspaces. IDE agents operate alongside a human in the editor. Template-installed CLI agents run inside the workspace. [AI integration overview](https://coder.com/docs/ai-coder).

Choose based on the workflow you actually want. A developer pairing in an editor has different needs from a background task queue. An organization that wants centralized native orchestration has different operating work from a team that wants to keep an existing cloud-agent interface while moving execution into its own environment.

Make a decision table for your pilot:

| Question | Why it matters |
| --- | --- |
| Where does the agent loop run? | Determines orchestration and model-network paths |
| Where are model credentials held? | Determines secret distribution and rotation |
| Which component executes commands? | Determines workspace permissions and observability |
| Where is conversation state stored? | Determines retention and recovery |
| Who updates the agent implementation? | Determines release and compatibility work |
| How does a human review output? | Determines editor, preview, and artifact handoff |

Do not choose a path only because a demo used it. Write the desired behavior first, then select the path whose control boundaries fit. A narrow pilot with one model and one template will teach more than enabling every integration at once.

## A user-first walkthrough in an existing deployment

Sign in to the intended Coder deployment. Open Templates, select a template you are authorized to use, and create a workspace with a descriptive name. Review exposed parameters before accepting them: they may control infrastructure size, repository selection, or other resources. The current user guide documents this create-from-template workflow. [Manage workspaces](https://coder.com/docs/user-guides/workspace-management/).

Once the workspace is ready, open its terminal or supported editor. Inspect the working directory, source revision, and runtime before launching an assistant. Use ordinary commands such as `pwd`, `git status --short`, `git rev-parse HEAD`, and your language's version command. Do not print all environment variables.

If the workspace fails to start, inspect the provisioning or startup log associated with that phase. A Terraform provisioning failure, workspace-connection failure, and application-test failure are different problems. The first useful error is often earlier than the final “workspace unavailable” message.

For a learning run, use a disposable repository with synthetic data. Keep the first task small enough that a human can independently verify it. This establishes whether the template and access path work before introducing a large model-driven implementation.

## The worked project: an environment evidence manifest

Before asking an agent to change a project, capture a minimal manifest of the environment. Its purpose is reproducibility, not surveillance. Record selected runtime versions and source state, not secrets or personal files.

Save the following as `environment_manifest.py` in the learning repository:

```python
import hashlib
import json
from pathlib import Path
import platform
import subprocess


def observe(arguments):
    try:
        completed = subprocess.run(
            arguments,
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except FileNotFoundError:
        return {"available": False, "reason": "not_found"}
    except subprocess.TimeoutExpired:
        return {"available": False, "reason": "timeout"}
    return {
        "available": completed.returncode == 0,
        "exit_code": completed.returncode,
        "stdout": completed.stdout.strip()[:2000],
        "stderr": completed.stderr.strip()[:2000],
    }


def file_hash(filename):
    path = Path(filename)
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None


manifest = {
    "python": platform.python_version(),
    "system": platform.system(),
    "git_version": observe(["git", "--version"]),
    "source_revision": observe(["git", "rev-parse", "HEAD"]),
    "node_version": observe(["node", "--version"]),
    "requirements_hash": file_hash("requirements.txt"),
}

Path("environment-manifest.json").write_text(
    json.dumps(manifest, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)
print("Wrote environment-manifest.json")
```

Run `python environment_manifest.py` inside the workspace. Expected behavior is a JSON file describing selected observations. If Node is absent, the manifest records that fact rather than crashing. If the directory is not a Git repository, the revision observation contains a nonzero status. Those are useful diagnostic outcomes.

`subprocess.run` receives an argument list and never invokes a shell here. Each command has a deadline and bounded retained output. The allowlist of commands is fixed in source. This program is intentionally not a general remote-command API. Do not add environment dumps or recursive home-directory scans to make the manifest “more complete.”

The manifest cannot prove the environment is trustworthy. It is a reproducibility aid. A version string can be misleading, and the same version can behave differently under different system configuration. Use it as evidence alongside the template identity and actual checks, not as a certification.

## Make the environment contract explicit

Create a short contract in the repository README. State the required Python version range, whether Node is required, the expected source repository, the check command, and which directories hold durable project work. Add the selected Coder template version or an organization-specific reference outside public source if that information is private.

Now create a second fresh workspace from the same template and source revision. Run the manifest and compare meaningful fields. Differences such as a source commit mismatch or missing runtime deserve explanation. Differences such as a machine hostname may be expected and need not be recorded if they are irrelevant.

This exercise exposes hidden manual setup. If the first workspace works only because somebody installed a tool interactively, update the template or project setup recipe. Do not preserve an unexplained environment indefinitely as the only way to keep the project running.

Template changes should have a review and rollout path. A new runtime can fix one project and break another. Pilot the new version, run representative checks, and retain a recovery plan. The platform team's goal is consistent useful environments, not merely the newest package everywhere.

## A small application task for the agent

Use a pure Python normalization function as the task. It takes a task status string and returns a canonical category. The contract is: trim surrounding whitespace, compare case-insensitively, map done/closed to done, map open/pending to open, and reject other values.

Here is a complete reference fixture:

```python
import unittest


def normalize_status(value):
    if not isinstance(value, str):
        raise TypeError("Status must be text")
    normalized = value.strip().lower()
    if normalized in {"done", "closed"}:
        return "done"
    if normalized in {"open", "pending"}:
        return "open"
    raise ValueError("Unsupported status")


class StatusTests(unittest.TestCase):
    def test_case_and_whitespace(self):
        self.assertEqual(normalize_status("  CLOSED "), "done")

    def test_pending_is_open(self):
        self.assertEqual(normalize_status("pending"), "open")

    def test_unknown_is_rejected(self):
        with self.assertRaises(ValueError):
            normalize_status("archived")

    def test_nontext_is_rejected(self):
        with self.assertRaises(TypeError):
            normalize_status(None)


if __name__ == "__main__":
    unittest.main()
```

Run it locally in the workspace before involving the agent. To create the maintenance exercise, separate implementation from tests and replace the implementation with one that only handles exact lowercase values. Retain the failing check. Ask the agent to repair the specified behavior without broadening the accepted statuses.

This fixture tests ordinary product semantics and error handling. It does not test Coder itself. That separation is useful: a failing application check should not be confused with a provisioning failure. Your final evidence record should state which layer each check exercises.

## Native Coder Agents: an administrator's learning path

For the native path, the current getting-started guide requires an authorized deployment, model-provider configuration, suitable templates, and administrative/model-configuration permissions. It describes configuring providers and organization models through Admin settings. Follow the current UI for your deployment version instead of copying an old menu path blindly. [Getting started](https://coder.com/docs/ai-coder/agents/getting-started/).

Begin with one provider and one model. Confirm the control plane can reach the provider. Then expose one clearly described template containing the learning repository's toolchain. Start a small agent task and inspect the resulting workspace and diff. This sequence isolates provider access, template routing, workspace execution, and application behavior.

The native architecture keeps the model loop in the control plane and connects to workspaces for tools. This means an environment does not need a third-party CLI assistant merely to participate in native agent execution. Do not install redundant agent harnesses unless you intentionally choose another path. [Native agent architecture](https://coder.com/docs/ai-coder/agents/).

Model-provider credentials and code visibility remain design decisions. The control plane can hold credentials while selected source and tool output still become model context. Document those flows, retention settings, and organizational access. Self-hosted execution should be described precisely, not used as a shorthand for “no data ever leaves.”

## Template descriptions are routing interfaces

An automatically selecting agent needs to know which template fits a task. A vague name such as “default” provides little guidance. A description such as “Python service development for the task-summary repository; includes Python and Git; no production database access” communicates purpose and limits.

Coder's current template-optimization guide discusses template discoverability and controls over whether agents may use templates. Use those controls for the pilot instead of exposing every infrastructure option to every agent task. [Template optimization](https://coder.com/docs/ai-coder/agents/platform-controls/template-optimization).

A useful template description explains the workload, required parameters, available toolchain, source-access assumptions, and constraints. Keep it aligned with the actual template. A polished description that promises unavailable tools causes an agent to choose an environment that cannot complete the task.

Test routing with several natural requests. One should clearly match the template, one should require another template, and one should be answerable without provisioning a workspace. Inspect what the agent selected and why. The goal is appropriate environment selection, not maximizing the number of workspaces created.

## Third-party agents in templates and IDEs

If your team already uses a CLI assistant, a template can install and configure its supported runtime. The current Coder overview shows registry modules as one mechanism. Use the maintained module documentation and pin versions appropriate to your deployment. Do not paste a module snippet without understanding which workspace agent resource it references. [Agent paths](https://coder.com/docs/ai-coder).

For this path, model credentials may need to be available inside the workspace depending on the assistant's authentication model. That differs from native orchestration. Document who can access those credentials, how they expire, and which processes can read them. A workspace is a shared trust boundary among its running code.

IDE integration is often the simplest human-pairing pilot. A developer opens the workspace in a supported editor and uses an assistant there. The developer remains responsible for inspecting the diff and preserving work. The environment platform supplies consistency and access, while the editor supplies the interaction style.

Agent Relay is a separate integration path with its own supported providers and beta status. Evaluate the documented connection and failure behavior before relying on it for unattended production work. Do not assume a third-party cloud session and a workspace have identical lifetimes.

## Network and credential boundaries

Draw the actual flows: user to control plane, control plane to model provider, control plane to workspace, workspace to repository, workspace to package registry, and browser to preview. Each flow has authentication, network, and data implications. Native agent placement can remove a workspace's need for model-provider access, but the workspace may still need other destinations.

Test permitted and denied connectivity. A template that can reach a private Git server should not automatically receive production database access. A package-installation phase may need broader egress than a final offline test phase. Where strict policy is required, implement it in the platform and infrastructure rather than in a prompt that the agent can ignore.

Keep secrets out of reusable images, templates, and source archives. A credential used during setup can remain in a configuration file or shell history. Inspect how the tool stores authentication rather than assuming that passing it through an environment variable solves every retention problem.

Review licensing and maturity labels for governance features. The current overview identifies AI Governance as a separate licensed capability, and individual pages mark some features beta or early access. Build the pilot around capabilities your deployment actually has, then evaluate optional controls deliberately. [AI overview](https://coder.com/docs/ai-coder).

## Lifecycle and durable work

Workspace stop, update, rebuild, and delete behavior depends on the chosen template and infrastructure. Read the user-facing lifecycle documentation and the template itself. Identify which storage survives each action and which processes restart. Do not learn this by deleting the only copy of valuable work.

Use disposable markers and the environment manifest to test lifecycle behavior. Create a tracked source change, an untracked project file, and a temporary file outside the project. Observe stop/start and update behavior. Then preserve work through a remote commit or verified archive before testing deletion.

For long-running agent tasks, keep task status and final artifacts independent of an interactive editor session. A disconnected browser should not erase the task's history. A stopped workspace should not make a completed patch undiscoverable. Retention promises belong in the product workflow, not only in infrastructure defaults.

If a task fails after creating a workspace, retain its identity and cleanup deadline. A periodic reconciliation process can find abandoned environments. The normal success path is insufficient because controllers, browsers, and upstream APIs fail at inconvenient times.

## Troubleshooting by responsibility

| Symptom | Likely owner | First useful evidence |
| --- | --- | --- |
| Template provisioning fails | Platform/template team | Provisioner logs and parameter values |
| Workspace starts but connection fails | Platform/network team | Workspace connection and startup logs |
| Native agent cannot reach model | Control-plane configuration | Provider endpoint and credential status |
| CLI agent cannot authenticate | Workspace tool configuration | Assistant-specific auth state |
| Agent chooses wrong environment | Template routing | Available names, descriptions, and permissions |
| Application test fails | Repository task | Exact command, source revision, and output |
| Work disappears after update | Lifecycle/storage design | Template storage boundaries and retained artifacts |
| Cost grows unexpectedly | Platform operations | Workspace lifetimes, model usage, and retries |

Assigning responsibility is not blame. It narrows the boundary that can actually fix the problem. A repository agent should not modify Terraform to compensate for a failing unit test unless infrastructure is genuinely the task. A platform administrator should not rotate model credentials because the code has a syntax error.

Preserve the first useful failure and a concise timeline. Long agent transcripts can contain many secondary errors caused by one missing dependency. Identify that dependency failure before allowing repeated automated repair attempts. More attempts are useful only when they change the evidence.

## A pilot evaluation with explicit success criteria

Choose a small cohort, one template, one repository, and a handful of representative tasks. Include a normal code change, an invalid-input task, a missing-dependency case, a model-provider failure, and a workspace restart. These cases exercise different boundaries and reveal whether the platform is understandable under stress.

Measure time to a reviewable patch, clean-creation success, meaningful check pass rate, human review effort, orphaned resources, and total cost. Separate infrastructure failures from application failures and model mistakes. Otherwise a model-quality dashboard can become an accidental measure of network reliability.

Do not expand the pilot merely because agents produce many commits. Useful output is a correct, reviewed change with preserved evidence. Activity counts can be gamed unintentionally by retries, broad rewrites, or repeated setup. Keep the unit of success tied to a developer outcome.

Compare [GitHub Codespaces](07-github-codespaces.md) for a hosted repository-centered workspace, [Daytona](02-daytona.md) for managed programmatic environment workflows, and [Freestyle](04-freestyle.md) for durable VM-oriented sessions. Coder's distinguishing learning question is operational ownership and organization-level environment control, not a universal speed ranking.

## Optional application and acceptance

In an existing authorized deployment, create the learning workspace, run the environment manifest, repair the normalization fixture with one chosen agent path, and preserve the final patch. Repeat from a fresh workspace using the same template and source state.

Acceptance requires that the manifest records selected versions without secrets; the template's purpose and limits are clear; the correct agent path is identified; known normalization cases pass; unsupported values remain rejected; a fresh workspace reproduces checks; source survives workspace deletion; and a failed attempt can be found and cleaned up by its retained identity.

For an administrator extension, test native template routing and a denied network path. Keep a written record of which controls were configured, which were merely described, and which require unavailable licensing. A truthful partial pilot is a better basis for adoption than a claim that every organizational requirement has been solved.

## A concrete platform handoff

At the end of the pilot, prepare one handoff for developers and one for platform operators. The developer handoff names the template, repository, check command, review path, and preservation behavior. The operator handoff names the model path, infrastructure owner, credential location, network policy, resource limits, and recovery procedure. They describe the same system from different responsibilities.

Test the handoffs with somebody who did not build the pilot. If a developer cannot identify where their patch survives, improve artifact guidance. If an operator cannot identify which component contacts the model provider, improve the architecture record. A diagram or short table is useful only if it reflects the deployed configuration.

Include one known failure and its diagnosis in the handoff. For example, a missing Node runtime should point to the template contract, while a provider-authentication failure should point to control-plane configuration for the native path. This makes the document useful during the first incident, when the original pilot author may be unavailable.

## A prompt for Claude or Codex

```text
Prepare a Coder workspace pilot for this learning repository.
Read current Coder agent-path, template, and workspace documentation.
First identify whether this uses native Coder Agents, Agent Relay,
an IDE assistant, or a CLI assistant installed in the workspace.
Do not mix their credential or network assumptions.
Create a minimal environment manifest with selected runtime and Git
observations, never an environment-variable dump. Repair the supplied
status-normalization fixture on a focused branch and run its checks.
Record template/source identities, lifecycle observations, artifacts,
and actual verification. Do not provision unrelated infrastructure or
claim administrative controls that this deployment has not configured.
```

Keep the pilot's unresolved questions visible. A feature described in documentation may still require a deployment upgrade, license, infrastructure change, or account setting. Assign each unresolved item an owner and an observable completion condition before treating it as part of the operating platform.

## Sources and verification

- [Run AI coding agents in Coder](https://coder.com/docs/ai-coder) — agent paths, Relay beta, and governance licensing; accessed November 13, 2026.
- [Coder Agents](https://coder.com/docs/ai-coder/agents/) — native architecture and workspace relationship; accessed November 13, 2026.
- [Getting started](https://coder.com/docs/ai-coder/agents/getting-started/) — administrative prerequisites and model setup; accessed November 13, 2026.
- [Manage workspaces](https://coder.com/docs/user-guides/workspace-management/) — create and manage workflow; accessed November 13, 2026.
- [Work with templates](https://coder.com/docs/admin/templates/managing-templates/) — template ownership and configuration; accessed November 13, 2026.
- [Template optimization](https://coder.com/docs/ai-coder/agents/platform-controls/template-optimization) — discoverability and agent eligibility; accessed November 13, 2026.

No deployment, provider configuration, or remote workspace was operated. The manifest, normalization fixture, pilot design, and acceptance criteria are original teaching material. Recheck deployment version, feature maturity, licensing, and infrastructure lifecycle before adapting the workflow.
