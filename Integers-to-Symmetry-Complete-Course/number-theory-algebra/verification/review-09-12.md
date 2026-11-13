# Independent mathematical review — Chapters 09 and 12

Reviewed complete chapter and solution text for Chapters 09 and 12, with read-only cross-checks of Chapter 07's order-of-a-power and commuting-coprime-order theorems. No source chapter or solution file was edited during this review.

## Findings

No blocking mathematical error was found in the reviewed text. This is a reasoned review of the presented arguments, not a formal proof certificate.

- Chapter 09's finite-field root bound states and uses the field hypothesis correctly. Its primitive-root proof constructs an element with the group exponent and uses the root bound to force full order. The needed order lemmas are already taught in Chapter 07.
- The odd-prime-power lifting proof handles the middle and final binomial terms with the correct valuations, including the boundary case of an odd prime equal to three. The power-of-two argument starts with the required divisibility by four. The special modulus two and the distinction between a trivial group and larger cyclic groups are handled.
- RSA correctness explicitly covers nonunit messages through the two prime moduli, rather than applying Euler to a nonunit. Distinct primes are stated, and the modulus-nine counterexample correctly shows why the broader assertion would fail.
- Chapter 12's Cauchy proof checks that rotation preserves product-one tuples in a nonabelian group. Its fixed-point count correctly forces a nonidentity solution.
- The Sylow-existence induction distinguishes proper-subgroup and central-quotient branches and decreases group order in each recursive use.
- The containment proof uses an action on a coset set, without assuming a quotient group exists. The counting proof checks normalization before forming a product subgroup and proves the product order formula needed for the unique-fixed-point argument.
- Examples distinguish Sylow-number possibilities from forced values, subgroup orders from element orders, and normality from centrality. The order-fifty-six solution correctly uses the complement of the forty-eight order-seven elements.

## Geometric convention

The square-group reflection convention is consistent with the earlier square examples: the named reflection is across a diagonal. The normalizer computation's corner-axis description therefore has the required earlier context.

## Executed numerical checks

Exact Python integer arithmetic confirmed the chapter's representative Euler/repeated-squaring examples, the order-seventeen calculations, the two odd-prime lifting values, both RSA decryptions, both base-two/base-three Fermat outcomes for 341, the order-factoring gcd example, and the exercise power modulo 35. A four-point permutation computation confirmed `(132)(134)=(12)(34)` with right-to-left composition. Enumerating divisors confirmed the displayed Sylow-number possibilities for orders 15, 21, 30, 45, 56 and 84.

These finite checks support the numerical examples; they do not replace the universal group-theoretic proofs.
