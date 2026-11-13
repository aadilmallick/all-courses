# Independent mathematical review — Chapters 21 and 24

Reviewed the full chapter and all eight reference solutions for each chapter, independently of their author. This is a mathematical reading review with selected finite computations, not a formal proof certificate.

## Chapter 21

The Smith reduction argument uses reversible integer operations, explicitly repairs a pivot that fails to divide the remaining block, and terminates through strict decreases of a positive pivot. The proof that a subgroup of Z^r has a finite free basis resolves the finite-presentation prerequisite. Existence of invariant factors follows from the relation matrix and finiteness. Uniqueness is established independently through intrinsic vector-space dimensions p^(k-1)P / p^k P and then alignment of prime-primary factors. No circular use of classification was found.

Checked the two-by-two relation matrices and their gcd/determinant invariants, the abelian groups of orders 36 and 72, element counts, generator counts, and the distinction between a subgroup P[p] and a quotient P/pP. All checked answers agree.

Minor boundary clarification: solution 7 initially refers to the last invariant factor d_r without first handling the trivial group H={1}. Add the sentence that the trivial group is cyclic and may be treated separately before using the nontrivial invariant-factor list. This does not affect the nontrivial proof.

## Chapter 24

The existence proof constructs a splitting field first and proves that the distinct roots of X^(p^n)-X form the whole field, avoiding circular reliance on irreducibles of every degree. The uniqueness proof extends embeddings by minimal polynomials and uses equal finite cardinalities. Frobenius orbit/minimal-degree comparisons justify the conjugate description; subfields use tower divisibility and root-set inclusion, with uniqueness inside a fixed ambient field. The proof of inseparability exclusions, the Frobenius factorization criterion, and the irreducibility test have the needed field/prime assumptions.

Checked the arithmetic tables for F4, F8, F9 and the F16 example; inverse claims; characteristic arguments; the degree-six irreducible count; and the degree/intersection statements for subfields of F(2^12). No substantive error found.

Minor boundary clarification: section 7 repeats the last-invariant-factor argument for F_q^times. When q=2 this group is trivial. Handle that case separately before writing e=d_r. The remaining argument is correct.

## Executed checks

The accompanying `checks-06-10.py` tests the chapter 06–10 arithmetic and permutation examples and, in support of this review, verifies inverse existence for every nonzero element of the displayed F4, F8, F9, and F16 polynomial quotients. Its finite computations do not establish general existence, uniqueness, Smith normal form, or the full classification theorems. Those were assessed by the proof review above.
