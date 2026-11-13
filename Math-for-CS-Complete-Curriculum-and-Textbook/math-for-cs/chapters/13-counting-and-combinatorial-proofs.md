# 13. Counting without overcounting

Before calculating a probability, we must know what outcomes exist and whether each has the same weight. Counting is therefore a modeling discipline: identify the objects, construct them without ambiguity, and account for duplicate descriptions. Source Chapter 15 develops bijections, product and division rules, permutations, subsets, repeated objects, pigeonholes, inclusion–exclusion, and combinatorial proofs.

## Bijections and disjoint choices

A bijection transfers a difficult count to an easier collection. Subsets of an $n$-element set correspond to binary strings of length $n$ through membership bits, so there are $2^n$ subsets. The bijection must work both ways and be unique in both directions; a many-to-one encoding does not establish equal cardinality.

The sum rule adds sizes of disjoint alternatives. If a code begins either with one of four letters or one of three digits and the two cases cannot overlap, there are seven choices. If alternatives overlap, adding directly double-counts shared objects. For sets $A,B$, correct the sum by subtracting $|A\cap B|$.

The product rule counts staged choices when the number of next options is specified for every earlier choice. Four shirts and three trousers give twelve ordered outfits. Independence in probability is not required: counting can multiply successive conditional numbers of choices even when later possibilities depend on earlier choices, provided the count at each stage is correctly identified.

For length-four passwords over ten digits with no repeated digit, the choices are $10,9,8,7$, giving $5040$. With repetition, each stage has ten choices, giving $10^4$. If the first digit cannot be zero, the no-repetition count is $9\cdot9\cdot8\cdot7$: after selecting a nonzero first digit, nine digits remain, including zero.

## The generalized product rule

A construction tree can have different numbers of children in different branches. Then multiply along a branch and add across disjoint branches, or split into cases where branching factors are constant. Suppose a two-symbol code starts with either a letter from $\{A,B\}$ or a digit from $\{0,1,2\}$. After a letter, any of five symbols is allowed; after a digit, only a letter is allowed. The total is $2\cdot5+3\cdot2=16$, not $5\cdot5$.

When counting selections on a chessboard or defective-number patterns, state whether positions are ordered and whether constraints apply locally or globally. Count a tiny case by hand first. A product with plausible-looking factors can still count a different object than intended.

## Permutations and division

An ordered selection of $k$ distinct objects from $n$ has

$$n(n-1)\cdots(n-k+1)=\frac{n!}{(n-k)!}$$

possibilities for $0\le k\le n$. Setting $k=n$ gives $n!$ permutations. The case $k=0$ gives one empty selection, consistent with the empty-product convention.

An unordered $k$-subset has $k!$ orderings. Dividing the ordered-selection count by this constant multiplicity gives

$$\binom nk=\frac{n!}{k!(n-k)!}.$$

For five people choosing a two-person committee, the ordered pairs number $5\cdot4=20$, but each committee appears twice, giving ten. Dividing requires every target object to have the same number of descriptions. An irregular duplication pattern cannot be repaired by an arbitrary average factor.

For circular arrangements of $n$ distinct people, rotations are identified but reflections are not unless stated. Every circular arrangement has exactly $n$ linear representatives obtained by choosing the first position, so there are $n!/n=(n-1)!$. If repeated symbols or rotational symmetries occur, this constant-fiber argument may fail. Counting necklaces requires more careful symmetry analysis than dividing by $n$ blindly.

## Repeated objects and multinomial coefficients

The word BANANA has six positions containing three A's, two N's, and one B. Labeling repeated letters temporarily would give $6!$ permutations, but swapping A labels or N labels changes no visible word. Each visible arrangement has $3!2!$ labeled versions, so the count is $6!/(3!2!)=60$.

In general, arranging $n$ objects with type counts $n_1,\ldots,n_r$ summing to $n$ gives the multinomial coefficient $n!/(n_1!\cdots n_r!)$. The same formula counts partitioning labeled objects into labeled groups of specified sizes. Unlabeled groups introduce another symmetry issue and cannot always be handled by the same formula without changes.

Sequences of subsets can be counted position by position through membership patterns. For ordered pairs $(A,B)$ of subsets of an $n$-element universe, each element has four states: in neither, only $A$, only $B$, or both. Thus there are $4^n$ pairs. If $A\cap B=\varnothing$, omit the fourth state and obtain $3^n$.

## Stars and bars

To count nonnegative integer solutions of $x_1+\cdots+x_r=n$, represent $n$ identical stars separated into $r$ groups by $r-1$ bars. Choosing bar positions among $n+r-1$ positions gives

$$\binom{n+r-1}{r-1}.$$

Zero-sized groups correspond to adjacent bars or a bar at an endpoint. For $n=4,r=3$, there are $\binom62=15$ solutions. If all $x_i\ge1$, subtract one from each variable, leaving total $n-r$ and giving $\binom{n-1}{r-1}$ when $n\ge r$.

Upper bounds such as $x_i\le2$ are not built into the unrestricted formula. Handle them by inclusion–exclusion or generating functions. The method counts indistinguishable objects assigned to labeled bins; distributing distinct objects produces a different problem.

## The binomial theorem

In expanding $(x+y)^n$, each of the $n$ factors contributes either $x$ or $y$. To produce $x^ky^{n-k}$, choose the $k$ factors contributing $x$, giving coefficient $\binom nk$. Therefore

$$ (x+y)^n=\sum_{k=0}^n\binom nkx^ky^{n-k}.$$

At $x=y=1$, it gives $\sum_k\binom nk=2^n$, another count of all subsets. At $x=1,y=-1$ for $n\ge1$, it gives equal numbers of even- and odd-sized subsets. A direct bijection toggles one designated element, changing subset parity and reversing itself.

Pascal's identity $\binom nk=\binom{n-1}k+\binom{n-1}{k-1}$ follows by splitting committees according to whether they include a designated person. The two cases are disjoint and exhaustive. This explanation proves the identity and reveals why the indices have their particular offsets.

## Card-hand examples

A five-card hand from a standard 52-card deck is an unordered subset, so there are $\binom{52}5=2{,}598{,}960$ hands. A four-of-a-kind hand chooses the rank in thirteen ways, takes its four suits, and chooses a fifth card from the remaining forty-eight, giving $13\cdot48=624$.

A full house chooses the triple rank, its three suits, a different pair rank, and its two suits:

$$13\binom43\cdot12\binom42=3744.$$

Two pairs choose the two ranks without ordering them, choose two suits for each, and choose a kicker rank outside those two and one of four suits:

$$\binom{13}2\binom42^2\cdot11\cdot4=123{,}552.$$

Using $13\cdot12$ instead of $\binom{13}2$ would double-count which pair is called first. The kicker rank restriction prevents turning a two-pair hand into a full house or three-of-a-kind pattern.

A five-card hand containing every suit has suit counts $2,1,1,1$. Choose the doubled suit, two of its thirteen cards, and one card in each other suit: $4\binom{13}2 13^3=685{,}464$. These examples are counting models; probabilities follow only after a uniform random-hand assumption is stated.

## Pigeonholes and equal subset sums

If $n$ objects occupy $m>0$ boxes, some box contains at least $\lceil n/m\rceil$ objects. Otherwise each box would contain strictly less than the average needed to hold all $n$. In particular, more objects than boxes force a collision.

Among thirteen integers, two have the same remainder modulo twelve. Their difference is divisible by twelve. This proves existence without identifying the pair. Among $n+1$ integers, two prefix sums of a sequence can share a remainder modulo $n$, yielding a contiguous block with sum divisible by $n$ when the prefix-sum construction has the appropriate $n+1$ entries.

For $k$ positive integers each at most $M$, there are $2^k$ subsets but only $kM+1$ possible sums from zero through $kM$. If $2^k>kM+1$, two distinct subsets have equal sums. Removing their common elements gives disjoint subsets with equal sums; positivity ensures neither remaining subset can be empty unless both were, which would contradict distinctness. The proof guarantees a collision but does not itself find one efficiently.

Hair-count examples in the source use an assumed finite maximum hair count and a larger population to force equal counts. The logic depends on the bound; it does not require knowing the actual counts of individual people. The mathematical lesson is finite classification, not a biological estimate.

## Encoding a hidden card

Five selected cards include two of the same suit by pigeonhole. Arrange ranks cyclically. Of the two directions between distinct ranks, one has distance one through six. Reveal the starting card first and hide the card that lies that many forward steps away. Their common suit communicates the hidden suit.

The other three revealed cards have $3!=6$ orderings. Fix a public total order of cards and use those six permutations to encode the distance. For example, if the first revealed card is the seven of a suit and the last three cards encode distance four, the hidden card is the jack of that suit. The method combines a guaranteed same-suit pair, a modular rank distance, and a six-message channel.

A different existence proof models hands as left vertices and ordered four-card displays as right vertices. Each five-card hand has $5\cdot4!=120$ possible displays; each display belongs to forty-eight five-card hands. Degree counting establishes Hall's condition, so a unique-display encoding exists. The argument extends in principle to a 124-card deck, where the right degree becomes 120. It does not automatically give a memorable practical encoding.

For four selected cards with only three displayed, there are $\binom{52}4=270{,}725$ possible hands but only $52\cdot51\cdot50=132{,}600$ displays. No injection exists, so some display cannot uniquely identify the hand. The assistant's ability to choose which card to hide does not defeat the overall information bound.

## Inclusion–exclusion

For three finite sets,

$$|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|.$$

An element in exactly two sets is initially counted twice and subtracted once. An element in all three is counted three times, subtracted three times, then added once. The general formula alternates over nonempty intersections. An element in $r$ sets has net coefficient $\sum_{j=1}^r(-1)^{j+1}\binom rj=1$ by the binomial theorem.

Among integers one through one hundred, multiples of two number fifty, multiples of three number thirty-three, and multiples of six number sixteen. The union has $50+33-16=67$, so thirty-three numbers are divisible by neither. The intersection uses the lcm, not the product unless divisors are coprime.

To count permutations with no fixed point, exclude events $A_i$ that position $i$ is fixed. An intersection of $k$ designated fixed-position events leaves $(n-k)!$ permutations. Therefore the number of derangements is

$$D_n=\sum_{k=0}^n(-1)^k\binom nk(n-k)!
=n!\sum_{k=0}^n\frac{(-1)^k}{k!}.$$

The same principle counts strings containing forbidden substrings, but overlap must be handled explicitly. For example, occurrences of `00` can overlap in `000`; treating occurrence events as disjoint would fail. Small finite enumeration is a useful verification aid for such formulas.

Euler's totient formula follows by excluding numbers divisible by each distinct prime factor of $m$. Every intersection associated with primes $p_{i_1},\ldots,p_{i_j}$ contains $m/(p_{i_1}\cdots p_{i_j})$ residues in a complete residue system. Factoring the inclusion–exclusion expansion yields $m\prod_{p\mid m}(1-1/p)$, as used in Chapter 08.

## Combinatorial proofs

A combinatorial proof counts one well-defined collection in two ways. For instance,

$$\sum_{k=0}^n k\binom nk=n2^{n-1}$$

counts a committee with one distinguished chair. On the left, choose committee size $k$, the committee, then its chair. On the right, choose the chair first in $n$ ways and independently decide membership for the other $n-1$ people. The formula requires $n\ge1$ in this form.

Vandermonde's identity $\sum_k\binom ak\binom b{r-k}=\binom{a+b}r$ counts an $r$-person committee from disjoint groups of sizes $a,b$, splitting by the number selected from the first group. Define out-of-range binomial coefficients as zero to write the sum compactly. The proof explains both the range and the multiplication.

## A constrained stars-and-bars example

Count nonnegative solutions of $x+y+z=7$ with each variable at most three. Without upper bounds there are $\binom92=36$ solutions. If $x\ge4$, write $x'=x-4$; the remaining equation has total three, giving $\binom52=10$ solutions. The same count applies to each variable. Two variables cannot both be at least four because their sum would already exceed seven. Thus the answer is $36-3\cdot10=6$.

The six solutions are permutations of $(3,3,1)$ and $(3,2,2)$, three of each. Listing them independently confirms the formula and explains why two different-looking construction methods agree. A finite check is particularly useful for an inclusion–exclusion calculation because sign and intersection errors often survive a purely symbolic simplification.

## Counting forbidden substrings exactly

For binary strings of length four, count those containing at least one pair of consecutive zeros. Let $A_i$ mean positions $i,i+1$ are both zero for $i=1,2,3$. Each event has four strings. The intersections $A_1\cap A_2$ and $A_2\cap A_3$ each have two strings because they force three consecutive zeros. The intersection $A_1\cap A_3$ has one string, all zeros. The triple intersection also has that one string. Inclusion–exclusion gives $12-5+1=8$.

The complement therefore has eight strings. It can also be counted recursively: valid strings either end in one after any shorter valid string, or end in a one followed by zero after a valid prefix two positions shorter, with initial cases handled separately. This connects counting to Fibonacci-type recurrences. The same collection can often be studied by direct construction, recurrence, generating function, or inclusion–exclusion; choose the representation that makes the constraint simplest.

## Why unordered selection is not always a division problem

Suppose a bag contains repeated labels and we record only the visible label pair selected. Different pairs of physical objects can produce the same visible pair in unequal numbers. Dividing a count of physical pairs by two for order does not remove differences in label multiplicity. First decide whether objects are individually distinguishable or identified by type. Then determine what equivalence relation turns one description into another.

This issue also appears in probabilistic sampling. Uniformly selecting physical objects does not necessarily induce a uniform distribution on visible patterns. A type with many physical representatives receives more probability. Counting the number of patterns and treating them as equally likely silently changes the experiment. The next chapters repeatedly use this distinction between elementary outcomes and summaries of outcomes.

## A second double-counting argument

In a bipartite graph, count edge incidences from each side to recover the degree-sum identity. More generally, counting incidences between objects and features can produce identities that are hard to see algebraically. For committees, distinguish a chair and a deputy. Choosing their ordered identities first gives $n(n-1)2^{n-2}$ committees with two distinguished members, for $n\ge2$. Choosing committee size first gives $\sum_k k(k-1)\binom nk$. The two expressions are equal because they count the same structured object.

Notice that a chair and deputy are different roles, so their selection is ordered. Replacing $k(k-1)$ with $\binom k2$ would instead count an unordered distinguished pair and halve both sides. The story is a way to keep role distinctions explicit; the resulting identity follows from a bijection between two descriptions.

## Auditing a counting solution

Ask four questions before accepting a formula. What is one object being counted? Does every valid object arise from the construction? Can one object arise in more than one way? If so, is the multiplicity constant and correctly removed? A fifth useful check is whether the expression behaves sensibly at boundary values, including zero selections and selecting everything.

For example, a committee count should be one when the committee is empty and one when it includes the whole population. A password count may be zero if a no-repetition length exceeds the alphabet size. A formula with factorials of negative integers is not a signal to invent those factorials; it is a signal that the case conditions were omitted. State a piecewise result or a convention such as out-of-range binomial coefficients equal zero.

The counting lab computes these finite counts and can enumerate small cases independently. **13-A.** Count three-person committees from eight people. **13-B.** Count arrangements of MISSISSIPPI. **13-C.** Count nonnegative solutions of $x+y+z=7$. **13-D.** Count numbers one through sixty divisible by two or five. **13-E.** Prove $\binom nk=\binom n{n-k}$ by a bijection. **13-F.** Explain why dividing by a symmetry count requires constant multiplicity.
