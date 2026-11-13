# 11. Planarity, faces, and polyhedra

A tangled graph drawing does not prove the graph inherently needs crossings. Planarity asks whether some crossing-free drawing exists. Source Chapter 13 develops a discrete account of embeddings, Euler's formula, edge bounds, coloring, and regular polyhedra. We assume the graph vocabulary, degree sum, and induction arguments already established.

## Graph versus embedding

A graph is planar if it can be drawn in the plane with edges meeting only at shared endpoints. A particular crossing-free drawing is a plane embedding. Curving or rerouting edges can remove crossings without changing adjacency. A drawing of a square with one diagonal is planar; a careless drawing may introduce crossings that are avoidable.

An embedding divides the plane into faces, including the unbounded outer face. A triangle has two faces: interior and exterior. A tree has only one face, even if its drawn edges look like boundaries of narrow regions. Faces belong to an embedding, not to a list of vertex degrees alone.

The sphere offers an equivalent view. Project a crossing-free plane drawing onto a sphere, leaving one point unused. Conversely, remove a point from a spherical face and project to the plane. The face containing the removed point becomes the outer face. “Outer” is therefore a feature of the chosen planar presentation rather than a mathematically privileged face.

## Discrete boundaries and recursive construction

One can record an embedding by a cyclic order of incident edges around each vertex. Following an edge with a consistently chosen side traces a face boundary. A bridge is encountered twice along the boundary of the same face, once on each side. Thus boundary length counts edge-side incidences, not necessarily distinct edges or vertices.

For connected plane graphs, a recursive construction starts with a single vertex, adds an edge to a new vertex without creating a face, or adds an edge between existing vertices along a face to split that face. The new edge's placement matters: an abstract edge between two vertices is not automatically drawable within a particular face if they are not both incident with it.

These operations explain the bookkeeping behind Euler's formula. A leaf addition increases both vertices and edges by one. A face-splitting edge increases edges and faces by one. Both preserve $v-e+f$. Establishing that a claimed combinatorial embedding corresponds to a geometric drawing requires consistent cyclic order and face structure; arbitrary cycle lists are not automatically a valid embedding.

## Euler's formula

For a connected finite plane graph,

$$v-e+f=2.$$

A tree has $e=v-1$ and $f=1$, so the formula holds. For a graph with a cycle, remove one cycle edge. Connectivity stays intact, while the two adjacent faces merge, reducing both $e$ and $f$ by one. Induct on the number of edges outside a spanning tree until the tree case is reached. Reversing the removals proves the formula for the original graph.

For a graph with $c$ connected components, the general formula is $v-e+f=1+c$. One may connect components through the outer face using $c-1$ new edges without creating faces, then apply the connected formula. The face count still includes one outer face for the whole drawing, not one separately counted outer face per component.

For a cube graph, $v=8,e=12,f=6$, giving $8-12+6=2$. For two disjoint triangles, $v=6,e=6,f=3$, giving three, equal to $1+c$ with $c=2$. Counting four faces by giving each triangle its own separate outer face would be the error.

## Edge bounds

Every edge contributes two sides to face boundaries, so the sum of boundary lengths is $2e$. In a connected simple planar graph with $v\ge3$, each face boundary has length at least three, counting repeated bridge sides as needed. Therefore $3f\le2e$. Substitute $f=2-v+e$:

$$3(2-v+e)\le2e\quad\Rightarrow\quad e\le3v-6.$$

The condition $v\ge3$ avoids tiny exceptions: a single edge has two vertices and violates the resulting numerical bound if applied blindly. Simplicity excludes loops and parallel edges that can create face boundaries of length one or two. The bound remains valid for disconnected simple planar graphs with $v\ge3$, by adding noncrossing edges to connect components if necessary.

If the graph is additionally bipartite, it has no odd cycles, so faces in the relevant nontrivial connected case have boundary length at least four. The same argument gives $e\le2v-4$ for simple bipartite planar graphs with $v\ge3$. Trees also satisfy the bound for $v\ge3$ even though their outer boundary may retrace bridges; the small edge cases can be checked directly.

$K_5$ has five vertices and ten edges, exceeding $3\cdot5-6=9$, so it is nonplanar. $K_{3,3}$ has six vertices and nine edges. The general bound allows twelve, so it does not refute planarity. But bipartiteness gives $e\le8$, which nine violates. Different structural information gives a sharper obstruction.

The converse of an edge bound is false. A graph satisfying $e\le3v-6$ may still be nonplanar. Subdividing edges of $K_{3,3}$ adds vertices while preserving nonplanarity and can make the count look sparse. Necessary conditions are not sufficient conditions.

## Low-degree vertices and planar coloring

The degree sum and $e\le3v-6$ give average degree $2e/v<6$, so some vertex has degree at most five. The same applies to every planar subgraph. Deleting a low-degree vertex, coloring the smaller graph inductively, then restoring it proves every planar graph is six-colorable: at most five colors appear among its neighbors, leaving one of six available.

Five-colorability needs extra reasoning when a restored vertex has five differently colored neighbors. A standard proof uses Kempe chains. In an embedding, list the five neighbors cyclically as $v_1,\ldots,v_5$, with colors one through five. Consider the connected component using only colors one and three that contains $v_1$. If it does not contain $v_3$, swap colors one and three throughout that component. This frees color one next to the removed vertex.

If such a two-color path does connect $v_1$ to $v_3$, joining its ends through the removed central vertex forms a separating closed curve. The cyclic positions put $v_2$ and $v_4$ on opposite sides. A colors-two-and-four path between them would have to cross that curve, which is impossible in a planar embedding without using a vertex of incompatible color. Thus their two-color components are separate, and a swap frees color two. Either way, the vertex can be restored using five colors.

The separation step uses the standard plane fact that a simple closed curve divides the plane into inside and outside. This is the geometric lemma underlying the proof, not a consequence of degree counting alone. The four-color theorem is stronger and is stated here as a known theorem; its substantial proof is beyond this introductory treatment, as in the source. A six-color proof is not a proof of four-colorability.

## Regular polyhedra

A convex regular polyhedron has congruent regular polygon faces and the same number of faces meeting at each vertex. Let each face have $p\ge3$ sides and let $q\ge3$ edges meet at a vertex. If there are $v,e,f$ vertices, edges, and faces, incidence counting gives $qv=2e$ and $pf=2e$.

Substitute $v=2e/q$ and $f=2e/p$ into Euler's formula:

$$\frac{2e}{q}-e+\frac{2e}{p}=2,
\qquad\frac1p+\frac1q=\frac12+\frac1e>\frac12.$$

Since $p,q\ge3$, if either is at least six while the other is at least three, the reciprocal sum is at most one half. Both must lie between three and five, and testing the possibilities leaves $(p,q)=(3,3),(4,3),(3,4),(5,3),(3,5)$.

| Faces have $p$ sides | $q$ meet at a vertex | $v$ | $e$ | $f$ | Solid |
|---:|---:|---:|---:|---:|---|
| 3 | 3 | 4 | 6 | 4 | Tetrahedron |
| 4 | 3 | 8 | 12 | 6 | Cube |
| 3 | 4 | 6 | 12 | 8 | Octahedron |
| 5 | 3 | 20 | 30 | 12 | Dodecahedron |
| 3 | 5 | 12 | 30 | 20 | Icosahedron |

The arithmetic limits possible incidence patterns. To finish classification, actual geometric constructions establish these five exist. Necessary integer solutions alone would not establish realizability for an arbitrary geometric classification problem. Convexity and regularity are essential: nonconvex or irregular polyhedra are not constrained to this list.

Duality exchanges vertices and faces, swapping $p$ and $q$. It pairs cube with octahedron and dodecahedron with icosahedron; tetrahedron is self-dual. This is why the table has a symmetric structure. It is a relationship between incidence patterns, not merely a visual resemblance.

## Minors and subdivisions

A graph minor is obtained by deleting vertices, deleting edges, and contracting edges. Contracting merges adjacent endpoints, followed by removing loops or duplicate edges if working with simple graphs. Planarity is preserved by these operations: a contracted edge can be shrunk within its drawing without creating a crossing.

Wagner's theorem states a finite graph is planar if and only if it has neither $K_5$ nor $K_{3,3}$ as a minor. Kuratowski's theorem instead states that planarity is equivalent to containing no subgraph that is a subdivision of either forbidden graph. A subdivision replaces edges by internally vertex-disjoint paths. The source labels its minor statement “Kuratowski”; we separate the two conventional forms to avoid a terminology error.

Both characterizations are stronger than edge-count tests. Their full proofs are outside our scope, as they are outside the source's introductory exposition. To show nonplanarity in an example, exhibiting a forbidden minor or subdivision is a valid certificate using the stated theorem. To show planarity, provide a crossing-free embedding; merely failing to spot a forbidden structure is not enough.

## Counting face boundaries with bridges

Draw a triangle and attach one extra leaf to one triangle vertex. There are four vertices and four edges. The embedding has the triangle's interior and a single exterior, so there are two faces. Euler gives four minus four plus two equals two. The interior boundary length is three; the exterior boundary follows the triangle's three sides and traverses the leaf edge out and back, giving length five. The total is eight, equal to twice the edge count.

This example shows why a face boundary need not be a simple cycle. Treating every boundary as a list of distinct edges would undercount bridges. It also shows why the degree of a face in the counting proof means the number of incident edge sides, including repeated incidences. A definition that looks fussy is protecting the theorem from a concrete edge case.

## Applying the disconnected formula

Take a square cycle and a separate isolated vertex. The graph has five vertices, four edges, two faces, and two components. Its Euler quantity is three, equal to one plus the component count. Add an edge from the isolated vertex to the square through the outer face. The component count falls to one, the edge count rises to five, and the face count remains two. The connected formula now gives two.

An isolated vertex does not divide a face into two. A bridge between components also does not create a new face. Only an edge that closes an appropriate cycle in an embedding splits a region. These observations supply the geometric meaning behind the algebraic adjustments, so the formulas need not be memorized as unrelated cases.

## Edge bounds can be tight

A planar triangulation has every face bounded by three edge sides, so equality holds in the general edge bound. Starting from a triangle, place a new vertex inside a triangular face and connect it to its three corners. This adds one vertex, three edges, and two net faces while preserving a triangulation. At each stage the equality $e=3v-6$ remains true.

Thus the coefficient three cannot be uniformly reduced for all simple planar graphs. A bipartite quadrangulation similarly motivates the coefficient two in the bipartite bound. Tight examples distinguish a bound that is merely convenient from one that captures the best possible universal scale. The source's graph-counting methods repeatedly pair an inequality proof with an example showing its sharpness.

## Planarity as a certificate problem

If someone supplies a crossing-free drawing, verifying its intended graph and absence of crossings is a direct route to establishing planarity. If someone supplies a forbidden minor, verify the sequence of deletions and contractions. Each operation is small and explicit, so the claimed obstruction can be checked locally. A long unsuccessful search for either type of certificate proves neither side by itself.

Subdividing an edge adds a degree-two vertex along it. The drawing can follow the same curve, so it preserves planarity in both directions: a planar subdivision can be smoothed at the added degree-two vertices to recover a planar drawing of the original. This explains why sparse subdivisions of nonplanar graphs remain nonplanar even when their edge-to-vertex ratios pass a simple bound.

Contraction differs from subdivision. It can create adjacency between the merged vertex and many neighbors, while a subdivision merely stretches an edge through extra degree-two vertices. The two forbidden-structure theorems organize different operations. Learning the definitions before using the names prevents the source's terminology shortcut from becoming a conceptual confusion.

## Why coloring uses the embedding

The six-color argument depends only on the existence of a low-degree vertex in every subgraph. The five-color argument also uses the cyclic order around that vertex and separation in the plane. A nonplanar graph may have the same local degrees but allow the alternating color paths to cross without contradiction. The improvement from six to five is therefore not a clever counting trick alone; it uses additional geometric information.

This is a useful guide for proof discovery. If a purely numerical argument stops one step short, inspect which structural information has not yet been used. Conversely, when a proof invokes planarity, identify the exact place where a crossing-free embedding matters. An unused hypothesis may signal either a stronger theorem or a missing justification in the intended proof.

## A useful boundary of the theory

Euler's formula in this form describes plane or sphere embeddings. Drawing a graph on a torus can change the relationship between vertices, edges, and faces because the surface has a handle. A nonplanar graph may admit a crossing-free drawing there. This does not contradict the planar theorem: the ambient surface is one of its hypotheses.

Similarly, an edge crossing in a physical wiring diagram may be harmless if wires occupy different layers, but the graph-theoretic question still asks for one plane. The abstraction is useful when the application matches it. Before translating a mathematical impossibility into an engineering impossibility, identify which geometric restrictions the real system actually imposes.

When applying Euler's formula, record components and the outer face before calculating. These two small bookkeeping choices account for many apparent contradictions in otherwise correct graph drawings.

## Laboratory and practice

The planar lab checks Euler's arithmetic and edge-bound obstructions for chosen counts. It deliberately reports “not ruled out” when an inequality passes. It does not claim that three numbers determine planarity. The graph lab supplies small structures you can draw and examine by hand.

**11-A.** Find $f$ for a connected plane graph with $v=10,e=15$. **11-B.** Use an edge bound to refute planarity of $K_6$. **11-C.** Explain why the ordinary edge bound alone fails to refute $K_{3,3}$. **11-D.** Derive the cube's counts using $p=4,q=3$. **11-E.** State the difference between a graph, a plane embedding, a minor, and a subdivision. **11-F.** Explain which step in the six-color proof cannot immediately be reused with only five colors.
