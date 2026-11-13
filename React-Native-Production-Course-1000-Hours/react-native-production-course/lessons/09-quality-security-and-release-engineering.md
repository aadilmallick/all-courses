# 09 — Testing, performance, security, native code, builds, and updates

[Previous](08-pocketpilot-capstone.md) · [Course home](../README.md) · [Next](10-stores-marketing-and-operations.md)

**Planned time: 80 hours.** Allocate 12 hours to testing strategy, 20 to automated and device checks, 14 to performance work, 14 to security and observability, and 20 to native builds and update rehearsals. Production quality is a set of demonstrated properties, not a package you install at the end.

## 1. Define quality in terms of user consequences

A finance app can fail without crashing. It can show an old balance as current, duplicate a pending transaction, lose a category edit, expose another user's cached data, or charge a customer without granting access. Your test strategy should prioritize those consequences rather than maximizing a coverage percentage.

Separate domain correctness, authorization correctness, integration correctness, device behavior, and operational recovery. A pure function test can prove a budget calculation for known inputs. It cannot prove a native purchase restores correctly. A UI test can prove a button renders, but not that the server verifies a webhook. Choose evidence appropriate to each boundary.

Build a risk map for PocketPilot. Money normalization, ownership, token handling, entitlement state, and deletion deserve strong checks. A reversible spacing change usually needs a visual review rather than a new unit test that repeats the style object. Test where a realistic regression would matter and where automation can detect it reliably.

## 2. Keep a testing pyramid with meaningful boundaries

| Layer | Example | Best evidence |
| --- | --- | --- |
| Pure domain | Refunds reduce the intended category total | Fast deterministic tests |
| Repository contract | Every adapter returns validated domain records | Adapter tests with controlled services |
| Authorization | Bob cannot read Alice's transaction | Real user-role integration tests |
| Component | Budget validation keeps input on failure | React Native Testing Library |
| Device flow | Sign-in callback opens the intended route | Maestro, Detox, or manual device evidence |
| Store integration | Restore grants the correct entitlement | Store sandbox lifecycle tests |
| Operations | Failed sync resumes without duplicate records | Worker failure injection and staging runbook |

Do not mock the exact boundary you intend to verify. If you mock the authorization decision to return true, the test cannot prove the policy is correct. If you replace every native API with a successful stub, the test can exercise UI branches but cannot validate platform configuration. State those limits clearly in test names and reports.

Keep fixtures synthetic and deterministic. Control the clock, IDs, and network outcomes. A flaky test that depends on the current date or a public API can waste time and reduce trust in the suite. Use real external services in a separate integration layer with explicit setup and credentials.

## 3. Test domain functions outside React

The packaged `labs/domain` directory uses Node's built-in test runner and native TypeScript stripping. It does not need Expo, a database, or credentials. Run it as described in the README. This proves the included domain examples execute under the recorded Node version; it does not type-check every TSX or vendor integration in the course.

A useful money test covers ordinary values and boundaries: zero, negative values, two decimal places, invalid text, unsupported precision, and overflow. A useful budget test covers period boundaries, pending exclusion, refunds, categories, transfers, and mixed currencies. A useful reconciliation test covers duplicate addition, modification, removal, pending replacement, and preservation of annotations.

Use table-driven cases when they express the domain clearly. Avoid a test that merely copies the implementation's arithmetic line. The expected result should come from the product rule and a human-readable scenario. For example, “a posted 10-dollar purchase and a posted 3-dollar refund produce 7 dollars of category spending” is independently understandable.

## 4. Test components through user behavior

For the generated Expo app, install the current compatible Jest and React Native Testing Library setup following Expo's [unit-testing guide](https://docs.expo.dev/develop/unit-testing/). A typical project uses the `jest-expo` preset. Match React and renderer versions to the Expo template instead of installing unrelated latest versions.

```tsx
// Component-test example for a project with Jest and RNTL configured.
import { render, screen, userEvent } from '@testing-library/react-native';
import { BudgetForm } from './BudgetForm';

test('keeps entered values when saving fails', async () => {
  const user = userEvent.setup();
  const onSave = jest.fn().mockRejectedValue(new Error('temporary failure'));
  render(<BudgetForm onSave={onSave} />);
  await user.type(screen.getByLabelText('Budget name'), 'Food');
  await user.type(screen.getByLabelText('Monthly limit in US dollars'), '300.00');
  await user.press(screen.getByRole('button', { name: 'Save budget' }));
  expect(await screen.findByText(/Could not save/)).toBeTruthy();
  expect(screen.getByDisplayValue('Food')).toBeTruthy();
  expect(screen.getByDisplayValue('300.00')).toBeTruthy();
});
```

The test interacts through labels and visible behavior, which encourages accessible components. It does not assert private hook state or exact component nesting. If the implementation changes while preserving the user's experience, this test should still pass.

Mock only the repository callback here because the test concerns the form's behavior after a failed save. Test the real repository separately. Add a success case and a validation case when they protect meaningful behavior. Do not create dozens of snapshots that reviewers cannot interpret when they change.

## 5. Test the backend under ordinary user authority

For Supabase, run RLS tests with user sessions and public client authority, not an administrative connection that bypasses policies. For Firebase, use the rules emulator and authenticated test contexts. For Amplify and Appwrite, exercise actual owner and permission behavior. For Better Auth, verify sessions through the real server handler and query a migrated test database.

Use Alice and Bob fixtures and include an unauthenticated caller. Test reads by exact ID, list queries, updates, deletes, cross-owner foreign keys, owner changes, and storage access. Test permitted actions as well as denied ones. A deny-all policy is not a successful product implementation.

Privileged workers need a separate suite. A bank-sync endpoint must derive the connection's owner from trusted records. A billing webhook must verify its provider authentication. A deletion worker must retry safely. These checks matter because administrative SDKs often bypass the ordinary client authorization layer.

## 6. Rehearse device journeys with a suitable tool

Maestro can express user journeys in a readable flow format. Detox offers a deeper integration with native application testing and synchronization. Choose based on your app, team, and CI environment. Neither tool removes the need for a physical-device review of capabilities such as biometrics, wallets, and camera behavior.

```yaml
# Illustrative Maestro flow; match text and appId to your actual fixture build.
appId: com.example.pocketpilot
---
- launchApp:
    clearState: true
- assertVisible: "PocketPilot"
- tapOn: "Budgets"
- tapOn: "Food"
- assertVisible: "Monthly limit in USD"
```

This is a starting flow, not a test claimed to have run against the course overlay. Use stable accessibility identifiers where visible text changes with localization. Keep test accounts and state setup deterministic. A flow that only passes after a manual sequence on one developer's phone is not reproducible automation.

Prioritize fresh install, sign-in, callback return, offline launch, budget edit, failed save, purchase restore, bank reconnection, and deletion initiation. Test Android Back and iOS dismissal behavior. Repeat a representative journey on an older or lower-memory device, because flagship hardware can hide performance problems.

## 7. Profile before optimizing

Performance problems can arise from expensive JavaScript work, excessive renders, heavy native views, image decoding, network latency, or database queries. Measure which resource is responsible before adding memoization or replacing a library. A smooth animation does not prove a fast data load, and a fast query does not prove a responsive screen.

Use React Native and Expo development tools to inspect renders and JavaScript work. Use native tooling for platform CPU, memory, startup, and rendering where appropriate. Compare release-like builds, because development instrumentation and debugging can alter timing. Record device, operating system, build mode, dataset size, and measured action.

Create a synthetic ledger large enough to stress the intended usage. Measure initial list display, scrolling, filter changes, detail opening, and returning from the background. Avoid loading the entire history into a screen when a paginated query would meet the requirement. Keep date grouping and currency formatting out of repeatedly executed row work when profiling shows they are expensive.

## 8. Improve startup deliberately

Startup has several stages: native launch, JavaScript initialization, session restoration, local data opening, and remote refresh. Do not block the first useful screen on every optional network call. Show a coherent cached or onboarding state, then load nonessential features progressively.

Keep module initialization lightweight. A top-level import that eagerly creates large data structures or initializes every analytics and SDK integration can delay the app before any screen renders. Split optional features when supported and defer work that is not needed for the first interaction. Avoid a splash screen that remains indefinitely because one optional service failed.

Fonts and assets need a clear loading strategy. Use Expo's current font and splash-screen guidance, and ensure an error path releases the user into a usable state. Test cold launch after installation and after an update. A warm Fast Refresh session tells you little about real startup behavior.

## 9. Optimize lists, images, and calculations at the right layer

Stable keys, modest row complexity, and appropriate virtualization usually matter more than blanket `memo` usage. A memoized component still rerenders if its props are recreated in ways that defeat comparison. A global store selector that returns a new object on every change can trigger broad updates. Measure and narrow subscriptions where the evidence supports it.

Images should have appropriate dimensions and caching behavior. Do not decode a full-resolution receipt merely to show a tiny thumbnail. Use a thumbnail pipeline and a private authorized full-image view. Clean up large temporary files and understand which caches persist across account changes.

Move financial aggregation into pure functions or server queries. Memoize by stable inputs when calculation cost is meaningful. Do not cache a total without including the period, currency, account scope, and annotation version in its invalidation logic. A faster wrong total is not a performance improvement.

## 10. Security begins with explicit assets and trust boundaries

PocketPilot's sensitive assets include session credentials, bank-provider credentials, financial history, receipts, billing relationships, and deletion requests. Identify where each is stored, who can access it, how it moves, and how it is removed. This is a practical threat model, not a ceremonial document.

The phone is not a trusted server. Users can inspect the bundle, modify local state, replay requests, and call endpoints directly. Public environment variables are public. SecureStore improves local credential handling but does not make a compromised device perfectly trustworthy. Server authorization remains necessary.

Use the [OWASP Mobile Application Security guidance](https://mas.owasp.org/) as a structured review resource. Apply checks according to the app's real data and threat model. Avoid adding security theater that creates friction without protecting a meaningful boundary. Root or jailbreak detection, for example, can be one signal but should not replace correct server enforcement.

## 11. Handle secrets and logs with discipline

Bank-provider secrets, administrative database keys, Stripe secret keys, webhook secrets, signing credentials, and service-account files stay outside the client and Git. Keep development and production credentials separate. Scan the repository and built public configuration before release. If a secret is exposed, rotate it; deleting the line from the latest commit does not remove it from history or from distributed bundles.

Sanitize logs at the source. Do not log request headers, session cookies, raw bank responses, receipt text, or full authentication callback URLs. Prefer error categories, request IDs, build version, route names, and synthetic reproduction steps. A crash-reporting SDK can collect breadcrumbs automatically, so inspect its configuration and payloads rather than assuming it is privacy-safe by default.

Restrict administrative access and retain an audit trail for sensitive support actions. A solo developer still needs to know which environment a tool is connected to and what it can modify. Avoid using production credentials for casual local experiments. Build staging workflows that make safe testing convenient.

## 12. Add observability that supports decisions

Use error reporting for JavaScript and native crashes, structured server logs for request and worker failures, and metrics for user-impacting reliability. Sentry and Expo's observability offerings are options; choose based on current compatibility, data handling, and operational needs. Upload source maps through a secure build process so minified errors can be interpreted without exposing secrets.

Track crash-free sessions, failed sign-in rate, failed bank-sync rate, queue age, entitlement mismatch rate, and deletion completion time. Define thresholds as operational targets based on your product, not universal promises. An alert should have an owner and a runbook. A dashboard that nobody can act on does not improve reliability.

Separate product analytics from diagnostics. Product analytics can record that a budget was created without recording its amount or name. Diagnostics can record a failed sync category without recording transaction content. Minimize collection and document the actual data flow in the privacy disclosures.

## 13. Feature flags and remote configuration need guardrails

A feature flag can disable a broken chart, a new recurring heuristic, or a nonessential onboarding variation. It should not bypass server authorization or secretly activate unreviewed material behavior. Keep defaults safe when the flag service is unavailable. Cache only what is appropriate and record which variant a user actually saw for experiment analysis.

Use separate flags for release control and experimentation when their lifecycle differs. A temporary rollout flag should be removed after the feature stabilizes. An experiment needs assignment, exposure logging, and a decision rule. Do not let a growing collection of remote Booleans become an undocumented second application.

For premium features, a flag can control presentation or rollout, but verified entitlement still controls paid access. A client-editable flag is not a billing system. For bank imports, a kill switch can stop new jobs while preserving existing data and a recovery path.

## 14. Understand when native code is necessary

Expo supports custom native modules and configuration plugins. You do not need to “eject” to add native capabilities. A plugin changes native project configuration during generation. A native module supplies runtime code callable from JavaScript. These are different responsibilities.

Use a maintained library first when it meets the requirement and supports the current architecture. If you need a custom capability, use the current Expo Modules API and follow its TypeScript, Swift, and Kotlin guidance. The application interface can remain TypeScript, but the actual native implementation may require platform languages. Do not pretend a TypeScript declaration creates the native functionality.

A safe module boundary validates input, exposes a small API, declares platform support, handles unavailability, and cleans up listeners. Avoid a giant native module that combines unrelated concerns. Test the native implementation on both platforms and include an explicit fallback or unsupported-state message.

## 15. Config plugins and generated native projects

App configuration describes identifiers, permissions, plugins, icons, and other native settings. A dynamic `app.config.ts` can derive environment-specific values, but its logic must remain deterministic for the intended build. Do not make a native identifier depend on an accidental local shell value with no documented default.

If using generated native directories, express native configuration through supported plugins. Review generated changes in a safe branch when upgrading. If maintaining native directories directly, treat them as source and understand which generation commands can overwrite changes. Never run a destructive clean regeneration casually on uncommitted native work.

Permission strings should explain the actual user benefit. Remove unused permissions and capabilities. A finance app with no location feature should not request location because a copied template included it. Plugin configuration changes often require a new binary; an over-the-air JavaScript update cannot add a missing entitlement to an installed app.

## 16. Configure development, preview, and production builds

Expo Services retain `eas` CLI commands and `eas.json` configuration. Use build profiles to describe intent and channels to route compatible updates. The following is an illustrative configuration for a project already linked to its own Expo project.

```json
{
  "cli": { "appVersionSource": "remote" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "environment": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "environment": "preview"
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "environment": "production"
    }
  },
  "submit": { "production": {} }
}
```

Development builds include developer tools. Preview builds are release-like internal distributions. Production builds target store distribution. The profile names are conventions; inspect what they actually configure. An iOS internal device build may require registered devices and an appropriate provisioning profile, while a simulator build uses a different configuration and cannot be installed on a physical iPhone.

Keep sandbox bank and billing environments in preview. Confirm the resolved public API URLs before distributing a build. A profile called `production` can still point to staging if its environment values are wrong. Add a visible environment indicator in development and preview builds, and remove or adapt it appropriately for the public product.

## 17. Build and manage signing credentials

```sh
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile preview
```

These commands require your Expo account, platform credentials, and project configuration. They are learner-run instructions, not builds executed by this course. Pin the CLI version in your actual project workflow after setup so CI is reproducible. Cloud builds do not eliminate the need to understand signing ownership.

Android distribution commonly uses an app bundle for Play and appropriate signing-key management. iOS uses certificates and provisioning tied to app identifiers and capabilities. Keep signing material and service-account credentials out of Git. Document who owns them and how recovery works. Losing access to a signing identity can become a business continuity problem.

Build numbers and user-visible versions serve different purposes. A new submission must use an acceptable increment under the store's rules. Remote version management can reduce collisions between developers and CI, but verify the actual resulting versions in the build metadata. Do not assume a JavaScript package version automatically becomes the correct store build number.

## 18. Updates must match the installed native runtime

An over-the-air update can replace compatible JavaScript and assets. It cannot add a native library, permission, entitlement, or native configuration absent from the installed binary. The [runtime-version guide](https://docs.expo.dev/eas-update/runtime-versions/) explains how compatibility separates the native layer from the update layer.

```ts
// app.config.ts fragment for a project configured for Expo Update.
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PocketPilot', slug: 'pocketpilot', scheme: 'pocketpilot',
  ios: { bundleIdentifier: 'com.example.pocketpilot' },
  android: { package: 'com.example.pocketpilot' },
  runtimeVersion: { policy: 'fingerprint' },
  plugins: ['expo-router', 'expo-secure-store'],
};
export default config;
```

This fragment omits the real project-specific update URL and project ID, which the setup process supplies. Do not invent those identifiers. Fingerprint-based runtime policy helps separate incompatible native changes, but it is not a substitute for testing. A JavaScript change can still break a compatible runtime logically.

```sh
npx eas-cli@latest update:configure
npx eas-cli@latest update --channel preview --environment preview --message "Budget calculation fix"
```

Publish to preview first and verify the exact build/runtime combination. Promote through a controlled release workflow. A native SDK upgrade requires a new binary even if the JavaScript source barely changes. Do not use updates to evade store review requirements for material app behavior.

## 19. Rollbacks need a plan before an incident

Record the build, runtime, update, backend deployment, and schema versions associated with a release. If a new update fails, you need to know which installed binaries can receive a corrected update and whether the backend remains compatible. A rollback that restores old JavaScript but leaves an incompatible database migration can make the incident worse.

Rehearse a bad preview update and recovery in a controlled environment. Verify startup behavior, update selection, and fallback under the current service's documented mechanics. Keep a known-good build and a way to disable a nonessential feature. Do not learn your rollback procedure for the first time while paying customers are locked out.

For schema changes, favor expand-and-contract deployment. Add compatible fields, deploy readers that tolerate both forms, backfill, update clients, and only later remove the old shape. Mobile clients are distributed programs that remain installed, so backend compatibility deserves explicit design.

## 20. CI should prove what it can actually prove

A useful pipeline installs from the lockfile, checks formatting and types, runs domain and component tests, checks migrations or rules where available, scans for secrets, and creates a preview build when appropriate. Keep credentials scoped and avoid printing them in logs. Pull-request checks should not automatically deploy to production unless that behavior is deliberately authorized and configured.

Type checking is valuable but does not validate vendor dashboards or native entitlements. A successful Android build does not prove iOS works. A successful store upload does not mean the app passed review. Name pipeline stages according to their actual evidence so reviewers can assess what remains.

For this course package, the verification report records the checks actually run in the authoring environment. The Expo application, native builds, cloud authentication, banking, and store purchase tests require your installed dependencies, services, and devices. The package deliberately does not fabricate a successful build log for those environments.

## 21. A worked incident: a missing native module after an update

A developer adds a native chart package and publishes only an over-the-air update. Existing installed binaries receive JavaScript that imports a native implementation they do not contain. The app fails even though the JavaScript bundle built successfully. The problem is runtime compatibility and release sequencing.

Create a new binary with the native package, give it the appropriate runtime identity, test it, and distribute it through the intended channel. Keep updates for old binaries compatible with their native layer. A fingerprint policy can help prevent accidental targeting, but review the actual generated runtime and update metadata.

The prevention is a release checklist that classifies changes: JavaScript-only, assets, native dependency, native configuration, backend contract, and data migration. Each category implies a different verification and distribution path. This classification is practical engineering knowledge that makes Expo's tooling predictable.

## 22. A worked incident: a slow transaction screen

The screen loads ten thousand transactions, groups them by month, formats every amount, and renders a chart whenever a filter character changes. The developer adds `memo` to the row, but typing remains slow. Profiling shows the expensive work occurs before row rendering, in the synchronous transformation of the entire dataset.

Move filtering and aggregation to an appropriate query or indexed local repository, paginate the visible list, and cache derived results by stable inputs. If client-side processing remains necessary, avoid recomputing unrelated periods on every keystroke. Measure the new behavior on the same device and dataset. Do not declare success solely because the code looks more optimized.

Then verify correctness. A cached total whose key omits the selected currency can display the previous currency's number quickly and incorrectly. Performance work must preserve the domain contract. Add a targeted regression test for the actual cache-key or calculation bug rather than a broad snapshot of the entire screen.

## 23. Project work and acceptance evidence

Run the domain suite, add meaningful component tests, complete two-user backend checks, and automate a small set of device journeys. Profile a release-like build with a large synthetic dataset. Review secrets, logs, permissions, and private storage. Configure preview and production build profiles and rehearse a compatible update and a rollback.

Acceptance evidence includes a test log, device matrix, performance measurements, sanitized crash-report sample, environment configuration review, signed preview build references, and a release/rollback runbook. Mark missing hardware or provider checks explicitly. A documented limitation is more useful than a false claim of complete validation.

## 24. Further detail: release engineering for a solo developer

Use small releases with a clear purpose. A release that changes authentication, billing, bank sync, and navigation simultaneously is difficult to diagnose if something fails. Separate high-risk changes where practical and retain a known-good baseline. The goal is not bureaucracy; it is making cause and recovery understandable when you are the person responsible for everything.

Keep a lightweight release note with user-visible changes, technical risk, validation, and rollback. Link the exact commit and build. Record any database migration and whether old clients remain supported. A future support investigation should not depend on remembering which laptop produced the binary.

Schedule maintenance as part of the product's operating work: dependency review, OS compatibility checks, restore and deletion tests, provider credential review, and backup restoration. Do not wait until a store deadline forces several major upgrades at once. A small regular maintenance habit reduces the size of each integration risk.

An optional AI review prompt is: “Review this release candidate and its evidence. Separate domain tests, authorization tests, native device checks, build success, update compatibility, and store readiness. Identify unsupported claims, sensitive logging, migration hazards, and missing rollback steps. Recommend the smallest additional checks justified by the actual changes.”

## 25. Device lab: build a small, defensible test matrix

Choose devices according to risk rather than collecting screenshots from many similar phones. Include one current iPhone, one older supported iPhone where available, one current Android device, and one lower-memory Android device. Include a small screen and at least one large-text setting. If you cannot access a category, record the missing evidence and arrange a tester rather than labeling an emulator result as physical-device validation.

Run the same short journey on every device: fresh launch, session restoration, transaction scrolling, detail navigation, budget editing, offline restart, and return from background. Then run capability-specific checks on suitable hardware: biometrics, camera or picker, notifications, bank linking, purchase, and restore. A simulator can help with layout and automation but does not reproduce every hardware capability.

Record pass, fail, or not run for each cell. Include build ID and operating-system version so results remain interpretable. When a failure appears, capture a sanitized reproduction and diagnostic category. Do not add real transaction screenshots to a public test report. Synthetic data can reproduce layout and reconciliation problems without exposing private history.

Use the matrix to decide the next test, not to create endless work. Once a change is limited to a pure budget calculation, rerun the relevant domain and display checks. A native dependency upgrade justifies a broader device regression. Testing should scale with the changed boundary and unresolved concerns.

## 26. Release lab: rehearse a compatible update and a native change

Create a preview binary with the current native dependencies and record its runtime identity. Publish a small JavaScript-only change to the preview channel, such as clearer budget-error copy. Verify the installed preview app receives the intended compatible update and that the main journey still works. Record exactly which build and update were paired.

Now add a harmless native capability in a separate branch. Observe the runtime identity and rebuild requirements under your configured policy. Do not publish JavaScript importing that capability to an old runtime. Build a new preview binary, install it, and verify the capability there. This comparison turns the abstract native/update distinction into an observable release practice.

Next, rehearse recovery from a broken preview JavaScript change. Use the service's current documented rollback or corrective-update path. Verify cold startup and offline startup, because an app may encounter an update under different network conditions. Keep the experiment in preview and use synthetic accounts.

Finally, introduce a backward-compatible server response field and verify both old and new preview clients. The exercise should show that mobile release compatibility spans the native runtime, JavaScript bundle, server contract, and database schema. A successful bundle upload covers only one part of that chain.

## 27. Observability lab: diagnose without collecting financial content

Create a synthetic failure with a known request ID, such as a controlled budget-save error. Confirm that the client displays a useful message and records a sanitized diagnostic. Confirm that the server log carries the same request reference without a token, cookie, merchant list, receipt text, or full request body. Use the reference to connect the two sides of the incident.

Trigger a JavaScript error in a preview build and inspect the crash-report payload. Check stack symbolication, route context, build version, and automatic breadcrumbs. Remove or redact any sensitive fields collected by default. A privacy review should inspect actual emitted data, not only the configuration code that you hope controls it.

Create an operational metric for an aging sync queue. Insert a synthetic job that remains unprocessed and verify that the metric changes and the runbook identifies a useful next step. An alert that fires without an actionable procedure becomes noise. A procedure that requires unrestricted database access for every support person creates another risk.

Define recovery confirmation. For a sync incident, that can mean the queue age returns to normal, the cursor advances consistently, and affected synthetic accounts show the expected freshness. For billing, it can mean the trusted entitlement projection matches provider state. An error disappearing from logs is weaker evidence than the user's workflow recovering.

## 28. Security lab: review the built product, not only source code

Inspect the resolved public configuration and generated bundle for accidental secret inclusion. Search for administrative key names, test credentials, provider access tokens, and private endpoints. A server-only file can enter a client bundle through an accidental import, so review dependency direction as well as environment-variable names.

Check the application after logout and account switching. Inspect visible screens, cached query data, local databases, temporary exports, app-switcher previews, and notifications. Server policies can be correct while the device still shows an old user's information. Use artificial request delays to expose races that a normal fast test misses.

Review exported files separately. A private in-app view and a user-initiated share have different exposure boundaries. Confirm that exports contain only the intended account scope, use correct currency and date semantics, and escape spreadsheet-sensitive text where needed. Explain the action clearly before handing data to another application.

End the lab with a short findings list ranked by user impact and exploitability. Fix concrete issues, verify the repair, and record remaining limitations. Do not describe the application as certified or fully secure because a checklist was completed. The useful outcome is evidence that important boundaries were examined and meaningful defects were addressed.

Keep this evidence tied to the tested commit and build. A later dependency upgrade changes the system under review, so repeat the checks justified by that change and preserve the new result separately.
