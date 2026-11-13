# Independent mathematical review — Chapters 16 and 18

Review date: 2026-11-13. Reviewed the complete chapter text and all eight solutions in each chapter. This is a mathematical prose review and finite computational cross-check, not formal proof-assistant certification.

## Chapter 16

No substantive mathematical errors found. The review checked:

- Euclidean domain implies PID: least Euclidean value is selected among nonzero ideal members, and ideal closure places the remainder in the ideal.
- PID implies factor existence: the union of an ascending ideal chain is principal and the chosen generator belongs to one stage; nonfactorability would produce a strictly increasing principal ideal chain.
- Irreducible implies prime in a PID: the gcd/Bezout argument correctly handles the case when the irreducible does not divide the first factor. Cancellation and nonzero assumptions are used legitimately.
- Uniqueness follows by prime divisibility and cancellation, with associates and units explicitly allowed.
- Gaussian nearest-point division gives the correct norm decrease bound of one half. Both displayed Euclidean calculations and their Bezout identity are arithmetically correct.
- Primes congruent to three modulo four remain irreducible by the norm obstruction. The Wilson-factorial argument gives a square root of minus one for primes congruent to one modulo four without using reciprocity prematurely.
- Gaussian UFD structure then proves the prime sum-of-two-squares case. Necessity and sufficiency of the general exponent criterion are both established, including repeated division of coordinates.
- The representation uniqueness claim is correctly limited to rational primes, up to signs and coordinate exchange. Composite representations need not be unique.
- The ideal `(2,x)` counterexample and all eight reference solutions are sound.

The general counterexample to PID implying Euclidean is mentioned without proof and is explicitly not used as a hidden step. The brief Gauss-lemma paragraph motivates UFD structure for integer polynomials; it is not a separate lengthy proof of every general polynomial-UFD theorem.

## Chapter 18

No substantive mathematical errors found. The review checked the entire reciprocity proof:

1. Signed half-table absolute values are a permutation because neither equal indices nor opposite indices can collide in the specified half-range.
2. Factorial cancellation is valid modulo the odd prime, and Euler's criterion identifies the sign count.
3. The floor-parity argument explicitly requires an odd numerator and uses that condition in its parity reduction.
4. The two floor sums count complementary parts of the finite rectangle. The line has no lattice points because the primes are distinct and coordinate ranges exclude their multiples.
5. The exact sum of counts yields the reciprocity sign, completing a proof rather than an experimental pattern.

Both supplementary laws, the examples `(123/211)` and `(1001/9907)`, the modulo-24 table for six, and the three infinitude arguments were checked. Jacobi symbol one is correctly distinguished from existence of a square root for composite denominators. All eight reference solutions are sound. The local-to-global warning does not assume a nonexistent general converse.

## Executed independent finite checks

Ran `python verification/review-16-18-check.py` using the installed SymPy. All **3,926** assertions passed:

- Gauss sign counts for every nonzero residue at odd primes below 100.
- Odd-numerator floor parity on that range.
- The complementary floor-sum rectangle identity for all ordered distinct odd prime pairs below 100.
- The sum-of-two-squares criterion against direct representation search for integers 1 through 500.
- Gaussian norm multiplicativity for integer coordinates from minus ten through ten against three nontrivial multiplier pairs.

Finite checks corroborate arithmetic and identities on stated ranges. They do not replace the general arguments reviewed above. No edits to Chapters 16 or 18 or their solutions were made by this reviewer.
