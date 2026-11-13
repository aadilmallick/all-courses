# 06 — Amplify Gen 2, Appwrite, and choosing a stack

[Previous](05-firebase-and-better-auth.md) · [Course home](../README.md) · [Next](07-payments-and-subscriptions.md)

**Planned time: 100 hours.** Allocate 14 hours to architecture, 28 to an Amplify branch, 26 to an Appwrite branch, 20 to authorization and lifecycle tests, and 12 to the final stack decision. The target is the same small finance slice used in earlier chapters, with equivalent behavior and evidence.

## 1. Why learn additional backends after one already works?

Learning several stacks is useful when it teaches you to see the stable problem beneath changing SDKs. A signed-in user creates a budget, reads transactions, uploads a receipt, and deletes an account. Every stack needs an identity, an authorization boundary, a data model, a durable write path, and operational support. The syntax changes; those responsibilities remain.

AWS Amplify Gen 2 provides a TypeScript-oriented way to define and connect AWS-backed application resources. Appwrite provides authentication, database, storage, functions, and other application services with cloud and self-hosting paths. Neither removes the need to understand which component owns a fact or which credential authorizes a request.

Do not rebuild the entire capstone six times. Implement the same representative slice in each alternative, then choose one stack for the large final project. A controlled comparison is more informative than six incomplete applications with different features. Keep the UI contracts and synthetic fixtures identical so backend behavior is the variable being studied.

## 2. Amplify is a toolchain around real AWS resources

Amplify authentication commonly uses Cognito, data uses an API and database resources, storage uses object storage, and functions run server code. Learn the resource relationships well enough to locate failures and costs. A generated client call is convenient, but the generated infrastructure still has permissions, quotas, regions, and deployment state.

The [React Native Gen 2 quickstart](https://docs.amplify.aws/react-native/start/quickstart/) uses TypeScript backend definitions and generated outputs. It also states that current Amplify native requirements are not supported in Expo Go. Use a development build. Do not mix Gen 1 CLI tutorials and `aws-exports` examples into a Gen 2 project without an explicit migration plan.

Choose a region deliberately and keep development resources separate from production. A per-developer sandbox is a deployed environment, not merely an in-memory emulator. Know how to stop and remove resources when the learning branch is finished. The course provides commands for you to run in your own account; it has not provisioned AWS resources for you.

## 3. Scaffold the Amplify branch

Start from a working Expo SDK 58 development-build project. Follow the current manual-installation requirements for Amplify's React Native dependencies and platform configuration. Native package requirements can change, so let the current guide and installed types determine exact compatibility.

```sh
npm create amplify@latest
npm install aws-amplify @aws-amplify/react-native
npx expo install @react-native-async-storage/async-storage @react-native-community/netinfo react-native-get-random-values
```

The scaffolder creates an `amplify` directory with backend resources. Review the generated files instead of treating them as opaque output. The backend schema and authorization are source code and belong in version control. Generated environment outputs identify the deployed resources used by the client; they are not a place to store administrative secrets.

When your account is configured and you intentionally want the development environment, the documented sandbox workflow uses:

```sh
npx ampx sandbox
```

This command belongs to the learner's setup process. It can create or update cloud resources. Record the environment and region you used, and verify the app connects to that environment rather than another branch's backend. A common integration error is using outputs from an old sandbox while editing a different schema.

## 4. Define authentication in TypeScript

```ts
// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: { email: true },
});
```

This resource definition describes the backend authentication capability. It does not render the sign-in screen. You can use Amplify's native authentication UI or implement a custom flow with the client API. The [auth setup guide](https://docs.amplify.aws/react-native/build-a-backend/auth/set-up-auth/) documents current dependencies and configuration.

Email sign-up may require confirmation. Sign-in can require a next step, such as a code or a password challenge. Model those steps explicitly. A method resolving does not necessarily mean the user is fully signed in. Do not navigate into private screens until the authentication result and session state support that transition.

Social providers require configuration on both the provider and AWS sides, along with native redirect handling. A provider secret belongs in the backend configuration, not in an Expo public variable. Native Apple sign-in and browser-based hosted sign-in have different UX and credential paths; choose and test one deliberately.

## 5. Define a small owner-scoped data model

```ts
// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Budget: a.model({
    name: a.string().required(),
    limitMinor: a.integer().required(),
    currency: a.string().required(),
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'userPool' },
});
```

```ts
// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({ auth, data });
```

The owner rule is more appropriate for private finance data than a public API-key rule. It establishes access behavior for the generated model. Inspect the generated owner semantics and test whether ownership can be changed by a client under your intended permissions. Do not assume the name `owner` means every ownership-related business invariant is already protected.

The integer type also needs a range decision. GraphQL integer fields can have a narrower range than JavaScript safe integers or Postgres `bigint`. For real monetary data, verify the generated scalar's range and transport format. If your supported amounts exceed it, use a validated string representation or an appropriate custom scalar and server contract. The demonstration model is sufficient for small synthetic budgets but should not silently define a global finance limit.

## 6. Configure the client and create records

```ts
// src/lib/amplify.ts — after the sandbox generated the outputs file.
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';
import type { Schema } from '../../amplify/data/resource';

Amplify.configure(outputs);
export const dataClient = generateClient<Schema>();
```

```ts
import { dataClient } from './amplify';

export async function createBudget(name: string, limitMinor: number) {
  if (!name.trim() || !Number.isInteger(limitMinor) || limitMinor < 0 || limitMinor > 2_000_000_000) {
    throw new Error('Invalid budget');
  }
  const { data, errors } = await dataClient.models.Budget.create({
    name: name.trim(), limitMinor, currency: 'USD',
  });
  if (errors?.length || !data) throw new Error('Budget could not be created');
  return data;
}

export async function listBudgets() {
  const { data, errors, nextToken } = await dataClient.models.Budget.list();
  if (errors?.length) throw new Error('Budgets could not be loaded');
  return { rows: data, nextToken };
}
```

The generated client preserves schema relationships at compile time. It does not make every runtime response valid by definition. Handle the documented `errors` collection as well as missing data. A result with partial data and errors requires a deliberate UI policy. Do not discard an error simply because the promise resolved.

Pagination uses the service's returned token. Keep it scoped to the same query and user. Do not reuse a token after changing filters or identities. Map generated records into the common repository model so screens do not depend on backend-specific metadata or pagination names.

## 7. Implement Amplify authentication as a state machine

```ts
import { signUp, confirmSignUp, signIn, signOut } from 'aws-amplify/auth';

export async function register(email: string, password: string) {
  return signUp({ username: email, password, options: { userAttributes: { email } } });
}

export async function confirmEmail(email: string, code: string) {
  return confirmSignUp({ username: email, confirmationCode: code });
}

export async function login(email: string, password: string) {
  const result = await signIn({ username: email, password });
  return { complete: result.isSignedIn, nextStep: result.nextStep };
}

export async function logout() {
  await signOut();
}
```

The UI should translate supported next steps into explicit screens and actions. For example, a confirmation-code step needs a code field, resend behavior, expiration handling, and a way to correct the address. An unsupported challenge should produce a useful error and diagnostic rather than an infinite spinner.

Use the current session and event APIs to restore authentication and observe changes. Keep those details inside the auth adapter. Your root navigator should consume the same `ready` and `userId` contract used by other branches. This lets you compare actual session behavior without rewriting the route tree each time.

If you use the prebuilt Authenticator component, still understand the underlying lifecycle. A prebuilt screen can reduce implementation time, but you remain responsible for custom onboarding, user data cleanup, callback registration, and account deletion. Test the exact production configuration and email delivery path.

## 8. Extend Amplify with functions and storage

Use server functions for bank-provider secrets, webhook handling, and privileged aggregation. Define the function resource in the backend, grant only the resources it needs, and keep provider secrets in the supported secret mechanism. A function with broad account permissions is convenient during a demo and expensive to audit later.

Storage access rules should express owner or household scope. A public bucket is inappropriate for financial receipts merely because the object names are difficult to guess. Signed access and authorized upload paths are capabilities that must follow the same ownership model as the metadata record.

For custom operations, validate amounts, dates, currencies, and record references on the server. The generated model's owner rule may protect basic CRUD but does not automatically validate a complex bank connection or prevent an owner from changing provider-derived facts. Separate manual data from imported data and design write permissions accordingly.

Observe cloud logs and request identifiers without logging access tokens, bank tokens, or transaction bodies. Configure cost visibility for the resources you actually deploy. A single “Amplify cost” number can conceal several underlying services with different usage patterns.

## 9. Realtime and offline behavior need explicit requirements

A generated subscription or observed query can update the UI when data changes. It does not automatically supply a complete offline-first application. Learn the exact guarantees of the current Gen 2 data client, then decide whether the course's SQLite outbox remains necessary.

Do not import a Gen 1 DataStore tutorial and assume it is the recommended Gen 2 architecture. The concepts may be useful, but the APIs, provisioning, and support boundaries differ. If offline durability is a hard requirement, test process termination, replay, conflicts, and account switching with the exact package versions and backend resources you selected.

For the learning branch, a clear online-first adapter with cached reads can be sufficient. Record that limitation honestly. The final capstone can use an explicit offline layer if the product requirements justify it. More complex synchronization should be a response to a defined user need, not a default badge of architectural sophistication.

## 10. Appwrite offers another integrated service boundary

Appwrite combines identity and application data services. The [React Native quickstart](https://appwrite.io/docs/quick-starts/react-native) uses `react-native-appwrite` and requires registering the app's platform identifiers. Current database documentation uses TablesDB terminology and row APIs; older tutorials may use collections and document methods. Keep one API generation per implementation.

Choose Appwrite Cloud for the first branch unless self-hosting is itself a learning objective. Self-hosting adds upgrades, backups, mail delivery, storage operations, monitoring, and availability work. It can be valuable when you need control and have the operational capacity, but it is not automatically the cheaper production choice.

Register iOS and Android application identifiers exactly as they appear in Expo configuration. Use the correct regional endpoint and project ID. A client endpoint is public configuration. An Appwrite server API key is privileged and must remain on the server. Do not confuse the two when copying console values.

## 11. Initialize Appwrite in TypeScript

```sh
npx expo install react-native-appwrite expo-file-system react-native-url-polyfill
```

```ts
// src/lib/appwrite.ts
import 'react-native-url-polyfill/auto';
import { Client, Account, TablesDB } from 'react-native-appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const platform = process.env.EXPO_PUBLIC_APP_IDENTIFIER;
if (!endpoint || !projectId || !platform) throw new Error('Missing public Appwrite configuration');

export const appwriteClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setPlatform(platform);

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);
```

Use platform-specific configuration if your iOS bundle ID and Android package differ. Keep a single client instance under the repository's ownership. The SDK manages its supported native session behavior; do not build a second competing cookie store without a clear documented requirement.

The current [React Native tutorial setup](https://appwrite.io/docs/tutorials/react-native/step-3) shows the native SDK and TablesDB setup. Compile against the installed package types. If a method in an old tutorial is positional while the current SDK expects an object, follow the installed version's reference rather than forcing the old call through `any`.

## 12. Implement Appwrite registration and session lifecycle

```ts
import { ID } from 'react-native-appwrite';
import { account } from './appwrite';

export async function register(email: string, password: string, name: string) {
  await account.create({ userId: ID.unique(), email, password, name });
  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

export async function login(email: string, password: string) {
  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

export async function restoreSession() {
  return account.get();
}

export async function logout() {
  await account.deleteSession({ sessionId: 'current' });
}
```

Registration and session creation are separate operations. If account creation succeeds but session creation fails, show a path to sign in rather than repeatedly creating another account. Persist the appropriate UI state while avoiding storage of the password. Handle a missing restored session as signed out, while distinguishing an actual service outage in diagnostics.

Add verification and recovery using the current Account APIs and registered callback URLs. Test those links on a cold app launch. If your product requires verified email before a particular action, enforce that requirement in a trusted authorization layer, not only by hiding a button.

For OAuth, use the provider's supported native session flow and exact redirect configuration. Do not assume a browser cookie automatically becomes the native app's session. The SDK's documented token or session exchange exists to connect those environments safely. Keep cancellation a normal user action rather than presenting it as a frightening failure.

## 13. Configure TablesDB and row permissions

Create a database and a `budgets` table with name, limit, currency, and owner-subject columns. Choose types and bounds that match your domain. Enable row security where the service requires it. Configure table-level permissions deliberately: authenticated users can create rows, while read, update, and delete access should be granted at the intended row scope.

```ts
import { ID, Permission, Role } from 'react-native-appwrite';
import { account, tablesDB } from './appwrite';

const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const tableId = process.env.EXPO_PUBLIC_APPWRITE_BUDGETS_TABLE_ID;

export async function createBudget(name: string, limitMinor: number) {
  if (!databaseId || !tableId) throw new Error('Missing table configuration');
  if (!name.trim() || !Number.isSafeInteger(limitMinor) || limitMinor < 0) {
    throw new Error('Invalid budget');
  }
  const user = await account.get();
  return tablesDB.createRow({
    databaseId, tableId, rowId: ID.unique(),
    data: { name: name.trim(), limitMinor, currency: 'USD', ownerSubject: user.$id },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });
}
```

This example requires a table configured with the named columns and compatible types. The [database tutorial](https://appwrite.io/docs/tutorials/react-native/step-6) and current TablesDB API reference define the exact setup. The permissions grant the current user the listed actions. Broad table permissions can expand access beyond row intentions, so inspect both levels.

The owner field is metadata, while permissions enforce access. A malicious client may attempt to write a false owner field or choose a different permission set. For operations where the owner field drives trusted business logic, create rows through a server function that derives ownership from the caller and fixes the allowed permissions. Do not assume a client-supplied string is authoritative because it matches your normal UI behavior.

## 14. Query, update, and paginate Appwrite data

```ts
import { Query } from 'react-native-appwrite';
import { tablesDB } from './appwrite';

export async function listBudgets(databaseId: string, tableId: string) {
  const result = await tablesDB.listRows({
    databaseId, tableId,
    queries: [Query.orderAsc('$id'), Query.limit(50)],
  });
  return result.rows;
}

export async function updateBudget(databaseId: string, tableId: string, rowId: string, limitMinor: number) {
  if (!Number.isSafeInteger(limitMinor) || limitMinor < 0) throw new Error('Invalid limit');
  return tablesDB.updateRow({ databaseId, tableId, rowId, data: { limitMinor } });
}
```

Permissions determine accessible rows. Query filters refine the requested result and can improve efficiency, but should not be your only privacy mechanism. Add indexes required by actual filter and ordering combinations. Use supported cursor pagination and retain its query context. Avoid offset-based assumptions that produce skipped or duplicated rows while new data arrives.

Parse returned row data into the common domain model. Appwrite metadata fields such as `$id` are transport details; your UI can consume an ordinary `id`. A backend migration becomes easier when the screen does not know which provider adds a dollar sign to metadata names.

For imported transactions, prefer a server-writable table and a separately editable annotation table. Restrict the client from changing source amounts, connection IDs, and provider tokens. The same invariant should hold across Supabase, Firebase, Amplify, and Appwrite even though the enforcement syntax differs.

## 15. Storage, realtime, and functions in Appwrite

Use private file permissions consistent with the related row's ownership. A receipt's metadata row and binary object need coordinated lifecycle management. If upload succeeds and metadata creation fails, track or clean up the orphan. If metadata succeeds before the upload completes, expose an explicit processing state rather than a broken image.

Realtime subscriptions can notify the app of permitted changes. Own their lifecycle in the repository or feature layer and unsubscribe on logout or when no longer needed. After reconnecting, refresh authoritative data instead of assuming every missed event was replayed. An event stream is not automatically a durable offline synchronization log.

Server functions can derive the caller identity and use scoped server credentials for privileged work. Keep those credentials out of the client and grant only required scopes. For a bank webhook, verify the provider signature before trusting the payload, deduplicate the event, enqueue bounded work, and return promptly. The provider should not wait while your function performs a long multi-page import.

## 16. Compare cloud and self-hosted operations honestly

Managed services reduce certain operational tasks, but you still configure access, backups, retention, monitoring, and data export. Self-hosting adds responsibility for the service itself, including version upgrades, compatible database changes, TLS, storage durability, and mail delivery. A successful container startup is not a production operating plan.

For Appwrite self-hosting, follow the official deployment and backup guides for the exact release. Test restoration into a separate environment. Verify how files, database records, identities, and secrets are recovered together. A database backup without the associated object storage can leave receipt metadata pointing to missing files.

For AWS, learn enough IAM and resource structure to identify which role a function uses and which resources it can reach. A generated permission can be appropriate, but review custom broad policies carefully. Avoid solving a denied operation by granting account-wide administrative access. The correct permission should correspond to the intended resource and action.

## 17. A controlled six-stack comparison

| Stack | Strong fit for this course | Main burden to evaluate |
| --- | --- | --- |
| Supabase Auth + Postgres | Relational finance model and SQL reporting | RLS, migrations, privileged worker design |
| Clerk + Postgres/Supabase | Managed identity experience with relational data | Subject mapping and another service boundary |
| Firebase Auth + Firestore | Document-oriented mobile workflows and native ecosystem | Rules, denormalization, read patterns, SDK offline differences |
| Better Auth + owned API + Postgres | TypeScript control and custom server architecture | Auth operations, patching, email, hosting, session verification |
| Amplify Gen 2 | AWS resource integration and infrastructure-as-code | IAM, generated resources, cloud debugging, service costs |
| Appwrite | Integrated application services and optional self-hosting | Permissions, platform setup, operational model |

Do not assign a universal numerical score without weights. A feature you do not need should not dominate the choice. For PocketPilot, relational integrity, understandable authorization, reliable background imports, and a manageable solo-developer operating burden receive high weight. That makes Supabase Auth plus Postgres a sensible default, while the other branches teach when a different choice becomes rational.

Add current pricing only after estimating usage. Authentication costs may depend on active users or advanced features. Database costs may depend on capacity or operations. Storage and egress can dominate receipt-heavy products. Include the time needed to maintain the implementation. A free plan is an entry point, not a guarantee of a sustainable production cost structure.

## 18. Write the architecture decision as evidence

Your decision note should describe the product, expected usage, supported regions, offline requirements, team skills, and operational constraints. List alternatives and the evidence from your prototypes. State the chosen stack, the reasons, the accepted disadvantages, and a trigger for reconsideration.

A useful example is: “We choose Supabase Auth and Postgres for the first personal-finance release because the model relies on relational ownership constraints and SQL summaries, and one identity system reduces integration effort. We accept responsibility for RLS and database migrations. We will revisit identity tooling if enterprise organizations become a core requirement.” This is concrete and falsifiable.

An unhelpful note says one backend is “best” because it is modern. Modernity does not describe your access patterns, recovery needs, or support capacity. A decision can be correct for the current product while leaving room for future change. The purpose is to make tradeoffs visible, not to win a framework argument.

## 19. Test equivalent behavior in both new branches

Create two users and attempt cross-user reads, writes, ownership changes, and receipt access. Test unauthenticated requests. Verify allowed owner operations. For Amplify, inspect generated owner behavior and custom function authorization. For Appwrite, inspect table and row permissions together and attempt to create misleading owner metadata.

Test sign-up confirmation, password recovery, sign-out during active queries, session restoration after a restart, and account deletion initiation. Test the native development build, not only a web preview. Keep callback and platform registration evidence for both iOS and Android.

For offline behavior, document exactly what survives process termination and what remains memory-only. If your branch is online-first, say so. For a queue, repeat the same mutation after a simulated dropped response and verify the server does not duplicate it. A backend's convenience API does not eliminate distributed-delivery problems.

## 20. A worked failure: owner access works but sharing leaks

Suppose Appwrite owner rows work correctly in normal testing, but Bob can read Alice's budget. Inspect whether the table grants read access to every authenticated user. Row-specific permissions may be narrower, but a broad table permission can still expand access. Repair the actual permission model and rerun both positive and negative tests.

Suppose Amplify's generated owner rule protects a model, but a custom function accepts a household ID from any caller and returns its budgets. The generated model rule does not automatically secure arbitrary custom server code. Verify membership inside the function or use a documented authorization context that enforces it. Never infer custom endpoint safety from another resource's successful tests.

Suppose a client changes its `ownerSubject` field and a background job later trusts that field to select a bank connection. The row permission and metadata have diverged. Server-owned identity fields should be derived and protected at creation and update boundaries. This example explains why security is a chain of authority, not a single checkbox in a console.

## 21. Deeper walkthrough: moving from personal data to organizations

An enterprise app may need organizations, roles, invitations, and audit records. The identity provider can supply organization membership, but the application must decide which data belongs to which organization and how current membership is enforced. A person can belong to several organizations, so a single global `organizationId` preference is not sufficient authorization.

Use an explicit active organization for UI context and verify access on every server operation. Scope query keys and local caches by both user and organization. On organization switch, cancel stale requests and ensure late responses cannot populate the new context. This is the same account-switching problem from Chapter 03 with another dimension.

For household finance, sharing is often more personal and sensitive than an ordinary team dashboard. Decide whether all members can see every transaction or only selected shared accounts. Model those permissions explicitly. A generic “team” feature from a backend can accelerate identity management, but it cannot decide the privacy expectations of a couple or family.

When membership is revoked, consider token lifetime, database checks, realtime subscriptions, and local cache removal. A permission change that only takes effect after the user manually signs out may not satisfy your product requirement. Test revocation while the app is open and while it is offline, then document the limits of immediate remote deletion from a disconnected device.

## 22. Deeper walkthrough: deployment and migration across environments

Keep development, staging, and production resource identities separate. A mobile preview build should point to staging and use sandbox billing and bank integrations. A production build should use the production environment. The names of build profiles alone do not enforce this; inspect the resolved public configuration and server endpoints.

When a schema changes, deploy in a sequence compatible with installed app versions. Add fields and server support before requiring the newest client behavior. Keep a migration note that explains backfill, validation, rollback, and cleanup. A mobile release can take time to propagate, and some users may remain on an old version for weeks.

For Appwrite table changes or Amplify model changes, test existing data and generated client behavior. A fresh empty environment can hide incompatible records. Seed a staging environment with synthetic historical versions, then run the migration and representative queries. Never copy real financial production data into a casual development project to make testing realistic.

After deployment, verify the app's environment, identity flow, data access, and server workers with synthetic accounts. A green infrastructure deployment is only one layer of evidence. The final acceptance condition is the intended user workflow functioning under the intended permissions and environment.

## 23. Further detail: choosing an escape hatch

Every stack should have a documented export path for business data. Know how to retrieve users, transactions, budgets, annotations, and private files in a format you can validate. You do not need to build a migration system immediately, but you should avoid designs that make your own data unintelligible outside one client SDK.

Keep provider IDs alongside internal IDs and retain mapping metadata. If you later change an identity provider, the business record should still have a stable internal owner mapping. If you change a database, exported amounts should retain currency, sign convention, and date semantics. A CSV containing only a merchant and number loses too much meaning for a reliable migration.

An escape hatch also includes operational independence within the chosen stack. A bank import worker should be resumable and observable. An entitlement check should degrade according to a defined policy during a billing-provider outage. A feature flag should disable a broken nonessential capability without requiring a whole-app emergency rewrite. These are practical resilience choices that matter more than supporting every vendor simultaneously in production.

## 24. Project work and final acceptance

Complete the Amplify and Appwrite slices, then produce one comparison table populated with observations from your own implementation. Include setup time, native build requirements, authentication recovery, ownership enforcement, query ergonomics, offline durability, server extension points, and estimated operating cost. Mark untested cells clearly rather than filling them with optimistic assumptions.

Choose one backend and one identity system for the final capstone. Remove unused production dependencies from that app while retaining learning branches and documentation. A capstone should demonstrate sound selection, not an unnecessary abstraction capable of dynamically switching six vendors during a user's session.

An optional AI review prompt is: “Review my Amplify Gen 2 and Appwrite prototypes against the same finance feature contract. Inspect generated owner rules, custom function checks, table/row permission interaction, client-controlled metadata, native callback setup, pagination, and environment isolation. Identify evidence missing from my stack decision and propose the smallest tests that would resolve it.” Treat its answer as a review plan and verify the critical paths yourself.

## 25. Decision lab: estimate one real user journey

Write down a representative week for one user: several foreground opens, one full refresh, a handful of budget edits, a receipt upload, and one recurring-summary review. Estimate how many requests, documents, rows, function invocations, stored bytes, and network bytes that journey produces in each prototype. Use measured development traces where possible and label guesses clearly.

Then multiply by a plausible active-user range rather than a single optimistic forecast. Include low, expected, and high usage. Add background bank imports and billing events, which occur even when the app is not open. A backend that looks inexpensive for screen reads can have a different cost profile once scheduled workers and third-party data are included.

Do not confuse a billing alert with a hard spending cap. Learn which controls actually stop work, which only notify you, and what customer experience results if a quota is reached. A finance app should not silently stop synchronizing while continuing to display a current-looking balance. Surface freshness and monitor queue age independently of the vendor invoice.

Finally, include developer time. If one stack takes an additional week to implement reliable deletion or debug native callbacks, that is part of its practical cost. The point is not to monetize every minute precisely; it is to avoid treating engineering and support as free while comparing tiny differences in monthly service charges.

## 26. Decision lab: choose one deliberate limitation

Every first release has limits. Choose them explicitly. You might support only USD, personal accounts rather than households, a limited transaction history, or online-first editing. A clear limit can reduce complexity while preserving a useful product. An accidental limit appears later as a bug or misleading promise.

Document the limit in the domain contract, interface, support page, and marketing claims where relevant. If only USD is supported, reject or separate other currencies instead of summing them. If editing requires a connection, preserve the draft and explain that the save is pending rather than pretending it succeeded offline. If household sharing is absent, do not imply that a shared login is a safe substitute.

The selected stack should make the supported scope reliable and leave a plausible extension path. It does not need to solve every future product idea immediately. This is the difference between learning several alternatives and carrying unnecessary alternatives into the production architecture.
