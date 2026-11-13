# 04 — Postgres, Supabase, Clerk, and authorization

[Previous](03-state-offline-and-expo-sdk.md) · [Course home](../README.md) · [Next](05-firebase-and-better-auth.md)

**Planned time: 110 hours.** Allocate 16 hours to relational and identity concepts, 28 to the Supabase implementation, 20 to Clerk integration, 26 to isolation and recovery testing, and 20 to applying the chosen track to PocketPilot. Build Supabase Auth and Clerk as alternative identity tracks, not two simultaneously authoritative sessions.

## 1. Separate identity, data, and business authority

Authentication asks who a request represents. Authorization asks what that identity may do. A database stores facts and enforces constraints. A server coordinates privileged workflows. A vendor can supply several of these capabilities, but the responsibilities remain distinct.

Supabase combines Postgres with services including authentication, storage, realtime, and server functions. Clerk specializes in identity and authentication experience; it is not a replacement for a relational database. A common stack uses Clerk for sessions and Supabase for data, but the integration must make Clerk's verified identity visible to database authorization. Simply installing both packages does not accomplish that.

For this capstone, Supabase Auth plus Postgres is the default recommendation because the financial domain is relational and one identity system reduces integration work. Clerk becomes attractive when its sign-in methods, account management, or organization features save enough time to justify another service boundary. This is an architectural judgment based on the course's requirements, not a claim that one service wins every project.

## 2. Model finance relationships before building tables

A user owns accounts. Accounts have transactions. Transactions can be categorized. Budgets apply to categories and periods. Recurring rules describe estimated commitments. These relationships matter because ownership must remain consistent when records refer to each other.

A transaction with `owner_id = Alice` must not reference Bob's account. Checking the owner column on each table independently does not automatically enforce that relationship. Use a composite foreign key or another database constraint that binds the referenced account ID and owner together. Application-level checks can race and can be bypassed by other write paths.

Use stable internal IDs rather than merchant names as keys. Merchant labels can change, contain spelling variants, and collide. Use date-only values for posted accounting dates when that is the provider's semantic value. Use timestamps for events such as ingestion and edits. Do not turn every date into midnight in the phone's current time zone without considering how the value is interpreted.

The initial schema supports one owner per record. Household sharing is a later extension that adds households and memberships. Do not simulate sharing by putting a list of emails in a public profile row. Membership changes need verified identity, invitation rules, roles, and explicit effects on data access.

## 3. Create a constrained Supabase schema

Create a dedicated learning project and use synthetic data. The SQL below is a small complete starting migration for the Supabase Auth track. The packaged SQL lab adds related tables and comments. Apply migrations through your normal development workflow and retain them in Git; dashboard-only changes are difficult to reproduce.

```sql
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  currency text not null check (currency in ('USD','CAD')),
  unique (id, owner_id)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null,
  merchant text not null check (char_length(merchant) between 1 and 200),
  amount_minor bigint not null check (abs(amount_minor) <= 9007199254740991),
  posted_on date not null,
  pending boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (account_id, owner_id) references public.accounts(id, owner_id) on delete cascade
);

create index transactions_owner_date
  on public.transactions(owner_id, posted_on desc, id desc);

alter table public.accounts enable row level security;
alter table public.transactions enable row level security;

create policy accounts_owner on public.accounts
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy transactions_owner on public.transactions
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
```

The UUID owner references Supabase's own user table. `using` controls which existing rows a role may access; `with check` constrains the resulting row for writes. Both matter for updates. The composite foreign key stops a row from pointing across owners even if a future privileged code path forgets an application check.

The `bigint` range is intentionally restricted to values JavaScript can represent safely as integers. Your actual API serialization must still be checked and validated. For larger amounts or arbitrary decimal precision, transport strings and use an appropriate decimal representation. A Postgres type and a JavaScript type are not automatically identical in range or serialization.

For a production bank import, clients should not freely modify provider amounts or posted status. The initial migration is a learning baseline for user-owned manual data. Separate provider-ingested facts from user-editable annotations and restrict write grants or expose controlled functions for sensitive operations. Row-level security is necessary but does not by itself define which columns a legitimate owner may change.

## 4. Understand keys and row-level security together

A Supabase publishable client key identifies the project and public API context. It is expected to be present in the app. A service-role or privileged secret must never be present in the mobile bundle. Client environment variables with `EXPO_PUBLIC_` are compiled into client code; the prefix does not create secret storage.

The user session contributes a verified access token. The database's authorization context evaluates policies against that identity. If row-level security is disabled or a policy is overly broad, hiding the key does not repair the design. If you accidentally use an administrative key in tests, you can bypass policies and falsely conclude that authorization works.

Read the [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) for the current behavior of roles, policies, and helper functions. Test through the same client role used by the app. A SQL editor session with elevated privileges is useful for administration but is not evidence that ordinary users are isolated.

## 5. Initialize the native Supabase client

The official [React Native auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react-native) documents the supported persistence setup. The following follows the AsyncStorage-based learning path and adds the native process lock. For a finance application, evaluate the credential-storage threat model and a supported secure adapter before launch; do not assume AsyncStorage is encrypted.

```sh
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

```ts
// src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !publishableKey) throw new Error('Missing public Supabase configuration');

export const supabase = createClient(url, publishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});
```

This module targets native iOS and Android. A universal web build needs the platform-specific persistence and callback handling documented by the provider. Do not instantiate a new client in every component. A single owned client makes session listeners and refresh behavior easier to manage.

Register foreground-aware token refresh once near the root. Start refresh while the app is active and stop it while inactive according to the current SDK guidance. Return cleanup from your listener. Never attach one listener per screen. A token refresh failure should transition the session appropriately and preserve drafts that can safely survive reauthentication.

## 6. Implement sign-up, sign-in, and session restoration

```ts
import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

Sign-up may require email confirmation and may not immediately create an active session. Model that state explicitly. Tell the user to check their email, allow correction of a mistyped address where supported, and handle expired links. Do not route to private data merely because the sign-up request returned without an error.

A session provider first calls the supported session-restoration method, then subscribes to auth changes. It exposes `ready`, `userId`, and relevant actions to the UI. Clean up the subscription on unmount. Avoid creating a race in which an old restoration response overwrites a newer sign-out event; use an ownership flag or an SDK-supported provider pattern.

For password reset and email links, configure exact allowed redirect URLs for development and production. Test on a cold app launch and after the app is already open. The callback must be handled through the provider's documented flow, including PKCE where used. Do not manually accept an arbitrary access token embedded in a URL just because it looks like a JWT.

## 7. Query and mutate through a typed adapter

Generate database types from your actual schema using the provider CLI or dashboard workflow, then use them in `createClient<Database>`. Generated types must be updated when migrations change. A stale generated file can make a broken query appear correct to the editor.

```ts
import { supabase } from './supabase';

export async function listRecentTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('id,merchant,amount_minor,posted_on,pending')
    .order('posted_on', { ascending: false })
    .order('id', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function createManualAccount(input: { ownerId: string; name: string; currency: string }) {
  const { data, error } = await supabase.from('accounts').insert({
    owner_id: input.ownerId, name: input.name.trim(), currency: input.currency,
  }).select('id,name,currency').single();
  if (error) throw error;
  return data;
}
```

The owner passed by the client must match the authenticated user because the database policy enforces it. The query can omit an owner filter while still being isolated by RLS, although explicit filters can improve clarity and query planning in some designs. Never interpret an empty result as proof that a table has no rows globally; policies may simply hide them.

The API shape uses snake_case database columns. Map them into your camelCase domain model at the adapter boundary. Validate numeric and date serialization. Do not let every UI component implement its own mapping, because small differences eventually produce inconsistent totals.

## 8. Model privileged work as server workflows

Creating a bank link token, exchanging a bank public token, processing a subscription webhook, and deleting an entire account require server authority. A mobile app should request these operations, not hold the administrative credentials that perform them.

A server function verifies the incoming user token using the provider's supported verification mechanism, derives the user ID, validates input, and applies the operation under a least-privileged policy. If the function uses an administrative database client, it must enforce ownership explicitly because that client can bypass ordinary RLS. This is a common place where an otherwise careful app accidentally becomes insecure.

Do not trust an `ownerId` in a request body. If a function accepts an account ID, load that account under the verified caller's ownership before using its provider connection. Rate-limit expensive operations such as bank-link creation and exports. Return a sanitized error category and request identifier rather than provider tokens or raw financial responses.

For workflows that span several database writes, use a transaction or a carefully designed state machine. An account deletion can move through requested, credentials revoked, data removal in progress, and completed states. If a provider temporarily fails, the operation should retry safely rather than leave the UI claiming deletion succeeded while access remains active.

## 9. Storage authorization is separate from table authorization

A receipt image in object storage needs its own access controls. A row that refers to the image does not automatically secure the object. Use a private bucket, a path convention that includes a stable owner or household scope, and storage policies that validate the caller.

Generate short-lived signed URLs only after authorizing access. A signed URL is a bearer capability: someone who possesses it can use it until its validity ends. Avoid putting it into analytics or permanent public documents. Prefer short lifetimes appropriate to the user interaction, and avoid caching it longer than intended.

Validate uploaded content and impose limits. A malicious or accidental huge file can create costs and processing failures. Client-side compression improves UX but is not a security boundary. If an OCR service processes a receipt, the privacy policy must describe the actual data flow, and your server must avoid logging extracted sensitive content unnecessarily.

## 10. Realtime is a notification mechanism, not a full sync protocol

Realtime subscriptions can make a second device's edits appear quickly. They do not automatically supply offline conflict resolution, durable command acknowledgment, or a complete history of every event missed while disconnected. On reconnect, re-fetch authoritative data or use a supported durable synchronization mechanism.

Subscribe at a clear feature or repository boundary, scope the subscription appropriately, and remove it when no longer needed. Avoid one subscription per row. If the subscription reports that a transaction changed, invalidate or update the relevant query based on the provider's guarantees. Preserve the server's version and timestamps rather than inventing ordering from arrival time.

Consider whether realtime is actually valuable for each screen. A personal transaction list may work well with foreground refresh and manual refresh. Household collaboration can benefit more from live updates. Every persistent connection adds lifecycle, cost, and reconnection behavior that you must test.

## 11. Add Clerk as an alternative identity provider

The researched Clerk Expo package is `@clerk/expo`, not the older package name found in many tutorials. Its [current Expo quickstart](https://clerk.com/docs/expo/getting-started/quickstart) describes hosted authentication, native components, and custom flows. Use the approach that matches your design and development-build requirements.

```sh
npx expo install @clerk/expo expo-secure-store expo-auth-session expo-crypto expo-web-browser
```

Enable the required native API and register production app identifiers in the Clerk dashboard according to the current guide. Review the plugin entries generated or required by the SDK. Development and production instances have different credentials and configuration. A development sign-in working on your laptop does not prove the production callback is registered correctly.

```tsx
// src/app/_layout.tsx — Clerk alternative branch.
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot } from 'expo-router';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) throw new Error('Missing public Clerk key');

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
```

```tsx
// A complete hosted sign-in component for the current Clerk branch.
import { useAuth } from '@clerk/expo';
import { useHostedAuth } from '@clerk/expo/hosted-auth';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export function ClerkSignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const { startHostedAuth } = useHostedAuth();
  const [message, setMessage] = useState('');
  async function openSignIn() {
    try {
      setMessage('');
      await startHostedAuth({ mode: 'sign-in' });
    } catch {
      setMessage('Sign-in could not finish. Please try again.');
    }
  }
  if (!isLoaded) return <Text>Restoring session…</Text>;
  return <View>
    <Text>{isSignedIn ? 'Signed in' : 'Welcome to PocketPilot'}</Text>
    {!isSignedIn && <Button title="Sign in" onPress={() => { void openSignIn(); }} />}
    <Text>{message}</Text>
  </View>;
}
```

The hosted flow delegates UI and session activation to Clerk. Native components or a custom flow can offer different UX, but bring their own setup and state handling. The [hosted-auth guide](https://clerk.com/docs/expo/guides/account-portal/hosted-auth) documents cancellation and callbacks. Do not infer that a dismissed browser means a successful session; read the SDK's auth state.

## 12. Connect Clerk identity to Supabase data correctly

Use Supabase's supported third-party Clerk integration, configured for your actual Clerk instance. The [integration guide](https://supabase.com/docs/guides/auth/third-party/clerk) is authoritative. Avoid copying an old tutorial that relies on a legacy JWT template unless you are deliberately maintaining that older configuration.

The client can supply the current Clerk token through Supabase's access-token option:

```tsx
// Integration hook for a configured Supabase third-party Clerk project.
import { useMemo } from 'react';
import { useAuth } from '@clerk/expo';
import { createClient } from '@supabase/supabase-js';

export function useClerkSupabase() {
  const { getToken } = useAuth();
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase public configuration');
  return useMemo(() => createClient(url, key, {
    accessToken: async () => getToken(),
  }), [url, key, getToken]);
}
```

Clerk user IDs are strings such as provider-specific subjects, not Supabase Auth UUIDs. The earlier schema references `auth.users` and uses `auth.uid()`, so it is not a drop-in schema for Clerk. Create a separate identity model. One simple personal-data design stores a text owner subject and compares it with the verified JWT subject.

```sql
-- Alternative branch only; do not run over the UUID-owner schema.
create table public.clerk_budgets (
  id uuid primary key default gen_random_uuid(),
  owner_subject text not null,
  name text not null check (char_length(name) between 1 and 80),
  limit_minor bigint not null check (limit_minor between 0 and 9007199254740991)
);
alter table public.clerk_budgets enable row level security;
create policy clerk_budget_owner on public.clerk_budgets
  for all to authenticated
  using ((select auth.jwt()->>'sub') = owner_subject)
  with check ((select auth.jwt()->>'sub') = owner_subject);
```

This policy assumes the supported integration verifies issuer, signature, and claims and grants the expected authenticated role. Decode-only token inspection is not verification. If several identity issuers are supported, include issuer-aware mapping to an internal identity rather than assuming subjects are globally unique. Store profile metadata separately from authorization-critical claims.

## 13. Account linking, social login, and local biometrics

A person can sign in with an email, Apple, or Google. Whether these identities refer to the same account must be decided by the provider's secure linking flow. Do not merge accounts merely because a client sends the same email string. Email verification and provider-specific rules matter, and a mistaken merge can expose financial history.

Native Apple sign-in obtains an identity credential that the auth provider verifies and exchanges for your application's session. A local biometric prompt can unlock a stored session or hide sensitive screens, but does not replace the identity provider. Keep these layers distinct in both code and UI copy. “Unlock” and “Sign in” need not mean the same thing.

Test Apple private relay addresses, canceled authorization, a user who removes app authorization, and a previously created account that later adds another provider. For sign-out, clear app-specific cached data as well as provider state. For deletion, revoke relevant provider credentials through the required server-side flow and remove associated data according to your retention policy.

## 14. Test isolation with adversarial scenarios

Create Alice and Bob as separate test users. Alice creates an account and transaction. Bob attempts to read Alice's transaction by exact ID, list all transactions, update its category, change its owner, and attach a new transaction to Alice's account. An unauthenticated client attempts the same operations. These are meaningful authorization tests because they exercise actual boundaries.

Also test the legitimate path. Alice should be able to read her own rows, create a permitted manual record, and update allowed annotations. A policy that denies everything is secure in a narrow sense but does not meet the product requirement. Keep expected allowed and denied operations together in a test matrix.

Run these tests with user sessions and the public client key. Run privileged-worker tests separately. If a function uses the service role, deliberately send Bob's token with Alice's account ID and verify rejection before any privileged provider call occurs. Record the request and result without storing credentials in test output.

## 15. Migrations, indexes, and operational costs

A migration changes schema or data deliberately. Prefer additive changes that old app versions can tolerate: add a nullable column, deploy compatible server logic, backfill, update clients, and only later tighten constraints or remove old fields. Mobile users do not all update immediately. A server deployment that assumes every client has the newest schema can break installed applications.

Indexes should support actual query patterns. The owner/date/ID index matches a common transaction listing. A category-and-period summary may need another access path. Use explain plans and realistic synthetic volumes before adding indexes reflexively. Indexes consume storage and make writes more expensive, so measure the tradeoff.

Estimate database size, object storage, egress, function execution, authentication usage, and realtime connections. Include backup and recovery requirements. Free quotas are useful for learning but are not a production capacity plan. Do not hardcode vendor prices in the business model without checking the current pricing page and the features your project actually needs.

## 16. A worked failure investigation

Suppose sign-in works, but every transaction query returns an empty array. First confirm that the client is using the intended project and current user session. Then inspect whether the rows belong to that user, whether RLS is enabled, and whether the policy compares the correct identity type. A Clerk string subject compared to a UUID owner will not become correct through a UI change.

Suppose creating a transaction fails with a foreign-key error. Check that the account exists and that the account-owner pair matches the transaction's owner. The constraint may be correctly preventing a cross-tenant reference. Do not remove the constraint merely to make the insert succeed. Repair the adapter or fixture data that violated the invariant.

Suppose a server function can read every user's data. That may be expected for its administrative client, but it means the function must enforce caller authorization before accessing records. Review the exact path from verified token to selected connection. Logging the request body is not a substitute for checking it.

## 17. Implementation blocks and acceptance evidence

Build the Supabase branch first with email authentication, session restoration, account creation, transaction listing, budget editing, private receipt storage, and deletion initiation. Add the Clerk branch afterward using the same screen contracts. Preserve separate environment files and databases so identity models do not become mixed accidentally.

The isolation block should produce actual allowed/denied results for two users, including a cross-owner foreign-key attempt. The recovery block should cover expired sessions, email confirmation, sign-out while a query is active, and a failed deletion worker. The capstone block should integrate only the identity track you selected.

Acceptance evidence includes migrations, generated types, the isolation matrix, a sign-in/callback recording on both platforms, and an architecture decision explaining the chosen identity system. Cloud and device checks must be run in your own accounts. The course's structural verification does not claim these credentialed integrations were executed here.

## 18. Deeper walkthrough: adding household sharing safely

After the personal version works, introduce `households` and `household_members`. A membership associates a verified internal user with a household and a role. Records such as shared budgets reference the household. A policy checks membership, not a client-supplied list of users. Invitations remain separate from active membership until accepted through a verified flow.

Avoid a policy function that recursively queries a table whose own policy calls the same function without a clear design. Membership checks can become complex, and security-definer functions require explicit search paths and limited privileges. Begin with simple policies and test them under the actual application role. Consult Postgres and Supabase documentation before introducing privileged helper functions.

Decide what happens when a member leaves. They should lose access to shared records promptly, and local caches should be invalidated or removed on the next verified membership refresh. A JWT claim containing an old household role can remain stale until token refresh, so highly sensitive authorization may need a current database membership check. Token convenience and revocation immediacy are a tradeoff.

Also decide who can delete a household, invite another person, export shared history, or change billing. These are separate capabilities. A single `isAdmin` Boolean tends to grow ambiguous. Express concrete roles and actions, and keep billing entitlement separate from permission to read another person's transactions.

## 19. Deeper walkthrough: deletion is a workflow, not one SQL statement

The user opens Settings and initiates deletion. The app explains what will be removed, how subscriptions are managed, and whether any retention exception applies. A recent-authentication step can confirm intent without making deletion deliberately difficult. The server creates a deletion request and stops new background imports for that account.

Next, revoke or disconnect bank-provider access, remove or schedule removal of private objects, remove application data, and delete or deactivate the identity according to the provider's supported administrative API. Track each step durably so a temporary provider outage does not lose the request. A retry must not recreate removed data or reconnect an account.

Subscriptions require separate handling. Deleting an app account does not necessarily cancel a store-managed subscription. Explain the management path and retain only the information legitimately needed to reconcile billing or satisfy retention requirements. Do not condition immediate account deletion on completing a manipulative cancellation survey. Chapter 10 covers the current store requirements and user-facing copy.

Finally, verify that the deleted identity cannot access the API, that signed URLs expire as intended, that local caches are cleared, and that scheduled workers cannot re-import data. This end-to-end test is stronger evidence than checking that one profile row disappeared. The operational runbook should state how support investigates a partially completed deletion without exposing sensitive financial content.

## 20. Further implementation detail: transaction boundaries and editable facts

Separate a provider transaction from the user's interpretation of it. The provider record contains source IDs, original amount, currency, posted date, pending status, and ingestion metadata. An annotation can contain a chosen category, note, exclusion flag, and version. This separation prevents a later bank refresh from overwriting a user's note and prevents a client from changing the source amount to make a budget appear healthier.

In SQL, that can become a provider table writable only by a server worker and an annotation table writable by an authorized owner. A view or controlled query joins them for display. If you use a view, verify its security behavior and grants under the actual database version; do not assume a view automatically preserves every table policy in the way you intend. Test direct table access as well as the convenient query path.

When an annotation references a transaction, enforce the same ownership relationship through constraints. A user should not be able to create an annotation pointing to another person's provider record. Use a transaction when updating several related annotations, and include operation identity for retry safety. A mobile client losing connectivity after a successful commit is an expected case.

For generated database types, treat regeneration as part of a migration pull request. Review the diff rather than blindly accepting it. A renamed nullable field or a new enum value can affect parsing and display behavior in old clients. Keep the adapter responsible for backward-compatible defaults where the product contract permits them.

## 21. Further implementation detail: choosing the final identity track

Run a small decision experiment instead of selecting a provider from a feature checklist alone. Build sign-up, social sign-in, session restore, password recovery, account deletion initiation, and a protected database query in each candidate identity track. Measure implementation time, configuration complexity, error clarity, and device behavior. Include an account-switch test because it exposes cache and session assumptions quickly.

Compare recurring costs using your expected active-user count and required features, but include engineering and support time. An identity service that saves several days of reliable account-management work can be economical even if another option has a lower invoice. Conversely, an additional vendor is unnecessary if its differentiating features do not matter to your product.

Record the decision in a short architecture note: context, alternatives, chosen track, reasons, risks, and a trigger for revisiting it. A trigger might be enterprise organization requirements, a need for a particular sign-in method, or a cost threshold. This is a more useful artifact than declaring one stack universally best.

An optional AI review prompt is: “Review these Supabase migrations and my chosen identity integration. Trace the verified subject into every RLS policy and privileged endpoint. Look for UUID/string mismatches, cross-owner foreign keys, administrative bypasses, storage leaks, stale membership claims, and deletion gaps. Propose two-user integration tests and distinguish tested behavior from assumptions.” Verify the resulting findings with actual user-role requests.

## 22. Integration lab: prove authorization independently of the interface

Create two synthetic users and retain their session credentials only in your private test environment. Use a small script or API client to perform the same operations the app performs. Alice creates an account and a transaction. Bob requests that exact transaction ID, attempts an update, and tries to create a new transaction referencing Alice's account. An anonymous caller repeats the requests. Record expected and observed status without printing tokens.

Now remove the UI entirely from the experiment. The requests should remain protected because the enforcement lives in RLS, constraints, or the verified server handler. This is the practical meaning of a backend security boundary. A hidden navigation route and an unguessable UUID can improve usability or reduce accidental exposure, but neither replaces authorization.

Next, test an allowed update and a forbidden field change. Alice may change a user annotation, but should not be allowed to alter an imported provider amount through the client API. If your initial learning schema still permits that change, record the gap and implement the final separation before using live data. Ownership and permitted action are different dimensions of authorization.

Finally, run the same test through a privileged server endpoint. Administrative authority can bypass the client policy, so the endpoint must derive the caller and constrain the selected record itself. A passing direct-database test does not prove a custom function is safe. Keep these results separate in your evidence report so the exact protected boundary is visible.

## 23. Integration lab: recover from a schema change

Add a nullable display label to an existing table, deploy a client that tolerates both missing and present labels, and backfill synthetic historical records. Verify that the old client still reads its required fields. Then add a constraint only after the data and supported clients satisfy it. This small rehearsal teaches the sequence needed for mobile-compatible migrations.

Do not use production data for the experiment. Seed deliberately old shapes and invalid cases in staging so the migration has something meaningful to process. Review generated types after each change and ensure the adapter still validates transport values. A type file regenerated from the newest schema does not repair an older installed app.

Document rollback behavior. If the new client fails, can you restore the prior client while leaving the additive column in place? Usually that is easier than reversing a destructive rename. This is one reason additive changes are valuable: they reduce coordination requirements across server deployments, store review, and users who update at different times.
