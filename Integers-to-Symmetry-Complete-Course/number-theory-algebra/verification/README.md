# Verification evidence

The final reader-facing account is [verification.md](../verification.md). JSON files contain structural and executed-check results. Independent review notes record the text as it was reviewed; minor findings were applied during final integration, as explained in the final account. A review note is not a formal proof certificate.

- `numerical.json`: executed laboratory assertions and runtime version.
- `reference-cases.json`: selected exact examples checked independently with SymPy.
- `structure.json`: final file, length, fence, link and delimiter checks.
- `textbook-validator.json`: the textbook workflow's structural/depth validator.
- `browser.json`: actual browser launch limitation, kept separate from numerical execution.
- `math-syntax.json`: the unavailable TeX-format limitation, kept separate from delimiter checks.
- `review-*.md`: independent mathematical and integration reviews.

Some supplemental verification scripts are present in this directory. They use exact finite examples and do not prove every theorem or every printed numerical statement. The supported learner-facing checks are documented in the root README.
