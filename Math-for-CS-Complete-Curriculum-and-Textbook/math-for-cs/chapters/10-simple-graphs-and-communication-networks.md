# 10. Simple graphs and communication networks

A graph can model friendship, conflicting exams, available job assignments, or physical links in a network. The same drawing may support different questions: can every job be assigned, how many time slots are needed, or where will traffic collide? Source Chapters 12 and 11 supply the scope. We study simple graph structure before switching networks so the matching and coloring arguments have established prerequisites.

## Simple graphs and the degree sum

A simple undirected graph has a vertex set and edges that are unordered pairs of distinct vertices. No loops or repeated edges are allowed. Adjacency is symmetric. The degree $\deg(v)$ is the number of neighboring vertices. Every edge has two endpoints, so

$$\sum_v\deg(v)=2|E|.$$

This handshaking lemma implies the number of odd-degree vertices is even: modulo two, the degree sum equals the count of odd terms and must be zero. A proposed degree list with exactly three odd entries cannot describe a finite undirected graph.

In a bipartite graph with sides $L,R$, every edge joins the sides. Counting edges from either side gives $\sum_{u\in L}\deg(u)=\sum_{v\in R}\deg(v)$. Therefore the average degrees obey $|L|\bar d_L=|R|\bar d_R$. The source's demographic example is an application of this identity: reported relationship averages cannot be interpreted without group sizes, a consistent relation, and sampling assumptions. The mathematical equality is exact for the defined graph; survey reports need not perfectly measure that graph.

Common graphs include $K_n$, the complete graph with $n(n-1)/2$ edges; a path $P_n$ with $n$ vertices and $n-1$ edges; a cycle $C_n$ for $n\ge3$; and $K_{a,b}$ with all $ab$ possible cross-edges between bipartite sides. The $d$-dimensional hypercube has binary strings of length $d$ as vertices, with an edge when strings differ in one coordinate. It has $2^d$ vertices and $d2^{d-1}$ edges by the degree sum.

## Isomorphism

Two graphs are isomorphic if a vertex bijection preserves adjacency in both directions. Labels and drawing positions do not matter. Equal vertex counts, edge counts, and degree multisets are necessary conditions, not sufficient ones. A six-cycle and two disjoint triangles both have six degree-two vertices, but one is connected and the other is not, so they are not isomorphic.

To prove isomorphism, exhibit the bijection and check all adjacency. To disprove it, find an invariant such as component count, triangle count, or degree pattern that differs. Failure to find a pleasing drawing is not a proof of nonisomorphism.

## Matchings and Hall's condition

A matching is a collection of edges sharing no endpoints. A matching saturating $L$ assigns every left vertex a distinct right neighbor. For $S\subseteq L$, let $N(S)$ be all right vertices adjacent to some vertex of $S$. Necessarily $|N(S)|\ge|S|$ for every $S$: the members of $S$ need that many distinct partners.

Hall's marriage theorem says this condition is sufficient in a finite bipartite graph. A proof uses augmenting paths. Begin with a maximum matching. If a left vertex $u$ is unmatched, follow alternating paths: unmatched edges from left to right and matched edges back from right to left. If an unmatched right vertex is reached, flipping matched status along the path increases the matching, contradiction.

If no unmatched right vertex is reached, let $S$ be the reached left vertices and $T$ the reached right vertices. Every neighbor of a reached left vertex is reached, so $N(S)=T$. Every vertex in $T$ is matched to a reached left vertex, while the initial $u$ is unmatched. Therefore $|S|=|T|+1$, violating Hall's condition. This contradiction proves sufficiency.

For applicants $a,b,c$ and jobs $1,2,3$ with neighborhoods $\{1,2\},\{2\},\{2,3\}$, a complete assignment is $a\mapsto1,b\mapsto2,c\mapsto3$. Checking only individual degrees is insufficient: three applicants each connected only to jobs one and two have positive degrees but fail Hall on the three-applicant subset.

A useful corollary uses degree constraints. If every left vertex has at least $d>0$ incident edges and every right vertex at most $d$, then $d|S|\le$ edges from $S\le d|N(S)|$, proving Hall. More generally use lower left degree $a$ and upper right degree $b$ with $a\ge b>0$.

## Coloring and conflict scheduling

A proper vertex coloring assigns colors so adjacent vertices differ. The chromatic number $\chi(G)$ is the fewest colors possible. A clique of $r$ mutually adjacent vertices forces at least $r$ colors. A greedy procedure uses at most $\Delta+1$ colors, where $\Delta$ is maximum degree: when coloring a vertex, at most $\Delta$ colors are forbidden by already colored neighbors.

Greedy coloring depends on order and need not be optimal. A triangle requires three colors; an even cycle needs two; an odd cycle needs three. A nonempty graph is bipartite exactly when it has no odd cycle. One direction follows because a walk in a two-coloring alternates sides and cannot close after an odd number of edges. For the other, color each connected component by parity of distance from a chosen root. An edge joining equal parities would, by comparing root paths, create an odd cycle.

Exam scheduling uses vertices for courses and edges for shared students. Colors are time slots. This models pairwise conflicts; room capacity or teacher availability requires additional constraints. Graph coloring is useful because its assumptions are explicit, not because every scheduling issue is automatically represented by an edge.

## Connectivity, trees, and spanning trees

A walk may repeat vertices; a path does not. A connected graph has a path between every pair of vertices. Connected components partition vertices by reachability. A graph is $k$-vertex-connected if it has more than $k$ vertices and deleting fewer than $k$ vertices leaves it connected. This measures resilience to vertex failures; edge connectivity is a different measure.

A tree is a connected acyclic simple graph; a forest is an acyclic graph. Between two vertices of a tree there is exactly one path. Existence follows from connectivity. If two distinct paths existed, following their divergence and reunion would create a cycle.

A finite tree on $n\ge1$ vertices has $n-1$ edges. For $n>1$, a longest path has leaf endpoints: an extra neighbor at an endpoint either extends the path or creates a cycle. Remove one leaf and its edge, preserving a smaller tree, then apply induction. A forest with $n$ vertices and $c$ components has $n-c$ edges by summing the tree formula.

Every connected graph has a spanning tree. Repeatedly delete an edge from a cycle; connectivity remains because the rest of the cycle provides an alternate route. The process stops with a connected acyclic graph on the same vertices. Thus every connected $n$-vertex graph has at least $n-1$ edges. A connected graph with exactly $n-1$ edges is already a tree.

Rooting a tree chooses a parent for each nonroot vertex: the next vertex toward the root on its unique path. Children point away from the root; leaves have no children. Rooted terminology adds structure but does not change the underlying edge set. In a one-vertex rooted tree, the root is also a leaf under this convention.

## Minimum-weight spanning trees

Give each edge a real weight. A minimum spanning tree, MST, minimizes total weight among spanning trees. It need not minimize the path between every pair of vertices; shortest-path trees solve a different problem.

The cut property says a minimum-weight edge crossing a cut can be included in some MST. To see why, take an MST $T$ that lacks the chosen edge $e$. Adding $e$ creates a cycle; that cycle contains another cut-crossing edge $f$. Since $w(e)\le w(f)$, replacing $f$ with $e$ preserves spanning-tree structure and does not increase weight. The new tree is also minimum.

Kruskal's algorithm considers edges in nondecreasing weight order and accepts an edge exactly when it connects different current components. The cut property justifies each safe addition. Prim's algorithm grows one tree by selecting the lightest outgoing edge from its vertex set. Tied weights can yield multiple MSTs, so uniqueness requires extra argument.

For a triangle with edge weights one, two, and four, an MST uses one and two, total three. Choosing the two smallest works here; the general algorithm must also avoid cycles. A four-vertex example may have its three smallest edges all within one triangle, so taking the globally smallest $n-1$ edges blindly can leave a vertex disconnected.

## Networks require measurement conventions

A switching network has input terminals, output terminals, switches, and directed connections. A permutation routing problem sends one packet from each input $i$ to distinct output $\pi(i)$. A solution chooses one route for each packet.

Diameter is the maximum, over input/output pairs, of the length of a shortest route. The congestion of chosen routes is the maximum number of their packets that visit one switch. The network's worst-case permutation congestion takes, for each permutation, the best achievable congestion, then the worst permutation. This order of minimization and maximization matters.

Latency in the source's static routing discussion concerns route lengths; real time additionally depends on buffering and a packet schedule. Low diameter does not imply low congestion: many short routes may collide at one central switch. Switch count and switch port size measure cost differently, so count both.

The following source-specific comparison includes the two terminal connection edges. Here $N=2^d$, and congestion is switch-based in the source's model:

| Design | Diameter | Switch count | Worst permutation congestion |
|---|---:|---:|---:|
| Complete binary tree | $2\log_2N+2$ | $2N-1$ | $N$ |
| Directed two-dimensional array | $2N$ | $N^2$ | $2$ |
| Butterfly | $\log_2N+2$ | $N(\log_2N+1)$ | $2^{\lfloor d/2\rfloor}$ |
| Beneš | $2\log_2N+1$ | $2N\log_2N$ | $1$ |

These exact counts apply to the source's layered conventions, not every device marketed under the same network name. Omitting terminals changes path lengths by two; merging boundary switches can change counts.

## Why the designs differ

In a complete binary tree, packets crossing from one half to the other all pass through the root. A permutation can force all $N$ packets through it, yielding congestion $N$. The tree has few switches and logarithmic distance, but centralization creates a bottleneck.

In the directed array, route packet $i$ horizontally along its input row, then vertically down its destination column. A switch handles at most the packet assigned to its row and the packet assigned to its column, yielding congestion at most two. A suitable permutation forces two at a boundary switch, so the worst-case value is exactly two. The price is quadratic switch count and linear path length.

A butterfly has $d+1$ switch columns with $N$ switches each. Each stage resolves one destination-bit choice, giving a unique route from an input to an output. For $N=16$, it uses eighty switches and has diameter six with terminals. The middle stage concentrates combinations of source and target prefixes; the maximum permutation congestion is $2^{\lfloor d/2\rfloor}$, four in this example. The exact lower bound is a source exercise extension; the unique-route bit structure explains the bottleneck mechanism.

## Beneš routing by coloring and induction

A Beneš network combines two butterfly-like halves and offers alternative routes through upper and lower subnetworks. To route a permutation, pair packets that share an input-side choice, and pair packets whose outputs share an output-side choice. These two collections of constraints form a graph on packets; each packet is incident to at most one edge of each kind.

Components are paths, even alternating cycles, or isolated doubled constraints. They can be two-colored. Send one color through the upper subnetwork and the other through the lower. Each input pair splits, and each output pair splits, so no boundary switch is shared by two packets. Within each smaller subnetwork, the induced routing is again a permutation. Induction routes it with congestion one.

The base case with two inputs is checked directly. The recursive step adds one input column and one output column, yielding $2d$ switch columns, $2Nd$ switches, and diameter $2d+1$ including terminals. The argument combines structural recursion, graph coloring, and a routing invariant. It is an example of earlier mathematics becoming a design method.

## Separating several kinds of graph question

A graph can have a spanning tree even when it has many cycles; the spanning tree uses only a selected subset of edges. A minimum spanning tree minimizes total selected weight, while a shortest path minimizes one route. A matching selects disjoint edges rather than connecting every vertex into one component. A coloring labels vertices rather than selecting edges. These different output types are a useful first check when choosing a theorem for an application.

For example, assigning three workers to three jobs asks for a matching, not a spanning tree of the worker–job graph. Connecting four offices with minimum cable asks for an MST when arbitrary chosen links are allowed and reliability requirements do not demand redundancy. Scheduling conflicting exams asks for a vertex coloring. Misidentifying the output structure can lead to a mathematically correct solution of the wrong problem.

## An augmenting-path trace

Suppose $a$ can take jobs one or two, while $b$ can take only job one. A partial matching assigning $a$ to one leaves $b$ unmatched. Greedily refusing to change earlier choices would fail. The alternating path $b,1,a,2$ starts and ends at unmatched vertices and alternates unused and used edges. Flip it to assign $b$ to one and $a$ to two. The matching grows from one edge to two without violating disjointness.

This trace explains why Hall's theorem is more than a count of individual choices. Existing assignments can be rearranged. In the proof, an unsuccessful search builds a whole set of applicants with too few collective neighbors, which is a certificate of impossibility. A successful search supplies a concrete improvement. Both outcomes have interpretable mathematical evidence.

## Why a greedy MST exchange remains safe

At a stage of Kruskal's algorithm, accepted edges form a forest. If a next candidate joins two different components, consider the cut separating one component from the rest. No earlier lighter edge crossing that cut was safely skipped: if it had connected components then, it would have been accepted. The selected edge is therefore a light safe connector for the current structure. The exchange argument shows there is still an MST containing every accepted edge.

The maintained claim is not “the current forest is already a spanning tree.” It is “some optimum can extend the current forest.” This is an invariant about the set of possible completions. Once the forest spans and is connected, the completion is the forest itself, so it is optimal. The pattern is related to the decision-to-search invariant in Chapter 08, though the mathematical objects differ.

## Numerical network comparison

At eight inputs, the tree uses fifteen switches, the array sixty-four, the butterfly thirty-two, and the source-convention Beneš forty-eight. Their diameters are eight, sixteen, five, and seven. Worst permutation congestion is eight, two, two, and one. No single number tells the entire design story: a Beneš spends more switches than the butterfly to obtain route flexibility and eliminate static switch conflicts.

The table's congestion one means selected packet paths are switch-disjoint in the modeled permutation routing, not that every physical network implementation has zero delay under all traffic. Terminal conventions, link bandwidth, switch timing, buffering, and repeated traffic rounds belong to additional engineering models. Precisely stating what a theorem measures makes it more useful, because its conclusion can be carried into a richer model without accidentally claiming more than was proved.

## Practice and companion

The graph lab supports degree counts, bipartite tests, and spanning-tree calculations on small graphs; the network lab compares the displayed source-specific formulas. It does not simulate a hardware packet scheduler or claim those formulas predict physical throughput.

**10-A.** Prove the number of odd-degree vertices is even. **10-B.** Give a bipartite graph with no isolated left vertices but no matching saturating the left side. **10-C.** Explain why a five-cycle needs three colors. **10-D.** Find the MST of a triangle weighted two, five, and six. **10-E.** Compute the four network switch counts at $N=8$. **10-F.** Explain why two matchings' union has no odd cycle of length at least three, and connect this to Beneš routing.
