# 04. Well ordering and induction

How can a finite argument establish a statement for $0,1,2,\ldots$ without checking forever? The answer is not that infinitely many checks become unnecessary by magic. We prove a connection between cases that excludes every possible failure. This chapter develops two equivalent viewpoints: a hypothetical least failure and a guarantee that truth propagates from smaller cases.

Source Chapters 2 and 5 provide the scope. Prerequisites are integer arithmetic, quantifiers, and proof by contradiction. Our nonnegative integers begin at zero.

## The well-ordering principle

Every nonempty subset of $\mathbb N$ has a least element. This is the well-ordering principle. It does not say every subset has a least element: the empty subset has none. Nor is the same statement true for all integers, since the negative integers have no least member. The positive real numbers have no least member because half of any positive real is smaller and still positive.

A typical proof assumes some natural-number input fails, collects all failing inputs into a nonempty set, chooses its least member, then uses its minimality to derive a contradiction. The phrase “least counterexample” is doing work: every smaller input in the domain must succeed.

For example, every integer $n\ge2$ is a product of primes, allowing a product with one factor. Suppose there were a counterexample and let $m$ be least. If $m$ were prime, it would itself be a permitted product, so $m$ is composite: $m=ab$ with integers $2\le a,b<m$. By minimality, $a$ and $b$ are products of primes. Combining their products expresses $m$ as a product of primes, contradiction. This establishes existence of a factorization, not yet uniqueness; uniqueness needs an additional divisibility lemma in Chapter 08.

Well ordering can also prove division with remainder. Given integer $n$ and positive integer $d$, consider all nonnegative values of $n-dq$ with $q\in\mathbb Z$. The set is nonempty: sufficiently negative $q$ makes the expression nonnegative. Choose its least member $r=n-dq$. If $r\ge d$, then $r-d=n-d(q+1)$ is a smaller nonnegative member, contradiction. Hence $0\le r<d$. If two representations had remainders in that interval, subtracting them would make a multiple of $d$ equal a number strictly between $-d$ and $d$; only zero is possible, so both remainders and quotients agree.

Notice the steps: define the set precisely, establish nonemptiness, apply well ordering, and construct a forbidden smaller member. Merely writing “choose the least” is invalid if the chosen set could be empty or lacks a least member.

## Ordinary induction

To prove $P(n)$ for every integer $n\ge b$, establish the base case $P(b)$ and the inductive implication $P(k)\Rightarrow P(k+1)$ for arbitrary $k\ge b$. The temporary assumption $P(k)$ is the induction hypothesis. We are not assuming the entire theorem; we prove a conditional step that applies to any case where the hypothesis holds.

Why does this suffice? If failures existed, let $m$ be the least failing index. The base case excludes $m=b$, so $m>b$. Minimality gives $P(m-1)$, and the inductive implication gives $P(m)$, contradiction. Thus induction follows from well ordering. Conversely, induction proves that a nonempty set of naturals cannot lack a least member: if it had no least member, induction would show that no natural belongs to it.

The domino analogy is useful but limited. The base case tips the first domino; the inductive implication ensures each tips the next. The formal proof does not rely on a physical infinity of dominoes, timing, or collisions. It relies on the least-counterexample argument just given.

## A sum identity, step by step

We prove $\sum_{i=1}^n i=n(n+1)/2$ for all $n\in\mathbb N$, interpreting the empty sum at zero as zero.

At $n=0$, both sides are zero. Now assume the identity at an arbitrary $k\ge0$. Then

$$\sum_{i=1}^{k+1}i
=\left(\sum_{i=1}^ki\right)+(k+1)
=\frac{k(k+1)}2+(k+1)
=\frac{(k+1)(k+2)}2.$$

The first equality separates the last term. The second uses the induction hypothesis. The third factors $k+1$ and combines denominators. The result is exactly the claimed formula with $n=k+1$. This closes the step and therefore the proof.

At $k=3$, the step says $1+2+3=6$ allows $1+2+3+4=6+4=10$. The general proof repeats that relationship symbolically without having to enumerate all indices. An induction proof should show this connection, not only announce a base case and assert that the step is similar.

## Induction for inequalities

Consider $2^n\ge n+1$ for $n\ge0$. The base case is $1\ge1$. Assuming $2^k\ge k+1$, multiply by two to obtain $2^{k+1}\ge2k+2$. Since $k\ge0$, $2k+2\ge k+2$, which is the target. The second inequality is an additional needed argument; it does not follow merely from replacing $k$ by $k+1$.

Thresholds matter. The stronger claim $2^n\ge n^2$ fails at $n=3$ but holds at $n=4$. For $k\ge4$, the step from $2^k\ge k^2$ needs $2k^2\ge(k+1)^2$, or $k^2-2k-1\ge0$. At $k\ge3$ this is true, so the base at four launches the induction. A theorem valid eventually may require a carefully selected starting index.

An induction hypothesis can be too weak to support the desired step. Sometimes proving a stronger statement makes the step easier because it supplies more information. If an algorithm keeps two quantities related, proving only a bound on one may be insufficient; an invariant relating both may be the right statement. Strengthening must still leave a true base case.

## Strong induction

Strong induction assumes all earlier cases in the domain, $P(b),P(b+1),\ldots,P(k)$, to prove $P(k+1)$. It is useful when a construction breaks into smaller pieces of varying sizes. It is not a stronger foundation than ordinary induction. Apply ordinary induction to $Q(k)$ meaning “all cases from $b$ through $k$ hold,” and the strong form follows.

The prime-factorization existence proof can be written by strong induction on $n\ge2$. If $n$ is prime, stop. Otherwise write $n=ab$ with $2\le a,b<n$ and use earlier cases for both factors. Ordinary induction on only $n-1$ would give no direct information about $a$ and $b$; strong induction makes the available facts match the decomposition.

Another example uses postage of values four and seven. Every integer amount $n\ge18$ can be formed. The base cases are $18=7+7+4$, $19=7+4+4+4$, $20=4+4+4+4+4$, and $21=7+7+7$. For $n\ge22$, the amount $n-4\ge18$ is representable by strong induction. Add one four-unit stamp. Four consecutive base cases bridge the four-step dependency. Checking only eighteen would leave gaps at nineteen through twenty-one.

This reveals a design principle: inspect how far the inductive step reaches backward, then provide enough base cases to cover the initial gap. A recurrence depending on the previous two entries generally needs two initial values; a proof using $n-4$ needs an appropriate block of starting cases.

## Recursive definitions and existence

Induction proves properties; recursion defines objects from earlier objects. For example, define $a_0=3$ and $a_{n+1}=2a_n+1$. The first values are $3,7,15,31$. Guessing $a_n=2^{n+2}-1$ from those values is not a proof. Induction verifies it: at zero, $2^2-1=3$; if it holds at $k$, then $a_{k+1}=2(2^{k+2}-1)+1=2^{k+3}-1$.

Recursion must be well founded: dependencies move toward already defined cases. The equation $a_n=a_n+1$ does not define a sequence at all, and $a_n=a_{n+1}$ without a base does not determine a unique sequence. A recursive clause is not automatically meaningful merely because it resembles a familiar formula.

In algorithms, a recursive call should reduce a well-founded measure. Splitting a positive integer into two smaller positive integers works because no strictly descending chain of nonnegative integers can continue forever. Decreasing a positive real by half does not reach zero in finitely many steps, so “the input gets smaller” alone is insufficient for termination.

## Diagnosing false inductions

The classic false claim “all animals have the same color” starts correctly at groups of size one. It then removes the first animal and the last animal from a group of size $k+1$, invokes the induction hypothesis on the two groups of size $k$, and uses their overlap to equate colors. At the step from $k=1$ to $k+1=2$, the two groups have no overlap. The proposed implication fails exactly at the bridge needed to launch the proof.

Another error is assuming $P(k+1)$ during the step. Starting with the desired equation and manipulating backward is useful scratchwork; it becomes a proof only if the transformations are reversible and explained, or if the final presentation starts from established facts. A third error is proving the step for one convenient $k$ rather than an arbitrary allowed $k$.

Check three separate items: the exact predicate, the starting index, and the dependency of the step. Writing $P(n)$ vaguely as “the formula holds” conceals substitution errors. Write the formula with its index. If the claim concerns $n$ objects, make sure the inductive construction really produces every allowed configuration of $n+1$ objects, not only a convenient subclass.

## Choosing a method

Use direct induction when the next case extends the previous case, as in a sum. Use strong induction when an object splits into several smaller objects, as in factorization or divide-and-conquer. Use well ordering when a hypothetical least obstruction naturally yields a smaller obstruction. All three express the same absence of an infinite descent through natural-number indices.

Well ordering is not limited to the standard ordering on naturals, but generalizations need proof that the chosen order is well founded. Lexicographic order on pairs of naturals, with the first coordinate compared first, has no infinite descending chain; a process may decrease the first coordinate while resetting the second. In contrast, arbitrary lexicographic orders over all integers allow endless descent. We will use natural-valued measures in program termination before considering more general orders.

## Proving a divisibility pattern by induction

We prove that $7\mid(8^n-1)$ for every $n\ge0$. At zero the expression is zero, which is divisible by seven. Assume $8^k-1=7t$ for an integer $t$. Then $8^{k+1}-1=8(8^k-1)+7=7(8t+1)$. The new witness $8t+1$ is an integer, so divisibility holds at the next index. The decomposition is chosen to expose the previous expression; expanding the entire power would conceal the inductive connection.

This result will later become immediate in modular notation because eight is congruent to one modulo seven. The induction proof remains valuable: it derives the pattern before that shorthand exists and shows exactly how the divisibility witness evolves. Different proof methods can illuminate the same fact at different levels of abstraction.

## A structural counting induction before trees

Imagine cutting a rectangular sheet by straight cuts, where each cut passes through one existing piece and splits that piece into two. After $n$ such operations, there are $n+1$ pieces. The base case has one piece and zero cuts. Each legal operation increases the piece count by exactly one, so the claim follows by induction. If a single cut may pass through several stacked pieces, the transition rule changes and the theorem need not hold.

The important step is not algebra but choosing an operation count as the induction index. The result applies to every legal arrangement after that many cuts, not just one particular sequence. An induction hypothesis about “the picture shown” would be too narrow. This same issue arises when proving facts about graph growth or recursively constructed expressions.

## Strengthening a statement to close the step

Suppose a recursively defined process maintains two counters, and the next value of the first depends on the second. Proving a property of the first alone may leave no information about the second. A combined predicate can solve the problem. For Fibonacci numbers, one can prove consecutive bounds together rather than attempt to derive a next-value inequality from only one insufficient bound. The stronger hypothesis must be true initially and preserved, but then it carries the information the transition actually uses.

A concrete example is the identity $\sum_{j=0}^nF_j=F_{n+2}-1$. At $n=0$, the left side is zero and the right side is $F_2-1=0$. Assuming the identity at $k$, add $F_{k+1}$ to both sides. The recurrence combines $F_{k+2}+F_{k+1}$ into $F_{k+3}$, completing the step. The shifted index in the identity was selected because it matches the recurrence. Good induction statements often align their algebra with the construction rule.

## Where minimality is used

In a least-counterexample proof, do not write “by minimality” without naming the smaller object and showing it remains in the domain. In the prime-factorization proof, factors are at least two and smaller than the composite number, so they qualify. If one factor were one, the claimed reduction would not progress. If a proof allows negative factors but orders only natural inputs, the chosen smaller object may fall outside the ordered domain.

The same audit applies to recursive algorithms. A recursive call on $n-1$ is smaller for positive $n$, but at zero it would leave the natural-number domain. The base case must intercept that call. A recursive call on $\lfloor n/2\rfloor$ is smaller for $n\ge2$, while at one it equals zero and needs the appropriate base behavior. Specifying a measure and a base set turns informal “smaller input” language into a verifiable termination argument.

## A finite descent argument

Suppose positive integers $a,b$ satisfied $a^2=2b^2$ and were chosen with smallest positive $b$. Parity makes $a=2c$, then gives $b^2=2c^2$, so $b$ is even, say $b=2d$. Substitution yields $c^2=2d^2$ with a smaller positive denominator $d<b$, contradiction. This proves irrationality of the square root of two by infinite descent rather than explicitly choosing a lowest-terms fraction. Both proofs exploit the impossibility of endlessly decreasing positive integers.

The term “infinite descent” describes the contradiction that any solution would generate a smaller solution indefinitely. The proof does not actually perform infinitely many reductions. Well ordering says a nonempty solution set would already contain a least denominator, and one reduction contradicts that least choice. This is another example of a finite argument controlling an infinite domain.

## Choosing the base honestly

For the claim that every integer amount at least eighteen is a combination of four and seven, checking eighteen is not enough for a step that subtracts four. The next three amounts have no path back to eighteen using that step. Listing nineteen, twenty, and twenty-one closes those entry gaps. This is not an optional stylistic improvement; it supplies cases the propagation argument otherwise never reaches.

Likewise, an induction on even indices establishes only even-indexed cases unless a separate argument covers odd indices. The phrase “for all $n$” at the end cannot enlarge what the base and step actually reach. Draw arrows between indices if a proof uses an unusual increment or multiple dependencies. The resulting dependency picture often reveals a missing base case before any algebra is attempted.

The index is part of the theorem. Before finishing, check that the conclusion covers exactly the claimed starting point, increment, and domain, including any exceptional initial cases.

## Laboratory and practice

The recurrence lab computes initial terms and compares a recursive definition with a closed formula. Agreement helps catch a proposed formula's errors. The induction argument above explains why agreement persists at every index. A lab with a finite input bound cannot establish well ordering or a universal theorem by enumeration alone.

**04-A.** Prove $1+3+\cdots+(2n-1)=n^2$ for $n\ge0$. **04-B.** Prove $3^n\ge2n+1$ for $n\ge0$. **04-C.** Prove every integer $n\ge2$ has a prime divisor using a least counterexample. **04-D.** For $a_0=2,a_{n+1}=3a_n$, derive and prove a closed formula. **04-E.** Explain why a decreasing sequence of positive real numbers need not terminate at zero.

The next chapter builds the data types on which these proof methods operate: sets, sequences, functions, and relations. Later, structural induction extends the same idea from numeric indices to recursively constructed objects.
