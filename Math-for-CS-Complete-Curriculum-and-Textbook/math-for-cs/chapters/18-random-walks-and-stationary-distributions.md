# 18. Random walks and stationary distributions

A random walk changes state by a random local rule. The rule may be simple while long-term behavior is surprising: a fair walk can eventually hit a boundary with probability one but have infinite expected hitting time when the other boundary is removed. Source Chapter 21 connects gambler's ruin to graph walks and the mathematical idea behind PageRank. Recurrences from Chapter 14 and conditional probability from Chapter 15 supply the tools.

## A finite gambler's-ruin model

States are integers $0,1,\ldots,N$. Starting at $i$, each independent step increases the state by one with probability $p$ and decreases it by one with probability $q=1-p$. States zero and $N$ are absorbing: the walk stops there. Assume $0<p<1$ initially. This is a mathematical model of a bounded random process, not betting advice.

Let $h_i$ be the probability of hitting $N$ before zero. Boundary values are $h_0=0,h_N=1$. Conditioning on the first step gives

$$h_i=ph_{i+1}+qh_{i-1},\qquad1\le i\le N-1.$$

The equation is a weighted average of neighboring success chances. It uses the Markov property: once the new state is known, the future evolution follows the same rule and does not depend on the earlier route. Independence of step choices supplies that property here.

## Fair success probabilities

At $p=q=1/2$, rearrange to $h_{i+1}-h_i=h_i-h_{i-1}$. Consecutive differences are constant, so $h_i=A+Bi$. Boundary conditions give $A=0,B=1/N$, hence $h_i=i/N$.

Starting at three with target ten, success probability is $0.3$ and ruin probability $0.7$. Fair individual steps do not mean an equal chance of reaching unequal boundaries. The starting distance and target matter. The expected final fortune is $N(i/N)+0(1-i/N)=i$, consistent with fair increments, but that expectation alone would not prove termination or the hitting formula.

Why is absorption certain in a finite interval? From any interior state, a block of at most $N$ consecutive downward steps reaches zero, with probability at least $q^N>0$. Thus the probability of surviving $k$ blocks is at most $(1-q^N)^k\to0$. This also gives a finite, though loose, upper bound on expected absorption time. It justifies treating the boundary outcomes as exhaustive.

## Biased success probabilities

For $p\ne q$, try $h_i=A+Br^i$ in the recurrence. The characteristic equation $pr^2-r+q=0$ has roots one and $r=q/p$. Boundary conditions give

$$h_i=\frac{1-r^i}{1-r^N},\qquad r=\frac qp.$$

If $p=0.4,q=0.6,N=4,i=2$, then $r=1.5$ and $h_2=(1-2.25)/(1-5.0625)=4/13\approx0.307692$. The fair value would be one half, so a downward bias reduces the success chance.

Both numerator and denominator can be negative when $r>1$, leaving a positive ratio. Near $p=1/2$, numerical subtraction of nearly equal quantities can lose precision, so use the fair formula at exact equality and stable exponential forms near it. At $p=0$, every interior start reaches zero; at $p=1$, every positive interior start reaches $N$. These endpoints are separate cases rather than divisions by zero.

## Expected absorption time

Let $t_i$ be the expected number of steps until a boundary. Then $t_0=t_N=0$ and

$$t_i=1+pt_{i+1}+qt_{i-1}.$$

The added one counts the first step. For the fair case, try a quadratic $t_i=Ai^2+Bi+C$. Substitution shows $A=-1$, and the boundaries give $C=0,B=N$. Therefore $t_i=i(N-i)$.

At $i=3,N=10$, expected duration is twenty-one steps. Starting halfway maximizes it, around $N^2/4$. Doubling interval width while keeping relative position fixed multiplies the expected time by four, even though the number of states only doubles.

For a biased walk, a particular solution is $i/(q-p)$ and the homogeneous solutions are one and $r^i$. Applying boundaries yields

$$t_i=\frac{i-Nh_i}{q-p},\qquad p\ne q.$$

For the $p=0.4,N=4,i=2$ example, $t_2=(2-4(4/13))/0.2=50/13\approx3.846154$. Substitute into neighboring-state equations or solve the finite linear system to verify. A simulation mean should approach this value with sampling fluctuation, not equal it on every run.

## Removing the upper boundary

Let a walk start at positive integer $i$ and continue until zero, with no upper target. For $p\le1/2$, ruin occurs with probability one. One route to this statement uses the finite-boundary formula and lets $N$ grow: the probability of reaching $N$ before zero tends to zero. A path avoiding zero forever either reaches arbitrarily high states or remains forever in some finite interval; the latter event has probability zero by the same block argument used above.

For $p>1/2$, eventual ruin probability is $(q/p)^i<1$. The recurrence has multiple algebraic solutions, so boundary and limiting requirements are essential to select the probability solution. Solving a recurrence without those conditions can produce an irrelevant answer.

At $p<q$, expected time to zero is $i/(q-p)$. At fairness it is infinite despite almost-sure ruin. A clean lower-bound argument stops additionally at $N$: its expected duration is $i(N-i)$, and the unbounded walk's time to zero is at least that truncated stopping time. Letting $N\to\infty$ forces an infinite expectation. This distinguishes probability-one events from finite average waiting time.

## “Quit while ahead” and stopping rules

For a fair walk, stopping when one unit ahead eventually succeeds with probability one if unlimited losses and time are allowed in the mathematical model. But the stopping time has infinite mean and interim losses are unbounded. An argument that every fixed step has zero expected gain does not automatically justify exchanging an unbounded stopping rule with expectation.

Optional-stopping theorems provide conditions under which expected value is preserved, such as bounded stopping times or other suitable integrability bounds. We do not assume those hypotheses merely because a strategy sounds sensible. The lesson is about the validity of an interchange, not a claim that a clever stopping rule creates a practical guaranteed profit.

## Walks on graphs

For a finite graph, a transition matrix $P$ has entry $P_{ij}$ equal to the chance of moving from vertex $i$ to vertex $j$ in one step. Each row sums to one. We represent distributions as row vectors, so if $\pi^{(t)}$ describes the current location, then $\pi^{(t+1)}=\pi^{(t)}P$.

On a simple undirected graph with no isolated vertices, the standard walk chooses a neighbor uniformly, so $P_{ij}=1/\deg(i)$ on edges and zero elsewhere. On the three-vertex path $a-b-c$, the matrix is

$$P=\begin{pmatrix}0&1&0\\1/2&0&1/2\\0&1&0\end{pmatrix}.$$

Starting at $a$ gives distributions $(1,0,0)$, $(0,1,0)$, $(1/2,0,1/2)$, then $(0,1,0)$ again. The walk oscillates between the two sides of a bipartition. This warns us that a stationary distribution need not be the limit of the distribution at each exact time.

## Stationary distributions

A stationary distribution $\pi$ has nonnegative entries summing to one and satisfies $\pi P=\pi$. Once initialized with that distribution, one step leaves it unchanged. On a connected undirected graph, $\pi_i=\deg(i)/(2|E|)$ is stationary. For each edge, the probability flow $\pi_iP_{ij}=1/(2|E|)$ equals the reverse flow. Summing incoming flow yields the desired vertex probability.

For the three-vertex path, this gives $(1/4,1/2,1/4)$, which remains unchanged after multiplication. The walk is connected and has a unique stationary distribution, yet the earlier point-mass start oscillates. Uniqueness of stationarity and convergence from every start are different claims.

For finite irreducible chains, meaning all states communicate by positive-probability paths, a unique stationary distribution exists. Aperiodicity additionally ensures convergence of time-$t$ distributions from every start. A self-loop with positive probability in an irreducible chain is a sufficient way to break periodicity. Long-run empirical proportions can have their own convergence properties even when exact-time distributions oscillate; do not conflate these statements.

## Ranking a directed web graph

Indegree counts incoming links, but it gives every linking page the same weight and can be manipulated by making many pages. A random-walk ranking shares each page's probability mass across its outgoing links. For a non-dangling page $i$, a basic link-following rule sends $\pi_i/\operatorname{outdeg}(i)$ to each destination. This leads to the stationary equations described in the source.

Dangling pages have no outgoing links, so the simple rule needs a repair. Our companion replaces a dangling row by a uniform distribution over all pages. Then use damping: with probability $\alpha$ follow the repaired link rule, and with probability $1-\alpha$ jump uniformly to any page, including the current one. For $0<\alpha<1$,

$$P=\alpha L+(1-\alpha)J/n,$$

where $L$ is row-stochastic and $J$ is the all-ones matrix. Every entry of $P$ is positive, so the chain is irreducible and aperiodic. A unique stationary distribution exists and power iteration converges.

The source presents a supervertex restart description. We use the equivalent direct-jump style as an explicitly defined teaching model, rather than claim it reproduces any current search engine's ranking system. A restart construction must still be checked for periodicity; strong connectivity alone does not guarantee exact-time convergence.

## Power iteration and numerical evidence

Start with uniform $\pi^{(0)}$, repeatedly compute $\pi^{(t+1)}=\pi^{(t)}P$, and stop when the largest entrywise change is below a displayed tolerance or a fixed iteration limit is reached. Report both the normalization error and residual $\|\pi P-\pi\|_1$, where $\|x\|_1=\sum_i|x_i|$.

A small residual is numerical evidence of approximate stationarity, not a proof of every claimed digit. Convergence follows from the positive teleportation model; the implementation still needs checks for matrix orientation, missing dangling mass, and normalization. Confusing row-vector and column-vector conventions can produce results that look normalized but solve the wrong equations.

For a two-page graph with $a\to b$ and $b\to a$, direct link following oscillates. Adding a uniform jump permits staying in place and drives both starts toward $(1/2,1/2)$. For a directed graph with one absorbing sink and no restart, a stationary distribution may concentrate entirely at the sink. These contrasting examples explain the role of the model choices.

## Solving the smallest nontrivial walk

For target $N=3$ in a fair walk, the interior success probabilities satisfy $h_1=h_2/2$ and $h_2=(h_1+1)/2$. Substituting the first into the second gives $h_2=h_2/4+1/2$, so $h_2=2/3$ and $h_1=1/3$. This miniature linear system verifies the general linear formula and shows exactly how boundary values enter the equations.

Expected durations satisfy $t_1=1+t_2/2$ and $t_2=1+t_1/2$. Solving gives both equal to two, matching $i(3-i)$. The same method works for larger finite chains, although hand algebra becomes longer. The general recurrence solution is valuable because it explains a whole family at once; the small system is valuable as an independent numerical check.

## Probability mass conservation in matrix updates

If a row distribution has total one and each transition row sums to one, then the updated total is $\sum_j\sum_i\pi_iP_{ij}=\sum_i\pi_i\sum_jP_{ij}=1$. Nonnegative entries remain nonnegative. These two properties are invariants of the distribution-update machine. A numerical implementation can check them after every iteration and report an error if substantial mass disappears.

With a dangling vertex, leaving its transition row all zeros violates the row-sum condition and loses probability mass whenever a walker reaches it. Renormalizing afterward hides the modeling error by conditioning on survival rather than repairing the intended process. Replacing the row with a declared restart distribution supplies an actual transition rule and preserves the original meaning of total probability.

## Detailed balance and its limits

For an undirected graph walk, equal edge flow in both directions is called detailed balance. It implies stationarity by summing flows, but stationarity need not imply detailed balance for a directed chain. Consider a directed three-cycle that moves deterministically forward. The uniform distribution is stationary, yet flow along each forward edge has no reverse counterpart. The chain circulates probability around the cycle.

This distinction helps interpret a ranking. A stationary distribution says incoming mass balances outgoing mass at every vertex overall, not that every pairwise exchange is balanced. Undirected degree formulas do not automatically apply to directed graphs. There, solve the actual transition equations or use an appropriate theorem for the stated model.

## Why damping creates a contraction

Take two row distributions $u,v$ and a row-stochastic matrix $L$. The difference after a common uniform-teleport update is $\alpha(u-v)L$, because the teleport terms cancel. Stochastic multiplication cannot increase the sum of absolute differences: apply the triangle inequality and sum each row's transition probabilities. Therefore the distance after one update is at most $\alpha$ times the previous distance.

For $0<\alpha<1$, repeated updates contract differences geometrically. This gives a direct explanation of convergence and uniqueness for the damped model, without assuming a result merely because the graph looks well connected. It also explains why a damping parameter closer to one can require more iterations for a given tolerance. The result concerns this positive-teleport finite model; it does not assert a universal iteration count for every ranking implementation.

## Interpreting censored trials

A simulation may stop each trial after a fixed step cap to keep the interface responsive. If a walk has not reached a boundary by that cap, the result is unknown for that trial. Counting it as ruin biases success downward; counting it as success biases upward; discarding it can also bias an average duration. Report the number censored and describe any estimate as conditional on completed trials when that is what was calculated.

For small finite intervals, the cap can be large enough that censoring is rare, but rarity should be observed and reported rather than assumed. The exact formulas remain the reference values. A disagreement can indicate sampling fluctuation, censoring, a parameter mismatch, or an implementation error. The interface presents these quantities together to make those explanations distinguishable.

## Connecting the final chapter to the first

The fair-walk probability uses a linear recurrence, while its duration uses a quadratic solution. The stationary model uses a function on probability vectors and an invariant that total mass is one. The convergence argument uses a geometric decrease. Each idea was developed earlier in a simpler setting. This cumulative structure is why the course begins with equations, functions, and proof instead of presenting random-walk formulas as isolated facts.

When facing a new stochastic process, repeat the same sequence: define states, specify transitions, identify the target event or cost, condition on the first step, state boundary conditions, solve, and verify a small instance. This method is more transferable than memorizing a single gambler's-ruin expression.

The stationary vector is normalized because multiplying any stationary solution by a constant still satisfies the homogeneous balance equations. Without a total-mass condition, the all-zero vector would also qualify algebraically but would not be a probability distribution. Check nonnegativity and sum one as well as the balance equations. This is another example where solving equations is only part of verifying that the solution represents the intended mathematical object.

For a reducible finite chain, several closed classes can support different stationary distributions, and mixtures can also be stationary. A unique numerical result from one initial distribution does not prove uniqueness over all possible initializations. The positive teleportation model avoids this ambiguity by making every state communicate with every other in one step.

## Practice and synthesis

The random-walk lab displays exact finite-boundary success probability and expected duration beside a seeded simulation. Capped trials are reported as censored rather than silently treated as losses. The ranking lab computes stationary probabilities from a visible small graph and displays the residual; damping and iteration controls show their actual effect.

**18-A.** Find success probability and mean duration for a fair walk with $N=8,i=3$. **18-B.** Derive the fair solution from equal successive differences. **18-C.** Explain why almost-sure ruin can coexist with infinite mean duration. **18-D.** Find the stationary distribution of the three-vertex path. **18-E.** Explain why that walk can oscillate despite a unique stationary distribution. **18-F.** Identify how teleportation repairs both a dangling page and periodic behavior.

The full sequence now connects logic to proof, proof to program structure, structure to counting, counting to probability, and probability back to recurrences and graphs. The curriculum's final projects ask you to make these connections explicit in one coherent mathematical argument.
