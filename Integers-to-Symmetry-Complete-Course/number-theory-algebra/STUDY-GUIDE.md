# Studying mathematics you can use

The course has two related aims. Number theory asks precise questions about integers, divisibility, congruences, prime numbers, and equations in whole numbers. Abstract algebra asks what follows from patterns of operations. You will often discover a theorem in the integers, recognize its algebraic mechanism, and then return to arithmetic with a stronger tool.

## Workload and pacing

The suggested calendar is thirty teaching weeks, fifteen in each semester. A planning allowance is 15–20 hours per week, roughly 450–600 hours overall, including reading, calculations, exercises, and projects. These are estimates, not a claim of measured workload or academic credit. If proofs are entirely new, a slower calendar is sensible. Twenty thoughtful minutes spent understanding one implication can be more useful than reading ten pages without following the reasoning.

Use three or four sessions per chapter. In the first, understand the problem and work the early examples. In the second, study definitions and proofs, explicitly naming the reason for each nontrivial step. In the third, choose exercises and use hints if needed. In a fourth session, revisit a question from an earlier chapter and explain the new connection. These are suggested methods, not mandatory checkpoints.

The weekly syllabus identifies the main spine. More elaborate proofs and investigations remain in the chapters for readers who want the full treatment; they need not all fit inside a single week's first pass. In particular, classification, Galois theory, and the final analytic and p-adic topics deserve additional time.

## A practical proof-writing rubric

Use the following rubric to diagnose an argument. A proof can be short and excellent, or long and incomplete; length is not the criterion.

| Dimension | A complete argument shows | A useful repair if missing |
| --- | --- | --- |
| Claim | Exact variables, domains, assumptions, and conclusion | Rewrite the theorem in a full sentence before calculating |
| Definitions | The meaning of the objects used | Expand one key definition, such as divisibility or kernel |
| Direction | Which implication is currently being proved | Label necessity and sufficiency separately |
| Justification | Why every important inference follows | Name the theorem or construct the missing intermediate step |
| Existence | An actual object or a valid theorem producing it | Give a formula, construction, or existence argument |
| Uniqueness | Why any two permitted candidates coincide | Introduce two candidates and compare them |
| Edge cases | Zero, signs, trivial groups, small primes, properness | Test the first boundary case and state any exclusion |
| Conclusion | Why the last statement is the requested conclusion | Return explicitly to the original question |

For example, to prove that a prime $p$ dividing $ab$ divides $a$ or $b$, do not use unique factorization if you are proving the lemma needed to establish unique factorization. Instead suppose $p\nmid a$. Then $\gcd(p,a)=1$ because the positive divisors of a prime are $1$ and $p$. Bézout gives integers $u,v$ with $up+va=1$. Multiplying by $b$ gives $upb+vab=b$. Both terms on the left are divisible by $p$, hence so is $b$. The proof explains exactly where primality matters and avoids circular reasoning.

## When a solution stalls

Start with a small example that satisfies every hypothesis. Compute one example that fails a hypothesis. Write down the relevant definitions without abbreviation. If the claim is an equivalence, work on one direction at a time. If the claim is universal, a few examples cannot finish it, but they can suggest the quantity that is preserved or the construction that is needed.

Common proof plans recur:

| Kind of question | A promising starting point |
| --- | --- |
| Is an integer divisible by another? | Express it as a multiple; use congruence or Bézout |
| Do two congruences have a simultaneous solution? | Compare their residues modulo the gcd of the moduli |
| Is a subset a subgroup? | Check nonemptiness and closure under $xy^{-1}$ |
| Is a quotient operation well defined? | Replace representatives and compare the resulting classes |
| Is an element invertible? | Solve the inverse equation or reduce it to a gcd/norm condition |
| Is a polynomial irreducible? | Specify the coefficient field; try degree, roots, reduction, Eisenstein |
| What is the size of a group orbit? | Identify its stabilizer and apply orbit–stabilizer |
| What is an extension degree? | Find a basis or minimal polynomial, then use the tower law |
| Is a sum/product identity legitimate? | First prove a finite version and then justify its limit |

These are starting points, not rules that every problem must obey. A strong solution chooses a tool because its hypotheses match the problem.

## Optional semester checkpoints

After chapter 15, you should be able to explain the path from Euclid to quotient rings: gcd and Bézout; modular inverses and CRT; groups and cosets; normality and quotient groups; ideals and quotient rings. Choose one example of each construction and one counterexample showing a missing hypothesis. The semester-one checkpoint in `assessments.md` supplies concrete questions and reference solutions.

After chapter 30, you should be able to combine ideas. For instance: construct a finite field from an irreducible polynomial; describe Frobenius; identify its fixed field; and explain how a polynomial over that field gives an evaluation code. Or connect the failure of integer factorization to norms and prime behavior in a larger ring. The final investigations in chapter 30 and the semester-two checkpoint provide such tasks.

## What to do after the course

If the main interest is arithmetic, deepen algebraic number theory (ideals, Dedekind domains, class groups) or analytic number theory (complex analysis, characters, Dirichlet series). If it is algebra, deepen modules, representation theory, commutative algebra, and Galois theory. If it is computation, implement larger-integer algorithms and compare your results with a computer algebra system. The source appendix points to author-hosted texts. These are next directions, not prerequisites secretly required by the first chapter.
