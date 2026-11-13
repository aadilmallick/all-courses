# Transformers, language models, reinforcement learning, and intelligent systems

A 54-lesson course connecting mathematical definitions to executable implementations. Start with tensors, probability, and derivatives; build attention and a trainable causal transformer; then study adaptation, reinforcement learning, retrieval, agents, multimodal models, and embodied systems.

The recurring goal is to make each operation inspectable: identify its inputs, derive its equation, trace a tiny example, implement it, and check a property independently. The local code uses NumPy rather than requiring a deep-learning framework, remote API, GPU, or pretrained model download.

## Start here

1. Read [notation and shape conventions](appendices/NOTATION.md).
2. Follow the numbered lessons in order. Each contains a main explanation, a worked extension, a complete program, recorded intermediate values and output, and a mathematical sensitivity laboratory.
3. Reconstruct the [autodiff engine and full decoder](appendices/AUTODIFF-AND-GPT.md) while studying lessons 06 and 19–20.
4. Use the [optional synthesis labs and solutions](appendices/OPTIONAL-LABS.md) when you want additional application work.
5. Read [validation and limitations](VALIDATION.md) before interpreting the demonstrations as evidence about larger systems.

The scalar laboratories deliberately isolate a small function. They are a bridge between equations and computation, not a claim that one scalar function captures an entire agent, tokenizer, or physical system. Discrete operations and smooth illustrative surrogates are distinguished explicitly.

## Environment and commands

Tested with Python 3.12.14 and NumPy 2.3.5 on CPU. Use Python 3.11 or newer compatible with the pinned NumPy release. From this folder:

```bash
python -m venv .venv
```

Activate it on macOS/Linux with `source .venv/bin/activate`, or in Windows PowerShell with `.venv\Scripts\Activate.ps1`. Then:

```bash
python -m pip install -r requirements.txt
python code/12_scaled_dot_product_attention.py
python code/20_train_gpt.py
python code/alignment_training.py
python code/sequence_alignment.py
python code/run_all.py
python -m unittest discover -s tests -v
python verify_course.py
```

Installation needs package-network access on your computer. Running the supplied examples afterward requires no network connection. SymPy was used to generate the printed symbolic laboratories, but is not required to run the delivered examples. A real tokenizer, pretrained model, GPU stack, or production vector index is not installed by these commands.

## Reading order


### Foundations

| Lesson | Topic | Runnable example |
|---:|---|---|
| 01 | [Tensors, Python, and the meaning of a shape](lessons/01-tensors-shapes.md) | [Python](code/01_tensors_shapes.py) |
| 02 | [Linear algebra for representations and projections](lessons/02-linear-algebra.md) | [Python](code/02_linear_algebra.py) |
| 03 | [Derivatives, Jacobians, and the chain rule](lessons/03-calculus-chain-rule.md) | [Python](code/03_calculus_chain_rule.py) |
| 04 | [Probability, conditioning, and statistical estimation](lessons/04-probability-conditioning.md) | [Python](code/04_probability_conditioning.py) |
| 05 | [Entropy, KL divergence, softmax, and cross-entropy](lessons/05-entropy-softmax.md) | [Python](code/05_entropy_softmax.py) |
| 06 | [Neural networks, backpropagation, and optimization](lessons/06-neural-networks-autodiff.md) | [Python](code/06_neural_networks_autodiff.py) |

### Language and attention

| Lesson | Topic | Runnable example |
|---:|---|---|
| 07 | [Language modeling from counts to autoregression](lessons/07-language-modeling.md) | [Python](code/07_language_modeling.py) |
| 08 | [Tokenization, byte pairs, and text boundaries](lessons/08-tokenization-bpe.md) | [Python](code/08_tokenization_bpe.py) |
| 09 | [Embeddings, distributional learning, and similarity](lessons/09-embeddings.md) | [Python](code/09_embeddings.py) |
| 10 | [Recurrent networks, sequence-to-sequence, and alignment](lessons/10-rnn-seq2seq.md) | [Python](code/10_rnn_seq2seq.py) |
| 11 | [Attention as differentiable weighted retrieval](lessons/11-attention-weighted-retrieval.md) | [Python](code/11_attention_weighted_retrieval.py) |
| 12 | [Queries, keys, values, and scaled dot-product attention](lessons/12-scaled-dot-product-attention.md) | [Python](code/12_scaled_dot_product_attention.py) |

### Transformer construction

| Lesson | Topic | Runnable example |
|---:|---|---|
| 13 | [Backpropagating through attention by hand](lessons/13-attention-backpropagation.md) | [Python](code/13_attention_backpropagation.py) |
| 14 | [Causal masks, padding, packed sequences, and batches](lessons/14-attention-masks.md) | [Python](code/14_attention_masks.py) |
| 15 | [Multi-head, multi-query, and grouped-query attention](lessons/15-multihead-gqa.md) | [Python](code/15_multihead_gqa.py) |
| 16 | [Position, sinusoidal features, relative biases, and RoPE](lessons/16-position-rope.md) | [Python](code/16_position_rope.py) |
| 17 | [Residual streams, normalization, and feed-forward blocks](lessons/17-transformer-blocks.md) | [Python](code/17_transformer_blocks.py) |
| 18 | [Encoders, decoders, and cross-attention objectives](lessons/18-encoder-decoder-architectures.md) | [Python](code/18_encoder_decoder_architectures.py) |

### Training and inference

| Lesson | Topic | Runnable example |
|---:|---|---|
| 19 | [Build a complete tiny GPT from tensor operations](lessons/19-implement-gpt.md) | [Python](code/19_implement_gpt.py) |
| 20 | [Train, validate, checkpoint, and sample a tiny language model](lessons/20-train-gpt.md) | [Python](code/20_train_gpt.py) |
| 21 | [Pretraining data, scaling, distributed execution, and memory](lessons/21-pretraining-systems.md) | [Python](code/21_pretraining_systems.py) |
| 22 | [Decoding, temperature, KV caches, and serving](lessons/22-decoding-kv-cache.md) | [Python](code/22_decoding_kv_cache.py) |
| 23 | [Exact online attention, sparse patterns, and linear alternatives](lessons/23-efficient-attention.md) | [Python](code/23_efficient_attention.py) |
| 24 | [Long-context modeling and position extrapolation](lessons/24-long-context.md) | [Python](code/24_long_context.py) |

### Adaptation and compression

| Lesson | Topic | Runnable example |
|---:|---|---|
| 25 | [Evaluation, calibration, and mechanistic investigation](lessons/25-evaluation-interpretability.md) | [Python](code/25_evaluation_interpretability.py) |
| 26 | [Instruction tuning and supervised response losses](lessons/26-instruction-sft.md) | [Python](code/26_instruction_sft.py) |
| 27 | [Parameter-efficient tuning, adapters, and LoRA derivatives](lessons/27-lora-peft.md) | [Python](code/27_lora_peft.py) |
| 28 | [Quantization, numerical error, and QLoRA](lessons/28-quantization-qlora.md) | [Python](code/28_quantization_qlora.py) |
| 29 | [Mixture-of-experts routing, capacity, and balancing](lessons/29-mixture-of-experts.md) | [Python](code/29_mixture_of_experts.py) |
| 30 | [Knowledge distillation, temperature, and prefix distributions](lessons/30-knowledge-distillation.md) | [Python](code/30_knowledge_distillation.py) |

### Reinforcement learning and alignment

| Lesson | Topic | Runnable example |
|---:|---|---|
| 31 | [Bandits, policies, returns, and Markov decision processes](lessons/31-rl-foundations.md) | [Python](code/31_rl_foundations.py) |
| 32 | [Bellman equations, policy evaluation, and dynamic programming](lessons/32-bellman-dynamic-programming.md) | [Python](code/32_bellman_dynamic_programming.py) |
| 33 | [Temporal differences, Q-learning, and exploration](lessons/33-td-q-learning.md) | [Python](code/33_td_q_learning.py) |
| 34 | [Policy gradients and REINFORCE from the likelihood ratio](lessons/34-policy-gradients.md) | [Python](code/34_policy_gradients.py) |
| 35 | [Actor-critic learning and generalized advantage estimation](lessons/35-actor-critic-gae.md) | [Python](code/35_actor_critic_gae.py) |
| 36 | [PPO, importance ratios, clipping, and KL monitoring](lessons/36-ppo.md) | [Python](code/36_ppo.py) |
| 37 | [Reward modeling, RLHF, and constrained policy optimization](lessons/37-reward-modeling-rlhf.md) | [Python](code/37_reward_modeling_rlhf.py) |
| 38 | [DPO and the derivation from rewards to policy ratios](lessons/38-dpo-preference-optimization.md) | [Python](code/38_dpo_preference_optimization.py) |
| 39 | [GRPO, group baselines, and verifiable rewards](lessons/39-grpo-verifiable-rewards.md) | [Python](code/39_grpo_verifiable_rewards.py) |

### Retrieval and agent systems

| Lesson | Topic | Runnable example |
|---:|---|---|
| 40 | [Prompting, structured output, search, and test-time computation](lessons/40-prompting-search.md) | [Python](code/40_prompting_search.py) |
| 41 | [Context engineering, persistent memory, and information budgets](lessons/41-context-memory.md) | [Python](code/41_context_memory.py) |
| 42 | [Dense retrieval, contrastive encoders, and vector search](lessons/42-dense-retrieval.md) | [Python](code/42_dense_retrieval.py) |
| 43 | [RAG ingestion, BM25, hybrid fusion, and reranking](lessons/43-rag-hybrid-ranking.md) | [Python](code/43_rag_hybrid_ranking.py) |
| 44 | [Advanced RAG, graph retrieval, and failure diagnosis](lessons/44-advanced-rag-evaluation.md) | [Python](code/44_advanced_rag_evaluation.py) |
| 45 | [Tools, bounded agent loops, graphs, and external state](lessons/45-agent-loops-graphs.md) | [Python](code/45_agent_loops_graphs.py) |
| 46 | [LLM judges, ranking, agreement, and controlled experiments](lessons/46-llm-judges.md) | [Python](code/46_llm_judges.py) |

### Multimodal and embodied models

| Lesson | Topic | Runnable example |
|---:|---|---|
| 47 | [Vision transformers, image patches, and CLIP](lessons/47-vision-clip.md) | [Python](code/47_vision_clip.py) |
| 48 | [Generative vision-language models and cross-modal fusion](lessons/48-generative-vlm.md) | [Python](code/48_generative_vlm.py) |
| 49 | [Recurrent depth, recursive transformers, and latent computation](lessons/49-recursive-transformers.md) | [Python](code/49_recursive_transformers.py) |
| 50 | [Recursive improvement, self-training, self-play, and evidence](lessons/50-recursive-self-improvement.md) | [Python](code/50_recursive_self_improvement.py) |
| 51 | [Physical AI, partial observability, imitation, and control](lessons/51-physical-ai-control.md) | [Python](code/51_physical_ai_control.py) |
| 52 | [Action diffusion, flow matching, and learned world models](lessons/52-generative-actions-world-models.md) | [Python](code/52_generative_actions_world_models.py) |

### Synthesis and independent research

| Lesson | Topic | Runnable example |
|---:|---|---|
| 53 | [Capstone: train, adapt, retrieve, and verify one local system](lessons/53-capstone-local-system.md) | [Python](code/53_capstone_local_system.py) |
| 54 | [Read papers, reproduce claims, and design the next experiment](lessons/54-research-reproducibility.md) | [Python](code/54_research_reproducibility.py) |

## What you build

- A reverse-mode tensor autodiff engine with tested broadcast, matrix-product, indexing, and normalization gradients.
- A complete tiny causal transformer with embedding lookup, multi-head attention, a feed-forward block, training, masked response losses, and generation.
- Numerical implementations of LoRA, quantization, MoE routing, online attention, return estimation, and policy objectives.
- Complete small DPO categorical-policy and PPO bandit training experiments, plus an actual tiny-transformer SFT-to-DPO training pipeline.
- Local lexical and vector-ranking examples, evidence checks, and a bounded orchestration loop.
- Inspectable multimodal and action-generation equation demonstrations with their oracle assumptions labeled.

## Navigation and provenance

[Concept map](CONCEPT-MAP.md) · [Source index](SOURCES.md) · [Primer-to-lesson map](SOURCE-MAP.md) · [Validation](VALIDATION.md) · [Curriculum manifest](manifest.json)

The supplied primers establish the topic map. Primary papers and official documentation supply reference points. The lesson explanations, tiny data, code, derivations, and numerical examples are original instructional material rather than copied primer chapters. Source checks were performed on 2026-11-12; research and library documentation can change.

## Port to GitHub

Extract the archive, open this folder, inspect the content, and commit it to a repository you choose. All Markdown navigation is relative, and every local program is included. No repository has been created or published for you. Pick a license according to your intended use before making licensing claims about a public repository. The included sources are linked rather than redistributed.

## Optional symbolic audit

To independently compare the 54 scalar symbolic derivatives with finite differences, install `requirements-authoring.txt`, then run `python tools/check_math.py`. This additional check requires SymPy; ordinary lesson execution does not.
