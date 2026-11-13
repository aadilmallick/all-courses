# Stack selection for PocketPilot

The recommended first implementation is **Expo SDK 58 + TypeScript + Expo Router + TanStack Query + Supabase Auth/Postgres + RevenueCat**, with server-owned bank integration and SQLite only for explicit offline requirements. This is a judgment for a relational finance app maintained by a small team, not a universal vendor score.

| Requirement | Default decision | Reason | Revisit when |
| --- | --- | --- | --- |
| Mobile runtime | Expo development builds | Native integrations and coordinated SDK versions | A native host app or unsupported capability changes requirements |
| Navigation | Expo Router | Coherent native route/deep-link structure | A measured requirement calls for a different navigation architecture |
| UI | Small token system + primitives | Learn native layout/accessibility before abstraction | A native or component-system control clearly saves work |
| Server state | TanStack Query | Cache, retry, cancellation, lifecycle integration | A supported sync engine replaces its responsibility deliberately |
| Relational data | Postgres through Supabase | Ownership constraints, joins, reporting | Access patterns or organization constraints justify another model |
| Identity | Supabase Auth | One identity system for the default track | Clerk's specific UX or organization features justify another boundary |
| Premium | RevenueCat + native store products | Reduce lifecycle/backend maintenance | Direct store control is worth its complete maintenance burden |
| Banking | Server-only provider adapter, Sandbox first | Keep long-lived credentials off phones | Live approval, coverage, cost, and obligations are understood |
| Offline | Explicit cache and outbox | Visible, testable sync semantics | Product research shows different durability needs |
| Observability | One chosen compatible error service + structured server metrics | Actionable diagnostics with minimized data | Reliability or privacy requirements change |

## Backend alternatives

| Candidate | Choose when | Validate before selection |
| --- | --- | --- |
| Clerk + Supabase/Postgres | Identity UX and account features materially reduce work | Current subject mapping, RLS claims, production callback setup |
| Firebase | Document access patterns and native Firebase services fit | Rules, indexes, actual SDK offline persistence, cost under listeners |
| Better Auth + API + Postgres | You want TypeScript server control and can operate it | Email, secret rotation, sessions, patching, backups, SQL isolation |
| Amplify Gen 2 | AWS infrastructure and resource integration are advantages | IAM, owner rules, generated resources, native build compatibility |
| Appwrite | Integrated services and your preferred cloud/self-hosted model fit | Table/row permissions, server scopes, platform callbacks, recovery |

## Library selection map

| Need | Starting choice | Alternatives or boundary |
| --- | --- | --- |
| Forms | React Hook Form, optional Zod resolver | Simple forms can use local state |
| Runtime parsing | Small explicit parsers, then Zod where useful | Types alone do not validate network data |
| Shared client UI state | Local state/context first | Zustand or Redux Toolkit for demonstrated complexity |
| Long lists | FlatList first, profile | FlashList when recycling improves a measured case |
| Motion | Reanimated + Gesture Handler | Native built-in transitions for simpler flows |
| Charts | Accessible text/table first, SVG or Skia as needed | Chart semantics remain in the domain layer |
| Storage | SecureStore for small credentials, SQLite for structured data | AsyncStorage for non-sensitive preferences; evaluate MMKV only with actual needs |
| Dates/localization | Explicit date-only rules + Intl + Expo Localization | A maintained date/i18n library when requirements grow |
| Images/media | Expo Image, ImagePicker, Audio, Video | Avoid starting new features with deprecated media APIs |
| Device testing | RNTL + a small Maestro/Detox journey set | Physical-device review for actual capabilities |

For any candidate, verify current SDK/New Architecture compatibility, platform support, release health, license, native configuration, accessibility, and maintenance cost. This map explains responsibilities; it does not claim every optional library was installed or tested with SDK 58.

## Decision experiment

Implement the same sign-in, session restore, budget edit, transaction read, private object access, and deletion initiation in each backend branch. Use Alice/Bob isolation tests and a restart-offline test. Record actual results and choose one identity system and one data authority for the final app. Keep alternatives as learning branches rather than an unnecessary runtime vendor-switching layer.
