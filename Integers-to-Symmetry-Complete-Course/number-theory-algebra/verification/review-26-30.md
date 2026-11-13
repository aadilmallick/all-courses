# Author verification: Chapters 26–30

Date: 2026-11-13. Canonical files are the numbered chapter sources and corresponding eight-problem solution files. Every chapter exceeds 5,000 whitespace-separated words; this is the documented word-count proxy, not a measured model-token count. All exercises posed in these five chapters have separate hints and worked reference solutions.

## Mathematical proof boundaries

| Chapter | Proved in the chapter | Explicit boundary |
|---|---|---|
| 26 | Cyclotomic integrality and irreducibility, cyclotomic Galois group, real subfield degree, regular polygon criterion, explicit eighth-root fixed fields | Uses previously taught Gauss/Eisenstein and finite Galois correspondence; no claim that every Fermat number is prime |
| 27 | Small Galois groups, discriminant parity test, solvable-group lemmas, A5 simplicity/nonsolvability, modular certificates and group-generation argument for x⁵−x−1 | Full radical-solvability theorem imported, with architecture only; reduction-cycle theorem imported; no claim that every quintic is unsolvable |
| 28 | Real-series convergence bounds, Euler product for s>1, prime-reciprocal divergence by finite products, elementary binomial lower bound, Möbius reciprocal series, coprime density, finite summation by parts | PNT stated without proof; ζ(2)=π²/6 not used or claimed proved; optional integral power-tail evaluation identified as additional calculus theorem |
| 29 | Simple-root Hensel lemma, compatible-residue ring, unit/domain/valuation/completeness facts, local PID, odd-prime square criterion, doubled-precision update, finite-branching root argument | General equivalence between fraction-field and direct Q-completion constructions described without full proof; no unrestricted local-to-global principle; singular Hensel variants not asserted |
| 30 | RS injectivity/minimum distance, interpolation, error-locator uniqueness, Hamming correction/erasure bounds, Singleton bound, exact F5/F4 examples | Engineering channel models, authentication and cryptography separated from algebraic correction; optional investigations are not represented as implemented companion features |

## Executed mathematical checks

Executed with the installed Python and SymPy, using exact integer and finite-field arithmetic:

- x⁵−x−1 is irreducible modulo three; its displayed modulo-two factorization is correct; discriminant is 2869.
- The seven-adic square-root representatives 3, 10, 108 and 2166 solve x²−2 at precisions 7, 49, 343 and 2401 respectively and reduce compatibly.
- The displayed root 57 of x²+1 is correct modulo 125.
- The two F5 encoded examples have the stated evaluation words.
- Enumerated all 125 codewords of the [5,3,3]5 code and all distinct pairs; the observed exact minimum distance is three.
- Enumerated all 125 messages against the received word (2,1,4,0,0); the unique codeword within distance one corresponds to (2,3,1).
- Verified the displayed error-locator product over F5.

One initial ad hoc test used the symbolic remainder operator incorrectly for a polynomial congruence. The test was repaired to use Poly(..., modulus=p).is_zero and rerun successfully. This was a test-harness issue; it did not require changing a mathematical example.

These checks validate the listed finite computations. They do not mechanically certify every proof or all future inputs. Root-level companion execution and browser checks are recorded separately.

## Primary reference inspection

Inspected the author-hosted J. S. Milne, *Fields and Galois Theory*, version 5.10, September 2022, at <https://www.jmilne.org/math/CourseNotes/FT.pdf>, specifically the statements/discussion of radical solvability and cyclotomic extensions. The radical-solvability theorem is Theorem 5.34, printed page 77, also stated as Theorem 3.28 on page 45. Root separately confirmed the reduction-cycle theorem as Theorem 4.28, printed page 55. The chapter explanations are original; no source PDF or extracted source chapter is redistributed.
