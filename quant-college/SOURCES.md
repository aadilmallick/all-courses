# Source ledger and research scope

Research date: **November 12, 2026 (America/New_York)**. The user supplied a roadmap naming eight distinct university courses; probability/statistical-estimation entries repeat two of those courses. MIT explicitly links the 2013 predecessor of its 2024 finance-mathematics course, so that archive is included too.

The original textbook teaches major concepts independently. The audit fetched official HTML indexes and content pages, extracted links, and checked download responses. It did **not** read every PDF, watch every video, execute source assignments, or establish that every external reading is free. The original course sequence and available problem sets remain part of the full study program.

Inventory: **1,321 links**, including **401 PDF links**, **100 video links**, **60 data/code links**, and **20 archives**. Navigation/detail pages and optional external readings are also retained. These are link records, not that many independent courses or fully read documents.

There were 482 unique download-response attempts: 478 returned HTTP 200, three failed TLS certificate validation, and one expired signed publisher download returned 403. The signed address was removed and replaced by a stable publisher landing page, whose access is unverified. No certificate verification was disabled. Target response checks do not establish content correctness, license, file integrity, or permanent availability.

## Original course editions

| ID | Course and edition | Instructor/notes | Inspection scope |
|---|---|---|---|
| MIT-15401 | [Finance Theory I — Fall 2008](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/) | Andrew Lo | 79 official HTML pages fetched and link structures inspected; not all linked content read |
| MIT-15433 | [Investments — Spring 2003](https://ocw.mit.edu/courses/15-433-investments-spring-2003/) | Reto Gallati | 53 official HTML pages fetched and link structures inspected; not all linked content read |
| MIT-18642 | [Topics in Mathematics with Applications in Finance — Fall 2024](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) | Peter Kempthorne, Vasily Strela, Jake Xia | 94 official HTML pages fetched and link structures inspected; not all linked content read |
| MIT-18S096 | [Topics in Mathematics with Applications in Finance — Fall 2013](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/) | See official course faculty list | 62 official HTML pages fetched and link structures inspected; not all linked content read |
| MIT-14382 | [Econometrics — Spring 2017](https://ocw.mit.edu/courses/14-382-econometrics-spring-2017/) | Victor Chernozhukov; notes with Ivan Fernandez-Val | 62 official HTML pages fetched and link structures inspected; not all linked content read |
| MIT-14384 | [Time Series Analysis — Fall 2013](https://ocw.mit.edu/courses/14-384-time-series-analysis-fall-2013/) | Anna Mikusheva | 47 official HTML pages fetched and link structures inspected; not all linked content read |
| MIT-15450 | [Analytics of Finance — Fall 2010](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/) | Leonid Kogan | 47 official HTML pages fetched and link structures inspected; not all linked content read |
| STANFORD-EE364A | [Convex Optimization I — Historical SEE archive](https://see.stanford.edu/Course/EE364A) | Stephen Boyd | 1 official HTML pages fetched and link structures inspected; not all linked content read |
| STANFORD-CS229 | [Machine Learning — Historical SEE archive](https://see.stanford.edu/Course/CS229) | Andrew Ng | 1 official HTML pages fetched and link structures inspected; not all linked content read |

## Free core and optional readings

The free core is the original book, local companion, standard-library examples, and freely reachable official course materials. MIT and Stanford course indexes were accessible without an account during inspection. Their syllabi can recommend paid books, papers, or third-party services; those remain optional external references. Coursera trials or partial previews are not used as the foundation. An external game or certificate is not required.

Added foundations include OpenStax algebra/trigonometry; MIT 18.01SC, 18.02SC, 18.06SC; Harvard Stat 110 and its authors' linked free book; official Python/scientific-library documentation; Boyd–Vandenberghe's authors' book page; the ISL authors' resource page; and OTexts FPP3. Added public-data references are FRED, ALFRED, the Kenneth French Data Library, and SEC EDGAR documentation.

Harvard, FRED, ALFRED, and SEC pages could be inspected through browser search/open results when the direct audit client was blocked. This is index inspection, not an API download or validation of a full dataset. SEC access guidance must be checked before a real retrieval job. Data APIs may have keys, access policies, or limitations beyond publicly readable pages.

## Download failures retained for review

- [Understanding Bias in Nonlinear Panel Models: Some Recent Developments.” (PDF)](http://www.cemfi.es/~arellano/arellano-hahn-worldcongress.pdf): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate in certificate chain (_ssl.c:1010)>
- [Efficient Estimation of Models with Conditional Moment Restrictions](https://www.sciencedirect.com/science/article/pii/S0169716105800513): Original expired download returned HTTP 403; no signed query retained
- [Opening the Black Box: Structural Factor Models with Large Cross-Sections](https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp712.pdf): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1010)>
- [On the Fit and Forecasting Performance of New Keynesian Models](https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp491.pdf): <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1010)>

## Reproducibility and rights

Each CSV/JSON record retains its course, title, type, URL, discovery page, access date, and available response evidence. The catalog is a bounded inventory of the official pages fetched, not a guarantee that every nested third-party website, future update, or unlinked resource has been discovered. Follow a course's live index for additions.

No full source PDF, source textbook, video, private attachment, credential, or signed access URL is packaged. Original explanations and synthetic code are distinct from linked source content. Historical MATLAB/R assignments are linked; the included Python examples are original conceptual implementations, not a claim that every original assignment was ported.

Full details: [resource catalog](resources/RESOURCE-CATALOG.md), [CSV](resources/course-resources.csv), [JSON](resources/course-resources.json), [coverage matrix](COURSE-COVERAGE.md), and [notices](NOTICES.md).