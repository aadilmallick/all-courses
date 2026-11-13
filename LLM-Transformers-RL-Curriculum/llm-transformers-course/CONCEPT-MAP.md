# How the pieces connect

```mermaid
flowchart TD
    Math["Linear algebra, calculus, probability"] --> Attn["Attention and gradients"]
    Math --> RL["Returns and policy gradients"]
    Attn --> Model["Transformer language model"]
    Model --> Train["Pretraining and instruction tuning"]
    Train --> Adapt["LoRA, quantization, distillation"]
    Train --> Align["RLHF and preference optimization"]
    RL --> Align
    Model --> Emb["Contextual representations"]
    Emb --> RAG["Retrieval and grounded generation"]
    RAG --> Agent["Tools, memory, and bounded loops"]
    Model --> Vision["Vision-language fusion"]
    Vision --> Physical["Actions, feedback, and world models"]
    RL --> Physical
    Agent --> Eval["Independent evaluation"]
    Align --> Eval
    Physical --> Eval
```

Architecture describes the computation available to a model. Training determines which behaviors are learned from which data and feedback. Retrieval supplies external evidence at use time. An orchestration program chooses tool calls and maintains state. Evaluation measures whether the combined system satisfies a task. None of these layers alone substitutes for all the others.

Repeated depth inside a transformer, repeated model calls in an agent loop, and repeated training generations in an improvement experiment are three different forms of iteration. Their state, costs, persistence, and evidence requirements are different. Lessons 45, 49, and 50 separate them explicitly.
