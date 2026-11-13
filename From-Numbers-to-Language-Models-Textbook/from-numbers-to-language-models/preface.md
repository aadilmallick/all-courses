This book is for a programmer who wants to understand modern language models well enough to reconstruct the important calculations and write their own code. You do not need previous transformer or reinforcement-learning knowledge. Familiarity with variables, functions, loops, and running a Python script is helpful; the first chapters rebuild the mathematical vocabulary used later.

We begin with quantities you can inspect. A token ID selects a row. A matrix forms a new measurement. A derivative follows a change. A probability describes a choice. Attention combines those ideas into a learned read operation. From there, a complete small transformer becomes a sequence of understandable steps rather than a diagram to memorize.

The pace is deliberately cumulative. New symbols are tied to a problem and a numerical example. Definitions, algebraic identities, conditional theorems, empirical measurements, and illustrative approximations are distinguished. When an analogy stops matching the mathematics, the text says where it stops. Optional projects provide practice and worked solutions without blocking the reading path.

## What changed from the curriculum

The source was a 54-lesson course. This edition reorganizes it into 18 connected main chapters and four reference appendices. It preserves the substantive examples, replaces repeated standalone calculus scaffolding with locally relevant reasoning, introduces the missing transitions, and pairs each main chapter with an interactive experiment. The [coverage map](COVERAGE.md) accounts for every original lesson.

This is a textbook about the foundations and major mechanisms across the supplied topics. It is not a claim to reproduce every historical model or frontier result mentioned by the original primers. The chapters distinguish working local implementations from extensions requiring larger data, trained models, specialized hardware, or separate empirical investigation.

## Read with two companions

The [browser laboratory](companion/index.html) has 18 local experiments with visible controls, actual numerical results, resets, and readable source. They are small on purpose. A browser experiment may train a conditional table while the Python companion trains a transformer; that distinction is displayed rather than hidden.

The Python examples include an explicit reverse-mode autodiff engine, a complete causal transformer, supervised training, response masking, LoRA and quantization calculations, and complete small PPO and DPO training experiments. Source files are included in the package. The main code listings in the book are complete runnable programs; integration extensions are labeled as such.

## Setup before the first example

The source edition was checked with Python 3.12.14, NumPy 2.3.5, and CPU execution. Use a Python version compatible with the pinned NumPy release. From the extracted package root:

```bash
python -m venv .venv
```

On macOS/Linux, activate with `source .venv/bin/activate`. On Windows PowerShell, activate with `.venv\Scripts\Activate.ps1`. Then install the Python dependency:

```bash
python -m pip install -r requirements.txt
python examples/12_scaled_dot_product_attention.py
python examples/20_train_gpt.py
python examples/sequence_alignment.py
```

Installation needs access to the package source used by your computer. The included examples run locally afterward without model downloads or API keys. Optional symbolic audits additionally require the pinned authoring requirements.

The browser companion uses no JavaScript packages. With Node.js 22 or newer, run:

```bash
node companion/server.mjs
```

Open the displayed localhost address. The same server exposes the fully typeset offline [HTML reader](book.html). Opening the laboratory directly as a local file may prevent module and catalog loading; use the server so the execution environment matches the instructions. Node 24.22.1 was used for the checked build.

## Notation and how to slow down productively

We use row vectors for token features, so linear maps multiply on the right. Arrays commonly have batch, token, and feature axes in that order. Logarithms are natural. `@` is matrix multiplication and `*` is elementwise multiplication in the Python examples. A mask value of `True` means allowed in this implementation. Other libraries can use another convention.

When an equation is unfamiliar, name each input, write its shape or domain, expand one coordinate, and evaluate a tiny instance. Then compare the calculation with its implementation. If a result differs, inspect the reduction, sign, target, or visibility rule before adding more complexity. This habit transfers from attention to policy gradients, retrieval, and physical feedback.

The main chapters can be read in order. Within the continuous volume, each chapter has its own linked section list and a route back to the contents. The appendices contain notation, implementation guidance, optional projects with solutions, and references. Verification results and limits are recorded separately in [verification.md](verification.md).
