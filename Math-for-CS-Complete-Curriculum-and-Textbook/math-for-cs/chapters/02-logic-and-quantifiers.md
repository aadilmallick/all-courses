# 02. Logic: saying exactly what you mean

A program grants access when a person is an administrator or owns a document. Does “or” allow a person who satisfies both conditions? If access is granted, must the person be an administrator? Mathematical logic makes questions like these precise. It describes which combinations of claims are true and which conclusions follow from assumptions.

Prerequisites are the distinction between an expression and an equation from Chapter 01. We need no special knowledge of circuits or programming. The source connections are Chapter 3 and the proposition/predicate material in Chapter 1.

## Propositions and connectives

A proposition is a declarative claim with a truth value once its context is fixed. “Nine is odd” is true; “nine is prime” is false. A command such as “open the file” is not a proposition. The expression “$x$ is odd” is a predicate whose truth depends on an input. Supplying $x=9$ produces a proposition.

For propositions $P,Q$, negation $\neg P$ is true exactly when $P$ is false. Conjunction $P\land Q$ requires both. Disjunction $P\lor Q$ requires at least one, including both. Exclusive or, $P\oplus Q$, requires exactly one. Unless explicitly qualified, mathematical “or” is inclusive.

The implication $P\Rightarrow Q$ excludes precisely the situation where $P$ is true and $Q$ false. It says that whenever the assumption holds, the conclusion holds. It does not assert that the assumption holds, or that the assumption causes the conclusion. Its truth table is:

| $P$ | $Q$ | $P\Rightarrow Q$ | $P\land Q$ | $P\lor Q$ |
|---|---|---|---|---|
| T | T | T | T | T |
| T | F | F | F | T |
| F | T | T | F | T |
| F | F | T | F | F |

Why count a false-premise implication as true? A universal rule about administrators is violated by an administrator denied access; it says nothing about what happens to a nonadministrator. An input outside the rule's hypothesis cannot refute the rule. This is called vacuous truth. It is a convention with useful and consistent consequences, not a claim that false assumptions reveal facts about the world.

“$P$ only if $Q$” means $P\Rightarrow Q$: $Q$ is necessary for $P$. “$P$ if $Q$” means $Q\Rightarrow P$: $Q$ is sufficient for $P$. “$P$ if and only if $Q$” means both directions, written $P\Leftrightarrow Q$. Translate these words carefully. “A number is divisible by four only if it is even” does not say every even number is divisible by four.

## Equivalence is agreement in every case

Two formulas are logically equivalent when every assignment of truth values gives them the same value. The identity

$$P\Rightarrow Q\quad\equiv\quad\neg P\lor Q$$

follows by checking the four rows above: both sides are false exactly at $P=\mathrm T,Q=\mathrm F$. It lets us rewrite implication using only negation and or. A tautology is true under every assignment, such as $P\lor\neg P$. A contradiction is false under every assignment, such as $P\land\neg P$. A satisfiable formula has at least one true assignment; it need not be a tautology.

De Morgan's laws are

$$\neg(P\land Q)\equiv\neg P\lor\neg Q,\qquad
\neg(P\lor Q)\equiv\neg P\land\neg Q.$$

To see the first, “not both” permits the first to fail, the second to fail, or both to fail. It does not demand both failures. For example, denying access under the rule $A\lor O$ means neither administrator nor owner: $\neg A\land\neg O$. Denying access under $A\land O$ means at least one condition fails.

The distributive law $P\land(Q\lor R)\equiv(P\land Q)\lor(P\land R)$ has the same structural shape as arithmetic distributivity. Logic also has the dual law $P\lor(Q\land R)\equiv(P\lor Q)\land(P\lor R)$. Do not transfer all arithmetic rules blindly: $P\lor P\equiv P$, whereas $x+x$ generally differs from $x$. Logical formulas describe truth, not numeric magnitude.

An equivalence may be justified by a truth table or by a sequence of known equivalences. For example,

$$\neg(P\Rightarrow Q)\equiv\neg(\neg P\lor Q)
\equiv P\land\neg Q.$$

Thus refuting an implication requires establishing the hypothesis and failing conclusion together. Merely showing a false conclusion when the hypothesis is false accomplishes nothing.

## Valid reasoning and seductive errors

A rule of inference is sound if true premises always yield a true conclusion. Modus ponens uses $P$ and $P\Rightarrow Q$ to infer $Q$. Hypothetical syllogism uses $P\Rightarrow Q$ and $Q\Rightarrow R$ to infer $P\Rightarrow R$. These rules justify proof steps.

Affirming the consequent is invalid: $P\Rightarrow Q$ and $Q$ do not imply $P$. If divisibility by four implies evenness, knowing that six is even does not make it divisible by four. Denying the antecedent is also invalid: $P\Rightarrow Q$ and $\neg P$ do not imply $\neg Q$.

The contrapositive $\neg Q\Rightarrow\neg P$ is equivalent to $P\Rightarrow Q$, because both fail only when $P$ is true and $Q$ false. The converse $Q\Rightarrow P$ is a different claim. This distinction will drive proof strategies in Chapter 03.

When evaluating a proposed rule, search for one truth assignment with all premises true and conclusion false. A single such assignment disproves validity. For instance, the rule “$P\lor Q$, therefore $P$” fails at $P=\mathrm F,Q=\mathrm T$. The task is not to find a story making the conclusion plausible; it is to test whether failure is logically possible.

## Predicates require domains

Let $E(n)$ mean “$n$ is even.” The notation $E(4)$ is true and $E(5)$ false. The statement $\forall n\in\mathbb Z,E(n)$ is false. The statement $\exists n\in\mathbb Z,E(n)$ is true. Universal quantification means every permitted input; existential quantification means at least one permitted input.

Domains matter. The claim $\forall x, x^2\ge x$ is true for integer $x$ but false over all reals, since $x=1/2$ gives $1/4<1/2$. State the domain before proving a quantified statement. A variable is free if no surrounding quantifier binds it. The formula $\forall x, x+y>0$ still depends on $y$; it is not a closed proposition until $y$ is fixed or quantified.

To prove $\forall x\in D,P(x)$, choose an arbitrary $x$ in $D$ and reason without assuming a special property absent from the domain. To prove $\exists x\in D,P(x)$, supply a witness and verify it, or use another argument establishing existence. To refute a universal statement, one counterexample suffices. To refute an existential statement, every possible witness must be ruled out.

The empty domain is a useful edge case. The claim $\forall x\in\varnothing,P(x)$ is true because there is no counterexample. The claim $\exists x\in\varnothing,P(x)$ is false because there is no witness. These conventions are compatible with the meaning of implication and make set-theoretic definitions work uniformly.

## Negating quantified statements

“Not every input succeeds” means “some input fails,” not “every input fails.” Formally,

$$\neg\forall x\in D,P(x)\equiv\exists x\in D,\neg P(x),$$
$$\neg\exists x\in D,P(x)\equiv\forall x\in D,\neg P(x).$$

Negation flips the quantifier and negates its body. For several quantifiers, work from the outside inward. The negation of

$$\forall n\in\mathbb N\ \exists m\in\mathbb N:\ m>n$$

is $\exists n\in\mathbb N\ \forall m\in\mathbb N:m\le n$. The original is true, witnessed by $m=n+1$; the negation claims a largest natural number.

For a program specification, “every request eventually receives some response” has the shape $\forall r\exists s,R(r,s)$. Its negation is $\exists r\forall s,\neg R(r,s)$: at least one request has no qualifying response. A response being late on some particular test does not by itself establish this negation unless “qualifying” includes the deadline and the test measures it.

## Quantifier order expresses dependency

The statements $\forall x\exists y,y>x$ and $\exists y\forall x,y>x$ are different. In the first, $y$ may depend on $x$; choose $x+1$. In the second, a single fixed $y$ must exceed every $x$, impossible over the integers. Think of a game: in the first statement, you see $x$ before choosing $y$; in the second, you must commit to $y$ before seeing $x$.

An equality such as $\forall x\exists y,x+y=0$ over integers is true with $y=-x$. Reversing the quantifiers asks for one integer that cancels every integer. Substituting $x=0$ requires $y=0$, while $x=1$ requires $y=-1$, a contradiction. This tiny pair of cases exposes the dependency error.

Quantifiers of the same kind commute: $\forall x\forall y$ can be reversed, as can $\exists x\exists y$. Mixed quantifiers generally cannot. Moving a quantifier through a connective can also require conditions, including whether a variable is free in the other expression. For beginning proofs, preserve scope with parentheses and avoid clever rearrangements unless justified.

## Boolean formulas, normal forms, and SAT

A Boolean variable takes values true or false. A literal is a variable or its negation. A clause is an or of literals. A formula in conjunctive normal form, or CNF, is an and of clauses. For example,

$$F=(P\lor Q)\land(\neg P\lor R)\land(\neg Q\lor R)$$

is satisfied by $P=\mathrm T,Q=\mathrm F,R=\mathrm T$. It is not satisfied by $R=\mathrm F$: the last two clauses would require both $P$ and $Q$ false, contradicting the first clause.

The satisfiability problem, SAT, asks whether some assignment satisfies a formula. With $k$ variables, exhaustive checking considers $2^k$ assignments. This is a correct decision procedure for a finite formula, though often costly. Saying that exhaustive checking is exponential does not prove every conceivable method requires exponential time. Distinguish the cost of one method from a lower bound on all methods.

Constraints can be encoded as formulas. Suppose exactly one of three tasks may run. “At least one” is $A\lor B\lor C$. “At most one” is $(\neg A\lor\neg B)\land(\neg A\lor\neg C)\land(\neg B\lor\neg C)$. Conjoining them expresses exactly one. Omitting the first clause would allow none; omitting pairwise exclusions would allow several.

Truth tables also produce a disjunctive normal form by taking an and describing each satisfying row and joining those terms with or. This representation proves every Boolean function can be described with standard connectives, but it may be large. Equivalent representations can differ greatly in size, a recurring concern in computing.

## Logic in programs and specifications

Many programming languages evaluate Boolean expressions from left to right with short-circuit behavior: after a false first operand, an and expression may skip the second operand. The truth function still matches conjunction for side-effect-free Boolean inputs. Evaluation behavior adds another issue when an operand changes state or is undefined.

Consider the mathematical guard $x\ne0\land 10/x>2$. The intended program should check $x\ne0$ before dividing. A mathematical conjunction describes truth; a concrete programming language also specifies evaluation order, types, overflow, and errors. Our proofs about a model must identify which programming behavior is represented. A proof over unbounded integers does not automatically certify fixed-width machine arithmetic.

Translate a specification in both directions. If access requires being logged in and either administrator or owner, write $L\land(A\lor O)$. An error such as $(L\land A)\lor O$ grants an owner access without login. Setting $L=\mathrm F,A=\mathrm F,O=\mathrm T$ separates the two formulas. Small counterexample assignments are a practical debugging tool.

## Translating a specification in stages

Consider the requirement “every stored file has an owner who can read it.” Let $F(f)$ mean that $f$ is a stored file, $U(u)$ that $u$ is a user, $O(u,f)$ that $u$ owns $f$, and $R(u,f)$ that $u$ can read $f$. One precise version is $\forall f\,(F(f)\Rightarrow\exists u\,(U(u)\land O(u,f)\land R(u,f)))$. The owner may differ from file to file. Moving the user quantifier outside would assert one user who owns and can read every file, a much stronger claim.

Negate the original step by step. A failure is some stored file for which no user is both an owner and a reader. That means every candidate user fails at least one of the required conditions. It does not mean that the file has no owner at all, since an owner might lack read permission. Naming the predicates prevents ordinary-language shortcuts from silently altering the requirement.

Uniqueness also requires an additional condition. “Every file has exactly one owner” is not expressed by an existential quantifier alone. It requires an owner $u$ and a statement that every other owner $v$ equals $u$. This distinction is directly analogous to existence and uniqueness of an equation's solution. A database with two owners satisfies “has an owner” while violating “has exactly one owner.”

## Constructing and auditing a full truth table

For three variables there are eight assignments. List them systematically by binary counting rather than inventing rows at random: FFF, FFT, FTF, FTT, TFF, TFT, TTF, TTT. Compute subexpressions in separate columns before the final expression. For $(P\lor Q)\land\neg R$, first calculate $P\lor Q$, then $\neg R$, then their conjunction. The formula is true exactly when at least one of the first two variables is true and the third is false.

To test whether two formulas are equivalent, compare their final columns on the same assignment rows. To test whether premises entail a conclusion, inspect only rows where every premise is true. A row where a premise is false does not refute the inference, even if the conclusion is false there. This distinction between formula evaluation and argument validity prevents a common misreading of truth tables.

A finite truth table is exhaustive for its declared Boolean variables. That exhaustiveness explains its proof status for propositional equivalence. It does not extend to an arbitrary domain of integers merely by replacing variables with sample values. The proof obligation changes when quantifiers range over an infinite set. Understanding why an exhaustive method is exhaustive matters as much as carrying out the entries.

## Local rules and global constraints

SAT encodings often introduce auxiliary variables for intermediate values. For an and gate with output $Z$ and inputs $P,Q$, the desired relationship is $Z\Leftrightarrow(P\land Q)$. It can be written as clauses $(\neg Z\lor P)\land(\neg Z\lor Q)\land(Z\lor\neg P\lor\neg Q)$. The first two clauses say a true output requires both true inputs; the third says both true inputs require a true output. Omitting either direction permits an incorrect gate state.

Joining such local clauses for every gate and requiring the final output true encodes the behavior of an entire finite circuit. A satisfying assignment must obey all local relations simultaneously. This is the bridge used later when multiplication is encoded as a constraint problem. The encoding is not a claim that every formula is easy to solve; it is a precise translation preserving which input choices can lead to a true output.

Before using a logical identity in a long proof, test a counterexample candidate that would separate the two formulas. This is a way to find an error quickly, not a replacement for an exhaustive truth table or valid equivalence derivation. The distinction between discovery and justification remains the same across all proof methods.

## Laboratory and practice

In the truth-table lab, toggle the displayed formula and inspect every row. Compare implication with its converse, or a formula with its negation. The lab exhausts all assignments for the displayed finite formulas; it is not an automatic proof assistant for arbitrary quantified mathematics.

**02-A.** Negate “every integer has a larger integer” with domains shown. **02-B.** Decide whether $(P\Rightarrow Q)\land P\Rightarrow Q$ is a tautology, with parentheses specifying the outer implication. **02-C.** Find a counterexample assignment to the inference from $P\Rightarrow Q$ and $Q$ to $P$. **02-D.** Encode exactly one of two variables as a CNF formula. **02-E.** Explain why $\forall x\in\mathbb Z\exists y\in\mathbb Z:x+y=0$ permits a different $y$ for different $x$.

Our next step is to organize logically valid deductions into readable proofs. Logic specifies what counts as a justified step; proof craft helps us find and communicate a useful sequence of steps.
