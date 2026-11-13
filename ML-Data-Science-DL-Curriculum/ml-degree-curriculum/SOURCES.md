# References and research boundaries

Access date: 2026-11-12. The [source map](SOURCE-MAP.md) lists all 47 user-supplied Aman.ai primers and their teaching destinations. They supplied a topic outline and contextual questions. Their long pages were reviewed through available extracted sections and headings, not exhaustively audited. This curriculum independently explains standard mathematics and supplies its own small calculations; source availability is not a guarantee that every source claim is correct.

## Primary technical references

| Reference | Role in this course | Review scope |
|---|---|---|
| [NumPy broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) | Array shape semantics | Documentation page |
| [scikit-learn supervised learning](https://scikit-learn.org/stable/supervised_learning.html) | Library taxonomy and estimator families | Index and API context |
| [scikit-learn clustering](https://scikit-learn.org/stable/modules/clustering.html) | Clustering definitions and implementation alternatives | Available extracted documentation |
| [scikit-learn cross validation](https://scikit-learn.org/stable/modules/cross_validation.html) | Splitter contracts and selection protocol | Available extracted documentation |
| [Understanding Machine Learning: From Theory to Algorithms](https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/understanding-machine-learning-theory-algorithms.pdf), Shalev-Shwartz and Ben-David | Author-hosted theory reference and further reading | Retrieved introductory material; not a claim of full-book review |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762), Vaswani et al. | Transformer primary reference | Landing page and abstract |
| [FlashAttention](https://arxiv.org/abs/2205.14135), Dao et al. | Exact attention and IO-aware tiling | Abstract and technical context |
| [Semi-Supervised Classification with Graph Convolutional Networks](https://arxiv.org/abs/1609.02907), Kipf and Welling | GCN primary reference | Landing page and abstract |
| [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239), Ho et al. | Gaussian diffusion reference | Landing page and abstract |
| [Large Language Diffusion Models](https://arxiv.org/abs/2502.09992), Nie et al. | Absorbing-mask language diffusion | Landing page and abstract |
| [PyTorch scaled dot product attention](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) | Mask and dropout semantics | Available API documentation |
| [PyTorch distributed data parallel](https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html) | Distributed averaging and collective constraints | Available API documentation |
| [PyTorch autograd](https://docs.pytorch.org/docs/stable/notes/autograd.html) | Framework derivative context | Stable URL redirected; runtime behavior not executed here |

`stable` documentation changes. The executed library versions are recorded in environment-tested.txt; retrieved documentation labels can differ. The course uses broadly established API forms and does not claim that the displayed version is the latest release on every platform. Confirm your installed version before adapting optional acceleration or distributed APIs.

## What the research does not establish

The primary-paper abstracts support architecture identity and historical motivation, not every detailed derivation in this course. Mathematical derivations are presented with their assumptions and independently checked where practical. No claim is made to have read every paper's supplement or reproduced full benchmarks. GPU performance, frontier-model rankings, prices, and unverified newly named diffusion systems are deliberately not used as evidence.

This archive does not redistribute the full external primers or textbooks. It contains the curriculum, direct reference links, and educational programs. Advanced methods are selected examples, not an assertion that every ML or DL algorithm ever published has been covered.


## Verification follow-up

The verification pass additionally checked the official PyTorch documentation for [BatchNorm variance estimators](https://docs.pytorch.org/docs/2.15/generated/torch.nn.BatchNorm1d.html), [scaled dot product attention masks and dropout](https://docs.pytorch.org/docs/2.15/generated/torch.nn.functional.scaled_dot_product_attention.html), and [automatic mixed precision](https://docs.pytorch.org/docs/2.15/amp.html). These were documentation checks, not framework execution or GPU benchmarks.
