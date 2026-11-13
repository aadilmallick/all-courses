# 3. AI workflow consulting: sell a decision that survives evaluation

[Previous: cloud-native consulting](02-cloud-native-kubernetes-and-platform-consulting.md) · [Contents](../README.md) · [Next: high-value services](04-high-value-offers-sales-and-delivery.md)

## The client does not need an agent by default

Harbor Software receives internal support requests and wants an AI system to route them, summarize the context, and perhaps take action. The founder has seen a convincing demonstration. The engineering lead is concerned about mistakes and operating cost. Your consulting job is to establish which part of the workflow should change, how success will be measured, and what authority the system should have. Choosing a model or orchestration framework comes after those questions.

An AI workflow can be a useful service opportunity for you because your resume describes structured-output experiments, evaluation metrics, Python services, and practical AI applications. The strongest connection is your ability to test whether a proposed feature works under defined conditions. That is more defensible than selling generic “AI transformation.” Your research result on one dataset does not predict another customer's workflow accuracy, and a published article does not establish that a production agent can act safely in every environment.

Begin with a bounded offer: evaluate one workflow, compare a simple baseline with a candidate approach, analyze the failures, and recommend a deployment boundary. Implementation can follow if the evidence supports it. The buyer receives value even when the recommendation is to keep a human step or use deterministic code. This is how you turn AI enthusiasm into a professional consulting engagement rather than a demo project whose risks appear after the invoice.

## Map the actual work before proposing automation

A workflow has an event that starts it, inputs, decisions, actions, exceptions, and an owner. Harbor's event is a new internal request. Inputs include the message, permitted account context, and a small set of documentation. The first decision is which team should review it. The action might be a draft route recommendation, not an actual transfer. Exceptions include missing information, conflicting signals, and requests requiring a person with special authority.

Draw the boundary around one useful result. “Improve internal support” is broad. “Suggest one of three routing categories for eligible English-language requests, show supporting context, and send uncertain cases to a reviewer” is testable. Define eligibility before measuring accuracy. If the workflow excludes attachments, other languages, or privileged actions, record that explicitly. The exclusion may be sensible for a pilot, but the customer should not discover it after interpreting a headline score as universal performance.

Then observe the current process. How many requests arrive? How long does routing take? What mistakes occur today? Which errors are costly and which are easy to correct? A system that saves thirty seconds while adding two minutes of checking may not improve the workflow. A system that drafts a useful summary while leaving the decision with a person may be valuable even without automation. The business question determines the correct comparison.

## Separate deterministic automation, AI workflows, and agents

Deterministic automation follows explicit rules. It can validate a form, map a known code to a team, or call an API after a clear event. An AI workflow uses model-generated interpretation or content within a largely defined process. An agent gives a model more discretion over steps or tool use. These are useful distinctions, not a universal taxonomy. Anthropic's engineering guidance distinguishes predefined workflows from systems where a model directs more of its own process, and recommends matching complexity to the task. [AGENTS](../references.md#agents)

At Harbor, an explicit department field may solve most routing without AI. A model may help when users write free-form requests. An agent that searches multiple systems and changes records is a much larger responsibility than a classifier. Start with the least complex method that can meet the requirement. Complexity creates more places for latency, cost, uncertainty, and side effects. It should earn its place through evidence rather than the marketing appeal of the word agent.

Your first diagnostic can compare three approaches: a form or rules improvement, a constrained model recommendation, and a more involved workflow with retrieved context. The output is a recommendation supported by representative cases. You do not have to implement every alternative fully to compare them, but you must distinguish a tested result from an architectural hypothesis. A diagram of a possible agent is not evidence that the agent improves the customer's work.

## Define correctness before looking at outputs

An evaluation set is a collection of inputs with enough reference information to assess behavior. For Harbor's routing task, each case needs an input, a reference category or acceptable categories, relevant constraints, and a record of why the reference is appropriate. A human owner should approve the labeling criteria. If two experienced staff disagree about the correct route, the ambiguity belongs in the workflow design; it should not be hidden as a model error or silently resolved by the consultant.

Separate development examples from held-out evaluation cases. If you repeatedly change the prompt to match the same ten examples, performance on those examples becomes less informative. A held-out set provides a less contaminated check, although a small set still has substantial uncertainty. Use actual approved examples when possible, with appropriate handling and minimization. The supplied companion uses synthetic fixtures because it must run offline without customer data or credentials.

Create categories of cases, not only easy examples. Include ordinary requests, missing details, contradictory context, unusual phrasing, unsupported requests, and attempts to redirect the system. Also include important subgroups in the actual scope. A single overall score can conceal failure on a rare but consequential category. The purpose is not to manufacture a large test count. It is to make the system's meaningful boundaries visible before deployment.

## Understand several different kinds of evaluation

A schema check asks whether an output has the required structure and allowed values. A correctness check asks whether the content or decision is appropriate. A grounding check asks whether a factual claim is supported by the available evidence. A permission check asks whether an action is allowed for this user and workflow. A usefulness check asks whether the result actually helps the person doing the job. Passing one does not imply passing the others.

Suppose a model returns a perfectly valid object with category technical and a confident explanation, but the request is about an invoice. The schema is valid and the decision is wrong. Suppose it routes correctly but includes another customer's private context in the explanation. The category score is good, but the workflow is unacceptable. Suppose it produces an accurate summary that a reviewer must rewrite completely because it is too long. Factual correctness alone does not establish usefulness.

Use several evaluation methods proportionately. Deterministic checks can verify formatting, permitted categories, and exact expected behavior on narrow tasks. Human review is useful for judgment and ambiguity. Model-based judges can help scale some assessments, but they introduce their own error, bias, cost, and consistency questions. LangSmith documents multiple evaluator types and dataset/experiment workflows; using an evaluation product does not decide which criteria matter for the customer's task. [EVAL](../references.md#eval)

## Trace a small routing evaluation by hand

The included fixture contains twelve synthetic cases with reference categories, candidate categories, scores, and a permission flag. These are simulated candidate outputs, not calls to a real model. Some outputs are intentionally wrong or invalid. A threshold decides which valid, permitted recommendations are accepted automatically in the teaching model; everything else goes to review. The score is an artificial signal, not a calibrated probability. The experiment demonstrates evaluation mechanics and tradeoffs.

Suppose six recommendations are accepted automatically and five are correct. Automatic precision is five divided by six, or about 83.33 percent. Coverage is six divided by twelve, or fifty percent. Those two numbers answer different questions. Precision describes accepted decisions; coverage describes how much work avoids review under the policy. Reporting “83 percent accurate” without the denominator and routing policy would conceal half the workflow and one automatically accepted mistake.

If you raise the threshold, fewer recommendations may be accepted. Precision may improve, worsen, or remain unchanged depending on which cases remain. It is not mathematically guaranteed to improve on a small dataset. If every case goes to review, automatic precision is undefined, not one hundred percent. The companion displays that state explicitly. A policy that accepts nothing can be cautious, but it does not establish successful automation.

## Include asymmetric error costs

Not every incorrect decision has the same consequence. Misrouting a low-priority documentation request may cost a few minutes. Automatically changing access or sending a message to the wrong recipient can be much more serious. Define the actions and consequences before combining them into a score. A high overall accuracy can be commercially unattractive if the rare errors are expensive. Conversely, a lower-coverage draft assistant may be useful when a reviewer can catch mistakes efficiently.

A simple effort model starts with the current manual time. Twelve requests at four minutes each require forty-eight minutes. Suppose the policy accepts six automatically and sends six to review. If each review takes two minutes, automatic handling costs a quarter-minute per accepted case, and each wrong automatic decision creates twelve minutes of rework, then five correct and one wrong accepted recommendation produces modeled effort of twelve plus one and a half plus twelve, or 25.5 minutes. The modeled saving is 22.5 minutes.

This example assumes that reviewed cases are resolved correctly and that all rework is captured in twelve minutes. Those assumptions are not observations. Change them when the actual workflow differs. The model also omits many possible impacts, such as delayed work and customer frustration. It is useful for seeing how checking and rework can erase apparent savings, not for declaring the system profitable from a small synthetic sample.

## Treat model confidence carefully

A model's statement that it is confident is not necessarily a reliable probability of correctness. Even a numerical score can be poorly calibrated or vary across tasks. If a system uses a threshold, evaluate how that threshold behaves on representative cases and monitor it after changes. Do not tell a customer that a score of 0.9 means a ninety percent chance of being right unless that interpretation has been established for the actual system and use case.

The companion uses fixed synthetic scores to make the tradeoff visible. It does not teach that every workflow should ask a model for a confidence number. Other routing signals may include deterministic checks, agreement between independent evidence, required fields, retrieval quality, or an explicit unsupported-case rule. These signals also need evaluation. The important idea is selective action based on a tested policy, not faith in one convenient number.

When no policy achieves a useful balance, keep the system as a draft aid or do not deploy it. That can be the right consulting conclusion. The fee is justified by helping the buyer avoid a weak implementation and identify what evidence or process change would improve the decision. You do not need to force the experiment into a success story to demonstrate value.

## Run the supplied evaluation harness

From the extracted package root, run the following with Python 3.10 or newer:

```bash
python examples/evaluate_workflow.py --threshold 0.80
python examples/evaluate_workflow.py --threshold 0.95
python examples/evaluate_workflow.py --self-test
```

The script reads the included synthetic JSON fixture, checks category validity and permission before applying the threshold, and reports accepted decisions, correct decisions, wrong automatic decisions, review count, coverage, and precision. It does not call a model, send a message, modify customer systems, or benchmark a provider. The browser companion uses the same fixture and policy so you can compare results interactively. Verification checks their agreement.

The core decision is intentionally small. First, reject automatic acceptance when the output category is outside the allowed set. Second, reject it when the permission flag is false. Third, compare the artificial score with the chosen threshold. Only then count correctness against the reference. This order demonstrates that permission is independent of confidence. A very confident recommendation does not gain authority merely because the model appears certain.

Inspect the full source in `examples/evaluate_workflow.py` and the shared fixture in `examples/routing-cases.json`. The browser implementation is in `companion/core.mjs`. These are complete local programs, while any production model integration discussed later is an architectural example. No API keys or third-party packages are needed for the supplied experiments. That keeps the learning result reproducible and prevents a hidden paid dependency from becoming part of the lesson.

## Add retrieval only when a knowledge source is needed

Retrieval-augmented generation supplies selected external content to a model. It can help when a task depends on documentation or records that are not reliably available in the model's parameters. It introduces a pipeline: choose eligible sources, index or query them, retrieve relevant content, construct context, generate an answer, and evaluate the result. Each stage can fail independently. A correct-looking answer does not prove that retrieval found the right material.

At Harbor, routing may need only the message and a short category definition. A documentation-answering assistant may need retrieval. Evaluate retrieval separately where useful: did the relevant source appear, was it current, and was the user allowed to access it? Then evaluate whether the answer is supported by that source. If the relevant document was never retrieved, rewriting the final prompt may not fix the dominant problem. Diagnosis should follow the actual evidence path.

Preserve source identity and version when possible. An answer about a product setting may become wrong after the product changes. A customer may also have different entitlements or policies than a public example. Record what the system knew at the time and how updates are handled. Your consulting deliverable should include the knowledge boundary and maintenance responsibility, not merely a successful demo against one curated document.

## Keep authorization outside the model's imagination

Authorization determines which data and actions a user or service may access. It should be enforced by trusted application logic and the underlying systems, not by a model's promise to behave. A prompt can describe rules, but it is not a substitute for permission checks. If the workflow retrieves customer records, the retrieval path must respect the user's allowed scope. If it proposes an action, a trusted executor must validate that action before performing it.

Untrusted content can contain instructions intended to redirect the model. A support message, web page, or retrieved document is data to interpret, not authority to change the system's rules. Prompt injection and excessive agency are related but distinct concerns: one affects behavior through inputs, while the other concerns the capabilities and autonomy that make a mistaken output consequential. OWASP's current and historical materials discuss these risks; the source ledger records the edition rather than relying on a remembered risk number. [OWASP](../references.md#owasp)

A practical pilot boundary is read-only context and draft recommendations, with a human approving any consequential action through an explicit interface. That is not a guarantee of safety, and human review can fail too. It reduces the authority exposed while you evaluate the workflow. If the customer later wants automatic action, that is a new decision requiring stronger evidence, permission design, monitoring, and recovery.

## Design tool actions as bounded requests

A tool is an application function the workflow can ask to execute. Good tool design makes the intended action explicit and validates inputs. Instead of a broad “run arbitrary command” capability, an internal support workflow might expose a narrow function that drafts a routing suggestion for an eligible request. The trusted executor checks the request identifier, user's role, allowed category, current state, and any approval requirement. The model does not decide those permissions for itself.

Separate planning from execution. A proposed action can be displayed with its inputs and expected effect. An authorized person approves it, and the executor performs the validated operation. Record the result with a stable identifier. If the state has changed since the proposal, revalidate rather than applying stale instructions. A polished conversational interface should not hide the difference between an idea and an executed change.

Your proposal must describe the action boundary in ordinary language. “AI workflow pilot” is too vague if the buyer assumes it will send messages and your design only drafts them. Say exactly what is automatic, what requires review, what systems are connected, and what is excluded. This is both a product design requirement and a commercial scope requirement. It prevents the largest misunderstandings before implementation starts.

## Understand retries, duplicates, and persistence

A workflow can fail after an external action succeeds but before its result is recorded. Retrying the entire step can then repeat the action. This is why a production workflow needs a strategy for side effects, often using stable operation identifiers and idempotent operations where supported. Persistence records progress, but persistence alone does not make every external action safe to repeat. The design must connect state transitions to the actual side-effect semantics.

For Harbor, a routing recommendation can be saved under the request identifier and policy version. If a later step creates a ticket, the system needs to know whether the ticket already exists or whether the provider supports an idempotency key. The exact implementation depends on the provider. Do not invent a universal “exactly once” guarantee. A useful diagnostic asks what happens after a timeout at each boundary and how an operator can reconcile an uncertain result.

LangGraph's persistence documentation distinguishes thread state from longer-lived stores and discusses continuation and recovery use cases. A framework can help implement stateful behavior, but it does not remove the need to reason about external side effects, approval, tenancy, and retention. Use a framework when it makes the required process clearer and more maintainable. A small explicit workflow may be preferable when the state machine is simple. [STATE](../references.md#state)

## Plan tracing and data handling together

A trace records the steps involved in a request. For an AI workflow, it can include the input category, retrieved source identifiers, model and prompt version, validation result, route decision, latency, and cost estimate. These details help explain failures and compare experiments. They can also expose sensitive information if payloads are copied indiscriminately. Decide which fields are necessary and who may access them before enabling broad tracing.

The customer's data boundary matters. A hosted evaluation or tracing service may process data in a particular region or under particular retention terms. Verify the actual account configuration and contract instead of assuming a product name establishes compliance. For the first diagnostic, synthetic or redacted cases may be sufficient to answer part of the question. State where that limits realism and what further approved evidence is needed before production.

Your documentation can include a data-flow table: source, fields, purpose, destination, retention, and owner. This table makes hidden integrations visible and supports a useful conversation with the customer's reviewers. It is not a legal certification. If the workflow touches specialized regulated information, involve the appropriate customer owner or qualified specialist. Your role is to make the boundary explicit and implement the agreed design within your competence.

## Evaluate latency and cost at workflow level

A single model request price does not determine workflow cost. Count the number of calls, input and output size, retrieval or tool usage, retries, evaluations, storage, and human review. Latency also accumulates across steps. A multi-step agent may be impressive while taking longer than the user's original task. Measure end-to-end behavior on representative cases and include error paths, not only the fastest successful demonstration.

Suppose a synthetic design uses two model calls per request and occasionally retries one. You cannot estimate cost accurately by multiplying the price of the first call by the number of requests. Write the workflow's expected operations and inspect real usage under an approved test. Provider prices and billing details change, so this book does not freeze a model price or promise a particular margin. The consulting method is stable even when the product economics change.

Include a spending boundary in a pilot. Limit eligible requests, maximum steps or calls, permitted tools, and the response to repeated failure. A loop that keeps retrying without a useful stop condition can create cost and operational problems. The budget is part of the product behavior, not merely an invoice setting. When the workflow cannot finish within the boundary, it should produce a clear state for a person to handle.

## Build a pilot with a genuine go/no-go decision

A pilot should answer whether a specific workflow is useful enough to advance. Define the audience, eligible cases, baseline, evaluation set, permitted actions, quality criteria, operating cost, and review process. Decide in advance what counts as success, failure, or insufficient evidence. This prevents the team from redefining success after seeing a polished demo. It also gives you a clear handover and acceptance standard.

For Harbor, the pilot could produce routing recommendations for a fixed set of approved cases, compare them with reference labels, and estimate review effort. It could remain entirely offline. If the results are promising, a later shadow phase might observe recommendations without affecting the real routing process. Only after sufficient evidence and approvals would the team consider limited automatic routing. Each phase changes the risk and evidence requirements.

Do not sell the pilot as proof of production performance. A fixed dataset can miss changes in language, request mix, users, source documents, and provider behavior. A real deployment needs ongoing monitoring and a way to pause or revert the new behavior. Your report should state what the pilot demonstrated and what it did not. Honest limits make the next decision better; they do not make the work less professional.

## A concrete AI consulting offer for you

A useful draft is the AI Workflow Evaluation Diagnostic: “I help small software teams decide whether one AI workflow is ready for a controlled pilot. We define the task, compare a baseline and candidate approach, inspect the failures, and recommend the right level of automation.” This fits your structured-output and metrics background more directly than promising a general autonomous workforce. The buyer is an engineering lead, product lead, or agency with a real workflow and an owner.

A provisional scope could include one task, a small approved evaluation set, labeling criteria, a baseline, one candidate approach, an error taxonomy, a permission/data-flow review, and a decision memo. A test price of $2,000–$4,000 may be worth validating when the total effort and buyer value support it. It is not a market average or a claim that you can command the fee immediately. If the dataset needs substantial labeling or integrations, scope those separately.

The next phase might be a $7,500–$15,000 controlled implementation only after the requirements and evidence justify it. Include a narrow action boundary, monitoring, failure recovery, and handover. If you cannot demonstrate the necessary capability, involve a qualified partner or reduce the promise. High-value AI consulting is not produced by attaching a large price to a chatbot. It comes from helping the customer make and execute a better decision under uncertainty.

## An error-analysis walkthrough

Suppose Harbor's candidate routes several billing questions to technical support because they mention an API. Do not immediately add a long prompt rule for every observed phrase. First inspect the category definitions. Perhaps a request can legitimately involve both teams, and the real decision is who should own the first response. Clarify that policy with the customer. Then inspect whether the input contains enough information to follow it. Some failures are product-definition problems rather than model weaknesses.

Next group errors by mechanism: ambiguous label, missing context, unsupported case, invalid structure, misleading context, or unauthorized action proposal. Estimate how often each appears in the representative data and how costly it is. A small deterministic precheck or clearer form field may address a large category. A more expensive model may not. The recommendation should follow the failure pattern rather than the assumption that better AI always means a larger model.

After making a change, rerun development cases and the held-out evaluation. Compare the same policy and record version changes. A change that fixes one subgroup can damage another. If the overall average improves while a critical subgroup worsens, the decision needs judgment. Present the tradeoff clearly. This is where your mathematical background helps: not by displaying advanced notation unnecessarily, but by making denominators, assumptions, and uncertainty explicit.

## Use coding assistants as helpers, not evidence generators

A coding assistant can help create a test harness, organize a schema, draft evaluation code, or review a proposed state machine. Give it the approved context, constraints, and expected verification. Ask it to identify assumptions and distinguish executed checks from suggested ones. Do not accept a generated report saying “production ready” without inspecting the underlying evidence. The phrase is not a test result.

A useful prompt is: “Using these synthetic cases and the stated routing policy, implement a deterministic evaluator that reports accepted precision and coverage separately. Invalid categories and disallowed actions must go to review before the score threshold is considered. Handle an empty accepted set without inventing a precision value. Include tests for threshold boundaries and denied actions. Do not call external APIs or send messages.” This prompt defines a real task and a verification obligation.

Another prompt can review the proposal: “Find claims that exceed the supplied evidence, unclear action permissions, missing recovery behavior, and costs excluded from the operating model. Suggest specific scope edits. Do not invent a legal assurance or claim that a prompt prevents all injection.” The assistant is helping you reason. You remain accountable for the recommendation and for the customer's approved data use. No prompt in this book has been sent to a customer's system.

## Finish with a decision memo the buyer can use

The memo should state the task, current baseline, evaluated cases, candidate design, quality results, important failure categories, cost and latency observations, permission boundary, and recommendation. Separate measured results from modeled economics and untested architecture. If the only executed evaluation used synthetic fixtures, say so prominently. That result teaches a method but does not justify claims about a real buyer's data.

A sample conclusion could be: “The candidate is useful as a draft routing aid on the evaluated eligible cases, but the evidence does not support automatic action for the ambiguous category. We recommend a controlled reviewer-assisted pilot, clearer labeling rules, and a separate evaluation of unsupported requests before widening coverage.” The buyer can decide whether that next step is worth funding. The recommendation does not have to be fully autonomous to be valuable.

The next chapter turns these technical patterns into commercial offers. You will choose one buyer and problem, design a paid diagnostic, calculate sustainable pricing, find suitable accounts, run discovery, and deliver a larger engagement without letting the phrase high ticket replace evidence. Your strongest path combines the engineering ability to test a system with the communication ability to make the result understandable and useful.

## When a pilot fails commercially despite looking accurate

Imagine that a routing assistant achieves a strong category score but users still need to open every request, read the original message, and verify the same context. The model may be accurate while the workflow saves little time. Observe the review task rather than assuming that accepted precision equals productivity. A shorter summary, clearer evidence display, or better intake form may be more valuable than a higher model score. The user experience is part of the consulting problem.

Another pilot may save time but depend on an expensive manual labeling process that nobody plans to maintain. A third may rely on a document source that changes weekly without an owner. These are operating-model failures, not necessarily model failures. Include maintenance, evaluation updates, and reviewer responsibilities in the recommendation. A sustainable workflow must remain useful after the consultant's curated demonstration and personal attention are gone.

Finally, a buyer may have no authority to use the proposed data or no person accountable for actions. Stop that part of the implementation and clarify the boundary. You can still deliver the diagnostic findings and a plan for resolving the decision. Professional consulting is allowed to conclude that the next step is organizational rather than technical. A clear, evidence-based stop can protect the customer's resources and establish trust more effectively than shipping a feature nobody can responsibly operate.

## Human review needs its own design and evidence

A review gate is useful only if the reviewer can make a meaningful decision. Show the original request, the proposed category or action, the relevant evidence, and what accepting it will do. Avoid a large approve button beside an explanation that hides the underlying inputs. A person who is rushed, overloaded, or unable to inspect the context may simply endorse the model. Keeping a human in the loop is a workflow choice to evaluate, not a universal assurance.

Measure review effort and disagreement in the actual task. If a person corrects a recommendation, record the reason using a small, understandable taxonomy. Some corrections reveal a model error; others reveal an unclear organizational policy or a reference label that needs revision. Preserve that distinction. Otherwise the team may train or tune toward inconsistent judgments and believe the evaluation is becoming more precise when it is merely accumulating labels.

Define who is eligible to approve which actions. A support reviewer may be allowed to route a request but not change account permissions. A model-generated explanation does not expand that authority. The trusted application should enforce the same boundary regardless of whether the proposal came from a person, a model, or a scheduled workflow. If an action requires a second reviewer or a different role, the interface and executor must respect that requirement.

The companion's effort calculation assumes that reviewed cases are corrected, and it displays that assumption beside the result. This is a simplification for learning the arithmetic. In a real engagement, estimate reviewer error and escalation behavior where they materially affect the decision. You may need a smaller scope, a different task, or a shadow phase to obtain the evidence. A conservative assumption should be stated explicitly rather than presented as an observed operational fact.

## Version the decision policy, not only the prompt

A workflow result depends on more than the model and prompt. Category definitions, retrieval sources, allowed tools, validation rules, threshold settings, and reviewer instructions can all change behavior. Give an evaluation run a record of those components. If a later result differs, the team can identify which decision changed instead of blaming a mysterious AI regression. This is ordinary engineering traceability applied to a probabilistic component.

For Harbor, a policy record might identify routing definitions version one, the approved source snapshot, the candidate output format, the acceptance threshold, and the rule that disallowed actions always go to review. The supplied fixture demonstrates that final rule with a high-scoring denied case. Increasing confidence never overrides the permission flag. That small example is worth understanding because it separates statistical usefulness from authority, two questions that are often blurred in enthusiastic agent demonstrations.
