# Operating runbook template

Replace each bracketed field with the actual nonsecret value. This is a template, not evidence of an executed deployment.

## Service and ownership

Purpose: [supported behavior]. Owner: [team/process]. Account/region: [verified scope]. Terraform root: [path]. Backend/key/workspace: [exact scope]. Source/module/CLI/provider baseline: [versions]. Runtime artifact identity: [digest/release].

## Normal change

Entry point: [pipeline]. Who may plan/apply/approve: [authority]. Where the protected plan is reviewed: [location]. State concurrency key: [identity]. Expected probe: [URL/behavior/release]. Relevant costs and retention: [categories/decision].

## Diagnosis

For each common symptom, record the next discriminating observation and authorized operator: backend initialization, wrong account, lock ownership, partial apply, route mismatch, invocation failure, artifact import error, wrong release, data-access denial, pending database modification.

## Recovery

Freeze-writer procedure: [steps]. State backup/version location: [scope]. Restoration authority: [role/process]. How object IDs and actual infrastructure are reconciled: [procedure]. Separate application/data recovery: [backup, validation, cutover]. Last rehearsal and measured result: [date/evidence or explicitly untested].

## Monitoring and teardown

Alarm/notification owner: [actual configured route]. Response expectation: [process]. Deletion protections: [settings]. Data/log/snapshot/version retention: [decision]. Reviewed destruction path: [steps]. Remaining-resource verification: [inventory]. Backend retirement comes after dependent roots.
