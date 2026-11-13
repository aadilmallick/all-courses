# Versions, primary research and uncertainty

[Course index](../README.md)

Research snapshot: **November 13, 2026**. Sources below were retrieved through the available web/GitHub connections. Course explanations, workflows, code and example calculations are original teaching material; references establish API behavior, standards and current distribution constraints. No vendor pricing or revenue result is promised.

## Baseline and conflicts resolved

| Component | Snapshot or decision | Verification scope |
|---|---|---|
| Electron | 45.3.2, latest-release page at snapshot | Official release and pinned source API inventory; runtime not installed here |
| Forge | 8.0.1 | Official release notes; scaffold command is `create-electron-app --template vite --typescript` |
| Forge Vite plugin | Stable in Forge 8 | Older guide says experimental; major release notes take precedence for Forge 8 |
| Development Node | Forge 8 requires at least 22.17; local examples tested with 24.22.1 | Host runtime and embedded Electron Node are distinct |
| React/TypeScript/Vite | Use a compatible resolved set and commit lockfile | Exact learner installation not resolved here; snippets are labeled integration fragments |
| Clerk Electron | Beta; exact installed SDK must be pinned by learner | Official process entrypoints and requirements checked; live login not performed |
| Clerk auth methods | See current SDK support table | Do not assume browser SDK parity or offline-loaded auth UI |
| Clerk Billing | Separate subscription product using Stripe processing | Web account/checkout route; no invented native desktop checkout API |
| Secret storage | Current docs provide async APIs and deprecate sync APIs | Check pinned typings and rotation semantics; no real OS-keychain test here |
| Electron-builder | Documentation distinguishes stable v26 from next v27 at snapshot | Match installed stable version; do not copy next-only targets blindly |
| Forge MSIX | Page retains experimental label | Verify maker status and SDK configuration at pinned version |
| Apple signing | Developer ID Application for direct app; installer certificate is distinct | Apple and Electron primary guides resolve an imprecise Forge certificate description |
| Microsoft signing | Current managed service documentation uses Artifact Signing | Older Trusted Signing URL redirects; eligibility and prices must be checked before purchase |
| MCP | Latest specification resolved to 2026-07-28 | Pin protocol/SDK; course does not assume historical transport details remain current |
| Hermes | Official Desktop feature reference and upstream build contract | Functional inspiration; no unsupported CLI protocol invented |

## Electron and build tooling

- [Latest Electron release](https://github.com/electron/electron/releases/latest): version snapshot.
- [Pinned Electron source](https://github.com/electron/electron/tree/v45.3.2): API catalog source.
- [Electron support timelines](https://www.electronjs.org/docs/latest/tutorial/electron-timelines): maintenance policy.
- [Process model](https://www.electronjs.org/docs/latest/tutorial/process-model): contexts and process roles.
- [Security](https://www.electronjs.org/docs/latest/tutorial/security): runtime/application boundary baseline.
- [Performance](https://www.electronjs.org/docs/latest/tutorial/performance): measurement and resource guidance.
- [ESM](https://www.electronjs.org/docs/latest/tutorial/esm): loader and preload differences.
- [contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge): safe contract surface.
- [ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main): handler/event behavior.
- [protocol](https://www.electronjs.org/docs/latest/api/protocol): local content and session registration.
- [safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage): asynchronous protection and platform differences.
- [utilityProcess](https://www.electronjs.org/docs/latest/api/utility-process): worker lifecycle.
- [Fuses](https://www.electronjs.org/docs/latest/tutorial/fuses): package-time hardening.
- [Forge releases](https://github.com/electron/forge/releases): Forge 8 migration and current scaffold.
- [Forge Vite guide](https://www.electronforge.io/config/plugins/vite): compare its version context with current release notes.
- [Forge getting started](https://www.electronforge.io/): build pipeline concepts.

## Identity and payments

- [RFC 8252 — OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252): external browser and native-client pattern.
- [RFC 8628 — Device Authorization Grant](https://www.rfc-editor.org/rfc/rfc8628): user code, polling and expiry.
- [Clerk Electron SDK reference](https://clerk.com/docs/reference/electron/overview): beta status, process split and support table.
- [Clerk Electron quickstart](https://clerk.com/docs/electron/getting-started/quickstart): bridge/React setup; compare its older scaffolding with Forge 8.
- [Clerk Electron deep links](https://clerk.com/docs/guides/configure/auth-strategies/oauth-deep-links): packaged callback configuration.
- [Clerk OAuth](https://clerk.com/docs/guides/configure/auth-strategies/oauth/how-clerk-implements-oauth): public client and PKCE support.
- [Clerk Billing](https://clerk.com/docs/guides/billing/overview): subscription-model distinction and checkout scope.
- [Stripe Checkout](https://docs.stripe.com/payments/checkout): hosted payment surface.
- [Stripe webhooks](https://docs.stripe.com/webhooks): signature and event integration.
- [Stripe usage billing](https://docs.stripe.com/billing/subscriptions/usage-based): check current product recommendation before metered billing implementation.
- [Electron inAppPurchase](https://www.electronjs.org/docs/latest/api/in-app-purchase): Mac App Store purchase surface.

## Agent, storage and verification

- [Hermes Desktop guide](https://hermes-agent.nousresearch.com/docs/user-guide/desktop): feature reference.
- [Hermes Desktop README](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/README.md): desktop workflow overview.
- [Hermes Desktop building contract](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/BUILDING.md): inspect pinned runtime integration and artifact ownership.
- [Hermes license](https://github.com/NousResearch/hermes-agent/blob/main/LICENSE): reuse requirements; independently review bundled assets.
- [MCP specification](https://modelcontextprotocol.io/specification/latest): current protocol reference.
- [Node child_process](https://nodejs.org/api/child_process.html): process launch semantics; match embedded runtime version.
- [SQLite FTS5](https://www.sqlite.org/fts5.html): lexical indexing surface.
- [SQLite backup](https://www.sqlite.org/backup.html): consistent backup mechanisms.
- [Playwright Electron](https://playwright.dev/docs/api/class-electron): experimental automation surface.

## Signing, stores and product assets

- [Apple Developer ID certificates](https://developer.apple.com/help/account/certificates/create-developer-id-certificates/): direct-distribution identity types.
- [Apple notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution): supported workflow; Markdown representation was read where the HTML page required JavaScript.
- [Electron Mac App Store guide](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide): MAS build, sandbox and submission constraints.
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/): current product-specific policy review required before submission.
- [Apple product page guidance](https://developer.apple.com/app-store/product-page/): store presentation.
- [Forge macOS signing](https://www.electronforge.io/guides/code-signing/code-signing-macos): packager integration; use Apple for certificate semantics.
- [Forge Windows signing](https://www.electronforge.io/guides/code-signing/code-signing-windows): integration and key-storage context.
- [SignTool](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool): signature verification.
- [Artifact Signing](https://learn.microsoft.com/en-us/azure/artifact-signing/overview): managed-signing option.
- [Microsoft Store publishing](https://learn.microsoft.com/en-us/windows/apps/publish/): package-specific submission routes.
- [Microsoft Store policies](https://learn.microsoft.com/windows/apps/publish/store-policies): current commerce and product rules.
- [Forge MSIX maker](https://www.electronforge.io/config/makers/msix): current target requirements and status.
- [Flatpak permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html): sandbox and portal concepts.
- [Electron built-in updater](https://www.electronjs.org/docs/latest/api/auto-updater): supported platform mechanism.
- [Builder updater](https://www.electron.build/docs/features/auto-update/): package-specific metadata and stable/next distinction.
- [LinkedIn overview](https://www.linkedin.com/help/linkedin/answer/a548441): platform participation options; no algorithmic reach claim.

## Token-count provenance

The included counter implements ordinary-text cl100k_base byte-pair encoding using the vocabulary distributed by [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer). Its reconstructed rank-file SHA-256 is checked against the official value in [tiktoken's encoding definition](https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py). The regex is adapted for JavaScript; the script checks known fixtures. Counts are deterministic for the included files and named counter, not a claim that every model uses this tokenizer. See VERIFICATION.md for exact results and limitations.
