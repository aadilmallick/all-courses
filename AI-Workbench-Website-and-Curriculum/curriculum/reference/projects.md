# Cross-tool application projects


## Project 1: a reviewable software change

Use the synthetic ReleaseDesk examples in the factory chapters. Ask one agent to improve release sorting or validation. Preserve the public interface and require evidence for the requested behavior. Then give the same baseline and contract to another tool in an independent working copy.

Deliver a patch, the actual check output, and a one-page comparison covering setup, accepted behavior, reviewer effort, corrections, and remaining uncertainty. Acceptance means the behavior is correct, input is preserved where required, changes stay scoped, and a fresh checkout can reproduce the check. Tool confidence and output volume do not count as correctness evidence.

## Project 2: an isolated check runner

Choose one sandbox tool and run a small synthetic repository check. Model the lifecycle explicitly: prepare the environment, create or resume execution, run the command, capture exit status, export artifacts, and stop or release resources. Start with the chapter's offline simulation if you do not want a paid account trial.

Deliver a lifecycle diagram or written sequence, input identity, command output, artifact manifest, and cleanup record. Acceptance means failure is distinguishable from successful empty output, important artifacts survive the intended cleanup, and a repeated request does not create misleading duplicate success records. Record what you observed live and what you simulated.

## Project 3: a release-support voice assistant

Create a small knowledge fixture describing a fictional release. The assistant can explain three approved features and call a synthetic lookup tool. It should acknowledge when the fixture lacks an answer. Use a hosted platform for speed or a custom pipeline to study transport and turn handling.

Deliver the conversation design, tool schema, five synthetic evaluation conversations, observed or simulated latency notes, and a failure-recovery example. Include silence, interruption, a correction, a tool timeout, and an unknown question. Acceptance means the assistant's answer follows actual tool outcomes, interruption handling is intelligible, and the test record distinguishes a transcript simulation from a real audio call.

## Project 4: a release explainer video

Write a thirty-to-sixty-second brief for the same approved release facts. Choose generated footage or a scripted presenter based on the communication need. Create a shot list, narration, captions, reference plan, and iteration log. A storyboard is a useful offline deliverable; actual generated exports require the relevant service access.

Deliver the approved script, storyboard, generation or production log, final export if you run the service, and a review rubric. Acceptance covers factual accuracy, readable captions, intelligible audio, coherent continuity, correct aspect ratio, and appropriate identity/voice permissions. Do not describe a storyboard as a generated video.

## Optional capstone: an integrated release assistant

Connect the four projects only after each works independently. The accepted release facts are the shared contract. The coding workflow produces approved notes. The sandbox checks the artifact. The voice assistant explains it. The video workflow uses only approved claims. Avoid connecting production deployment or customer messaging merely to make the demo look complete.

Trace one release ID through every output. If a later correction changes a fact, identify which voice fixture, captions, and video script need regeneration. This teaches versioned communication, a real source of errors in automated productivity systems. A beautiful presentation built from stale facts is still a failed workflow.

## A common review scorecard

| Dimension | Evidence to inspect |
| --- | --- |
| Correctness | The output matches the approved behavior or facts |
| Reproducibility | Another reader can reconstruct the result from recorded inputs |
| Scope | The workflow performs the intended task with understood authority |
| Recovery | Failures and retries have a clear, inspectable outcome |
| Usability | The intended person can use or understand the result |
| Cost awareness | Usage units and human review effort are recorded |

Use this as a discussion aid rather than a universal numerical benchmark. Different projects have different quality bars. Record the evidence behind your decision so the comparison remains useful after the tools change.
