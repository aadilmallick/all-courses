# Integers to Symmetry

## A complete integrated course in number theory and abstract algebra

Start with [the weekly syllabus](SYLLABUS.md), then read [chapter 01](chapters/01-proofs-and-structures.md). The course assumes high-school arithmetic and algebra. Proofs, linear algebra, complex arithmetic, and elementary analysis are introduced when they become necessary.

This package contains thirty substantial teaching chapters, thirty separate solution sets, the continuous [textbook](book.md), optional semester checkpoints with worked solutions, and a dependency-free [interactive laboratory](companion/README.md). The intended spine is two fifteen-week semesters, with a suggested 15–20 hours a week and optional deeper sections that can be spread over a longer calendar. This is a self-study estimate, not an academic-credit claim.

The route deliberately intertwines the subjects: Euclid and divisibility → congruence and CRT → groups and quotient maps → rings and polynomial quotients → factorization and reciprocity → finite fields and Galois theory → arithmetic, analysis, p-adic compatibility, and codes.

## Choose a reading route

- **Chapter by chapter:** use the linked sequence below. This is the recommended route for GitHub, where the individual files keep navigation manageable.
- **One continuous volume:** open [book.md](book.md) in a mathematical Markdown reader. It is generated from the same canonical chapters.
- **Study support:** use [the study guide](STUDY-GUIDE.md), [solutions index](solutions/README.md), and [optional semester checkpoints](assessments.md).
- **Explore a calculation:** follow [the laboratory instructions](companion/README.md). No installation of packages or external account is needed.
- **Check evidence and boundaries:** see [verification](verification.md), [proof status](PROOF-STATUS.md), and [references](REFERENCES.md).

The course is designed for careful, multi-session reading. Optional exercises are supplied with hints and complete reference solutions; they do not block progress. Understanding the reason for a theorem matters more than finishing pages quickly.

## Reading order

### Semester 1

1. [Learning to prove: logic, sets, functions and induction](chapters/01-proofs-and-structures.md) · [Solutions](solutions/01-solutions.md)
2. [Divisibility, Euclid and Bezout](chapters/02-euclidean-algorithm.md) · [Solutions](solutions/02-solutions.md)
3. [Primes, unique factorization and valuations](chapters/03-primes-and-factorization.md) · [Solutions](solutions/03-solutions.md)
4. [Congruence, equivalence relations and residue classes](chapters/04-congruence-and-quotients.md) · [Solutions](solutions/04-solutions.md)
5. [Linear congruences and the Chinese remainder theorem](chapters/05-linear-congruences-and-crt.md) · [Solutions](solutions/05-solutions.md)
6. [Groups, symmetry and subgroups](chapters/06-groups-and-symmetry.md) · [Solutions](solutions/06-solutions.md)
7. [Cyclic groups, cosets and Lagrange](chapters/07-cyclic-groups-and-lagrange.md) · [Solutions](solutions/07-solutions.md)
8. [Homomorphisms, normal subgroups and quotients](chapters/08-homomorphisms-and-quotient-groups.md) · [Solutions](solutions/08-solutions.md)
9. [Units, orders, Fermat, Euler and RSA](chapters/09-units-orders-and-rsa.md) · [Solutions](solutions/09-solutions.md)
10. [Permutations, parity and alternating groups](chapters/10-permutations-and-alternating-groups.md) · [Solutions](solutions/10-solutions.md)
11. [Group actions, orbit-stabilizer and counting](chapters/11-group-actions-and-counting.md) · [Solutions](solutions/11-solutions.md)
12. [Cauchy, Sylow and finite group structure](chapters/12-sylow-and-finite-groups.md) · [Solutions](solutions/12-solutions.md)
13. [Rings, integral domains and fields](chapters/13-rings-domains-and-fields.md) · [Solutions](solutions/13-solutions.md)
14. [Ideals, quotient rings and ring CRT](chapters/14-ideals-and-ring-quotients.md) · [Solutions](solutions/14-solutions.md)
15. [Polynomial arithmetic, roots and irreducibility](chapters/15-polynomial-arithmetic.md) · [Solutions](solutions/15-solutions.md)

### Semester 2

16. [Euclidean domains, PIDs, UFDs and Gaussian integers](chapters/16-ufds-and-gaussian-integers.md) · [Solutions](solutions/16-solutions.md)
17. [Quadratic residues and the Legendre symbol](chapters/17-quadratic-residues.md) · [Solutions](solutions/17-solutions.md)
18. [Gauss lemma and quadratic reciprocity](chapters/18-quadratic-reciprocity.md) · [Solutions](solutions/18-solutions.md)
19. [Arithmetic functions, convolution and Mobius inversion](chapters/19-arithmetic-functions.md) · [Solutions](solutions/19-solutions.md)
20. [Diophantine equations, continued fractions and Pell](chapters/20-diophantine-and-continued-fractions.md) · [Solutions](solutions/20-solutions.md)
21. [Finite abelian groups, modules and Smith normal form](chapters/21-finite-abelian-groups.md) · [Solutions](solutions/21-solutions.md)
22. [Vector spaces, field extensions and constructibility](chapters/22-field-extensions.md) · [Solutions](solutions/22-solutions.md)
23. [Number fields, algebraic integers and failed factorization](chapters/23-number-fields-and-integers.md) · [Solutions](solutions/23-solutions.md)
24. [Finite fields, Frobenius and polynomial factorization](chapters/24-finite-fields.md) · [Solutions](solutions/24-solutions.md)
25. [Field automorphisms and the Galois correspondence](chapters/25-galois-correspondence.md) · [Solutions](solutions/25-solutions.md)
26. [Cyclotomic polynomials, roots of unity and regular polygons](chapters/26-cyclotomic-fields.md) · [Solutions](solutions/26-solutions.md)
27. [Computing Galois groups and solvability by radicals](chapters/27-solvability-and-galois-computations.md) · [Solutions](solutions/27-solutions.md)
28. [Analysis as needed: sums, limits, Euler products and primes](chapters/28-analysis-and-primes.md) · [Solutions](solutions/28-solutions.md)
29. [Hensel lifting and a first look at p-adic integers](chapters/29-hensel-and-p-adic.md) · [Solutions](solutions/29-solutions.md)
30. [Synthesis: finite-field coding and mathematical investigations](chapters/30-synthesis-and-coding.md) · [Solutions](solutions/30-solutions.md)

## Run the local laboratory

Extract the ZIP, open a terminal in this folder, and run:

```sh
node companion/server.mjs
```

Open <http://127.0.0.1:4173/companion/index.html>. Node 18 or later is sufficient for the supplied APIs; the exact tested version is in the verification report. Stop the server with Ctrl+C. Use the server rather than opening the HTML as a local file, since browsers can block module imports from `file:` URLs. The laboratory is a set of experiments, not a hosted reading website.

The fourteen experiments perform actual arithmetic and finite computations. They cover extended Euclid, compatible congruences, units and orders, permutations/Burnside counting, quadratic quotient rings, reciprocity, Möbius inversion, Pell, abelian decompositions, F₈ arithmetic, two Galois examples, prime sums/products, Hensel lifting, and polynomial-code erasure recovery. Their precise limits are documented in the laboratory guide.

## Put the course on GitHub

The extracted folder is already arranged as a repository: relative links, UTF-8 Markdown, mathematical notation, complete source, and no machine-specific source paths. Upload this folder's contents to a repository you control, or initialize a local repository and use your usual GitHub workflow. No account, repository, or deployment has been created automatically.

The source of truth is `chapters/`. After editing a lesson, regenerate the continuous volume with:

```sh
python scripts/assemble.py
python scripts/check_project.py
```

The assembly and structural checker require Python 3.10 or later and only its standard library. Numerical laboratory checks require only Node:

```sh
node scripts/check_companion.mjs
node scripts/check_http.mjs
```

The optional independent reference-case checker uses SymPy, and the optional math-syntax checker requires a configured TeX installation; neither is needed to read or run the course. See [environment details](ENVIRONMENT.md) and [notices](NOTICES.md).

Equations use `$...$` and `$$...$$`. GitHub-compatible source has been checked structurally; the verification report records the rendering checks that could and could not be performed. No PDF or public website is included.
