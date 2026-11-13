# Physics from First Principles

A beginner-first physics textbook and course, inspired by the Feynman lectures, with mathematics taught when needed.

## Start reading

Open [the offline reader and experiments](companion/index.html), or [the continuous HTML textbook](book.html). Both work without an internet connection. The [study sequence](curriculum.md) explains pacing and prerequisites. Begin with Chapter 01 and keep the course folders together.

The package contains 28 chapters; eight original practice problems per chapter; separate hints and worked solutions; 23 interactive numerical experiments; laboratory and capstone instructions; source and Feynman coverage records; and verification evidence. The editable single-volume text is [book.md](book.md). The intended learner needs no prior algebra or calculus.

The coverage targets the undergraduate core and selected bridges to graduate work. Mastery requires sustained problem solving, feedback and actual laboratory/research experience. No book guarantees degree equivalence or freedom from error.

## Files

| Item | Use |
| --- | --- |
| [preface.md](preface.md) | How to learn from the course |
| [curriculum.md](curriculum.md) | Reading sequence, math map, milestones and projects |
| [chapters/](chapters/) | Canonical numbered teaching chapters |
| [solutions/](solutions/) | Hints and complete reasoning, separate from questions |
| [coverage.md](coverage.md) | Relationship to Feynman and undergraduate subjects |
| [sources.md](sources.md) | Inspection status and source provenance |
| [glossary.md](glossary.md) | Notation and central definitions |
| [verification.md](verification.md) | Checks, evidence and limitations |

## Optional rebuild and serving

No setup is needed to read or use experiments. To rebuild after editing Markdown, use Node.js with the included local renderer libraries: from this folder run `node scripts/build.mjs`. No package download is required. The build regenerates the book, reader pages and experiment catalog from canonical files. Run `node checks/models.cjs` for numerical model checks. Run `node companion/server.mjs` if you prefer a local address, then open [the local reader](http://127.0.0.1:4187). Stop that optional server with Ctrl+C. It binds only to the local computer.

The build and numerical checks were run with the Node version recorded in verification evidence. Python is used only for authoring audits, token counts and ZIP packaging; readers do not need it. The exact token-counter dependency is tiktoken 0.14.0, encoding cl100k_base. Renderer dependencies and licenses are recorded in [NOTICES.md](NOTICES.md). None of the supplied Feynman PDF, extracted source text, account information, or unrelated workspace files is redistributed.
