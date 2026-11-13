# Math for CS: From First Principles to Confident Reasoning

Start with [the curriculum](curriculum.md), then read [the complete textbook with rendered equations](book.html) or its [Markdown source](book.md). You can open `book.html` directly in a browser for reading without starting the companion. The canonical lessons are the numbered files in `chapters/`; the single-volume book contains the same lessons, not a shorter summary.

This is a beginner-oriented, two-semester college study sequence based on all 22 instructional chapters of *Mathematics for Computer Science*, Eric Lehman, F. Thomson Leighton, and Albert R. Meyer, revision 3 March 2017. It adds an algebra bridge, changes the teaching order where prerequisites require it, and supplies original explanations and examples. It is a self-study curriculum, not an accredited course or a replacement edition of the source.

## What is included

- A 32-week curriculum, outcomes, teaching sessions, practice assignments, projects, assessment rubrics, and a slower study option.
- Eighteen substantial teaching chapters, with definitions, derivations, proofs, counterexamples, worked calculations, and optional practice.
- Separate hints and solutions, so practice answers need not be visible while studying.
- A section-by-section source crosswalk and an explicit record of source inspection and limitations.
- An offline browser reader with locally bundled equation rendering and interactive laboratories.
- Readable companion source, mathematical checks, a verification report, and dependency notices.

## Open the reader

Install Node.js 22 or later if it is not already available. In a terminal opened in this extracted folder, run:

```text
node companion/server.mjs
```

Open **http://127.0.0.1:4173/** in your browser. No package installation, account, internet connection, or paid service is needed after extraction. Keep the terminal open while reading. Stop the server with Ctrl+C. The server binds only to this computer and serves only this package. If the port is occupied, run `node companion/server.mjs 4174` and use the corresponding address.

Alternatively read the Markdown files in a reader supporting dollar-delimited LaTeX. Plain text editors show equation source. The included browser reader is the recommended equation-rendering surface. Do not double-click its HTML file: loading chapters uses the local server.

## Learning assumptions

Only arithmetic with whole numbers is assumed. Chapter 01 rebuilds signed numbers, fractions, algebra, exponents, logarithms, inequalities, and summation notation. No calculus or programming background is required. Small amounts of integration used to estimate sums are explained locally. Algorithms are described in plain language; laboratory code is optional reading.

Use 8–12 hours weekly for 32 weeks, or stretch every week into two weeks. Work through equations on paper. Choose practice before opening hints, then compare reasoning with solutions. The assessments are supplied for college-style structure; they are optional for independent study. Source exercise pages offer a larger extension bank; this package does not reproduce or solve every exercise in the 987-page PDF.

See [coverage](coverage.md), [sources](sources.md), [verification](verification.md), and [notices](NOTICES.md) for the exact scope and evidence.
