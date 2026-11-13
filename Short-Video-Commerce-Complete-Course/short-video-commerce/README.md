# From Short Videos to Customers

Start with **index.html** for the full textbook and embedded workbook. It is self-contained and can be opened directly in a modern browser. For editable text use **book.md** or the numbered **chapters/** files. For just the calculators and planning tools, open **companion/index.html**.

## Reading order

| Order | Chapter | Outcome | Proposed total study/practice time |
|---|---|---|---:|
| 1 | [Story and learning](chapters/01-story-and-learning.md) | Write truthful, specific scripts and a repeatable practice plan | 24 h |
| 2 | [Recording clear videos](chapters/02-recording-clear-videos.md) | Record readable vertical demos with clear speech | 24 h |
| 3 | [Editing, tools, and training](chapters/03-editing-tools-and-training.md) | Finish edits; choose one learning path and review AI output | 42 h |
| 4 | [Affiliate marketing and TikTok Shop](chapters/04-affiliate-marketing-and-tiktok-shop.md) | Evaluate terms, demonstrate offers, and configure an eligible route | 30 h |
| 5 | [Owned digital-product funnels](chapters/05-owned-digital-product-funnels.md) | Design ebook, course, Shopify, email, and SaaS routes | 36 h |
| 6 | [Measurement and capstones](chapters/06-measurement-growth-and-capstones.md) | Calculate contribution, diagnose failures, and run a sustainable process | 24 h |
| | **Optional course total** | Production time dominates; estimates vary by learner | **180 h** |

See [curriculum.md](curriculum.md) for sessions and dependencies, [toolkit.md](toolkit.md) for a tool-selection guide, [sources.md](sources.md) for research, and [verification.md](verification.md) for actual checks and limitations. Templates live in [templates/](templates/).

## Run and verify locally

Direct opening requires no installation and makes no network requests. External research links open only when you choose them. If you prefer a local server, install a supported Node.js runtime and run from the extracted project folder:

```bash
node companion/server.mjs
```

Then visit http://127.0.0.1:8765/ for the textbook or http://127.0.0.1:8765/companion/index.html for the workbook. The documented server and tests were executed with Node.js 24.22.1. No npm install or account is needed.

Run the calculation tests:

```bash
node companion/tests.mjs
```

The distributed HTML is built output with scripts and styles embedded. Readable application source is in companion/model.mjs and companion/labs.mjs. The build script uses the host's Marked library; its pinned build record is in dependencies.json. Rebuilding is optional; reading and running the workbook require no build tools.

No live video was filmed, external editor operated, checkout configured, merchant account enrolled, or ad campaign run by this package. Examples teach the work to do in your own accounts. No revenue result is guaranteed.
