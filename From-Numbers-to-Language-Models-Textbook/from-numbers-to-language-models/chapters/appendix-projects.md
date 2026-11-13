# Optional synthesis laboratories with worked solutions

These are self-study extensions, not gates to continuing the course. Attempting a calculation before reading its solution can reveal which conceptual bridge needs another pass.

## 1. Prove attention is permutation equivariant without positions

For permutation matrix $P$, input becomes $PX$. Projected arrays become $PQ,PK,PV$. Scores become $P(QK^\top)P^\top$. Rowwise softmax permutes its rows and columns correspondingly, so weights become $PAP^\top$. Output is $(PAP^\top)(PV)=PAV$. Thus outputs permute with inputs. This assumes no incompatible mask or positional signal. A fixed triangular mask breaks arbitrary permutation symmetry because it introduces an order relation.

## 2. Recover a full attention gradient

Use three tokens, key width two, and value width three. Set a nonconstant upstream matrix $G$. Compute $G_V=A^\top G$, $G_A=GV^\top$, $G_S=A\odot(G_A-\operatorname{rowsum}(A\odot G_A))$, $G_Q=G_SK/\sqrt2$, and $G_K=G_S^\top Q/\sqrt2$. Verify shapes at every step. Then perturb one coordinate of each input separately and compare central differences of $\sum O\odot G$. Do not perturb all inputs simultaneously; that checks a directional derivative rather than individual partial derivatives.

## 3. Explain an attention gradient that is exactly zero

Give every key the same value vector. Output equals that value independent of weights because weights sum to one. Therefore score gradients vanish. The value gradients need not vanish: changing one value changes the weighted read. This distinguishes a zero addressing signal caused by the task from a broken backward implementation.

## 4. Build a document-isolation test

Pack two documents in one sequence. Use an allowed mask requiring both causality and equal document IDs. Run the model, alter every input token in the first document, and compare outputs in the second. They should agree if every sequence-mixing component respects isolation. If the embedding positions are reset, keep the same resets in both runs. Causal masking alone permits the second document to read the first and fails this property.

## 5. Check LoRA initialization without a framework

Choose nonzero input $X$, random $A$, zero $B$, and upstream $G$. Compute $G_B=s(XA)^\top G$ and $G_A=sX^\top GB^\top$. The second is zero initially; the first is generally nonzero. Now set both factors to zero and observe both gradients vanish. The useful initialization preserves the base function while retaining a learning path through one factor.

## 6. Compare sum and mean sequence log-probabilities

Response A has two tokens each with probability 0.5, so summed log-probability is $2\log0.5\approx-1.386$ and mean is $-0.693$. Response B has four tokens each with probability 0.6, so sum is approximately $-2.043$ and mean is $-0.511$. The sum ranks A higher; the mean ranks B higher. In DPO, replacing sequence sums by means changes the preference objective. Decide whether to study that variant explicitly rather than silently substituting it.

## 7. Demonstrate PPO's missing hard constraint

Take one positive-advantage sampled action whose ratio is already above the upper clip boundary. Its local clipped objective is flat. A shared neural parameter can still move because other examples have nonzero gradients, changing this action's ratio further. Thus the clipping objective does not enforce a global ratio bound. A real trust-region constraint would need an explicit constrained optimization or projection mechanism under its own definition.

## 8. Prove the expected KL sequence decomposition

For autoregressive distributions with appropriate support, log response ratio is the sum of token log ratios. Take expectation over responses sampled from the policy. Apply the law of total expectation at each prefix. Each token term becomes the policy-prefix-weighted KL between next-token distributions. Summing gives sequence KL. An individual sampled log-ratio can be negative; nonnegativity belongs to the expectation over the distribution, not every realized response.

## 9. Separate retrieval recall from answer support

Create ten questions with known evidence. Measure whether all necessary passages appear in the top candidates. Then supply the correct passages directly to the answerer. If retrieval recall is low but oracle-context answers are strong, improve retrieval and context selection. If oracle answers remain weak, improve generation or task formulation. If answers are correct but cited passages do not support them, citation validation needs separate work. Do not merge these cases into a single 'RAG accuracy' explanation.

## 10. Expose a judge's position bias

For each candidate pair, score A/B and then B/A while preserving candidate identities. Map positional results back to identity. A consistent judge should normally choose the same candidate or a tie under both orders when content is unchanged. Disagreement quantifies one instability, but agreement does not prove correctness. Compare a subset with independent adjudication, especially for factual support and subtle constraints.

## 11. Connect optimization and control stability

Quadratic gradient descent gives $\theta_{t+1}=(1-\eta\lambda)\theta_t$. Scalar proportional control gives $x_{t+1}=(1-\Delta t k)x_t$. Both converge when the magnitude of the multiplier is below one. This shared algebra explains oscillatory convergence for negative multipliers and divergence outside the unit interval in magnitude. The physical interpretation differs, and nonlinear or delayed systems require additional analysis.

## 12. Design a fair recurrent-depth comparison

Compare a recurrent shared block with an ordinary stack under at least two budgets: equal parameter count and equal measured inference compute. Equal parameters can allow the recurrent model more transformation steps; equal compute may favor another allocation. Keep training data, evaluation, and search budget controlled. Report accuracy versus compute curves and extrapolation behavior across loop counts, including degradation. A single best point cannot establish that more recurrence universally improves reasoning.
