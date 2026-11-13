# Preface — Integers to Symmetry

A remainder calculation and a symmetry argument can look unrelated. In this book they become two views of the same question: what remains true when the objects change but the rules remain? The integers offer a concrete place to learn those rules. Abstract algebra gives names and proofs to the patterns. Returning to integer problems tests whether the abstraction has earned its place.

This is an original integrated course in undergraduate number theory and abstract algebra. It assumes high-school arithmetic, fractions, and elementary manipulation of equations. It does not assume that you already know what a proof is, how a vector space works, or why an infinite series can be rearranged. Those ideas enter where they become necessary. The main spine runs for thirty teaching weeks, divided into two semesters. A reader learning proofs for the first time should allow several sessions per chapter and may need a longer calendar.

The aim is transferable mathematical skill: read definitions precisely, find examples and counterexamples, explain why hypotheses matter, construct proofs, and solve problems that do not resemble a memorized template. Completing a book is not an automatic certification of expertise. The worked examples, optional exercises, reference solutions, and synthesis projects provide ways to judge progress by what you can actually explain.

## How to read a chapter

Begin with its motivating problem. Work through at least one numerical example on paper so that the notation has something concrete to refer to. Read a theorem once for its meaning, a second time for its hypotheses, and then follow the proof. A line in a proof should be justified by a definition, a previously established fact, or an explicitly stated assumption. When a line is unclear, locate that missing link before moving on.

The chapters are substantial. Their length is intended to make room for reasoning, not to prescribe a single sitting. A useful rhythm is three sessions: examples and definitions; theorems and proofs; applications and optional problems. Use the solutions only after giving a problem an honest attempt, or compare them directly when you want another worked example. No exercise is a gate that prevents you from continuing.

Experiments in the local browser companion provide small exact cases and controlled comparisons. They support intuition, expose failed assumptions, and help check calculations. They do not replace proofs of statements about all integers or all groups. The Galois experiment intentionally uses two specified examples; it is not a general symbolic algebra system.

## Scope and honest boundaries

Semester one builds proofs, divisibility, congruences, groups, actions, rings, ideals, and polynomial arithmetic. Semester two develops factorization domains, quadratic reciprocity, arithmetic functions, Diophantine approximation, finite abelian groups, extensions, finite fields, Galois theory, and selected analytical and p-adic connections. Some final topics are ambitious extensions beyond a typical introductory combined sequence. The weekly guide marks a manageable core and places deeper investigations in an optional track.

Central elementary results are proved with intermediate reasoning. Any general classification, analytic asymptotic, or deep equivalence invoked without a full proof must be identified as a theorem used or a proof sketch in its chapter. In particular, numerical prime data do not prove the prime number theorem. A sketch of radical solvability must not be mistaken for a full graduate treatment of Galois theory. The course does not attempt algebraic geometry, a full analytic number theory course, or the general theory of ideals in number fields.

## Reading formats and notation

Canonical chapters live in `chapters/`. The continuous volume is generated from those chapters. The separate solutions preserve the opportunity to attempt problems first. Equations use GitHub-compatible LaTeX delimiters, `$...$` and `$$...$$`; use GitHub or a Markdown editor with mathematical rendering. A plain text viewer still shows the complete source. The package does not require a remote math service or an account.

Positive integer moduli are normally at least two. The greatest common divisor is nonnegative. Groups use multiplicative notation unless addition is explicitly chosen. Functions compose from right to left. Rings are commutative with identity, with the usual nonzero-identity convention unless an example explicitly relaxes it; ring homomorphisms preserve the identity. Prime and maximal ideals are proper ideals. The notation $D_8$ denotes the symmetry group of the square, of order eight. The notation $\mathbb F_q$ refers to a finite field only when $q$ is a prime power. The integers $\mathbb Z/n\mathbb Z$ form a field exactly when $n$ is prime.

The story repeatedly returns to a small family of constructions: gcd as an ideal generator; congruence as a quotient; modular units as a group; irreducible polynomials as a way to build fields; and automorphisms as a way to see hidden relations among roots. These returns should make the abstractions feel increasingly inevitable.
