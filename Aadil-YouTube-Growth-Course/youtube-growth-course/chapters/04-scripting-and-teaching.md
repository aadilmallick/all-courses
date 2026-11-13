# 04 — Script videos that make engineering understandable

[Course home](../README.md) · [Previous: Packaging](03-titles-thumbnails-and-creators.md) · [Next: Filming](05-filming-and-audio.md)

## The problem: your knowledge is not yet a viewing experience

Imagine that you have built an extension that turns selected video notes into study cards. The code works, you have interesting opinions about AI, and you can explain the architecture. You record yourself opening the editor, installing dependencies, describing the files, and eventually running the extension. The result is accurate, yet a new viewer has little reason to stay through the setup. They do not yet know what the extension does, why its design matters, or which part of the explanation will help them. You have recorded your development process. You have not yet designed their learning process.

A script connects the viewer's starting problem to a satisfying result. Its purpose is to decide what a viewer needs to see, understand, feel curious about, and do next. It can be a word-for-word document, a sequence of speaking points, or a two-column plan containing narration and visuals. The format matters less than the decisions it contains. For your channel, a dependable script makes a small engineering project understandable without hiding the uncertainty that makes real engineering interesting.

This chapter assumes you already have a viewer hypothesis, an idea, and a truthful working title. It does not assume you are a confident performer. By the end, you will have a usable script, a shot plan, a fact-check record, and a repeatable method for explaining code. Your background in technical writing and first-principles explanations is useful here. The adjustment is to write for an ear and a small screen, where the viewer cannot easily reread a dense paragraph while new information continues arriving.

Our recurring project is an **AI bookmark-to-study extension**. In the teaching example, a user supplies a small, permitted text excerpt and a timestamp, the system proposes study cards, and deterministic checks reject invalid card structure. This chapter does not provide a production extension or assert that any model is accurate. Its subject is how to explain and demonstrate such a project honestly. Use synthetic notes for the demonstration so the recording is reproducible and does not require copying someone else's transcript.

## Begin with a promise and a proof

Write the viewer's change in one sentence: “After watching, a junior developer can explain why checking AI output structure is different from checking whether its claims are true.” This is narrower than “understand AI agents.” It gives the video a finish line. A viewer who reaches it has learned something useful even if they never download your code or buy your notes.

Then decide what would count as visible proof. A claim such as “validation catches errors” can be shown through a deliberately malformed response failing a test. A claim such as “this saves time” needs an actual timed comparison with a stated procedure. A claim such as “this is the best model” needs an evaluation design strong enough to support that conclusion, which is usually much more work than a small channel can justify. When evidence is expensive, narrow the claim. “Here is what happened on my ten example inputs” is often more useful and more defensible than a universal ranking.

The promise and proof should agree with the packaging. If the title promises “I stopped my AI extension from inventing study cards,” a schema validation demonstration alone does not establish that invention has stopped. A schema can reject a missing field while accepting a beautifully formatted false statement. Either expand the implementation and evaluation or change the title to “My AI extension kept breaking—this check caught the easy failures.” The script is where you discover that a compelling title has become technically misleading.

Use a short evidence brief before drafting narration:

| Decision | Worked example |
| --- | --- |
| Viewer | Developer comfortable with functions and JSON, new to AI application reliability |
| Starting frustration | A demo works once, then breaks when the model returns a different shape |
| Promise | Separate structure checks from truth checks and implement the first boundary |
| Proof | Known malformed response is rejected; plausible false response still passes |
| Boundary | This is a teaching prototype using supplied text, not production learning advice |
| Useful next action | Try the same two failure cases against their own output format |

This table is a creative constraint, not a form to publish. It prevents three common scripting errors: explaining a technology before a problem exists, promising a result the demonstration cannot support, and ending with an unrelated product pitch. It also tells you what research you still need. If you cannot explain a boundary in plain language, investigate it before you perform confidence on camera.

## Understand the viewer's information budget

New information has a cost. A viewer learning an unfamiliar architecture must remember the components, connect them to the demonstration, read code, and follow your narration. Increasing speaking speed increases the rate at which you ask them to do that work. Fast editing can make a familiar idea lively; it can also make a new idea impossible to understand.

Treat each explanation as a sequence of small changes to a shared mental model. First show an input. Next show an output. Then show a failure. Finally introduce the smallest mechanism that addresses that failure. For the extension, begin with a supplied sentence and one study card. Only after that introduce the model boundary, the proposed output, and the validator. The viewer now has concrete objects to attach the architecture to.

The useful unit is a **beat**: one meaningful step in the viewer's understanding. “A model returns text” is one beat. “We ask it for fields named question, answer, and source timestamp” is another. “It can still put the wrong claim inside those fields” is a third. These may fit in fifteen seconds or require a minute. There is no universal rule that a cut must happen every few seconds. Cut or change the visual when it helps the viewer follow a beat, see evidence, or notice a contrast.

Avoid presenting new code and a different conceptual explanation at the same time. If you show a schema, talk about its fields. If you need to explain hallucination, replace the schema with a concrete false card and highlight the unsupported statement. The viewer should not have to decide whether to read the screen or listen to a competing sentence. Captions support comprehension and access, but they do not eliminate competing visual demands.

For a mathematical topic, use the same principle. Start an ML explanation with three labeled examples and one prediction before showing a loss function. Explain what the prediction error means on those examples. Introduce the formula only when it compresses a relationship the viewer has already seen. Your applied mathematics background can make this a strength, provided the video establishes the prerequisites rather than assuming the audience shares them.

## Build a sequence of questions with actual answers

A useful engineering story has a goal, an obstacle, an attempt, an observation, and a decision. This structure works because engineering itself involves uncertainty. You do not need manufactured drama. “I assumed a correct JSON shape meant a correct card; this counterexample showed why that was wrong” contains enough tension.

List the questions a viewer will naturally ask in order. For the extension these might be: What does the finished thing do? What breaks? Why does it break? What can we check? What remains uncertain? When should I use this? Each section should answer its current question before opening the next. An unresolved question can create curiosity, but stacking five unanswered questions creates confusion.

Use transitions that carry a reason. “Now let's talk about validation” names the next section. “The card looks fine, but the renderer crashes because one field is missing; we need a check before the UI trusts this response” explains why the next section exists. The second transition helps both retention and understanding because the viewer knows what problem the mechanism will solve.

The first thirty seconds deserve deliberate work because they establish whether the clicked promise is being fulfilled. They are not a magic performance threshold. A practical opening for your channel can contain a visible result, a specific failure, and the question the video resolves. Skip a long biography, logo animation, and a summary of everything you plan to cover. If credentials matter, introduce the relevant experience in a sentence when it helps interpret the evidence.

Write three openings before choosing one. A result-first opening shows the extension creating cards, then shows a wrong card. A problem-first opening shows the crash and explains its cost. A curiosity-first opening asks why a perfectly valid object can still be a bad study aid. Read each aloud. Choose the one that reaches the video's real issue fastest while remaining clear to the intended viewer. Novel wording is less important than an understandable reason to watch.

## An eight-minute teaching script, with a production plan

The following is an original worked script for a video tentatively titled **“Valid JSON Can Still Be Wrong: Fixing My AI Study Tool.”** The timestamps are an editing plan, not a claim that the words will land at exact times. At roughly 130–150 spoken words per minute, pauses and demonstrations make an eight-minute finished video plausible. Rehearse it and revise the timing to match your delivery. The staged failures are labeled as test cases; do not imply they were spontaneous model outputs.

### 0:00–0:35 — A visible contradiction

**Visual:** A simple study-card preview appears beside the supplied note: “A binary search needs a sorted collection.” Show a staged card with an unsupported answer, clearly labeled “deliberate test case.”

**Narration:** “This card has every field my app asked for. It has a question, an answer, and a source timestamp. It is also wrong. I am building a small tool that turns my notes into study cards, and my first instinct was to solve reliability by making the model return tidy JSON. That helps, but this example shows the boundary. In the next few minutes, we will catch a broken response, then watch a different bad response pass the same check. By the end, you will know what validation protects and what it cannot promise.”

**Why this works:** The contradiction is visible before the abstract term becomes important. The opening promises understanding rather than an unrealistic guarantee of perfect AI. The deliberate test label protects the distinction between an engineered counterexample and empirical model behavior.

### 0:35–1:20 — Establish the smallest system

**Visual:** Three boxes: supplied note → proposed card → user preview. Highlight each as it is mentioned. Keep the architecture small; omit account systems and storage.

**Narration:** “Here is the whole teaching prototype. I supply a short note and the point in the source where I wrote it down. A model proposes one card. My application decides whether that response is acceptable to show. The important word is ‘proposes.’ I am treating this response like data from an outside service, not like trusted code. A card needs a question, an answer, and a source reference. For this example, the note is synthetic and only one sentence long, so we can inspect every claim ourselves. A real transcript introduces more ambiguity, permission questions, and evaluation work.”

**Production note:** Keep a static readable diagram for the final sentence. Do not animate every word. The viewer needs a moment to understand that the application and the model perform different jobs.

### 1:20–2:10 — Show a failure that structure checking can catch

**Visual:** Display a response that lacks the answer field. Show the UI's expected fields beside the actual object. Use one colored outline around the omission.

**Narration:** “First, I send the app a known bad response with the answer missing. I wrote this fixture deliberately so the test is repeatable. Without a boundary check, the rest of the app discovers the problem later. Maybe the card is blank. Maybe another function crashes. Either way, the user sees a failure that our program could have caught earlier. A structure check asks a limited question: does this value have the fields and types that the application expects? It does not need to understand binary search to notice that the answer is absent. This is the easy class of failure, and easy failures are worth catching consistently.”

**Teaching note:** “Fixture” means a prepared example used for a test. Define it verbally if this term is unfamiliar to your chosen audience. Otherwise, replace it with “saved test input.”

### 2:10–3:05 — Explain the boundary before displaying implementation

**Visual:** Return to the three-box diagram. Insert a gate between proposed card and preview. Show green “accepted structure” and red “rejected structure” paths.

**Narration:** “I put the check here, before the response enters the card interface. The check returns either a usable card or an explicit error that the UI can explain. This matters because a failed check is a normal outcome of dealing with external data. It should not become an unexplained blank screen. If the answer is missing, I can show ‘The generated response was incomplete—try again or edit your note.’ I also log the kind of failure so I can investigate it. I avoid putting private note text into a public log. The design is small: validate first, handle failure, then let the interface use the accepted data.”

**Production note:** The finished project should determine the exact code shown. Do not display a fabricated API call because it looks plausible. Record your real implementation after testing it, and explain only the lines relevant to this boundary.

### 3:05–3:55 — Demonstrate the first result

**Visual:** Run the missing-answer fixture. Show the failed check and the user-facing error. Then run a structurally complete fixture and show it reaching preview.

**Narration:** “Now the incomplete response stops at the boundary. The renderer receives an error state instead of pretending that an answer exists. Here is a complete response: it gets through. That is already an improvement. We moved an avoidable failure into a controlled path, and we can test that behavior without asking a model to make the same mistake again. But notice exactly what the green result says: accepted structure. It does not say ‘verified learning material.’ If I label this result simply ‘valid,’ it becomes easy for me, and eventually the user, to assume more than the test has established.”

**Teaching note:** Hold the two result labels side by side. The contrast carries the lesson. A flashy transition would add little here.

### 3:55–5:00 — Let a bad answer pass

**Visual:** Run the deliberately false fixture from the opening. Show the check pass, then underline the unsupported answer against the supplied note.

**Narration:** “Now I send our original counterexample through the same check. It passes. That is the correct behavior for this check, because all the required fields exist and contain the expected types. The answer's meaning is outside the question we programmed it to ask. A JSON schema is like checking that a form has a name and date in the right boxes; it does not establish that the story written on the form is true. In this tiny example, we can compare the claim with the note ourselves. In a larger application, we need a separate approach to grounding, evaluation, and review. Adding another model to judge the first one may help in some designs, but it creates another fallible component, not a proof.”

**Production note:** This is the conceptual payoff. Slow down. Use no music under the key distinction if the track competes with speech. Let the viewer read the relevant sentence instead of zooming while they are trying to compare it.

### 5:00–6:00 — Make the useful next design decision

**Visual:** Show a preview with the source excerpt beside the proposed answer and an “edit before saving” action. Label this “prototype design choice.”

**Narration:** “For my prototype, the next useful choice is to keep the source excerpt visible and require review before saving the card. That does not make every error obvious, but it makes the claim inspectable and avoids presenting generated notes as automatically trustworthy. I can also build a small evaluation set: straightforward notes, ambiguous notes, notes with two similar concepts, and notes that do not contain enough information. For each, I record what a useful card would need to preserve. Then I test changes against the same examples. This takes more work than a dramatic demo, but it tells me whether a change improves the particular task I care about.”

**Teaching note:** State which of these features actually exists in your recorded prototype. If the review interface is only a mockup, label it visibly. Never let a polished mockup masquerade as completed functionality.

### 6:00–7:05 — Translate the lesson into a reusable engineering pattern

**Visual:** Two rows: “Can the application use it?” and “Should the learner trust it?” Show separate evidence under each.

**Narration:** “There are two different acceptance questions. First: can my program safely work with this response? Field checks and deterministic tests help answer that. Second: is this response appropriate and correct enough for its purpose? That needs evidence about meaning and consequences. The acceptable error rate for a playful study prototype is not automatically acceptable for medical education or a hiring decision. For your own app, write the questions separately. Decide which failures are cheap to detect in code, which need a task-specific evaluation, and which need a person. If the system cannot meet the task's standard, reducing the scope is a valid engineering decision.”

**Production note:** This section broadens the takeaway without changing the video's subject. Avoid inserting a complete lecture about every AI failure mode. Link to a future evaluation video if you make one.

### 7:05–8:00 — Close the promise and invite the next useful action

**Visual:** Replay the missing-field rejection and the false-card acceptance. End on a short checklist and a related-video space.

**Narration:** “Our boundary check caught the missing answer, and our false answer still passed. Both results make sense once we name the question being checked. That is the change I want you to take into your next AI project: describe exactly what each green check means. If you want to try this, take one output format from your own app and make two saved inputs: one with a broken structure and one with a believable wrong claim. See which checks catch each one. I have included the small checklist and example fixtures with the project notes. The next step is evaluating the meaning of the cards across a consistent set of notes; that is the next video in this series.”

**CTA note:** A call to action is the next requested behavior. If the actual next video does not yet exist, change the final sentence. If you link a lead magnet, tell the viewer what it contains and whether an email address is required. Do not imply a free file is immediately available when it is still a plan.

## Turn the script into an editable document

The script above separates narration from explanation for learning purposes. Your production document can be shorter. Use five columns: beat, spoken idea, visual evidence, asset needed, and status. A status can be “tested,” “needs recording,” or “claim needs source.” This turns an intimidating blank page into a sequence of concrete production tasks.

For example, the first failure beat needs a saved missing-answer fixture, a screen recording of the check, and a readable error state. If the error UI has not been implemented, that becomes visible before filming day. The conceptual payoff needs a saved false fixture and a close view of the supplied note. Your editor should not have to invent evidence that the filming plan failed to collect.

Keep a separate **claim ledger**. Write the claim, the evidence, the date or tool version where relevant, and the limitation. For an AI-tool review, the ledger might say “On this exact input, the tool produced these fields; captured with this model/version and settings; not a benchmark.” For a general programming lesson, it may point to official documentation and a runnable example. The ledger is not the narration. It is your defense against turning a confident phrase into an unsupported assertion.

When the script changes, review the promise again. Suppose the build reveals that your chosen API already supports schema-constrained output. The video may become about the remaining semantic boundary rather than writing a parser. That is a legitimate revision. Preserve the lesson the evidence can support instead of forcing the footage to fit your first headline.

## Write for speech, not for an article

Read a paragraph aloud before polishing it visually. Spoken sentences need clear subjects, concrete verbs, and short enough clauses that you can deliver them in one comfortable breath. “The implementation of validation facilitates the mitigation of undesirable output” becomes “This check catches a missing answer before the UI tries to use it.” The second sentence is easier to say and ties the mechanism to a visible consequence.

Replace vague references with named objects. In writing, “this” may refer to a preceding sentence that a reader can revisit. In video, the viewer may be looking at code and miss the antecedent. Say “this field check” or “the proposed answer” when ambiguity is possible. Repetition of an important noun can improve clarity; repetition of an entire explanation usually does not.

Use the **example–explanation–transfer** pattern. First show the missing-answer fixture. Explain why the UI cannot use it. Then tell the viewer how the same boundary applies to another external response. This sequence helps the abstraction feel earned. Starting with “all untrusted inputs require validation” may be correct, but the concrete failure gives the advice meaning.

Keep your natural vocabulary and humor. A joke can release tension after a difficult explanation or make a failure memorable. It should not replace the explanation, depend on belittling beginners, or imply that every viewer knows a meme. Fireship's compressed humor is a format choice you can study; it is not a requirement to perform the same voice. Your durable advantage can be a calm, precise explanation with one well-chosen joke and a real test.

For your first ten videos, script the opening, transitions, technical claims, and ending word for word. Use bullet points for demonstrations you understand well. This hybrid prevents rambling while preserving an engaged performance. If you discover you become stiff when reading, record one thought at a time from a cue, then check whether the meaning survived. Smoothness is useful; clarity and honesty are essential.

## Code demonstrations need a teaching environment

Your development workspace and your teaching workspace serve different purposes. A developer may need six terminals, a file tree, logs, and several tabs. A viewer needs the current input, the few lines responsible for the behavior, and the result. Prepare a separate branch or copy for the demonstration. Keep an exact record of what changed so the video's simplification does not misrepresent the runnable project.

Choose a readable font size before recording. Rather than trusting the editor's zoom number, export a short sample and view it on a phone. Can you read the identifier that matters without pausing? If not, reduce the amount of code on screen, crop the relevant region, or use a prepared code card. A cropped ten-line example with visible input and output usually teaches more than a tiny entire file.

Do not read every symbol aloud. Explain the line's purpose, then point out syntax only when it is part of the lesson. “This branch handles a rejected response” is useful once the audience knows conditionals. If the audience is a complete beginner, establish the conditional locally before using it. Audience definition determines the appropriate level of explanation.

Show expected output alongside the relevant action. A typing montage can compress setup, but it should not carry a reasoning step. When you skip installation or repetitive boilerplate, say so and provide the actual setup instructions with the project. If a command takes several minutes, cut the wait and show the result with a truthful “after installation” transition. Speeding up a wait is fine; hiding a failure that changes your conclusion is not.

Prepare rollback points. Save a clean starting state, a state with the first change, and the final state. If the demo fails on camera, stop and diagnose rather than trying to rescue the take while narrating. You may later show the failure if it teaches something. You do not owe viewers every minute of troubleshooting, but you do owe them an accurate account of the behavior you claim.

## Use AI as an editorial assistant with bounded tasks

An AI assistant can help identify missing prerequisites, generate alternative openings, simplify a sentence, and check whether a script contradicts its promise. It cannot establish that your experiment ran or that your claims are true. Give it the actual evidence and ask for bounded criticism. A request to “write a viral video” tends to reward exaggerated language and familiar patterns; a request to find unsupported claims is easier to inspect.

Try this prompt with whichever assistant you already use:

> Review this engineering-video script for a viewer who understands functions and JSON but is new to AI applications. The promise is: [state one outcome]. My demonstrated evidence is: [list actual tests and observations]. Identify missing prerequisites, unsupported claims, confusing transitions, and places where narration competes with the visual. Quote the specific sentence, explain the problem, and suggest a precise revision. Do not invent test results, performance numbers, APIs, credentials, or sources. Preserve my voice. Return the five highest-impact revisions first.

This is a suggested prompt, not a tool action performed by the course. Replace the bracketed fields before using it. Avoid supplying private customer material or employer code to a cloud tool unless your actual permissions allow that use. For the worked extension, synthetic notes are sufficient and remove a source of unnecessary complexity.

Then ask for three openings with different structures, but supply your claim ledger. Evaluate the output against the promise rather than selecting the most dramatic phrase. If an assistant writes “this one trick fixes hallucinations,” discard or rewrite it because your experiment demonstrates a narrower result. AI-generated certainty is still your responsibility when you publish it.

Use automated transcription as a diagnostic after a rehearsal. Read the transcript without the visuals. Is the logic clear? Then watch the silent video. Does the screen communicate what is being discussed? Neither view alone should replace the complete experience, but the two inspections reveal different weaknesses. A confusing transcript often indicates a scripting issue; a silent video containing only tiny code often indicates a visual planning issue.

## Design retention around progress, not interruptions

Retention is continued viewing, but the audience's underlying reason to continue is that the experience remains worthwhile. Each section should deliver something and make the next step meaningful. In the sample video, the first test delivers a concrete improvement; the second test reveals its boundary; the final section offers a reusable decision method. The viewer receives value throughout, so the ending is not holding the only answer hostage.

An open loop is an unanswered question the viewer has a reason to care about. “In a moment, this valid card will fail in a different way” can work if the video resolves it soon and the setup is clear. “Watch until the end for a secret” offers little specific value and can feel manipulative. Curiosity should arise from the problem, not from repeated commands to keep watching.

Pattern changes can help attention. Switch from your face to a diagram when moving from motivation to mechanism. Zoom into a field when explaining the missing answer. Return to your face for the judgment call. These changes carry meaning. Random zooms, sound effects, and stock footage every few seconds can consume editing time while making the lesson harder to follow. Use the simplest visual that supports the current idea.

Leave breathing room around unfamiliar concepts. A brief pause after “structure does not establish truth” gives the viewer a chance to connect the words to the two results. Cutting every gap may shorten the video while reducing comprehension. Your goal is a worthwhile viewing experience at an appropriate pace, not the maximum number of words per minute.

Do not write toward a universal retention percentage. Different traffic sources, topics, lengths, and viewer intentions produce different behavior. Compare relevant videos and inspect the actual moment where viewers leave. If a steep drop follows a long setup, the next script can move the result earlier. If viewers rewatch a dense code segment, it may be useful, confusing, or both; pair the graph with comments and the content itself before deciding.

## Adapt the method to your other channel directions

For a pure ML lesson, the promise might be “explain overfitting using one small dataset.” Start with a model performing well on examples it has already seen and poorly on held-out examples. Define training and test data before discussing generalization. Use a small table and a simple graph. The story is the mismatch between apparent success and the behavior that matters. Your mathematics background supports a deeper follow-up, but the first video need not contain every derivation.

For an AI-tool review, the promise might be “decide whether this tool is useful for debugging a small TypeScript project.” Choose tasks before trying the tools. Keep prompts, starting repository, time limits, and scoring criteria consistent enough that the comparison is interpretable. Show one success and one failure. State the date, plan, and configuration. The story is a decision under specified conditions, not an eternal winner.

For a freelancing case study, the promise might be “understand how to scope a browser extension before quoting a client.” Use a synthetic brief, list assumptions, identify unknowns, and show how the scope changes after clarification. The video can naturally lead to a paid audit later because viewers have seen the value of the process. A fictional brief must be labeled; do not invent client results or revenue.

For tutoring content, the promise can be a specific misconception resolved. Explain why a student might believe the mistaken idea, then work through a counterexample. Avoid making the learner the joke. The distinction between a respectful teacher and an impatient expert is visible in how you explain the error. That tone attracts the kind of audience who may eventually trust you with a learning product or a session.

## Rehearse, revise, and define done

Run one rehearsal without trying to get a publishable take. Time each section and mark where you stumble, repeat yourself, or need a visual that does not exist. A stumble may be a performance issue, but repeated stumbling at the same sentence often means the sentence is poorly written. Rewrite it in the words you naturally use when explaining the idea to one person.

Use a production timebox appropriate to your initial small video every two weeks: roughly twenty minutes for the evidence brief, thirty for the beat outline, sixty to ninety for drafting, thirty for read-aloud revision, and twenty for the shot list. These are planning assumptions, not industry benchmarks. A first script will take longer. Track where the time goes and simplify the video's scope before assuming you need to work faster.

A script is ready when the promised outcome is clear, every material claim has evidence or an explicit limit, the opening demonstrates relevance, the core explanation has a concrete example, the visuals exist or have a collection plan, and the final action is both useful and available. It need not contain the cleverest possible phrasing. Excessive polishing before a rehearsal can make the document prettier without improving the eventual video.

Your application project for this chapter is to script one six-to-ten-minute video around a single engineering boundary. You may use the extension example, but substitute your own tested behavior and observations. Deliver the promise, evidence brief, script, claim ledger, and shot list. The practical acceptance check is that a colleague can read the script and identify what the viewer learns, what evidence supports it, and what footage you must record. No quiz is required.

Open the [companion](../companion/index.html) and use the **script** experiment to estimate spoken duration from your word count and planned demonstration pauses. Change the speaking rate rather than forcing your voice to match a number. The estimate is a planning model; your rehearsal is the final timing evidence. Once the script is filmable, move to the filming chapter and collect the material your explanation actually needs.

## Focused learning resources

YouTube's [audience-retention guidance](https://support.google.com/youtube/answer/9314415) explains the platform's retention report; use the next chapter's production process to create the footage, then the growth chapter to interpret the results. Platform reporting is evidence about viewing behavior, not a substitute for judging whether the explanation is true and understandable.

For the teaching craft, study your own strongest technical article as an adaptation exercise: keep its central example, convert paragraphs into spoken sentences, and replace each abstract paragraph with a concrete screen action or diagram where possible. This uses work you understand and can verify, which is a better starting point than asking an assistant to invent an impressive topic outside your experience.

The next chapter turns this document into clean recordings. You now know what the camera, microphone, screen capture, and editor must communicate; that makes equipment choices much easier to evaluate.
