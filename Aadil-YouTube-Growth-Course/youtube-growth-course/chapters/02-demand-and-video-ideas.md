# 02 — Find demand and build a library of ideas

Your first production decision is also your most consequential: which problem deserves a video? A polished explanation of a problem nobody in your intended audience currently cares about has a weak starting position. A plain but useful demonstration of a painful problem has something real to improve. This chapter teaches you to find that second kind of opportunity, turn it into a testable promise, and maintain enough ideas that publishing never depends on inspiration arriving on Tuesday.

The prerequisite is the audience decision from Chapter 1. The working audience here is developers who know some Python or TypeScript and want to build useful AI powered browser or web tools while understanding what makes them reliable. Your browser extensions, fullstack projects, technical notes, and first principles ML writing make that a credible starting hypothesis. Credible does not mean proven demand. This chapter establishes the process that tests it.

By the end, you will have three audience problem maps, a ranked backlog, a first twelve video sequence, and a method for choosing next week's video in under an hour. The companion's [idea scorecard](../companion/index.html#idea-score) lets you change priorities and see how rankings move. Its scores are decision aids, not forecasts of views.

## 1. A topic is not yet an idea

“AI tools” is a topic. “Developers are accepting generated tests that pass without checking the behavior they care about” describes a problem. “I gave an AI coding assistant a deliberately broken browser extension, then tested whether its fix actually worked” is an idea. The final sentence contains a viewer, a conflict, an observable method, and a possible outcome. Those ingredients give the viewer a reason to choose your video over another tab.

Treat an idea as a small contract. The viewer brings time and attention; you promise a useful change in understanding, ability, or judgment. Write the contract before you write the script: “After watching, a developer can distinguish valid structured output from correct application behavior and can add one test that catches the difference.” You can inspect whether you have fulfilled that contract. You cannot inspect whether you have fulfilled “talk about AI.”

Begin with the moment before the video is needed. A learner has a generated JSON object, but the application displays the wrong answer. A freelancer has a client request for an AI assistant but cannot estimate its running cost. A developer has a working extension that loses its state when its background process stops. These moments are more useful than broad demographic descriptions because they suggest what to show on screen and what the next useful product might be.

Now separate the problem from your preferred solution. If you love neural networks, you may translate every audience complaint into “they need an ML fundamentals course.” Sometimes they need a five line validation function or a clearer mental model of asynchronous work. Start with the smallest satisfying intervention. You can earn permission to teach deeper material after the learner sees why it matters.

## 2. Build three problem maps before choosing three channels

The user asked for at least three channel concepts. That does not make launching three channels at once a good experiment. Three separate feeds split your learning, publishing capacity, and social proof. Use three concept lanes to compare opportunities, then select one audience promise for the first twelve long videos. Keep the alternatives available if evidence points elsewhere.

| Concept lane | Viewer situation | Distinctive proof you can develop | Likely natural next step |
| --- | --- | --- | --- |
| Practical AI engineering for builders | “The demo works, but can I trust it in a real tool?” | Reproducible tests, failure cases, cost and latency measurements | Evaluation checklist, implementation workshop, scoped consulting |
| Browser tools that solve everyday problems | “I want to ship an extension or small web utility.” | Your own extensions, architecture walkthroughs, debugging sessions | Starter kit, technical notes, code review or tutoring |
| ML intuition turned into working code | “I can call a library, but do not understand the model.” | Your first principles writing, small numerical examples, readable notebooks | Guided notes, tutoring, project study group |

These are original positioning proposals inferred from your public work, rather than a claim that any one will produce a particular revenue. Your [portfolio](https://aadilmallick.com/) establishes the intersection of fullstack and AI/ML work; the project descriptions are evidence of topics you can investigate, not proof of enterprise results. The [tools page](https://aadilmallick.com/tools) supplies concrete demonstration material. Verify the current behavior of a project before filming it.

For each lane, write five rows in a problem map. A row contains the viewer's words, the triggering event, the current workaround, the cost of remaining stuck, and what satisfying evidence would look like. For example: “My generated extension keeps forgetting its settings; it happens after I close and reopen the browser; I reload it until it works; I cannot publish it confidently; I need a visible reproduction and a fix that survives a restart.” This row is already closer to a strong video than a page of keywords.

Do not assume the most financially valuable viewer is always the best first viewer. An experienced engineering manager may have purchasing power but expect evidence you have not developed yet. A TypeScript developer building a first extension may be easier to help accurately and may buy useful notes. Start where your demonstrated competence meets a problem you can solve repeatedly. Your authority can expand through the public evidence you create.

## 3. Understand the three kinds of demand

Search demand starts with an explicit question: “Chrome extension storage not persisting.” The viewer already wants a solution. Your job is to make the fit obvious and get to the useful answer. Search demand is well suited to early authority building, although some questions have a small audience or are answered quickly without producing lasting interest in the channel.

Browse demand starts with a latent concern or curiosity: “This extension worked until I closed the browser.” A viewer did not type the problem but recognizes its significance. The packaging has to make the consequence understandable without assuming prior context. This can reach more people than a narrow error message, but the content must fulfill the wider promise.

Relationship demand starts with trust in you: “I want to see how Aadil approaches this.” It supports updates, live sessions, and more exploratory work. A new channel has relatively little relationship demand, so “my thoughts on the latest model” asks strangers to care before you have demonstrated why they should. Give them a useful experiment first. Personal perspective becomes more valuable when attached to observed work.

YouTube describes Search as matching the query and engagement for that query, while recommendations consider the viewer and the content's relevance and performance. That supports choosing the viewer situation before optimizing metadata. It does not imply that you can mechanically manufacture distribution with keywords. [YouTube performance FAQ](https://support.google.com/youtube/answer/141805?hl=en).

An early portfolio might contain six solution oriented videos, four experiment or comparison videos, and two deeper explanations. Those are curriculum recommendations, not platform requirements. At your starting capacity of eight to ten hours a week, twelve videos can be a roughly six month season, not a requirement for the first ninety days. The baseline ninety day plan is six long videos, with additional output only after your measured workflow becomes faster. The mix gives you different discovery opportunities while keeping the same viewer. The extension tutorial, AI code test, and ML explanation belong together only if the same person can reasonably want all three.

## 4. Research without becoming a full time researcher

Allocate a recurring forty five minute research block. Spend fifteen minutes collecting audience problems, fifteen examining existing solutions, and fifteen converting observations into briefs. A time limit prevents research from becoming a pleasant substitute for finishing videos. Save unresolved questions instead of opening twenty more tabs.

Start with direct evidence you already encounter: questions on your own tutorials, issues in your own repositories, tutoring questions you have permission to generalize, and difficulties from your own building process. Strip private details and use synthetic data. A real problem does not require exposing a real customer's environment. Record what failed, why it matters, and whether a small independent demonstration can reproduce it.

Use YouTube search next. Type the problem in ordinary language, then one technical variation. Examine results for fit, age, scope, and the skill level assumed. The presence of existing videos is not a reason to stop; it establishes that someone has invested in addressing the problem. Your opening may be narrower, more current, more testable, easier to follow, or connected to a concrete tool.

Inspect comments as qualitative research, not a representative survey. A comment saying “please explain deployment” tells you one visible viewer asked. It does not tell you how many silent viewers need it. Save an anonymized paraphrase and the public source link for your own research. Look for repeated obstacles across independent places, and avoid treating emotionally vivid complaints as necessarily common.

The current official Studio route is **Insights → Research** on desktop. Its documented filters include content type, upload date, subscriber count, duration, channel age, outlier score, and what your viewers watched elsewhere. Older accounts or rollout states may still expose a Trends surface; YouTube's older help page explicitly flags changes beginning July 2026. Use whichever your account actually shows. [Research content and find trends](https://support.google.com/youtube/answer/17232321), [Trends rollout note](https://support.google.com/youtube/answer/11962757?hl=en).

If a new channel has limited audience data, do not interpret an empty audience report as zero demand. Use the platform's broader results, direct questions, and your initial publishing tests. Native research is an observation tool; it cannot tell you whether you can deliver a convincing demonstration or whether its viewers will buy your notes.

## 5. Read competitor evidence carefully

Record the title, publication date, duration, broad format, visible premise, and public view count at the time you inspect a result. Keep your observation date. Public numbers change, and videos of different ages have had different opportunities to accumulate views. Avoid comparing a two year evergreen tutorial with yesterday's news as if they ran the same experiment.

For a manual relative performance proxy, choose a video's public views and divide by the median views of a reasonable set of recent, comparable videos on that same channel. If the selected video has 24,000 views and the comparable median is 8,000, the proxy is three. Median means the middle value after ordering the observations; it is less distorted by one giant hit than an average. This is your approximation, not a reconstruction of YouTube's native outlier formula.

Exclude incomparable livestream archives, Shorts, and unusually old uploads when making that small comparison. Write down every exclusion so you do not secretly choose a comparison set that supports your favorite idea. A three times result may reflect a topic, an unusually strong title, a collaboration, outside promotion, or something you cannot see. It identifies a candidate worth studying; it does not identify a cause.

Look at misses as well as hits. If a creator has five AI tool comparisons and only one attracted broad attention, ask what differentiates its viewer problem. Do not copy the single title and conclude that all comparisons work. A useful research set includes at least a few ordinary performers from the same creator. Learning only from winners produces a distorted sense of how reliably a format succeeds.

## 6. Use a scorecard that rewards evidence

Rate each candidate from one to five on six dimensions: audience pain, observed demand, proof you can show, fit with the channel promise, useful next step, and production feasibility. A five in proof means you can already reproduce the relevant behavior. A one means the idea relies on a claim you have not checked. Feasibility is high when you can finish within the weekly capacity, not when the idea sounds impressive.

Use this starting formula: weighted score equals three times pain plus two times demand plus three times proof plus two times fit plus two times useful next step plus feasibility. The highest possible result is sixty five. These weights are an editorial preference for useful, demonstrable work. They have no statistical relationship to expected views. Change them when your actual constraint changes.

Consider three candidates. “The ten best AI tools” scores pain two, demand four, proof two, fit three, next step two, feasibility three. Its result is thirty three. “I tested whether generated extension code survives a restart” scores four, three, five, five, four, four. Its result is fifty five. “Build a transformer from scratch over eight hours” scores four, three, two, three, four, one, yielding thirty nine. The second idea wins because you can show a specific, valuable result within your capacity.

If your enthusiasm disagrees with the score, inspect the assumptions. You may have underrated personal motivation, or overestimated demand from a few popular videos. Add a short note rather than gaming every score until your favorite wins. A scorecard should expose reasoning to future review. It should not let a spreadsheet pretend to know what only publishing can reveal.

Maintain a separate evidence grade: **A** for repeated direct questions plus a working reproduction; **B** for several plausible public signals and a feasible demonstration; **C** for your untested hypothesis. A high score with grade C is an experiment, not your safest next upload. Keep a mix: mostly well supported ideas, with room for a small number of ambitious tests.

## 7. Turn one problem into a content cluster

Suppose you choose “AI generated extension code works once but fails later.” Make the primary video a clear experiment: build a tiny extension, run a lifecycle test, inspect the failure, and show the corrected design. Its main promise is reliability. The free supporting resource is the test checklist. The technical notes product can contain the broader architecture patterns, if you actually develop and maintain them.

The same research can support a short explanation of why background work can stop, a follow up on persistent storage, and a deeper tutorial on separating interface state from durable data. These are not four copies of the same video. Each answers a different question at a useful level. Avoid stretching one small lesson into a month merely to fill the calendar.

Create the sequence in dependency order. Show the failure before you teach the abstraction. Explain what must survive before comparing storage mechanisms. Teach how to verify persistence before discussing automated testing. This order gives viewers reasons to continue into the next video because each one resolves a problem created or clarified by the previous one.

Do not turn every cluster into a serialized course that requires episode one. A viewer should understand the current video's problem without homework. Use a twenty second recap and link the prerequisite for those who want more. Your library can be coherent without making discovery feel like joining a class halfway through a semester.

## 8. Seventy two original video ideas

These are proposed working premises, not reports of tests already performed. Difficulty refers to production and demonstration complexity: **L** means a focused demonstration; **M** requires a tested small project; **H** requires substantial evaluation, visual teaching, or multiple environments. Business intent describes the relevant next step, not permission to sell before the resource exists. The three lanes should be tested on paper before choosing your initial channel promise.

### Lane A: practical AI engineering for developers

| # | Working title or premise | Viewer and pillar | Difficulty | Relevant next step |
| --- | --- | --- | --- | --- |
| 1 | The AI returned valid JSON. My app was still wrong. | App builders; output evaluation | M | Validation checklist |
| 2 | I gave a coding agent five failing extension tests | TypeScript developers; AI code review | M | Test harness notes |
| 3 | A prompt change broke yesterday's working feature | AI app builders; regression testing | M | Evaluation template |
| 4 | RAG versus a plain search box on the same small dataset | Web developers; architecture judgment | H | Decision worksheet |
| 5 | I measured the hidden latency in my AI note taker | Product builders; performance | M | Profiling notes |
| 6 | Can a small model finish this narrow developer task? | Cost conscious builders; model choice | H | Benchmark worksheet |
| 7 | Stop calling the model when ordinary code will do | Python developers; system design | L | Automation recipes |
| 8 | My coding agent fixed the symptom and missed the bug | Developers; debugging judgment | M | Review checklist |
| 9 | What I log when an AI feature gives a bad answer | Early AI builders; observability | M | Logging starter |
| 10 | An AI feature needs an off switch: build the fallback | App builders; reliability | M | Architecture workshop |
| 11 | I built the same tiny feature manually and with AI | Working developers; measured workflow | M | Process notes |
| 12 | Why my AI comparison uses the same tasks every time | Tool shoppers; evaluation literacy | L | Public test protocol |
| 13 | The difference between a schema and a useful answer | Fullstack developers; correctness | L | Coding notes |
| 14 | Turn a vague AI request into an acceptance test | Freelancers; requirements | L | Scoping worksheet |
| 15 | I made my note extractor show its evidence | AI product builders; trust | M | Source tracing template |
| 16 | A tiny dataset is enough to reveal this failure | Developers; evaluation design | M | Dataset worksheet |
| 17 | Before you add an agent, draw the boring workflow | Solo builders; automation boundaries | L | System design notes |
| 18 | I retried a failed AI request and doubled the bill | AI developers; retry behavior | M | Reliability checklist |
| 19 | A developer's guide to judging AI tool demos | Tool users; critical evaluation | L | Newsletter |
| 20 | Which tasks should never enter my AI demo dataset? | Builders; data handling | L | Synthetic data guide |
| 21 | Can an AI assistant explain code it cannot run? | Learners; evidence and limitations | M | Debugging notes |
| 22 | My AI feature got better after I removed a prompt | App builders; simplification | M | Architecture walkthrough |
| 23 | I tested an AI summary against the actual source | Knowledge tool builders; accuracy | M | Summary evaluation sheet |
| 24 | A useful AI code review starts before the first prompt | Developers; development workflow | L | Review workshop |

### Lane B: browser extension and small web tool engineering

| # | Working title or premise | Viewer and pillar | Difficulty | Relevant next step |
| --- | --- | --- | --- | --- |
| 25 | Build a timestamp bookmarker that survives a restart | Extension learners; durable state | M | Extension notes |
| 26 | My extension worked until its background work stopped | JavaScript developers; lifecycle | M | Debugging checklist |
| 27 | Screen recording in the browser: what actually gets saved? | Web developers; media fundamentals | M | Media API notes |
| 28 | A screen recorder can fail before recording starts | Browser builders; permissions and errors | M | Failure matrix |
| 29 | Save a useful file offline, then turn the network off | Web developers; offline behavior | M | PWA starter notes |
| 30 | The small tool I would build before a SaaS dashboard | Solo developers; scope control | L | Scoping template |
| 31 | One keyboard shortcut, one real productivity problem | Extension beginners; focused UX | L | Starter project |
| 32 | Build an import/export feature users can trust | App builders; data portability | M | Implementation notes |
| 33 | Your extension popup is not a database | Beginners; state architecture | L | Technical notes |
| 34 | I tested my extension with an empty storage state | Developers; edge cases | L | Test checklist |
| 35 | A local only tool still needs a threat model | Browser developers; responsible design | M | Design worksheet |
| 36 | Why I made this tiny tool without a framework | Web developers; tradeoffs | L | Vanilla TypeScript notes |
| 37 | Turning a browser API into a reusable TypeScript class | Intermediate developers; abstraction | M | Code patterns pack |
| 38 | A download button that explains failure | UI developers; usable error handling | L | UX checklist |
| 39 | I redesigned my bookmarker around one user task | Tool builders; product thinking | M | Product teardown |
| 40 | How I would test a screen recorder before sharing it | Developers; media testing | M | Release checklist |
| 41 | Browser permissions: ask at the moment they make sense | Extension developers; permission UX | M | Review session |
| 42 | I moved this tool's state out of the interface | JavaScript developers; architecture | M | Notes product |
| 43 | Build a tiny tool that works with keyboard only | Frontend developers; accessibility | M | Accessibility worksheet |
| 44 | My first extension release checklist, demonstrated | Shipping learners; release process | M | Checklist download |
| 45 | A real bug from my own tool, reproduced from zero | Developers; debugging | M | Tutoring |
| 46 | One tool, three storage requirements, different choices | App builders; requirements | M | Architecture notes |
| 47 | When a browser utility should stay a utility | Side project builders; product scope | L | Newsletter |
| 48 | From a support question to a tested extension fix | Builders; feedback loop | M | Code review service |

### Lane C: ML intuition to working code

| # | Working title or premise | Viewer and pillar | Difficulty | Relevant next step |
| --- | --- | --- | --- | --- |
| 49 | One neuron, one prediction, every number explained | Python learners; ML foundations | M | Worked notes |
| 50 | Gradient descent with four points and a visible mistake | Developers; optimization | M | Notebook |
| 51 | Why a model can be accurate and still be useless | ML beginners; evaluation | M | Metrics worksheet |
| 52 | I changed one label and watched the boundary move | Learners; model behavior | M | Interactive notebook |
| 53 | Train/test leakage using a tiny fake dataset | Developers; evaluation reliability | M | Data checklist |
| 54 | A confusion matrix that answers a real product question | ML learners; metrics | L | Digital notes |
| 55 | What a learning rate actually changes | Python learners; optimization | M | Visual worksheet |
| 56 | From a handwritten derivative to a training step | Math curious developers; gradients | H | Tutoring |
| 57 | Why we standardize features, shown with two scales | Beginners; preprocessing | M | Notebook |
| 58 | A decision tree I can explain without a library | Developers; interpretable ML | M | Notes product |
| 59 | Overfitting is easier to see on twelve examples | Learners; generalization | M | Experiment workbook |
| 60 | Build a baseline before training something impressive | AI learners; scientific judgment | L | Project guide |
| 61 | Embeddings are useful before you understand every equation | App builders; representation | M | Follow up lesson |
| 62 | When cosine similarity gives a surprising neighbor | AI builders; retrieval judgment | H | Evaluation worksheet |
| 63 | A neural network does not understand your column names | Beginners; data representation | L | Technical notes |
| 64 | One batch, one loss, one update, no hidden steps | Python learners; training loop | M | Guided notebook |
| 65 | I broke a training loop in three different ways | ML developers; debugging | H | Tutoring |
| 66 | Why a random seed does not answer every reproducibility question | ML learners; experiments | M | Research notebook |
| 67 | The smallest ML project worth explaining to a client | Freelance developers; communication | M | Scoping worksheet |
| 68 | Read this plot before celebrating model accuracy | Beginners; error analysis | L | Study notes |
| 69 | I translated my neural net article into a visual lesson | Your readers; teaching | M | Article and notes |
| 70 | A model's confident answer can be wrong | AI learners; uncertainty | M | Evaluation guide |
| 71 | Three ways to explain the same gradient | Math learners; intuition | H | Tutoring |
| 72 | From notebook to a tiny browser demo: the missing decisions | ML and web builders; productization | H | Workshop waitlist |

These premises deliberately avoid promising salaries, universal time savings, or “best model” rankings you cannot support. They make technical work visible. Replace an outcome driven title with a neutral experiment title if the result has not happened. You earn a claim by running the test, not by needing a more clickable sentence.

## 9. Select a first twelve video season

For the recommended practical AI engineering lane, choose ideas 1, 2, 8, 14, 25, 26, 3, 13, 23, 17, 40, and 72 as a candidate season. This mixes AI evaluation with your stronger concrete browser project evidence. It also gives the learner an arc: define correctness, reproduce failures, build a reliable tool, then judge more complex systems. Review feasibility before committing to the last two.

The first video should make the channel's promise unmistakable. “The AI returned valid JSON. My app was still wrong” can show a synthetic note extraction output that satisfies its shape but assigns a quote to the wrong source. The viewer sees the bug, learns the distinction between format and meaning, and leaves with one test. You do not need a broad introduction to the channel first.

The second should demonstrate that your first video's rigor is a repeatable habit. A small set of extension tests gives you an observable protocol, while the third can explore a missed bug. When the sixth video discusses a browser lifecycle issue, connect it explicitly to the same audience concern: generated code needs systems understanding. That connection prevents the channel from feeling like an unrelated collection of interests.

For a browser engineering season, start with ideas 25, 33, 34, 26, 32, 38, 41, 44, 27, 28, 40, and 48. For an ML teaching season, start with 49, 50, 55, 64, 59, 53, 54, 51, 60, 57, 58, and 69. Choose one as the main promise rather than interleaving three entirely different beginner sequences.

## 10. Write a one page brief before committing

A brief is the bridge between research and scripting. Give it a working title, intended viewer, problem, promised result, required proof, opening demonstration, three teaching beats, useful next action, production limit, and stop condition. A stop condition states what would make the premise invalid. For an AI benchmark, it might be “I cannot create a fair task set within two hours,” which signals that the current video is too broad.

Here is a complete brief in prose. The viewer is a TypeScript developer building a note extraction feature. The problem is that valid structured data can still contain a source error. The promise is to add a small evaluation that catches one meaningful failure. The proof is a synthetic dataset with expected sources, the generated output, and a failing assertion before the fix. The opening shows the wrong source highlighted beside valid JSON. The body explains shape, behavior, and test design. The ending offers the demonstrated checklist and a follow up on regression tests. Total production allowance is ten hours. No reliability percentage is promised from a tiny dataset.

This brief does two things a topic list cannot. It defines the evidence you need before recording, and it makes the editing target visible. If a section does not help the viewer understand or reproduce the evaluation, it probably belongs in a different video or in the downloadable notes. You can still include personality, but it should help the viewer remain oriented.

## 11. Develop ideas with AI without outsourcing judgment

An assistant is useful for generating alternative audience questions, finding missing assumptions, and turning a vague premise into several testable versions. Give it your actual audience, available evidence, and capacity. A prompt that says “give me viral AI video ideas” supplies almost none of the constraints that make a useful idea yours.

Use a prompt such as: “I teach TypeScript developers to ship reliable AI browser tools. I can demonstrate a timestamp bookmarker, a screen recorder, and a synthetic note extractor. Generate twelve specific viewer problems. For each, give a claim I can test in one afternoon, the evidence needed, one misconception, and a relevant free worksheet. Do not invent results, audience statistics, income, or current product capabilities. Flag where primary documentation is required.” This is a prompt for your later work, not a research action already performed.

Then select three suggestions and challenge them. Ask what a skeptical developer would say, what would make the result misleading, and whether the same question can be answered more clearly without AI. Check documentation directly and run the technical demonstration yourself. A language model can generate plausible premises that collapse under testing. Catching that before filming is an advantage of your engineering background.

## 12. Keep the backlog healthy

Maintain five states: inbox, researched, demonstrable, scripted, and published. Do not fill the scripted column with thirty videos whose topics will become stale. Keep a larger inbox and a small ready queue. Two demonstrable evergreen ideas and one timely candidate are a useful starting buffer for a solo creator with a job.

Once a month, retire ideas that no longer fit. An idea can be interesting and still attract a different audience from the one you are building. Save it in an archive with a reason rather than repeatedly reconsidering it. This reduces the emotional cost of saying no. Your backlog exists to reduce decisions, not create a permanent collection of obligations.

After each release, add actual audience language to the next brief. A comment asking “How would this work with multiple tabs?” is a concrete possible extension. If several viewers misunderstand the same term, clarify it in the next video rather than assuming they need a separate hour long course. Small, direct follow ups can teach you more than a large speculative series.

## 13. Application project and acceptance checks

Set aside two sessions. In the first, write fifteen problem rows across the three lanes and collect ten public observations with dates and direct links. In the second, score twelve ideas, reproduce the evidence for your top two, and write a complete brief for one. You are producing a usable editorial decision, not trying to prove that your first niche choice is permanent.

A finished backlog has a named viewer for every ready idea; a visible result the viewer will receive; a feasible demonstration; a production limit; an appropriate next step; and a note distinguishing observed demand from your hypothesis. A brief fails review if its title requires a result you have not obtained, if the viewer changes halfway through, or if its product pitch solves a different problem from the lesson.

Use the companion's [idea scorecard](../companion/index.html#idea-score) to compare a safe evergreen tutorial with an ambitious experiment. Change feasibility and proof scores, then explain why the ranking changed. The meaningful learning is the tradeoff you can articulate. No calculated score can substitute for the next published video and the response it receives.

The handoff to Chapter 3 is a single sentence: “This specific viewer should choose this specific promise because I can show this specific proof.” With that sentence, titles and thumbnails become a communication problem you can solve. Without it, packaging work tends to become decoration around a vague topic.
