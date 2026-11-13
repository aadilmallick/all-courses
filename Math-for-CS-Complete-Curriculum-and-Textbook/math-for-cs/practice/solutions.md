# Practice solutions and assessment keys

These are reference arguments for the original optional problems in the companion chapters. They are not solutions to the source PDF's entire problem bank. Equivalent valid proofs are welcome. A correct answer needs the hypotheses and justifications, not identical wording.

## Chapter 01

**01-A.** Factor $x^2-4=(x-2)(x+2)$. The quotient equals $x+2$ for $x\ne2$. The original real domain is $\mathbb R\setminus\{2\}$; cancellation does not restore the missing input.

**01-B.** Subtract four: $-3x\le6$. Divide by negative three and reverse order: $x\ge-2$.

**01-C.** Need $6\cdot2^k\ge150$, or $2^k\ge25$. Since $2^4=16<25\le32=2^5$, the minimum is five doublings.

**01-D.** Terms are $2,4,6,8$, totaling twenty. Alternatively $2\sum_{i=0}^3i+2\cdot4=2\cdot6+8=20$.

**01-E.** Equality at one input does not restrict other inputs. For example $x^2=x$ holds at zero and one but fails at two. A universal identity requires a general proof or equivalent exhaustive reasoning on its whole domain.

## Chapter 02

**02-A.** The original is $\forall n\in\mathbb Z\exists m\in\mathbb Z:m>n$. Its negation is $\exists n\in\mathbb Z\forall m\in\mathbb Z:m\le n$.

**02-B.** Interpret the formula as $((P\Rightarrow Q)\land P)\Rightarrow Q$. It is a tautology: if its antecedent is true, both $P$ and its implication to $Q$ are true, forcing $Q$. If the antecedent is false, the implication is true by definition.

**02-C.** Set $P$ false and $Q$ true. Both premises are true, but the proposed conclusion $P$ is false.

**02-D.** $(P\lor Q)\land(\neg P\lor\neg Q)$. The first clause excludes neither true; the second excludes both true.

**02-E.** After arbitrary $x$ is chosen, take $y=-x$. The quantifier order permits that dependence. A single fixed $y$ could not work for both $x=0$ and $x=1$.

## Chapter 03

**03-A.** Write the odd integers as $2a+1$ and $2b+1$. Their sum is $2(a+b+1)$, an even integer because the parenthesized quantity is integral.

**03-B.** Contrapositive: if $n$ is even, then $3n+1$ is odd. Set $n=2k$, giving $3n+1=6k+1=2(3k)+1$. Thus the contrapositive, and hence the original implication, holds.

**03-C.** $x=1,y=-1$ have equal squares but differ. Requiring both variables nonnegative repairs the claim: factoring gives $(x-y)(x+y)=0$, and either $x=y$ or both are zero when $x+y=0$.

**03-D.** Solving gives $x=3$, and substitution verifies existence. If $x,y$ both solve, subtraction gives $5(x-y)=0$, so $x=y$ because five is nonzero.

**03-E.** Require $c\ne0$ over the real numbers. With $c=0$, any $a,b$ satisfy the premise, including unequal choices. Modular cancellation requires the stronger context-specific condition of invertibility.

## Chapter 04

**04-A.** At zero, both sides are zero. If the sum of the first $k$ odd numbers is $k^2$, adding $2k+1$ gives $k^2+2k+1=(k+1)^2$. Induction proves the identity.

**04-B.** Base zero gives one on both sides. Assuming $3^k\ge2k+1$, obtain $3^{k+1}\ge6k+3\ge2k+3$ since $k\ge0$. This is the next case.

**04-C.** If a least counterexample $m\ge2$ exists, it is not prime. Write $m=ab$ with $2\le a,b<m$. The smaller $a$ has a prime divisor, which also divides $m$, contradiction.

**04-D.** The formula is $a_n=2\cdot3^n$. It holds at zero; multiplying the formula at $k$ by three gives the formula at $k+1$.

**04-E.** The sequence $1,1/2,1/4,\ldots$ decreases strictly and stays positive forever. Natural-number well ordering cannot be applied to its real values.

## Chapter 05

**05-A.** The subsets are $\varnothing$, the three singletons, $\{a,b\},\{a,c\},\{b,c\}$, and $\{a,b,c\}$. There are eight.

**05-B.** Injective: $n+5=m+5$ gives $n=m$. Surjective: arbitrary integer $b$ has integer preimage $b-5$. Thus bijective.

**05-C.** The preimage is $\{-2,-1,1,2\}$. Each squares to one or four, and no other integer does.

**05-D.** Yes. Absolute-value equality is reflexive, symmetric, and transitive because ordinary equality has those properties. Classes are $\{0\}$ and $\{-k,k\}$ for positive $k$.

**05-E.** A list records multiplicity. The list $(a,a,b,b,b)$ yields the set $\{a,b\}$, which has only two members.

## Chapter 06

**06-A.** $(105,42)\to(42,21)\to(21,0)$. The gcd remains the original gcd at every transition. While nonzero, the second coordinate decreases strictly, so termination is guaranteed and the answer is twenty-one.

**06-B.** A machine with state zero and transition $0\to0$ preserves “state equals zero” but runs forever.

**06-C.** Prefix balances are $1,2,1,2,1,0,1,0$. None is negative and the final balance is zero, so the string is balanced.

**06-D.** Structural induction gave $L=I+1$. Total nodes are $L+I=2I+1$. The formula presupposes every operator node has exactly two children.

**06-E.** A receiver compares the new proposal with its current best. Replacing the held proposer can only improve its rank. Therefore once a proposer is rejected, every later held proposer is preferred to that rejected one.

## Chapter 07

**07-A.** $0,1,-1,2,-2,\ldots$ reaches every integer once. Positions $2k-1$ and $2k$ hold $k$ and $-k$ for positive $k$.

**07-B.** An infinite row never completes, so a row-by-row listing never reaches any pair with first coordinate one. Diagonal traversal reaches each pair after finitely many entries.

**07-C.** For alleged surjection $f:A\to\mathcal P(A)$, set $D=\{a\in A:a\notin f(a)\}$. A preimage $d$ of $D$ would satisfy $d\in D\Leftrightarrow d\notin D$, impossible.

**07-D.** The false assumption is a total, universally correct halting decider. A program that reverses the decider's prediction about self-application contradicts either possible answer. Restricted deciders and tools returning unknown are not excluded.

**07-E.** Finite strings can be grouped by length and enumerated. Infinite sequences correspond to subsets of naturals, so Cantor's theorem makes them uncountable. Arbitrarily long finite strings remain finite descriptions.

## Chapter 08

**08-A.** $84=2\cdot30+24$, $30=24+6$. Thus $6=30-(84-2\cdot30)=3\cdot30-84$. Coefficients are $-1,3$.

**08-B.** $5\cdot7=35\equiv1\pmod{17}$, so multiply by seven: $x\equiv21\equiv4\pmod{17}$.

**08-C.** Every $4x-6y$ is even, so cannot equal three. Equivalently the gcd two does not divide the right side.

**08-D.** $\varphi(60)=60(1-1/2)(1-1/3)(1-1/5)=16$.

**08-E.** $10^3\equiv10\pmod{55}$ and $10^{27}\equiv10\pmod{55}$. Modulo five both are zero, and modulo eleven recovery follows Fermat. The noncoprime message is still recovered; raw toy RSA need not hide it.

**08-F.** From known nonzero $m$ and $c\equiv km\pmod p$, compute $m^{-1}$ and recover $k\equiv cm^{-1}\pmod p$. The public prime makes every nonzero message invertible.

## Chapter 09

**09-A.** $a,b,c,d$ and $a,c,b,d$. The start and end are forced, while $b,c$ are incomparable.

**09-B.** There are two intermediate vertices giving two-edge walks, $b$ and $c$. Matrix multiplication sums one contribution for each.

**09-C.** Two distinct elements related only to themselves form a weak partial order. Both are minimal and neither precedes the other, so no least element exists.

**09-D.** At most five depth layers contain thirty vertices. Some layer has at least six, forming an antichain.

**09-E.** If $z\in[x]\cap[y]$, then $x\sim z\sim y$, using symmetry where needed. Transitivity gives $x\sim y$, and another transitive step gives equal membership in their classes.

**09-F.** Unit durations make path vertex count equal to sequential time; unlimited processors permit all available incomparable tasks to run together. Limited processors, unequal durations, or extra resource conflicts can increase or change the required time calculation.

## Chapter 10

**10-A.** The degree sum is even. Even-degree terms contribute zero modulo two and odd-degree terms contribute one, so their count is even.

**10-B.** Three left vertices all adjacent to the same two right vertices fail Hall's condition on the full left side, although none is isolated.

**10-C.** Alternating two colors around five edges returns to the starting side with the wrong color. Three colors work by alternating along four vertices and giving the last a third color.

**10-D.** Take edges two and five, total seven. Any spanning tree of a triangle uses two edges, and these are the cheapest pair.

**10-E.** For $N=8$, switch counts are fifteen, sixty-four, thirty-two, and forty-eight in tree, array, butterfly, Beneš order.

**10-F.** In a cycle of length at least three, consecutive edges must alternate between the two matching types, since a vertex has at most one edge of each. Closing the alternation requires even length. This supplies the two-coloring for recursive routing.

## Chapter 11

**11-A.** $f=2-v+e=7$.

**11-B.** $K_6$ has fifteen edges, while a simple planar graph with six vertices has at most twelve. Therefore it is nonplanar.

**11-C.** $K_{3,3}$ has nine edges, which passes the general twelve-edge bound. Its bipartite planar bound is eight, which it violates.

**11-D.** With $4f=2e$ and $3v=2e$, Euler gives $2e/3-e+e/2=2$, so $e=12,v=8,f=6$.

**11-E.** A graph is adjacency data; an embedding is a placement without crossings on a surface; a minor uses deletion and edge contraction; a subdivision replaces edges by paths with fresh internal vertices.

**11-F.** A degree-five vertex can have neighbors using all five colors, leaving none. The six-color proof always has a spare color; five colors need a recoloring/separation argument.

## Chapter 12

**12-A.** $(3^8-1)/(3-1)=3280$.

**12-B.** Write $1/[k(k+1)]=1/k-1/(k+1)$ and cancel adjacent terms to obtain $1-1/(n+1)$.

**12-C.** For $n\ge1$, $5n+9\le14n$. Take $C=14,n_0=1$.

**12-D.** Yes. The ratio is $\log_2n/n\to0$, using logarithm versus positive-power growth. The eventual comparison is a limit statement, not a finite graph observation.

**12-E.** The index region is $1\le i\le j\le n$. Reversing yields $\sum_{j=1}^n\sum_{i=1}^j1=n(n+1)/2$.

**12-F.** Each doubling-size block of harmonic terms contributes at least one half, so the total is unbounded. Individual contributions tending to zero do not imply convergence of their sum.

## Chapter 13

**13-A.** $\binom83=56$.

**13-B.** Eleven letters comprise four I's, four S's, two P's, and one M. The count is $11!/(4!4!2!)=34{,}650$.

**13-C.** Stars and bars gives $\binom92=36$.

**13-D.** Thirty multiples of two plus twelve of five minus six of ten gives thirty-six.

**13-E.** Complementation is a reversible correspondence between $k$-subsets and $(n-k)$-subsets of a fixed $n$-element universe.

**13-F.** Division by $d$ is justified only if every target object has exactly $d$ descriptions. Unequal orbit sizes or varying multiplicity cannot be corrected by the same constant divisor without additional analysis.

## Chapter 14

**14-A.** Add one: $a_n+1=2(a_{n-1}+1)$. Thus $a_n+1=5\cdot2^n$, giving $a_n=5\cdot2^n-1$. Verify the initial value four.

**14-B.** The coefficient is three: the three numerator monomials each multiply a coefficient one in the denominator series.

**14-C.** $a_n=A+B2^n$, with $A+B=0,A+2B=1$, so $A=-1,B=1$. Therefore $a_n=2^n-1$.

**14-D.** The leaf exponent is $\log_24=2$, exceeding the toll exponent one. A geometric recursion-tree sum gives $\Theta(n^2)$.

**14-E.** Constructing a legal method shows the optimum is no larger than its cost. A matching lower bound must hold for every legal method to prove optimality.

**14-F.** Formal equality matches each coefficient using finite arithmetic. Evaluating at a real number requires analytic convergence; $1/(1-x)$ as a formal geometric series cannot be numerically summed at $x=2$.

## Chapter 15

**15-A.** The complement has no six on either roll, probability $25/36$. Therefore at least one six has probability $11/36$.

**15-B.** Sum two has one ordered pair while sum seven has six. Uniform elementary pairs induce a nonuniform distribution on sums.

**15-C.** The flagged probabilities are $0.1(0.9)=0.09$ malicious and $0.9(0.05)=0.045$ benign, so the posterior is $0.09/0.135=2/3$.

**15-D.** A fair die's events “one” and “two” are disjoint with positive probability. Their intersection is zero while the product is $1/36$, so they are dependent.

**15-E.** Each pair among independent fair bits $X,Y$ and $Z=X\oplus Y$ is uniform on four pair values. The triple has only four possible values, so it is not uniform on eight triples and not mutually independent.

**15-F.** The host knows the prize, always opens a different losing door, and always offers a switch. The initial prize placement/choice model gives initial correctness one third. Random uninformed reveals require a different conditional calculation.

## Chapter 16

**16-A.** Masses at zero, one, two, three are $1/8,3/8,3/8,1/8$. Mean is $3/2$, also obtained from three indicators of mean one half.

**16-B.** Forty-five unordered pairs each match with chance $1/365$, so the mean count is $45/365=9/73$.

**16-C.** Five trials on average, including the successful one. Counting failures instead gives four.

**16-D.** In the outcome sum, distribution of addition over a finite sum separates each variable's contribution. No factoring of joint probabilities is used.

**16-E.** $4H_4=4(25/12)=25/3$.

**16-F.** In the unbounded doubling-payout example, trial $k$ has probability $2^{-k}$ and value $2^k$, so every term contributes one to an infinite mean even though the first-head trial is finite almost surely.

## Chapter 17

**17-A.** Pointwise, $X\ge aI_{X\ge a}$ for nonnegative $X$ and positive $a$. Take expectations and divide by $a$.

**17-B.** Mean $1/4$; variance $p(1-p)=3/16$.

**17-C.** The bound is $9/12^2=1/16$.

**17-D.** $n\ge1/[4(0.05)(0.1)^2]=500$. Round upward when a sufficient-size formula is nonintegral.

**17-E.** If all jobs choose the same random server together, a server's load is either all jobs or zero. It is not a sum of independent per-job Bernoulli choices and is not binomial under the independent-assignment formula.

**17-F.** Conditional on initial run $k$, expected attempts are $2^{k+1}$, weighted by $2^{-(k+1)}$. Summing one over all $k$ diverges. For each fixed $k$, success still occurs almost surely.

## Chapter 18

**18-A.** Success probability is $3/8$ and mean duration is $3(8-3)=15$.

**18-B.** The fair recurrence implies $h_{i+1}-h_i=h_i-h_{i-1}$, so $h_i=A+Bi$. Boundary values zero and one at zero and $N$ yield $h_i=i/N$.

**18-C.** Stop also at $N$. The truncated mean $i(N-i)$ grows without bound as $N$ increases, and the time to zero without an upper stop is at least this truncated time. Yet eventual ruin has probability one in the fair case.

**18-D.** Degrees one, two, one normalize to $(1/4,1/2,1/4)$.

**18-E.** A point-mass start alternates between bipartition sides, so exact-time distributions oscillate. The stationary mixture exists and is unique, but aperiodicity is missing.

**18-F.** A dangling row is replaced by a probability distribution, preventing mass loss. Uniform teleportation makes all transitions positive, ensuring communication and aperiodicity, with a contraction argument for convergence.

## Assessment II key

1. $\sum_{j=0}^{n-1}r^j=(1-r^n)/(1-r)$ for $r\ne1$, and $n$ at $r=1$; derive by shifting/subtracting. 2. For $3n^2+7n+2$, bounds $3n^2$ and $12n^2$ hold at $n\ge1$. 3. $9\cdot9\cdot8\cdot7\cdot6=27{,}216$. 4. $60+40-20=80$. 5. Split a $k$-subset according to a designated element's membership, yielding Pascal's identity.

## Concrete semester examination keys

**S1.** Base zero is the empty sum. Add $2k+1$ to the induction hypothesis $k^2$ to obtain $(k+1)^2$. State arbitrary nonnegative k and the exact predicate.

**S2.** States are $(84,30),(30,24),(24,6),(6,0)$. Common divisors are preserved because $a=qb+r$ makes the pairs $(a,b)$ and $(b,r)$ have the same divisors. The invariant is equality with the original gcd. Positive second coordinates decrease strictly and stay nonnegative, proving termination; at zero the first coordinate is the gcd. Handle an initially zero second coordinate directly.

**S3.** Use $D=\{a\in A:a\notin f(a)\}$. If f were surjective, $f(d)=D$ for some d, yielding $d\in D$ exactly when $d\notin D$. The subset is bounded by A, so no unrestricted universal-set formation is used.

**S4.** The inverse of seven modulo twenty-six is fifteen. Multiply to get $x\equiv75\equiv23$. Check $7\cdot23=161\equiv5$. The gcd is one, so multiplication by the inverse is valid and gives the unique residue class.

**S5.** Earliest layers are $\{a,b\}$, $\{c,e\}$, $\{d\}$, $\{f\}$. The chain $a,c,d,f$ has four tasks, so no schedule uses fewer than four unit slots. Every declared edge points from an earlier layer to a later one. Some legal orders may place e later while retaining optimal total time; the listed schedule performs it as early as possible.

**S6.** The graph is simple and bipartite with six vertices and nine edges. Bipartite planarity would require at most $2\cdot6-4=8$ edges, contradiction.

**F1.** At internal depth j the total toll is n. There are $\log_2n$ internal depths and n unit leaves, so $T(n)=n\log_2n+n$. Substitute into the recurrence and check n equals one to verify exactness for this defined model.

**F2.** Unrestricted count is $\binom92=36$. Each of three upper-bound violations leaves total three after subtracting four, giving ten cases per violation. Two violations cannot occur together. Thus $36-30=6$, independently listed as permutations of $(3,3,1)$ and $(3,2,2)$.

**F3.** The malicious-and-flagged probability is $0.016$; benign-and-flagged is $0.0392$. Divide the first by their sum to get $0.016/0.0552=20/69\approx0.289855$. The denominator includes both routes to a flag.

**F4.** There are sixty-six unordered pairs, each matching with probability one hundredth, giving expected count $0.66$. An outcome may contain several matching pairs, so the indicator of at least one is a different variable. Exact collision probability is one minus the no-collision product, not the expected pair count.

**F5.** Boundary values for success are zero and one at states zero and ten. The fair neighboring-average equation yields $h_i=i/10$, hence success $0.4$. The duration equation includes one plus the neighboring average, with zero boundary durations, yielding $t_i=i(10-i)$ and duration twenty-four. State the independent-step finite-interval model.

For the optional synthesis, Markov gives two thirds; variance at most one hundred gives Chebyshev at most 0.04; the simplified independent-Bernoulli Chernoff expression gives $e^{-100/12}\approx0.0002404$. The latter two require their stated second-moment/independence structure. These are upper bounds, not exact event probabilities.

## Project and examination marking guide

For Project 1, require both initialization/preservation and a decreasing natural-valued measure; sample traces alone do not prove correctness. For Project 2, independently check every graph edge against the ordering and every chosen spanning-tree edge against a cut or exchange argument. For Project 3, the expected pair count is $\binom k2/m$ and the no-collision probability is the falling-factorial product; maximum-load bounds require a union bound over bins. For Project 4, require row sums one, dangling-row repair, positive teleportation, and a reported stationarity residual. The chapter solutions above provide the technique-level keys for the Semester I and final examination prompts, whose chosen numerical inputs may vary.
