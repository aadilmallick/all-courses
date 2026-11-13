# Production React Native with Expo — 1,000 hours

Build and operate original iOS and Android applications in TypeScript. The running project is **PocketPilot**, a Rocket Money-style finance app with transaction review, budgets, recurring bill estimates, savings goals, bank-link sandbox flows, and a premium subscription. Use original branding and UI assets. The material is written for Aadil: a software developer who wants to ship useful apps and turn engineering knowledge into marketable products.

Research date: **November 13, 2026**. The verified stable baseline is **Expo SDK 58 / React Native 0.88 / React 19.3**, with Node **22.13.x or newer compatible LTS**. Install SDK packages with `npx expo install`, retain the generated lockfile, and check `npx expo-doctor`. Do not upgrade React Native separately from Expo. See [research and version notes](reference/research-sources.md).

## What the 1,000 hours mean

These are planned learner hours: careful reading, guided reconstruction, independent implementation, device testing, debugging, user research, and release work. They are not 1,000 hours of video or a claim about measured completion time. Cloud approval waits are excluded. The ten large teaching chapters contain smaller learning blocks; read each chapter in several sessions. There are no mandatory quizzes. The application work is the core of the course.

| Order | Chapter | Hours | Result |
| --- | --- | ---: | --- |
| 01 | [TypeScript, React, Expo](lessons/01-typescript-react-and-expo.md) | 80 | Typed mobile app and money domain |
| 02 | [Router, UI, interactions](lessons/02-router-ui-and-mobile-interactions.md) | 100 | Accessible finance navigation and forms |
| 03 | [State, offline data, SDK](lessons/03-state-offline-and-expo-sdk.md) | 110 | Offline repository and native feature lab |
| 04 | [Supabase and Clerk](lessons/04-supabase-and-clerk.md) | 110 | Postgres backend with tenant isolation |
| 05 | [Firebase and Better Auth](lessons/05-firebase-and-better-auth.md) | 110 | Document backend and owned auth server |
| 06 | [Amplify and Appwrite](lessons/06-amplify-and-appwrite.md) | 100 | Two equivalent backend prototypes and decision record |
| 07 | [Payments and subscriptions](lessons/07-payments-and-subscriptions.md) | 100 | Sandbox purchases and entitlement lifecycle |
| 08 | [PocketPilot capstone](lessons/08-pocketpilot-capstone.md) | 140 | Finance workflows, reconciliation, sandbox bank sync |
| 09 | [Production engineering](lessons/09-quality-security-and-release-engineering.md) | 80 | Measured quality and signed preview builds |
| 10 | [Release and growth](lessons/10-stores-marketing-and-operations.md) | 70 | Submission pack, launch experiments, operating plan |
| | **Total** | **1,000** | |

At 20 hours per week this is 50 weeks; at 10 hours it is 100 weeks. A working developer can skim familiar syntax and invest that same allocated time in deeper implementation. Do not count skimming as completed project work.

## Start here

1. Read Chapter 01 and run the dependency-free domain lab below.
2. Scaffold a fresh Expo SDK 58 TypeScript Router project using the current CLI. Use that generated project as your native app; `labs/mobile` is an instructional overlay, not a preinstalled Expo distribution.
3. Build the common finance interface with fixtures before selecting a cloud backend.
4. Use separate branches or apps for the six backend/auth alternatives. Choose one stack for the final capstone.
5. Finish device testing and the store submission pack before launching paid acquisition.

```sh
cd labs/domain
node --experimental-strip-types --test *.test.ts
```

Use a Node release that supports type stripping (the lab was checked with the exact version recorded in [verification](verification.md)). No bank account, secret, or paid service is needed for this lab. All examples in the course use TypeScript or TSX; SQL, shell, JSON, and policy files use their native formats.

## Files and practical boundaries

- [SDK catalog](reference/expo-sdk-catalog.md): a versioned navigation catalog of every top-level Expo SDK entry in the researched index, with TypeScript entry points and capability lab recipes. It is not a vendored copy of every upstream symbol's documentation.
- [Stack selection](reference/stack-selection.md): comparative recommendation and decision criteria.
- [Capstone specification](capstone/specification.md): feature contracts, milestones, data model, and acceptance evidence.
- `labs/domain`: runnable money, budget, recurrence, reconciliation, and entitlement examples with automated tests.
- `labs/mobile`: a small fixture-based Router overlay. Generate the real Expo application first, then copy the documented files.
- `labs/sql`: a Supabase schema and RLS policies for the chosen native Supabase Auth track; Clerk uses a different identity mapping described in Chapter 04.
- [Verification](verification.md): exactly which checks ran and which require your own services and devices.

The recommended learning capstone stack is Expo Router + TypeScript + TanStack Query + Supabase Auth/Postgres + RevenueCat, with SQLite added for explicit offline requirements. Clerk is a good alternative when its authentication experience saves enough engineering work. This is an architectural judgment for this relational finance project, not a universal vendor ranking.

The educational capstone reads synthetic or sandbox financial data. Live aggregation requires provider approval, privacy and security review, operational support, and an appropriate business arrangement. No course artifact has been submitted to an app store or connected to a real financial account. All mutable store policies, vendor quotas, pricing, and SDK compatibility must be checked again when you publish.

## Port to GitHub

Extract the archive, open this folder, and create a new repository using your normal Git workflow. Keep `.env` files, signing material, service-account files, real financial exports, and access tokens outside Git. The example identifiers and synthetic transactions in this package are safe fixtures. Preserve the lockfile from your own generated Expo project; the course archive deliberately does not fabricate a cloud-validated dependency lock.
