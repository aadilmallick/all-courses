# Chapter 01 — Learning to prove: logic, sets, functions and induction

## 1. A question that arithmetic alone does not settle

Imagine someone calculates the first ten odd numbers and notices that adding them gives a square. One odd number gives $1=1^2$. Two give $1+3=4=2^2$. Three give $1+3+5=9=3^2$. These calculations suggest a rule, but the rule concerns every positive integer, including numbers too large to inspect. How can a finite piece of writing establish infinitely many cases?

This is the central problem of proof. A proof identifies reasons that apply to an arbitrary case or a mechanism that forces every case to work. Its purpose is not to make a calculation look formal. Its purpose is to explain why the conclusion follows from exactly the assumptions stated. Later we will ask whether integers factor uniquely, when equations have solutions, and what symmetry has to do with arithmetic. Each question needs this habit of reasoning.

You need ordinary arithmetic and elementary algebra to begin. We will build the language that makes more advanced arguments readable. Work through this chapter in several sittings. First learn to distinguish claims and evidence. Next learn how sets and functions organize objects. Finally learn induction and the well-ordering principle, the two engines behind many proofs about integers. There are optional exercises at the end, with separate hints and reference solutions.

## 2. Statements, assumptions and conclusions

A statement is a sentence that has a definite truth value once its terms are fixed. “Seventeen is prime” is a statement. “Find a prime” is an instruction. The sentence “$n$ is even” contains a variable, so it becomes a statement only after $n$ is specified or a quantifier tells us which values are intended.

We write $P\Rightarrow Q$ to mean “if $P$, then $Q$.” Here $P$ is the hypothesis and $Q$ the conclusion. For example, if $n=2k$ for some integer $k$, then $n^2=4k^2=2(2k^2)$, so $n^2$ is even. The proof starts with the hypothesis and constructs the conclusion. The integer $2k^2$ supplies the witness demanded by the definition of evenness.

An implication does not assert that its hypothesis is true. “If $n$ is a multiple of four, then $n$ is even” tells us what follows whenever the hypothesis holds. It says nothing about an odd value of $n$. This distinction becomes essential when theorems have many conditions: a theorem about prime moduli does not make a promise about a composite modulus.

The converse of $P\Rightarrow Q$ is $Q\Rightarrow P$. It is a new claim and requires its own proof. Every multiple of four is even, but $6$ is even without being a multiple of four. One example disproves the converse. The notation $P\Leftrightarrow Q$, read “if and only if,” means that both implications hold. To prove it, you normally write two arguments, clearly identifying their directions.

## 3. Quantifiers describe the size of a claim

The symbol $\forall$ means “for every,” and $\exists$ means “there exists.” The statement

$$
\forall n\in\mathbb Z,\quad \exists m\in\mathbb Z\text{ such that }m>n
$$

says that every integer has a larger integer. A proof can give the explicit choice $m=n+1$. Notice that the chosen $m$ is allowed to depend on $n$. That dependence is part of what the order of the quantifiers says.

Reversing the order produces a different statement:

$$
\exists m\in\mathbb Z\text{ such that }\forall n\in\mathbb Z,\quad m>n.
$$

This says one integer is larger than every integer. It is false: take $n=m$. The two sentences use exactly the same comparison and symbols, but their logical structures differ. When a proof goes wrong, a hidden exchange of “for every” and “there exists” is a frequent cause.

A universal claim requires an argument that covers an arbitrary allowed input. An existential claim requires one valid witness. To prove “there is an even prime,” exhibit $2$ and explain that its positive divisors are $1$ and $2$. To prove “every even integer has an even square,” use the general form $2k$, rather than checking selected even integers.

The phrase “there exists a unique” contains two obligations. First show existence. Then show that any two objects satisfying the required property must be equal. Later the division algorithm will state that every integer has a unique remainder in a specified range. The range is what makes uniqueness possible; without it, many decompositions exist.

## 4. Negation is a mathematical operation

To negate a claim is to state precisely what would make it false. The negation of “every integer has property $P$” is “some integer does not have property $P$.” It is not “no integer has property $P$.” The latter is much stronger and usually wrong as a negation.

For example, the claim “every integer greater than one is prime” is false because $4$ is not prime. We did not have to prove that all integers greater than one are composite. A counterexample needs only to satisfy the hypothesis and violate the conclusion.

The negation of “there exists an integer whose square is $2$” is “for every integer, its square is different from $2$.” Thus negation switches existential and universal quantifiers. For two conditions, “not both $P$ and $Q$” means “not $P$ or not $Q$.” Meanwhile “neither $P$ nor $Q$” means “not $P$ and not $Q$.” These rules are called De Morgan's laws.

The negation of $P\Rightarrow Q$ is “$P$ is true and $Q$ is false.” This gives a practical counterexample recipe. To disprove “if $a^2=b^2$, then $a=b$” for integers, take $a=1$, $b=-1$. The hypothesis holds and the conclusion fails. Choosing $a=1$, $b=2$ would not disprove anything because its hypothesis is false.

Negating carefully is also a way to understand a theorem before proving it. Write down what failure would look like. Often the supposed failure produces an integer that must simultaneously satisfy incompatible inequalities, or a smaller counterexample than one chosen to be minimal.

## 5. Direct proof and proof by cases

A direct proof starts with definitions and hypotheses and moves toward the conclusion. Consider: the sum of two odd integers is even. Let $a$ and $b$ be arbitrary odd integers. By definition there exist integers $r,s$ with $a=2r+1$ and $b=2s+1$. Then

$$
a+b=2r+1+2s+1=2(r+s+1).
$$

Because $r+s+1$ is an integer, the sum has the form required for evenness. The final sentence matters: it connects the algebra to the exact definition being proved.

Sometimes the domain naturally splits into cases. To prove that $n(n+1)$ is even, consider whether $n$ is even or odd. If $n=2k$, the product is $2k(n+1)$. If $n=2k+1$, then $n+1=2(k+1)$ and the product is $2n(k+1)$. Each expression is twice an integer.

The cases must cover every possibility. “Suppose $n$ is positive” does not cover zero or negative integers. If a statement concerns all integers, your proof must include those inputs or explain why an earlier reduction handles them. This is one reason definitions often include domains explicitly.

Case proofs can also follow a definition. The absolute value of an integer is $|n|=n$ when $n\geq0$ and $|n|=-n$ when $n<0$. A proof involving absolute values may need separate sign cases. Alternatively, one can first prove general inequalities such as $-|n|\leq n\leq |n|$ and then use them. The second route packages the cases into a reusable lemma.

## 6. Contraposition and contradiction

The contrapositive of $P\Rightarrow Q$ is “if not $Q$, then not $P$.” The original implication and its contrapositive are logically equivalent. To prove that an integer with an odd square is odd, it may be easier to show that an even integer has an even square. If the original conclusion failed, the original hypothesis would fail too.

Contraposition is especially useful when the negated conclusion has an explicit form. “Not odd” means even for an integer, so it gives the algebraic expression $2k$. Later “not relatively prime” will mean that a common divisor greater than one exists. That witness may be easier to use than the original statement.

A proof by contradiction assumes that the desired conclusion is false and derives an impossibility. For example, suppose there were a largest integer $M$. The integer $M+1$ is larger than $M$, contradicting the defining property of $M$. Therefore no largest integer exists.

Contradiction is not a license to assume anything convenient. The proof should record exactly what is temporarily assumed and identify exactly what becomes impossible. “This is a contradiction” is convincing only after the incompatible statements have been displayed. Typical endpoints are $0=1$, an integer being both even and odd, or a positive integer lying strictly between $0$ and $1$.

There is no competition between proof methods. A direct argument is often clearer when it is short. Contraposition can reveal a useful reformulation. Contradiction is natural for nonexistence and minimal-counterexample arguments. Learning proof means choosing a structure that matches the mathematical information available.

## 7. Sets collect objects without adding hidden structure

A set is a collection of distinct objects, called its elements. We write $x\in A$ when $x$ belongs to $A$. Standard sets include the integers $\mathbb Z$, rationals $\mathbb Q$, and reals $\mathbb R$. Here $\mathbb N=\{0,1,2,\ldots\}$; when positivity matters we say “positive integer.”

We can describe a set by listing elements, such as $\{1,2,3\}$, or by a condition:

$$
E=\{n\in\mathbb Z:n=2k\text{ for some }k\in\mathbb Z\}.
$$

The colon means “such that.” This set is the set of even integers. The list $\{1,1,2\}$ is the same set as $\{1,2\}$, because repetition does not create extra elements. Order also does not matter in a set.

We write $A\subseteq B$ when every element of $A$ belongs to $B$. To prove this inclusion, choose an arbitrary $x\in A$ and show $x\in B$. To prove equality $A=B$, show both inclusions. This is a set version of proving two implications.

For example, let $A$ be the set of integers divisible by both $2$ and $3$, and let $B$ be the set of multiples of $6$. Showing $B\subseteq A$ is immediate from $6k=2(3k)=3(2k)$. The reverse inclusion needs an argument; it should not be taken for granted merely because the statement looks familiar. Chapter 02 will supply tools that prove this and more general common-divisor claims systematically.

## 8. Combining sets and forming ordered pairs

The intersection $A\cap B$ consists of elements in both sets. The union $A\cup B$ consists of elements in at least one set. The difference $A\setminus B$ consists of elements in $A$ that are not in $B$. The empty set $\varnothing$ has no elements.

As an example, take $A=\{1,2,3\}$ and $B=\{3,4\}$. Then $A\cap B=\{3\}$, $A\cup B=\{1,2,3,4\}$, and $A\setminus B=\{1,2\}$. These operations translate logical words into set operations: “and” becomes intersection and “or” becomes union.

An ordered pair $(a,b)$ remembers which entry comes first. Thus $(1,2)\ne(2,1)$. The Cartesian product $A\times B$ is the set of all pairs with first entry in $A$ and second entry in $B$. If $A$ has three elements and $B$ has two, there are six such pairs, because each of the three first choices permits two second choices.

This construction lets us speak precisely about operations. Integer addition takes an ordered pair of integers and returns an integer:

$$
+ :\mathbb Z\times\mathbb Z\longrightarrow\mathbb Z.
$$

The fact that the result stays in $\mathbb Z$ is called closure. Integer subtraction is also closed, but division is not: $1/2$ is not an integer. Much of abstract algebra asks what follows from a small list of properties of operations. We begin by noticing those properties in arithmetic we already understand.

## 9. Functions, domains and codomains

A function $f:A\to B$ assigns exactly one element $f(a)\in B$ to every $a\in A$. The set $A$ is the domain, and $B$ is the codomain. The image is the subset

$$
f(A)=\{f(a):a\in A\}\subseteq B.
$$

The codomain is declared as part of the function; the image is determined by the outputs actually attained. These can differ.

Consider $f:\mathbb Z\to\mathbb Z$ defined by $f(n)=2n$. Its image is the even integers. If instead we declare the codomain to be the even integers, we have a function with the same formula and domain but a different codomain. This difference changes whether the function is onto.

A formula may fail to define a function on a proposed domain. The expression $1/n$ is not defined at $n=0$, so it does not define a function $\mathbb Z\to\mathbb Q$ without a special convention or a restricted domain. The instruction “choose a square root of $x$” also does not specify a single-valued real function for positive $x$, because two choices exist. The nonnegative square root $\sqrt{x}$ resolves that ambiguity.

When we later define an operation on equivalence classes, one class will have many representatives. We must prove that choosing a different representative does not change the output class. This is the same single-output requirement in a setting where formulas can disguise ambiguity. The phrase “well-defined” names this obligation rather than excusing us from checking it.

## 10. Injectivity, surjectivity and bijectivity

A function is injective, or one-to-one, when equal outputs force equal inputs:

$$
f(a_1)=f(a_2)\Rightarrow a_1=a_2.
$$

The function $n\mapsto2n$ on integers is injective because $2a=2b$ implies $a=b$. The squaring function on integers is not injective because $1$ and $-1$ have the same square.

A function $f:A\to B$ is surjective, or onto, if every $b\in B$ is $f(a)$ for at least one $a\in A$. Thus doubling is not surjective onto $\mathbb Z$, because no integer doubles to $1$. It is surjective onto the even integers: an arbitrary even number has the form $2k$ and is the output at $k$.

A bijection is both injective and surjective. It matches the elements of two sets without collisions or omissions. For finite sets, a bijection proves they have equal size. This makes bijections a powerful counting tool: instead of counting a difficult set directly, match it to an easier one.

The distinctions are independent. A constant function from a two-element set to a one-element set is surjective but not injective. The inclusion $\{1\}\to\{1,2\}$ is injective but not surjective. A function from $\{1,2\}$ to itself that swaps the elements is a bijection. Thinking about small finite examples prevents the definitions from becoming empty terminology.

## 11. Composition and inverse functions

If $f:A\to B$ and $g:B\to C$, their composition $g\circ f:A\to C$ is defined by

$$
(g\circ f)(a)=g(f(a)).
$$

We apply the rightmost function first. For $f(x)=x+1$ and $g(x)=2x$ on integers, $(g\circ f)(x)=2x+2$, whereas $(f\circ g)(x)=2x+1$. Thus composition need not commute.

Composition is associative whenever the domains and codomains fit: $h\circ(g\circ f)=(h\circ g)\circ f$. At any input $a$, both sides give $h(g(f(a)))$. This proof is an example of proving functions equal by checking that their outputs agree on every input.

The identity function $\operatorname{id}_A:A\to A$ sends $a$ to itself. A function $f:A\to B$ has an inverse function $f^{-1}:B\to A$ when

$$
f^{-1}\circ f=\operatorname{id}_A,\qquad f\circ f^{-1}=\operatorname{id}_B.
$$

Such an inverse exists exactly when $f$ is bijective. Surjectivity gives at least one preimage for every output, while injectivity makes that preimage unique. Conversely, an inverse forces injectivity by applying it to equal outputs, and forces surjectivity because $b=f(f^{-1}(b))$.

The inverse symbol does not always mean reciprocal. For the bijection $f(n)=n+1$ on integers, $f^{-1}(n)=n-1$, not $1/(n+1)$. Context and definitions determine the operation being reversed.

## 12. Relations and mathematical sameness

A relation on a set $A$ specifies which ordered pairs in $A\times A$ are related. We can write $a\sim b$ instead of $(a,b)$ belonging to the chosen relation. Equality, inequality and divisibility are examples of relations.

A relation is reflexive if $a\sim a$ for every $a$, symmetric if $a\sim b$ implies $b\sim a$, and transitive if $a\sim b$ and $b\sim c$ imply $a\sim c$. A relation with all three properties is an equivalence relation.

For a simple example, declare two integers related when they have the same parity. Every integer has its own parity, so the relation is reflexive. If $a$ and $b$ have the same parity, the statement remains true when their names are reversed, so it is symmetric. If $a,b$ have the same parity and $b,c$ have the same parity, all three share a parity, so it is transitive.

The equivalence class of $a$ is the set of all elements related to $a$. For parity there are two classes: even integers and odd integers. They are disjoint and together cover all integers. We are treating different integers as equivalent for one selected purpose, without claiming that they are equal as integers.

Chapter 04 will generalize parity to congruence modulo any positive integer. Later quotient groups and quotient rings will use exactly this pattern: specify which differences are irrelevant, collect objects into classes, and check that the desired operations respect that choice of sameness.

## 13. Finite counting and the pigeonhole principle

The size of a finite set $A$ is written $|A|$. If $A$ and $B$ are disjoint finite sets, then $|A\cup B|=|A|+|B|$. Without disjointness, elements in the intersection would be counted twice. The general formula is

$$
|A\cup B|=|A|+|B|-|A\cap B|.
$$

The pigeonhole principle says that a function from a finite set with more elements to one with fewer elements cannot be injective. Imagine placing $n+1$ objects into $n$ boxes. If every box contained at most one object, the total would be at most $n$, contrary to the number of objects.

For example, among any three integers, two have the same parity. Send each integer to one of the two parity classes. Three inputs cannot land in two classes without a collision. The conclusion does not say which two integers coincide in parity, only that such a pair must exist.

This principle often proves existence without constructing the desired object explicitly. Suppose we list $n+1$ integers and place each into its remainder class modulo $n$. Two share a remainder, so their difference is divisible by $n$. The full remainder argument awaits Chapter 04, but its counting structure is already visible.

For a function from a finite set to itself, injectivity and surjectivity are equivalent. An injective map has as many distinct outputs as inputs, exhausting the set; a surjective map cannot have a collision without leaving too few distinct outputs. For infinite sets this fails: doubling on $\mathbb Z$ is injective but not onto $\mathbb Z$.

## 14. Induction: a finite argument with unlimited reach

Return to the sum of odd numbers. Let $P(n)$ be the statement

$$
1+3+\cdots+(2n-1)=n^2
$$

for a positive integer $n$. Mathematical induction proves every $P(n)$ through two steps. First establish a starting case, here $P(1)$. Then prove that for every positive integer $k$, the truth of $P(k)$ implies the truth of $P(k+1)$.

The base case is $1=1^2$. For the induction step, assume

$$
1+3+\cdots+(2k-1)=k^2.
$$

The next odd number is $2k+1$. Adding it gives

$$
1+3+\cdots+(2k-1)+(2k+1)=k^2+2k+1=(k+1)^2.
$$

The induction hypothesis justified replacing the earlier sum by $k^2$. The ordinary algebraic identity justified the final equality. This proves the implication, not by assuming the final result, but by using the already assumed smaller case.

Why does this establish all positive integers? The base gives $P(1)$; the implication then gives $P(2)$, then $P(3)$, and so on. The rigorous foundation is the well-ordering property developed next. The informal chain captures the mechanism, but the formal induction principle packages its infinite reach into a valid rule of reasoning.

Induction is not guesswork. Calculations may suggest a formula, but the induction step must explain exactly why the next case follows. If you cannot find that bridge, checking more initial cases does not repair the proof.

## 15. Well-ordering and strong induction

The well-ordering principle says that every nonempty set of nonnegative integers has a least element. It is a foundational property of the ordinary integers, not a property of every ordered number system. The positive rational numbers have no least member, because half of a positive rational is a smaller positive rational.

Well-ordering proves induction. Suppose a claim has a true starting case at $n_0$ and a valid implication from each case to the next, yet fails somewhere at or above $n_0$. The set of failing integers is nonempty, so it has a least member $m$. It cannot be $n_0$, where the claim is true. Thus $m-1\geq n_0$, and minimality says the claim is true at $m-1$. The induction implication then makes it true at $m$, a contradiction.

Strong induction allows the step for $k+1$ to assume all earlier cases from the starting point through $k$. This is useful when an object splits into smaller pieces whose sizes are not exactly one less. The principle is justified by the same least-counterexample argument: a least failure has no smaller failures available.

In Chapter 03, to prove that every integer greater than one factors into primes, we consider an integer that is not prime. It is a product of two smaller positive integers. Strong induction handles both factors, even though neither may equal the preceding integer.

The starting range must match the recurrence or decomposition. A statement requiring two previous cases may need two initial cases. Writing down the first few steps of the proposed mechanism often reveals whether your base cases actually start the chain.

## 16. A second induction example with an inequality

Induction proves inequalities as well as exact formulas. We claim that $2^n\geq n+1$ for every nonnegative integer $n$. At $n=0$, both sides equal $1$. Suppose $2^k\geq k+1$ for some $k\geq0$. Multiplying by the positive number $2$ preserves the inequality:

$$
2^{k+1}\geq2k+2.
$$

Since $k\geq0$, we have $2k+2\geq k+2$. Combining the inequalities gives $2^{k+1}\geq k+2$, which is precisely the desired next case.

Notice the two distinct tasks in the step. The induction hypothesis produced a lower bound, but that lower bound was not yet in the required form. A second inequality compared it to the target. Proofs of inequalities often need this sort of deliberate adjustment.

It is also worth checking what the claim does not say. The inequality is true for all nonnegative $n$, but it is not an equality except at $n=0$ and $n=1$. Induction preserves whatever statement you actually formulate. It does not automatically prove a stronger version that seems numerically plausible.

A common mistake is to begin the induction step by writing the desired next inequality and then manipulating it until something true appears. That can help discover a proof, but the final argument must run from established facts toward the target, unless each transformation has been explicitly shown to be reversible. Discovery and presentation serve different purposes.

## 17. Summation notation and finite algebra

The expression $\sum_{j=1}^{n}a_j$ means $a_1+a_2+\cdots+a_n$. The index $j$ is a temporary label; changing it to $k$ does not change the sum. The endpoints and the expression being summed determine the value.

For instance,

$$
\sum_{j=1}^{4}(2j-1)=1+3+5+7=16.
$$

Expanding a small case is an effective way to decode a formula before manipulating it. If the upper endpoint is smaller than the lower endpoint, an empty sum is conventionally $0$. This convention makes recurrence formulas work at their boundary cases.

Finite sums obey distributivity:

$$
\sum_{j=1}^{n}(a_j+b_j)=\sum_{j=1}^{n}a_j+\sum_{j=1}^{n}b_j.
$$

The justification is ordinary regrouping of finitely many terms. We are not yet discussing infinite sums, where regrouping can require additional hypotheses. Chapter 28 will rebuild those analytic issues when they arise.

We can derive the formula for the sum of the first $n$ positive integers without induction. Let $S=1+2+\cdots+n$. Writing the same sum in reverse gives $S=n+(n-1)+\cdots+1$. Add corresponding terms: each pair sums to $n+1$, and there are $n$ pairs. Thus $2S=n(n+1)$, so $S=n(n+1)/2$. Induction offers a second proof and checks how the formula grows from one value to the next.

## 18. Definitions are tools, not vocabulary tests

A definition tells us exactly what must be established to use a concept. If you want to prove an integer is even, produce an integer whose double it is. If you want to prove a function injective, start with equal outputs and force equal inputs. If you want a set inclusion, begin with an arbitrary element of the smaller set.

This makes definitions active instructions. Reading a theorem and immediately asking “What do these words require me to show?” is more productive than searching for a memorized trick. In algebra, many difficult-looking proofs begin with unfolding a definition and tracking its consequences carefully.

At the same time, a definition should be tested against examples and nonexamples. A bijection must cover its codomain, so changing the codomain can change whether the same formula is bijective. An equivalence relation must be transitive, so “within distance one” on integers is not an equivalence relation: $0$ is within one of $1$, and $1$ is within one of $2$, but $0$ is not within one of $2$.

A useful mathematical example often does more than illustrate a definition. It reveals why a condition is needed. Transitivity makes equivalence classes fit together as whole blocks instead of overlapping unpredictably. Surjectivity ensures inverse functions have an input preimage available. Uniqueness ensures a formula does not depend on an arbitrary choice. Each condition supports a later construction.

## 19. How to read and repair a proof

Read a proof in two passes. First identify its goal and overall plan. Is it constructing a witness, analyzing cases, choosing a least counterexample, or comparing two sets? Then read each important inference and ask which definition, hypothesis or earlier result justifies it.

Suppose a proposed proof says: “Every odd integer is prime because an odd integer cannot be divided by two.” The premise only rules out one possible divisor. The integer $9$ has divisor $3$, so the conclusion fails. The exact gap is that absence of one divisor does not imply absence of all nontrivial divisors.

Now suppose a proof says: “If $a^2=b^2$, cancel the squares to get $a=b$.” The missing step would require the squaring function to be injective on the chosen domain. It is injective on nonnegative reals, but not on all integers. The repair could restrict the domain or weaken the conclusion to $a=b$ or $a=-b$.

When writing your own proof, name arbitrary objects, state their domains, and distinguish a general argument from a numerical example. Do not use the same letter for unrelated objects without explanation. Close the loop by explicitly connecting your final computation to the definition or theorem statement you aimed to establish.

You do not need polished prose immediately. Exploratory work can contain pictures, guesses and unsuccessful calculations. The finished proof should retain the useful reasoning and remove unsupported jumps. Mathematical clarity develops through revision, much like clear technical writing.

## A closer look at assumptions and dependencies

Consider the claim that the composition of two injective functions is injective. Suppose $f:A\to B$ and $g:B\to C$ are injective. To prove the composition injective, take $a_1,a_2\in A$ and assume $(g\circ f)(a_1)=(g\circ f)(a_2)$. By the definition of composition, this means $g(f(a_1))=g(f(a_2))$. Injectivity of $g$ gives $f(a_1)=f(a_2)$. Injectivity of $f$ then gives $a_1=a_2$. This final equality is exactly the required conclusion.

This short argument illustrates dependency tracking. The first cancellation uses the hypothesis about $g$, and the second uses the hypothesis about $f$. If either hypothesis is removed, the proof loses a specific step. That does not automatically prove the weakened theorem false, but it tells us where to look for a counterexample. A constant function on a set with two elements supplies one when the inner function is not injective. Choosing an outer constant function supplies one when the outer hypothesis is missing.

Now compare a claim about surjectivity. If both functions are surjective, choose an arbitrary $c\in C$. Surjectivity of $g$ supplies a $b\in B$ with $g(b)=c$. Surjectivity of $f$ supplies an $a\in A$ with $f(a)=b$. Therefore $(g\circ f)(a)=c$. Here the proof works backward from a desired output, constructing its preimage in stages. Injectivity proofs follow equalities forward; surjectivity proofs often build an input backward. The definitions suggest different proof strategies.

Induction also requires dependency tracking. In a valid induction step, the induction hypothesis is available only for the chosen earlier cases. It is not available for the case currently being established. Suppose you try to prove $2^n=1$ by assuming $2^{k+1}=1$ and dividing by two. You have assumed the conclusion, and the resulting statement is false anyway. A correct induction proof begins with $P(k)$, not $P(k+1)$, and must have an independently verified base case.

Finally, remember that a theorem can have several useful proofs. A second proof is valuable when it reveals another relationship: pairing terms explains a summation formula through symmetry, while induction explains it through successive growth. The objective is not to accumulate formal rituals but to see what information each argument organizes.

## 20. The bridge to number theory and algebra

The next chapter begins with the question of measuring two integer quantities using a common unit. Divisibility will be a relation, greatest common divisors will have an existence and uniqueness story, and the Euclidean algorithm will terminate because positive remainders cannot decrease forever. Well-ordering will provide the reason that an algorithm stops.

In later chapters, arithmetic operations will be treated as functions on sets. We will compare different systems by functions that preserve their operations. Bijections will express genuine sameness of structure, while equivalence classes will deliberately forget selected distinctions. Induction will establish factorization and support recursive constructions.

These connections explain why the opening language is part of the subject rather than an obstacle placed before it. A group is not an exotic object that replaces arithmetic; it isolates patterns already present in addition and reversible functions. A quotient is not a mysterious symbol; it organizes a chosen equivalence relation. A proof is the mechanism that lets a small collection of exact ideas govern an unlimited family of examples.

The [interactive companion](../companion/index.html) starts its computational experiments with Euclid and congruence in Chapters 02–05. This chapter supplies the language needed to interpret those experiments. Finite computations will illustrate statements, while proofs will explain why their observed patterns persist beyond the tested inputs.

## Optional practice

1. Negate “for every integer $n$, there exists an integer $m$ with $m^2>n$.” State whether the original assertion is true, and justify your answer without calculus.
2. Prove that the product of two odd integers is odd. Identify the integer that serves as the required witness.
3. Prove by contraposition that if $n^2$ is odd, then $n$ is odd. Explain why checking several examples is not the proof.
4. For $f:\mathbb Z\to\mathbb Z$, $f(n)=3n+2$, determine injectivity, surjectivity and the image.
5. Let $A=\{1,2,3\}$ and $B=\{a,b\}$. Explain why every function $A\to B$ identifies two different elements of $A$.
6. Prove by induction that $1+2+\cdots+n=n(n+1)/2$ for every positive integer $n$.
7. On $\mathbb Z$, define $a\sim b$ when $a-b$ is even. Prove the three equivalence-relation properties directly from the definition of evenness.
8. Diagnose this argument: “If $P(k)$ implies $P(k+1)$, then $P(n)$ holds for all positive integers.” Give a counterexample showing exactly what is missing.

[Hints and complete reference solutions](../solutions/01-solutions.md) are separate so you can choose when to consult them.

<!-- course-navigation -->

---

[Course index](../README.md) · [Next chapter](02-euclidean-algorithm.md) · [Hints and solutions](../solutions/01-solutions.md)
