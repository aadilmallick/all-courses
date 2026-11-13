# The Useful Creator

**Aadil's practical course in building a software/AI YouTube channel and a sustainable business around it.** Edition: 13 November 2026.

Start with [the readable book](book.html), or [the single Markdown volume](book.md). This is the complete curriculum requested now. A separate personalized strategy report is deliberately left for your later request.

## Your starting plan

The leading hypothesis is **practical AI engineering for developers building useful browser and web tools**. The alternatives are a focused browser-extension channel and ML intuition carried into working code. You will compare them through evidence, then start one channel. The course assumes your confirmed **8–10 hours/week**, screen recordings and occasional face-to-camera. Begin with **one long video every two weeks**, targeting six core videos in the first 90 days.

The $10,000/month model is an illustrative mature **gross revenue** scenario. It distinguishes refunds, fees, operating costs, owner time and taxes. It is not a prediction, take-home amount or deadline. Its 67.5 monthly owner hours exceed your starting capacity; the early plan uses a simpler offer.

## Read and practice in this order

| Chapter | What you learn | Concrete output |
| --- | --- | --- |
| [01 · Positioning](chapters/01-positioning-and-channel-choice.md) | Compare three channel directions and choose a viewer | One-page channel brief and pilot hypothesis |
| [02 · Demand and ideas](chapters/02-demand-and-video-ideas.md) | Research problems and choose from 72 original premises | Ranked backlog and a connected first season |
| [03 · Packaging and creators](chapters/03-titles-thumbnails-and-creators.md) | Learn from Fireship and five other creators; titles, thumbnails, openings | Three complete creative briefs |
| [04 · Scripting](chapters/04-scripting-and-teaching.md) | Teach through a clear demonstration and an original full script | Rehearsed script, claim ledger and shot plan |
| [05 · Filming and audio](chapters/05-filming-and-audio.md) | Record readable screens, comfortable sound and occasional camera segments | Tested recording workflow and short sample |
| [06 · Editing and AI production](chapters/06-editing-and-ai-production.md) | Edit in passes, use a free-first editor and evaluate modern AI tools | Finished video, captions and export |
| [07 · Publishing and growth](chapters/07-publishing-analytics-and-growth.md) | Publish, interpret analytics and design useful experiments | Evidence-based post-publication review |
| [08 · Funnels and offers](chapters/08-funnels-products-and-community.md) | Connect videos to email, notes, tutoring, freelancing and community | One useful free resource and one bounded offer |
| [09 · Economics](chapters/09-economics-and-sustainable-income.md) | Inspect the $10k model, conversion assumptions, costs and capacity | Sustainable scenario using your real constraints |
| [10 · Daily playbook](chapters/10-daily-playbook-and-capstone.md) | Apply the course across 90 days and plan the next season | Six-video capstone and an operating page |

Read chapters 01–03 first, then use 04–07 while making a small video. Study 08–09 before selling. Chapter 10 and the [90 daily actions](templates/90-day-actions.md) turn the lessons into a schedule. Optional practice is not a mandatory quiz. At 8 hours weekly, reduce the 8.5 hour baseline scope; at 10 hours, protect the remaining buffer before accepting paid work.

## Interactive practice

The [practice lab](companion/index.html) contains nine real calculators/worksheets: channel judgment, idea scoring, promise alignment, script timing, production/AI workflow, analytics, funnel stages, business economics and weekly capacity. Chapter 06 shares the production experiment with 05. Models use clearly labeled synthetic assumptions and reset to defaults. Inputs stay in your browser and are not saved or uploaded.

**To run the labs:** install Node.js if it is not already available, open a terminal in this folder, run `node companion/server.mjs`, then open [the local course](http://127.0.0.1:4173/book.html) or [the labs](http://127.0.0.1:4173/companion/). Stop with Ctrl+C. The server listens only on your computer. Static book.html also opens directly without a server; the labs require the server for their catalog and modules. No account, package download or build step is needed to run the included outputs.

The runtime was tested with Node 26.7.0 and the Google Chrome browser. The companion uses standard browser modules, native form controls and Node built-ins. Other Node versions, browsers, assistive technologies, microphones and editor hardware were not comprehensively tested. If port 4173 is occupied, set the `COURSE_PORT` environment variable to another port before starting the server.

## Reusable materials and references

- [Daily action table](templates/90-day-actions.md) and [structured schedule](templates/90-day-actions.json).
- [Business templates](templates/business-templates.md): opt-in copy, offers, scope, validation and economics.
- [Production templates](templates/production-templates.md): video brief, script, shots, recording, edit and review.
- [Resource library](resource-library.md): what to learn, where and when to use it.
- [Project evidence](research/project-profile.md), [growth/creator sources](research/sources-growth.md), [production sources](research/sources-production.md), [business sources](research/sources-business.md).
- [Verification record](verification.md), [depth measurements](checks/depth.json), [third-party notices](THIRD-PARTY-NOTICES.md).

Research distinguishes inspected text, partial extracts, indexes and inaccessible material. Creator studies do not claim full video playback, private analytics or causal proof of success. Vendor capabilities were researched; the recording/editor products were not operated. Platform rules and tool entitlements can change. In particular, the course distinguishes present YPP requirements from announced changes effective 1 February 2027; recheck the official Earn area for your channel.

## Source and rebuild

Chapter Markdown is canonical. `node scripts/build.mjs` regenerates book.md and book.html using the included Marked 17.0.5 parser and license. `node companion/check.mjs` checks the models; `node scripts/verify.mjs` checks package structure, links and lesson depth. Readable companion source is included. The book and examples are original instructional material; external articles, manuals, videos and paid resources are linked, not redistributed. No channel, checkout, email list or public funnel was created by authoring this course.
