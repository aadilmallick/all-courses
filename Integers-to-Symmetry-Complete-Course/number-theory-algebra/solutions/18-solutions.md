# Chapter 18 — Hints and reference solutions

Return to [Chapter 18](../chapters/18-quadratic-reciprocity.md).

## 1. Gauss's lemma

**Hint.** Use the first six multiples and compare with thirteen divided by two.

The least positive residues of three times one through six modulo thirteen are $3,6,9,12,2,5$. Exactly two, nine and twelve, exceed $13/2$. Gauss's lemma gives $(3/13)=(-1)^2=1$. The signed list is $3,6,-4,-1,2,5$, whose absolute values permute one through six. Its even number of negative signs explains the positive character value.

## 2. Two supplementary laws

**Hint.** Thirty-one is seven modulo eight and three modulo four.

The two-law gives $(2/31)=1$. The minus-one law gives $(-1/31)=-1$. Multiplicativity then yields $(-2/31)=-1$. Extracting the negative sign is a separate step; it does not disappear merely because two itself is a square.

## 3. The rectangle identity

**Hint.** There are two columns and three rows.

For $p=5$, $q=7$, the first floor sum is $\lfloor7/5\rfloor+\lfloor14/5\rfloor=1+2=3$. The second is $\lfloor5/7\rfloor+\lfloor10/7\rfloor+\lfloor15/7\rfloor=0+1+2=3$. Their total is six, equal to $((5-1)/2)((7-1)/2)=2\cdot3$. No lattice point lies on the boundary line because five and seven are distinct primes and the coordinate ranges exclude their multiples.

## 4. The reciprocity sign

**Hint.** Both primes are three modulo four.

Reciprocity gives $(7/19)=-(19/7)$. Reducing the numerator gives $(19/7)=(5/7)=-1$, since the nonzero squares modulo seven are one, two and four. Thus $(7/19)=1$. A root check is $8^2=64\equiv7\pmod{19}$. The two symbols are opposite, exactly as their common congruence class predicts.

## 5. Symbol and actual roots

**Hint.** Separate the factors three and forty-one, then check the resulting root directly.

As shown in the chapter, $(3/211)=-1$, while $(41/211)=(6/41)=(2/41)(3/41)=1\cdot(-1)=-1$. Therefore $(123/211)=1$. A finite search finds forty: $40^2=1600=7\cdot211+123$. The second root is $211-40=171$. There are no further roots, by the quadratic root bound in the field. The symbolic calculation established existence; the final multiplication established the proposed numerical roots.

## 6. The rule for three

**Hint.** Combine the denominator modulo four and modulo three.

For an odd prime other than three, reciprocity says $(3/p)=(-1)^{(p-1)/2}(p/3)$. The possible prime classes modulo twelve are one, five, seven and eleven. Their modulo-four signs are respectively positive, positive, negative and negative; their modulo-three symbols are respectively positive, negative, positive and negative. The products are positive, negative, negative and positive. Therefore three is a square exactly for prime classes one and eleven modulo twelve, equivalently plus or minus one.

## 7. A power of two

**Hint.** Use multiplicativity three times.

Since $29\equiv5\pmod8$, the supplementary law gives $(2/29)=-1$. Therefore $(8/29)=(2^3/29)=(-1)^3=-1$. The exponent three is odd, so it retains rather than cancels the negative sign. This is the terminal step in the chapter's longer Jacobi calculation.

## 8. Infinite descent

**Hint.** Find a common factor of every hypothetical nonzero solution.

Suppose a nonzero solution exists and choose one with least positive $|z|$. This choice is possible because $z=0$ would force both other coordinates zero. Modulo three, the equation requires both squares to be zero, hence $x=3u$, $y=3v$. The substituted equation implies three divides $z^2$, so primality gives $z=3w$. Dividing by nine yields $u^2+v^2=3w^2$, a new nonzero solution with $0<|w|=|z|/3<|z|$. This contradicts minimality. Thus no nonzero integer solution exists. The decreasing positive quantity is $|z|$, and specifying it closes the logical gap often hidden in an informal statement about descending forever.
