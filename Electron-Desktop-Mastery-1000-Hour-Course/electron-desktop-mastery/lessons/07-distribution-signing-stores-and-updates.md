# 07 — Packaging, signing, stores and dependable updates

[Previous](06-testing-dx-performance-and-reliability.md) · [Course index](../README.md) · [Next](08-capstone-product-and-marketing.md)

**Planned workload: 140 hours.** Release architecture and resource packaging 20; macOS direct distribution 25; Windows distribution 25; Linux packages and portals 20; store editions 20; updates, rollback and release rehearsal 30.

## 1. A release is more than a compiled folder

Source compilation produces JavaScript and assets. Packaging combines those assets with Electron and dependencies. An installer or distribution artifact places that package into an operating-system-specific delivery form. Signing establishes publisher identity and integrity under a trust system. Notarization, store review and update publication add separate checks and responsibilities.

Each stage can succeed while the next fails. A TypeScript build can pass while a packaged worker file is missing. A signed macOS app can still lack a valid notarization result. A store upload can process successfully and later fail review. An updater can discover a version whose artifact is absent from the CDN. Treat these as distinct states with explicit evidence.

Define the distribution matrix first. For Atlas Desk, a useful baseline is direct downloads for macOS, Windows and Linux. Store editions are separate learning routes, with a capability assessment before implementation. Do not assume that every agent feature can survive Mac App Store sandbox and review requirements unchanged.

| Channel | Typical artifact route | Update owner | Important design consequence |
|---|---|---|---|
| macOS direct | Signed/notarized app in DMG and updater-compatible archive | Selected app updater | Preserve signing identity and nested helper validity |
| Mac App Store | MAS Electron build and store submission package | Apple store | Sandbox, entitlements and payment review |
| Windows direct | Signed EXE/MSI through chosen maker | Selected installer/updater | Match package format to update system |
| Windows MSIX/Store | MSIX or supported Store listing route | Store or configured App Installer | Package identity and ownership matter |
| Linux repository | DEB/RPM or sandboxed package | Package repository or store | Do not fight package-manager ownership |
| Linux portable | AppImage or explicit archive route | Chosen supported updater or user | Document dependency and integration limits |

These are design routes, not a claim that one maker supports every target or that all installers share an updater protocol.

## 2. Choose one coherent packaging pipeline

Forge calls installer-building components makers and release destinations publishers. Its current major uses `release`, with older `publish` material requiring migration awareness. Keep the scaffold's generated configuration as the starting point, then add each target deliberately. See [Forge release notes](https://github.com/electron/forge/releases).

Electron-builder is another coherent route with its own targets and updater integration. It is valid to compare it with Forge, but not to mix artifact metadata casually. A Squirrel.Windows package, an NSIS installer and an MSIX package have different update expectations. A library named `electron-updater` is not a universal adapter for every artifact.

Before signing, list all runtime assets: main and preload bundles, renderer assets, native modules, database migrations, icons, helper executables, model metadata and license notices. Verify inclusion using the actual package output. Filesystem reads that succeeded from the source checkout may fail when ASAR or unpacked paths change.

Build on the appropriate host for the target, especially when native dependencies and signing are involved. Cross-compilation support varies by tool and artifact. Even when generation works on another OS, verify installation and runtime behavior on the target. Avoid designing a release pipeline around the assumption that a Linux CI runner can perform every macOS and Windows release task.

## 3. Release identity and versioning

Choose stable application identifiers early. Bundle IDs, Windows package identity and desktop application IDs influence settings locations, protocol registrations, keychain access and update continuity. Changing them can make an update look like a different application or break access to stored credentials.

Separate marketing version, internal build number, release channel, CPU architecture and distribution channel. A beta release should not overwrite stable metadata accidentally. An arm64 artifact should not be offered to an x64-only installation unless a supported migration route exists. Some packaging systems impose numeric version constraints beyond semantic versioning.

Keep development, test and production data profiles distinct. A release test should not migrate your personal data as a side effect. Give previews a separate identifier when appropriate, and document whether beta users can share data with stable. Shared data between incompatible versions can create subtle migration failures.

Produce a release manifest with source commit, tool versions, target, artifact checksum, signing identity reference and test evidence. A checksum helps detect accidental or malicious byte changes when obtained through a trusted channel; it does not substitute for a publisher signature or secure update design.

## 4. macOS direct distribution, in order

Obtain an Apple Developer membership and the appropriate Developer ID Application identity for direct app distribution. If distributing a signed installer package outside the store, the installer identity is a different certificate type. Apple's [Developer ID documentation](https://developer.apple.com/help/account/certificates/create-developer-id-certificates/) is the certificate reference. Do not copy an inaccurate certificate table from a third-party tutorial.

Build the correct CPU architecture and package every helper before signing. Review hardened runtime and entitlements for your exact Electron and helper combination. Grant only what the app needs. An entitlement allowing a broad runtime behavior is not a generic fix for a mysterious startup error; investigate the error and confirm the supported setting.

Sign nested code and the application through a maintained signing tool. Mutating a signed executable or changing fuses afterward invalidates the signature. The order is important: assemble resources, apply package-time hardening, sign, create the appropriate notarization submission and then verify the final distribution form.

Notarization is an Apple automated assessment for direct distribution, distinct from App Store review. Submit through supported Xcode tooling, inspect the result and attach the notarization ticket where applicable. Read [Apple's notarization guide](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) and the selected packager's current integration rather than relying on an obsolete upload command.

The following **verification commands** run on a Mac against an already built app. Replace the example path with your artifact; they do not sign or publish anything:

```bash
codesign --verify --deep --strict --verbose=2 "Atlas Desk.app"
spctl --assess --type execute --verbose=2 "Atlas Desk.app"
xcrun stapler validate "Atlas Desk.app"
```

`codesign` verifies signature structure; assessment asks the OS to evaluate execution policy; stapler validation checks a ticket attached to the artifact. Their exact output depends on the signing and distribution route. Use supported tool documentation when interpreting failures. Do not tell users to remove quarantine as the normal installation procedure.

Test a freshly downloaded artifact on a machine or account that did not build it. Launch from the installed location, sign in, quit, relaunch and perform an update. Verify keychain continuity and helper execution. A successful launch from a developer's output directory is insufficient evidence for the downloaded user experience.

## 5. Mac App Store as a separate edition

Electron's [Mac App Store guide](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide) distinguishes the MAS build, store signing and App Sandbox requirements. Use the matching build and distribution identity, configure provisioning appropriately and test a development-signed sandboxed build before submission. Direct-download signing is not a replacement for this route.

Map every feature to required sandbox access. User-selected files may need approved access mechanisms and persisted bookmarks where appropriate. Network clients, microphone, camera and other integrations need their corresponding supported configuration. A general-purpose agent executing arbitrary host commands may conflict with the edition's constraints and review expectations.

Design a reduced store edition if needed. It might offer local conversations, read-only workspace analysis and remote agent execution while the direct edition offers broader local tools. Explain the difference honestly in marketing and the UI. A hidden bypass activated after review is neither a reliable architecture nor an acceptable release plan.

Prepare App Store Connect metadata, privacy information, screenshots, support links, review instructions and test access. Review the current [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) for payment, downloaded code and account requirements. Store rules can change, and approval cannot be guaranteed by following an Electron tutorial.

Do not use an in-app binary updater for the store-managed edition. Keep its update surface consistent with store ownership and the capabilities available in the MAS build. Database migration and backend compatibility still matter even when Apple distributes the binary.

## 6. Windows direct distribution and signing

Choose your installer based on installation scope, update route, enterprise requirements and tool support. Squirrel.Windows, MSI, NSIS and MSIX are not interchangeable formats. If you choose Forge's Squirrel route, follow its lifecycle and update requirements. If you choose builder's NSIS route, use the corresponding supported updater metadata.

Acquire a signing identity through a currently supported certificate or managed signing route. Private key handling has changed over time; do not base a new business on an old tutorial that assumes an inexpensive exportable PFX can always be purchased and stored in CI. Review your certificate provider's requirements or a managed service such as Microsoft's [Artifact Signing](https://learn.microsoft.com/en-us/azure/artifact-signing/overview), including current eligibility.

Authenticode signing and timestamping establish publisher and integrity evidence. Sign appropriate application binaries and installer artifacts according to the selected toolchain. Verify the resulting downloaded artifact using the Windows SDK [SignTool](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool) and a standard-user install test.

This **verification command** runs in a Windows SDK developer shell:

```powershell
signtool verify /pa /all /v "AtlasDeskSetup.exe"
Get-AuthenticodeSignature ".\AtlasDeskSetup.exe" |
  Format-List Status, StatusMessage, SignerCertificate
```

A valid signature does not guarantee that reputation-based warnings disappear immediately. Publisher identity, artifact history and security products can affect the user's experience. Do not promise that a specific certificate purchase guarantees a warning-free first release.

Test per-user and administrator contexts as supported by your installer. Verify uninstall behavior, shortcuts, protocol registration, startup preference, locked files and update after a reboot. Do not delete user data automatically on uninstall unless the user selected that behavior and the policy is clear.

## 7. Microsoft Store and MSIX routes

Microsoft Store supports multiple submission routes, including MSIX and eligible MSI/EXE listings. Choose the actual route before designing package identity and updates. The [publishing overview](https://learn.microsoft.com/en-us/windows/apps/publish/) links to the corresponding requirements. Do not treat a successful loose-file Windows build as a store package.

Forge has an [MSIX maker](https://www.electronforge.io/config/makers/msix). At the snapshot, that page still labels support experimental and requires Windows with SDK tooling; verify status against your pinned release. A current maker is preferable to assuming an outdated Electron Store conversion tutorial is your only option.

Reserve the application identity in Partner Center and match publisher and package metadata exactly. Use the appropriate signing and test-install route before upload. Validate application capabilities and installer behavior for the selected submission type. Store-managed packages and direct App Installer packages can have different update ownership.

Review [Microsoft Store policies](https://learn.microsoft.com/windows/apps/publish/store-policies) for your product category and commerce route. Non-gaming desktop apps can have options different from mobile stores; do not overgeneralize. Include support and privacy details and provide reviewers enough information to exercise meaningful features.

For sideloaded MSIX, understand the App Installer and signing requirements rather than assuming `electron-updater` handles it. For a Store installation, let the Store own package updates. Your app can display release information, but it should not overwrite package-managed files itself.

## 8. Linux distribution is a family of environments

Linux packages vary by distribution, desktop environment, display system and packaging format. A DEB or RPM can integrate with a package manager; a Flatpak or Snap can add sandbox and store conventions; an AppImage can offer a portable route. Document what you actually support rather than saying “Linux” after testing one container.

Choose a minimum distribution/runtime baseline compatible with your Electron and native dependencies. Test library compatibility on that baseline. A binary built on a newer system may depend on newer system libraries than your advertised minimum provides. Keep architecture support explicit.

Use `.desktop` metadata and icons correctly, including scheme handler registration where needed. Verify paths with spaces, non-ASCII filenames, Wayland and X11 behavior where supported, and keyring availability. A tray icon may behave differently across desktops; keep core actions reachable from the main window.

Sandboxed packages change filesystem, process and permission behavior. [Flatpak's permission guide](https://docs.flatpak.org/en/latest/sandbox-permissions.html) explains restricted defaults and portal-mediated access. Prefer user-selected resource grants over blanket host filesystem access where the feature permits it. Broad agent capabilities may require a distinct distribution choice.

Package repositories and stores should own updates for their installed packages. Electron's built-in updater does not provide a universal Linux update solution. If you choose a portable updater route, verify support for the exact artifact, signature scheme and rollback strategy. Never use “download a shell script and run it” as an unexplained generic update mechanism.

## 9. Auto-updates are a protocol and an ownership decision

Electron's [built-in autoUpdater](https://www.electronjs.org/docs/latest/api/auto-updater) and `electron-updater` are different packages with different supported formats and metadata. The [builder update documentation](https://www.electron.build/docs/features/auto-update/) also distinguishes current and unreleased documentation versions. Select the stable-version documentation that matches your installed builder.

An update flow discovers a candidate, verifies compatibility and integrity, downloads it, waits for a safe installation point and applies it through the supported mechanism. The UI should explain availability and restart behavior. Do not interrupt an approved tool write or migration because a new version appeared.

Publish artifacts before metadata that advertises them. Use immutable versioned filenames and avoid reusing a version number for different bytes. Ensure CDN and caching behavior cannot point users at partially uploaded files. Keep beta and stable channels distinct and prevent accidental downgrade or cross-channel migration without a defined policy.

Verification includes signatures and the update system's documented integrity checks. TLS alone does not establish the identity of a downloadable binary after every operational mistake. Protect publishing credentials, release metadata and artifact storage. An attacker who controls the update channel can reach users with application-level authority.

Do not expose an updater URL as an arbitrary renderer setting. Enterprise customization may be valid, but it needs an authenticated configuration route and a clear trust model. A malicious document should not be able to select the next application binary by changing a hidden preference.

## 10. Rollback, database compatibility and emergencies

A rollback plan must include data. If version 2 irreversibly migrates the database, reinstalling version 1 may not restore service. Use compatible migrations where possible, keep tested backups and decide whether rollback means a newer hotfix build rather than a lower version number.

Maintain a minimum supported backend protocol and a safe compatibility window. A desktop release can remain installed for months. Do not remove an API the day the new client ships unless you have an explicit forced-update policy and an available recovery route. Offline users still need access to local data where your product promises it.

A failed update should preserve the last runnable application or a documented repair path. Test insufficient disk space, interrupted downloads, cancelled restarts and invalid signatures. A client discovering an update is not the same as successfully applying it. Keep metrics for each stage without collecting unnecessary private content.

For a signing credential compromise, know who can revoke credentials, stop publication and issue a trusted replacement. The exact recovery route depends on platform identity rules. Rehearse the decision process in a tabletop exercise; do not wait for an incident to discover that only a departed team member controls the account.

## 11. CI release stages and evidence

A practical pipeline starts from a reviewed commit and lockfile, runs checks, builds target artifacts, inspects inclusion, applies hardening, signs, performs target verification, publishes immutable artifacts and finally promotes update metadata. Protected release environments separate publication authority from ordinary pull-request execution.

Keep secret handling out of repository text. Use short-lived credentials or managed identity where supported and restrict access to signing operations. Masking logs does not make it safe to echo secrets or run untrusted scripts in a signing job. Store public certificate references and artifact checksums; keep private keys in their approved facility.

The [release evidence template](../templates/release-evidence.md) asks for target, source commit, tool versions, data migration path, signature verification, installed smoke result and update owner. Fill it with actual results. A template containing “pending” is a planned procedure, not a successful release.

For this course, no real certificates, store accounts or publishing credentials are provisioned. The authoring verification checks local examples and document integrity. Signing, notarization, installed updates and store acceptance are learner execution tasks requiring the appropriate machines and accounts.

## 12. Guided release rehearsal

Package an unsigned development build on your primary platform first and inspect every runtime resource. Install it into a clean test profile and run the core vertical slice. Fix inclusion and path issues before adding signing so you do not confuse unrelated failures.

Create a signed direct-release candidate on a suitable host. Download it through the intended delivery path into a clean test account, verify the signature and run it. Repeat after a small version increment and exercise the real update route. Confirm credentials, preferences and conversations survive.

Build the store edition as a capability-reduced configuration if necessary. Test it under the relevant sandbox/package identity and document differences. Prepare metadata and review instructions even if you do not submit immediately. This makes the route concrete enough to assess without claiming approval.

Build one Linux repository package and one alternate route only if your support plan needs both. Record which system owns updates and how users receive security fixes. The goal is a maintainable support matrix, not the largest number of installer file extensions.

## 13. Completion evidence

Deliver artifact manifests, installed smoke records, signature verification output, a channel/update ownership table, migration compatibility evidence and a release incident runbook. Mark unavailable platforms and unrun store steps honestly. Successful completion means you can explain how a reviewed commit reaches a user's machine and how that machine receives the next fix without losing its work.

The final chapter integrates the technical product with onboarding, positioning and a measured launch. Distribution makes installation possible; a useful product, clear explanation and reliable first run make installation worth doing.

## 14. Worked release manifest and promotion order

A small release manifest makes artifact identity explicit. The following is an **example schema instance**, not a real signed release:

```json
{
  "product": "atlas-desk",
  "version": "0.1.0",
  "channel": "beta",
  "distribution": "direct",
  "target": "win32-x64",
  "sourceCommit": "replace-with-reviewed-commit",
  "artifact": "AtlasDesk-0.1.0-win32-x64.exe",
  "sha256": "replace-with-computed-artifact-hash",
  "updateOwner": "chosen-compatible-updater",
  "database": { "reads": [1, 2], "writes": 2 },
  "evidence": "release-evidence.md"
}
```

The explicit placeholders are fields the learner must fill from actual build results; they are not fabricated checksums or credentials. A real promotion job should reject them. Recording readable and writable database versions makes a hidden compatibility assumption visible during review.

Suppose build 0.1.0 is ready for macOS arm64 but Windows signing fails. Do not publish stable metadata advertising a Windows artifact that does not exist. You can hold the release, publish only an intentionally supported platform release or maintain independent platform promotion. The correct choice is a product/support decision, but metadata must describe reality.

Upload immutable artifacts first, verify retrieval and then publish the metadata that selects them. A CDN can cache metadata and artifacts differently, so test the actual URLs through the intended public path. Keep a previous known-good feed record for incident analysis. Do not mutate an existing version's bytes in place when fixing a packaging mistake; issue a new version.

## 15. Worked notarization diagnosis

A notarization failure is not a reason to try random entitlements. Retrieve the submission log through the current supported tool and identify the exact nested executable or signing issue. Check whether a bundled helper is unsigned, whether a binary changed after signing or whether the selected signing identity does not match the route.

A **command recipe** for a Mac with a previously configured secure credential profile is:

```bash
xcrun notarytool submit "AtlasDesk.zip" --keychain-profile "atlas-notary" --wait
xcrun notarytool log "SUBMISSION_ID" --keychain-profile "atlas-notary"
```

The profile must be created through your approved local or CI credential setup before use; the recipe contains no account secret. Replace `SUBMISSION_ID` with the actual returned identifier only if the submission needs investigation. Use the current Apple tooling's help and documentation for your installed Xcode version.

After acceptance, attach and validate the ticket on the appropriate final artifact. Repackage carefully if your workflow requires it, then verify the downloaded result again. Acceptance for one submitted archive does not prove that a later modified DMG contains the identical signed application. Keep hashes and stage relationships in the release record.

## 16. Signing credentials and toolchain reproducibility

A signing operation is an authority granted to a build, not just another npm script. Restrict who can trigger it, which source revisions it can consume and which product identity it can use. A compromised dependency running during a signing job may inherit that authority if the environment is not separated.

Record exact Electron, packager, maker, native module, OS SDK and Xcode or Windows SDK versions. A lockfile captures many JavaScript dependencies but not every system tool. If you rebuild months later, these records explain why a binary or signature changed even when application source did not.

Use clean ephemeral build environments where practical and protect intermediate artifacts from modification before signing. Verify what the signing tool actually signed. Signing a top-level installer while leaving a bundled executable unexpectedly unsigned can produce a different trust experience from the one you intended.

Keep credential renewal and account ownership in an operational calendar or runbook. Do not create a release process that only one person's laptop can perform. A small independent product still needs recoverable ownership of its signing identities, store accounts and artifact hosting.

## 17. A compatibility rehearsal with two installed versions

Install candidate A, create a conversation, sign in with a test account, set a preference and complete a sample run. Update to candidate B through the actual mechanism rather than manually copying files. Confirm data and credentials survive, then inspect new schema state and event history.

Now test an interrupted download and a cancelled installation restart. Resume through the supported mechanism and verify the application remains launchable. Finally exercise your documented repair route in a disposable environment. If the repair instructions require deleting all user data, investigate whether a less destructive route can preserve it.

For store-managed editions, use the platform's test or staged distribution route and verify package identity continuity. For repository-managed Linux packages, test through the repository/package manager. An update test that bypasses the real owner cannot establish that owner's behavior.

A release candidate also needs an accessibility smoke check after packaging. Fonts, assets, scaling and native window chrome can differ from development. Confirm keyboard navigation, readable focus, reduced-motion behavior and a usable first-run layout in the installed artifact. Packaging correctness includes the interface the user receives, not only whether the executable launches.

Before promoting a candidate, inspect its displayed version and edition in the installed About or diagnostics screen. Support needs those values to distinguish beta, direct and store packages. A filename alone is not reliable once a user has renamed or moved an installer.
