# 05 — Firebase and an owned Better Auth TypeScript server

[Previous](04-supabase-and-clerk.md) · [Course home](../README.md) · [Next](06-amplify-and-appwrite.md)

**Planned time: 110 hours.** Spend 14 hours on the competing models, 30 building the Firebase branch, 30 building the Better Auth branch, 22 on security and recovery tests, and 14 comparing results. Rebuild the same budget-and-transaction slice so the comparison concerns behavior rather than different demo applications.

## 1. Two alternatives with different responsibilities

Firebase supplies managed services including authentication, document data, storage, and server functions. Better Auth is an authentication library that runs in a server environment you control or deploy. It does not automatically supply your finance database schema, business API, email delivery, monitoring, or operations team.

The central Firebase lesson is access-pattern-driven document modeling with explicit rules. The central Better Auth lesson is owning the server boundary: mounting authentication correctly, persisting sessions, verifying them for business requests, and maintaining the infrastructure around them. Both can be used with React Native, but their engineering obligations differ substantially.

Do not choose between them solely by counting lines in a quickstart. A short managed-service client can depend on complex security rules and indexes. A small self-hosted auth configuration can depend on a database, email provider, patching, and incident response. Compare the complete path from sign-up through data deletion and recovery.

## 2. Firebase has JavaScript and native integration paths

The [Expo Firebase guide](https://docs.expo.dev/guides/using-firebase/) distinguishes the Firebase JavaScript SDK from React Native Firebase, which wraps native Firebase SDKs. The JavaScript path is useful for learning authentication and Firestore with a universal code style. Native modules are appropriate when you require native services and behavior such as Crashlytics or native analytics.

The researched Expo guide requires Firebase JavaScript SDK 12 or newer for current module resolution. Use `npx expo install firebase` and inspect the resolved version. Do not combine old namespaced examples such as `firebase.auth()` with modular imports without a deliberate migration. A provider's native SDK and web SDK may share concepts while differing in persistence and platform support.

Choose one path for the first Firebase branch. This chapter begins with modular JavaScript SDK APIs in a native Expo app. Later, create a separate native-module experiment if your requirements demand it. A native module requires a development build; installing its JavaScript wrapper does not add its native implementation to Expo Go.

## 3. Initialize Firebase and persist authentication deliberately

Create a learning Firebase project, enable email/password authentication, and register the app configuration required for your chosen SDK path. The client configuration is public project information; administrative service-account credentials are server secrets. Security rules and verified user identity protect data.

```sh
npx expo install firebase @react-native-async-storage/async-storage
```

```ts
// src/lib/firebase.ts — native JavaScript SDK branch.
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
if (!apiKey || !projectId || !appId) throw new Error('Missing Firebase public configuration');

export const firebaseApp = initializeApp({
  apiKey, projectId, appId,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
});
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const firestore = getFirestore(firebaseApp);
```

Keep initialization in one owned module. Fast Refresh can reveal duplicate-initialization issues if your application setup creates instances repeatedly; use the provider's existing-app pattern when appropriate for your tooling. Do not catch every initialization error and silently return a different auth object, because that can conceal a real configuration mismatch.

The [Firebase auth API reference](https://firebase.google.com/docs/reference/js/auth) defines React Native persistence. This adapter persists session state but is not an encrypted financial datastore. If your app needs stronger local credential protection, evaluate the supported native path or a documented storage integration and test its lifecycle. Do not substitute an arbitrary object just because it has `getItem` and `setItem` methods without checking the auth SDK contract.

## 4. Build the authentication lifecycle

```ts
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, signOut,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export async function register(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function login(email: string, password: string) {
  return (await signInWithEmailAndPassword(firebaseAuth, email, password)).user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(firebaseAuth, email);
}

export async function logout() {
  await signOut(firebaseAuth);
}
```

These functions implement individual SDK operations. The UI still owns loading, cancellation, helpful errors, and navigation. Registration can create an authenticated user before email verification is complete, so authorization rules must reflect whether verification is required for a particular action. Do not confuse “has a session” with “has completed every onboarding requirement.”

Use `onAuthStateChanged` to resolve the initial session and receive subsequent changes. Return its unsubscribe function from the provider's effect. Clear user-specific query caches and local repositories when the identity changes. A password reset email should produce a neutral confirmation message where account-enumeration concerns apply, rather than exposing whether an address is registered through custom copy.

For Apple or Google sign-in, obtain the appropriate native or browser credential through a supported flow, then exchange it using Firebase's documented provider APIs. Verify current Expo and SDK compatibility rather than copying a browser popup flow into a native screen. A native biometric unlock remains a local feature independent of Firebase identity.

## 5. Model Firestore according to queries and authorization

Firestore stores documents in collections. A convenient personal-data layout places records under a user path:

| Path | Contents |
| --- | --- |
| `users/{uid}` | Minimal profile and settings |
| `users/{uid}/accounts/{accountId}` | Manual or imported account summary |
| `users/{uid}/transactions/{transactionId}` | Display-ready transaction facts |
| `users/{uid}/budgets/{budgetId}` | Category, period, and limit |
| `users/{uid}/annotations/{transactionId}` | User-editable note/category |

A path containing a UID is not inherently secure. Rules must compare it with the authenticated UID. The layout makes that comparison easy to express and helps scope ordinary queries. For shared households, use a household path and verified membership checks instead of assuming every participant has the same UID.

Document databases often denormalize information to serve a known query efficiently. A transaction may contain a merchant display label even if another merchant record exists. Decide which copy is authoritative and how updates propagate. Denormalization trades join work for consistency work; it does not make consistency irrelevant.

Keep provider facts separate from editable annotations as in the relational design. Clients should not be able to change an imported amount merely because they own the transaction. Put provider-ingested writes behind a server worker and allow client writes only to the appropriate user-editable fields or documents.

## 6. Write strict rules before loading real data

The following Firestore rules are a personal-budget learning policy. They intentionally allow only a small set of fields. Apply and test them in a dedicated project or emulator; do not merge them blindly with an unrelated production ruleset.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }
    function validBudget(data) {
      return data.keys().hasAll(['name','limitMinor','currency'])
        && data.keys().hasOnly(['name','limitMinor','currency'])
        && data.name is string && data.name.size() > 0 && data.name.size() <= 80
        && data.limitMinor is int && data.limitMinor >= 0
        && data.limitMinor <= 9007199254740991
        && data.currency == 'USD';
    }
    match /users/{uid}/budgets/{budgetId} {
      allow read, delete: if isOwner(uid);
      allow create, update: if isOwner(uid) && validBudget(request.resource.data);
    }
    match /users/{uid}/transactions/{transactionId} {
      allow read: if isOwner(uid);
      allow write: if false;
    }
  }
}
```

Unmatched paths are denied. The transaction collection is client-readable by its owner and server-writable only. Server administrative SDKs use a different authority and can bypass client security rules, so every server endpoint must authorize the caller independently. The [rules conditions guide](https://firebase.google.com/docs/firestore/security/rules-conditions) explains request authentication and data validation.

Rules are not filters that remove forbidden documents from a broad query. The query must satisfy the rules' constraints. Design the query path and rules together. If a query is rejected, inspect its scope and expected authorization rather than weakening the policy to `allow read, write: if true`.

## 7. Implement typed Firestore operations

```ts
import { collection, doc, getDocs, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from './firebase';

type Budget = { name: string; limitMinor: number; currency: 'USD' };

export async function saveBudget(uid: string, id: string, budget: Budget) {
  if (!Number.isSafeInteger(budget.limitMinor) || budget.limitMinor < 0) {
    throw new Error('Invalid budget limit');
  }
  await setDoc(doc(firestore, 'users', uid, 'budgets', id), budget);
}

export async function listRecent(uid: string) {
  const source = collection(firestore, 'users', uid, 'transactions');
  const snapshot = await getDocs(query(source, orderBy('postedOn', 'desc'), limit(50)));
  return snapshot.docs.map(document => ({ id: document.id, ...document.data() }));
}
```

The list result still needs runtime parsing before it becomes the trusted domain type. A Firestore document can have unexpected historical data even if the current client writes correctly. Convert timestamps and amounts at the adapter boundary. Do not use `as Transaction[]` as a replacement for validation.

`setDoc` with the same ID replaces or merges according to the options you choose. An automatically generated ID on every retry can create duplicates. Stable IDs or an operation record can make important writes idempotent. For concurrency-sensitive updates, use a transaction and understand that its callback may run more than once. Do not send emails or charge payments inside a retried database transaction callback.

Pagination should use a deterministic ordering and a cursor supported by that query. Keep index definitions in your project workflow. A composite query can require an index even when each field exists individually. Test against realistic document counts and include the cost of repeated reads, listeners, and reconnects in your estimate.

## 8. Understand offline behavior for the exact SDK path

Native Firestore SDKs provide documented offline persistence behavior. Browser Firestore persistence has its own environment requirements. A React Native app using the JavaScript SDK is not automatically equivalent to either one. Do not promise durable offline data merely because a web tutorial enables IndexedDB persistence.

Consult the [offline-data guide](https://firebase.google.com/docs/firestore/manage-data/enable-offline) and the actual React Native integration's support. If you require reliable native offline behavior, evaluate React Native Firebase's native Firestore path or implement an explicit SQLite repository and outbox. Test process termination and restart while offline, not only a temporary network toggle while memory remains intact.

Snapshot listeners can provide local and remote updates, but they are not a financial reconciliation algorithm. Inspect metadata when the SDK exposes cache or pending-write state, and communicate uncertainty appropriately. A locally accepted write may still be rejected by server rules when connectivity returns. The UI needs a recovery path for that rejection.

For a user switching accounts, understand whether cached documents remain on disk and how your app isolates them. The fact that server rules protect remote reads does not automatically erase local data from a previously authenticated session. Define the local retention policy explicitly and test it on a shared device.

## 9. Use server functions and administrative authority carefully

A Firebase server function can process a bank webhook, maintain a summary document, or generate a private export. Verify the caller where the function is user-invoked, validate all input, and derive the UID from the verified context. App Check can reduce some abuse but does not replace user authentication or ownership checks.

A background trigger can receive repeated events. Make its effects idempotent using stable event or operation identity. If it updates a monthly spending summary, do not add the transaction amount again on every duplicate delivery. Prefer a deterministic recomputation or a carefully recorded incremental update. Test both duplicate and out-of-order events.

Administrative credentials stay on the server and follow least privilege. A service-account JSON file is not an Expo public environment variable. Keep separate projects for development and production. Configure billing alerts and quotas where available, but understand which controls notify versus actually limit spending.

## 10. Better Auth changes what you operate

Now build an alternative branch using Better Auth and a TypeScript server backed by Postgres. You gain control over deployment and application integration. You also own database migrations, availability, email configuration, secret rotation, dependency patching, rate limiting, and recovery. Self-hosting authentication is a responsibility, not merely a pricing trick.

Use a separate server directory or workspace. The mobile app must never import the server's `auth.ts` module, database pool, or secret environment variables. Shared request types can live in a neutral module, but runtime server dependencies belong only in the server build.

The [Better Auth Expo guide](https://better-auth.com/docs/integrations/expo) documents the server plugin and native client plugin. Its examples may name an earlier Expo SDK; the integration concepts are current, but you must still compile and test the resolved packages against SDK 58. This course does not claim every vendor's guide has already certified that exact combination.

## 11. Configure the Better Auth server

```sh
mkdir pocketpilot-server
cd pocketpilot-server
npm init -y
npm install better-auth @better-auth/expo express pg
npm install --save-dev typescript tsx @types/node @types/express @types/pg
```

Set the server package to ESM with `"type": "module"`. Use a strict TypeScript configuration appropriate to your runtime and module-resolution strategy. Supply `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` through server-only environment configuration. Generate a strong random secret using a trusted tool; never reuse the example word “secret.”

```ts
// server/auth.ts — requires a real Postgres connection and generated auth tables.
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
if (!connectionString || !secret || !baseURL) throw new Error('Missing server configuration');

export const pool = new Pool({ connectionString });
export const auth = betterAuth({
  database: pool,
  secret,
  baseURL,
  trustedOrigins: ['pocketpilot://'],
  emailAndPassword: { enabled: true },
  plugins: [expo()],
});
```

Run the schema-generation and migration commands documented for the installed Better Auth version before starting the server. Review the generated migration and apply it through your normal database workflow. CLI package names and commands have changed across versions, so use the current installation guide rather than assuming a remembered command is correct. Record the command and resolved version in your project setup note.

The minimal configuration is a learning server, not a completed production auth service. Add verified email delivery, password recovery, abuse controls, operational monitoring, and the security settings appropriate to your deployment. Do not enable an unconfigured verification requirement and then wonder why every user is locked out without an email.

## 12. Mount the auth handler before consuming its request body

Express body parsing can consume the incoming stream before the auth handler reads it. The [official Express integration](https://better-auth.com/docs/integrations/express) requires mounting the handler before `express.json()`. Express 5 uses a named wildcard route syntax.

```ts
// server/server.ts — Express 5 example.
import express from 'express';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { auth, pool } from './auth.js';

const app = express();
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json({ limit: '32kb' }));

app.get('/api/budgets', async (request, response, next) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });
    if (!session) {
      response.status(401).json({ error: 'unauthenticated' });
      return;
    }
    const result = await pool.query(
      'select id, name, limit_minor from budgets where owner_id = $1 order by id limit 50',
      [session.user.id],
    );
    response.json({ budgets: result.rows });
  } catch (error) {
    next(error);
  }
});

app.use((_error: unknown, _request: express.Request, response: express.Response,
  _next: express.NextFunction) => {
  response.status(500).json({ error: 'internal_error' });
});

app.listen(3005, '0.0.0.0');
```

This server requires a `budgets` table with a text owner ID matching the Better Auth user identifier. It is a complete handler example within that explicit database prerequisite, not a preconfigured cloud deployment. Add a migration such as `id text primary key, owner_id text not null, name text not null, limit_minor bigint not null` with appropriate constraints and references to your actual generated auth schema.

The owner comes from the verified session. A request parameter cannot override it. Parameterized SQL separates values from syntax. Return a neutral server error to the client while recording a sanitized diagnostic internally. Never log session cookies or full request headers. The mobile client receives enough information to recover without receiving database internals.

## 13. Configure the Better Auth Expo client

```sh
npm install better-auth @better-auth/expo
npx expo install expo-secure-store expo-network expo-linking expo-web-browser expo-constants
```

```ts
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_AUTH_API_URL;
if (!baseURL) throw new Error('Missing public auth API URL');

export const authClient = createAuthClient({
  baseURL,
  plugins: [expoClient({
    scheme: 'pocketpilot', storagePrefix: 'pocketpilot', storage: SecureStore,
  })],
});
```

Set the same custom scheme in Expo app configuration and rebuild when native link registration changes. In production, use HTTPS and exact trusted origins. Broad development wildcards should not leak into the production origin list. An origin check and CORS are related configuration concerns, but neither is a replacement for verifying a session on a business endpoint.

On a physical phone, a server URL using `localhost` points to the phone. Use a reachable development host or an appropriate secure development tunnel. Keep development endpoints out of production builds. If the callback returns to the wrong build, inspect the scheme, registered app identifiers, and environment rather than adding a permissive redirect wildcard.

## 14. Use the session and authenticate business requests

```tsx
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { authClient } from './auth-client';

export function BetterAuthStatus() {
  const { data: session, isPending } = authClient.useSession();
  const [message, setMessage] = useState('');
  if (isPending) return <Text>Restoring session…</Text>;
  return <View>
    <Text>{session ? `Welcome, ${session.user.name}` : 'Signed out'}</Text>
    {session && <Button title="Sign out" onPress={async () => {
      const result = await authClient.signOut();
      if (result.error) setMessage('Could not sign out. Try again.');
    }} />}
    <Text>{message}</Text>
  </View>;
}
```

Email sign-in uses `authClient.signIn.email({ email, password })`, and sign-up uses the corresponding documented email method with the required name and credentials. Inspect the returned error rather than assuming every method throws. Keep SDK error conventions inside the adapter so the rest of your app has a consistent result model.

The Expo plugin manages native auth cookie storage and auth requests. A separate `fetch` to your own business endpoint does not automatically receive cookies from an unrelated request library. Use the documented client cookie-access mechanism for the installed plugin, or route through an explicitly authenticated client abstraction. Verify the outgoing request in a controlled development environment without printing the cookie itself.

For example, the current integration exposes a cookie string through the Expo client's `getCookie` facility. When using that supported API, attach it as the `Cookie` header to your server request, then let `auth.api.getSession` verify it. Do not parse the cookie to invent your own user identity. Check the exact method availability in the installed types before copying a version-sensitive request helper.

## 15. Email, abuse controls, and recovery are part of authentication

A production identity system needs verified email delivery, password reset, session revocation, and clear recovery behavior. Configure the provider's documented callbacks with a real transactional email service. Store its API key only on the server. Use templates that explain the action and destination without exposing unnecessary account details.

Rate-limit sign-in, sign-up, password reset, and expensive account operations. Use a shared backing store for distributed limits when several server instances run. A process-local map does not enforce a global rate limit across replicas. Balance abuse resistance with legitimate recovery, especially for users traveling or changing devices.

Plan secret rotation and database restoration. Understand which sessions remain valid after a deployment, a signing-key change, or a database restore. Test recovery in a staging environment. An auth service that works until the first secret rotation is not production-ready. Managed providers reduce some of this burden, but your application still owns its account and data lifecycle.

## 16. Compare data authority in the two branches

In the Firebase branch, client security rules govern direct document access, while administrative server code must enforce its own rules. In the Better Auth branch, the auth library verifies identity and your business API enforces SQL ownership. A Postgres database can also provide RLS if you deliberately propagate a secure identity context, but Better Auth does not automatically turn a session cookie into a Supabase-compatible JWT.

Do not connect Better Auth's client directly to a public database API unless that API has a documented and verified integration. The straightforward architecture is mobile client to your API to Postgres. This adds server work but keeps the authority chain explicit. For this branch, that clarity is more valuable than attempting to combine unrelated identity mechanisms casually.

Keep entitlement verification separate from both identity systems. A signed-in user can still be a free user, and a canceled subscriber may retain paid access until the period ends. Store or retrieve premium status through a trusted billing workflow rather than a client-editable profile Boolean. Chapter 07 provides that model.

## 17. Test the boundaries rather than the happy path alone

For Firebase, use the Emulator Suite and rules-testing library where practical. Seed Alice and Bob, verify permitted owner operations, and deny unauthenticated, cross-user, malformed, and forbidden-field writes. Test a broad collection query that should be rejected. A successful owner read does not prove the rules protect any other path.

For Better Auth, test missing cookies, expired sessions, revoked sessions, and a valid session attempting another user's budget ID. Test the handler mount order and production trusted-origin configuration. Verify that the server does not accept `ownerId` from the body as authority. Use a real test database with migrations, because an in-memory fake cannot reveal SQL or schema errors.

For both branches, test sign-out during an in-flight query, password recovery, account deletion initiation, and a cold callback launch. Keep credentials out of recorded evidence. The course's local checks cover dependency-free domain behavior and document structure; these provider-specific tests require your configured services and are not claimed as executed here.

## 18. A worked incident: the app appears signed in but requests fail

In the Firebase branch, inspect whether the current user exists, whether the auth token is valid for the intended project, and whether rules require a verified property that the user has not completed. Do not weaken rules simply because the UI displays a user name. The UI can show cached profile information while the authoritative session is unavailable.

In the Better Auth branch, inspect whether the auth client has a session and whether the business request actually carries the supported credential. Auth requests made through the plugin can succeed while a plain `fetch` is anonymous. Then inspect server session verification and database ownership. This investigation follows the request boundary rather than treating the entire app as one opaque login state.

If the failure occurs only on a phone, check the network host and HTTPS configuration. If it occurs only after a restart, inspect persistence. If it occurs only after a deployment, inspect secrets, migration state, and callback URLs. A precise reproduction narrows the likely layer and avoids random package changes.

## 19. Cost and migration tradeoffs

Firestore costs depend on actual reads, writes, storage, and network patterns. A screen with many active listeners can behave differently from a paginated fetch. A denormalized summary may reduce reads while adding write and reconciliation work. Measure a realistic user journey and multiply by expected usage rather than counting documents alone.

An owned Better Auth server has hosting, database, email, observability, backups, and maintenance costs. Your time is part of the cost even if the software license is permissive. Check current licensing and commercial-service boundaries for the exact packages and deployment services you choose. Do not assume every optional feature has the same license or price as the core library.

Migration requires identity and data planning. Password hashes may not be portable under the conditions you need, provider subjects differ, and active sessions may need reauthentication. Keep internal business IDs independent where practical and document identity mapping. A repository abstraction helps the UI, but does not make a production backend migration free.

## 20. Project work and decision evidence

Implement the same vertical slice in each branch: sign-up, sign-in, session restore, a budget list, budget editing, transaction reading, and deletion initiation. Keep the fixture UI and domain calculations unchanged. Record which adapter code differs and which security rules or server checks enforce the same product invariant.

Use the testing block to produce a two-user isolation report and an offline restart report. Use the comparison block to write an architecture decision with concrete criteria: relational reporting, offline behavior, native services, identity UX, operations burden, cost model, and migration constraints. Select based on your capstone's needs rather than a vendor's marketing headline.

Acceptance evidence includes Firebase rules and indexes, Better Auth server migrations and environment documentation, sanitized test output, and a working session lifecycle on both native platforms. If a particular SDK combination does not compile against SDK 58, record that compatibility result and choose a supported version or alternative; do not silently present an unverified combination as production-ready.

## 21. Deeper walkthrough: a server-side budget update

For the Better Auth branch, design `PATCH /api/budgets/:id` as a complete business operation. The handler verifies the session, parses the ID and body, checks allowed fields, and executes an update constrained by both record ID and verified owner ID. It returns the updated record or an unavailable result without revealing another owner's data.

If the request contains a version, the SQL can also constrain the expected version and increment it on success. Zero updated rows can mean missing ownership or a version conflict; decide how to distinguish those safely for a record the user already owns. Use a stable mutation ID for retries when the operation's effects require it. Write the idempotency result in the same database transaction as the business update.

Return only the fields the screen needs. Avoid returning an entire session object or database row containing internal metadata. Set appropriate cache behavior for authenticated responses. An intermediary caching one user's private JSON under a public URL can create a serious leak even if the SQL query itself was authorized correctly.

For the Firebase branch, the equivalent operation can use a direct document write constrained by rules, or a server function when the workflow needs privileged coordination. Compare the complete behavior, including conflict handling and retries. The client API may be shorter, but the same business invariants still need an enforcement location.

## 22. Deeper walkthrough: summaries without double counting

Suppose a dashboard stores monthly totals for quick reading. A transaction-created trigger increments the total. If the event arrives twice, the total doubles. If a pending transaction becomes posted with another ID, a naive trigger can count both. If the amount changes, a simple create-only increment never corrects the old total.

A reliable design can recompute a bounded month's total from authoritative transactions, or maintain a change ledger with stable source identity and before/after deltas. The choice depends on volume and query costs. For a learning capstone, deterministic recomputation is often easier to reason about than a highly optimized incremental system. Optimize only after measuring a real bottleneck.

Expose the summary's freshness and calculation definition. A cached monthly total is a derived view, not an independent financial truth. If reconciliation detects a mismatch, rebuild it from source data and record a diagnostic without exposing private transaction details. This principle applies equally to Firestore summary documents and Postgres materialized views.

## 23. Further detail: operating a small auth service responsibly

Keep production and staging secrets separate, restrict database network access appropriately, and use a deployment platform that supports your runtime and connection model. A serverless environment may require a connection pooler or driver strategy suited to short-lived instances. A traditional long-running server can own a pool directly but still needs limits and graceful shutdown.

Monitor authentication success and failure rates without collecting passwords, cookies, or raw tokens. A sudden increase in failures can indicate a configuration regression, email delivery problem, abuse, or an upstream provider outage. Build a runbook that starts with safe diagnostics and a rollback path. Support should never ask a user to send their password or bank credentials.

Back up the database and test restoration. Know how a restore interacts with recently revoked sessions and deletion requests. A backup that can restore data but accidentally resurrects a deleted account's access is not a complete recovery plan. Preserve operational records needed to reapply revocations and deletions according to your retention policy.

An optional AI review prompt is: “Compare my Firebase and Better Auth implementations of the same budget feature. Trace identity into authorization, inspect persistence and offline assumptions, review server handler ordering, and identify duplicate-event or retry bugs. Give concrete integration tests and a cost model based on reads, writes, hosting, email, and support. Do not claim a service was tested unless I provide evidence.”

## 24. Complete the Better Auth business-request boundary

The following helper belongs in the native Better Auth branch. It uses the current Expo plugin's cookie access and deliberately omits ambient browser credentials. Its server counterpart is the session-verifying Express handler from this chapter. Keep the cookie in memory only for the request and never log it.

```ts
import { authClient } from './auth-client';

export async function loadOwnBudgets(baseURL: string): Promise<unknown> {
  const cookie = await authClient.getCookie();
  if (!cookie) throw new Error('Sign in before loading budgets');
  const response = await fetch(`${baseURL}/api/budgets`, {
    headers: { Cookie: cookie },
    credentials: 'omit',
  });
  if (response.status === 401) throw new Error('Session expired');
  if (!response.ok) throw new Error('Budgets are unavailable');
  return response.json() as Promise<unknown>;
}
```

The result is still `unknown` because the server response needs parsing before it becomes a domain budget array. A successful session does not guarantee that every historical row has the expected shape. Keep transport validation in the repository and map a session-expired result into a coherent reauthentication flow that preserves safe drafts.

Test this helper against the real local or staging server. First call it without a session and expect a local or server rejection. Then sign in and confirm owner data. Revoke the session server-side and retry. Finally, send an ordinary request with no cookie to show that the business endpoint is not accidentally public. These tests verify the credential handoff that a sign-in screen alone cannot prove.

## 25. Compare a document rule with a SQL ownership predicate

In Firestore, the user-scoped path and rule together establish which documents a caller may access. In the owned API, the verified session and SQL predicate establish which rows the handler returns. Both designs can be correct. Their different enforcement locations affect how you test, debug, and extend them.

When adding a new endpoint or collection, identify the authority explicitly in the code review. If it is a client collection, include its rule tests. If it is a server route, include missing-session and cross-user tests. If it is a privileged background worker, include source verification and operation-identity tests. This habit prevents new features from accidentally relying on a protection that exists only elsewhere in the system.

Keep the comparison grounded in maintainability. A developer comfortable with SQL and server operations may find the owned API easier to reason about. A team invested in Firebase's native ecosystem may prefer rules and document patterns. Your final decision should reflect the product and the people who will maintain it, not the shortest demo snippet.
