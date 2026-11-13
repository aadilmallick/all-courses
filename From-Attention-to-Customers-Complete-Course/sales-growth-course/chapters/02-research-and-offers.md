# 2. Customer research, positioning, and offers people can evaluate

**Allocation: 90 hours — study 14, guided practice 16, production 28, field application 24, review 8.** Prerequisite: Chapter 1's distinctions between a buyer, an audience, an offer, and a sale. Your outputs are a research dossier, a positioning brief, and a small offer that can be tested honestly. The Economics companion helps compare possible offers; it cannot validate demand.

## Replace the imaginary customer with a situation

Suppose Build Clearly plans a course about TypeScript. The founder enjoys advanced type systems and assumes other developers will buy a comprehensive reference. A few conversations reveal three different needs. One learner wants to pass an interview, another must maintain a confusing codebase, and a team leader wants consistent conventions across a team. All say they want to improve TypeScript. Their urgency, budget, evaluation criteria, and desired deliverables differ substantially. A demographic label alone would conceal those differences.

Customer research reduces uncertainty about those situations. It asks what people are trying to accomplish, what interrupts them, what they currently do, what the interruption costs, and how they decide on help. Research is not a ceremony performed to bless an idea you already intend to build. You should be able to explain what evidence would cause you to narrow, revise, delay, or abandon the offer. Without that possibility, the process is mostly persuasion directed at yourself.

A practical segment combines a person or organization with a relevant circumstance. “Junior developers” is a start. “Junior developers who understand syntax but cannot debug asynchronous failures in their first production role” is more useful. It suggests examples, interview questions, a possible outcome, and boundaries. It also tells you whom the offer excludes. The segment can change after research; its initial purpose is to make your assumptions visible enough to investigate.

Avoid adding details merely to make a persona feel lifelike. A fictional buyer's favorite coffee does not improve an offer unless it affects how they buy or use it. Relevant details include responsibility, current workflow, consequence of failure, available time, alternatives, authority, and constraints. For a company service, the user, buyer, approver, and person responsible for security may be different people. Your research should uncover that decision structure rather than assuming the person who comments can authorize a purchase.

## Define a research question that can change a decision

Start with the decision: should you build a debugging guide, run a live clinic, or offer a consulting diagnostic? Then identify the uncertain relationships behind it. Do people encounter the problem repeatedly? Is it costly enough to act on? Can they solve it with existing free resources? Does your method improve the situation? Can they make time to use it? Each question points to evidence you can gather. “Do people like my idea?” points mostly to politeness.

Write an assumption map with three categories: desirability, feasibility, and commercial viability. Desirability concerns whether the buyer values the outcome. Feasibility concerns whether you can deliver it reliably. Commercial viability concerns whether the price and cost structure can support the business. A course can be desirable but too expensive to produce for the audience size. A consulting service can be profitable in theory but impossible to deliver within the promised timeline. Keep all three categories visible.

Rank assumptions by consequence and uncertainty. Suppose you know you can teach browser debugging, but you do not know whether extension founders face a recurring onboarding problem. That unknown deserves attention before you choose a recording tool. A high-consequence assumption is one that would substantially change the project if false. Ranking does not require a mathematically precise score. A short explanation of why one unknown comes first is usually better than arbitrary decimal ratings.

Use a research plan small enough to execute. Define the intended participant situation, recruitment route, questions, recording permission, storage approach, and decision date. A first round of five or six relevant conversations is a useful workload choice for learning interview technique, not a statistical guarantee of market coverage. Continue or change the sample when new situations appear. You are seeking patterns and disconfirming cases, not accumulating a magic interview count that proves demand.

## Learn from public evidence without pretending it is a purchase

Public questions, support discussions, issue trackers, reviews, and community conversations can reveal vocabulary and recurring obstacles. Look for specific episodes: someone tried a method, encountered a failure, and described the consequence. A complaint saying “this is difficult” is less informative than “I spent two evenings reproducing a browser-specific failure and still could not determine whether the bug was in storage or messaging.” The second contains a situation, effort, uncertainty, and possible teaching need.

Make a research row for each useful observation. Include the question, context, current workaround, evidence of consequence, and a link when the discussion is public. Separate the speaker's statement from your interpretation. If someone says they cannot find a good tutorial, you may hypothesize a product opportunity. You have not yet learned whether they would pay, whether another tutorial already solves it, or whether the problem is urgent. Those are follow-up questions, not facts hidden inside the complaint.

Do not collect unnecessary personal data or copy entire discussions into a product. Summarize patterns in your own words. Public visibility does not automatically grant permission to use a person's identity, employer, or private situation in marketing. When a story is important, ask for permission or create a clearly fictional composite that does not imply endorsement. For the course exercises, synthetic notes are acceptable if labeled as practice; they must not be presented as actual customer research.

Competitor comments can be useful, but selection effects matter. People who leave a review may differ from people who remain silent. An angry comment might concern an unusual failure. A popular post might attract people who enjoy discussion rather than buyers. Treat public material as directional evidence about possible needs. Confirm important conclusions through additional sources, direct conversations, or a small real offer where possible.

## Conduct an interview that produces useful detail

Open with a short explanation: you are trying to understand a workflow, there is no obligation to buy, and the person can skip questions. Ask permission before recording. Begin with the person's actual responsibility and a recent instance of the problem. “Tell me about the last time your extension failed during onboarding” invites an episode. “Would a debugging course help you?” invites a forecast about an imaginary product and encourages the participant to be agreeable.

Stay close to the sequence. What triggered the work? What did they try first? What happened next? What information was missing? Whom did they involve? What did delay affect? Ask for concrete artifacts if they can share them safely, such as a redacted checklist or a description of the handoff. Do not ask them to expose confidential code or customer information to make your research more convincing. Their constraints are themselves useful information about delivery and trust.

Explore alternatives without insulting them. If they used free documentation, ask what worked and where it stopped helping. If they hired someone, ask how they chose that person and what made the engagement successful or disappointing. If they did nothing, explore why. Inaction can be a rational alternative when the problem is infrequent, the consequence is small, or another priority dominates. Your offer competes with the customer's entire set of priorities, not merely with other courses.

When discussing cost, distinguish money spent from estimated pain. “It took three engineers half a day” is an observation if they remember the episode. Multiplying that time by a speculative salary rate creates your estimate, not the company's verified loss. Ask what the delay prevented and whether anyone was responsible for solving it. An expensive problem with no owner can be harder to sell into than a smaller problem with a clear decision-maker and deadline.

Only after understanding the situation should you describe a possible offer. Use a neutral description and invite criticism: “I am considering a two-session diagnostic with a reproduction plan and prioritized recommendations. Which parts would be useful, and what would make it unsuitable?” Ask how they would evaluate it and what would need to happen before purchasing. Do not interpret a positive reaction as an order. Record their exact commitment level separately from your enthusiasm.

## Read an interview example carefully

Here is a fictional exchange. Researcher: “What happened the last time onboarding failed?” Participant: “A tester could not complete setup in Firefox.” Researcher: “What did you do next?” Participant: “I added logs, but the tester could not send them back easily.” Researcher: “What did that delay affect?” Participant: “We postponed a small beta. We have no paying users yet.” The evidence supports a problem with collecting reproducible information. It does not yet support a high-budget enterprise service.

The researcher asks what they tried. The participant describes a screen recording and a temporary support form. They say they would prefer a reusable diagnostic template to a broad course because they already know the APIs. That is a useful distinction between knowledge and workflow. A marketer who only hears “debugging problem” might produce twenty hours of lessons. A more suitable product could be a small template, a setup guide, or a focused clinic. The correct choice still requires testing whether the proposed help works.

Now imagine another participant, a technical lead at an established product. The lead describes the same surface symptom but must coordinate support, engineering, and release approvals. A template alone may not solve the organizational issue. A diagnostic service with a team handoff could be relevant. The two participants should not be averaged into one generic customer. Their shared technical vocabulary hides different consequences, authority, and implementation needs.

After the interview, write three sections. Observation: tester logs were hard to collect and beta timing changed. Interpretation: reproducibility and feedback collection may be more important than advanced API instruction. Next test: demonstrate a redacted diagnostic collection workflow and ask the participant to try it. This disciplined separation keeps a single interview from turning into a sweeping market claim.

## Synthesize patterns without erasing disagreement

Group notes by problem episode rather than by the product you hope to sell. Possible groups include reproduction, environment differences, missing feedback, confusing architecture, and coordination. For each group, count the relevant cases and note counterexamples. If four of six participants mention reproduction, write “four of six participants in this small purposive sample described reproduction difficulties,” not “two-thirds of developers need this product.” Your sample was selected for learning, not for estimating a population proportion.

Look for combinations. Reproduction difficulty may be commercially significant only when a launch date is near and the person owns the outcome. A broad pain statement becomes more actionable when paired with a trigger and responsibility. Record the combination as a candidate segment. Then seek cases that could challenge it: someone with the same deadline who solves the issue easily, or someone who feels the pain but cannot buy help. These cases reveal boundaries and possible competitors.

Build a short evidence table with columns for observation, frequency in your sample, consequence, alternative, and confidence. Confidence should describe the evidence quality: detailed recent episode, vague recollection, public comment, or hypothetical preference. Do not give every row equal authority because it occupies the same spreadsheet space. An actual attempted purchase blocked by a scope question can matter more than ten casual likes, although it still describes one person's situation.

Finish synthesis with a decision memo. State what changed, what did not, what remains uncertain, and the next inexpensive test. For example: “We will test a debugging clinic for technical owners preparing an extension beta. We will not build a comprehensive TypeScript course yet. The unresolved question is whether the clinic can produce a useful diagnosis within two sessions.” This memo is the bridge from research to offer design.

## Positioning explains the comparison

Positioning is the context that helps the right buyer understand what your offer is, who it serves, what alternative it replaces, and why it may be preferable in that situation. It is more than a slogan. If you call a diagnostic a course, buyers may compare it with inexpensive recorded lessons. If you call it an implementation project, they may expect you to write the fixes. The category affects expectations, scope, price comparisons, and the questions people ask.

Start with the alternative the buyer actually uses. It could be searching documentation, asking a teammate, hiring a general freelancer, postponing the work, or joining a course. Describe the circumstances under which your offer improves on that alternative. A scoped diagnostic might provide an independent reproduction strategy and a written priority order when the team is stuck. It may be inferior when the customer already knows the cause and simply needs implementation labor. Saying so improves fit.

Use a positioning sentence as a working tool: “For technical owners preparing an extension launch who cannot reliably reproduce onboarding failures, Build Clearly's diagnostic provides a tested reproduction plan and prioritized recommendations through two guided sessions.” Then add the boundary: “It does not include a full rewrite, ongoing support, or a guarantee that every third-party defect can be fixed.” This is a commercial hypothesis with explicit limits, not final copy carved into stone.

Differentiation should be meaningful to the buyer. “Friendly, innovative, passionate” is difficult to evaluate and widely claimed. A complete sample report, a clearly explained diagnostic method, relevant experience you can substantiate, and a defined handoff can be more persuasive. Avoid claiming uniqueness unless you have evidence broad enough to support it. You do not need to be the world's only option. You need a credible reason for the appropriate person to choose you.

## Investigate competitors as alternative decisions

Choose three real alternatives your intended customer could reasonably use. One might be free documentation, one a recorded course, and one a specialist service. For each, record the audience, promise, prerequisites, delivery format, visible price at the time you inspect it, support terms, and evidence. Mark information you cannot see as unavailable. Do not invent a competitor's revenue, conversion rate, or customer satisfaction from their website design or follower count.

Compare the same buyer task across the alternatives. Documentation may explain an API accurately while leaving the reader to diagnose their own system. A recorded course may provide a coherent learning path but little individual feedback. A specialist may address the exact system but require more budget and coordination. These differences reveal situations where each alternative fits. Your positioning becomes more useful when you can explain those boundaries fairly rather than dismissing the alternatives.

Now create a comparison for the fictional diagnostic. Ask whether it is competing with learning, implementation, or decision support. If buyers mainly need somebody to write the fix, a diagnostic-only service may feel incomplete. You could add implementation as a separate phase, partner with an implementer, or target buyers who can execute internally. The research does not automatically prescribe expansion. It identifies the decision you must make and the operational consequences of each choice.

Investigate how buyers describe switching costs. A company may prefer an imperfect internal process because introducing a contractor requires approvals and access reviews. A learner may continue with free videos because they cannot commit to scheduled sessions. A lower price does not necessarily remove these costs. Your offer could reduce coordination, provide an asynchronous option, or clarify preparation. Each change should address an observed obstacle rather than imitate a competitor's feature list.

Keep a dated competitor note and review it when making a consequential decision. Prices and policies change, so a comparison from six months ago should not be presented as current. The purpose is informed choice, not constant monitoring that distracts you from your own customers. Inspect only material you may legitimately access, summarize in your own words, and preserve attribution for distinctive ideas. Research should improve understanding without copying another business's expression or private information.

## Separate the user, champion, approver, and payer

In a company purchase, the developer using the report may be different from the manager sponsoring it, the procurement person approving terms, and the finance team paying the invoice. Draw those roles as a simple table for your research case. For each, list the decision they own and the uncertainty they need resolved. The developer may need technical credibility, the manager a clear outcome, procurement a workable scope, and finance correct billing information.

Ask your contact how the process works rather than guessing identities or contacting colleagues without context. A champion can help explain the internal route if they choose. Give them a concise artifact they can share: situation, proposed result, scope, cost, responsibilities, and evidence. This reduces the burden of translating your offer. It also reveals whether the engagement needs more formal preparation than your current process supports. A stalled company purchase may reflect these dependencies rather than a failure of persuasive language.

## Design the offer as a small delivery system

An offer needs an entry condition, a process, an output, and an exit condition. The entry condition defines fit and prerequisites. The process explains what happens. The output states what the customer receives. The exit condition defines completion and any follow-up. This structure protects against a vague promise expanding during delivery. It also gives your marketing concrete information to communicate.

For the fictional diagnostic, entry might require an accessible test environment, authority to share relevant non-sensitive information, and a named technical owner. The process could include intake, a reproduction session, independent analysis, and a review session. The output could be a written evidence log and prioritized repair plan. Completion occurs when the report is delivered and the review session is held. Ongoing implementation is a separate offer with its own scope and price.

For a workshop, entry conditions concern knowledge and setup. The process includes a schedule, exercises, and feedback. The output could be a working debugging workflow and reviewed exercise artifacts. Completion should not depend on guaranteeing a new job or a fixed income. For a guide, the output is the guide and any clearly included templates or updates. Avoid vague lifetime promises that create obligations you have not designed a business to sustain.

Offer design also includes risk allocation. What happens if the session must be rescheduled? What if the problem turns out to require access the customer cannot provide? What if a buyer discovers they lack prerequisites? State a reasonable approach before checkout or signature. Terms should help both parties make an informed decision. Do not use elaborate restrictions to compensate for an unclear product or an unsupported promise.

## Price from value, alternatives, cost, and evidence

Cost gives a floor for sustainability but does not determine willingness to pay. Buyer value sets a possible ceiling but is uncertain and situation-dependent. Alternatives provide comparison points but may deliver different outcomes. Your evidence and credibility affect perceived risk. Good pricing considers all four rather than selecting a number because another creator posted a dramatic revenue screenshot.

Suppose a diagnostic requires eight delivery hours and two hours of sales and administration per customer. At an internal planning rate of $60 per hour, time allocation is $600. Add $100 of variable expenses, producing $700 before fixed overhead, acquisition risk, and desired contribution. A $750 price leaves only $50 under that model. A $3,000 price leaves more room, but arithmetic does not establish that buyers value the diagnostic at $3,000. You must investigate alternatives, consequence, confidence, and actual buying decisions.

For a $49 guide, the same ten hours cannot recur for every order. The model depends on reusable production and bounded support. If every customer receives a custom one-hour consultation, your supposed digital product becomes a service at a low effective rate. Design support deliberately: a clear troubleshooting section, a defined question channel, or a separate consultation. Explain the boundary so customers do not discover it only after they need help.

Test price with an offer people can actually evaluate. A hypothetical survey saying “would you pay $100?” is weaker than a clear pilot with a real date, scope, price, and cancellation terms. If taking preorders, explain the delivery state and timing accurately and have a credible delivery and refund plan. A waitlist can measure interest in updates, but it does not prove paid demand. Keep waitlist signups and purchases in separate columns.

## Build proof without inventing authority

Early proof can come from a demonstration, a sample artifact, a transparent process, a small completed project, or a genuine customer account used with permission. The form should match the claim. A code demo supports that a technique can work in the shown environment. It does not prove average customer savings. A testimonial about your teaching style does not establish that an enterprise diagnostic will reduce incidents. Match evidence scope to promise scope.

If you have a successful website project, describe what you actually did and what you can substantiate. A live site can demonstrate implementation and design; it does not authorize a fabricated client quote or a revenue claim. Ask for a genuine testimonial with permission and preserve its meaning. When results are not yet measured, use a process case study: initial problem, constraints, choices, implementation, verification, and known limitations. This can be useful without invented business impact.

For the course exercises, write fictional case studies with prominent labels. They help you practice structure but must stay distinct from your commercial proof. When you later replace them with real evidence, verify names, permissions, dates, and metrics. A synthetic teaching example is honest because the reader knows its role. The same story becomes misleading if presented as a customer success that never happened.

Disclose material commercial relationships when recommending products or sharing sponsored work. The FTC's public guidance addresses clear disclosure of relevant connections; see source F01 in the research appendix. This course does not turn a general disclosure sentence into a complete legal analysis. The practical habit is to make the relationship understandable where the endorsement appears and avoid implying independent experience you do not have.

## Compare offers using a decision matrix

Create columns for buyer urgency, access to buyers, proof available, delivery confidence, margin, support burden, and repeatability. Score each offer only as a discussion aid and write the reason behind each score. A low score on access means you may struggle to learn, even if the theoretical market is large. A high score on repeatability means little if the first version does not help anyone. Numbers organize judgment; they do not remove it.

Imagine the guide scores well on repeatability but poorly on willingness-to-pay evidence. The workshop scores well on learning speed because you can observe confusion live, but requires scheduling. The diagnostic scores well on possible contribution but poorly on current proof. A reasonable first move could be a small paid workshop with a narrow problem and explicit prerequisites. Another reasonable move could be a pilot diagnostic if you already have relevant relationships. Explain the choice in terms of evidence and constraints.

Do not launch all offers merely because the matrix includes them. Multiple offers create multiple pages, delivery processes, audience expectations, and measurement questions. A staged sequence makes learning easier. Start with one primary offer, retain notes about adjacent needs, and expand when the new offer serves a clearly different situation or removes a demonstrated bottleneck. Expansion should follow evidence rather than the desire for a longer services menu.

## Plan a validation ladder

A validation ladder increases the strength of commitment and the cost of delivery gradually. First, desk research identifies a possible problem. Next, conversations clarify actual episodes and alternatives. Then a sample or demonstration tests comprehension and relevance. A scoped pilot tests whether the method helps. A real paid offer tests a commercial decision. Repeated delivery tests whether the result and economics are sustainable. These stages answer different questions and should not be treated as interchangeable proof.

You can move backward when needed. A pilot might reveal that buyers misunderstand prerequisites, requiring clearer positioning. A sale might reveal delivery takes three times longer than expected, requiring scope changes. A successful workshop might reveal demand for a guide, or reveal that participants only progress with live feedback. The ladder is not a guarantee that every idea eventually works. It is a way to spend effort in proportion to what you have learned.

Define success criteria before the test. A pilot diagnostic might count as operationally promising if the customer receives a reproducible issue map, understands the next actions, and the delivery remains within the planned hours. Commercially promising might require an actual paid commitment under clear terms. Avoid adding new success criteria after seeing results merely to declare victory. Also record valuable surprises, such as a customer valuing a different output than the one you expected.

Write stop conditions as well. If the offer repeatedly requires confidential access you cannot responsibly obtain, redesign it. If buyers consistently need implementation while you only want to teach, reconsider fit. If delivery economics fail at a price buyers accept, reduce scope, improve the process, or choose another model. Declining an unsuitable opportunity is a successful research outcome when it prevents a larger investment in the wrong direction.

## A research-to-offer workshop

Begin with six fictional or real, permission-respecting research notes. Extract a problem sentence from each without mentioning your product. Group the sentences by underlying obstacle. Choose one group and list the trigger, consequence, current alternative, and responsible person. Draft a segment statement. Then write what evidence would disprove it. This last step prevents the segment from becoming an identity you defend instead of a hypothesis you improve.

Draft a one-page offer using plain headings: who it helps, what happens, what you receive, what you need, what it costs, what is excluded, and how to decide. Add one sample deliverable. Read the page aloud as if answering a skeptical but reasonable buyer. Whenever you hear an adjective such as comprehensive or premium, replace it with an observable description. “Three annotated examples and one reviewed exercise” gives the reader more information than “exceptional learning experience.”

Give the draft to a suitable reader and ask them to explain it back in their own words. Do not ask whether they like the design. Ask whom they believe it is for, what happens after purchase, what they would worry about, and what they would compare it with. Their explanation tests comprehension. Their purchase decision, if relevant and freely made, tests a different question. You may have to improve comprehension before a demand test tells you much.

Recalculate delivery economics after feedback. If the reader expects customization, decide whether the expectation is reasonable and whether to include it. If you include it, update time and cost. If you exclude it, make that visible. Offer copy and delivery design should remain aligned. A beautiful page that sells an unsustainable service is a failure of business design, even if the first campaign converts well.

## Common research failures and how to repair them

If every interview is enthusiastic but nobody takes a next step, inspect the questions. You may be asking for opinions rather than recent behavior and real decisions. Replace “would you use this?” with questions about the last episode, current spending, evaluation process, and what blocks action. Offer a small real next step with clear terms. If people still decline, record why without arguing. Their refusal is information, not an obstacle you must overcome to complete the interview.

If findings conflict, look for different situations before averaging them. Beginners may value explanations that experienced developers find slow. Managers may value a report that individual contributors consider unnecessary. Separate the segments, compare their economics and access, and choose deliberately. A product that tries to satisfy all of them may become too broad for any of them. Contradiction often signals missing context rather than bad data.

If you keep expanding the research indefinitely, define the next decision and the minimum evidence needed to take a reversible step. You do not need perfect certainty to run a small workshop. You do need enough clarity to describe it honestly and deliver it competently. Research should reduce costly uncertainty while preserving momentum. The balance depends on the consequences of being wrong, not on a universal number of interviews.

## The 90-hour application plan

Spend fourteen study hours on the chapter, source notes, and examples of real offer pages you may lawfully inspect. Record how each page identifies buyer, promise, evidence, process, and terms. Do not copy wording or assume attractive design proves commercial success. Your goal is to see the structure of a decision. Use the supplied research and offer templates as working documents, not as forms to fill with impressive language.

Use sixteen guided-practice hours for interview rehearsal, note synthesis, offer comparisons, and economic scenarios. Rehearse with fictional cases first so that you can notice leading questions without pressuring a real participant. Write a reference synthesis explaining which conclusions the notes support and which they do not. Compare two plausible segments and explain why one would be easier to serve and learn from now.

Use twenty-eight production hours to create the research dossier, positioning brief, sample deliverable, pilot scope, and offer page draft. Each artifact should connect to the same buyer situation. The sample should be complete enough to judge the method. If your guide promises practical debugging, show a worked diagnosis, not only a table of contents. If your service promises a useful report, show the structure and level of detail in a clearly synthetic example.

Use twenty-four field hours for voluntary interviews, public observation, comprehension tests, and a bounded pilot when feasible. Count recruiting and scheduling time as work, but do not count waiting days as active hours. If access is limited, complete desk research and private rehearsals, then mark willingness to pay as unverified. The course can be studied privately, but real customer evidence cannot be manufactured by completing a worksheet.

Use eight review hours to compare the original assumption map with what you learned. Deliver a decision memo containing the chosen segment, offer, price hypothesis, evidence, unresolved risks, and next test. A strong memo may recommend delaying the offer. It should give the next chapter a precise communication problem: explain this useful promise to these people with this evidence. Chapter 3 turns that brief into content and copy.
