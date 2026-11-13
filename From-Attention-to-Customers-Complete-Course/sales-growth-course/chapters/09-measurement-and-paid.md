# 9. Measurement, experiments, and paid acquisition

**Allocation: 100 hours — study 14, guided practice 16, production 38, field application 22, review 10.** Prerequisites: funnel definitions, economics, channel workflows, and a functioning offer route. Your outputs are a measurement plan, experiment register, synthetic campaign analysis, and a reviewable paid-acquisition plan. Use all companion experiments, especially Uncertainty, Funnel, and Economics. Sources A01–A03 describe current tracking and campaign concepts; this chapter does not launch ads or assume access to an ad account.

## Begin with the decision a metric will support

Your dashboard says reach increased by forty percent. Should you publish more, raise prices, buy ads, or change nothing? The number alone cannot answer. Measurement begins with a decision: which audience, offer, creative, route, or delivery process should receive the next unit of effort? Choose measures that reveal the relevant relationship. Otherwise the dashboard becomes a collection of visible numbers that encourages action without diagnosis.

Create a hierarchy. Business outcomes include collected contribution, suitable customers, and sustainable delivery. Customer outcomes include useful progress, satisfaction, and repeat use. Funnel outcomes include qualified conversations, purchases, and activation. Channel measures include impressions, views, clicks, and engagement. Production measures include hours and cost. Guardrails include complaints, refunds, errors, and capacity. The hierarchy explains how a local improvement might support or harm the broader system.

Define each measure with numerator, denominator, event, population, time window, and source. “Conversion” is too vague. “Completed guide purchases divided by product-page sessions during the launch window, using order records and site analytics” is a usable definition, with known limits if sessions and customers do not align perfectly. Record the limits instead of pretending the denominator is a direct count of distinct eligible buyers.

## Build an event dictionary before installing tags

An event dictionary states what happened and when you record it. Useful events might include sample requested, sample delivery accepted, product page visited, checkout started, purchase confirmed, refund recorded, fit call booked, call attended, proposal accepted, and first learning task completed. Do not record a purchase when someone clicks the checkout button. That click is an intention signal, while the completed transaction is a different event.

Choose a source of truth for each event. Order records establish transactions. Your booking system establishes scheduled meetings. A manual CRM may establish whether a call was attended and qualified. Website analytics describes observed behavior under its collection limits. An advertising dashboard attributes outcomes according to its own rules. These systems may disagree because they answer different questions. Reconcile them rather than forcing all counts to match by deleting inconvenient records.

Use unique identifiers for deduplication where your systems support them, without exposing unnecessary personal information. A single order should not become two purchases because both browser and server tracking recorded it. A refresh of a confirmation page should not create a new sale. Test repeated clicks, reloads, failed payments, cancellations, and refunds. A tracking plan that ignores failure paths can produce an attractive but fictional return on ad spend.

Retain only data you need and implement appropriate permissions and consent for the audience and jurisdiction. Do not put email addresses, access tokens, or sensitive customer details in campaign URLs. Do not send confidential form contents to advertising platforms merely because a tag manager makes it easy. Platform documentation includes restrictions and implementation conditions that must be reviewed for the actual pages and data involved. See A01 and A02 for official tracking concepts.

## Use campaign labels consistently

Campaign labels help distinguish traffic routes. A simple scheme identifies source, medium, campaign, and content variant. For example, source might be linkedin, medium organic_social, campaign debugging_guide_launch, and content report_example_a. Use a shared naming convention with stable spelling. Inconsistent capitalization and ad hoc names can fragment reports and make a small campaign harder to interpret than necessary.

Label the link before publishing, test that it resolves correctly, and confirm the destination retains the expected parameters where appropriate. Avoid putting personal data in the labels. Record the link in the content log. A label can connect a visit to a published route, but it does not prove the route caused the eventual purchase. People switch devices, remove parameters, share links, and return through bookmarks.

Use self-reported discovery as a complementary signal. A simple optional question such as “Where did you first hear about this?” can reveal influences that click tracking misses. The answer is also imperfect: memory is selective and people may name the most recent encounter. Keep it alongside observed behavior and order truth. Multiple partial views are more useful than pretending one attribution model reveals the complete journey.

## Read a funnel with aligned populations

Suppose a campaign records 1,000 landing-page sessions, 100 sample requests, 30 checkout starts, and 12 purchases. If these are sequential events from comparable populations in a defined window, the apparent request rate is ten percent and the overall session-to-purchase rate is 1.2 percent. But if checkout starts include returning visitors from an earlier campaign, the simple sequence is not a clean cohort. Label the report as a period view rather than a single-user progression.

A cohort view follows a defined group from a starting event, such as people who requested the sample in one week, over a fixed outcome window. If 100 people request the sample and 8 purchase within thirty days, the cohort purchase rate is eight percent under your identity and tracking limits. Compare that cohort with another only after both have had similar time to mature. A new cohort will otherwise appear artificially weak.

Inspect stage counts before percentages. A fifty percent increase from two to three purchases is one additional purchase. A drop from five to four percent among ten thousand qualified visits has a different scale. Include absolute counts, rates, and uncertainty. Percentages help compare, but they can exaggerate small changes when the base is tiny. Never remove the denominator from a performance claim simply because the percentage sounds impressive.

## Calculate paid-media metrics from first principles

CPM is cost per thousand impressions. If you spend $200 for 20,000 impressions, divide $200 by 20 and get a $10 CPM. CPC is cost per click. If the same campaign generates 400 clicks, $200 divided by 400 is $0.50 CPC. Click-through rate is 400 divided by 20,000, or two percent, assuming the platform's click and impression definitions align with the intended calculation. Use the platform's exact metric label when several click types exist.

CPL is cost per lead under your lead definition. If the campaign produces forty sample requests, CPL is $5. If only ten satisfy your criteria for a consulting opportunity, cost per qualified lead is $20. These are not interchangeable. A campaign optimized for cheap form submissions may attract people who do not fit the service. The cheapest visible lead can be expensive after sales effort and poor qualification.

Media CAC is spend divided by acquired customers. If those forty requests produce four customers, media CAC is $50. If creative production and sales labor add another $120, including them gives $80 per customer. Label the scope. Do not compare a platform's media-only acquisition cost with your business's fully allocated cost as if they measure the same thing. Both can be useful for different decisions.

ROAS, return on ad spend, is attributed revenue divided by ad spend under the chosen attribution rules. If attributed revenue is $600 and spend is $200, ROAS is 3.0. That does not mean profit is $400. Fees, refunds, delivery, creative, labor, and overhead remain. Nor does attribution prove all $600 was caused by the ads. Some customers might have purchased without them. ROAS is a report ratio, not a complete business verdict.

## Derive the break-even relationship

Suppose each order is priced at $100 and contributes $60 before acquisition after the variable costs you include. The contribution margin ratio is 60/100 = 0.60. To cover $200 of advertising, you need $200/$60 = 3.33 expected orders, or at least four whole orders in this simplified realized case. In revenue terms, break-even attributed ROAS is 1/0.60 = 1.67 if attribution were fully incremental and the other assumptions held.

The derivation is straightforward. Revenue multiplied by margin ratio gives contribution before ads. Break-even means that contribution equals spend. Therefore revenue × margin ratio = spend. Divide both sides by spend and then by margin ratio: revenue/spend = 1/margin ratio. The left side is ROAS. This identity is useful because it reveals why the same ROAS can be healthy for one offer and unsustainable for another.

If a guide contributes only $35 before acquisition, a $50 CAC loses $15 per new customer before fixed overhead. You may choose to investigate future repeat value, but you must label it as unobserved until supported by cohort evidence. Do not justify every loss with an imagined lifetime value. A conservative first-order model gives you a clear starting decision and exposes what evidence would be needed to accept a longer payback period.

For services, include sales and delivery capacity. An ad campaign might generate ten qualified calls, but if each takes an hour of preparation and conversation, those hours matter. If two clients close and each requires twenty delivery hours, the campaign creates forty delivery hours plus sales work. Paid acquisition can create an operational problem even when the media ratio looks attractive. The Capacity and Pipeline experiments should be used alongside Economics.

## Understand uncertainty before declaring a winner

Imagine page A has one purchase from twenty visits and page B has two from twenty. The observed rates are five and ten percent. It is tempting to call B twice as good. Yet one additional purchase changes the apparent rate dramatically. Small samples produce unstable estimates. The right conclusion is that B performed better in this small observed sample, with substantial uncertainty about the underlying rates and possible differences in audience.

A useful statistical model treats each eligible observation as a binary outcome, such as purchase or no purchase, with an assumed stable probability. Real marketing data may violate independence and stability through repeat visitors, changing audiences, or shared influences. State those limitations. Statistical calculations can describe uncertainty under a model; they cannot repair a poorly defined event or biased assignment.

The companion uses the Wilson interval for a single observed proportion with z = 1.96, commonly used for an approximate 95 percent interval under the model. Let n be observations, s successes, and p = s/n. The center is (p + z²/(2n)) / (1 + z²/n). The half-width is z × square-root[p(1−p)/n + z²/(4n²)] / (1 + z²/n). The interval is center minus and plus that half-width. The adjustment behaves better near zero or one than a naive symmetric interval around p.

You do not need to memorize the expression. Understand what it does: it uses the count and sample size to produce a range reflecting uncertainty, while avoiding impossible negative proportions in ordinary boundary cases. For zero observations, the rate and interval are undefined; the companion reports insufficient data rather than zero conversion. For zero successes among twenty observations, it still permits a nonzero upper value because observing none does not prove the underlying probability is exactly zero.

Intervals for two variants can be displayed as descriptive evidence, but overlapping or non-overlapping intervals are not a complete formal two-sample decision rule. The companion deliberately does not declare a causal winner or calculate a universal significance verdict. It helps you see how much uncertainty small counts contain. If a high-stakes decision requires formal inference, design the experiment and analysis appropriately rather than treating a simple calculator as certification.

## Design an experiment that answers one question

Begin with a hypothesis tied to a mechanism: “A worked sample will reduce uncertainty about teaching quality and increase suitable purchases from the product page.” Define the primary outcome, guardrails, population, assignment method, observation window, and decision rule before collecting results. Choose an intervention that changes the proposed mechanism. A test that simultaneously changes price, audience, page, and product cannot easily identify which change mattered.

Random assignment, when feasible and correctly implemented, helps make groups comparable in expectation. Keep exposure consistent and avoid allowing the same person to switch repeatedly between variants in ways that undermine the design. Track technical failures and exclusions. If your system cannot randomize, you can still run an observational improvement cycle, but describe it accurately. A before-and-after comparison may reflect seasonality, audience changes, or other simultaneous events.

Set a duration or sample plan appropriate to the effect you care about and the traffic you can obtain. Repeatedly checking for a favorable result and stopping at the first attractive moment can distort inference. A small business can use practical decision rules without pretending to have precise causal proof: improve obvious usability failures, gather directional evidence, and reserve larger spending decisions for stronger data. Match confidence to the cost of being wrong.

Record inconclusive outcomes. A test that cannot distinguish variants may tell you the difference is small relative to available data, the traffic is insufficient, or the intervention did not meaningfully change the experience. It does not prove the variants are identical. Use the result to decide whether more evidence is worth the cost. Sometimes the clearest or easiest-to-maintain version is a reasonable choice when commercial differences remain uncertain.

## Discover how audience mix can reverse a conclusion

Consider a synthetic comparison between page A and page B. Page A receives 1,000 search visits and 1,000 social visits. Search produces 90 purchases and social produces 10. The within-source rates are nine percent and one percent. Overall, A produces 100 purchases from 2,000 visits, or five percent. Page B receives 500 search visits and 1,500 social visits. Search produces 50 purchases and social produces 20. Its within-source rates are ten percent and about 1.33 percent. Overall, B produces 70 purchases from 2,000 visits, or 3.5 percent.

The aggregate report says A converted better, yet B has the higher observed rate within both sources. The difference arises because B received a larger share of the lower-converting source. This is a numerical illustration of an aggregation reversal, often discussed under Simpson's paradox. It does not prove B caused better performance; the groups could differ in other ways. It shows why audience composition matters and why an overall rate can conceal the relationship you intended to compare.

Work through the arithmetic instead of memorizing the label. A's overall rate is a weighted average: half the visits at nine percent plus half at one percent equals five percent. B's is one quarter at ten percent plus three quarters at approximately 1.33 percent, which equals 3.5 percent. The weights changed. If you compared the pages without recording traffic source, you might optimize in the wrong direction. A randomized design with comparable exposure addresses a different question from this observational dataset.

Use the supplied synthetic campaign file to reproduce the example. Keep the row labels, counts, and denominators. Then write a decision memo that says what can be learned: the observed source mix differs and the aggregate comparison is insufficient to identify a page effect. A useful next step could be a controlled test within a comparable population or a standardized descriptive comparison. The correct response is not to hide the aggregate result, but to explain it and gather better evidence.

## Plan sample size from the decision's economics

Suppose your current page converts around two percent and you care about an improvement to three percent. That is a one-percentage-point absolute change and a fifty percent relative change. The relative number sounds large, but purchases remain uncommon. Twenty visits per variant cannot estimate the difference precisely. Even hundreds may leave substantial uncertainty. A formal sample-size plan depends on the chosen statistical test, error tolerance, power, baseline assumptions, and design. This course does not supply a universal minimum traffic number because those choices matter.

For an early business, ask whether the test is worth the cost of obtaining enough suitable observations. If paid clicks cost $5, a thousand clicks cost $5,000 before variation. A $49 guide with uncertain contribution may not justify that learning expense. You may learn more cheaply by fixing obvious usability problems, testing comprehension, or serving a small group directly. These alternatives do not provide the same causal evidence as a large randomized test, but they may be better decisions under your constraints.

Separate business significance from statistical detectability. A tiny improvement can be detectable at enormous scale while being irrelevant to a small operation. A large plausible improvement may matter commercially but remain uncertain in a small sample. State both questions: how much would the change be worth if real, and how strong is the evidence that it is real? The first uses economics; the second uses design and uncertainty. Neither can replace the other.

## Analyze a paid pilot from spend to delivery

Imagine a fictional workshop campaign spends $600 and generates 300 landing-page visits, 30 registrations for a free sample session, 18 attendees, and 3 purchases of a $399 workshop. The observed cost per visit is $2, cost per registration $20, cost per attendee about $33.33, and media CAC $200. Gross order revenue is $1,197, so attributed ROAS under this simplified campaign view is about 2.0. The numbers are teaching data, not a forecast or a benchmark for any platform.

Now include the economics. Suppose each workshop purchase contributes $300 before acquisition after the costs included in your model. Three purchases contribute $900 before ads and $300 after the $600 spend. If the sample session, creative, and follow-up required twelve hours valued internally at $40, another $480 of allocated time makes the result negative $180 before fixed overhead. The campaign could still create reusable assets or future demand, but those are separate hypotheses. The observed first-window result does not support calling the campaign highly profitable.

Inspect the route before choosing a repair. Registration-to-attendance is 18/30, or sixty percent. Attendee-to-purchase is 3/18, or about 16.67 percent. Those rates do not identify the cause of non-purchase. Some attendees may have wanted only the free lesson. Others may have found the paid scope unsuitable. Ask what they expected and inspect the offer explanation. Increasing registration volume could simply amplify a mismatch and add more facilitation work.

Consider three next actions. You could improve the sample-to-workshop continuity, reduce production cost through a reusable demonstration, or test a more suitable audience. Each addresses a different mechanism. Choose one based on evidence and record the expected effect and guardrails. Do not simultaneously change audience, price, event, and sales sequence, then claim the next result proves one tactic worked. A business can make several practical changes when necessary, but the resulting causal uncertainty should remain explicit.

## Review creative fatigue and saturation without guessing causes

A campaign's performance can decline because the audience has seen the creative repeatedly, the offer has lost relevance, competition changed, tracking broke, or the audience mix shifted. Frequency and time trends can suggest saturation, but a worsening CPC alone does not prove creative fatigue. Inspect delivery context, click behavior, destination performance, and customer fit. Confirm technical function before rewriting every ad. The first repair should address the strongest supported explanation.

Prepare new creative around a different useful angle rather than changing colors alone. One version might demonstrate the symptom, another show a sample outcome, and another compare alternatives. Keep all versions accurate and linked to the same clearly defined offer unless the test intentionally changes the offer. Record production cost and the audience each version may attract. A more clickable angle can worsen qualification if it broadens the promise beyond the product's actual scope.

Scaling a budget can change the audience and auction conditions, so rates may not remain constant. A campaign that works at a small spend does not establish the same CAC at ten times the volume. Increase cautiously according to your actual learning and cash constraints, monitor downstream quality, and retain a way to stop. This is a planning principle rather than a recommendation about a specific budget increment or platform learning period. Those operational details require current account evidence.

## Choose paid acquisition only after basic readiness

Paid media buys distribution under a platform's auction and delivery system. It does not fix an unclear offer, weak delivery, or broken purchase path. Before spending, establish a coherent audience hypothesis, a useful creative, a tested destination, a measurable outcome, a contribution model, and a bounded learning budget. You can complete this module using synthetic data and a reviewable plan; the course does not require actual ad spend.

Choose the objective that matches the intended outcome and available signal. A reach objective and a purchase objective ask the delivery system to pursue different behaviors. Optimizing for inexpensive clicks is not the same as optimizing for suitable customers. Current objective names and eligibility differ by platform, account, and campaign type. Consult the official setup in your account instead of copying an old interface walkthrough.

Set a learning budget based on what you can afford to lose and what the test can reasonably teach, not on a universal daily minimum from a creator. At a hypothetical $5 CPC, a $100 budget buys about twenty clicks before variation. If your true conversion rate were two percent, expected purchases would be 0.4. Zero purchases would not be surprising, and the test would provide little precision about CAC. The arithmetic should influence whether the proposed experiment is worth running.

Define stop conditions for technical failure, unacceptable complaints, broken tracking, misleading creative, and spending limits. Define review conditions for commercial performance after an appropriate window. Avoid changing everything after a few impressions, but do not keep spending through a broken checkout because the plan says to wait a week. Operational failure and statistical uncertainty require different responses.

## Plan a LinkedIn campaign around a professional buying situation

For a diagnostic service, the audience hypothesis may involve technical responsibility, company context, and a relevant problem. Professional targeting options can help describe a population, but job titles do not guarantee need or authority. Start with a clear situation and creative that helps unsuitable people self-select out. A broad promise of business transformation can produce low-quality inquiries even when the targeting looks precise.

Choose a useful creative: a concise process example, a diagnostic checklist, or a sample report. The destination should explain fit, scope, and next step. If using a lead form, include enough context to avoid collecting cheap but uninterested submissions. Plan how the lead will receive the promised resource and how any commercial follow-up will remain appropriate. An unworked lead is not a business outcome.

LinkedIn's Insight Tag and related conversion tools can support measurement and audiences under current terms and implementation conditions. See A01. The existence of tracking technology does not authorize collecting sensitive information or bypassing consent. Use test events and inspect the actual data flow. If browser and server routes are combined, follow current deduplication guidance rather than counting the same purchase twice.

Your campaign review should include cost per qualified opportunity, sales effort, collected contribution, and delivery fit, not only cost per form submission. If the campaign attracts students while the service targets company owners, investigate message and audience alignment. If leads fit but do not progress, inspect the offer and sales process. Paid distribution amplifies the current route; it does not remove the need to understand it.

## Plan an X campaign around context and creative

An X campaign should use a clear audience and conversation hypothesis, a native-looking but transparently commercial creative, and a useful destination. The creative can demonstrate a narrow result or explain a practical problem. Avoid assuming that an organic post's popularity guarantees paid conversion. Paid exposure can reach people with different familiarity and intent. Use the same promise-continuity checks as for any funnel.

X's official tracking guidance describes its Pixel and conversion events or API routes under current account and implementation conditions. See A02. Use the actual current documentation and event verification tools when implementing. Do not copy an old pixel snippet into a site and assume purchase tracking is correct. Test event timing, values, currency, and duplicate behavior in the production-like environment you intend to use.

Separate media performance from discussion quality. A campaign can produce clicks that do not become suitable customers, or replies that reveal a mismatch. Review the destination experience and customer questions. If the content is useful organically but not commercially aligned, it may still belong in your educational strategy without receiving paid spend. Not every strong piece needs to become an ad.

## Plan YouTube advertising as a distinct viewing experience

An ad viewer may not have chosen your lesson in the same way as a search viewer. Establish relevance quickly and explain the useful next step. A short problem demonstration can work better than placing a long tutorial unchanged into an ad. The destination might offer a complete sample or a clear workshop page. Keep claims accurate and consider whether the person has enough context to evaluate the invitation.

Google Ads' current video campaign guidance distinguishes objectives and campaign configurations that affect available formats and bidding options. See A03. Those interfaces and campaign families can change. Choose from the current account options and verify conversion setup for the intended objective. Do not assume an older campaign name remains the recommended path or that every video format is available in every configuration.

Review audience quality and downstream behavior. Cheap views may support awareness but do not establish purchase intent. A conversion-oriented campaign needs reliable outcome signals and suitable economics. A broad video audience may need more education than a search audience. The right plan depends on the buying situation and the role of the campaign, not on a universal claim that one platform has the cheapest attention.

## Reconcile attribution and incrementality

Attribution assigns credit according to rules, such as a click or view within a specified window. Incrementality asks what additional outcomes occurred because of the intervention compared with what would otherwise have happened. They are different questions. Two platforms can both claim the same purchase under their attribution windows. Adding their attributed revenue can exceed actual order revenue. Keep order truth separate and document each report's rules.

A holdout or randomized geographic or audience design can sometimes help estimate incremental effects, but design quality, scale, interference, and feasibility matter. A small business may lack enough volume for a precise study. In that case, acknowledge the limit and use conservative economics, customer reports, and bounded tests. Do not convert an advertising dashboard's confidence into a causal claim it cannot support.

Pay attention to time. A consulting campaign may generate a call now and revenue months later. A guide may convert quickly. Evaluate cohorts and cash timing accordingly. If you judge a long-cycle offer after two days, you may stop a useful route; if you attribute every later sale indefinitely, you may exaggerate it. Define the observation window based on the decision process and report unfinished opportunities separately.

## Include cash timing in a scale decision

A campaign can appear profitable on expected contribution while creating a cash shortfall. Suppose a service campaign spends $1,000 this week and generates an agreement worth $4,000, but payment arrives after delivery next month. You may need to fund delivery before receiving cash. Record spend date, agreement date, invoice date, due date, collected date, and delivery cost timing. A signed proposal is useful evidence of commitment, but it cannot pay a current bill. A cash forecast should use actual payment terms and conservative collection assumptions.

Payback is the time required for collected contribution to recover acquisition cost under the defined model. A one-time guide may pay back quickly if the first order contributes enough. A subscription may require several months, exposing you to cancellation and cash needs. Do not compare payback across offers without including the same costs and time horizon. A business with limited cash may reasonably prefer a lower-growth route that recovers investment sooner. This is a constraint decision, not a failure of ambition.

Keep a simple sensitivity table. Compare conservative, central, and optimistic assumptions for purchase rate, contribution per customer, delivery hours, and payment delay. Identify which input changes the decision most. Then ask which of those inputs can be measured or improved next. Sensitivity analysis does not assign probabilities to the scenarios or prove that the optimistic case is likely. It shows where uncertainty matters, helping you choose a smaller test or preserve a cash buffer before expanding spend.

## The 100-hour measurement practicum

Use fourteen study hours to define metrics, reproduce calculations, inspect current official implementation guidance, and analyze examples of misleading reports. Write an event dictionary and identify the source of truth for transactions, calls, and refunds. Keep unavailable data marked as missing. Explain how each measure supports a specific decision.

Use sixteen guided hours to work through the synthetic dataset, compare funnel populations, calculate costs and contribution, and inspect Wilson intervals. Design one randomized experiment in principle and one honest observational improvement cycle. Explain what each could establish. Use the companion to test zero denominators, small samples, and unrealistic inputs, then interpret the results in plain language.

Use thirty-eight production hours to create the measurement plan, naming convention, experiment register, dashboard specification, and one paid plan for each platform. The plans should include audience, creative, destination, objective, tracking, economics, budget rationale, stop conditions, and review. They remain reviewable plans unless you separately choose to implement them. No account connection or spend is implied by completing the documents.

Use twenty-two field hours to test available analytics and permitted sandbox or test transactions, inspect real data where you have access, and conduct a bounded experiment if feasible. Otherwise use the supplied synthetic dataset and label the result as an analysis exercise. Do not present synthetic outcomes as your campaign performance. Record which parts were executed and which remain conceptual.

Use ten review hours to deliver a measurement memo containing financial reconciliation, strongest evidence, uncertainty, bottleneck diagnosis, and the next decision. Chapter 10 integrates the system into a sustainable operating practice and a capstone that demonstrates both commercial reasoning and actual delivery readiness.
