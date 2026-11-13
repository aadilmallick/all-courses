# Devin


## The problem: delegate a result, not a vague intention

A support ticket says, “Contact import breaks for some customers.” A coding agent can inspect files and propose a patch, but it still needs to know what behavior is wrong, what correct behavior means, where it can work, and how to demonstrate completion. A remote session with powerful tools does not supply those decisions automatically.

Devin is relevant when you want an agent to carry a bounded engineering task through investigation, implementation, execution, and a reviewable handoff. Its current documentation describes a conversational interface with development tools and a local-to-cloud handoff path. Treat these as execution capabilities, not proof that a particular task will succeed. [Introducing Devin](https://docs.devin.ai/get-started/devin-intro)

This chapter uses a concrete support bug: a fictional Beacon contact importer splits CSV rows on commas, so a name such as “Mallick, Amal” becomes two fields. You will prepare a reproducible case, define acceptance criteria, start a session, distinguish environment failures from code failures, inspect the patch and evidence, and preserve a reusable procedure.

Research was checked November 13, 2026. No Devin account, paid session, repository integration, or remote execution was used for this curriculum. The code and prompts below are original teaching examples. Read [Foundations](../reference/foundations.md) if branches, diffs, tests, or credentials are unfamiliar.

## Understand current Devin surfaces

The current first-session guide distinguishes Ask for codebase exploration and planning from Agent for execution. It also documents repository selection and notes that agent availability can be controlled by account or administrators. Use the current account's actual options rather than assuming every mode shown in a guide is enabled for you. [Your first session](https://docs.devin.ai/get-started/first-run)

Use Ask when the bug report is ambiguous and you need a source-grounded explanation or plan. Use an execution session when the scope is clear enough to change files and run checks. You do not need an elaborate planning ceremony for a small well-understood bug, but you do need an explicit contract.

Separate the work location from the work definition. A local CLI session has your local checkout and environment. A cloud session has its own execution context and access configuration. Handoff can transfer useful context, but it does not erase differences in dependencies, secrets, network access, or uncommitted files.

For the first learning task, use a disposable repository or a branch in a project you are authorized to modify. Keep the deliverable small: a focused patch, meaningful tests, and a concise explanation. Do not combine the CSV bug with a UI redesign, dependency upgrade, or import-system rewrite merely because an agent is available.

## A mental model: an agent session is a temporary teammate workspace

Think of the session as a workspace that can read context, execute tools, and maintain a sequence of hypotheses. The workspace is useful because the agent can test its ideas rather than only describe them. It is temporary in the sense that your durable result should live in the repository and review record, not only in a conversation transcript.

The analogy to a teammate helps with delegation: provide the bug, relevant context, constraints, and completion evidence. It has limits. An agent may misread an instruction, overlook a test, or confidently summarize work it did not verify. You need observable artifacts to evaluate the result.

For Beacon, those artifacts are a minimal failing input, the importer patch, regression tests, test output, and a diff showing no unrelated changes. A message saying “fixed CSV parsing” is a claim. A test showing a quoted comma fails before the patch and passes afterward is evidence of a specific behavior.

Distinguish three kinds of success: the environment ran, the tests passed, and the task was solved. The first enables investigation. The second supports correctness for covered cases. The third requires comparing the actual patch with the user-facing problem and stated boundaries.

## Turn the support report into a contract

Begin with the concrete failing input:

~~~csv
name,email
"Mallick, Amal",amal@example.test
~~~

The expected result is one contact whose name includes a comma. A naive line.split(',') operation produces three values and cannot determine which comma separates fields. CSV is a format with quoting rules, so the repair should use an appropriate parser rather than a growing collection of string replacements.

Write the task contract:

| Area | Acceptance criterion |
| --- | --- |
| Quoted comma | One contact preserves the complete name |
| Escaped quote | Doubled quotes inside a quoted field are interpreted correctly |
| Row structure | Missing or extra fields produce a clear error |
| Headers | Required headers are present with no duplicates or unexpected columns |
| Compatibility | Ordinary two-column input still works |
| Scope | No UI redesign, unrelated normalization, or new dependency is needed for this sample |
| Evidence | Regression tests and relevant existing checks are reported honestly |

These criteria resolve decisions before implementation. For example, should surrounding spaces be trimmed? This sample preserves field values and does not introduce normalization. That choice avoids silently changing data while fixing parsing. In a real project, inspect established product behavior and document any necessary compatibility decision.

## Prepare the environment before blaming the agent

A remote agent needs a usable repository and a reproducible way to run the relevant code. Check the target repository, base branch, language version, dependency setup, and test command. If private resources are required, configure access through approved mechanisms rather than pasting credentials into the task description.

For the sample, Python's standard library is enough. Use a supported Python 3 installation and a clean directory with contacts.py and test_contacts.py. No network service or production credential is needed. In a real repository, follow its documented environment and instruction files.

Ask the session to establish the baseline before editing: identify the importer entry point, inspect existing tests, run the smallest relevant check, and state any environment blocker. This prevents a later claim of regression from confusing pre-existing failures with new ones.

If dependency installation fails because a private package registry is inaccessible, that is an environment problem. Rewriting the importer will not fix it. If the test command runs and the quoted-name case fails, you have a behavior problem the agent can investigate. Classifying the failure keeps the task focused.

Do not grant broader access merely because the first attempt encounters a setup issue. Determine the missing capability and the narrowest authorized way to supply it. A CSV parser test should not need production database access.

## Create a small baseline example

The intentionally faulty implementation below illustrates the reported bug. Save it as contacts.py only in a disposable learning repository:

~~~python
def parse_contacts(text):
    lines = text.splitlines()
    if not lines:
        return []
    headers = lines[0].split(",")
    return [dict(zip(headers, line.split(","))) for line in lines[1:] if line]
~~~

The function separates physical lines, splits every comma, and pairs values with headers. It does not understand quoted fields. zip also stops at the shorter input, which can hide extra data instead of reporting a malformed row. The function is small, but its assumptions do not match CSV.

Run a tiny reproduction in a Python shell or a temporary script:

~~~python
from contacts import parse_contacts

sample = 'name,email\n"Mallick, Amal",amal@example.test\n'
print(parse_contacts(sample))
~~~

The faulty result will not contain the intended complete name and email pairing. The exact string representation is less important than the mismatch with the contract. Preserve this input as a regression case.

In a real repository, do not replace an existing implementation with this artificial baseline. Locate the actual failure and reproduce it there. The example teaches how to make a bug observable, not how to manufacture a task in production code.

## Give Devin a complete but bounded task prompt

Use this original prompt after selecting the correct repository and branch:

~~~text
Fix the contact CSV importer bug described below. A quoted comma in a name is
being treated as a field separator. Reproduce with:
name,email
"Mallick, Amal",amal@example.test

Inspect the current importer and nearby tests first. Preserve the established
public interface and field values. Use the project's existing parser or a
standard-library CSV parser where appropriate; do not add a dependency unless
the existing stack requires it and you explain why. Cover quoted commas,
escaped quotes, ordinary input, header validation, and missing/extra fields.
Run the relevant baseline and regression checks. Keep the patch focused.
Deliver a reviewable diff, actual command results, and any unverified limits.
Do not merge, deploy, contact customers, or access production data.
~~~

The prompt states the problem, example, scope, implementation preference, checks, deliverable, and authority boundary. It leaves room for the agent to inspect the codebase and choose an idiomatic repair instead of forcing a guessed filename or internal design.

Devin's instruction guide emphasizes context, clear success criteria, existing patterns, and feedback. The prompt applies those principles to a small original case. [Instructing Devin effectively](https://docs.devin.ai/essential-guidelines/instructing-devin-effectively)

## Observe investigation without micromanaging every command

A useful initial report should identify the relevant function, explain why the reproduction fails, and propose a focused repair. Read that explanation against the code. If the agent says the problem is email validation while the evidence shows comma splitting, steer it back to the observed failure.

Look for meaningful baseline evidence. Did the session actually run the reproduction? Did it inspect existing test conventions? Did it discover pre-existing failures? A long transcript of commands is less useful than a clear link between a command and a hypothesis.

Intervene when the scope changes materially. For example, if the agent proposes replacing the entire import subsystem, ask why the small parser repair is insufficient. If it adds trimming, case conversion, or email validation, compare those changes with the contract. They may be reasonable features, but they are not automatically part of this bug.

Do not interrupt merely because the agent uses a different search order than you would. Evaluate whether it is gathering relevant evidence and converging on the task. The value of delegation is letting the session do bounded investigation while you retain judgment over requirements and review.

If the session is blocked, ask for the precise missing condition, what was attempted, and what independent work remains. “Cannot run tests” should become a specific environment explanation, not a vague excuse or a fabricated pass.

## A worked repair using Python's CSV parser

The following complete sample satisfies the tutorial's contract. It is a reference solution for learning and should be adapted to a real repository's interface and error conventions.

~~~python
import csv
import io


def parse_contacts(text):
    if not text:
        return []

    reader = csv.DictReader(io.StringIO(text, newline=""), strict=True)
    try:
        headers = reader.fieldnames
    except csv.Error as error:
        raise ValueError("Invalid CSV header") from error
    if headers is None:
        return []
    if len(headers) != 2 or set(headers) != {"name", "email"}:
        raise ValueError("Expected exactly the headers name and email")

    contacts = []
    try:
        for row in reader:
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"Unexpected field count near line {reader.line_num}")
            if not row["name"] or not row["email"]:
                raise ValueError(f"Empty required field near line {reader.line_num}")
            contacts.append({"name": row["name"], "email": row["email"]})
    except csv.Error as error:
        raise ValueError(f"Invalid CSV near line {reader.line_num}") from error

    return contacts
~~~

csv supplies format-aware parsing; io.StringIO presents the input text as a file-like stream. DictReader uses the header row as field names. The header check rejects duplicates, missing names, and unexpected columns for this sample's two-column contract.

Extra fields are represented under a None key, while missing values can appear as None values. The explicit checks turn those cases into errors instead of silently dropping or inventing data. Required empty fields are also rejected by this tutorial's contract. The function preserves nonempty field contents and does not trim or normalize them.

The exception handler translates a parser error into the sample's public ValueError style while preserving the original cause. Line numbers refer to parser progress and may span multiple physical lines for quoted multiline fields; the word “near” avoids claiming an exact logical-row location.

## Add tests that prove the reported behavior

Save this as test_contacts.py beside the reference solution:

~~~python
import unittest

from contacts import parse_contacts


class ContactParsingTests(unittest.TestCase):
    def test_ordinary_row(self):
        self.assertEqual(
            parse_contacts("name,email\nAmal,amal@example.test\n"),
            [{"name": "Amal", "email": "amal@example.test"}],
        )

    def test_quoted_comma(self):
        self.assertEqual(
            parse_contacts('name,email\n"Mallick, Amal",amal@example.test\n'),
            [{"name": "Mallick, Amal", "email": "amal@example.test"}],
        )

    def test_escaped_quote(self):
        self.assertEqual(
            parse_contacts('name,email\n"Amal ""A"" Mallick",amal@example.test\n')[0]["name"],
            'Amal "A" Mallick',
        )

    def test_multiline_field(self):
        self.assertEqual(
            parse_contacts('name,email\n"Amal\nMallick",amal@example.test\n')[0]["name"],
            "Amal\nMallick",
        )

    def test_bad_headers(self):
        for text in ("name,name\nA,B\n", "name\nA\n", "name,email,team\nA,B,C\n"):
            with self.subTest(text=text), self.assertRaises(ValueError):
                parse_contacts(text)

    def test_bad_field_count(self):
        for text in ("name,email\nAmal\n", "name,email\nAmal,a@example.test,extra\n"):
            with self.subTest(text=text), self.assertRaises(ValueError):
                parse_contacts(text)

    def test_empty_input(self):
        self.assertEqual(parse_contacts(""), [])


if __name__ == "__main__":
    unittest.main()
~~~

Run python -m unittest -v in the sample directory, or use the platform's Python launcher if that is how Python is installed. The expected result is seven passing test methods for the repaired sample. Running against the intentionally faulty version should expose several failures, including the reported quoted-comma bug.

These tests cover meaningful behavior rather than mirroring internal statements. They do not prove every possible CSV dialect, file encoding, file-size policy, or email validity rule. Those limits belong in the handoff. A real project should use its established test runner and add integration coverage only where the bug's actual entry path requires it.

## Inspect the diff before accepting the explanation

Read the patch from the user's behavior backward. Does the importer now use a format-aware parser? Does it preserve the public interface? Does it reject structural errors as intended? Do the tests fail on the old behavior and pass on the repair?

Look for unrelated changes: formatting an entire module, upgrading dependencies, changing error text across the application, or adding normalization. A broad diff increases review cost and can hide regressions. Ask for a smaller patch when the extra changes are not necessary.

Review error handling carefully. A patch that catches every exception and returns an empty list can make the original crash disappear while silently losing contacts. That is not a correct repair. A clear error is often better than a plausible-looking empty import.

Check whether the evidence corresponds to the final code. If tests were run before the last edit, the result may be stale. If the session says “all tests passed,” determine which tests actually ran. A targeted suite can be sufficient for a small change, but the report should name its scope accurately.

Finally, compare with the support scenario. A unit function can pass while the upload route still decodes the file incorrectly. If the real bug crosses decoding, parsing, and persistence, add a representative entry-path check. Do not claim end-to-end resolution solely from an isolated helper test.

## Use handoff deliberately

Devin's current handoff guide documents moving work from the Devin CLI to a cloud session with /handoff, and creating cloud work from other agents through the Devin API. It describes the cloud session as a separate environment with development tools. [Cloud handoff guide](https://docs.devin.ai/work-with-devin/devin-handoff)

For the CSV bug, a handoff packet should include the repository and base branch, failing input, acceptance criteria, relevant files, baseline results, current diff, and remaining work. State whether any uncommitted local files or unpushed commits are required. Verify what the actual handoff mechanism transfers instead of assuming every local state is present remotely.

Use handoff when a longer task benefits from continuing independently or needs an appropriate remote environment. A tiny parser fix may be simpler to finish locally. The availability of cloud execution does not mean every task should use it.

After handoff, ask the receiving session to confirm its starting state and reproduce the failure. This is a cheap way to detect a missing branch, dependency, or fixture before it builds on incorrect assumptions. Preserve one source of truth for the patch so local and cloud sessions do not independently edit the same files without coordination.

## Capture reusable procedures with Skills

Current Devin documentation recommends Skills for new reusable procedures. It describes SKILL.md files and repository discovery, with .agents/skills as the recommended location. The Playbooks guide says new accounts have Skills rather than Playbooks from October 24, 2026. Existing accounts may still expose legacy Playbooks during migration. [Skills](https://docs.devin.ai/product-guides/skills), [Playbooks transition context](https://docs.devin.ai/product-guides/creating-playbooks)

Distinguish a task prompt from a reusable procedure. The task prompt contains this customer's failing CSV example and this bug's acceptance criteria. A reusable procedure explains how to investigate an importer bug: reproduce, inspect the contract, add a regression, make a focused change, run relevant checks, and report evidence.

An original skill body might say:

~~~text
For importer bug fixes:
1. Identify the public entry path and current data contract.
2. Reduce the report to a non-sensitive failing fixture.
3. Establish the baseline with the relevant existing checks.
4. Add a regression for the observed failure and meaningful adjacent cases.
5. Make the smallest idiomatic repair that preserves unrelated behavior.
6. Run the relevant checks on the final patch.
7. Deliver the diff, actual results, compatibility decisions and remaining limits.
Do not use production customer data or silently normalize fields outside scope.
~~~

This is a procedure, not a claim of automatic enforcement. Review a proposed skill like code. Remove stale commands, excessive permissions, and task-specific assumptions before sharing it across a team.

## Recover from failures without restarting blindly

| Failure | Evidence to request | Productive response |
| --- | --- | --- |
| Tests cannot start | Exact command and environment error | Repair the narrow setup issue |
| Agent changes unrelated behavior | Diff and rationale | Reassert the contract and reduce scope |
| Patch hides bad rows | Error-handling path | Require explicit structural failures |
| Claimed pass lacks output | Actual executed checks | Run or label unverified checks honestly |
| Cloud session has wrong code | Branch and commit state | Reconcile the handoff before editing |
| Repeated sessions rediscover setup | Stable environment procedure | Capture a reviewed Skill |
| Agent gets stuck on a hypothesis | Reproduction and observations | Reframe from the failing behavior |

Preserve useful work when a session stalls. A correct reproduction, a baseline result, and a partially useful patch can be handed off. Do not erase evidence simply because the first implementation failed.

If the agent repeatedly proposes the same incorrect repair, provide a counterexample. For example, replacing commas inside quote pairs with a temporary character may fail on escaped quotes or multiline fields. A focused counterexample teaches the missing format requirement more effectively than a general request to “be smarter.”

## Cost, task selection and stopping rules

Check current pricing and available agent configurations in your account. Do not use a vendor's broad task-completion claim as a budget guarantee. The real cost includes investigation, execution, review, corrections, and environment setup.

Choose an initial task with a clear reproduction, a small code surface, and observable checks. This makes it easier to learn whether the workflow is useful. A vague architecture redesign is a poor first measurement because success is difficult to define and review.

Set a stopping rule for unproductive investigation. If several attempts do not improve the reproduction or hypothesis, ask for a concise state report and the smallest unresolved question. You may need a domain decision, a missing fixture, or a human explanation rather than more autonomous execution.

Measure accepted work, not just completed sessions. A session that opens a large unreviewable patch has not delivered the same value as one that produces a small correct repair with clear evidence. Include reviewer effort when comparing [Factory](06-factory.md), [OpenHands](07-openhands.md), [Codex](01-codex.md), and other agent workflows.

## Optional project and completion evidence

Use a disposable repository containing the faulty sample. Delegate the bug with the contract, inspect the investigation, and review the final patch. Then adapt the general procedure into a reviewed Skill while keeping the specific customer example in the task record.

The project passes when the quoted-comma case is fixed, adjacent format cases have meaningful coverage, ordinary input still works, structural failures are explicit, unrelated behavior is preserved, and the final evidence names what actually ran. The handoff should state limits such as encoding, large-file handling, dialect support, and integration coverage when they were outside the task.

If you try cloud handoff, demonstrate that the receiving session has the intended code state and can reproduce the baseline. Do not count a successful session launch as proof that context transferred correctly.

## Assistant prompt for reviewing Devin's result

~~~text
Review this Devin-produced CSV importer patch against the attached task contract.
Check the actual diff and test evidence. Look for quoted-comma handling, escaped
quotes, missing/extra fields, header validation, and ordinary-input compatibility.
Identify unrelated normalization, swallowed errors, stale test claims, or a gap
between the helper test and the real import path. Do not merge or deploy.
Return actionable findings with file references, plus the smallest remaining
verification needed. Treat the agent's summary as a claim to verify.
~~~

## Preserve the learning from the review

After accepting or rejecting the patch, write down the reason in terms of behavior and evidence. “The agent did well” is less reusable than “the quoted-comma regression failed on the old implementation and passed on the focused parser repair.” If review found an untested upload-decoding path, carry that gap into the next task rather than implying the whole import system was verified.

Capture stable setup knowledge in the reusable procedure, keep this bug's fixture with its tests, and leave account-specific operational details in the appropriate environment documentation. This keeps future delegation concise without losing the evidence that made the repair trustworthy.

## Sources and verification limits

Accessed November 13, 2026.

- [Introducing Devin](https://docs.devin.ai/get-started/devin-intro): product surfaces and development-tool context.
- [Your first session](https://docs.devin.ai/get-started/first-run): Ask/Agent workflow, repository setup and current account-option caveats.
- [Instructing Devin effectively](https://docs.devin.ai/essential-guidelines/instructing-devin-effectively): scope, context, criteria and feedback principles.
- [Cloud handoff](https://docs.devin.ai/work-with-devin/devin-handoff): current local-to-cloud paths.
- [Skills](https://docs.devin.ai/product-guides/skills): reusable procedure files and current recommended direction.
- [Creating Playbooks](https://docs.devin.ai/product-guides/creating-playbooks): explicit transition to Skills and new-account date.
- [Python CSV library](https://docs.python.org/3/library/csv.html): DictReader, format handling and parser-error behavior for the independent sample.
- [Python text streams](https://docs.python.org/3/library/io.html): StringIO used by the independent sample.

No Devin service execution or account integration was tested. The Python sample is original and independent of Devin. Its expected checks are described for a learner to run; account-specific environment, pricing and current feature access must be verified separately.
