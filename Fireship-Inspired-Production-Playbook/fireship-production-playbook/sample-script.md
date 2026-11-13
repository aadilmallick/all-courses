# Original practice film: “Your JSON is valid. The answer is still wrong.”

This is an original script for Aadil, not a Fireship transcript or imitation of Jeff's voice. Treat runtime as a rehearsal result. The footage is a synthetic arithmetic demonstration; it is not a benchmark of a particular AI model.

The narration below has 184 whitespace-separated words: about 73.6 seconds at 150 words/minute before pauses and screen-reading time. The ninety-second storyboard therefore leaves roughly sixteen seconds for those holds. Rehearse and adjust rather than speeding up to match the table.

## Narration

This answer is valid JSON. It also says two plus two is five. Apparently, formatting has solved mathematics.

When you ask a model for structured output, there are different questions hiding inside the word“valid.” Can your application read the response? Does it have the fields you expect? And is the answer actually correct?

Watch this tiny example. The response contains two numbers and a sum. Python's JSON parser accepts it. Our field check accepts it too. But the arithmetic check compares the returned sum with the inputs—and fails.

That's the distinction. Structure tells your program how to read an answer. A task-specific check tells it something about whether that answer is usable.

Here, the check is easy because addition has a definite result. In a research summary, correctness is harder: you need evidence and evaluation suited to the claims. A parser cannot decide whether a citation supports a sentence.

So keep the format checks. Then ask one more question: what would a wrong answer look like in this particular task, and how could I detect it?

Start there. Beautifully organized nonsense is still nonsense.

## The shot plan

Durations below are flexible edit allowances. They do not imply the reference creator follows these timings.

| Approximate time | Narration beat | Original visual | Edit |
| --- | --- | --- | --- |
| 0–4s | Valid JSON, wrong sum | Real demo payload showing 2, 2, 5 | Tight crop; sum highlight |
| 4–7s | Formatting joke | Original OFFICIALLY WRONG certificate card | Brief hard cut; optional quiet accent |
| 7–16s | Several meanings of valid | FORMAT/STRUCTURE/CORRECTNESS cards | Reveal one at a time |
| 16–22s | Tiny example | Code input state | Stable readable frame |
| 22–29s | Parser accepts | Actual PARSE: PASS output | Cut on parser; hold |
| 29–35s | Fields accepted | Actual STRUCTURE: PASS output | Add line highlight |
| 35–42s | Arithmetic fails | Actual ARITHMETIC: FAIL output | Small punch-in, then still |
| 42–54s | Explain the distinction | Two-column format/task graphic | No unnecessary motion while reading |
| 54–66s | Easy arithmetic, harder claims | Arithmetic card then original source/claim diagram | Purposeful change between concepts |
| 66–76s | Parser cannot judge evidence | Source card and claim card | Clear text label, no fabricated benchmark |
| 76–90s | Apply the question and payoff | A single review question, then a clean end card | Hold for meaning; end after payoff |

## Make the evidence

Run [json_demo.py](assets/json_demo.py) with Python 3. It prints:

```text
PARSE: PASS
STRUCTURE: PASS
ARITHMETIC: FAIL
```

Use the provided bad fixturefor the video and verify the good fixtureas a control. This demonstrates layered checks for one toy task. It does not implement semantic truth checking, a general schema validator, an AI integration or a hallucination detector.

## A simple editorial-assistant prompt

“Review my original short developer-explainer script. The viewer knows basic Python and JSON. Identify redundant sentences, missing logical steps and claims stronger than the demonstration. Suggest a three-column narration/visual/edit plan. Keep my wording natural, preserve limitations, and do not imitate a named creator's voice or invent test results. Return a revised draft and a claim checklist. I will rehearse and verify it.”

That is a suggested learner prompt. No assistant or tool was used to film or validate your future media by creating this course.
