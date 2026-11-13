# Author verification: Chapters 16–20

All five canonical chapter files and eight associated optional exercise solutions per chapter were completed. Whitespace-separated word counts, measured by Python `len(text.split())`, are:

| Chapter | Words |
|---|---:|
| 16 | 5,150 |
| 17 | 5,062 |
| 18 | 5,045 |
| 19 | 5,028 |
| 20 | 5,070 |
| Total | 25,355 |

These are word counts, not tokenizer measurements. Display-math delimiter and code-fence counts are balanced in each file; this static check does not prove rendering or mathematical correctness.

## Mathematical review

- Chapter 16 contains complete Euclidean-domain → PID → UFD arguments, a Gaussian Euclidean norm proof, ordinary-prime splitting, and the full sum-of-two-squares criterion. Zero/unit/associate conventions and converse limitations are explicit.
- Chapter 17 proves Euler's criterion, finite multiplicative subgroups of fields being cyclic, character-sum examples and composite-modulus caveats.
- Chapter 18 contains a complete Gauss-lemma → floor-parity → lattice-count proof of quadratic reciprocity, supplementary laws, Jacobi computation and the positive-Jacobi/non-square caveat. Algebraic quotient interpretations are developed after the residue results they use.
- Chapter 19 proves divisor formulas, convolution inversion, Mobius inversion, totient identities and finite counting applications; no analytic convergence is assumed in its finite rearrangements.
- Chapter 20 proves primitive Pythagorean classification, continued-fraction recurrences and error bounds, general Pell existence by pigeonhole approximation and same-norm residue pairs, and generation of positive Pell solutions by a fundamental unit. The additional general continued-fraction periodicity/Pell shortcut is explicitly a stated standard theorem, not presented as proved. Exact D=2 and D=13 computations are explained separately.

## Executed exact checks

Using installed SymPy and Python integer arithmetic, checked selected Gaussian products and Bezout identities; Legendre values for the worked prime examples; the Jacobi example `(1001/9907)=-1`; roots `[40,171]` of 123 modulo 211; divisor/totient/sigma values at 360; divisor summatory value 66 at 20; visible-point value 19 at 5; squarefree count 13 at 20; Pell identities for `(649,180,D=13)`, `(99,70,D=2)`, and `(97,56,D=3)`. These selected checks passed. Symbolic Gaussian products were expanded before comparing expressions; an initial unexpanded symbolic equality check was corrected in the checking procedure, with no change to the mathematical content.

No new external source was claimed to be fully read by this author. Original proofs were written from standard mathematics; the shared source ledger records the actual source-inspection scope. No third-party textbook extracts were copied.
