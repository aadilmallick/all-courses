# 16. Random variables and expectation

A probability space describes complete outcomes. Often we care only about a numerical feature: how many collisions occur, how long until success, or how much work an algorithm performs. A random variable is the function extracting that number. Source Chapter 19 develops distributions, expected values, indicators, conditional expectation, and infinite-expectation surprises.

## A random variable is a function

Given sample space $\Omega$, a real-valued random variable is $X:\Omega\to\mathbb R$. The variable is not an unspecified changing number; each complete outcome determines one definite value. For two dice, $X(i,j)=i+j$ gives the sum. The event $X=7$ is the subset $\{\omega:X(\omega)=7\}$.

The probability mass function, PMF, is $p_X(x)=\Pr(X=x)$. Some texts call a discrete mass function a “pdf”; we use PMF to avoid confusion with continuous densities. The cumulative distribution function is $F_X(t)=\Pr(X\le t)$. It is nondecreasing and ranges from zero to one. For a fair die, $F_X(3.5)=3/6$, while $p_X(3.5)=0$.

Different random variables can share a distribution without being the same function. The first die and second die each have a uniform distribution, but their values need not agree on an outcome. The pair's joint distribution records their dependence. Marginal distributions alone do not determine the joint model.

## Standard discrete distributions

A Bernoulli variable has value one with probability $p$ and zero with probability $1-p$. An indicator $I_A$ is Bernoulli with parameter $\Pr(A)$. Uniform on a finite set of $m$ distinct values assigns mass $1/m$ to each; uniformity is about probabilities, not necessarily equally spaced values.

A binomial variable $X\sim\operatorname{Bin}(n,p)$ counts successes in $n$ independent Bernoulli trials with the same success chance $p$. Exactly $k$ successes can occupy $\binom nk$ position sets, each with probability $p^k(1-p)^{n-k}$, so

$$\Pr(X=k)=\binom nkp^k(1-p)^{n-k},\qquad0\le k\le n.$$

The binomial theorem shows these masses sum to one. Varying success chances gives a different distribution even if trials remain independent; dependence can change it further. “Count of successes” is not sufficient by itself to justify a binomial model.

A geometric variable $G$ counting trials through the first success has $\Pr(G=k)=(1-p)^{k-1}p$ for $k\ge1$ and $0<p\le1$. A competing convention counts failures before success, taking values from zero; its mean differs by one. We always name the convention.

## Expected value

For a discrete variable with finite or absolutely convergent expectation,

$$\mathbb E[X]=\sum_x x\Pr(X=x)
=\sum_{\omega\in\Omega}X(\omega)\Pr(\omega).$$

The equivalence groups outcomes by their shared value. For nonnegative variables, the sum is well defined even if it is infinite. For signed variables, an undefined difference $+\infty-\infty$ is not an expected value.

A fair die has expectation $(1+2+3+4+5+6)/6=7/2$. That number is not a possible single-roll result; it is a probability-weighted center. A uniform variable on consecutive integers one through $n$ has mean $(n+1)/2$ by the arithmetic-sum formula. A uniform variable on $\{1,2,10\}$ has mean $13/3$, not the midpoint of its minimum and maximum.

Expected values do not commute with arbitrary functions. For a fair die $D$, $\mathbb E[1/D]=H_6/6=49/120$, while $1/\mathbb E[D]=2/7$. For a variable taking $-1,1$ equally, $\mathbb E[X]=0$ but $\mathbb E[X^2]=1$. Compute the transformed variable's weighted values rather than substituting the mean into a nonlinear formula.

## Linearity without independence

For variables with appropriate finite expectations,

$$\mathbb E[aX+bY+c]=a\mathbb E[X]+b\mathbb E[Y]+c.$$

Expand the outcome sum and distribute multiplication to prove it. No independence is used. If $Y=X$, then $\mathbb E[X+Y]=2\mathbb E[X]$ still holds, even though the variables are maximally dependent.

An indicator has expectation $0\Pr(A^c)+1\Pr(A)=\Pr(A)$. If a count is $X=\sum_i I_i$, then $\mathbb E[X]=\sum_i\Pr(I_i=1)$. This often avoids calculating the full distribution. It is one of the most useful methods in discrete probability.

For a binomial count, each trial indicator has mean $p$, so $\mathbb E[X]=np$. For a uniformly random permutation of $n$ objects, let $I_i$ indicate that position $i$ holds its original object. Each has chance $1/n$, hence the expected number of fixed points is one. The indicators are dependent, but linearity remains valid.

For birthday collisions among $k$ independent uniform days from $m$ possibilities, let one indicator represent each unordered pair. Each pair matches with probability $1/m$, so the expected number of matching pairs is $\binom k2/m$. This is not the same as the probability of any collision, since one outcome may contain several matching pairs.

## Conditional expectation

For an event $B$ of positive probability, $\mathbb E[X\mid B]$ is the expectation under the conditional distribution. If $B_1,\ldots,B_r$ partition the space, then

$$\mathbb E[X]=\sum_i\mathbb E[X\mid B_i]\Pr(B_i).$$

Expand each conditional mean and use total probability to justify it. The formula says to average subgroup means using the subgroup probabilities, not an unweighted average unless the groups are equally likely.

Suppose a synthetic algorithm takes ten steps for a small input class occurring with probability $0.8$ and fifty steps for a large class occurring with probability $0.2$. Its mean cost is $0.8\cdot10+0.2\cdot50=18$, not thirty. If those costs are themselves random, replace them with conditional expected costs; the same identity applies.

## Geometric waiting time and memorylessness

For $G$ counting trials through first success, condition on the first trial. With probability $p$, the cost is one; with probability $1-p$, one trial is spent and the process restarts independently. Writing $\mu=\mathbb E[G]$ gives $\mu=p\cdot1+(1-p)(1+\mu)$, hence $\mu=1/p$.

To justify finiteness before solving an equation involving $\mu$, derive the tail sum. For a nonnegative integer-valued $X$,

$$\mathbb E[X]=\sum_{k\ge1}\Pr(X\ge k).$$

Each outcome of value $j$ contributes one to the first $j$ tail indicators. Nonnegative sums can be interchanged. For geometric $G$, $\Pr(G\ge k)=(1-p)^{k-1}$, so the geometric sum gives $1/p<\infty$. The recurrence calculation is therefore legitimate.

Memorylessness means $\Pr(G>s+t\mid G>s)=\Pr(G>t)$ for nonnegative integer $s,t$. The probability of no success in $s+t$ independent trials factors as $(1-p)^{s+t}$. Dividing by $(1-p)^s$ leaves $(1-p)^t$. Real component lifetimes need not have this property; it belongs to the stated model.

## Coupon collection

Suppose each independent draw yields one of $n$ equally likely coupon types. After collecting $k$ distinct types, the chance of a new one is $(n-k)/n$. The waiting time for the next new type has expectation $n/(n-k)$. Summing stage means gives

$$\mathbb E[T]=\sum_{k=0}^{n-1}\frac{n}{n-k}=nH_n.$$

For four types, this is $4(1+1/2+1/3+1/4)=25/3$. The later stages dominate because the missing types become rare. We do not need independence between the stage times to add their expectations, though the independent-draw model helps identify each stage's geometric distribution.

The harmonic bounds show $n\ln(n+1)\le\mathbb E[T]\le n(1+\ln n)$. Thus collecting all types is on the scale $n\log n$, rather than $n$. The expected time to collect half the types is much smaller than the expected time to complete the final few.

## Products require extra conditions

If $X,Y$ are independent and expectations are well defined with suitable integrability, $\mathbb E[XY]=\mathbb E[X]\mathbb E[Y]$. For finite discrete variables, factor their joint masses and separate the double sum. Without independence this can fail: if $X=Y$ is one fair die, $\mathbb E[XY]=\mathbb E[X^2]=91/6$, while the product of means is $49/4$.

The product rule extends to mutually independent finite collections. Pairwise independence suffices for each pair product but does not automatically factor an arbitrary longer product. Always match the independence assumption to the formula being used.

## A numbers game with an adversary

Two envelopes hold fixed distinct integers $L<H$ from zero through $n$. You see one envelope chosen uniformly. Pick a random threshold uniformly from the $n$ half-integers $1/2,3/2,\ldots,n-1/2$. If the observed number is above the threshold, call it the larger; otherwise call the other envelope larger.

With probability $(H-L)/n$, the threshold lies between the numbers and the decision is always correct. Otherwise exactly one of the two possible observations leads to a correct decision, giving chance one half. Thus

$$\Pr(\text{win})=\frac12+\frac{H-L}{2n}\ge\frac12+\frac1{2n}.$$

The envelope contents need not be random. Randomness in your threshold creates a guaranteed advantage under the specified bounded range. There is no uniform positive gap independent of $n$ as the permitted range grows without bound. This example shows why distinguishing adversarial fixed inputs from random choices matters.

## Infinite expectation and gambling paradoxes

In a St. Petersburg-style game, toss a fair coin until the first head at trial $k$ and pay $2^k$. The expected payout is $\sum_{k\ge1}2^k2^{-k}=\sum_{k\ge1}1=\infty$. The game ends almost surely because the chance of surviving $k$ tosses is $2^{-k}\to0$. Almost-sure finite termination does not imply a finite expected payout or finite expected cost.

An infinite expectation is a feature of an ideal unbounded payout model, not a guarantee that a practical player will obtain a large amount on one play. Truncating the maximum trial at $N$ changes the expectation to a finite quantity that must be recalculated with the actual cap rule. Utility, available funds, and model realism are separate questions from the arithmetic mean.

Another trap is exchanging limit and expectation for signed or unbounded variables without a theorem. Finite linearity is safe under finite expectations; infinite linearity is safe for nonnegative terms or absolute convergence. A sequence can converge pointwise while its expected values do not converge to the expectation of its limit. State which condition permits the interchange.

## A joint-distribution example

Let $X$ be the first of two independent fair bits and let $S$ be their sum. The joint outcomes $(X,S)$ are $(0,0),(0,1),(1,1),(1,2)$, each with probability one quarter. Although the original bits are independent, $X$ and $S$ are not: observing $S=0$ forces $X=0$. A function of independent inputs can depend on one of those inputs. Independence is a relation between the specific variables under discussion, not a permanent label attached to the experiment.

The distribution of $S$ has masses one quarter, one half, one quarter at zero, one, two. Its mean is one. Conditional on $X=0$, the mean of $S$ is one half; conditional on $X=1$, it is one and a half. Weighting those conditional means equally gives one, verifying total expectation through an explicit table.

## Expected collision count versus collision chance

For three independent uniform birthdays among two possible days, a collision is certain by pigeonhole. Yet the expected number of matching pairs is $\binom32/2=3/2$, which exceeds one. This is not an invalid probability because it is an expected count. If all three birthdays agree, there are three matching pairs; otherwise there is one. Those outcomes have probabilities one quarter and three quarters, giving mean $3(1/4)+1(3/4)=3/2$.

An indicator of any collision has expectation one, while the sum of pair indicators has expectation one and a half. Naming the random variable makes the distinction precise. Markov's inequality later converts the expected pair count into an upper bound on the probability of at least one pair, but it need not be an exact formula.

## Fair individual predictions can yield an unfair shared pot

Three players each contribute two units to a pot. They independently predict a fair coin result, and correct predictors split the pot; if nobody is correct, all contributions are returned. Under independent fair predictions, symmetry and conservation give zero expected net gain to each player. Each individual prediction has success chance one half.

Now let two players coordinate opposite predictions. Exactly one of those two is correct on every toss. If you predict correctly, you share the six-unit pot with that player and gain one net unit. If you predict incorrectly, you lose your two-unit stake. With each case having probability one half, your mean gain is $(1/2)(1)+(1/2)(-2)=-1/2$. Every player's marginal correctness can still be one half; the dependence changed the payoff distribution.

This is the source's collusion lesson in a smaller algebraic form. In a shared-prize model, expected return depends on both your winning probability and how many others win with you. Choosing less popular entries can affect conditional sharing without changing the probability of the random draw itself. That mathematical observation is not a recommendation to gamble; it identifies which random variables a complete payoff model must include.

## The doubling paradox with a finite cap

In an ideal fair win-or-lose game, stake one unit, then two after a loss, then four, stopping at the first win. A win on trial $k$ returns net one because prior losses total $2^{k-1}-1$. If there is no cap and unlimited credit, a win eventually occurs almost surely, so the final net gain is one almost surely. Summing the zero expectations of individual fair bets to claim zero final gain would interchange an infinite signed sum without the required condition.

Cap the strategy at $K$ trials. With probability $1-2^{-K}$ there is a win and net gain one; with probability $2^{-K}$ all trials lose and the net is $-(2^K-1)$. The expected net is exactly zero. As $K$ grows, the rare loss becomes exponentially larger, balancing the increasingly likely gain. The final-gain variables converge almost surely to one, but their expectations remain zero. This is a concrete example where limit and expectation do not commute.

The expected absolute size of the contribution on each potential trial does not decay sufficiently, so the absolute-summability condition for infinite linearity fails. A finite bankroll restores a finite experiment and removes the apparent contradiction. The mathematics diagnoses the hidden unbounded-resource assumption rather than declaring a real-world guaranteed-profit method.

## A tail-sum calculation without a PMF

Suppose a nonnegative integer-valued cost has tail probabilities $\Pr(X\ge k)=1/2^{k-1}$ for $k\ge1$. The mean is the geometric sum two. To recover its mass function, subtract consecutive tails: $\Pr(X=k)=\Pr(X\ge k)-\Pr(X\ge k+1)=2^{-k}$. Either representation determines the distribution, but the tail form makes the mean particularly simple.

In algorithm analysis, it may be easier to bound the probability that a process survives at least $k$ steps than to calculate the probability it stops at exactly $k$. Summing tail bounds then bounds expected cost. The method rests on the indicator expansion of a nonnegative count, so no cancellation or unjustified signed rearrangement is involved. This is why tail probabilities are central in both expectation and concentration arguments.

Expected cost is not the cost of a typical individual run unless further distributional information supports that interpretation. In the coupon problem, late rare waits can pull the mean upward. In a bounded binomial problem, concentration may make the mean more representative. The next chapter supplies tools for stating that representativeness quantitatively instead of relying on the word “average.”

When reporting a mean from simulation, state the number of trials and any cap on duration or payout. A cap changes the random variable being averaged. If a theoretical expectation is infinite, every finite simulated sample still has a finite arithmetic mean, so finite output alone cannot refute the theory. The appropriate evidence is the analytical tail behavior and a precise account of the simulated truncation.

State whether a reported expectation counts trials, failures, visits, or elapsed transitions. An unmentioned one-step difference can otherwise appear to contradict an entirely correct formula.

## Practice and companion

The distribution lab displays exact binomial masses, CDF values, and mean. The coupon lab compares seeded simulation with the exact $nH_n$ expectation. Simulation means fluctuate and can be misleading for heavy-tailed games; the infinite expectation example is established analytically rather than claimed from a finite run.

**16-A.** Find the PMF and expectation of the number of heads in three fair tosses. **16-B.** Derive the expected number of matching pairs among ten uniform birthdays with $m=365$. **16-C.** Find the expected trials through first success when $p=1/5$. **16-D.** Explain why linearity does not require independence. **16-E.** Calculate the four-coupon expectation. **16-F.** Explain why a variable can be finite almost surely yet have infinite mean.
