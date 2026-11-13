# References and provenance

This textbook consolidates the supplied 54-lesson archive. The table below retains original lesson numbers for provenance; [the coverage map](../COVERAGE.md) maps them to textbook chapters. Primer and paper access scopes are inherited from the source edition, not expanded into a claim of new exhaustive paper reading.

# Sources and research scope

Access date: **2026-11-12**. Supplied primer pages were opened for their topic structure and available extracted material. The primary-paper landing pages and abstracts below were checked for identity and relevance; this is not a claim that every full paper and supplement was read line by line. The mathematics in the source curriculum is independently developed and numerically checked where applicable. No benchmark values, model prices, or current leaderboard rankings are asserted.

## Supplied topic maps

- [Aman.ai primer: attention](https://aman.ai/primers/attention/)
- [Aman.ai primer: transformers](https://aman.ai/primers/transformers/)
- [Aman.ai primer: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai primer: RAG](https://aman.ai/primers/RAG/)
- [Aman.ai primer: mixture-of-experts](https://aman.ai/primers/mixture-of-experts/)
- [Aman.ai primer: prompt-engineering](https://aman.ai/primers/prompt-engineering/)
- [Aman.ai primer: context-engineering](https://aman.ai/primers/context-engineering/)
- [Aman.ai primer: loop-and-graph-engineering](https://aman.ai/primers/loop-and-graph-engineering/)
- [Aman.ai primer: LLM-as-a-judge](https://aman.ai/primers/LLM-as-a-judge/)
- [Aman.ai primer: recursive-self-improvement](https://aman.ai/primers/recursive-self-improvement/)
- [Aman.ai primer: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)
- [Aman.ai primer: preference-optimization](https://aman.ai/primers/preference-optimization/)
- [Aman.ai primer: VLM](https://aman.ai/primers/VLM/)
- [Aman.ai primer: embeddings](https://aman.ai/primers/embeddings/)
- [Aman.ai primer: parameter-efficient-fine-tuning](https://aman.ai/primers/parameter-efficient-fine-tuning/)
- [Aman.ai primer: knowledge-distillation](https://aman.ai/primers/knowledge-distillation/)
- [Aman.ai primer: recursive-transformers](https://aman.ai/primers/recursive-transformers/)
- [Aman.ai primer: physical-ai](https://aman.ai/primers/physical-ai/)

## Primary research references

| Paper | Original curriculum lessons | Why consult it |
|---|---|---|
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 12–20 | Transformer architecture |
| [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473) | 10–11 | Additive alignment attention |
| [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781) | 09 | Distributional representation learning |
| [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805) | 18 | Masked bidirectional pretraining |
| [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer](https://arxiv.org/abs/1910.10683) | 18 | Text-to-text and denoising objectives |
| [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864) | 16, 24 | Rotary positional encoding |
| [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) | 23 | Exact tiled attention and IO cost |
| [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) | 27 | Low-rank adaptation |
| [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314) | 28 | Quantized frozen base with adapters |
| [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961) | 29 | Sparse conditional computation |
| [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531) | 30 | Classical teacher/student distillation |
| [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) | 36 | Clipped policy surrogate |
| [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290) | 38 | Policy-ratio preference objective |
| [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300) | 39 | Group-relative policy optimization reference |
| [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | 43–44 | Latent-document RAG formulation |
| [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) | 40, 45 | Interleaved model proposals and actions |
| [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020) | 47 | Contrastive image-text learning |
| [Universal Transformers](https://arxiv.org/abs/1807.03819) | 49 | Recurrent computation across depth |
| [Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137) | 52 | Denoising action policies |
| [RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control](https://arxiv.org/abs/2307.15818) | 51–52 | Vision-language-action reference |

## Official documentation

- [NumPy broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html): official reference for array compatibility and axis behavior. The delivered code was executed against NumPy 2.3.5; the live stable documentation may describe a newer release.
- [PyTorch scaled dot-product attention](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html): an official entry point for a future framework port. The stable URL redirected to a versioned documentation path during research. No PyTorch backend behavior is claimed to have been executed in this course.

## How to use references

Read a reference after the prerequisite lesson, then reconstruct its definitions and distinguish its specific algorithm from the simplified local demonstration. A loss-equation demonstration is not a reproduction of a large training result. For new implementations, check the full method, implementation notes, versioned configuration, and supported data and model licenses.
