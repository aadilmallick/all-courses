# The laboratory

From the extracted course root, run:

```sh
node companion/server.mjs
```

Open <http://127.0.0.1:4173/companion/index.html>. Stop with Ctrl+C. Node.js 18 or later is sufficient; the actual tested version is recorded in the verification report. Nothing is installed, no account is needed, and all experiment code runs locally. Internet access is unnecessary. Opening the HTML directly with a `file:` URL may block ES module imports; use the server. Set `PORT=4174` on macOS/Linux or `$env:PORT=4174` in PowerShell to change the port.

The companion is a calculation laboratory. Read the Markdown chapters in GitHub or a Markdown editor with LaTeX support; this server serves Markdown source rather than rendering a reading website. No PDF or hosted website is included.

| Experiment | Chapters | Actual computation |
| --- | --- | --- |
| Euclid | 2–3 | Extended Euclidean algorithm and exact Bézout coefficients |
| Congruences | 4–5 | General two-modulus CRT, with compatibility check |
| Units | 6–9 | Unit group elements, totient, modular powers, multiplicative order |
| Permutations | 10–12 | Cycle decomposition, parity, order; binary necklaces by Burnside and explicit enumeration |
| Quadratic quotient | 13–16 | Products, powers, norm and inverses modulo a quadratic relation |
| Residues | 17–18 | Legendre symbols, exact square-root lists, and numerical reciprocity check |
| Arithmetic functions | 19 | Divisors, φ, μ, τ, σ and convolution identities |
| Pell | 20 | Exact continued-fraction convergents and integer solution |
| Abelian groups | 21 | Two-factor invariant form and exhaustive element-order histogram |
| Finite fields | 22–24 | Arithmetic and Frobenius in the specified field F₈ |
| Galois | 25–27 | Two curated exact splitting-field correspondences with degree/order checks |
| Primes | 28 | Trial-division prime counts, finite sums/products and tail bound for s > 1 |
| Hensel | 29 | Simple-root lifting of X² − 2, exact modulo p^k |
| Coding | 30 | Polynomial evaluation code and recovery from two known erasures |

Input limits keep calculations responsive and Number-based arithmetic exact for bounded integer cases. Euclid, CRT, modular powers, Pell, and Hensel use BigInt. Prime sums/products are floating-point approximations, explicitly labeled. Reset restores a deterministic initial case. Changing experiments disposes previous form handlers; there are no timers, animations, remote requests, or stored personal data.

The lab does not implement general symbolic Galois-group determination, general Smith normal form, arbitrary finite-field construction, unknown-error decoding, or a primality test for cryptographic-size integers. Its examples support the chapter proofs; finite experiments cannot establish statements about all integers.

To run the numerical checks:

```sh
node scripts/check_companion.mjs
```

The interface source is `labs.mjs`, the shared arithmetic is `math.mjs`, and `app.mjs` handles navigation. The app has no third-party runtime dependencies and no build step: the delivered source is the runnable output.
