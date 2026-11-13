# 03. Building and checking proofs

Suppose a program works on a million inputs. Why might it fail on another? A test gives information about the cases actually tested. A theorem gives a conditional guarantee about every case described by its hypotheses. The bridge is a proof: an argument using definitions, accepted assumptions, and valid deduction. This chapter develops proof patterns without treating them as incantations.

The source is Chapter 1, with logic from Chapter 02. We accept ordinary arithmetic laws as background. An axiom is an assumption accepted within a theory; a theorem is established from assumptions. A lemma is a useful supporting theorem, and a corollary follows quickly from another result. These labels describe roles rather than different degrees of truth.

## Read a claim before choosing a method

Separate hypotheses from conclusion and specify the domain. “For every integer $n$, if $n$ is even then $n^2$ is even” asks us to start with an arbitrary integer satisfying evenness. Even means $n=2k$ for some integer $k$. The definition provides a useful algebraic representation.

**Direct proof.** Let $n=2k$ for integer $k$. Then $n^2=4k^2=2(2k^2)$. Since $2k^2$ is an integer, $n^2$ is even. Each step addresses an obligation: represent the hypothesis, transform the expression, and match the definition of the conclusion.

The proof did not assume a particular even number. Checking $2^2,4^2,6^2$ could suggest the claim, but the arbitrary integer $k$ is what covers all cases. Conversely, finding one odd square of an even integer would refute the claim. Universal claims have asymmetric evidence requirements: one counterexample disproves them, while finitely many successes generally do not prove them.

Before writing formally, perform scratchwork. Substitute a small input, draw a picture, expand an expression, or reason backward from what is needed. Scratchwork can contain false starts. The final proof should show a valid forward chain, including enough explanation that the reader can check it without reconstructing all the discovery work.

## Direct implication and definitions

To prove $P\Rightarrow Q$, assume $P$ and derive $Q$. For example, if real $x$ satisfies $2\le x\le5$, then $(x-2)(5-x)\ge0$. Both factors are nonnegative by the hypotheses, so their product is nonnegative. Expanding yields $-x^2+7x-10\ge0$. The factorization explains why the inequality holds; a plot alone would leave open what happens between plotted points.

Definitions often tell you how to start. To prove a rational number is rational, express it as a quotient of integers with nonzero denominator. If $r=a/b$ and $s=c/d$ with integer numerators and nonzero integer denominators, then

$$r+s=\frac{ad+bc}{bd}.$$

The numerator is an integer and $bd\ne0$, so the sum is rational. Stating that the sum “looks like a fraction” would omit the closure and denominator conditions. The proof also demonstrates why the domain matters: arbitrary real inputs need not admit these representations.

When proving a statement about sets later, unfold membership definitions rather than manipulating pictures. When proving a probability identity, unfold events and the probability model. Definitions are tools that turn broad words into concrete obligations.

## Contrapositive

Because $P\Rightarrow Q$ is equivalent to $\neg Q\Rightarrow\neg P$, a proof may establish the contrapositive. Consider “if $n^2$ is even, then integer $n$ is even.” Starting from the parity of a square is awkward. The contrapositive says that if $n$ is odd then $n^2$ is odd.

Write $n=2k+1$. Then

$$n^2=4k^2+4k+1=2(2k^2+2k)+1.$$

The quantity in parentheses is an integer, so the square is odd. This completes the original implication. We did not prove the converse by accident: the initial direct result and this result together show that $n$ is even if and only if $n^2$ is even.

A useful test is to write the contrapositive in words before proving it. Negating “at least” gives “less than”; negating a universal statement introduces an existential counterexample. A method is only as sound as the translated statement it establishes.

## Equivalence requires both directions

An “if and only if” statement combines two implications. To prove that an integer $n$ is odd if and only if $n^2$ is odd, prove odd $n$ gives odd square, then prove odd square gives odd $n$. The latter follows by contrapositive from even $n$ giving even square.

Sometimes a chain of equivalent transformations is shorter. For real numbers $a,b$,

$$a=b\quad\Leftrightarrow\quad a-b=0
\quad\Leftrightarrow\quad(a-b)^2=0.$$

The last equivalence uses that a real square equals zero exactly when its base is zero. If a step is only an implication, the whole chain cannot be labeled equivalence. For instance, $a=b$ implies $a^2=b^2$, but the reverse allows $a=-b$.

For a finite nonempty list $x_1,\ldots,x_n$ with mean $\mu$, the sum $\sum_i(x_i-\mu)^2$ equals zero exactly when every $x_i=\mu$. Every term is nonnegative; if any were positive, the sum would be positive. This establishes why zero variance later means no variation. It also identifies the crucial assumptions: real values and a finite sum of nonnegative terms.

## Exhaustive cases

Some proofs split inputs into cases that cover the domain. To show that $n(n+1)$ is even for integer $n$, handle even $n$ and odd $n$. In the first case $n$ supplies a factor of two. In the second, $n+1$ supplies it. Both cases follow from the division algorithm modulo two, so there is no unhandled integer.

Cases may overlap; they need not form a disjoint partition unless counting is involved. They must be exhaustive. Splitting real numbers into positive and negative cases omits zero. Splitting integers into multiples of two and multiples of three omits one and five. Write the coverage argument explicitly when it is not immediate.

A richer example is the six-person acquaintance theorem: in any group of six, either three are mutual acquaintances or three are pairwise strangers, assuming acquaintance is symmetric. Choose one person $v$. Among the other five, at least three are acquaintances of $v$ or at least three are strangers to $v$. If three are acquaintances and any two know one another, those two with $v$ form a triangle of acquaintances. If no two know one another, the chosen three are strangers. The stranger case reverses the roles. Each branch establishes one permitted conclusion.

This argument anticipates graph coloring and the pigeonhole principle. Its significance is the structure of the proof, not the social story: a two-way classification forces a sufficiently large group, and then a second case split finishes the argument.

## Contradiction

To prove a statement $P$ by contradiction, assume $\neg P$ and derive a contradiction with established facts. This is especially effective when the denial gives a rigid structure. To show $\sqrt2$ is irrational, suppose it equals $a/b$ for coprime integers $a,b$ with $b>0$. Choosing lowest terms is justified because any rational representation can have its common factors removed.

Squaring gives $a^2=2b^2$, so $a^2$ is even and therefore $a$ is even by our parity theorem. Write $a=2k$. Substitution gives $4k^2=2b^2$, hence $b^2=2k^2$, so $b$ is also even. Thus two divides both $a$ and $b$, contradicting their coprimality. The contradiction rules out the original rational representation.

The proof does not conclude that every square root of an integer is irrational: $\sqrt9=3$. The specific factor two and parity argument matter. Nor does it conclude that an approximation such as $1.414$ is unusable. Irrationality is an exact statement about representation as a ratio of integers, independent of the usefulness of numerical approximations.

Do not confuse contradiction with contrapositive. A contrapositive proof directly establishes another implication. A contradiction proof assumes the full denial of the desired statement. Both may appear in one argument, but naming the assumptions clearly prevents circular reasoning.

## Existence, construction, and uniqueness

An existence proof can give a witness. The equation $3x+5y=1$ has integer solution $x=2,y=-1$, verified by substitution. That does not show uniqueness; in fact $x=2+5t,y=-1-3t$ works for every integer $t$.

To prove there is a unique object with property $P$, establish existence and then show any two objects with $P$ are equal. For example, for real $a\ne0$, the equation $ax=b$ has solution $x=b/a$. If $x$ and $y$ both solve it, $ax=ay$, so dividing by nonzero $a$ gives $x=y$. At $a=0$, this reasoning breaks: $0x=1$ has no solution, whereas $0x=0$ has infinitely many.

Nonconstructive existence proofs establish that an object must exist without exhibiting one. If more objects are mapped into fewer labels, two share a label, even if we do not know which two. Later we use this to show equal subset sums. A nonconstructive proof is still a proof, but it may not supply an efficient search algorithm.

## Finding the smallest counterexample

To test a conjecture, look at boundaries and cases where a hidden assumption fails. The statement “every integer $n$ has $n^2>n$” fails at zero and one; it also fails over reals at one half. A corrected claim might be $n^2>n$ for integers $n\ge2$, proved from $n(n-1)>0$.

The formula $n^2+n+17$ gives primes for several initial values but at $n=16$ gives $289=17^2$. More generally, for a polynomial with integer coefficients, divisibility patterns can expose failures missed by initial tests. We do not infer a theorem merely because early values are persuasive.

Counterexamples should satisfy every hypothesis. To refute “every positive integer has property $P$,” zero is inadmissible. To refute a claim about simple graphs, a loop-containing graph is inadmissible. State the violated conclusion and why the example lies in the domain.

## Proof quality and failure diagnosis

A readable proof states the claim, identifies the method where helpful, introduces each variable, and explains nontrivial transitions. Avoid pronouns with unclear referents and phrases such as “it follows” when several conclusions are possible. The reader should be able to distinguish an arbitrary input from a specially chosen witness.

Circular reasoning assumes what it is trying to prove. In an implication proof, assuming the conclusion and manipulating it into a true statement does not establish the conclusion unless every step is reversible and the proof explicitly says so. A false statement can imply a true statement. For example, $1=2$ implies $1^2=2^2$ and then various true consequences after information-destroying operations; this never validates the original equality.

Division by a potentially zero quantity is a common hidden error. In the classic false derivation from $a=b$ to $1=2$, cancellation of $a-b$ divides by zero. Another trap is using a picture to assume two drawn edges cannot cross in a different embedding. A diagram can suggest a lemma; the proof must establish the geometric or combinatorial condition it needs.

When reviewing an argument, annotate each sentence with its source: definition, hypothesis, previous theorem, algebraic law, or case assumption. A sentence with no available justification identifies the gap. This is a more useful response than saying a proof “feels wrong.”

## Planning a proof from the destination

Suppose the goal is to prove that the square of an odd integer leaves remainder one modulo eight. Begin by writing an arbitrary odd integer as $2k+1$. Expanding gives $4k^2+4k+1=4k(k+1)+1$. The destination asks for an integer multiple of eight plus one. Because consecutive integers include an even one, $k(k+1)=2t$ for an integer $t$. Substitution gives $8t+1$, exactly the needed form. The proof plan was guided by the target definition rather than by random algebraic expansion.

The final presentation should identify each dependency. We used the definition of oddness, distributivity, the parity of consecutive integers, and the definition of a remainder. We did not use the result for the first few odd numbers as an inference rule. Trying three or five was helpful for discovering the pattern but not the reason it continues.

Reasoning backward is especially useful with existential targets. To find integers satisfying a linear equation, first ask what combination would produce the desired remainder, then use an established construction such as extended Euclid. When the goal is an upper bound, ask which known inequality would imply it. Working backward supplies a strategy; the finished proof must still connect the actual hypotheses to the target in a valid direction.

## A proof-repair workshop

Consider this attempted proof: “Let $n$ be any integer. Since $n$ is even, $n=2k$, so $n^2$ is even. Hence every integer has an even square.” The algebra after the evenness assumption is correct, but the assumption is unavailable for an arbitrary integer. The repaired theorem adds the hypothesis that $n$ is even. Alternatively, a proof covering all integers must split even and odd cases and conclude that the square has the same parity as the original integer.

Another attempted argument says: “If $x^2=4$, then $x=2$ because taking the square root gives two.” The principal square root of $x^2$ is $|x|$, not always $x$. The conclusion should be $|x|=2$, hence $x=2$ or $x=-2$. If a separate hypothesis says $x\ge0$, the original conclusion becomes valid. The repair names the exact missing condition rather than merely replacing the answer.

A third argument says: “There is a smallest positive rational, call it $r$.” No such number exists, since $r/2$ is another positive rational and is smaller. A least-element argument needs an actual well-ordered domain. This example prepares the next chapter: powerful proof principles have hypotheses too.

## Universal claims about pairs and triples

The symmetry of a relation concerns every allowed pair, while transitivity concerns every allowed triple. To prove transitivity of divisibility, assume $a\mid b$ and $b\mid c$. Then $b=ak$ and $c=b\ell$ for integers $k,\ell$, so $c=a(k\ell)$ and $a\mid c$. Choose separate letters for witnesses unless equality is justified; using the same witness for both assumptions would accidentally strengthen them.

To disprove transitivity of “shares at least one course with,” construct three students where the first shares a course with the second, and the second shares a different course with the third, while the first and third share none. A counterexample to a three-variable property must supply a whole qualifying triple. Merely finding two students without a shared course would not address the transitivity implication.

## Writing for a reader

Proofs can be concise after their dependencies are clear, but a beginner benefits from explicit transitions. Introduce a witness before using it, explain why it belongs to the required domain, and mark the point where the goal has been obtained. A reader should not need to guess whether a symbol was chosen freely or solved from an equation. These are mathematical accuracy issues as well as writing issues: ambiguous dependency can turn a valid idea into an invalid argument.

An accepted theorem can be used as a lemma later without reproducing its whole proof. State the theorem and check its hypotheses on the current objects. This keeps arguments readable while preserving their logical dependencies. Reusing a theorem outside its domain, such as applying a finite-set pigeonhole conclusion to an infinite self-map, is a hypothesis error even if the theorem itself is perfectly correct.

## Practice and connection

The truth-table laboratory from Chapter 02 checks propositional transformations underlying proof methods. It cannot decide the truth of arbitrary number-theoretic claims. The next chapter introduces well ordering and induction, which organize infinitely many related cases into a finite proof.

**03-A.** Prove that the sum of two odd integers is even. **03-B.** Prove by contrapositive that if $3n+1$ is even then integer $n$ is odd. **03-C.** Give a counterexample to the claim that $x^2=y^2$ implies $x=y$ for all real $x,y$. State a domain restriction that repairs it. **03-D.** Prove uniqueness of the real solution to $5x+2=17$. **03-E.** Diagnose the missing hypothesis in cancellation from $ac=bc$ to $a=b$.
