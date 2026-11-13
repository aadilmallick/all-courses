# Compact glossary and notation guide

| Term / symbol | Meaning | Chapter |
|---|---|---:|
| $\mathbb N,\mathbb Z,\mathbb Q,\mathbb R$ | Naturals including zero; integers; rationals; reals | 01 |
| $\lfloor x\rfloor,\lceil x\rceil$ | Greatest integer at most x; least integer at least x | 01 |
| $\sum,\prod,n!$ | Indexed sum; indexed product; factorial | 01 |
| Proposition / predicate | Fixed truth-valued statement / truth depends on inputs | 02 |
| $\forall,\exists$ | For every / there exists, over a specified domain | 02 |
| $\land,\lor,\neg,\Rightarrow,\Leftrightarrow$ | And, inclusive or, not, implication, equivalence | 02 |
| SAT | Existence of a satisfying Boolean assignment | 02 |
| Contrapositive | $\neg Q\Rightarrow\neg P$ for $P\Rightarrow Q$ | 03 |
| Well ordering | Every nonempty subset of naturals has a least member | 04 |
| Induction hypothesis | Temporary assumption used to prove a general next-step implication | 04 |
| $\in,\subseteq,\mathcal P(A)$ | Membership; subset; set of all subsets | 05 |
| Image / preimage | Outputs reached by a set / inputs mapping into a set | 05 |
| Injection / surjection / bijection | No collisions / reaches codomain / both | 05 |
| Invariant / ranking function | Reachable-state property / decreasing well-founded measure | 06 |
| Structural induction | Proof by bases and recursive constructors | 06 |
| Countable / uncountable | Finite or enumerable by naturals / not countable | 07 |
| Decider | Algorithm halting on every input with a correct decision | 07 |
| $a\mid b,\gcd(a,b)$ | Divisibility; greatest positive common divisor | 08 |
| $a\equiv b\pmod m$ | Their difference is divisible by m | 08 |
| $\varphi(m)$ | Number of invertible residues modulo m | 08 |
| Walk / path | Edge-following sequence / no repeated vertices | 09 |
| DAG / topological order | Acyclic digraph / order respecting every edge | 09 |
| Partial order / chain / antichain | Transitive directional comparison / comparable set / incomparable set | 09 |
| Equivalence class | All elements related to a given element under an equivalence relation | 09 |
| Matching / coloring / spanning tree | Disjoint edges / different colors at neighbors / tree using every vertex | 10 |
| Congestion / diameter | Largest switch route load / worst shortest terminal route length in the stated model | 10 |
| Face / planar embedding | Region including outer region / crossing-free plane drawing | 11 |
| Minor / subdivision | Deletions and contractions / edge replacement by paths | 11 |
| $O,\Omega,\Theta,o,\sim$ | Eventual upper, lower, two-sided bounds; negligible ratio; ratio tends to one | 12 |
| $H_n,\binom nk$ | Harmonic number; number of k-subsets of n labeled objects | 12–13 |
| Generating function / $[x^n]$ | Sequence stored as coefficients / coefficient extraction | 14 |
| $\Omega,A,\Pr(A)$ | Sample space; event; event probability | 15 |
| $\Pr(A\mid B)$ | Conditional probability for positive-probability B | 15 |
| PMF / CDF | Mass at a value / probability at or below a threshold | 16 |
| $I_A,\mathbb E[X]$ | Event indicator; probability-weighted mean | 16 |
| Variance / covariance | Mean squared deviation / mean product of centered variables | 17 |
| Tail bound | Inequality controlling a specified deviation or threshold event | 17 |
| Stationary distribution | Nonnegative mass-one vector unchanged by the transition matrix | 18 |
| Aperiodicity | No forced nontrivial common return-time cycle; needed with irreducibility for finite-chain convergence | 18 |

All graph, probability, and ordering conventions are stated in the preface and at their first substantive use. A symbol's domain is part of its meaning; the same letter may be reused locally for a different quantity after its scope ends.
