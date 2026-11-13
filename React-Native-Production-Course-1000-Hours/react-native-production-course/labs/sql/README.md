# Supabase SQL lab

Apply the migration to a new Supabase learning project with **Supabase Auth**, not the Clerk text-subject branch. It is intentionally not idempotent: migration tooling should record whether it has run. Never apply it over unrelated tables. It was authored and structurally reviewed, but not executed against Postgres in the course-authoring environment.

Create Alice and Bob through normal auth flows. Using their ordinary sessions, verify owner reads/writes, anonymous denial, cross-user denial, owner-change denial, and a transaction pointing to another owner's account. Verify a transaction cannot use a currency different from its account. Test annotations against cross-owner transaction references.

The migration supports owner-managed **manual** records. Before live bank ingestion, split provider facts into a server-writable model and restrict client editing to annotations. The course does not claim that owner CRUD policies alone prevent an owner from altering their own imported facts. Administrative service clients bypass ordinary RLS and require explicit server authorization.
