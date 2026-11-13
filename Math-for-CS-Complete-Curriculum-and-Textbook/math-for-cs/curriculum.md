# A complete college study sequence: Mathematics for Computer Science

This 32-week sequence teaches every numbered instructional section in the supplied 2017 PDF, organized into 18 substantial lessons. The lessons are also the chapters of the companion textbook. This is a proposed self-study course sequence with college-style workload and assessment, not an institutional credit award. The [source crosswalk](coverage.md) preserves the original section numbers and printed pages.

## Entry point and outcomes

Begin with arithmetic. No prior proof course, calculus, or programming is assumed. Chapter 01 supplies the algebra bridge. If you can already manipulate fractions, solve linear equations, explain exponents and logarithms, and read finite sums, skim its worked examples and attempt its five practice problems before moving on.

By completion, you should be able to translate quantified specifications; construct and critique direct, contraposition, contradiction, induction, and structural-induction proofs; prove invariants and termination; reason about sets, functions, countability, and computability limits; compute gcds and modular inverses; analyze orders, graphs, matching, coloring, spanning trees, planarity, and routing networks; derive sums and growth bounds; solve counting and recurrence problems; use generating functions; construct probability models; derive expectations and concentration bounds; and solve finite random-walk and stationary-distribution models.

## Weekly rhythm

Budget 8–12 hours: two teaching sessions of 90 minutes, one hour revisiting worked equations, 2–3 hours of practice, one hour in a relevant lab, and 1–2 hours correcting reasoning and reviewing older material. On a slower track, split every row below across two weeks. The algebra bridge may take extra time without disrupting the dependency order.

For each session, read the assigned sections, reproduce one calculation without looking, then change its inputs and explain which steps still apply. At the next week's start, retrieve one definition and one proof idea from the previous week; every fourth week, revisit one earlier error. These are suggested learning routines, not software-enforced gates.

Practice labels refer to the optional problems at the end of each chapter. Use [hints](practice/hints.md) before [solutions](practice/solutions.md). The supplied solutions show the reasoning expected. For additional depth, use the source PDF's Practice, Class, Homework, and Exam Problems for the listed sections. Those original exercise banks are extension readings, not a claim that every source exercise is reproduced or solved here.

## Semester I: mathematical reasoning and structures

| Week | Session 1 | Session 2 | Paper work and lab | Evidence of understanding |
|---:|---|---|---|---|
| 1 | Ch 01: numbers, fractions, equations | Exponents, logs, sums, modeling | 01-A–E; growth lab | Solve with restrictions and explain a finite sum |
| 2 | Ch 02: connectives and equivalence | Quantifiers, scope, SAT | 02-A–E; truth tables | Translate and negate a two-quantifier claim |
| 3 | Ch 03: direct proof and definitions | Contrapositive and equivalence | 03-A–C; proof-repair examples | Write a proof with each hypothesis used |
| 4 | Ch 03: contradiction and uniqueness | Review logic through counterexamples | 03-D–E; Assessment I | Diagnose a false inference and repair it |
| 5 | Ch 04: well ordering | Ordinary induction | 04-A–C; recurrence lab | Define the least-counterexample set correctly |
| 6 | Ch 04: strong induction and recursion | Strengthening and base-case coverage | 04-D–E; postage proof | Match the step dependency to its base cases |
| 7 | Ch 05: sets and sequences | Functions, images, preimages | 05-A–C; counting lab | Distinguish set, list, function, and relation |
| 8 | Ch 05: finite size and relation properties | Ch 06: states and invariants | 05-D–E, 06-A–B; Euclid lab | Prove initialization and preservation |
| 9 | Ch 06: termination and stable matching | Structural induction and brackets | 06-C–E; bracket lab | Separate partial correctness from termination |
| 10 | Ch 07: countability and diagonalization | Halting, Russell, ZFC, foundational limits | 07-A–E; Project 1 | Explain exactly what universal halting excludes |
| 11 | Ch 08: divisibility and extended Euclid | Prime factorization and jug reachability | 08-A; Euclid and jug traces | Produce and verify Bézout coefficients |
| 12 | Ch 08: congruence, inverses, Euler | Toy codes, RSA, SAT-to-search | 08-B–F; number-theory lab | State the hypothesis allowing cancellation |
| 13 | Ch 09: walks, matrices, DAGs | Orders, schedules, equivalence classes | 09-A–F; graph lab | Compute a critical path with correct units |
| 14 | Ch 10: simple graphs and matchings | Coloring, trees, MSTs | 10-A–D; graph lab | Give either an assignment or a Hall obstruction |
| 15 | Ch 10: communication networks | Ch 11: embeddings and Euler | 10-E–F, 11-A–C; network/planar labs | Distinguish distance, congestion, and size |
| 16 | Ch 11: coloring, polyhedra, forbidden structures | Integration and Semester I examination | 11-D–F; Project 2 | Use a valid planar obstruction, with conditions |

## Semester II: counting, probability, and recurrence models

| Week | Session 1 | Session 2 | Paper work and lab | Evidence of understanding |
|---:|---|---|---|---|
| 17 | Ch 12: geometric and power sums | Harmonic bounds and block overhang | 12-A–B, F; sums lab | Derive a formula by cancellation |
| 18 | Ch 12: products and double sums | Asymptotic definitions and pitfalls | 12-C–E; growth lab | Supply constants for an eventual bound |
| 19 | Ch 13: product, division, and subset rules | Repeated objects and stars and bars | 13-A–C; counting lab | Explain why each object is counted once |
| 20 | Ch 13: cards and pigeonholes | Inclusion–exclusion and double counting | 13-D–F; Assessment II | Identify and correct an overlap count |
| 21 | Ch 14: recurrences, Hanoi, merge sort | Linear roots and divide-and-conquer | 14-A, C–E; recurrence lab | Distinguish a construction bound from optimality |
| 22 | Ch 14: generating functions and convolution | Partial fractions and formal series | 14-B, F; coefficient lab | Extract coefficients with initial terms intact |
| 23 | Ch 15: sample spaces and events | Dice, birthdays, infinite spaces | 15-A–B; birthday lab | Justify weights before counting outcomes |
| 24 | Ch 15: conditioning and Bayes | Monty Hall and Simpson reversal | 15-C, F; Bayes/Monty labs | Track the information mechanism |
| 25 | Ch 15: independence and confidence | Ch 16: variables, PMFs, CDFs | 15-D–E, 16-A; distribution lab | Distinguish pairwise from mutual independence |
| 26 | Ch 16: expectation and indicators | Geometric waits and coupon collection | 16-B–E; coupon lab | Derive an expectation without a full distribution |
| 27 | Ch 16: infinite sums and paradoxes | Ch 17: Markov, variance, Chebyshev | 16-F, 17-A–C; tail lab | Name the condition permitting an interchange |
| 28 | Ch 17: covariance and sampling | Confidence, Chernoff, load balancing | 17-D–F; sampling/tail labs | Match a tail bound to its assumptions |
| 29 | Ch 18: finite gambler's ruin | Duration and the unbounded limit | 18-A–C; walk lab | Set boundary conditions before solving |
| 30 | Ch 18: graph walks and stationarity | Periodicity, damping, power iteration | 18-D–F; ranking lab | Separate stationarity from convergence |
| 31 | Synthesis: graph and probability models | Project design review | Project 3 and optional Project 4 | Explain model limits and independent checks |
| 32 | Final integration examination | Corrections and next-study plan | Final project presentation | Defend a complete chain of reasoning |

## Assessments with concrete prompts

Assessment I, after Week 4, is a suggested 75-minute, closed-solution exercise. (1) Translate and negate “each input has some valid output,” naming domains. (2) Prove the sum of two odd integers is even. (3) Repair cancellation from $ac=bc$ when $c$ may be zero. (4) Prove an equation has a unique solution and identify the nonzero-coefficient condition. Use the worked solutions for 02-A/E and 03-A/D/E as a rubric, not as an answer to memorize.

Assessment II, after Week 20, is a suggested 90-minute exercise. (1) Derive a geometric sum with its exceptional ratio. (2) Prove a quadratic polynomial is Theta of $n^2$ using constants. (3) Count length-five digit strings without repetition, first digit nonzero. (4) Count numbers one through 120 divisible by two or three. (5) Give a combinatorial proof of Pascal's identity. Keys are in the solutions appendix.

Semester I examination: 120 minutes, six equally weighted tasks. Prove a sum by induction; prove correctness and termination of Euclid; explain Cantor's diagonal set; solve a modular inverse; schedule a unit-task DAG; and refute planarity of $K_{3,3}$. Refer to 04-A, 06-A, 07-C, 08-B, 09-F, and 11-C for the expected techniques. Change example parameters to avoid rehearsing only one numerical instance.

Final examination: 150 minutes, five equally weighted tasks. Derive a recurrence and bound it; solve a restricted-count coefficient problem; construct a Bayes table; derive an expectation using indicators; and solve a finite random-walk hitting problem including its boundary conditions. A sixth optional synthesis task compares Chebyshev and Chernoff for a stated Bernoulli-sum model. The final project can replace half the examination for a portfolio route.

## Ready-to-use semester examinations

The following concrete versions instantiate the examination formats above. Each numbered task is worth twenty points. For Semester I, use the first five tasks plus the planarity task as an optional replacement or extension; allocate 120 minutes. For Semester II, allocate 150 minutes. Full keys are in the solutions appendix.

**Semester I.** (S1) Prove the sum of the first n odd positive integers is n squared for every nonnegative n, including the empty sum. (S2) Trace Euclid on 84 and 30, then prove both partial correctness and termination for all nonnegative inputs not both zero. (S3) Explain why no surjection from a set A to its power set exists; identify the diagonal subset and its hypothetical preimage. (S4) Solve $7x\equiv5\pmod{26}$ and justify the cancellation. (S5) Schedule unit tasks with edges $a\to c,b\to c,c\to d,b\to e,e\to f,d\to f$ on unlimited processors, giving layers and a matching lower bound. (S6, extension) Prove $K_{3,3}$ nonplanar with the appropriate edge bound.

**Semester II.** (F1) Solve $T(1)=1,T(n)=2T(n/2)+n$ on powers of two and justify the depth and level costs. (F2) Count nonnegative solutions to $x+y+z=7$ with each variable at most three, using inclusion–exclusion or coefficients. (F3) Use prior malicious probability 0.02, flag chance 0.8 if malicious, and 0.04 if benign. Find the posterior malicious probability given a flag. (F4) Derive the expected number of matching pairs among twelve independent uniform samples from one hundred bins, then explain why it differs from collision probability. (F5) For a fair walk on states zero through ten starting at four, derive success probability and expected absorption time using first-step equations. Optional synthesis: for a Bernoulli sum of mean one hundred, compare valid bounds at threshold 150 and identify the assumptions behind each.

## Projects

**Project 1: a verified small process.** Choose Euclid or the bracket scanner. Deliver a state definition, transition rules, invariant proof, termination proof, three traced runs including a boundary case, and a statement of arithmetic/input assumptions. The supplied companion is a reference implementation, not your proof. Acceptance: every legal transition preserves the invariant and every nonterminal transition decreases a stated well-founded measure.

**Project 2: a dependency and routing dossier.** Construct a synthetic eight-task DAG, compute a topological order and unlimited-processor layers, then build a separate six-vertex weighted undirected network and find an MST. Compare the four switching-network formulas at sixteen terminals. Acceptance: check every precedence edge, show a critical-path lower bound, justify each MST addition by a cut/exchange argument, and state the switch/terminal conventions.

**Project 3: a collision and load model.** Model $k$ independent keys hashed uniformly into $m$ bins. Derive expected colliding pairs, exact no-collision probability when $k\le m$, and a union-bound tail guarantee for maximum bin load. Compare exact small calculations with seeded simulation. Acceptance: define the probability space, distinguish probability from expected count, show where independence is used, and report sampling error and model limits.

**Optional Project 4: a tiny ranking engine.** Use a five-page directed graph with a dangling page. Repair dangling rows, add uniform teleportation, iterate a row distribution, and report normalization and stationarity residual. Compare with an undamped two-cycle. Acceptance: demonstrate actual convergence for the damped model, explain periodicity in the counterexample, and avoid claims about current commercial search rankings.

## Rubric and suggested grading

For any proof or project, assign 25% to precise definitions and assumptions, 35% to valid reasoning, 20% to correct worked calculations, 10% to independent verification, and 10% to clear interpretation and limitations. A numerical answer without reasoning earns at most the calculation portion. A correct computational experiment without a requested proof does not earn the proof portion.

A college-style grade can combine practice/corrections 25%, Assessments I/II 15%, Semester I examination 20%, final examination 20%, and projects 20%. For self-study, use the rubric diagnostically and revise weak work. Suggested readiness is at least 80% of available rubric points on a fresh problem plus an explanation of every correction, not mere completion of a checklist.

## Acceptance checks for the curriculum

Every numbered lesson is delivered as complete chapter text; all source instructional section IDs have crosswalk rows; every chapter has original worked mathematics and optional problems with hints and solutions; the continuous book matches chapter sources; laboratories compute from their controls; and the verification report distinguishes structural, numerical, rendering, browser, and archive checks. The source's full exercise bank remains an extension, with no claim of an exhaustive solutions manual.
