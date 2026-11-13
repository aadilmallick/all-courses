# Independent mathematical review — Chapter 27

Scope: read the full chapter and all eight solution entries independently. This is a manuscript review with selected exact symbolic checks, not a formal verification of every theorem. No other author's chapter files were edited.

## Results

No substantive mathematical error found in the reviewed arguments. The two major imported results are explicitly identified as theorems used without full proof: the squarefree-reduction cycle theorem and the characteristic-zero radical-solvability equivalence. The radical-tower discussion accurately labels its general necessity/converse explanations as proof architecture and identifies the missing cyclic-extension lemma. Its characteristic-zero restriction is present and appropriate.

The $A_5$ simplicity proof uses the correct nonidentity conjugacy-class sizes $20,15,12,12$. Their possible unions with the identity give exactly the listed orders, and only one and sixty divide sixty. Nonabelian simplicity then implies that the derived subgroup is the entire group, so nonsolvability follows. The centralizer descriptions giving these class sizes are consistent with the relevant permutation types.

The quintic calculation correctly obtains a $(2)(3)$ cycle type modulo two, cubes it to produce a transposition, and obtains a five-cycle using irreducibility modulo three. The group-generation argument does not assume that an arbitrary memorized pair of standard generators has been produced: conjugating the actual transposition by the actual five-cycle gives edges of a connected graph because the nonzero step generates the additive group modulo five. Edge transpositions then generate $S_5$. The graph proof in the solution gives a valid path/conjugation construction.

The cubic and quartic splitting-field degrees and automorphism relations are correct. The discriminant square test is used to detect evenness, not to infer a full symmetric group from nonsquareness. Cardano's branch compatibility condition is stated, with the potentially zero-divisor expression in the $p=0$ case avoided by a separate direct treatment. The solvable-extension group lemma is proved with the correct hypotheses that both the normal subgroup and quotient are solvable.

## Independent executed arithmetic checks

Using installed SymPy, verified:

- Multiplying the displayed quadratic and cubic gives $X^5-X-1$ modulo two.
- The values of the quintic at zero, one and two modulo three are all two, hence nonzero.
- Its remainders modulo the three listed irreducible quadratics are exactly $-1$, $X-1$, and $X-1$.
- The discriminants are $-2048$ for $X^4-2$ and $81$ for $X^3-3X+1$.
- Enumerating class-size subset sums yields the displayed normal-subgroup-order candidates, with only one and sixty dividing sixty.

These finite checks corroborate specific calculations and do not establish the imported general theorems.

## Rendering corrections reported to the integrator

Two displays contain the literal `,qquad` rather than `,\qquad`: the dihedral relation display in Section 27.5 and the paired Cardano expressions in Section 27.14. This is a LaTeX transcription issue, not a failure of the underlying equations. The integrator was notified so the canonical chapter and assembled book can be regenerated consistently.
