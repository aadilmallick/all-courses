# Research sources and version ledger

Research/access date: **November 13, 2026**. Use primary documentation for APIs and policy. Examples are original teaching examples and have the execution status described in [verification](../verification.md). A source supporting an API does not establish that a particular cloud account, dependency combination, or device flow was tested.

## Verified baseline

| Component | Researched baseline | Evidence and use |
| --- | --- | --- |
| Expo | SDK 58, stable release announced October 15, 2026 | [Release notes](https://expo.dev/changelog/sdk-58) |
| React Native | 0.88 with SDK 58 | [SDK reference compatibility table](https://docs.expo.dev/versions/latest/) |
| React | 19.3.0 with SDK 58 | Same compatibility table |
| Node | Minimum 22.13.x for SDK 58 | Same compatibility table; domain lab executed with Node 24.22.1 |
| Clerk Expo | Current docs use `@clerk/expo` | [Expo quickstart](https://clerk.com/docs/expo/getting-started/quickstart) |
| Firebase JS | Current Expo guide requires Firebase 12+ | [Expo Firebase guide](https://docs.expo.dev/guides/using-firebase/) |
| Better Auth | Stable documentation, current resolved package must be checked | [Expo integration](https://better-auth.com/docs/integrations/expo); guide still names SDK 55, so SDK 58 compatibility requires a real build |
| Amplify | Gen 2 backend definitions and current v6 client family | [React Native quickstart](https://docs.amplify.aws/react-native/start/quickstart/) |
| Appwrite | Current React Native SDK and TablesDB row API | [Native setup](https://appwrite.io/docs/tutorials/react-native/step-3), [database tutorial](https://appwrite.io/docs/tutorials/react-native/step-6) |
| Plaid Link RN | Current guide describes 13.x session API | [Native Link guide](https://plaid.com/docs/link/react-native/); reconcile its native build requirements with SDK 58 before use |

`latest` URLs can change after the research date. Record your actual resolved package versions and lockfile. This course pins the teaching baseline by SDK major and documents update checks; it does not invent a lockfile for an uninstalled native application. The complete [90-entry SDK inventory](expo-sdk-inventory.json) records package mappings and available recommended ranges from the retrieved module pages. All 90 module pages were retrieved, using ordinary page URLs where Markdown URLs failed.

## Expo and React Native implementation references

| Source | What it supports |
| --- | --- |
| [Project creation](https://docs.expo.dev/tutorial/create-your-first-app/) | Current scaffolder and stable SDK selection |
| [Development builds](https://docs.expo.dev/develop/development-builds/introduction/) | Custom binary versus Expo Go |
| [Custom native code](https://docs.expo.dev/workflow/customizing/) | Modules and plugins instead of an eject workflow |
| [Router overview](https://docs.expo.dev/router/introduction/) | File-based navigation concepts |
| [Protected routes](https://docs.expo.dev/router/advanced/protected/) | Client route availability and history behavior |
| [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Async database APIs, plugin options, platform caveats |
| [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) | Sensitive key-value storage and limitations |
| [LocalAuthentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/) | Biometrics and development-build requirement for Face ID |
| [AppleAuthentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/) | Native Apple identity step and capability setup |
| [FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/) | Current file/directory API, distinct legacy entry |
| [ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) | Current selection result and platform behavior |
| [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Notification configuration and native limitations |
| [BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/) | Deferrable execution and operating-system scheduling |
| [Runtime versions](https://docs.expo.dev/eas-update/runtime-versions/) | Native/update compatibility and policies |
| [Unit testing](https://docs.expo.dev/develop/unit-testing/) | Expo Jest setup |

The [SDK catalog](expo-sdk-catalog.md) links every individual module source. Package metadata does not imply per-method support. New capabilities such as App Intents, next-generation location, or platform-native UI should be evaluated for current maturity before production adoption.

## Data and identity references

| Source | What it supports |
| --- | --- |
| [Supabase native auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react-native) | Native persistence and session configuration |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | Role-aware policies and identity checks |
| [Supabase third-party Clerk](https://supabase.com/docs/guides/auth/third-party/clerk) | Current access-token integration and JWT-claim policies |
| [Clerk Expo quickstart](https://clerk.com/docs/expo/getting-started/quickstart) | Current package, provider, token cache, hosted/native/custom choices |
| [Clerk hosted authentication](https://clerk.com/docs/expo/guides/account-portal/hosted-auth) | Hosted flow and callback behavior |
| [Better Auth Expo](https://better-auth.com/docs/integrations/expo) | Server/client plugins, secure storage, scheme, cookie handoff |
| [Better Auth Express](https://better-auth.com/docs/integrations/express) | Handler before body parser, Express 5 wildcard, session verification |
| [Firebase auth API](https://firebase.google.com/docs/reference/js/auth) | Modular auth and React Native persistence |
| [Firestore rules](https://firebase.google.com/docs/firestore/security/rules-conditions) | Authentication and document validation |
| [Firestore offline support](https://firebase.google.com/docs/firestore/manage-data/enable-offline) | SDK-specific persistence guarantees |
| [Amplify auth](https://docs.amplify.aws/react-native/build-a-backend/auth/set-up-auth/) | Gen 2 auth definition and native integration |
| [Amplify data](https://docs.amplify.aws/react-native/build-a-backend/data/set-up-data/) | Typed schema/client and authorization |
| [Appwrite native quickstart](https://appwrite.io/docs/quick-starts/react-native) | Platform registration, native client, account APIs |
| [Appwrite database quickstart](https://appwrite.io/docs/products/databases/tablesdb/quick-start) | TablesDB model and row operations |

## UI, state, and billing references

| Source | What it supports |
| --- | --- |
| [TanStack Query native integration](https://tanstack.com/query/latest/docs/framework/react/react-native) | AppState and network signals |
| [React Hook Form Controller](https://react-hook-form.com/docs/usecontroller/controller) | Controlled native inputs |
| [Reanimated withTiming](https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/) | Duration animation and reduced-motion setting |
| [RevenueCat Expo](https://www.revenuecat.com/docs/getting-started/installation/expo) | Development build and purchase SDK setup |
| [Stripe native PaymentSheet](https://docs.stripe.com/payments/mobile/accept-payment?platform=react-native&type=payment) | Client/server payment integration |
| [Plaid native Link](https://plaid.com/docs/link/react-native/) | Session creation, public-token callback, native constraints |
| [Plaid Transactions Sync](https://plaid.com/docs/transactions/sync-migration/) | Cursor-based additions, modifications, removals |
| [Plaid Transactions API](https://plaid.com/docs/api/products/transactions/) | Current sync and transaction contracts |
| [Rocket Money public product](https://www.rocketmoney.com/) | Category inspiration only; no branding or private implementation copied |

## Distribution, privacy, and marketing references

| Source | What it supports |
| --- | --- |
| [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/) | Digital purchases, regional distinctions, account and review expectations |
| [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) | In-app initiation and subscription considerations |
| [Google payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en) | Digital versus physical categories and exceptions |
| [Google payments explanation](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en) | Billing categories and alternative-purchase boundaries |
| [Google subscription guidance](https://support.google.com/googleplay/android-developer/answer/12154973?hl=en-en) | Cancellation and retained paid access |
| [Google personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en-en) | Account-specific 12-tester/14-day requirement at research date |
| [Google account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en) | In-app and external deletion-request path and Data Safety link |
| [Google target API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en-en) | API 36 requirement for ordinary new apps/updates from August 31, 2026 |
| [Apple upcoming requirements](https://developer.apple.com/news/upcoming-requirements/) | Current and upcoming toolchain/SDK requirements |
| [Apple September 2026 announcement](https://developer.apple.com/news/?id=k1mtkt1k) | Upcoming April 2027 iOS 27 SDK baseline |
| [Apple enrollment](https://developer.apple.com/help/account/membership/program-enrollment) | Account setup and researched fee |
| [Expo iOS submission](https://docs.expo.dev/submit/ios/) | Upload versus TestFlight/review/release |
| [Expo Android submission](https://docs.expo.dev/submit/android/) | Console prerequisites and service-account setup |
| [Apple product page optimization](https://developer.apple.com/app-store/product-page-optimization/) | Listing-asset experiments |
| [Apple custom product pages](https://developer.apple.com/app-store/custom-product-pages/) | Audience-specific listing presentation |
| [OWASP mobile security](https://mas.owasp.org/) | Mobile security review framework |

Policy statements are dated operational guidance, not a promise of approval or a legal opinion. Recheck payments, financial-feature declarations, privacy, account deletion, target SDK, billing-library, and tester requirements immediately before submission. Vendor pricing and free quotas were deliberately not frozen into the examples; use current official pricing and your own eligibility when making a budget. All revenue calculations in the lessons are hypothetical worked examples.

## Evidence limits

Research verifies documentation and version facts. It does not verify a live vendor dashboard configuration. The included domain tests execute locally. Native dependencies were not installed in this authoring environment, and no cloud backend, real bank connection, store purchase, native build, or store submission was performed. Integration snippets state their prerequisites or mark themselves as fragments/pseudocode. Follow the chapter acceptance work in your own project before making production claims.
