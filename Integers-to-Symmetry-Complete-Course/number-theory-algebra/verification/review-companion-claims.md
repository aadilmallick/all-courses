# Independent review — Chapter claims about the companion

## Method and inspected scope

Read `companion/README.md`, inspected the full experiment metadata and run functions in `companion/labs.mjs`, and scanned companion/laboratory references in all thirty chapters. This review compared wording with implemented controls and returned outputs; it did not modify any chapter or companion source. Runtime behavior is covered by the separate companion verification.

## Material wording mismatches at review time

| Location | Chapter wording | Implemented scope | Recommended correction |
|---|---|---|---|
| Chapter 04, companion paragraph near the end | Directs readers to the congruence experiment and discusses repeated outputs in a multiplication table | The `congruences` experiment solves two simultaneous remainder conditions with generalized CRT; it displays solution representatives and their remainders, not a multiplication table | Link this paragraph to the units lab for powers/order and explicitly leave multiplication tables as hand calculations, or describe the CRT lab's actual remainder outputs |
| Chapter 05, reconstruction-algorithm paragraph | Says the congruence experiment explores “linear equations” and a gcd reduction | There is no input for a general coefficient/right side equation `ax = b (mod n)`; a linear congruence is used internally when merging the two CRT conditions | Describe compatibility and the combined lcm period; keep general linear-congruence exercises as hand work |
| Chapter 10, companion paragraph | Says the permutations experiment composes permutations and discusses two input factors | The interface accepts one image list, computes its cycle decomposition, parity and order, and separately enumerates binary necklaces | Say to compose factors by hand, enter the resulting image list, and inspect its cycles/order/parity |

These are claims about controls, not faults in the mathematical lessons or in the implemented calculators. Narrowing the references is sufficient; the companion need not grow into a general symbolic system.

## Clarifications that would improve precision

- Chapter 13 describes the quotient-rings experiment as inspection of “small residue rings” and “which products vanish.” The experiment is specifically `(Z/nZ)[X]/(X² − d)` with one chosen element `a + bα`, its norm, inverse status and powers. Choosing `b = 0` explores embedded residue-class arithmetic. There is no two-element arbitrary-product control or exhaustive multiplication table. Describing the quadratic quotient and its single-element powers would match the interface directly.
- Chapter 14's reference to quotient arithmetic, units and vanishing products is supported in a limited sense by inverse detection and computed powers. If “vanishing products” is intended to mean arbitrary two-element multiplication, narrow it to vanishing powers or nonunits in finite quotients.
- Chapter 24's “small polynomial-quotient experiments” are performed in one specified field, `F₂[X]/(X³ + X + 1)`, rather than in an arbitrary field selected by a polynomial input. Existing text does not explicitly promise arbitrary construction, but naming the fixed eight-element field would remove any ambiguity.

## Scope claims that match

- Euclid shows actual division steps and exact Bezout coefficients.
- The units references accurately describe unit lists, powers and multiplicative orders. General quotient-group computation is explicitly disclaimed in Chapter 08.
- Chapter 11's permutation/cycle connection and Chapter 12's revised description of entering a permutation to inspect order match the implementation; general conjugation and Sylow classification are not promised.
- The arithmetic-functions and Pell connections describe the implemented divisor/convolution and convergent calculations accurately.
- The abelian-group lab claims only comparison of cyclic decompositions and element-order data. Its source explicitly says the two-generator diagonal case is not a general Smith-normal-form algorithm.
- The finite-field lab performs real arithmetic and Frobenius in a specified field. Chapter 22 does not promise arbitrary real constructibility, and Chapter 23 disclaims arbitrary rings of integers or ideal-class computations.
- The Galois connections in Chapters 25–27 explicitly describe selected modeled examples and disclaim universal polynomial-to-Galois-group computation. The two curated examples in the source match that description.
- The prime lab computes finite prime counts, reciprocal sums, Euler products and a numerical tail bound. The chapter distinguishes finite evidence from limiting theorems.
- The Hensel reference promises finite lifts, matching the simple-root lifting experiment for `X² − 2`. It does not claim an infinite p-adic value is stored.
- Chapter 30 distinguishes erasures from unknown errors and does not claim the lab implements every optional project. The code performs recovery from two specified erasures, matching the limited claim.

## Residue-lab integration note

At the time the source was inspected, the residues lab listed square classes and reciprocity symbols for two prime inputs, but did not accept a general numerator for root extraction. The integration owner stated that a general `a` input and root lists modulo `p` and `q`, with odd-prime limits increased to 997, are being added. That extension will support Chapter 18's explicit root-list statement and its example modulo 211. Confirm the updated source and control behavior in the final companion checks; this read-only report does not certify an edit that was still in progress.
