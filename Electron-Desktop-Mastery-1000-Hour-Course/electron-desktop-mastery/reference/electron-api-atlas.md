# Practical Electron API atlas

[Course index](../README.md) · [Full signature catalog](electron-api-signature-catalog.md)

The course teaches core patterns in chapters 01–07. This atlas maps every top-level API documentation page at Electron **v45.3.2** to an application experiment. The signature catalog additionally enumerates methods, events and properties from all **81** pages and links all **112** structured object pages. This is version-pinned coverage, not a claim that every overload is demonstrated or every experimental/platform feature was executed.

Use the atlas inside the chapter's existing investigation hours. Specialized experiments replace part of that block when relevant to your target product; they do not silently add hours to the 1,000-hour total. Learn core lifecycle, IPC, data, permissions and release surfaces first, then use the specialized rows as application-driven extensions.

| API page | Practical understanding and application |
|---|---|
| [app-shim-host](https://github.com/electron/electron/blob/v45.3.2/docs/api/app-shim-host.md) | Experimental macOS app shims. Verify connected code identity; do not trust only a supplied bundle ID. |
| [app](https://github.com/electron/electron/blob/v45.3.2/docs/api/app.md) | Lifecycle, single-instance routing, profile paths, OS activation and version diagnostics. Reopen after closing all windows and route a second launch. |
| [auto-updater](https://github.com/electron/electron/blob/v45.3.2/docs/api/auto-updater.md) | Supported update lifecycle. Match artifact, metadata, signature and update owner. |
| [base-window](https://github.com/electron/electron/blob/v45.3.2/docs/api/base-window.md) | Separate native frame ownership from web content. Compose a window and explicitly destroy owned contents. |
| [browser-view](https://github.com/electron/electron/blob/v45.3.2/docs/api/browser-view.md) | Deprecated migration surface. Port a small legacy view to WebContentsView and compare lifecycle cleanup. |
| [browser-window](https://github.com/electron/electron/blob/v45.3.2/docs/api/browser-window.md) | Native window construction, lifecycle, bounds, focus, fullscreen and webPreferences. Restore visible bounds after removing a monitor. |
| [client-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/client-request.md) | Request lifecycle and streaming upload/download. Cancel an active request and bound buffers. |
| [clipboard-item](https://github.com/electron/electron/blob/v45.3.2/docs/api/clipboard-item.md) | Typed clipboard data representation. Bound binary data and confirm supported formats on the target OS. |
| [clipboard](https://github.com/electron/electron/blob/v45.3.2/docs/api/clipboard.md) | User-initiated clipboard operations. Keep rich HTML and plain-text export policies distinct. |
| [command-line-switches](https://github.com/electron/electron/blob/v45.3.2/docs/api/command-line-switches.md) | Supported switches by runtime version. Record required flags and remove incidental copied flags. |
| [command-line](https://github.com/electron/electron/blob/v45.3.2/docs/api/command-line.md) | Early runtime switches with a documented purpose. Never disable a security feature as an unexplained workaround. |
| [content-tracing](https://github.com/electron/electron/blob/v45.3.2/docs/api/content-tracing.md) | Collect bounded performance traces. Compare the same workload before and after one change. |
| [context-bridge](https://github.com/electron/electron/blob/v45.3.2/docs/api/context-bridge.md) | Expose a narrow immutable application contract. Return data and cleanup functions without exposing IPC events. |
| [cookies](https://github.com/electron/electron/blob/v45.3.2/docs/api/cookies.md) | Manage browser session cookies through their session owner. Never treat them as ordinary telemetry. |
| [corner-smoothing-css](https://github.com/electron/electron/blob/v45.3.2/docs/api/corner-smoothing-css.md) | Optional CSS corner rendering. Compare visuals and retain readable focus and a supported fallback. |
| [crash-reporter](https://github.com/electron/electron/blob/v45.3.2/docs/api/crash-reporter.md) | Crash collection with redaction, consent and symbols policy. Verify edition availability. |
| [debugger](https://github.com/electron/electron/blob/v45.3.2/docs/api/debugger.md) | Debug protocol attachment and lifecycle. Keep production exposure separate from test diagnostics. |
| [desktop-capturer](https://github.com/electron/electron/blob/v45.3.2/docs/api/desktop-capturer.md) | Source selection and capture. Preview attachments and handle denial without collecting unrelated screens. |
| [dialog](https://github.com/electron/electron/blob/v45.3.2/docs/api/dialog.md) | Open/save/message dialogs with cancellation as a normal result. Use selected destinations for export. |
| [dock](https://github.com/electron/electron/blob/v45.3.2/docs/api/dock.md) | macOS dock integration. Keep dock activation and app-window lifetime consistent. |
| [download-item](https://github.com/electron/electron/blob/v45.3.2/docs/api/download-item.md) | Download progress, destination, cancellation and completion. Validate origin and avoid automatic execution. |
| [environment-variables](https://github.com/electron/electron/blob/v45.3.2/docs/api/environment-variables.md) | Runtime/build environment behavior. Minimize environment inherited by tools and keep secrets out of logs. |
| [extensions-api](https://github.com/electron/electron/blob/v45.3.2/docs/api/extensions-api.md) | Chromium extension compatibility limits. Test the actual APIs needed by a chosen extension. |
| [extensions](https://github.com/electron/electron/blob/v45.3.2/docs/api/extensions.md) | Session-owned browser extension lifecycle. Explicitly review extension source and capability. |
| [global-shortcut](https://github.com/electron/electron/blob/v45.3.2/docs/api/global-shortcut.md) | Registration conflicts and cleanup. Offer a user-controlled alternate combination. |
| [image-view](https://github.com/electron/electron/blob/v45.3.2/docs/api/image-view.md) | Native image view composition. Release resources during view replacement. |
| [in-app-purchase](https://github.com/electron/electron/blob/v45.3.2/docs/api/in-app-purchase.md) | Mac App Store transaction lifecycle. Restore and verify purchases through the appropriate server path. |
| [incoming-message](https://github.com/electron/electron/blob/v45.3.2/docs/api/incoming-message.md) | Consume response streams and status. Handle truncation and decoding failures. |
| [ipc-main-service-worker](https://github.com/electron/electron/blob/v45.3.2/docs/api/ipc-main-service-worker.md) | Worker-specific IPC policy. Do not assume frame authorization automatically covers worker callers. |
| [ipc-main](https://github.com/electron/electron/blob/v45.3.2/docs/api/ipc-main.md) | Decode, authorize and handle native requests. Reject a correct payload from an unauthorized frame. |
| [ipc-renderer](https://github.com/electron/electron/blob/v45.3.2/docs/api/ipc-renderer.md) | Use fixed request and event channels in preload only. Subscribe and remove the exact listener. |
| [language-model-utility](https://github.com/electron/electron/blob/v45.3.2/docs/api/language-model-utility.md) | Experimental local model utility contract. Check availability, stream output and destroy model state. |
| [local-ai-handler](https://github.com/electron/electron/blob/v45.3.2/docs/api/local-ai-handler.md) | Experimental connection of local AI implementations. Feature-detect and preserve an alternate adapter. |
| [menu-item](https://github.com/electron/electron/blob/v45.3.2/docs/api/menu-item.md) | Roles, enabled state and accelerators. Ensure disabled operations cannot execute via another surface. |
| [menu](https://github.com/electron/electron/blob/v45.3.2/docs/api/menu.md) | Platform-aware application/context menus. Route commands into shared services. |
| [message-channel-main](https://github.com/electron/electron/blob/v45.3.2/docs/api/message-channel-main.md) | Create message-port pairs for bounded streams. Close both endpoints when their owners disappear. |
| [message-port-main](https://github.com/electron/electron/blob/v45.3.2/docs/api/message-port-main.md) | Message delivery and port lifetime. Test a disconnected consumer and backpressure policy. |
| [native-image](https://github.com/electron/electron/blob/v45.3.2/docs/api/native-image.md) | Native image conversion and scaling. Validate packaged icon paths and high-density representations. |
| [native-theme](https://github.com/electron/electron/blob/v45.3.2/docs/api/native-theme.md) | System/explicit theme state. Update interface and native assets without losing user preference. |
| [navigation-history](https://github.com/electron/electron/blob/v45.3.2/docs/api/navigation-history.md) | Navigation stack and supported entry operations. Keep untrusted preview history separate from app routing. |
| [net-log](https://github.com/electron/electron/blob/v45.3.2/docs/api/net-log.md) | Generate opt-in network diagnostics with sensitive-data review. Explain what a support bundle contains. |
| [net](https://github.com/electron/electron/blob/v45.3.2/docs/api/net.md) | Electron networking with deliberate session/proxy behavior. Compare with Node fetch under a controlled proxy. |
| [notification](https://github.com/electron/electron/blob/v45.3.2/docs/api/notification.md) | Native notification lifetime and activation. Keep sensitive message content off the lock screen. |
| [parent-port](https://github.com/electron/electron/blob/v45.3.2/docs/api/parent-port.md) | Utility-process parent communication. Add a versioned ready handshake and reject unknown events. |
| [power-monitor](https://github.com/electron/electron/blob/v45.3.2/docs/api/power-monitor.md) | Suspend/resume, battery and relevant power events. Reconnect without replaying stale work. |
| [power-save-blocker](https://github.com/electron/electron/blob/v45.3.2/docs/api/power-save-blocker.md) | Bounded prevention of sleep during a requested task. Always release at terminal state. |
| [process](https://github.com/electron/electron/blob/v45.3.2/docs/api/process.md) | Electron-specific process diagnostics and runtime versions. Separate host Node from embedded Node in a support report. |
| [protocol](https://github.com/electron/electron/blob/v45.3.2/docs/api/protocol.md) | Serve a manifest of packaged assets; deny unknown hosts, paths and methods. Verify MIME and CSP. |
| [push-notifications](https://github.com/electron/electron/blob/v45.3.2/docs/api/push-notifications.md) | Platform-specific push registration. Separate remote notification delivery from permission to execute a job. |
| [safe-storage](https://github.com/electron/electron/blob/v45.3.2/docs/api/safe-storage.md) | Asynchronous OS-backed secret protection. Handle unavailable providers, rotation and memory-only fallback. |
| [screen](https://github.com/electron/electron/blob/v45.3.2/docs/api/screen.md) | Displays, work areas and scaling. Restore an offscreen window into an available display. |
| [service-worker-main](https://github.com/electron/electron/blob/v45.3.2/docs/api/service-worker-main.md) | Main-process view of a worker. Bind its lifetime and communication to its session. |
| [service-workers](https://github.com/electron/electron/blob/v45.3.2/docs/api/service-workers.md) | Session-owned service-worker registry. Inspect stale workers and offline cache ownership. |
| [session](https://github.com/electron/electron/blob/v45.3.2/docs/api/session.md) | Partitions, permissions, proxy behavior, cookies, downloads and content settings. Isolate remote previews. |
| [share-menu](https://github.com/electron/electron/blob/v45.3.2/docs/api/share-menu.md) | Platform sharing UI. Export only a selected safe representation with a fallback. |
| [shared-texture](https://github.com/electron/electron/blob/v45.3.2/docs/api/shared-texture.md) | Advanced GPU/offscreen texture exchange. Study ownership/synchronization before adopting; keep a CPU fallback. |
| [shell](https://github.com/electron/electron/blob/v45.3.2/docs/api/shell.md) | Approved external URL/file operations. Parse destinations and do not execute model-generated shell text. |
| [system-preferences](https://github.com/electron/electron/blob/v45.3.2/docs/api/system-preferences.md) | Platform settings and supported permission/biometric surfaces. Treat local unlock separately from cloud identity. |
| [touch-bar-button](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-button.md) | Optional command button. Reuse the same command service as menus. |
| [touch-bar-color-picker](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-color-picker.md) | Optional color choice. Validate resulting preference and provide a regular settings control. |
| [touch-bar-group](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-group.md) | Organize optional controls. Do not make command availability depend on hardware. |
| [touch-bar-label](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-label.md) | Concise optional status text. Keep meaningful state visible in the main window. |
| [touch-bar-other-items-proxy](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-other-items-proxy.md) | Composition with other optional items. Test coexistence rather than assuming exclusive ownership. |
| [touch-bar-popover](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-popover.md) | Optional grouped controls. Provide keyboard-accessible equivalent UI. |
| [touch-bar-scrubber](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-scrubber.md) | Optional list selection. Keep selection state owned by the application model. |
| [touch-bar-segmented-control](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-segmented-control.md) | Optional mode selection. Validate mode changes through a domain operation. |
| [touch-bar-slider](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-slider.md) | Optional numeric input. Clamp and validate the underlying setting. |
| [touch-bar-spacer](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-spacer.md) | Optional layout aid. Avoid treating layout-specific controls as domain state. |
| [touch-bar](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar.md) | Platform-specific optional controls. Keep all essential actions available through standard UI. |
| [tray](https://github.com/electron/electron/blob/v45.3.2/docs/api/tray.md) | Background app controls and resource lifetime. Make Quit discoverable and test desktop variations. |
| [utility-process](https://github.com/electron/electron/blob/v45.3.2/docs/api/utility-process.md) | Supervised Node-capable work. Crash and restart a worker without replaying an uncertain write. |
| [view](https://github.com/electron/electron/blob/v45.3.2/docs/api/view.md) | Layout native child views. Resize a composed workspace and verify every child receives bounded geometry. |
| [web-contents-view](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-contents-view.md) | Embed an unprivileged preview with its own session, navigation policy and cleanup owner. |
| [web-contents](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-contents.md) | Loading, navigation, events, printing, debugging, downloads and renderer lifecycle. Investigate a failed load without weakening security. |
| [web-frame-main](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-frame-main.md) | Authorize a main-process view of a frame. Reject an iframe request even inside an approved window. |
| [web-frame](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-frame.md) | Renderer frame configuration and resource information. Measure usage without granting native authority. |
| [web-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-request.md) | Observe or modify filtered requests under a documented policy. Avoid logging credentials. |
| [web-socket](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-socket.md) | Use the pinned Electron WebSocket surface where appropriate; authenticate endpoints and bound messages. |
| [web-utils](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-utils.md) | Supported file helpers from preload. Turn a dropped file into a validated import request. |
| [webview-tag](https://github.com/electron/electron/blob/v45.3.2/docs/api/webview-tag.md) | Legacy/specialized guest embedding. Compare with WebContentsView and review guest preload and permissions. |
| [window-open](https://github.com/electron/electron/blob/v45.3.2/docs/api/window-open.md) | New-window policy and safe destination handling. Reject unexpected popup creation. |

## How to read an unfamiliar API

Identify the process and platform first. Then inspect construction or acquisition, asynchronous result shape, events, ownership, cleanup, permissions and version history. Read the related data structures instead of guessing option names. Implement the smallest observable experiment and its denied/cancelled path before integrating into the capstone. Prefer the installed Electron declaration file for exact overloads and the pinned documentation for behavior.

For an event-emitting object, list who registers and removes listeners. For a native resource, list who destroys it. For network/file access, list which user action grants authority. For an experimental API, isolate the integration behind an adapter and preserve a fallback. For deprecated APIs, learn enough to migrate existing code rather than start new code on the obsolete surface.

## New local-AI and app-shim surfaces

The pinned snapshot includes experimental local-AI and app-shim pages. Treat those as optional investigations. Local-AI availability, downloads and model lifecycle must be checked explicitly; do not replace a stable provider adapter on the assumption that every machine supplies a usable local model. App shims require code-identity verification and have platform and edition constraints. Both examples reinforce the same practical rule: an API appearing in the reference is not evidence that it fits every production target.

## API breadth versus product completeness

An app does not need to call every Electron API to be production grade. A strong engineer can locate the relevant surface, understand its authority and lifetime, implement it correctly and verify it on its supported platforms. The catalog makes the breadth inspectable; the chapters teach the reasoning needed to use that breadth responsibly.

