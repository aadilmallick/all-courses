# 06. State machines, invariants, and recursive objects

A computation changes over time. A proof about its final answer must explain what remains true as intermediate states change, and why a final state is ever reached. A recursively built object poses a related question: what remains true each time a constructor adds another piece? Source Chapters 6 and 7 connect these ideas through induction.

## States and transitions

A state records all information relevant to the modeled process. A transition is an allowed change from one state to another. Initial states specify where runs may begin. A run is a finite or infinite sequence in which each consecutive pair is an allowed transition. A reachable state occurs after finitely many transitions from an initial state.

Consider transferring tokens between two boxes. A state is $(a,b)$ with $a,b\in\mathbb N$. Initially $(a,b)=(5,3)$. A legal move transfers one token from a nonempty box to the other. The total $a+b$ changes neither when $(a,b)$ becomes $(a-1,b+1)$ nor when it becomes $(a+1,b-1)$. Thus a state with total nine is unreachable from the initial total eight.

The model deliberately ignores token colors and transfer duration. If either affected legality or the property being proved, the state would need to include it. A state description that omits relevant information can make an apparent invariant meaningless. Modeling comes before algebra.

## The invariant principle

An invariant is a predicate $I(s)$ true in every reachable state. A standard proof establishes initialization, $I(s)$ for every initial state, and preservation, $I(s)\Rightarrow I(s')$ for every allowed transition $s\to s'$. Induction on the number of transitions then proves reachability implies $I$.

For the token example, $I(a,b)$ is $a+b=8$. Initialization is $5+3=8$. Preservation follows by cancellation of the transferred unit. Notice that an invariant need not characterize all reachable states. It may give a necessary condition only. In more constrained machines, some states satisfying $I$ may still be unreachable.

To prove a desired property, choose an invariant strong enough to imply it at termination. “All counters are integers” may be true but too weak to prove a computed gcd is correct. Useful invariants often express a relationship between changing variables and fixed original inputs.

## Euclid as a state machine

For nonnegative integers $A,B$, not both zero, use state $(a,b)$ initialized to $(A,B)$. While $b>0$, replace it by $(b,a\bmod b)$. The invariant is $\gcd(a,b)=\gcd(A,B)$.

Why is it preserved? Write $a=qb+r$. Any common divisor of $a,b$ divides $r=a-qb$. Conversely, a common divisor of $b,r$ divides $a=qb+r$. The two pairs therefore have exactly the same common divisors and the same greatest common divisor. At termination $b=0$, so $\gcd(a,0)=a$, giving the intended answer.

For $(A,B)=(84,30)$, the states are $(84,30)$, $(30,24)$, $(24,6)$, $(6,0)$. The invariant establishes that six is the gcd. The separate fact $0\le a\bmod b<b$ shows that the second coordinate strictly decreases whenever a move occurs. It is a nonnegative integer, so the machine terminates.

This separates partial correctness, “if the algorithm terminates, its result is correct,” from termination. Total correctness combines both. A machine can preserve an excellent invariant forever without finishing. For example, transferring a token back and forth preserves the total but loops.

## Ranking functions and hidden assumptions

A ranking function maps each nonterminal state to a nonnegative integer and strictly decreases at every step. Such a function proves no infinite run exists. It need not equal elapsed time or the number of remaining steps; it merely supplies a well-founded order.

For a loop with counter $i$ increasing until $i=n$, use rank $n-i$ while $0\le i\le n$. If the transition can increase $i$ by two and overshoot, that rank or loop condition needs revision. For nested loops, a lexicographic pair may work when one counter resets after the other decreases. Alternatively encode a bounded pair as one integer using a known bound on the inner counter.

Arithmetic overflow is outside an unbounded-integer model. If a program uses fixed-width counters, an increment can wrap around, invalidating monotonicity. The mathematical proof is conditional on the modeled arithmetic. This is a modeling limit, not an invitation to omit useful proofs.

## Stable matching

Suppose two equally sized groups each have a strict ranking of all members of the other group. A matching pairs each member with one partner. A blocking pair consists of two people not paired together who each prefer the other to their assigned partner. A matching is stable if it has no blocking pair. Stability does not mean everyone receives a first choice or total satisfaction is maximized.

Deferred acceptance proceeds as follows. An unmatched proposer applies to the highest-ranked receiver not yet approached. A receiver keeps the preferred of the new proposer and any current tentative partner, rejecting the other. Engagements remain tentative until no proposer is unmatched.

The process terminates after at most $n^2$ proposals because no ordered proposer–receiver pair repeats. An unmatched proposer cannot have exhausted all receivers while some receiver remains unmatched: every approached receiver retains some proposer thereafter, so exhausting all $n$ receivers would imply all are holding partners. Thus the final matching is complete under the equal-size, complete-list assumptions.

To prove stability, suppose proposer $p$ and receiver $r$ form a blocking pair. Since $p$ prefers $r$ to the final partner, $p$ must have approached $r$ earlier. Receiver $r$ rejected $p$ immediately or later. Receivers' tentative partners only improve in their ranking, so the final partner of $r$ is preferred to $p$. This contradicts blocking. The invariant “a receiver never trades down” is the central mechanism.

For two proposers $a,b$ both ranking $x$ before $y$, let $x$ rank $b$ before $a$ and $y$ rank $a$ before $b$. If $a$ first approaches $x$, $x$ tentatively holds $a$. When $b$ approaches, $x$ retains $b$, and $a$ then approaches $y$. The result $(a,y),(b,x)$ is stable even though $a$ did not receive a first choice.

The proposer-optimality theorem says each proposer receives the best partner available to that proposer in any stable matching. A useful proof lemma is that no rejected proposer–receiver pair can occur in a stable matching. Prove it by considering the first rejection that would violate the lemma. The receiver prefers the retained proposer; that proposer has already been rejected by all more-preferred receivers, which by the first-rejection assumption cannot be its stable partner. Therefore the retained proposer and this receiver would block the supposed stable matching. This proves the lemma and then proposer optimality. Reversing the proposing side can change the outcome.

## Recursive data types

A recursive definition specifies base objects and constructors, and says only objects obtainable by finitely many such applications are included. For arithmetic expressions, a base object might be an integer literal; constructors form $(E+F)$ and $(E\cdot F)$ from expressions $E,F$. Thus $(2+(3\cdot4))$ is valid, while $(2+)$ is not.

Structural induction proves a property for every base object and shows each constructor preserves the property assuming it for the immediate component objects. It is induction on construction, often equivalent to induction on the number of constructor applications. Unlike ordinary induction, the step may have several subobjects rather than one previous index.

For binary expression trees, define the number of leaves $L$ and internal nodes $I$. A literal has $L=1,I=0$. Joining two expressions under a binary operator yields $L=L_1+L_2$ and $I=I_1+I_2+1$. If $L_j=I_j+1$ holds in the children, then $L=I_1+I_2+2=I+1$. Hence every such expression has one more leaf than binary operator. The theorem would change if unary operators were allowed; constructor assumptions matter.

## Matched brackets and prefix balance

Define a language of balanced parentheses by: $\varepsilon$ is balanced; if $S,T$ are balanced, then $(S)T$ is balanced; nothing else is balanced. Examples are $()$, $(())$, and $()()$. The string $)( $ without its displayed space is not balanced even though its counts of opening and closing symbols agree.

For any prefix, define balance as openings minus closings. A balanced string has total balance zero and every prefix balance nonnegative. Structural induction proves necessity. The base string has zero balance. In $(S)T$, the initial opening provides one unit of buffer while traversing $S$, the matching closing restores zero, and $T$ then behaves as a balanced suffix.

For sufficiency, take a nonempty string with those numeric properties. Its first symbol must be an opening. Find the first later position where balance returns to zero; it exists because final balance is zero. The enclosed substring $S$ and remaining suffix $T$ each satisfy the same conditions and are shorter. Strong induction makes both balanced, so the original string $(S)T$ is balanced by the constructor. This proves the syntactic and numeric characterizations equivalent.

The first-return choice also supports unique parsing in this grammar. A grammar with arbitrary concatenation $ST$ as a constructor can give multiple construction histories for the same string. Recursive syntax and a unique tree representation are related but distinct claims.

## Recursive functions and evaluation

Define expression evaluation recursively: a literal evaluates to its numeric value; $E+F$ evaluates to the sum of child evaluations; $E\cdot F$ evaluates to their product. Define size as one for a literal and one plus the sizes of children for an operator. Each recursive call uses a strictly smaller expression, proving termination.

A second function may transform expressions, for example replacing $E\cdot1$ by $E$. Correctness means the transformed expression has the same evaluation. Structural induction assumes child transformations preserve their values, then uses arithmetic identities to show the parent does too. This separates syntax, meaning, and implementation cost. Two expressions can have the same meaning but different shapes and sizes.

Primitive recursive numerical definitions start from simple functions and use composition and recursion on a natural-number argument. Addition can be defined by $a+0=a$ and $a+(n+1)=(a+n)+1$; multiplication then uses repeated addition. Not every computable function has such a primitive recursive definition; a broader theory of recursion is needed for full computability. The point here is that a well-founded recursive specification supplies both a value and a natural proof method.

## Deriving an invariant for fast exponentiation

Suppose we want $A^N$ for fixed nonzero real $A$ and nonnegative integer $N$. Maintain a state $(r,b,e)$, initially $(1,A,N)$. The intended invariant is $rb^e=A^N$. If $e$ is even and positive, replace $(r,b,e)$ with $(r,b^2,e/2)$. The represented product remains $r(b^2)^{e/2}=rb^e$. If $e$ is odd, replace it with $(rb,b,e-1)$, again preserving the product. When $e=0$, the invariant gives $r=A^N$.

The nonnegative exponent decreases at every operation, proving termination. For $A=3,N=5$, the states can be $(1,3,5)$, $(3,3,4)$, $(3,9,2)$, $(3,81,1)$, and $(243,81,0)$. At each state the product represented by the invariant is 243. The changing variables have different roles: $r$ is accumulated output, $b$ the current power, and $e$ the remaining exponent. Naming those roles makes the invariant easier to discover.

Reducing every multiplication modulo $m$ preserves a congruence invariant instead of an equality. This gives the efficient exponentiation used in Chapter 08. The reasoning is structurally the same, but the algebraic environment changes. The proof must use valid modular multiplication laws rather than silently dividing residues.

## Safety, progress, and reachability

A safety property says something bad never occurs, such as “the balance never becomes negative.” An invariant can prove safety if the initial conditions and every transition preserve it. A progress property says something good eventually occurs, such as “a waiting request receives service.” Invariants alone usually cannot establish progress: a machine may remain forever in a safe state while doing nothing.

Termination is one progress property, established by a ranking function. For nondeterministic or concurrent systems, a transition system can include multiple possible next moves. To claim every run progresses, assumptions about which moves are eventually selected may be necessary. A scheduler that is allowed to ignore a request forever defeats an eventual-service claim even if a servicing transition is always available. We do not assume fairness of scheduling unless stated.

Reachability is also stronger than satisfying a preserved equation. In a machine that adds two to a counter starting at zero, every reachable value is nonnegative and even. The invariant “nonnegative” is true but includes unreachable odd values. The stronger parity invariant rules those out. Selecting a stronger invariant is often how one proves an impossibility that a weaker invariant cannot detect.

## A bracket-processing machine

To test a parenthesis string, scan left to right while maintaining balance. An opening adds one and a closing subtracts one. Reject immediately if balance becomes negative; accept at the end exactly when it is zero. The loop invariant says the counter equals openings minus closings in the consumed prefix and no consumed prefix has negative balance. Each transition preserves the counter relationship, while the rejection rule enforces the prefix condition.

The rank is the number of unread symbols, which decreases by one. At termination, the characterization proved earlier tells us the acceptance condition is equivalent to membership in the balanced language. This is a complete correctness argument combining a state invariant, a termination measure, and an independently established language theorem. Merely counting equal numbers of symbols at the end would miss a closing parenthesis that appears too early.

## Functions on trees and their cost

Evaluation of a binary expression visits each node once if subexpression results are computed once and stored during recursion. With constant-cost arithmetic at each node, the time is proportional to node count. If numeric values become huge, arithmetic may no longer be constant cost; if a tree actually shares repeated subexpressions as a graph, revisiting shared nodes can duplicate work. A proof of value correctness and a proof of runtime require different models, even when they describe the same program.

Structural induction can prove both kinds of claim, but each uses its own predicate. For correctness, the predicate compares returned value with mathematical meaning. For cost, it relates operation count to size. Keeping them separate helps avoid the mistake of treating a correct algorithm as automatically efficient or an efficient-looking routine as automatically correct.

When testing an implementation against an invariant, record the full state before and after every transition. A final correct answer can conceal a broken intermediate relationship that happened to repair itself on one input. Conversely, a failed invariant check may reflect a mistaken proposed invariant rather than a faulty program. The preservation proof helps distinguish those possibilities by stating exactly what the transition is supposed to preserve.

For recursive objects, record the construction tree when a property seems to fail. The relevant induction hypotheses apply to immediate component objects, not arbitrary substrings or unrelated earlier examples. Identifying the constructor at the root often makes both the proof obligation and a parsing error clear.

## Practice and companion

The invariant lab traces Euclid's states and checks their gcd relation; the bracket lab displays prefix balances. A failure to find an invariant violation on selected inputs is evidence about those inputs. The preservation proofs above establish the universal claims.

**06-A.** Trace Euclid on $(105,42)$, stating invariant and rank. **06-B.** Give a machine with a true invariant but an infinite run. **06-C.** Determine whether `(()())()` is balanced by prefix sums. **06-D.** Prove a full binary expression tree with $I$ operators has $2I+1$ total nodes. **06-E.** Explain why deferred acceptance does not allow a receiver to reject a proposer and later accept a less-preferred proposer under strict fixed rankings.
