# Validation, evidence, and limitations

Checked on **2026-11-12** with Python 3.12.14, NumPy 2.3.5, CPU execution, and SymPy 1.14.0 for symbolic audits.

## Completed checks

| Check | Result | What it establishes |
|---|---|---|
| Numbered Markdown lessons | 54 | Meets the requested 50+ lesson-file count |
| Numbered Python examples | 54 executed successfully | Every chapter's complete local example runs |
| Additional alignment programs | 2 executed successfully | Tiny categorical DPO, bandit PPO, and an actual transformer SFT-to-DPO pipeline improve their stated local objectives |
| Numerical unit tests | 10 passed | Primitive and composed gradients, repeated-index accumulation, normalization, causal independence, masked losses, and model fitting |
| Scalar mathematical laboratories | 54 derivative checks passed | Symbolic first derivatives agree with central differences at the documented points; maximum absolute error about 3.62e-10 |
| Local Markdown links and navigation | Checked by `verify_course.py` | Referenced local files exist |
| Fences, control characters, Python syntax | Checked by `verify_course.py` | Basic structural integrity |
| Archive integrity | Checked with Python ZIP CRC verification | Packaged members are readable and match the source tree |

Run the checks yourself:

```bash
python code/run_all.py
python -m unittest discover -s tests -v
python verify_course.py
```

With optional authoring dependencies installed, also run `python tools/check_math.py`. Small floating-point residuals and stochastic outputs may vary with platform; seeded examples and tolerances are used where appropriate.

## Length measurement

The 54 chapters contain **120,838 whitespace-separated words**, including prose, code, equations, trace tables, and repeated instructional scaffolding. The shortest chapter has **2,011** such words and the longest has **2,806**. These are exact whitespace counts, not a count of unique prose words or model tokens.

A compatible named model tokenizer was unavailable in the authorized environment. An attempt to obtain one did not succeed. The default 5,000-model-token-per-lesson depth target was therefore **not deterministically verified**. The conservative 5,000-whitespace-word-per-lesson proxy is also not met. Do not represent this archive as certified to a 5,000-token minimum for every lesson. The requested 50+ chapter count is verified independently of that length limitation.

## What was not executed or established

- No large pretrained language model was trained, fine-tuned, evaluated, or served. The transformer and alignment training experiments use deliberately small local tasks.
- No PyTorch, GPU, distributed training, production ANN index, fused attention kernel, or commercial model API integration was run. Framework mappings and system discussions are explanatory.
- The quantizer is a uniform numerical example, not NF4/QLoRA or a packed low-bit serving kernel. The MoE router is local, not a distributed expert-parallel implementation.
- Image features, visual-text vectors, diffusion noise, and flow velocities in the introductory demonstrations are synthetic or explicitly oracle-supplied. Those examples do not establish trained visual or robot capabilities.
- Physical examples simulate scalar dynamics. They do not control hardware or certify a real controller.
- Numerical tests are local evidence, not a formal proof of every equation, a guarantee of zero errors, or an exhaustive reproduction of every named method in the supplied primers.
- Research frontiers such as open-ended recursive improvement remain uncertain. The course distinguishes bounded demonstrations, empirical hypotheses, and stronger unsupported extrapolations.

## Source review scope

All 18 supplied primer URLs were opened for topic structure and available extracted material. The primary reference landing pages and abstracts in `SOURCES.md` were checked. This does not assert exhaustive reading of every full paper, supplement, or primer subsection. Stable mathematical results were derived in the lessons; rapidly changing prices, leaderboards, and frontier performance rankings were excluded.

## Per-lesson length inventory

| Lesson | Whitespace words | UTF-8 bytes |
|---|---:|---:|
| [01-tensors-shapes](lessons/01-tensors-shapes.md) | 2,253 | 15,550 |
| [02-linear-algebra](lessons/02-linear-algebra.md) | 2,272 | 16,171 |
| [03-calculus-chain-rule](lessons/03-calculus-chain-rule.md) | 2,204 | 16,601 |
| [04-probability-conditioning](lessons/04-probability-conditioning.md) | 2,126 | 15,250 |
| [05-entropy-softmax](lessons/05-entropy-softmax.md) | 2,063 | 15,109 |
| [06-neural-networks-autodiff](lessons/06-neural-networks-autodiff.md) | 2,170 | 15,342 |
| [07-language-modeling](lessons/07-language-modeling.md) | 2,161 | 15,417 |
| [08-tokenization-bpe](lessons/08-tokenization-bpe.md) | 2,289 | 15,785 |
| [09-embeddings](lessons/09-embeddings.md) | 2,225 | 15,933 |
| [10-rnn-seq2seq](lessons/10-rnn-seq2seq.md) | 2,364 | 17,811 |
| [11-attention-weighted-retrieval](lessons/11-attention-weighted-retrieval.md) | 2,113 | 14,981 |
| [12-scaled-dot-product-attention](lessons/12-scaled-dot-product-attention.md) | 2,199 | 16,195 |
| [13-attention-backpropagation](lessons/13-attention-backpropagation.md) | 2,512 | 18,325 |
| [14-attention-masks](lessons/14-attention-masks.md) | 2,504 | 17,844 |
| [15-multihead-gqa](lessons/15-multihead-gqa.md) | 2,389 | 17,833 |
| [16-position-rope](lessons/16-position-rope.md) | 2,089 | 15,451 |
| [17-transformer-blocks](lessons/17-transformer-blocks.md) | 2,188 | 16,328 |
| [18-encoder-decoder-architectures](lessons/18-encoder-decoder-architectures.md) | 2,321 | 17,178 |
| [19-implement-gpt](lessons/19-implement-gpt.md) | 2,574 | 19,427 |
| [20-train-gpt](lessons/20-train-gpt.md) | 2,241 | 15,827 |
| [21-pretraining-systems](lessons/21-pretraining-systems.md) | 2,176 | 15,371 |
| [22-decoding-kv-cache](lessons/22-decoding-kv-cache.md) | 2,338 | 16,978 |
| [23-efficient-attention](lessons/23-efficient-attention.md) | 2,213 | 16,223 |
| [24-long-context](lessons/24-long-context.md) | 2,179 | 15,929 |
| [25-evaluation-interpretability](lessons/25-evaluation-interpretability.md) | 2,196 | 15,204 |
| [26-instruction-sft](lessons/26-instruction-sft.md) | 2,263 | 16,340 |
| [27-lora-peft](lessons/27-lora-peft.md) | 2,305 | 16,135 |
| [28-quantization-qlora](lessons/28-quantization-qlora.md) | 2,209 | 15,923 |
| [29-mixture-of-experts](lessons/29-mixture-of-experts.md) | 2,299 | 16,616 |
| [30-knowledge-distillation](lessons/30-knowledge-distillation.md) | 2,089 | 15,800 |
| [31-rl-foundations](lessons/31-rl-foundations.md) | 2,195 | 15,676 |
| [32-bellman-dynamic-programming](lessons/32-bellman-dynamic-programming.md) | 2,011 | 14,397 |
| [33-td-q-learning](lessons/33-td-q-learning.md) | 2,100 | 14,812 |
| [34-policy-gradients](lessons/34-policy-gradients.md) | 2,151 | 15,892 |
| [35-actor-critic-gae](lessons/35-actor-critic-gae.md) | 2,109 | 14,978 |
| [36-ppo](lessons/36-ppo.md) | 2,034 | 14,855 |
| [37-reward-modeling-rlhf](lessons/37-reward-modeling-rlhf.md) | 2,073 | 15,502 |
| [38-dpo-preference-optimization](lessons/38-dpo-preference-optimization.md) | 2,137 | 16,152 |
| [39-grpo-verifiable-rewards](lessons/39-grpo-verifiable-rewards.md) | 2,055 | 14,901 |
| [40-prompting-search](lessons/40-prompting-search.md) | 2,145 | 15,941 |
| [41-context-memory](lessons/41-context-memory.md) | 2,212 | 15,742 |
| [42-dense-retrieval](lessons/42-dense-retrieval.md) | 2,367 | 16,314 |
| [43-rag-hybrid-ranking](lessons/43-rag-hybrid-ranking.md) | 2,287 | 16,657 |
| [44-advanced-rag-evaluation](lessons/44-advanced-rag-evaluation.md) | 2,366 | 17,421 |
| [45-agent-loops-graphs](lessons/45-agent-loops-graphs.md) | 2,193 | 16,159 |
| [46-llm-judges](lessons/46-llm-judges.md) | 2,183 | 15,422 |
| [47-vision-clip](lessons/47-vision-clip.md) | 2,283 | 15,991 |
| [48-generative-vlm](lessons/48-generative-vlm.md) | 2,461 | 19,657 |
| [49-recursive-transformers](lessons/49-recursive-transformers.md) | 2,547 | 20,762 |
| [50-recursive-self-improvement](lessons/50-recursive-self-improvement.md) | 2,115 | 15,736 |
| [51-physical-ai-control](lessons/51-physical-ai-control.md) | 2,031 | 14,619 |
| [52-generative-actions-world-models](lessons/52-generative-actions-world-models.md) | 2,142 | 15,634 |
| [53-capstone-local-system](lessons/53-capstone-local-system.md) | 2,806 | 20,573 |
| [54-research-reproducibility](lessons/54-research-reproducibility.md) | 2,311 | 16,932 |
