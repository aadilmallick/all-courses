# 07. Infinity, diagonal arguments, and limits of computation

Finite sets cannot be placed in one-to-one correspondence with proper subsets of themselves. Infinite sets can. This is not a contradiction; it is a warning that a useful finite intuition depended on finiteness. Source Chapter 8 develops infinite cardinality, the halting problem, and the logical foundations of sets. We use the function language of Chapter 05 and contradiction from Chapter 03.

## Counting without finishing a count

Two sets have equal cardinality when a bijection pairs their members. The even naturals $\{0,2,4,\ldots\}$ pair with $\mathbb N$ by $n\mapsto2n$. Every even natural has a unique preimage, even though the even naturals form a proper subset. Equality of infinite size is a statement about a pairing, not about subtracting finite counts.

A set is countably infinite if it is in bijection with $\mathbb N$. We use “countable” to include finite sets as well. An enumeration is an infinite list reaching every element; repetitions are allowed for showing countability if they can be removed or skipped. The integers can be listed as $0,1,-1,2,-2,\ldots$. This supplies a bijection once positions are specified, so adding negative integers does not produce a larger cardinality.

Pairs of naturals can be enumerated by diagonals of constant sum: $(0,0)$; $(0,1),(1,0)$; $(0,2),(1,1),(2,0)$; and so on. Every pair $(a,b)$ appears in the finite diagonal with sum $a+b$. Consequently $\mathbb N\times\mathbb N$ is countable. Listing an entire infinite row before the next row would fail, because the first row would never finish.

Positive rational numbers are ratios $a/b$ with positive integers $a,b$. Enumerate pairs diagonally and output their ratios, skipping duplicates such as $1/2$ and $2/4$. Add zero and interleave negatives to enumerate all rationals. A dense set need not be uncountable: there is a rational between any two distinct real numbers, yet the rationals are countable.

## Countable unions and finite descriptions

A countable union of countable sets is countable when enumerations of the component sets are available. Arrange their lists in rows and traverse diagonally. For finite strings over a finite alphabet, group by length. Every length has finitely many strings, so listing length zero, then one, then two, and so on enumerates them all.

Programs written in a fixed finite character alphabet are finite strings, hence form a countable set. The subset of syntactically valid programs is still countable. This remains true even when programs may be arbitrarily long. “No fixed maximum length” differs from allowing an actually infinite program description.

There are countably many integer polynomials because each is described by a finite list of integer coefficients. Each nonzero polynomial has finitely many complex roots, so algebraic numbers form a countable set. We need not use this consequence later, but it illustrates how finite descriptions constrain the possible collection of objects.

## Cantor's power-set theorem

For every set $A$, there is no surjection $f:A\to\mathcal P(A)$. Suppose one existed. Define

$$D=\{a\in A:a\notin f(a)\}.$$

Since $D\subseteq A$, surjectivity gives $d\in A$ with $f(d)=D$. Now $d\in D$ holds exactly when $d\notin f(d)=D$, a contradiction. Therefore no such surjection exists. On the other hand, $a\mapsto\{a\}$ injects $A$ into its power set. Thus the power set has strictly larger cardinality.

The proof changes the diagonal decision at each input: membership of $a$ in the proposed corresponding set is reversed. It works for finite and infinite sets alike. It proves no largest cardinality exists, since taking a power set always produces a larger one.

The set of infinite bit sequences is in bijection with $\mathcal P(\mathbb N)$: use a one at position $n$ exactly when $n$ belongs to the subset. Hence infinite bit sequences are uncountable. A proposed list of all sequences fails because the sequence differing from row $n$ at position $n$ appears in no row.

## Real numbers and representation ambiguities

One can adapt diagonalization to real numbers in $(0,1)$. Decimal expansions require care because $0.4999\ldots=0.5000\ldots$. Choose the diagonal digits only from, say, two and seven, and choose the digit different from the corresponding digit in the proposed row. The constructed number has no tail of nines or zeros, so ambiguity cannot identify it with a listed number.

Alternatively encode infinite bit sequences using ternary expansions with digits zero and two, taking care at endpoints. The underlying lesson is the same: uncountability is about impossibility of enumeration, not merely having a large numerical interval. The interval $(0,1)$ and the entire real line have the same cardinality via a suitable bijection, despite different lengths in ordinary geometry. Cardinality and geometric length measure different features.

Do not infer that every infinite subset of the reals is uncountable. The integers and rationals are counterexamples. Nor does uncountability imply that a given number lacks a short description: $\pi$ is one named real among uncountably many reals. Cardinality arguments prove that most reals cannot all receive finite individual descriptions, without identifying every undescribable real.

## The halting problem

The halting problem asks for a program $H(P,x)$ that always terminates and correctly decides whether program $P$ eventually halts on input $x$. The impossibility theorem concerns a universal perfect decider. It does not say no program can ever be proved terminating, or that useful termination tools cannot exist for restricted cases.

Assume $H$ exists. Construct a program $D(y)$ that consults $H(y,y)$. If $H$ predicts that program $y$ halts on input $y$, then $D$ loops forever; if $H$ predicts nontermination, then $D$ halts immediately. Programs have finite encodings, so feeding a program's own encoding as data is meaningful within the standard model.

Now run $D$ on its own encoding. If $H(D,D)$ predicts halting, the definition makes $D(D)$ loop. If it predicts nonhalting, $D(D)$ halts. Either prediction is wrong, contradiction. Thus the assumed perfect total decider cannot exist.

The construction is a diagonal argument: $D$ deliberately disagrees with a prediction about its own behavior. It does not rely on insufficient memory or a currently slow machine. Giving the hypothetical decider more finite resources does not repair the logical contradiction. A tool that sometimes says “unknown” avoids the theorem's assumptions and can still be valuable.

## More functions than programs

Functions $\mathbb N\to\{0,1\}$ correspond to infinite bit sequences, so there are uncountably many. Programs are countable. Each program computes at most one such total function, so some functions are not computable by any program. This is an existence argument independent of the halting proof.

Countability alone does not give an algorithm listing all total computable functions with a usable evaluation procedure. Syntactically listing programs includes programs that fail to halt. Distinguish listing descriptions from effectively identifying the descriptions with a semantic property. Many subtle errors in computability come from treating those tasks as interchangeable.

The collection of languages over a finite alphabet is also uncountable: a language is any subset of the countable set of finite strings. There are therefore more languages than programs that decide them. This connects abstract cardinality directly to limits on computational recognition and decision.

## Russell's paradox

Naive unrestricted set formation says every property defines a set of all objects satisfying it. Apply it to $R=\{x:x\notin x\}$. Asking whether $R\in R$ yields $R\in R$ exactly when $R\notin R$, contradiction. The problem is unrestricted formation, not ordinary reasoning about a specified set's subsets.

In Cantor's proof, $D$ was selected from an existing set $A$. In Russell's paradox, the attempted collection ranges over all sets without a bounding set. That distinction motivates restricted comprehension: from an existing set, select members satisfying a property. There is no set of all sets in the standard framework.

Sets are foundational objects, not necessarily physical containers. Container analogies help with membership but fail if they encourage a universal container holding every possible set. A formal theory needs axioms determining which collections count as sets and which operations produce new ones.

## What ZFC supplies

Zermelo–Fraenkel set theory with choice, ZFC, is a common foundation. Extensionality says sets with the same members are equal. Empty-set and pairing principles provide basic small sets. Union collects members from the sets in a given set. Power set supplies all subsets of a given set. Infinity supplies an infinite set from which natural numbers can be constructed.

Separation permits selecting members of an existing set by a property, avoiding unrestricted comprehension. Replacement says images of a set under a definable functional rule form a set, supporting larger constructions. Foundation excludes certain membership cycles and infinite descending membership patterns. Choice says a family of nonempty sets admits a function selecting one member from each; unlike finite explicit selections, an arbitrary family may lack a displayed selection rule.

Some axiom lists derive the empty-set axiom from another axiom instead of listing it separately. We are explaining their roles, not presenting a complete formal language or deriving arithmetic line by line. The source likewise uses familiar mathematical facts for ordinary proofs. Foundations explain the legitimacy and limitations of the tools; they need not make every practical proof unreadably primitive.

Gödel's incompleteness results, in their applicable form, say sufficiently expressive consistent effectively axiomatized theories cannot prove every arithmetic truth, and cannot establish their own consistency under the usual formal assumptions. This is a statement with technical hypotheses, not a reason to abandon proof or treat all claims as equally uncertain. We cite it as a foundational limit rather than attempting its advanced proof here.

## An explicit enumeration of pairs

The diagonal pattern can be turned into an index formula. There are $1+2+\cdots+s=s(s+1)/2$ pairs in diagonals of sum less than $s$. Within diagonal $s=a+b$, order pairs by increasing first coordinate. Then the pair $(a,b)$ receives index $s(s+1)/2+a$, starting at zero. Every pair gets one finite index, and each index belongs to exactly one diagonal and one position within it.

This formula is useful because it checks both uniqueness and exhaustiveness. A vague instruction to “keep alternating” may accidentally repeat or omit entries. A countability proof needs a construction or argument ensuring every desired element appears, not just a long initial list that looks promising. The same scrutiny applies when listing rational numbers: duplicate ratios can be removed, but no rational can be omitted because its numerator and denominator occur far out in the table.

## Injections and cardinal comparison

For arbitrary sets, an injection from $A$ to $B$ expresses that $A$ has no larger cardinality than $B$. An injection each way implies a bijection by the Cantor–Schröder–Bernstein theorem. This useful theorem is stated here without its full set-decomposition proof. In finite settings the result follows from ordinary counts; for infinite sets it is a substantive theorem and should not be silently assumed from finite intuition.

For instance, naturals inject into rationals, and the diagonal enumeration gives a way to assign rational numbers natural indices after duplicates are removed. The resulting cardinal equality says nothing about arithmetic operations being preserved. A cardinality bijection need not preserve addition, order, or distance. This is why equal-size sets can have very different mathematical structures.

## Deciding, recognizing, and timing out

A decider must halt on every input with the correct yes-or-no answer. A recognizer for a language must halt and accept members, but may run forever on nonmembers. Running a program for a million steps and reporting that it has not halted is a correct observation about that finite interval. Reporting that it will never halt would add an unsupported universal claim about the future execution.

Some programs' termination is straightforward: a natural-number rank decreases. Some loops are proved nonterminating by an invariant and a transition that always remains enabled. The halting theorem does not invalidate either kind of proof. It rules out one algorithm that always decides all such cases. A practical analysis tool may deliberately sacrifice completeness, ask for annotations, restrict its input language, or return “unknown.” These choices avoid the impossible specification while retaining useful guarantees.

An uncomputable problem also differs from a computable but expensive problem. SAT for a finite formula is decidable by exhaustive assignment checking. Whether a much faster general method exists is a complexity question. Universal halting is not merely a case where exhaustive search is too slow; a search for a halting event has no finite stopping certificate in every nonhalting case. Separating decidability from efficiency is a central CS distinction.

## What diagonalization does and does not construct

In Cantor's proof, the new subset is explicitly defined relative to the alleged listing. This does not require an algorithm that computes membership in every listed set. The proof is set-theoretic: it reasons about arbitrary functions and memberships. In the halting proof, by contrast, the assumed decider is computational, so the constructed disagreeing program must itself be a legitimate finite program. The diagonal pattern is shared, while the surrounding framework differs.

Similarly, the statement that uncomputable functions exist does not supply a finite table of all their values. A function may be mathematically well defined without being computable. “Defined,” “described,” and “computed” have related but distinct meanings. Later mathematical models often use ideal objects even when only approximations are computationally available.

## Consistency and ordinary mathematical work

Axioms are not conclusions obtained from experiments. They specify a formal framework within which implications can be proved. A contradiction in that framework would be serious because classical logic would then allow every statement to be derived. Carefully restricting set formation is therefore part of making mathematics coherent, not an arbitrary inconvenience imposed on an otherwise harmless universal set.

At the same time, a beginner need not formalize every arithmetic operation in set theory before proving a sum identity. We work at a useful level of abstraction, openly accepting familiar number laws. Foundations explain what a full formal account would need and where its limits lie. This balance allows rigor without burying each useful idea under thousands of primitive derivation steps.

Countability also differs from having a physically writable completed list. An enumeration is a rule assigning a finite position to each element; no person finishes the infinite task. Uncountability says even such an ideal assignment of positions cannot exist. This distinction prevents an unhelpful objection that no infinite set can be listed because life is finite. The mathematical definitions concern functions and exhaustive coverage, not available handwriting time or computer storage.

A finite prefix of an enumeration illustrates the rule; its proof must establish that every permitted object eventually occurs.

## Practice and perspective

No finite simulation demonstrates an uncountable set or solves universal halting. The bracket and recursion experiments from Chapter 06 are useful examples of restricted systems where termination and membership are decidable. Knowing why these restricted algorithms work helps locate what the universal impossibility result actually excludes.

**07-A.** Give an explicit listing pattern for $\mathbb Z$. **07-B.** Explain why listing all pairs by completing row zero first fails. **07-C.** Reproduce the set $D$ in Cantor's proof and explain the contradiction. **07-D.** Identify the false assumption in a proposed program that promises perfect termination decisions for all programs. **07-E.** Distinguish “all finite binary strings” from “all infinite binary sequences” in countability and representation.

The next chapter returns to finite arithmetic. Infinite reasoning will still support it: a finite algorithm such as Euclid can be justified for every natural-number input by the induction methods already developed.
