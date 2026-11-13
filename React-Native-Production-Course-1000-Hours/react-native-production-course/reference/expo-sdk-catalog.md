# Expo SDK 58 — complete top-level module catalog

[Course home](../README.md) · [Capability teaching chapter](../lessons/03-state-offline-and-expo-sdk.md)

Research date: **2026-11-13**. This catalog covers **all 90 entries** in the Expo SDK section of the official reference index. Some entries are alternate pages for one package. It includes TypeScript discovery probes, integration intent, platform metadata, and an explicit lab for each entry. It does **not** reproduce every method signature, every platform-specific option, or the entire Expo UI component manual. Follow the linked versioned-current official page for symbol details. The JSON inventory records the researched package mapping. Module metadata is not a guarantee that every method works on every listed platform or in Expo Go.

## How to use a TypeScript probe

Install only the selected capability with `npx expo install PACKAGE`, rebuild the development client if native configuration changes, and create a temporary `.ts` file using the entry's probe. The probe asks the editor for the installed module's exported type shape; it performs no runtime operation. Use editor completion and the linked reference to choose the documented function, component, hook, permission, and cleanup contract. Then implement the entry's small capability lab. Do not install all modules into the finance app.

A type probe is intentionally different from a runnable feature example. Complete feature examples for storage, biometrics, Apple sign-in, files, pickers, notifications, and query integration are in Chapter 03. The catalog avoids inventing a new module's API merely to make every row look executable. Node/build-only and server-only modules belong in those environments, not a screen.

## Module index

| Entry | Package | Integration purpose |
| --- | --- | --- |
| [Expo](#expo) | `expo` | Runtime utilities and module integration |
| [Accelerometer](#accelerometer) | `expo-sensors` | Acceleration observations |
| [AgeRange](#agerange) | `expo-age-range` | Platform age-range capability |
| [AppIntegrity](#appintegrity) | `@expo/app-integrity` | Platform integrity and attestation signals |
| [AppIntents](#appintents) | `expo-app-intents` | Expose eligible actions to Apple system experiences |
| [AppleAuthentication](#appleauthentication) | `expo-apple-authentication` | Native Apple identity UI |
| [Application](#application) | `expo-application` | App identity and version metadata |
| [Asset](#asset) | `expo-asset` | Bundled asset loading |
| [Audio (expo-audio)](#audio-expo-audio) | `expo-audio` | Current audio recording and playback |
| [AuthSession](#authsession) | `expo-auth-session` | Browser authorization-session primitives |
| [BackgroundFetch](#backgroundfetch) | `expo-background-fetch` | Older background-fetch API |
| [BackgroundTask](#backgroundtask) | `expo-background-task` | Deferrable background work |
| [Barometer](#barometer) | `expo-sensors` | Atmospheric-pressure sensor |
| [Battery](#battery) | `expo-battery` | Battery state and power information |
| [Blob](#blob) | `expo-blob` | Binary data abstraction |
| [BlurView](#blurview) | `expo-blur` | Blurred visual surface |
| [Brightness](#brightness) | `expo-brightness` | Screen brightness interaction |
| [Brownfield](#brownfield) | `expo-brownfield` | Embed Expo into an existing native app |
| [BuildProperties](#buildproperties) | `expo-build-properties` | Native build configuration plugin |
| [Calendar](#calendar) | `expo-calendar` | Current calendar capability |
| [Calendar (legacy)](#calendar-legacy) | `expo-calendar` | Legacy calendar entry point |
| [Camera](#camera) | `expo-camera` | Camera preview and capture |
| [Cellular](#cellular) | `expo-cellular` | Cellular network information |
| [Checkbox](#checkbox) | `expo-checkbox` | Native-compatible Boolean input |
| [Clipboard](#clipboard) | `expo-clipboard` | Clipboard interaction |
| [Constants](#constants) | `expo-constants` | Runtime and app configuration metadata |
| [Contacts](#contacts) | `expo-contacts` | Current contacts capability |
| [Contacts (legacy)](#contacts-legacy) | `expo-contacts` | Legacy contacts entry point |
| [Crypto](#crypto) | `expo-crypto` | Randomness and cryptographic utilities |
| [DevClient](#devclient) | `expo-dev-client` | Custom development binary tools |
| [Device](#device) | `expo-device` | Device and platform diagnostics |
| [DeviceMotion](#devicemotion) | `expo-sensors` | Combined motion observations |
| [DevMenu](#devmenu) | `expo-dev-menu` | Development-only menu integration |
| [DocumentPicker](#documentpicker) | `expo-document-picker` | User-selected documents |
| [FileSystem](#filesystem) | `expo-file-system` | Current file and directory objects |
| [FileSystem (legacy)](#filesystem-legacy) | `expo-file-system` | Legacy filesystem entry point |
| [Fingerprint](#fingerprint) | `@expo/fingerprint` | Native-runtime fingerprint tooling |
| [Font](#font) | `expo-font` | Font loading and configuration |
| [GlassEffect](#glasseffect) | `expo-glass-effect` | Platform glass material |
| [GLView](#glview) | `expo-gl` | Graphics context rendering |
| [Gyroscope](#gyroscope) | `expo-sensors` | Angular-velocity observations |
| [Haptics](#haptics) | `expo-haptics` | Tactile feedback |
| [Hinge](#hinge) | `expo-hinge` | Foldable-device hinge observations |
| [Image](#image) | `expo-image` | Optimized image display |
| [ImageManipulator](#imagemanipulator) | `expo-image-manipulator` | Image transformations |
| [ImagePicker](#imagepicker) | `expo-image-picker` | System photo/video selection |
| [IntentLauncher](#intentlauncher) | `expo-intent-launcher` | Android intent launching |
| [KeepAwake](#keepawake) | `expo-keep-awake` | Prevent idle sleep for a justified task |
| [LightSensor](#lightsensor) | `expo-sensors` | Ambient-light observations |
| [LinearGradient](#lineargradient) | `expo-linear-gradient` | Gradient visual surface |
| [Linking](#linking) | `expo-linking` | App and external link utilities |
| [LivePhoto](#livephoto) | `expo-live-photo` | Apple live-photo display |
| [LocalAuthentication](#localauthentication) | `expo-local-authentication` | Device biometric/passcode confirmation |
| [Localization](#localization) | `expo-localization` | Locale and calendar preferences |
| [Location](#location) | `expo-location` | Current established location API |
| [Location (next)](#location-next) | `expo-location` | Next-generation location entry point |
| [Magnetometer](#magnetometer) | `expo-sensors` | Magnetic-field observations |
| [MailComposer](#mailcomposer) | `expo-mail-composer` | User-mediated email composition |
| [Manifests](#manifests) | `expo-manifests` | Expo manifest types and metadata |
| [Maps](#maps) | `expo-maps` | Expo native map components |
| [MediaLibrary](#medialibrary) | `expo-media-library` | Current media-library capability |
| [MediaLibrary (legacy)](#medialibrary-legacy) | `expo-media-library` | Legacy media-library entry point |
| [MeshGradient](#meshgradient) | `expo-mesh-gradient` | Mesh-gradient visual rendering |
| [NavigationBar](#navigationbar) | `expo-navigation-bar` | Android system navigation-bar control |
| [Network](#network) | `expo-network` | Connectivity information |
| [Notifications](#notifications) | `expo-notifications` | Local and remote notification integration |
| [Observe](#observe) | `expo-observe` | Expo observability integration |
| [Pedometer](#pedometer) | `expo-sensors` | Step-count capability |
| [Print](#print) | `expo-print` | Document printing and PDF output |
| [ScreenCapture](#screencapture) | `expo-screen-capture` | Screen-capture protection and events |
| [ScreenOrientation](#screenorientation) | `expo-screen-orientation` | Orientation controls |
| [SecureStore](#securestore) | `expo-secure-store` | Small sensitive key-value storage |
| [Sensors](#sensors) | `expo-sensors` | Sensor family overview |
| [Server](#server) | `expo-server` | Server runtime support |
| [Sharing](#sharing) | `expo-sharing` | System sharing capability |
| [SMS](#sms) | `expo-sms` | User-mediated text-message composition |
| [Speech](#speech) | `expo-speech` | Text-to-speech output |
| [SplashScreen](#splashscreen) | `expo-splash-screen` | Native startup presentation |
| [SQLite](#sqlite) | `expo-sqlite` | Structured local persistence |
| [StatusBar](#statusbar) | `expo-status-bar` | System status-bar presentation |
| [StoreReview](#storereview) | `expo-store-review` | System review-request capability |
| [Symbols](#symbols) | `expo-symbols` | Platform symbol rendering |
| [SystemUI](#systemui) | `expo-system-ui` | Root/system UI configuration |
| [TaskManager](#taskmanager) | `expo-task-manager` | Named background task registration |
| [TrackingTransparency](#trackingtransparency) | `expo-tracking-transparency` | Tracking authorization where applicable |
| [Updates](#updates) | `expo-updates` | Compatible JS and asset updates |
| [Video (expo-video)](#video-expo-video) | `expo-video` | Current video playback |
| [VideoThumbnails](#videothumbnails) | `expo-video-thumbnails` | Video thumbnail extraction |
| [WebBrowser](#webbrowser) | `expo-web-browser` | System browser and auth-session interaction |
| [Widgets](#widgets) | `expo-widgets` | Home-screen widget capability |

## Expo

**Purpose:** Runtime utilities and module integration. **Package:** `expo`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/expo/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo');
export type { CapabilityApi };
```

**Capability lab:** Inspect the generated template and distinguish app runtime code from build tooling.

## Accelerometer

**Purpose:** Acceleration observations. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios*', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/accelerometer/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Subscribe in a separate lab screen and remove the listener when leaving.

## AgeRange

**Purpose:** Platform age-range capability. **Package:** `expo-age-range`. **Platform metadata:** `['android', 'ios', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/age-range/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-age-range');
export type { CapabilityApi };
```

**Capability lab:** Read availability and consent requirements; handle an unavailable result without inferring an exact age.

## AppIntegrity

**Purpose:** Platform integrity and attestation signals. **Package:** `@expo/app-integrity`. **Platform metadata:** `['android', 'ios', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/app-integrity/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('@expo/app-integrity');
export type { CapabilityApi };
```

**Capability lab:** Verify evidence on the server; never treat a client Boolean as attestation.

## AppIntents

**Purpose:** Expose eligible actions to Apple system experiences. **Package:** `expo-app-intents`. **Platform metadata:** `['ios', 'tvos', 'macos']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/app-intents/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-app-intents');
export type { CapabilityApi };
```

**Capability lab:** Keep this advanced platform lab separate; check current alpha status and native declaration requirements.

## AppleAuthentication

**Purpose:** Native Apple identity UI. **Package:** `expo-apple-authentication`. **Platform metadata:** `['ios', 'tvos', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-apple-authentication');
export type { CapabilityApi };
```

**Capability lab:** Obtain a credential, verify/exchange through the chosen auth provider, and handle cancellation.

## Application

**Purpose:** App identity and version metadata. **Package:** `expo-application`. **Platform metadata:** `['android', 'ios', 'web', 'tvos', 'expo-go']`. The source returned recommended package range `~58.1.2` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/application/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-application');
export type { CapabilityApi };
```

**Capability lab:** Display version information in a support screen without collecting unnecessary identifiers.

## Asset

**Purpose:** Bundled asset loading. **Package:** `expo-asset`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.21` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/asset/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-asset');
export type { CapabilityApi };
```

**Capability lab:** Load a small bundled fixture and define a fallback if loading fails.

## Audio (expo-audio)

**Purpose:** Current audio recording and playback. **Package:** `expo-audio`. **Platform metadata:** `['android', 'ios', 'web', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.12` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/audio/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-audio');
export type { CapabilityApi };
```

**Capability lab:** Play an optional tutorial and test interruption, backgrounding, and permission denial.

## AuthSession

**Purpose:** Browser authorization-session primitives. **Package:** `expo-auth-session`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.18` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/auth-session/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-auth-session');
export type { CapabilityApi };
```

**Capability lab:** Use a provider-supported PKCE flow and exact redirect configuration.

## BackgroundFetch

**Purpose:** Older background-fetch API. **Package:** `expo-background-fetch`. **Platform metadata:** `['android', 'ios']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/background-fetch/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-background-fetch');
export type { CapabilityApi };
```

**Capability lab:** Recognize existing code and evaluate migration to BackgroundTask.

## BackgroundTask

**Purpose:** Deferrable background work. **Package:** `expo-background-task`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/background-task/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-background-task');
export type { CapabilityApi };
```

**Capability lab:** Make a resumable best-effort task; never promise exact wall-clock execution.

## Barometer

**Purpose:** Atmospheric-pressure sensor. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios*', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/barometer/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Check hardware availability and clean up the sensor subscription.

## Battery

**Purpose:** Battery state and power information. **Package:** `expo-battery`. **Platform metadata:** `['android', 'ios*', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/battery/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-battery');
export type { CapabilityApi };
```

**Capability lab:** Use only for a justified diagnostic or adaptation; handle unsupported platforms.

## Blob

**Purpose:** Binary data abstraction. **Package:** `expo-blob`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/blob/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-blob');
export type { CapabilityApi };
```

**Capability lab:** Practice a bounded binary payload and avoid accidental large-memory copies.

## BlurView

**Purpose:** Blurred visual surface. **Package:** `expo-blur`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/blur-view/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-blur');
export type { CapabilityApi };
```

**Capability lab:** Compare contrast and performance with a solid-color accessible fallback.

## Brightness

**Purpose:** Screen brightness interaction. **Package:** `expo-brightness`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/brightness/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-brightness');
export type { CapabilityApi };
```

**Capability lab:** Test user control and restoration behavior before using beyond a dedicated demo.

## Brownfield

**Purpose:** Embed Expo into an existing native app. **Package:** `expo-brownfield`. **Platform metadata:** `['android', 'ios']`. The source returned recommended package range `~58.0.20` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/brownfield/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-brownfield');
export type { CapabilityApi };
```

**Capability lab:** Study host-app lifecycle and ownership in a separate advanced integration project.

## BuildProperties

**Purpose:** Native build configuration plugin. **Package:** `expo-build-properties`. **Platform metadata:** `['android', 'ios', 'tvos']`. The source returned recommended package range `~58.0.12` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/build-properties/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-build-properties');
export type { CapabilityApi };
```

**Capability lab:** Change a build property in a branch and verify generated native output.

## Calendar

**Purpose:** Current calendar capability. **Package:** `expo-calendar`. **Platform metadata:** `['ios*', 'android*']`. The source returned recommended package range `~58.0.7` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/calendar/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-calendar');
export type { CapabilityApi };
```

**Capability lab:** Use the new API contract from the page and request access in context.

## Calendar (legacy)

**Purpose:** Legacy calendar entry point. **Package:** `expo-calendar`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.7` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/calendar-legacy/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-calendar/legacy');
export type { CapabilityApi };
```

**Capability lab:** Identify migration differences; do not mix new and legacy examples.

## Camera

**Purpose:** Camera preview and capture. **Package:** `expo-camera`. **Platform metadata:** `['android*', 'ios*', 'web', 'expo-go']`. The source returned recommended package range `~58.0.14` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/camera/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-camera');
export type { CapabilityApi };
```

**Capability lab:** Build a receipt-capture lab with denial, cancellation, and lifecycle cleanup.

## Cellular

**Purpose:** Cellular network information. **Package:** `expo-cellular`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/cellular/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-cellular');
export type { CapabilityApi };
```

**Capability lab:** Treat metadata as optional diagnostics and avoid assuming internet reachability.

## Checkbox

**Purpose:** Native-compatible Boolean input. **Package:** `expo-checkbox`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.2` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/checkbox/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-checkbox');
export type { CapabilityApi };
```

**Capability lab:** Expose a visible label and accessible checked state.

## Clipboard

**Purpose:** Clipboard interaction. **Package:** `expo-clipboard`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/clipboard/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-clipboard');
export type { CapabilityApi };
```

**Capability lab:** Copy a harmless demo value on explicit user action; avoid storing secrets there.

## Constants

**Purpose:** Runtime and app configuration metadata. **Package:** `expo-constants`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.16` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/constants/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-constants');
export type { CapabilityApi };
```

**Capability lab:** Inspect safe public configuration and distinguish it from server secrets.

## Contacts

**Purpose:** Current contacts capability. **Package:** `expo-contacts`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.11` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/contacts/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-contacts');
export type { CapabilityApi };
```

**Capability lab:** Use a separate permission lab rather than adding unrelated access to the finance app.

## Contacts (legacy)

**Purpose:** Legacy contacts entry point. **Package:** `expo-contacts`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.11` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/contacts-legacy/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-contacts/legacy');
export type { CapabilityApi };
```

**Capability lab:** Read migration guidance and isolate old code before updating.

## Crypto

**Purpose:** Randomness and cryptographic utilities. **Package:** `expo-crypto`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.8` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/crypto/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-crypto');
export type { CapabilityApi };
```

**Capability lab:** Generate operation IDs; keep protocol verification on the trusted boundary.

## DevClient

**Purpose:** Custom development binary tools. **Package:** `expo-dev-client`. **Platform metadata:** `['android', 'ios', 'tvos']`. The source returned recommended package range `~58.0.20` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/dev-client/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-dev-client');
export type { CapabilityApi };
```

**Capability lab:** Build a client containing selected native modules and serve JS to it.

## Device

**Purpose:** Device and platform diagnostics. **Package:** `expo-device`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/device/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-device');
export type { CapabilityApi };
```

**Capability lab:** Collect only information needed for support and handle missing fields.

## DeviceMotion

**Purpose:** Combined motion observations. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/devicemotion/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Subscribe with a bounded update rate and stop when the screen is inactive.

## DevMenu

**Purpose:** Development-only menu integration. **Package:** `expo-dev-menu`. **Platform metadata:** `['android', 'ios', 'tvos']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/dev-menu/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-dev-menu');
export type { CapabilityApi };
```

**Capability lab:** Keep custom diagnostic actions out of public user flows.

## DocumentPicker

**Purpose:** User-selected documents. **Package:** `expo-document-picker`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/document-picker/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-document-picker');
export type { CapabilityApi };
```

**Capability lab:** Import a bounded CSV with cancellation, content validation, and safe URI handling.

## FileSystem

**Purpose:** Current file and directory objects. **Package:** `expo-file-system`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.13` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/filesystem/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-file-system');
export type { CapabilityApi };
```

**Capability lab:** Create a synthetic export, share explicitly, and clean up temporary files.

## FileSystem (legacy)

**Purpose:** Legacy filesystem entry point. **Package:** `expo-file-system`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/filesystem-legacy/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-file-system/legacy');
export type { CapabilityApi };
```

**Capability lab:** Use only for deliberate maintenance; migrate helpers to current file objects.

## Fingerprint

**Purpose:** Native-runtime fingerprint tooling. **Package:** `@expo/fingerprint`. **Platform metadata:** `['node']`. The source returned recommended package range `~0.21.10` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/fingerprint/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('@expo/fingerprint');
export type { CapabilityApi };
```

**Capability lab:** Run in build tooling, record the runtime boundary, and keep it out of the app bundle.

## Font

**Purpose:** Font loading and configuration. **Package:** `expo-font`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.12` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/font/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-font');
export type { CapabilityApi };
```

**Capability lab:** Load required fonts with a failure path and test large text.

## GlassEffect

**Purpose:** Platform glass material. **Package:** `expo-glass-effect`. **Platform metadata:** `['ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/glass-effect/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-glass-effect');
export type { CapabilityApi };
```

**Capability lab:** Check runtime support and provide a readable solid-surface fallback.

## GLView

**Purpose:** Graphics context rendering. **Package:** `expo-gl`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/gl-view/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-gl');
export type { CapabilityApi };
```

**Capability lab:** Use a separate graphics lab and release resources on lifecycle changes.

## Gyroscope

**Purpose:** Angular-velocity observations. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios*', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/gyroscope/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Test hardware availability and listener cleanup.

## Haptics

**Purpose:** Tactile feedback. **Package:** `expo-haptics`. **Platform metadata:** `['android', 'ios', 'web']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/haptics/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-haptics');
export type { CapabilityApi };
```

**Capability lab:** Add optional confirmation feedback without making it the sole success signal.

## Hinge

**Purpose:** Foldable-device hinge observations. **Package:** `expo-hinge`. **Platform metadata:** `['android', 'ios']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/hinge/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-hinge');
export type { CapabilityApi };
```

**Capability lab:** Use capability detection; base ordinary layout on available window dimensions.

## Image

**Purpose:** Optimized image display. **Package:** `expo-image`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.18` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/image/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-image');
export type { CapabilityApi };
```

**Capability lab:** Render a bounded receipt thumbnail and test cache behavior on account switch.

## ImageManipulator

**Purpose:** Image transformations. **Package:** `expo-image-manipulator`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.16` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/imagemanipulator/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-image-manipulator');
export type { CapabilityApi };
```

**Capability lab:** Resize a selected image before upload while validating again on the server.

## ImagePicker

**Purpose:** System photo/video selection. **Package:** `expo-image-picker`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.10` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-image-picker');
export type { CapabilityApi };
```

**Capability lab:** Handle cancellation and current limited-library permission behavior.

## IntentLauncher

**Purpose:** Android intent launching. **Package:** `expo-intent-launcher`. **Platform metadata:** `['android', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/intent-launcher/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-intent-launcher');
export type { CapabilityApi };
```

**Capability lab:** Check target availability and keep arbitrary external input out of intent parameters.

## KeepAwake

**Purpose:** Prevent idle sleep for a justified task. **Package:** `expo-keep-awake`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/keep-awake/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-keep-awake');
export type { CapabilityApi };
```

**Capability lab:** Activate only for a bounded workflow and release on exit.

## LightSensor

**Purpose:** Ambient-light observations. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/light-sensor/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Keep the lab Android-scoped and handle no sensor.

## LinearGradient

**Purpose:** Gradient visual surface. **Package:** `expo-linear-gradient`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-linear-gradient');
export type { CapabilityApi };
```

**Capability lab:** Maintain text contrast and avoid using color as the only information channel.

## Linking

**Purpose:** App and external link utilities. **Package:** `expo-linking`. **Platform metadata:** `['android', 'ios', 'web', 'tvos', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/linking/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-linking');
export type { CapabilityApi };
```

**Capability lab:** Validate external input and test cold and warm deep-link entry.

## LivePhoto

**Purpose:** Apple live-photo display. **Package:** `expo-live-photo`. **Platform metadata:** `['ios', 'expo-go']`. The source returned recommended package range `~58.0.8` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/live-photo/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-live-photo');
export type { CapabilityApi };
```

**Capability lab:** Treat as an optional media lab with a static image fallback.

## LocalAuthentication

**Purpose:** Device biometric/passcode confirmation. **Package:** `expo-local-authentication`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-local-authentication');
export type { CapabilityApi };
```

**Capability lab:** Test enrollment, cancellation, lockout, and the distinction from cloud sign-in.

## Localization

**Purpose:** Locale and calendar preferences. **Package:** `expo-localization`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/localization/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-localization');
export type { CapabilityApi };
```

**Capability lab:** Format currency and dates using explicit domain semantics.

## Location

**Purpose:** Current established location API. **Package:** `expo-location`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.22` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/location/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-location');
export type { CapabilityApi };
```

**Capability lab:** Request foreground access in a separate lab and stop unnecessary tracking.

## Location (next)

**Purpose:** Next-generation location entry point. **Package:** `expo-location`. **Platform metadata:** `['android', 'ios']`. The source returned recommended package range `~58.0.22` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/location-next/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-location/next');
export type { CapabilityApi };
```

**Capability lab:** Check maturity and migration guidance before choosing it for production.

## Magnetometer

**Purpose:** Magnetic-field observations. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/magnetometer/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Test availability and remove listeners outside the lab screen.

## MailComposer

**Purpose:** User-mediated email composition. **Package:** `expo-mail-composer`. **Platform metadata:** `['android', 'ios*', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/mail-composer/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-mail-composer');
export type { CapabilityApi };
```

**Capability lab:** Check availability and never prefill credentials or private exports silently.

## Manifests

**Purpose:** Expo manifest types and metadata. **Package:** `expo-manifests`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.1` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/manifests/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-manifests');
export type { CapabilityApi };
```

**Capability lab:** Inspect build/runtime metadata without treating it as secret configuration.

## Maps

**Purpose:** Expo native map components. **Package:** `expo-maps`. **Platform metadata:** `['ios', 'android']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/maps/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-maps');
export type { CapabilityApi };
```

**Capability lab:** Check current maturity, platform requirements, and API-key restrictions.

## MediaLibrary

**Purpose:** Current media-library capability. **Package:** `expo-media-library`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.14` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/media-library/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-media-library');
export type { CapabilityApi };
```

**Capability lab:** Use user intent and scoped access; avoid requesting all photos unnecessarily.

## MediaLibrary (legacy)

**Purpose:** Legacy media-library entry point. **Package:** `expo-media-library`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.14` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/media-library-legacy/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-media-library/legacy');
export type { CapabilityApi };
```

**Capability lab:** Compare the migration contract before reusing old examples.

## MeshGradient

**Purpose:** Mesh-gradient visual rendering. **Package:** `expo-mesh-gradient`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/mesh-gradient/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-mesh-gradient');
export type { CapabilityApi };
```

**Capability lab:** Measure rendering cost and provide a simpler accessible fallback.

## NavigationBar

**Purpose:** Android system navigation-bar control. **Package:** `expo-navigation-bar`. **Platform metadata:** `['android', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/navigation-bar/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-navigation-bar');
export type { CapabilityApi };
```

**Capability lab:** Verify current edge-to-edge constraints and contrast on actual devices.

## Network

**Purpose:** Connectivity information. **Package:** `expo-network`. **Platform metadata:** `['android', 'ios', 'web', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/network/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-network');
export type { CapabilityApi };
```

**Capability lab:** Use as a hint and still handle actual request failures.

## Notifications

**Purpose:** Local and remote notification integration. **Package:** `expo-notifications`. **Platform metadata:** `['android', 'ios']`. The source returned recommended package range `~58.1.9` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/notifications/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-notifications');
export type { CapabilityApi };
```

**Capability lab:** Separate permission, token registration, delivery, and tap routing.

## Observe

**Purpose:** Expo observability integration. **Package:** `expo-observe`. **Platform metadata:** `['android', 'ios', 'tvos']`. The source returned recommended package range `~58.0.19` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/observe/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-observe');
export type { CapabilityApi };
```

**Capability lab:** Verify current setup and inspect sanitized emitted data.

## Pedometer

**Purpose:** Step-count capability. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/pedometer/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Use a separate sensor lab with permission and hardware checks.

## Print

**Purpose:** Document printing and PDF output. **Package:** `expo-print`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.9` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/print/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-print');
export type { CapabilityApi };
```

**Capability lab:** Generate a synthetic report and verify its content before sharing.

## ScreenCapture

**Purpose:** Screen-capture protection and events. **Package:** `expo-screen-capture`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.6` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/screen-capture/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-screen-capture');
export type { CapabilityApi };
```

**Capability lab:** Understand platform limits; do not promise perfect prevention of recording.

## ScreenOrientation

**Purpose:** Orientation controls. **Package:** `expo-screen-orientation`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.4` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/screen-orientation/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-screen-orientation');
export type { CapabilityApi };
```

**Capability lab:** Test resizable windows and current platform restrictions.

## SecureStore

**Purpose:** Small sensitive key-value storage. **Package:** `expo-secure-store`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/securestore/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-secure-store');
export type { CapabilityApi };
```

**Capability lab:** Test credential failure and recovery; do not use as a transaction database.

## Sensors

**Purpose:** Sensor family overview. **Package:** `expo-sensors`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/sensors/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sensors');
export type { CapabilityApi };
```

**Capability lab:** Choose only required sensors and understand per-sensor support.

## Server

**Purpose:** Server runtime support. **Package:** `expo-server`. **Platform metadata:** `['server']`. The source returned recommended package range `~58.1.0` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/server/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-server');
export type { CapabilityApi };
```

**Capability lab:** Deploy server code separately; never bundle server credentials into native JS.

## Sharing

**Purpose:** System sharing capability. **Package:** `expo-sharing`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.23` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/sharing/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sharing');
export type { CapabilityApi };
```

**Capability lab:** Share a user-requested synthetic export and handle unavailable destinations.

## SMS

**Purpose:** User-mediated text-message composition. **Package:** `expo-sms`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/sms/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sms');
export type { CapabilityApi };
```

**Capability lab:** Check availability; never send sensitive data without explicit user action.

## Speech

**Purpose:** Text-to-speech output. **Package:** `expo-speech`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/speech/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-speech');
export type { CapabilityApi };
```

**Capability lab:** Provide a stop action and equivalent readable content.

## SplashScreen

**Purpose:** Native startup presentation. **Package:** `expo-splash-screen`. **Platform metadata:** `['android', 'ios', 'tvos']`. The source returned recommended package range `~58.0.13` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/splash-screen/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-splash-screen');
export type { CapabilityApi };
```

**Capability lab:** Release the splash on both success and recoverable failure.

## SQLite

**Purpose:** Structured local persistence. **Package:** `expo-sqlite`. **Platform metadata:** `['android', 'ios', 'macos', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.17` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/sqlite/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-sqlite');
export type { CapabilityApi };
```

**Capability lab:** Implement migrations, parameterized queries, and a user-scoped outbox.

## StatusBar

**Purpose:** System status-bar presentation. **Package:** `expo-status-bar`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/status-bar/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-status-bar');
export type { CapabilityApi };
```

**Capability lab:** Check contrast and current platform behavior with edge-to-edge layouts.

## StoreReview

**Purpose:** System review-request capability. **Package:** `expo-store-review`. **Platform metadata:** `['android', 'ios', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/storereview/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-store-review');
export type { CapabilityApi };
```

**Capability lab:** Ask at a relevant value moment and accept that the OS may not display it.

## Symbols

**Purpose:** Platform symbol rendering. **Package:** `expo-symbols`. **Platform metadata:** `['android', 'ios', 'tvos', 'web', 'expo-go']`. The source returned recommended package range `~58.0.5` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/symbols/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-symbols');
export type { CapabilityApi };
```

**Capability lab:** Check symbol availability and keep accessible labels independent of the glyph.

## SystemUI

**Purpose:** Root/system UI configuration. **Package:** `expo-system-ui`. **Platform metadata:** `['android', 'ios', 'tvos', 'web']`. The source returned recommended package range `~58.0.7` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/system-ui/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-system-ui');
export type { CapabilityApi };
```

**Capability lab:** Verify appearance in both themes and on actual platforms.

## TaskManager

**Purpose:** Named background task registration. **Package:** `expo-task-manager`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.14` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/task-manager/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-task-manager');
export type { CapabilityApi };
```

**Capability lab:** Define tasks at module scope and keep work bounded and repeatable.

## TrackingTransparency

**Purpose:** Tracking authorization where applicable. **Package:** `expo-tracking-transparency`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.1.0` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/tracking-transparency/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-tracking-transparency');
export type { CapabilityApi };
```

**Capability lab:** Request only when actual tracking behavior requires it; disclosures must match.

## Updates

**Purpose:** Compatible JS and asset updates. **Package:** `expo-updates`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.22` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/updates/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-updates');
export type { CapabilityApi };
```

**Capability lab:** Match native runtime, test preview rollout, and rehearse recovery.

## Video (expo-video)

**Purpose:** Current video playback. **Package:** `expo-video`. **Platform metadata:** `['android', 'ios', 'web', 'tvos', 'expo-go']`. Check the linked page for current maturity and package requirements.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/video/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-video');
export type { CapabilityApi };
```

**Capability lab:** Pause appropriately and provide captions and non-video access to essential content.

## VideoThumbnails

**Purpose:** Video thumbnail extraction. **Package:** `expo-video-thumbnails`. **Platform metadata:** `['android', 'ios', 'tvos', 'expo-go']`. The source returned recommended package range `~58.0.3` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/video-thumbnails/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-video-thumbnails');
export type { CapabilityApi };
```

**Capability lab:** Use bounded media and handle an invalid source.

## WebBrowser

**Purpose:** System browser and auth-session interaction. **Package:** `expo-web-browser`. **Platform metadata:** `['android', 'ios', 'web', 'expo-go']`. The source returned recommended package range `~58.0.8` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/webbrowser/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-web-browser');
export type { CapabilityApi };
```

**Capability lab:** Handle cancellation and callback completion through the supported auth flow.

## Widgets

**Purpose:** Home-screen widget capability. **Package:** `expo-widgets`. **Platform metadata:** `['ios', 'android']`. The source returned recommended package range `~58.0.28` on the research date; use Expo installation and your lockfile rather than treating this as an evergreen version.

[Official TypeScript/API reference](https://docs.expo.dev/versions/latest/sdk/widgets/)

```ts
// Compile-time discovery only; no runtime capability is invoked.
type CapabilityApi = typeof import('expo-widgets');
export type { CapabilityApi };
```

**Capability lab:** Check current iOS/Android setup and keep sensitive financial data off public surfaces by default.

## Router, Expo UI, and third-party families

Expo Router and Expo UI are separate sections of the official SDK reference, outside the 90-entry Expo SDK section counted above. Chapter 02 teaches Router stacks, groups, dynamic segments, tabs, modals, deep links, and protected routes. Consult the current [Router SDK reference](https://docs.expo.dev/versions/latest/sdk/router/) for stable data loaders, native tabs, split views, link options, and experimental variants. Do not assume an experimental stack has the same contract as the ordinary stack.

Expo UI includes [SwiftUI components](https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/), [Jetpack Compose components](https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/), [universal controls](https://docs.expo.dev/versions/latest/sdk/ui/universal/), and documented drop-in replacements. Learn one form with standard React Native primitives first, then rebuild a small part with native or universal controls and compare accessibility, platform behavior, and styling. Component-specific imports and modifiers must come from the current page and installed types; this catalog does not invent a shared API for distinct native toolkits.

The official index also curates third-party integrations: AsyncStorage, datetime picker, NetInfo, slider, masked view, picker, segmented control, FlashList, Skia, Stripe, Gesture Handler, keyboard controller, maps, pager view, Reanimated, safe-area context, screens, SVG, view-shot, and WebView. Chapters 02, 03, 07, and 09 explain their roles and selection criteria. Install only a justified dependency, verify New Architecture and SDK compatibility, and measure the resulting app.

## Capability acceptance pattern

For each selected module, record the installed version, native plugin/configuration, platform support, permission states, happy path, cancellation, denial, unavailability, cleanup, background/foreground behavior, and sensitive data emitted. Test at least one real target device for hardware features. A compile-time probe or mocked permission response does not prove native behavior. Keep optional sensor and media labs outside the core finance app unless the product benefits from them.
