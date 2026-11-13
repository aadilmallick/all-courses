# 08 — Integrating Atlas Desk and taking a desktop product to market

[Previous](07-distribution-signing-stores-and-updates.md) · [Course index](../README.md)

**Planned workload: 80 hours.** Product scope and customer evidence 10; final capstone integration 20; onboarding, documentation and support 15; positioning, demonstration and launch assets 15; launch experiment and engineering review 20. Capstone work already performed in chapters 01–07 is not counted again here.

## 1. A useful product is a constrained promise

“An agent that does everything” is difficult to explain, test and support. A useful first product solves one recognizable workflow well. For Atlas Desk, consider independent developers who want a reviewable assistant for understanding a repository, drafting changes and preserving project context. That audience matches your developer and teaching strengths without assuming a market has already been validated.

The initial promise might be: “Inspect a local project, ask focused questions and review every proposed file change from one desktop workspace.” This promise implies concrete engineering requirements: a workspace grant, readable context sources, tool visibility, diff review, local history and reliable cancellation. It does not require every integration in the agent ecosystem on day one.

Your broader interests in DevOps, cloud tools and education provide several possible positioning hypotheses. A repository onboarding assistant could suit developers. A runbook investigation assistant could suit platform teams. A study companion could suit learners. Choose one for an initial experiment and collect evidence. Do not turn personal familiarity into an unsupported claim that every customer will pay.

The rest of this chapter presents original product reasoning and example numbers. It does not claim guaranteed revenue, platform reach or store approval. Marketing becomes more effective when the product's behavior is demonstrable and its limitations are explained clearly.

## 2. Write a product contract before adding features

A product contract names the target user, triggering situation, promised outcome and constraints. For example: a developer opening an unfamiliar repository wants a map of important files and a reviewed onboarding note. The app should read only the selected workspace, explain source files used and save an approved note. The user should be able to stop the process and reopen the conversation later.

Translate this into acceptance criteria. Starting a run should produce visible progress. File reads should remain within the workspace. Proposed writes should display a diff. Approval should bind to the exact proposal. The local transcript should survive restart. No network should be required merely to inspect past local work.

Keep baseline, advanced and channel-dependent features separate in the contract. Voice, multiple providers, local models, MCP, scheduling and enterprise policy can be advanced additions. A Mac App Store edition may need reduced local execution. Distinguishing these categories prevents “complete product” from becoming an unbounded list that cannot be released.

Use [the capstone contract](../reference/capstone-contract.md) as the technical checklist. It is an implementation specification for the learner, not a claim that the small companion already fulfills every commercial requirement. The companion is a runnable teaching reference for core boundaries and lifecycle.

## 3. Integrate by user journeys

A vertical integration pass follows a real user from installation to a useful saved result. Start from a fresh machine or clean profile, install the correct artifact, launch, choose a workspace, configure a provider, run a task, review approval, save output, quit and reopen. This sequence exposes gaps that isolated feature demos miss.

Do the same journey without an account. A guest should understand which local functions are available and which cloud services need login. If your product requires an account for everything, justify that choice and explain the network dependency honestly. Do not let a remote sign-in widget prevent access to existing local data accidentally.

Repeat with a denied permission, disconnected provider, locked secret store and cancelled checkout. These should lead to clear states rather than a blank window. A first-run failure is still a user journey; it deserves design and testing.

Finally follow an upgrade journey from the previous candidate. Verify data migration, credential continuity, native registration and update ownership. A product is not ready because its latest clean installation works if existing users cannot update safely.

## 4. Onboarding should reach a visible result

Ask for the minimum needed to complete the first useful task. A user should not configure five providers, enable every permission and choose a subscription before seeing what the app does. Offer a sample workspace and deterministic demo so they can understand the workflow without immediately sending private files to a provider.

Make provider choices understandable. Explain hosted versus bring-your-own-key versus local runtime, including who processes data and where costs arise. Do not hide a paid provider requirement behind a generic “Continue” button. If the user chooses a local model, show download size and hardware requirements based on the actual model distribution.

Request permissions at the point of use. Microphone permission belongs to voice input, screen capture belongs to a capture action and workspace access belongs to choosing a workspace. A denied permission should disable the related feature gracefully. Keep a settings route for revisiting choices.

An onboarding success event should represent a meaningful outcome: a completed task with a saved result, not merely a window opening. Measure the time to that outcome with synthetic or consented telemetry, and inspect where users stop. A smaller number of steps is helpful only if the remaining steps are clear enough to succeed.

## 5. Documentation is part of the interface

Write installation instructions for each supported platform and distribution channel. Show how to verify the expected publisher and what a normal first launch looks like. Avoid asking users to disable operating-system security controls as routine setup. If a development build requires special handling, label it as a development build.

Write a provider setup guide with exact key scope, storage behavior and revocation instructions. Explain whether the app retains prompts, sends files automatically or keeps memory across sessions. “Privacy-first” is too vague to answer these questions. Prefer concrete statements that the implementation can substantiate.

Create a troubleshooting guide organized by symptoms: browser did not return, sign-in did not persist, model unavailable, workspace unreadable, update failed and tool outcome uncertain. Each entry should show safe diagnostic steps and what information support needs. Do not instruct users to paste secret tokens or private source files into public issues.

Write an uninstall and export guide. Users should know which data remains on the device, how to remove it and how to export valuable work. A clear exit route reduces fear when trying an agent app with local access.

## 6. Positioning through concrete workflows

A landing page should answer who the product helps, what task it improves, how control works and how to try it. Lead with a visible outcome. “A secure Electron-based multi-agent orchestration platform” describes implementation categories; “Review an assistant's proposed repository changes before anything is written” describes a user decision.

Build proof around the workflow. Show a short recording of selecting a sample repository, asking a focused question, inspecting sources and approving a note. Display interruption and recovery when relevant. Trust comes from seeing control and results, not from claiming that the model is autonomous.

Differentiate on a narrow dimension you can maintain. Examples include reviewable local actions, useful offline history, simple provider switching or strong developer workflow integration. Do not claim a competitor lacks a feature without current evidence. A competitor comparison can describe your tested workflow and link to the date and source of any external facts.

For a store page, follow the platform's current metadata guidance. Apple's [product page guidance](https://developer.apple.com/app-store/product-page/) emphasizes clear names, useful descriptions and recognizable assets. Our original marketing advice is to make each screenshot demonstrate one task rather than fill it with decorative slogans.

## 7. A worked landing-page draft

The following is a **draft for learner adaptation**, not a published claim:

> Atlas Desk helps developers understand a local repository and review an assistant's proposed changes in one workspace. Choose the folder, inspect the files used as context and approve each write before it happens. Conversations and drafts stay available on your device. Connect your preferred supported provider when you want a live agent run.

This draft names the audience, task, control and network requirement. Before publishing it, confirm the implementation supports every sentence. If memory is cloud-synchronized, do not imply all content remains local. If a tool can write without individual approval under a persistent grant, explain that policy rather than displaying a contradictory promise.

A supporting section could show three steps: choose a workspace, inspect a proposed action and save a reviewed result. Link to a privacy explanation, platform requirements and pricing. The call to action should lead to the right artifact for the user's OS while offering explicit alternate downloads.

A pricing page should explain included functionality, model-cost ownership, usage limits and cancellation. A low headline price with undisclosed inference charges creates support and trust problems. Keep enterprise inquiry and self-service purchase routes coherent with the same entitlement model taught earlier.

## 8. Demo videos that explain a desktop workflow

A short demonstration needs a task, a visible change and a result. Begin with the user's problem, then show the relevant interface action. Avoid a long animated logo intro before the viewer understands the product. Use a synthetic repository with readable filenames and no private information.

A 60–90 second script can contain: the task in one sentence; opening a sample workspace; asking for an onboarding note; showing the file sources and proposed diff; approving the write; and reopening the saved result. The exact duration is a creative choice, not a platform algorithm guarantee.

Record at a readable resolution with deliberate cursor movement and minimal unrelated windows. Zoom only when it helps someone read a small control. Add captions for spoken explanation and avoid relying on music or tiny text to convey essential meaning. Keep on-screen claims synchronized with actual behavior.

For your developer brand, combine teaching with a product demonstration. A post explaining why browser login uses a system browser can introduce the app's implementation. A short clip showing a rejected stale approval demonstrates an engineering principle and a product control. This creates content you can substantiate instead of repeating generic launch hype.

## 9. Channel hypotheses and distribution experiments

LinkedIn, technical YouTube videos, developer communities, a documentation site and a mailing list are possible channels. Choose one or two based on where the initial audience already discusses the workflow. LinkedIn supports professional posting and video; see its [official overview](https://www.linkedin.com/help/linkedin/answer/a548441). This does not establish any guaranteed reach or optimal posting schedule.

For an initial experiment, publish a focused technical explanation with a real demo, link to a page for that workflow and invite qualified users to try it. Measure installation and activation rather than impressions alone. A viral post attracting people outside the target audience may produce fewer useful users than a smaller specialist discussion.

Make outreach specific and consensual. Ask people already interested in the problem whether they would like to test a workflow; do not scrape contacts or send mass unsolicited pitches. In this course, outreach drafts are prepared assets. No messages are sent and no public launch is performed automatically.

Use community rules and current platform requirements when actually posting. A useful contribution should stand on its own even if someone never downloads the app. Showing an implementation lesson, open example or honest failure analysis often gives a technical audience more reason to trust you than a list of superlatives.

## 10. Funnel measurement without collecting private prompts

A simple funnel is visitor, download, install, first launch, configured workspace, first completed task and retained use. Give each event a precise definition. A download does not prove installation, and an app opening does not prove activation. Avoid joining sensitive activity to marketing identifiers unless the product truly needs it and the privacy policy supports it.

For a hypothetical cohort of 1,000 qualified visitors, suppose 200 download, 140 launch and 56 complete the first useful task. Visitor-to-activation is 56/1,000, or 5.6%. Launch-to-activation is 56/140, or 40%. These are example numbers for reasoning, not market benchmarks.

If the largest loss is between launch and activation, buying more traffic may only amplify an onboarding problem. Inspect provider setup, permission confusion, crashes and unclear example tasks. If activation is healthy but retention is weak, investigate whether the task recurs and whether results are useful enough to return.

Segment by platform and acquisition source without overinterpreting tiny samples. A Windows installer failure can disappear in an aggregate dominated by Mac users. A few enthusiastic friends are helpful feedback but not proof that an unfamiliar audience can install and use the app independently.

## 11. Pricing and agent economics

Desktop software with hosted inference has ongoing cost. A one-time license can work for local functionality or bring-your-own-key usage, but unlimited lifetime hosted generation can create an unsustainable obligation. Tie pricing to the cost structure and user value rather than copying another app's plan names.

A hypothetical calculation illustrates the issue. At a $20 monthly price, with $2 average processing and infrastructure cost, $5 model/sandbox cost and $3 allocated support cost, contribution before acquisition and other overhead is $10. If heavy users cost $30 in model usage, that segment loses money even though the average dashboard looks healthy.

Separate subscription access from metered hosted resources when appropriate. Explain budgets and enforce them server-side. Let users understand what happens at a limit: pause, purchase credits, switch provider or continue with local features. Surprise automatic charges are a product risk even when technically possible.

If you implement usage-based billing, check the processor's current recommended product and API. Stripe's [usage billing documentation](https://docs.stripe.com/billing/subscriptions/usage-based) changed its product guidance in the research snapshot. This course's cost ledger is an internal design exercise, not a promise that a particular vendor API remains the preferred route forever.

## 12. Support operations and user trust

Create a support workflow that begins with app version, platform, distribution channel and safe diagnostic ID. These identify many installer and update problems without requesting private content. Offer a support bundle preview and redact credentials before export. Make it possible to report an uncertain tool outcome without exposing the entire conversation.

Define severity by user impact. Data loss, unauthorized execution and failed updates deserve immediate attention. A cosmetic issue can wait. Keep a process for pausing rollout, communicating status and shipping a verified fix. Good support depends on the release evidence from chapter 07.

Publish a clear model-data explanation. Users need to know whether their provider receives selected files, whether your server proxies requests and what telemetry is optional. Technical architecture and privacy copy must agree. A local Electron shell does not imply that the model runs locally.

Plan account deletion and subscription cancellation as normal flows. Confirm what happens to local history, synchronized data, memory and recurring jobs. A cancelled subscription should not leave scheduled paid calls running under stale entitlements. Your backend and desktop must converge on the same lifecycle.

## 13. A concrete 30-day launch experiment

During the first week, interview a small number of suitable developers and observe their current repository onboarding workflow. Capture exact tasks and friction, with permission. Convert repeated observations into a narrow scenario and revise the product contract. This is research work, not an invitation to promise features you have not built.

During the second week, run a private beta with a signed artifact on your supported platforms. Watch installation and first task completion. Fix critical confusion and reliability issues before adding broad integrations. Give testers a simple reporting route and explain known limitations.

During the third week, create the landing page, installation guide, short demo and one substantive technical post. Choose a single primary call to action. Configure minimal funnel measurement and verify that events actually represent their stated outcomes.

During the fourth week, release to the chosen audience, collect activation and retention evidence, and decide what to improve. This schedule is a suggested future plan for the learner; no automation, posting or outreach has been scheduled or executed. A weak result is useful if it identifies a specific obstacle rather than producing a vague verdict that “marketing does not work.”

## 14. Final engineering review

Perform a review from each role: user, attacker, maintainer and operator. The user needs understandable controls and recoverable work. The attacker looks for paths from untrusted content to authority. The maintainer needs coherent contracts and tests. The operator needs release, payment and incident visibility.

Trace one tool write end to end. Identify the originating UI action, run, proposal, approval, workspace grant, file version check, execution and durable result. Then trace one payment end to end. Identify the account, checkout session, verified event, entitlement and offline lease. Missing links are more informative than another general code-style review.

Trace one installed update. Establish source commit, build tools, artifact hash, signature result, update metadata, migration and post-update smoke behavior. Verify the app's edition and update owner. This connects the course's architecture lessons to real user maintenance.

Write a final gap register with concrete unrun work, not vague warnings. Examples include Intel Mac support untested, Linux portal behavior not exercised on KDE or store review pending. A precise gap register helps another developer or future you continue without rediscovering what was assumed.

## 15. Transfer beyond the capstone

The same architecture can support a writing tool, database client, developer dashboard, media manager or enterprise utility. Replace the domain services while preserving process boundaries, lifecycle ownership, local persistence, identity and release discipline. Electron expertise is the ability to reason through a new application's constraints, not the ability to recite one framework's template.

For a database client, the privileged service owns credentials and query execution while the renderer owns visualization. For a media tool, a worker owns transcoding and the UI streams bounded progress. For a cloud console, the backend and account boundaries matter more than local file tools. Each product emphasizes different chapters without invalidating the core model.

A strong portfolio case study should show the problem, architecture decisions, a short demo, meaningful tests and measured tradeoffs. Use synthetic public examples and original branding. Explain your implementation choices clearly enough that another developer can assess them. This matches your interest in teaching while demonstrating freelance or consulting competence.

## 16. Completion evidence

Your final deliverables are a repository with the completed capstone, platform release evidence, user documentation, a product contract, privacy and billing explanations, a demo, a launch experiment plan and a candid verification report. Optional commercial publication is a separate real-world action that you perform through your own accounts.

The 1,000-hour plan is complete when the selected implementation blocks and their evidence are complete, not when a timer reaches a number. Use the hours to support sustained practice and investigation. Continue into advanced extensions where your target product demands them, and retain the habit that runs throughout this course: make authority explicit, keep important state durable and verify what the user will actually experience.

## 17. Worked prioritization example: one feature, three costs

Suppose beta users request a universal command-execution tool. The visible feature seems simple: add a tool name and stream terminal output. Its real cost includes containment, approval semantics, process-tree cleanup, output handling, support and distribution restrictions. Compare that cost with the actual user task. If users mainly need a repository onboarding note, a safe read tool and reviewed write may solve the task with less product risk and implementation burden.

Write a decision record with three columns: expected user benefit, engineering/maintenance cost and evidence still missing. Assign no false precision. A small number such as “high confidence because four observed users failed here” is more useful than an elaborate numerical score based on guesses. Revisit the decision when evidence changes.

Apply the same method to payment complexity. A first beta might need no subscriptions at all, while a commercial release needs reliable entitlement lifecycle. Do not integrate three billing systems merely because the course taught the alternatives. Learning breadth should improve selection, not force every technique into one product.

## 18. A concrete first-user observation script

Give a tester a task and a clean build: “Use the sample repository to create an onboarding note you would give a new teammate.” Do not narrate where to click unless they become blocked and ask for help. Observe whether they understand workspace selection, provider setup, source visibility and approval.

Record moments of confusion as behavior: the tester clicked Send three times because no progress appeared; the tester thought the preview had already changed the file; the tester did not know which provider would receive the context. These observations lead to specific fixes. “The tester liked it” is encouraging but does not identify a reliable workflow.

Afterward ask about the result's usefulness, what they would do next and whether this task recurs. Avoid leading with “Would you pay $20?” before establishing value and alternatives. A hypothetical willingness-to-pay answer is weaker evidence than repeated use or an actual voluntary purchase under clear terms.

Use synthetic data in public recordings and obtain permission before sharing feedback or a testimonial. Do not invent a client quote or repurpose an unrelated website's praise as if it described this app. A new product can show a transparent demo and early limitations without manufacturing social proof.

## 19. Worked funnel diagnosis and experiment design

Return to the hypothetical cohort: 1,000 visitors, 200 downloads, 140 launches and 56 activations. Suppose 20 activated users return the following week. Activation-to-next-week-return is 20/56, about 35.7%. This number describes that defined cohort and interval; it is not a universal retention benchmark.

If you change onboarding, keep the activation definition stable so comparisons remain interpretable. Do not count a tutorial modal closing as activation in one cohort and a saved useful result in another. Note release version, audience and platform, since a change in who arrives can affect conversion independently of the product change.

An experiment might be: “A sample workspace and explicit provider-cost explanation will reduce first-task abandonment.” Define what changes, which users see it, how success is measured and when you will review the result. Keep the sample large enough for the conclusion you intend, and describe small-sample findings as tentative rather than statistically established.

Qualitative evidence can complement the numbers. If five users say they refused to connect a private repository before seeing a demo, a safe sample workspace is a plausible improvement even before a large experiment. The experiment then tests whether that improvement actually changes behavior.

## 20. A maintainable content system for a developer founder

Create content from real engineering work. One week can produce a short demo of an approval flow, a written explanation of PKCE and a case study of a failed update rehearsal. Each item should teach one useful idea and show evidence. Avoid claiming every implementation detail is unique or revolutionary.

A reusable content brief contains the audience, problem, one insight, supporting artifact and next action. For example: audience is Electron developers; problem is stale OAuth callbacks; insight is that attempt lifetime must outlive a browser handoff but end on cancellation; artifact is a small state-machine test; next action is reading the example or trying the sample workflow.

Keep product promotion proportionate to the lesson. A technical reader may save an explanation today and try the application later. A clear link and consistent product name make that possible without forcing every paragraph into a sales pitch. Track qualified engagement and useful conversations, not only likes.

Your teaching interest can also support adjacent income: a focused workshop on desktop release engineering, an implementation guide or consulting on a team's Electron architecture. Treat those as distinct offers with their own scope and evidence. Do not promise broad consulting outcomes solely because the capstone exists; use the work to demonstrate specific competence.

## 21. Final portfolio narrative

Write the case study in this order: the user problem; the smallest useful workflow; the process and authority architecture; one hard failure and its fix; measured behavior; release evidence; and remaining limits. Include a short demo using public sample data. This structure lets a technical reviewer assess both product judgment and implementation quality.

A candid limitation can strengthen the narrative when it is precise. “The direct Windows build was exercised on a standard-user account; Microsoft Store submission remains pending” is useful. “Works everywhere” without evidence is not. Preserve your verification report alongside the repository so future changes can improve or invalidate specific claims.

Keep launch decisions reversible where possible. A small beta cohort, clear support route and staged artifact promotion let you learn before exposing every supported user to a new release. Broaden distribution when installation, activation and recovery evidence support it. Growth should increase the reach of a working promise rather than conceal an untested one.
