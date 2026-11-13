# Notation, shapes, and conventions

The lessons use row-vector data conventions. A token feature row is multiplied on the right by a weight matrix. Some papers instead write column vectors and multiply weights on the left. Both conventions are valid; transpose all related equations consistently rather than mixing them.

| Symbol | Meaning | Typical shape or domain |
|---|---|---|
| $B$ | Number of examples in a batch | Positive integer |
| $T$ | Number of positions in a sequence | Positive integer |
| $D$ | Model feature width | Positive integer |
| $H$ | Query-head count | Divides the width in the simple implementation |
| $G$ | Key/value-head count in GQA | Divides $H$ |
| $d_k,d_v$ | Per-head key and value widths | Positive integers |
| $V$ as a dimension | Vocabulary size | Positive integer |
| $X$ | Token features | $(B,T,D)$, or $(T,D)$ without batch |
| $E$ | Token embedding table | $(V,D)$ |
| $Q,K,V$ as arrays | Queries, keys, values | $(B,H,T,d)$ in equal-length attention |
| $S$ | Attention scores | $(B,H,T_q,T_k)$ |
| $A$ | Attention probabilities | Same shape as $S$, normalized over $T_k$ |
| $O$ | Attention output | $(B,H,T_q,d_v)$ before head merging |
| $W$ | Learned linear-map weight | Input width by output width |
| $L$ | Scalar objective, usually minimized | Real scalar |
| $g$ | Gradient of a scalar objective | Same shape as differentiated parameter |
| $\eta$ | Learning rate | Positive real |
| $\pi_\theta$ | Parameterized policy | Conditional action/response distribution |
| $\pi_{\mathrm{old}}$ | Policy used to collect a rollout | Fixed during a PPO update |
| $\pi_{\mathrm{ref}}$ | Reference distribution for regularization | Frozen under ordinary DPO/RLHF setup |
| $r_t$ | Environment reward | Real scalar |
| $r_t(\theta)$ in PPO | Probability ratio, distinct from reward | Positive real |
| $\gamma$ | Return discount | Usually $[0,1)$ for infinite-horizon proofs |
| $\lambda$ | GAE interpolation parameter | Usually $[0,1]$ |
| $\beta$ | KL/preference coefficient | Interpret under each stated equation |
| $\tau$ | Temperature | Strictly positive for division formulas |

Repeated letters are common in the literature. Read the local definition: $V$ can mean vocabulary size, a value matrix, or a value function. The lessons identify the role in context. Avoid implementing equations from symbol resemblance alone.

`@` means matrix multiplication in Python. `*` means elementwise multiplication. `.T` reverses axes for a two-dimensional array; for batched arrays, use an explicit transpose or `swapaxes` of the final two axes. `axis=-1` is the last axis. `keepdims=True` preserves a size-one reduced axis so subsequent broadcasting has the intended alignment.

All logarithms are natural unless explicitly stated otherwise. Losses are token means when the chapter says so; a sum and a mean have different gradient scales. Probability vectors are normalized over the candidate class/key/action axis. Masks use `True` to mean an allowed connection throughout the local code. Check another library's documented convention before translating.

A differential such as $dX$ means an infinitesimal change, whereas $D$ is a dimension. A partial derivative holds the other independent arguments fixed. A total derivative includes every path by which a shared variable influences the result. A gradient with respect to a tensor has that tensor's shape; a full Jacobian has one set of axes for outputs and another for inputs.

Definitions and exact algebra are distinguished from empirical observations. A theorem applies only under its hypotheses. A scalar sensitivity laboratory studies the explicitly displayed function; a smooth surrogate for a discrete process is not the process itself. The recursive, agent, and physical-AI chapters make these distinctions especially explicit.
