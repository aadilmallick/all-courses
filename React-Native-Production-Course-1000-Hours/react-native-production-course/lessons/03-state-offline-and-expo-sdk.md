# 03 — State, networking, offline data, and Expo SDK capabilities

[Previous](02-router-ui-and-mobile-interactions.md) · [Course home](../README.md) · [Next](04-supabase-and-clerk.md)

**Planned time: 110 hours.** Use 16 hours for the explanations, 26 for the query and storage examples, 34 for an offline-capable transaction feature, 24 for native capability labs, and 10 for failure testing. The [SDK catalog](../reference/expo-sdk-catalog.md) is the companion navigation reference for the complete researched top-level SDK inventory.

## 1. State has different owners and lifetimes

A dropdown's open state, a session token, a transaction cache, and a saved budget all change over time, but they do not belong in the same mechanism. Start by asking who is authoritative and how long the information must survive. This is more useful than asking which global-state library is most popular.

| Information | Authority | Appropriate home |
| --- | --- | --- |
| Open sheet or selected tab filter | Current interaction | Component or route state |
| Unsaved budget fields | Current form | Form state, optional draft storage |
| Remote transaction records | Backend | Query cache plus optional local persistence |
| Session credentials | Identity provider | Supported SDK persistence / secure storage |
| Durable offline edits | Local queue until acknowledged | SQLite outbox with explicit sync protocol |
| Derived monthly total | Domain rules applied to records | Pure calculation, optionally memoized |
| Theme preference | User preference | Small persisted settings store |

React context distributes a value through a component tree. Zustand and Redux Toolkit can organize client state when complexity warrants them. TanStack Query manages asynchronous server state. SQLite stores durable local records. These tools overlap in mechanics but differ in responsibility. Copying query data into a global store creates two caches that can disagree unless you define synchronization deliberately.

For PocketPilot, begin with local state for filters, React Hook Form for edits, TanStack Query for remote records, and a repository interface that can later use SQLite. Add a global client store only for shared UI preferences that actually need one. The simplest architecture is the smallest set of explicit owners that matches the product requirements.

## 2. A repository separates meaning from transport

A screen should ask for the user's transactions without knowing whether they come from fixtures, Postgres, Firestore, or an offline cache. A repository contract provides that boundary. It does not erase backend differences; it gives the UI a stable vocabulary while each adapter handles its own semantics.

```ts
export type Transaction = {
  id: string; ownerId: string; merchant: string; amountMinor: number;
  currency: 'USD'; postedOn: string; pending: boolean; categoryId: string | null;
};

export type TransactionPage = {
  rows: readonly Transaction[];
  nextCursor: string | null;
  syncedAt: string | null;
};

export interface TransactionRepository {
  list(input: { ownerId: string; cursor: string | null; signal?: AbortSignal }): Promise<TransactionPage>;
  setCategory(input: { transactionId: string; categoryId: string; mutationId: string }): Promise<void>;
}
```

`ownerId` in the client contract helps scope caches and local storage. It is not proof of identity. A backend adapter must derive the authoritative user from a verified session or token. If it blindly accepts the owner ID supplied by the phone, another person can request someone else's records.

The mutation ID identifies one logical operation across retries. The server must remember or otherwise enforce that identity for idempotency. Generating a new mutation ID every time a network retry occurs defeats the purpose. Create it when the user commits the logical edit, persist it with the queued command, and reuse it until the operation resolves.

## 3. Fetching needs validation, status handling, and cancellation

Use a small HTTP boundary that distinguishes transport failure, HTTP failure, and invalid data. A timeout does not prove the server failed to apply a mutation. A successful HTTP response does not prove the response shape is valid.

```ts
type TransactionSummary = { id: string; merchant: string; amountMinor: number };

function parseRows(value: unknown): TransactionSummary[] {
  if (!Array.isArray(value)) throw new Error('Expected a transaction array');
  return value.map(item => {
    if (typeof item !== 'object' || item === null) throw new Error('Invalid transaction');
    const row = item as Record<string, unknown>;
    if (typeof row.id !== 'string' || typeof row.merchant !== 'string' ||
        typeof row.amountMinor !== 'number' || !Number.isSafeInteger(row.amountMinor)) {
      throw new Error('Invalid transaction fields');
    }
    return { id: row.id, merchant: row.merchant, amountMinor: row.amountMinor };
  });
}

export async function getTransactions(baseUrl: string, token: string, signal?: AbortSignal) {
  const response = await fetch(`${baseUrl}/transactions`, {
    headers: { Authorization: `Bearer ${token}` }, signal,
  });
  if (!response.ok) throw new Error(`Transactions request failed: ${response.status}`);
  return parseRows(await response.json());
}
```

The function is complete, but requires a reachable server implementing the course endpoint. Do not paste a provider's administrative key into `token`. For production, use a short-lived user credential supplied by the chosen auth SDK. Keep tokens out of query keys, URLs, logs, and analytics properties.

Cancellation helps avoid wasting work when a screen no longer needs a request. It does not replace correct query keys or authorization. If account A signs out and account B signs in, a late response for A must not populate B's view. Scope work to the session identity, cancel outstanding work on logout, and clear user-specific caches and local state according to your retention policy.

## 4. TanStack Query models reusable server state

Install the query library and a network-status integration if needed:

```sh
npm install @tanstack/react-query
npx expo install @react-native-community/netinfo
```

Create one query client per application session lifecycle, rather than a new one on every render. In a simple native app, a module-level instance is a reasonable start. Server rendering has additional isolation requirements that do not apply to this basic native example.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function RootLayout() {
  return <QueryClientProvider client={queryClient}><Slot /></QueryClientProvider>;
}
```

Thirty seconds is a teaching configuration, not a universal finance freshness rule. A cached list can remain useful while a background refresh runs. A payment entitlement or account balance can need a different policy. Define freshness according to the consequence of stale data and show a sync timestamp where users rely on recency.

```tsx
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Text, View } from 'react-native';

type Summary = { id: string; merchant: string };
type Props = { userId: string | null; load: (signal: AbortSignal) => Promise<Summary[]> };

export function RecentTransactions({ userId, load }: Props) {
  const query = useQuery({
    queryKey: ['transactions', userId, 'recent'],
    enabled: Boolean(userId),
    queryFn: ({ signal }) => load(signal),
  });
  if (!userId) return <Text>Sign in to view transactions.</Text>;
  if (query.isPending) return <ActivityIndicator accessibilityLabel="Loading transactions" />;
  if (query.isError && !query.data) return <Text>Could not load transactions. Try again.</Text>;
  return (
    <View>
      {query.isFetching && <Text>Updating…</Text>}
      {(query.data ?? []).map(row => <Text key={row.id}>{row.merchant}</Text>)}
    </View>
  );
}
```

The key includes the user identity and view parameters. If a filter affects the result, it belongs in the key. `enabled` prevents a request before identity exists. It does not secure the endpoint. The injected `load` function lets the same component use a fixture repository or a real adapter. A production list uses a virtualized component rather than mapping thousands of rows.

## 5. Native focus and network state need native signals

A browser's focus events are not the same as a mobile app entering the foreground. TanStack's [React Native guidance](https://tanstack.com/query/latest/docs/framework/react/react-native) explains using native app-state and connectivity signals.

```ts
// Install once at application startup; return cleanup for the AppState listener.
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';

export function installQuerySignals(): () => void {
  onlineManager.setEventListener(setOnline => NetInfo.addEventListener(state => {
    setOnline(Boolean(state.isConnected) && state.isInternetReachable !== false);
  }));
  focusManager.setFocused(AppState.currentState === 'active');
  const subscription = AppState.addEventListener('change', state => {
    focusManager.setFocused(state === 'active');
  });
  return () => subscription.remove();
}
```

Network status is a hint. A phone can have Wi-Fi while a captive portal blocks your API. Always handle actual request failures. Avoid a modal that announces “offline” whenever a status signal briefly changes; a subtle persistent indicator often communicates better without interrupting the task.

Install this integration once near the root. Multiple registrations from different screens can override global handlers or leave stale listeners. At logout, cancel in-flight queries before clearing user data, then reset the repository and local queue ownership. Test account switching deliberately; it is a privacy boundary, not merely a navigation detail.

## 6. Mutations require a recovery plan

An optimistic category change can feel immediate. Before applying it, cancel relevant queries, snapshot the old value, and update the cache. If the server rejects the mutation, restore or reconcile the previous state. When the request settles, invalidate the authoritative query. This is the standard shape, but concurrent mutations make naive rollback dangerous.

Suppose the user changes a category twice quickly. The first request fails after the second succeeds. Restoring the entire first snapshot can erase the successful second change. Better strategies include serializing edits to the same record, tracking operation versions, or reconciling by mutation identity rather than replacing an entire cache snapshot. Choose a policy and test out-of-order responses.

For finance records, a conservative initial UX can show the proposed category with a pending indicator until confirmation. The interaction still feels responsive while making uncertainty visible. A failed mutation should preserve enough information to retry or discard. Never label a local optimistic update as a confirmed bank fact.

## 7. Storage choices follow data requirements

AsyncStorage is useful for small non-sensitive preferences. SecureStore protects small sensitive values using platform facilities. SQLite supports structured durable local data and queries. FileSystem stores files. None of these automatically synchronizes with a backend.

SecureStore is not a ledger database. Its documented behavior includes platform limitations and possible rejection of large payloads. Treat token persistence through an auth SDK's supported adapter separately from a user-facing biometric gate. Read the [SecureStore reference](https://docs.expo.dev/versions/latest/sdk/securestore/) before assuming uninstall, backup, and biometric-enrollment behavior are identical across platforms.

SQLite is not encrypted by default merely because the phone has a lock screen. If your threat model requires application-level database encryption, evaluate the supported SQLCipher configuration, key management, backup policy, and recovery behavior in a development build. Encryption without a key-lifecycle plan can create permanent data loss or a false sense of protection.

## 8. Build a small SQLite cache with safe queries

```sh
npx expo install expo-sqlite
```

```ts
import * as SQLite from 'expo-sqlite';

export async function openLedger() {
  const database = await SQLite.openDatabaseAsync('pocketpilot.db');
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      merchant TEXT NOT NULL,
      amount_minor INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (owner_id, id)
    );
    CREATE INDEX IF NOT EXISTS transactions_owner_date
      ON transactions(owner_id, updated_at DESC, id DESC);
  `);
  return database;
}

export async function cacheTransaction(input: {
  ownerId: string; id: string; merchant: string; amountMinor: number; updatedAt: string;
}) {
  if (!Number.isSafeInteger(input.amountMinor)) throw new Error('Invalid amount');
  const database = await openLedger();
  await database.runAsync(
    `INSERT INTO transactions(id, owner_id, merchant, amount_minor, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(owner_id, id) DO UPDATE SET merchant=excluded.merchant,
       amount_minor=excluded.amount_minor, updated_at=excluded.updated_at`,
    input.id, input.ownerId, input.merchant, input.amountMinor, input.updatedAt,
  );
}
```

This complete native example creates a table and performs a parameterized upsert. `execAsync` is used only for trusted static schema text. User values go through parameters. A string built by concatenating a merchant name into SQL would create injection and escaping problems. The [SQLite documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/) provides the current async API and transaction options.

Opening the database repeatedly is acceptable for this isolated demonstration, but a real repository should own one connection lifecycle. Add schema migrations using an explicit version, execute related writes atomically, and test upgrades with an existing database fixture. A fresh-install test cannot detect a migration that destroys a user's old data.

## 9. An outbox makes offline intent durable

An offline mutation is a command waiting for a server acknowledgment. Store its identity, owner, payload, creation time, retry state, and target record version. Do not store only the optimistic UI value, because you then lose the information needed to explain or retry the change.

```sql
CREATE TABLE IF NOT EXISTS outbox (
  mutation_id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT,
  state TEXT NOT NULL CHECK (state IN ('queued','sending','blocked'))
);
```

The sync worker selects queued commands belonging to the current user, marks an attempt, sends the same mutation ID, and removes the command only after a durable acknowledgment. If the app dies while a command is `sending`, startup recovery must make it eligible for retry. The server's idempotency record prevents duplicate application.

Classify errors. A temporary network failure can retry with exponential backoff and jitter. A validation failure should become blocked with an actionable explanation. An expired session should trigger authentication recovery, not thousands of retries. A conflict needs a product decision: server wins, client wins under a specific rule, or the user resolves it. Do not call last-write-wins “correct” without considering which edits can be lost.

Delete or quarantine user-specific queued work on logout according to an explicit UX and privacy policy. Never send account A's queued command under account B's session. A local owner ID check and a server owner check are both necessary, because they protect different boundaries.

## 10. Native capabilities share a common integration pattern

For every Expo module, ask five questions: what is the user benefit, which platforms support it, what native configuration is required, when is runtime permission requested, and what is the fallback? This pattern is more valuable than memorizing a list of methods.

The complete top-level catalog in this package maps all researched Expo SDK entries to their TypeScript entry points and official references. New, legacy, alpha, and platform-specific entries are labeled separately. It is a navigation and lab reference, not a claim that one finance application should use every sensor. Installing unneeded capabilities increases maintenance and can complicate privacy declarations.

Request permissions when the user initiates a relevant action. A receipt-import button can explain why camera access is useful. The first app launch should not demand camera, contacts, location, notifications, and tracking simultaneously. Denial is a normal supported state. Provide a useful alternative, and do not repeatedly pressure the user after they refuse.

## 11. Biometrics protect a local action; they do not create a cloud identity

Face ID and Android biometrics answer whether the device accepts the current local authentication attempt. They do not tell your server which finance account owns a row. Sign in with Apple is an identity-provider flow. A passkey is a cryptographic authentication mechanism with its own server verification. These are related user experiences with different security semantics.

```sh
npx expo install expo-local-authentication expo-secure-store
```

```ts
import * as LocalAuthentication from 'expo-local-authentication';

export async function confirmLocalUnlock(): Promise<boolean> {
  const available = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!available || !enrolled) return false;
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock PocketPilot',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });
  return result.success;
}
```

Configure the Face ID usage description through the module's plugin and rebuild the binary. Face ID cannot be fully tested in Expo Go according to the [LocalAuthentication reference](https://docs.expo.dev/versions/latest/sdk/local-authentication/). Test cancellation, no enrollment, lockout, device-passcode fallback, and app backgrounding during the prompt.

A simple Boolean UI gate can hide a screen after backgrounding, but a compromised client can bypass it. Sensitive server operations may require recent server-side authentication. If a stored credential uses `requireAuthentication`, understand what happens when biometric enrollment changes or the credential becomes unavailable. Provide account recovery rather than permanently trapping the user outside their own data.

## 12. Sign in with Apple and browser authentication

`expo-apple-authentication` provides the native iOS Sign in with Apple interaction. The resulting identity token must be verified by your backend or exchanged through your auth provider. Do not accept an arbitrary user ID sent from the phone as proof of an Apple identity. Apple can provide name information only during particular authorization moments, so persist the appropriate profile fields through the supported flow.

```ts
// Native UI step only. Exchange and verify the identity token using your chosen provider.
import * as AppleAuthentication from 'expo-apple-authentication';

export async function requestAppleIdentity() {
  const supported = await AppleAuthentication.isAvailableAsync();
  if (!supported) throw new Error('Apple sign-in is unavailable on this device');
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  if (!credential.identityToken) throw new Error('No Apple identity token returned');
  return credential;
}
```

This is an intentionally bounded native step, not a complete authentication backend. Production exchange must follow the chosen provider's nonce, audience, and callback requirements. Chapter 04 shows how that identity becomes an authorized session. The [AppleAuthentication reference](https://docs.expo.dev/versions/latest/sdk/apple-authentication/) contains capability setup and current platform support.

Browser-based OAuth uses AuthSession and WebBrowser where appropriate, usually through an auth SDK that manages PKCE and callback state. PKCE binds the code exchange to the initiating client. A deep link alone is not proof that the flow succeeded. Let the SDK validate state and exchange the authorization code rather than manually parsing tokens from arbitrary URLs.

## 13. Files, receipt import, and sharing

A receipt feature combines user-selected files, local temporary storage, upload validation, and server-side ownership. Use DocumentPicker for documents or ImagePicker for a photo-library selection. The picker can return cancellation normally. A local URI is not a server URL and may not remain available indefinitely. Copy or process the file according to the API's documented lifetime.

```ts
import * as ImagePicker from 'expo-image-picker';

export async function chooseReceipt(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], quality: 0.8,
  });
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}
```

Use the current picker permission guidance rather than requesting broad library access unnecessarily. Validate file size, MIME type, and content on the server as well as the client. A file extension supplied by the phone is not reliable proof of its format. Strip unnecessary metadata when your product and processing pipeline allow it.

The modern FileSystem API uses file and directory objects. Older tutorials often use legacy URI helpers; those belong to the explicit legacy entry point where still supported. Do not mix the two styles accidentally. A simple synthetic report export can use:

```ts
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function shareDemoReport() {
  const file = new File(Paths.cache, 'pocketpilot-demo.txt');
  file.create({ overwrite: true });
  file.write('Synthetic finance report\nPosted spending: USD 42.35\n');
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: 'text/plain' });
  }
}
```

The report is synthetic and intentionally small. Real exports need a privacy explanation, correct currency and date definitions, and careful temporary-file cleanup. Sharing hands data to another application; it is an explicit user action with a different exposure boundary from a private in-app view. See the [modern FileSystem reference](https://docs.expo.dev/versions/latest/sdk/filesystem/).

## 14. Notifications need permission, delivery, and interpretation

There are local notifications scheduled on the device and remote notifications delivered through a push service and native platform infrastructure. A push token identifies a delivery destination; it is not your application's user identity. Tokens can change, and users can have several devices. Store them with ownership and revocation rules.

For an Android local notification, create an appropriate channel before scheduling. Request notification permission at a meaningful point, such as enabling bill reminders. Keep notification text discreet by default. “A new bill estimate is available” exposes less than a merchant, exact amount, and account name on a locked phone.

```ts
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export async function sendLocalDemoReminder() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('bills', {
      name: 'Bill reminders', importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'PocketPilot', body: 'Your demo bill summary is ready.' },
    trigger: null,
  });
  return true;
}
```

Configure foreground presentation separately using the current notification-handler API. Remote notifications require additional credentials and a development or release build; do not infer their behavior from a local notification. Test disabled permissions, token rotation, foreground delivery, background taps, and a cold launch. The [notifications reference](https://docs.expo.dev/versions/latest/sdk/notifications/) is the source for current platform details.

## 15. Background work is opportunistic on phones

A server can run a scheduled bank-sync worker independently of whether the app is open. A phone's background task is subject to operating-system decisions about battery, usage, and resources. Do not promise that a mobile task will run at exactly 8:00 every morning. Use server-side scheduling for business-critical refreshes and treat device background work as an optimization.

`expo-background-task` works with TaskManager for deferrable work. Define tasks in module scope so the runtime can find them when no screen is mounted. Register them according to the module's current platform requirements. Keep tasks bounded, resumable, and safe to repeat. If the system does not run one, the foreground refresh path must still make the app correct.

The [BackgroundTask reference](https://docs.expo.dev/versions/latest/sdk/background-task/) explains that the system decides when work executes. Avoid building a bank-sync design around the older BackgroundFetch API merely because a tutorial uses it. The catalog retains legacy entries so you can recognize them and choose a current migration path.

## 16. Media, location, sensors, and platform utilities

Use `expo-audio` for current audio features and `expo-video` for video playback rather than starting a new feature with a deprecated media API. A finance app might include a short onboarding video, but it should not autoplay loudly or make essential information available only through audio. Pause playback appropriately when navigation or app state changes.

Location, contacts, calendar, and sensor capabilities are optional specialty labs for this product. Build a tiny separate screen that requests permission in context, reads one result, handles denial, and cleans up subscriptions. Do not add location tracking to a budget app without a real user benefit. Permission minimization is both a UX and maintenance advantage.

Haptics can confirm a successful interaction, but should not fire repeatedly during loading or replace visible feedback. Localization supplies locale and calendar information; use it to select formatting, not to infer sensitive personal characteristics. Network and device modules support diagnostics, but avoid collecting stable identifiers without a clear requirement. Tracking transparency applies to particular tracking behavior, not to every ordinary analytics event indiscriminately.

Print, MailComposer, SMS, StoreReview, ScreenCapture, ScreenOrientation, brightness, and system-bar modules all interact with platform policy or user control. Wrap each behind a small capability adapter, handle unavailability, and test on actual target devices. A module's presence in the catalog does not guarantee every method works on every operating system or in Expo Go.

## 17. A reliable sync cycle

On foreground entry, restore the session, open the user-scoped local repository, show cached data with its timestamp, and begin a refresh. Drain permitted queued mutations using stable operation IDs. Pull authoritative server changes, apply them atomically, and update the timestamp only after successful application. If a step fails, preserve the last consistent local state and expose an actionable status.

Do not update the timestamp when the request merely starts. Do not delete cached transactions until the server confirms a complete replacement or provides explicit tombstones. Pagination and incremental sync require a precise contract: a partial page is not a complete dataset. A refresh that clears the local table before the network finishes can destroy useful offline access.

When a user disconnects a bank, stop future synchronization and revoke the provider connection as appropriate. Decide whether historical data remains until the user deletes it. Explain that choice clearly. A local cache must respect the same product policy and eventually remove data that has been deleted remotely.

## 18. Project work and failure scenarios

Build one repository that serves fixtures and another that persists a local transaction cache. Add a query layer, a user-scoped cache key, a manual refresh action, and a durable category-edit outbox. Simulate success, temporary failure, authentication expiry, validation rejection, and out-of-order mutation responses. The repository interface should remain stable while its implementation changes.

For native labs, implement local biometric unlock, receipt selection, a synthetic export, a local reminder, and a foreground refresh listener. Choose one additional media or sensor module to understand the general integration pattern. Use the SDK catalog to explore the rest without adding every permission to the capstone.

Acceptance evidence includes a restart while offline, a retry that does not duplicate a mutation, account switching with no stale data leakage, and a migration from an older local schema. Record which native flows were tested on Android and iOS. A mocked permission result proves your UI handles a state; it does not prove the platform permission configuration is correct.

## 19. Deeper walkthrough: an interrupted budget update

The user changes Food from 300 dollars to 350 dollars while offline. The app validates the draft, assigns a mutation ID, and writes both the proposed local value and the outbox command in one SQLite transaction. If only one write succeeds, the UI and queue can disagree, so atomicity matters even on a single phone.

The network returns. The worker sends the command, the server applies it, and then the connection drops before the response reaches the phone. The client cannot know whether the operation succeeded. It must retry the same logical mutation. The server returns the prior result for that mutation ID instead of applying a second independent change. This is why local button disabling cannot solve distributed duplicate delivery.

Now suppose the user edits the same budget on another device before the retry. A versioned command can detect the conflict. The server can report the current value and the version it accepted. The app then explains that the budget changed elsewhere. For a simple limit replacement, an explicit user choice is often safer than silently resolving by device clock, because device clocks can be wrong and the latest timestamp may not represent the user's desired outcome.

After acknowledgment, remove the queued command and refresh the authoritative budget. If the app crashes before local cleanup, replay remains safe because the mutation identity is durable. If the user logs out before replay, the command must not be sent using another account's credentials. These cases are ordinary consequences of mobile networks and application lifecycle, not rare theoretical problems.

## 20. Deeper walkthrough: native capability boundaries

Suppose receipt selection works in Expo Go, but a new bank-link SDK fails immediately. The picker is supported by the current host binary, while the bank SDK requires custom native code. The correct next step is to build a development client containing that SDK, not to keep clearing Metro's cache. This diagnosis follows the runtime model from Chapter 01.

Suppose a biometric prompt succeeds, yet the backend rejects a budget update. The local device gate and the remote session are independent. The remote token may have expired or the user may lack access to that household. Refresh or reauthenticate through the identity provider, then retry under the normal authorization policy. Do not translate local biometric success into an invented server credential.

Suppose a reminder never appears at an exact requested time. Inspect whether it was a local notification, a remote notification, or a background task that was supposed to create one. Each has different scheduling and delivery semantics. A server push can still be delayed or suppressed by device settings. Design reminders as helpful assistance with clear controls, rather than a guarantee that substitutes for a user's financial obligations.

An optional AI review prompt is: “Review this repository and sync design for account switching, idempotency, partial-page replacement, migration safety, permission denial, and foreground/background behavior. Separate verified API facts from proposed architecture. Propose failure-injection tests with synthetic data, and do not request or log real financial credentials.” Use the review to improve your test plan and verify every claim against actual behavior.

## 21. Capability lab: permission denial and recovery

Build a small receipt-import screen with four visible states: no selection, selected preview, permission unavailable, and processing failure. Keep selection cancellation separate from failure. A user who closes the picker has simply changed their mind. The screen should remain usable and should not display a red error merely because no image was chosen.

When permission is denied, explain which feature needs it and offer a supported alternative such as choosing a document or continuing without a receipt. If the operating system no longer allows another prompt, provide an appropriate settings path after the user requests help. Do not open settings automatically or repeatedly request the same permission on every render. That behavior teaches users to distrust the app.

Test a selected file that is too large, an unsupported format, a temporary URI that becomes unavailable, and a failed upload. Preserve the user's transaction context while reporting the receipt problem. A receipt failure should not silently discard an otherwise valid category edit. Keep independent operations independent unless the product explicitly requires atomic behavior.

After upload, store only the authorized object reference in the transaction annotation. Generate a short-lived access URL when displaying the receipt. On logout, clear the preview and any temporary file according to your privacy policy. On deletion, remove both the metadata and object through a retryable server workflow. This lab connects a native capability to the data lifecycle instead of treating the picker as an isolated success demo.

## 22. Capability lab: selecting a storage policy

Write down a storage inventory for the app. For each value, record its sensitivity, authority, expected size, lifetime, backup behavior, and deletion trigger. A theme preference is small and non-sensitive. A session credential is small and sensitive. A transaction cache is structured and potentially large. A receipt is a file. An outbox command is durable intent that must remain tied to the creating user.

Then assign the mechanism and test the lifetime. Restart the app, sign out, switch users, reinstall in a controlled test environment, and restore a backup where practical. Document what actually survives. Platform behavior can differ, so avoid describing uninstall as a universal secure-deletion mechanism. Your application's explicit cleanup remains important.

This inventory also clarifies encryption decisions. Encrypting a database requires protecting and recovering its key. A key stored beside the database without meaningful access separation may not protect the threat you care about. A key that cannot be recovered can make legitimate data permanently unreadable. Define the threat and recovery model before selecting the mechanism.

Finally, review the sync UI against the inventory. Cached data should show freshness, queued commands should show pending status, and confirmed server data should show successful completion only after acknowledgment. When the storage model and language match, users can understand what happened even when the network is unreliable.
