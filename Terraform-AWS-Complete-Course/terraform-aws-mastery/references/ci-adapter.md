# CI adapter contract

The portable implementation is [pipeline.py](../scripts/pipeline.py). It is executable locally and in a runner with Terraform 1.17.2 and Python 3.12+. No hosted workflow is activated by this package.

1. Untrusted checks: no cloud identity; format, standard-library tests, local built-in Terraform tests, mocked module tests. Review dependency downloads and executable source.
2. Protected plan: approved source; explicit backend/root/account/region; scoped temporary identity; selected provider lock; tested package bytes; fresh protected output directory; run the plan command.
3. Review: show destination, source/run identity, meaningful actions, replacements/deletions, policy result, package/plan digests, and probe/recovery plan. Keep secret-containing JSON protected.
4. Authorization: actual platform approval bound to this artifact/run, with available repository/environment protections verified in settings.
5. Apply: same source and artifacts; verified applying role; one concurrency key per state; backend locking; apply the saved plan through the manifest consistency check.
6. Observe: expected release and change-specific service checks; preserve narrow protected evidence; diagnose partial failure with current state.

Example local entry points from the course root:

~~~powershell
python scripts/pipeline.py plan --root labs/00-local --out .runs/review-01
python scripts/pipeline.py apply --manifest .runs/review-01/manifest.json --approve ACTUAL_REVIEWED_PLAN_DIGEST
~~~

The digest placeholder must be replaced after reviewing the actual artifact. The script does not authenticate reviewers or cloud trust, sign manifests, configure branch protection, or provide a universal security policy. A protected runner and artifact store supply those trust boundaries. Hash consistency alone cannot defeat an attacker who controls both artifact and expected digest.

If adopting GitHub Actions, consult the primary OIDC, environment, AWS credentials, and setup-Terraform references in the source ledger. Pin reviewed action revisions under your organization policy; no moving action tags or invented commit hashes are distributed as supposedly pinned dependencies here. Other CI systems can call the same portable stages with equivalent identity and approval controls.
