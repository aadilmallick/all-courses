# 04 — Identity, browser linking, subscriptions and offline entitlements

[Previous](03-ui-data-and-offline.md) · [Course index](../README.md) · [Next](05-agent-runtime-and-hermes-capstone.md)

**Planned workload: 120 hours.** Identity concepts and flow design 20; browser callback and linking implementation 25; credential lifecycle and offline behavior 20; checkout and entitlement backend 25; failure simulation and integration 30.

## 1. Four questions that must stay separate

Authentication asks who a caller is. Authorization asks which operations that identity may perform. Billing records purchases, subscriptions and payment lifecycle. Entitlements translate verified commercial or administrative state into feature access. A paid user can have an expired login, and an authenticated user can have no paid plan. These are different states with different recovery actions.

A desktop application is a **public client**. Its binary is distributed to users and can be inspected. It cannot keep an OAuth client secret or payment processor secret confidential from its owner. The main process is privileged relative to the renderer, but it is not your private server. Put backend credentials and authoritative billing decisions on a service you control.

For Atlas Desk, local history and drafts can exist without an account. Cloud synchronization, hosted model credits and organization administration require an authenticated backend. A subscription might unlock extra local features, but the server must enforce access to server resources regardless of what the desktop UI displays.

A biometric or OS-unlock prompt can protect local access to a stored credential. It does not create a new cloud identity proof by itself. Likewise, “this device was activated” is not the same as “the current human is authorized for every organization.” Keep device registration, local unlock, account sessions and paid entitlements separate in your model.

## 2. The standard native-app OAuth pattern

For an OAuth provider supporting native public clients, use an external browser, an authorization code and PKCE. A callback returns the code to the app; the app exchanges it using its temporary verifier. This is the conceptual route documented by [RFC 8252](https://www.rfc-editor.org/rfc/rfc8252). Use a maintained provider SDK where possible rather than building a general OAuth library from tutorial fragments.

The browser is useful because it already has the user's login session, password manager and trusted identity UI. An embedded login window can interfere with those expectations and may be rejected by providers. Never ask users to paste their identity-provider password into an unrelated desktop form you wrote merely to avoid implementing the browser round trip.

PKCE binds an authorization attempt to a random verifier created by the app. The app sends a hash-based challenge in the authorization request and retains the verifier until exchanging the code. Someone who intercepts only the code should not be able to complete that exchange. State correlates the response with the attempt; an OIDC nonce serves a different role in validating an identity token.

The exact endpoints, scopes, redirect forms and validation requirements depend on the provider. Read discovery metadata through a trusted configuration and validate issuer, audience, signatures and relevant claims through a maintained library. Decoding a JWT payload is not signature verification. A readable string containing your user ID does not establish trust.

## 3. A complete small PKCE experiment

Save the following as `pkce-demo.mjs` and run `node pkce-demo.mjs`. It uses only Node built-ins and prints a sample challenge. It does not perform a real login or contain credentials.

```js
import { randomBytes, createHash } from 'node:crypto';

const verifier = randomBytes(32).toString('base64url');
const state = randomBytes(32).toString('base64url');
const challenge = createHash('sha256').update(verifier).digest('base64url');

const request = new URL('https://identity.example/authorize');
request.searchParams.set('response_type', 'code');
request.searchParams.set('client_id', 'public-desktop-client');
request.searchParams.set('redirect_uri', 'http://127.0.0.1:43123/callback');
request.searchParams.set('code_challenge_method', 'S256');
request.searchParams.set('code_challenge', challenge);
request.searchParams.set('state', state);

console.log('Verifier length:', verifier.length);
console.log('Challenge length:', challenge.length);
console.log('Sample request:', request.href);
```

The output lengths are 43 characters for these 32-byte base64url values. The actual values vary. The domain ending in `.example` is intentionally nonfunctional; replace configuration only when implementing a registered provider flow. Never log the verifier, authorization code or tokens in a real application. This experiment prints only a public challenge and temporary state in a nonproduction demonstration.

The companion's auth domain example goes further: it checks pending attempt ID, state, expiry and one-time consumption. The real implementation must also exchange the code, validate the provider response and store resulting credentials. Those network and provider-specific steps are not simulated as if they were production authentication.

## 4. Redirect choices and lifecycle

A loopback callback opens a local HTTP listener bound to a loopback IP, typically on an available port. Bind before opening the browser, register the exact redirect pattern supported by the provider and accept only the expected path and attempt. Close the listener after success, cancellation or expiry. Do not bind to every network interface.

A custom scheme such as `atlas-auth://callback` lets the operating system route a link to the application. Another application may claim the same scheme, so the callback still needs correlation and code protection. Register the scheme in the packaged OS metadata and handle both an already-running application and a cold start. On macOS listen early for `open-url`; on Windows and Linux examine the appropriate startup and second-instance arguments.

A claimed HTTPS link can provide stronger association where the OS and provider support it, but it adds domain association and platform setup. Do not casually call any link with your website's hostname an “app link.” Verify the actual platform association and fallback behavior.

For all routes, reject unexpected hostnames, paths, repeated parameters, stale attempts and error responses. Do not implement callbacks as “any URL with `token=` logs the user in.” Keep bearer tokens out of URL query strings, clipboard fallbacks and routine logs. A browser callback should carry a short-lived code or one-time linking reference, not a durable session secret.

## 5. Device authorization and browser-to-device linking

The device authorization grant is useful when browser handoff or input is constrained. The application obtains a user-facing code and verification URL, shows them to the user and polls according to the provider's interval. The user approves in a browser. [RFC 8628](https://www.rfc-editor.org/rfc/rfc8628) defines this flow; it is not an offline login technique.

Display the code clearly, make the verification destination recognizable and warn users to approve only attempts they initiated. Polling must honor pending, slowdown, denied and expired outcomes. A spinner that polls as fast as possible is both wasteful and contrary to the purpose of a defined polling interval.

Browser-to-device linking can also be implemented through your own backend when your web authentication provider does not directly offer the native flow you need. The desktop creates a random secret and public attempt identifier, opens a browser link for that attempt and retains the secret locally. After web login, the user confirms linking the named device. The desktop proves possession of its secret to claim the resulting session once.

Design that custom protocol carefully. Bind the claim to the original attempt, short expiry, account, device and confirmation action. Store only an appropriate hash of the claim secret server-side, rate limit attempts and consume claims atomically. A public attempt ID should never be sufficient to claim a session. Treat this as a security-sensitive backend feature requiring review, not a few lines of URL parsing.

Provide a manual fallback that preserves those properties: a user can open a trusted verification page and enter a short code, while the desktop still retains its high-entropy secret. Do not ask the user to paste a long-lived API token into an arbitrary deep link. Explain expiry and cancellation clearly and keep the user on an identifiable official domain.

## 6. Clerk's current Electron route

At the research date, Clerk provides a **beta** Electron SDK with main, preload and React entrypoints. Its default storage peer is `electron-store@8`. Enable the Native API, configure exact allowed origins and test packaged OAuth behavior. Read the [Electron SDK reference](https://clerk.com/docs/reference/electron/overview) for supported and unverified methods; do not assume browser SDK parity.

The integration shape is intentionally small here, because beta signatures must be rechecked before implementation:

```ts
// Main-process integration fragment.
import { createClerkBridge } from '@clerk/electron';
import { storage } from '@clerk/electron/storage';

const clerk = createClerkBridge({
  storage: storage(),
  renderer: { scheme: 'atlas', host: 'app' }
});
// Coordinate clerk.isPrimaryInstance with your application lifecycle.
```

```ts
// Preload integration fragment; bundle through your preload build.
import { exposeClerkBridge } from '@clerk/electron/preload';
exposeClerkBridge();
```

The renderer imports its provider and components from `@clerk/electron/react`; the exact provider configuration belongs in the current quickstart. Keep Clerk's bridge and your application bridge separate, each with controlled navigation. Do not copy browser-only server helpers into the main process.

The [quickstart](https://clerk.com/docs/electron/getting-started/quickstart) includes an older scaffold recipe than Forge 8's current release notes. Retain the process integration concepts, but resolve toolchain compatibility from the versions you actually pinned. In particular, do not downgrade a current Vite build by blindly copying a plugin pin written for a prior CommonJS template.

The [deep-link guide](https://clerk.com/docs/guides/configure/auth-strategies/oauth-deep-links) requires packaged-app testing for OAuth on macOS and Linux and explains callback registration. Treat successful `npm start` email login as only one test case. Browser round trip, cold start, second instance and relaunch persistence need separate evidence.

## 7. Credentials and refresh lifecycle

Keep refresh credentials out of the renderer and store them through an OS-backed mechanism where available. Electron's [safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage) now exposes asynchronous APIs; decryption returns an object containing `result` and rotation information. Its protection varies by platform and available key provider. Encryption is not protection from every process running as the same user.

Do not assume “encryption available” alone establishes a strong secret-store backend on every Linux desktop. Inspect the pinned version's provider behavior and reject insecure fallback for durable credentials. Offer memory-only sessions when secure persistence cannot be established, and explain that the user will sign in again after restart.

A single-flight refresh service prevents several windows from rotating the same refresh token simultaneously. All callers awaiting the same refresh should share its result. On sign-out, increment an identity generation counter, abort refresh requests and discard results belonging to an earlier generation. Otherwise a late refresh can silently sign a user back in after logout.

Distinguish temporary secret-store unavailability from permanent decryption failure. A locked keychain may recover after user action. A corrupted credential should not cause the app to loop forever. Preserve local noncredential data, clear unusable session material through a deliberate policy and provide a safe reauthentication route.

For key rotation, use the pinned API's reported decrypted value and re-encrypt through the supported API. The live documentation snapshot contained wording that should be checked against typings and release notes before implementing the rewrite step. Avoid embedding an unverified rotation algorithm in your credential adapter. Test migration with real signed builds because keychain identity can differ from development.

## 8. Offline identity and progressive degradation

A fresh login cannot happen without reaching an identity authority. Offline support therefore begins with a previously established local state, not a fake authentication success. Allow local history, drafts and suitable local tools. Pause cloud requests and show the last known account in a way that does not imply its session was just verified.

Use an explicit state model: guest, signed in and verified, temporarily offline with cached identity, expired and requiring login, or signed out. Feature availability is a separate calculation using local capability, entitlement and network requirements. Avoid a single global `isLoggedIn` boolean controlling the entire application shell.

If the application sells offline functionality, an entitlement lease can be signed by the backend and verified locally with a bundled public key. Include product, account, device binding if required, features, issue time, expiry and a key identifier. Rotate signing keys through a planned overlap. A renderer-editable JSON object is not a lease.

Offline leases involve tradeoffs. Immediate revocation is impossible while a device is disconnected. A short lease reduces exposure but harms long offline use. Local clock rollback complicates expiry checks. A desktop controlled by its owner cannot offer absolute tamper resistance. Keep server costs enforced server-side and state these limits in your licensing design.

## 9. A payment flow with a clear authority chain

For direct distribution, a common route is hosted checkout in the system browser. The desktop calls your backend with its authenticated session. The backend maps the account to an allowed product and creates a checkout session using its secret payment key. The desktop opens the returned trusted URL. Payment confirmation arrives at your backend through verified processor events.

[Stripe Checkout](https://docs.stripe.com/payments/checkout) supplies hosted checkout surfaces; your backend still owns account mapping, product selection and fulfillment. Never let the renderer submit an arbitrary price amount or another user's customer identifier and treat it as authorized. Use server-side allowlists and account-scoped records.

A checkout success page improves navigation, but it is not payment proof. The browser may close before returning to the app, the callback may arrive before the webhook or the payment may complete asynchronously. After returning, the desktop asks the backend for current entitlement state and displays pending status while necessary.

Store payment processor customer IDs in backend records, not as user-controlled claims. Protect customer-portal creation too. A portal session for the wrong customer would expose billing data. The same authentication, authorization and audit discipline applies to refund, cancellation and plan-change routes.

## 10. Webhooks are durable backend work

Verify the webhook signature using the raw request body and the configured endpoint secret. Parsing and reserializing JSON before verification can change the signed bytes. Use the processor SDK and current endpoint documentation. [Stripe's webhook guide](https://docs.stripe.com/webhooks) is the authoritative setup reference.

Acknowledge only after the event is durably recorded or queued according to your reliability design. Deduplicate by processor event identifier. Process retries idempotently. Event delivery order may not match the order you wish it had, so reconcile against current authoritative objects rather than trusting whichever event happened to arrive last.

Model subscription states explicitly: trial, active, payment pending, delinquent, cancelled at period end and expired are useful distinctions. Define whether existing local work remains accessible after expiration. Avoid holding a user's private data hostage because a payment is overdue; paid execution and data export are separate policy decisions.

A compact entitlement service can translate provider state into product features. For example, a verified plan may allow more workspaces or hosted inference quota. The desktop gets only the features and limits relevant to its UI. The hosted inference service independently enforces quota so patching the UI cannot create unlimited server cost.

## 11. Clerk Billing versus direct Stripe Billing

Clerk Billing uses Stripe for payment processing but is a separate product from Stripe Billing; its plans and subscriptions are not simply mirrored Stripe Billing objects. Its documentation describes a web checkout surface. See [Clerk Billing overview](https://clerk.com/docs/guides/billing/overview). Do not invent a desktop checkout API because Clerk authentication already works in Electron.

Choose one authoritative subscription model per product. If you use Clerk Billing, follow its event and entitlement model on your web/backend surface. If you use Stripe Billing directly, own the checkout, webhook and subscription reconciliation. Mixing two independent subscription records without a deliberate mapping can create users who paid in one system and appear unpaid in the other.

For Atlas Desk, implement direct Stripe hosted checkout as the baseline learning route. Add a separate comparison implementation using a web account portal backed by Clerk Billing if it fits your product. Keep the desktop-facing entitlement interface identical so the renderer does not depend on the billing vendor's internal object model.

Test trials, cancellation, upgrade, downgrade, renewal failure, payment recovery, refunds and duplicate callbacks. Use sandbox/test environments rather than real charges. A successful one-time checkout is only one point in a subscription's lifecycle.

## 12. Store distribution changes the decision

Mac App Store distribution has payment and sandbox rules that must be checked for the product, storefront and current program. Do not assume an external Stripe purchase button is permitted for every digital feature. Electron has an [inAppPurchase API](https://www.electronjs.org/docs/latest/api/in-app-purchase) for Mac App Store purchasing; transaction lifecycle and server verification still matter.

Microsoft's rules for non-gaming applications can permit third-party commerce, but package type and current policy still need review. See [Microsoft Store policies](https://learn.microsoft.com/windows/apps/publish/store-policies). Avoid importing mobile app assumptions into desktop stores, or assuming all desktop stores share the same rule.

Implement a distribution-channel capability configuration. A direct edition, Mac App Store edition and organization-managed edition may expose different purchase surfaces and update owners. Keep the entitlement model stable even when payment acquisition changes. An edition's channel is build/distribution evidence, not a renderer query parameter.

The course does not promise that an unrestricted agent with arbitrary shell execution will pass Mac App Store review. A reduced edition might connect to a remote agent or constrain local features. Chapter 07 turns that product choice into build and release architecture.

## 13. Guided implementation and failure laboratory

Build the browser flow with a fake local identity service first. Generate attempts, expire them, cancel them and reject duplicate callbacks. Test two overlapping attempts and a callback received after logout. Use the same attempt validator from the companion tests, then integrate a real provider through a maintained SDK.

Next implement credential persistence through an interface with secure, unavailable and memory-only modes. Test startup while the keychain is locked, relaunch after a signed build update and account switching during refresh. Record which scenarios were simulated and which were exercised on a real OS.

Add the payment backend in test mode. Create an account-scoped checkout session, receive verified events, deduplicate them and expose entitlements. Return from the browser before event processing finishes and show a pending state. Then process a duplicate event and confirm the feature grant does not duplicate credits.

Finally run an offline scenario: verified user, cached lease, disconnected device, expired lease and later reconnection. Ensure local history remains accessible according to policy. Make a cloud request with an expired session and confirm the backend rejects it even if you manually change the desktop's visible plan label.

## 14. Debugging and completion evidence

If login works in development but not after installation, inspect scheme metadata, exact redirect allowlists, signing identity and startup argument routing. If it works in one window but not another, inspect bridge ownership and origin policy. Do not loosen every origin restriction merely to discover which one was wrong.

If users buy successfully but remain locked out, trace account mapping, processor event ID, webhook verification, durable processing and entitlement refresh. A browser callback may be missing without affecting payment completion. Support should be able to inspect this chain using safe IDs without asking users for tokens or card data.

Completion evidence includes the auth state machine, callback test results, storage fallback policy, test-mode subscription lifecycle, webhook idempotency evidence and a distribution-channel payment decision record. The goal is not simply a login form and a pay button; it is a coherent authority chain that still behaves predictably when the browser closes, the device disconnects or a payment event arrives twice.

## 15. Worked authorization example: resource, account and feature

An API route that accepts a conversation ID should first verify the presented session using the backend's trusted identity configuration. It then loads the conversation under that account or organization and checks the required feature. Each check answers a different question. A verified token alone does not authorize another account's conversation, and a valid subscription does not authorize an arbitrary resource.

The following is **backend pseudocode**, deliberately independent of a web framework:

```text
handleExport(request):
    identity = verifySession(request.authorization)
    conversation = repository.findForAccount(identity.accountId, request.id)
    if conversation is absent:
        return resourceNotFound
    entitlement = entitlements.current(identity.accountId)
    if exportFormatRequiresPaidFeature(request.format):
        require entitlement.includes("advanced-export")
    return createBoundedExport(conversation, request.format)
```

The repository query is scoped by account rather than loading an arbitrary record and hoping every caller remembers a later check. Organization membership can change, so use current membership rules appropriate to the resource. A device's cached list of organizations is a convenience display, not the backend's source of truth.

Exports of existing personal data may intentionally remain free even after a subscription expires. If so, state that policy explicitly rather than accidentally making it dependent on whichever UI button is enabled. The authorization layer should express the product decision coherently across desktop, web and support tools.

## 16. A concrete entitlement lease design

A signed lease payload might contain `subject`, `deviceId`, `features`, `issuedAt`, `expiresAt`, `leaseVersion` and `keyId`. Sign a defined byte representation with a maintained cryptographic library. Verification must check the signature and semantic claims: an authentic lease for account A should not enable account B, and an authentic expired lease is still expired.

Use an asymmetric signature so the desktop holds only a public verification key. Embedding a symmetric signing secret in the binary would let a person who extracts it mint new leases. A public key does not let its holder create valid signatures, but a determined device owner can still modify local application code. Keep hosted-service enforcement on the server.

Key rotation needs overlap. Ship or obtain the new verification key through a trusted signed route before issuing leases that require it, and keep old keys only for their supported validity window. Bind the key identifier to a trusted key set; do not download an arbitrary URL supplied by an untrusted lease and call it a verification key.

Revocation is delayed while offline. A sensible product policy may allow existing local features until lease expiry while requiring fresh authorization for hosted usage. Store the last trusted server time as one input to clock rollback handling, but do not claim perfect expiry enforcement on a fully user-controlled device. Choose a practical support policy and document its limits.

## 17. Worked billing race: success before fulfillment

A customer finishes browser checkout at 10:00:00. The browser returns to the desktop at 10:00:01. The webhook arrives at 10:00:04 and is processed at 10:00:05. If the UI treats the return as proof, it may grant access without payment verification. If it treats the initial missing entitlement as a final failure, it tells a paying customer to purchase again.

The correct intermediate state is “purchase received; confirming access.” Poll the authenticated entitlement endpoint with bounded backoff or use an authorized event channel. Show a reference and support route if confirmation takes too long. Do not create another checkout automatically. Reconciliation should retrieve authoritative status for the original account and purchase.

If two webhook workers process the same event concurrently, a uniqueness constraint or atomic deduplication record should allow only one fulfillment effect. A check-then-insert sequence without a transaction can race. For consumable credits, use a ledger entry keyed to the authoritative event or purchase operation so retries cannot add the same credits twice.

Refunds and disputes create another lifecycle. Decide which benefits are revoked, what happens to already consumed hosted resources and how the user sees the resulting state. Keep audit records sufficient for support, but do not expose payment details unnecessarily to the desktop renderer.

A practical final auth diagnostic is to draw the lifetime of one secret from creation to deletion. Identify which process receives it, which storage adapter persists it, which requests use it and which event revokes it. If the diagram includes renderer localStorage, a log file or a payment return URL, inspect why that location needs the secret. Reducing credential copies makes both security review and ordinary logout debugging easier.
