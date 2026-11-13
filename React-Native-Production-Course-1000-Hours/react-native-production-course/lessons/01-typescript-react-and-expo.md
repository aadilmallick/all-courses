# 01 — TypeScript, React, and the Expo runtime

[Course home](../README.md) · [Next chapter](02-router-ui-and-mobile-interactions.md)

**Planned time: 80 hours.** Spend 12 hours on the guided explanations, 18 reconstructing the examples, 30 building the fixture application, 12 debugging it on two platforms, and 8 documenting your decisions. The outcome is a small application whose code you can explain, rather than a collection of pasted screens.

## 1. Start with the job an app must do

PocketPilot helps a person understand what happened to their money and what commitments are coming next. Before adding authentication, a bank connection, or a subscription, it must display truthful information. A useful first version can use ten invented transactions. If the total is wrong, connecting a real bank only makes the wrong answer more convincing.

A mobile application is several cooperating programs. Your TypeScript becomes JavaScript. React decides which user interface should exist for a particular state. React Native renders platform views. Native libraries communicate with operating-system capabilities. A server enforces rules that cannot be trusted to a phone. A database keeps durable facts. An app store distributes signed native binaries. None of these responsibilities disappears because the app fits in one repository.

Imagine that the user presses a transaction row. The touch originates in a native view, an event handler runs, local state changes, React computes the next interface, and the native screen updates. If the handler also fetches a category from a server, that request can finish later, fail, or arrive after the user leaves. Good architecture makes these separate timelines explicit.

For this course, assume you can already write basic programs but may be new to React. We will teach the React and TypeScript ideas needed for mobile development in dependency order. You do not need to learn Swift or Kotlin before creating the first app. You do need to understand which changes require compiling native code, because that distinction explains many apparently mysterious Expo errors.

## 2. Establish a reproducible development environment

The researched baseline is Expo SDK 58, React Native 0.88, and React 19.3. The Expo reference lists Node 22.13.x as the minimum for this SDK. These are ecosystem compatibility facts, not instructions to manually install each package at its newest independent version. Expo's package set is coordinated. See the [official SDK compatibility reference](https://docs.expo.dev/versions/latest/) and [SDK 58 release notes](https://expo.dev/changelog/sdk-58).

Create the project with the current scaffolder:

```sh
npx create-expo-app@latest pocketpilot
cd pocketpilot
npx expo-doctor
npx expo start
```

If the CLI offers a version choice, select stable SDK 58 for this edition. Check the generated `package.json`; the word `latest` changes over time. Retain the generated package lock and record the date, Node version, package manager version, and Expo version. Future you should be able to distinguish an application bug from a dependency upgrade.

The default template may contain example routes. Explore them before replacing them. Work in either the generated `src/app` convention or its root `app` equivalent consistently. Do not keep two competing route roots. Everything under the chosen route directory participates in routing, so keep reusable components and ordinary utility modules elsewhere.

On Windows, Android Studio can provide an Android emulator, while a physical Android device is often easier for camera and notification work. An iOS simulator requires macOS and Xcode. Cloud builds allow a Windows developer to produce signed iOS binaries, but do not magically provide a local iOS simulator. Plan access to a physical iPhone for release testing. A browser preview helps with layout and business logic; it is not evidence that native permissions, biometrics, or purchases work.

Use the CLI shipped with the project through `npx expo`. Avoid copying old instructions that install the deprecated global `expo-cli`. Install Expo-compatible native dependencies with `npx expo install package-name`. Use your normal package manager for ordinary JavaScript packages when their documentation says to do so. A successful package installation only means files are present; it does not mean the current binary contains the corresponding native module.

## 3. Understand Expo Go, development builds, and release builds

Expo Go is a prebuilt application containing a predefined collection of native modules. It can load your JavaScript quickly, which makes it useful for early learning. It cannot acquire arbitrary native code merely because you add an npm dependency. A module-not-found error can therefore refer to missing native code even when the JavaScript package exists in `node_modules`.

A development build is your own native application with developer tools included. It contains the native modules selected by your project. Use one early in this course, because banking SDKs, real purchases, some authentication features, and realistic push notification testing require it. The [development-build introduction](https://docs.expo.dev/develop/development-builds/introduction/) explains this distinction.

```sh
npx expo install expo-dev-client
npx expo run:android
```

The second command builds locally and requires an Android toolchain. On macOS, the corresponding iOS command is `npx expo run:ios`. A cloud development-build path appears in Chapter 09. Once the binary exists, `npx expo start --dev-client` serves JavaScript to it. Editing a React component normally does not require rebuilding. Adding a new native dependency or changing a native entitlement normally does.

A release build removes development conveniences and uses a production configuration. Its startup time, error handling, permission behavior, and performance can differ from a development session. Test it separately. An application that only works while Metro runs on your laptop is not ready to distribute.

Continuous Native Generation means Expo can generate the native project directories from configuration and plugins. You can also maintain native directories deliberately. Choose a workflow with a clear source of truth. If generated directories are disposable, express changes through plugins or modules. If you commit and maintain native projects, review them like other source code. Do not edit a generated file casually and then erase the change during regeneration.

## 4. TypeScript describes contracts; it does not validate the internet

JavaScript runs the application. TypeScript checks a model of the program before execution. A type annotation does not inspect an HTTP response, secure a database, or stop a malicious user. Its purpose is to catch mistakes while you write code and make intended shapes visible to readers.

Start with a transaction type:

```ts
type Currency = 'USD' | 'CAD';

type Transaction = {
  id: string;
  merchant: string;
  amountMinor: number;
  currency: Currency;
  postedOn: string;
  status: 'pending' | 'posted';
};

const groceries: Transaction = {
  id: 'txn-demo-1',
  merchant: 'Corner Market',
  amountMinor: -4235,
  currency: 'USD',
  postedOn: '2026-10-02',
  status: 'posted',
};

console.log(groceries.amountMinor); // -4235
```

The string union restricts accepted values in checked TypeScript. The object type requires the listed fields. The signed amount uses an app-level convention: spending is negative and income is positive. A provider might use the opposite convention. Normalize provider data at the boundary rather than asking every screen to remember which source created a transaction.

Money deserves an explicit representation. Binary floating-point arithmetic can produce surprising decimal results. For this course's ordinary amounts, use safe integer minor units and validate the safe-integer range. USD 42.35 becomes 4235. A zero-decimal currency has a different exponent, so a universal money system needs a currency metadata table. Do not assume every currency has two decimal places. Chapter 08 extends this model and prevents accidental cross-currency aggregation.

Use `readonly` where a value should be treated as immutable by consumers:

```ts
type Ledger = readonly Transaction[];

function netMinor(rows: Ledger): number {
  return rows.reduce((total, row) => total + row.amountMinor, 0);
}

console.log(netMinor([groceries])); // -4235
```

`reduce` starts with zero and adds each amount. The accumulator is a number, and the final result is another number. The function does not mutate the input. This makes it easy to test outside React and reuse in a server. Financial calculations should not live inside button handlers when they can be expressed as small domain functions.

## 5. Parse input instead of asserting it

The following code is a dangerous habit:

```ts
// Deliberately unsafe teaching fragment.
const transaction = JSON.parse('{"amountMinor":"wrong"}') as Transaction;
```

The assertion tells TypeScript to trust you. It does not turn the string into a number or fill missing fields. Treat external data as `unknown`, then validate the parts your application needs.

```ts
type BudgetInput = { name: string; limitMinor: number };

function parseBudget(value: unknown): BudgetInput {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Budget must be an object');
  }
  const object = value as Record<string, unknown>;
  if (typeof object.name !== 'string' || !object.name.trim()) {
    throw new Error('Budget name is required');
  }
  if (!Number.isSafeInteger(object.limitMinor) ||
      typeof object.limitMinor !== 'number' || object.limitMinor < 0) {
    throw new Error('Budget limit must be non-negative minor units');
  }
  return { name: object.name.trim(), limitMinor: object.limitMinor };
}
```

The cast to a record is local to the parser. We still inspect each field before returning a trusted value. The order of checks matters to TypeScript's narrowing. A production parser should define maximum string lengths, permissible currencies, date rules, and unknown-field behavior. A schema library such as Zod can reduce repetitive parsing, but learning the manual version clarifies what the library actually does.

Separate a form's text representation from the domain representation. The user may temporarily type an empty string or `12.`. Neither is a final valid money amount, but both are legitimate editing states. Do not coerce every keystroke into a number and fight the user's cursor. Validate on an appropriate interaction boundary, then convert once.

## 6. Functions, closures, and modules explain React behavior

A function can capture values from the scope where it was created. That capture is a closure. React event handlers are functions created during a render, so they observe values from that render. This is useful, but it explains stale-state mistakes.

```ts
function makeLabel(currency: string) {
  return (amount: number) => `${currency} ${amount}`;
}

const labelUsd = makeLabel('USD');
console.log(labelUsd(1200)); // USD 1200
```

The inner function still has access to `currency` after `makeLabel` returns. No special React mechanism is involved. When a handler uses an old state value after an asynchronous wait, remember this example. The handler belongs to a particular render; it is not automatically a live pointer to every future state.

Use modules to separate concerns. A module exports values or types that other files import. Prefer direct, clear dependencies: `money.ts` should not import a screen, and a reusable button should not import a particular finance repository. Circular dependencies make initialization order harder to reason about. A useful direction is domain code, then data adapters, then feature components, then route files.

Type-only imports disappear at runtime. They document contracts without pulling implementation code into a bundle. Do not import a server SDK into a mobile file just to reuse a type if that package also exposes secrets or relies on Node APIs. Put shared request and response contracts in a small neutral package or module.

## 7. Async work is a timeline, not a pause button for the app

`async` functions return promises. `await` suspends that function's continuation while allowing other work to happen. It does not block the entire application like a synchronous loop would. It also does not guarantee success.

```ts
async function loadJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with HTTP ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}
```

`fetch` can resolve successfully at the transport level for an HTTP error response. Check `response.ok`. Then parse and validate the body. An abort signal lets the caller express that a request is no longer useful. Cancellation is not a substitute for server idempotency: aborting a request on the phone does not prove the server did not apply a mutation.

Do independent requests concurrently when that improves the experience and their failures are handled deliberately. Do dependent requests sequentially. Signing in and then retrieving a user-specific document is dependent work. Fetching public reference categories and a public exchange-rate explanation may be independent. `Promise.all` fails as a group if one promise rejects; `Promise.allSettled` preserves each outcome. Choose based on the user-facing behavior you need.

Never use an endless synchronous loop to wait for a response. JavaScript event handlers, renders, and promise continuations share execution resources. A large synchronous calculation can make touches feel ignored. Later chapters show profiling, background constraints, and separating expensive calculations from render paths.

## 8. A React component is a description of interface for a state

Create a route file in your generated application:

```tsx
// src/app/index.tsx — complete fixture screen.
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [hidden, setHidden] = useState(false);
  return (
    <View style={styles.page}>
      <Text style={styles.title}>PocketPilot</Text>
      <Text accessibilityLabel={hidden ? 'Balance hidden' : 'Balance 1240 dollars'}>
        {hidden ? '••••' : '$1,240.00'}
      </Text>
      <Button title={hidden ? 'Show balance' : 'Hide balance'}
        onPress={() => setHidden(previous => !previous)} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 28, fontWeight: '700' },
});
```

`useState(false)` returns the current value and an update function. Calling the update function schedules a new render. The component then returns a description that reflects the new value. `View` is a container, `Text` displays text, and `Button` provides a platform button. These are native-oriented primitives, not HTML elements.

The functional updater receives the previous state and returns its replacement. It is useful when the next value depends on the old one. Do not mutate a captured variable and expect React to notice. Do not call the state setter unconditionally during rendering, because rendering would trigger another update repeatedly.

The accessibility label changes with the hidden state. A screen-reader user should not hear the supposedly hidden balance. Visual redaction alone is incomplete. This small detail illustrates the course's definition of production quality: intended behavior must survive different interaction methods and real operating conditions.

The styles are ordinary objects checked by React Native's type definitions. Most layout uses Flexbox, but defaults and supported properties differ from browser CSS. In React Native, a container's default main axis is a column. A child with `flex: 1` takes available space within the layout constraints of its parent. A percentage height cannot create meaningful space if its ancestors do not provide dimensions.

## 9. Props make components reusable without making them mysterious

A component should receive the information and actions it needs. It should not fetch unrelated global data merely because that is convenient.

```tsx
import { Pressable, Text, View } from 'react-native';

type SummaryCardProps = {
  title: string;
  value: string;
  onOpen: () => void;
};

export function SummaryCard({ title, value, onOpen }: SummaryCardProps) {
  return (
    <Pressable accessibilityRole="button"
      accessibilityLabel={`${title}, ${value}. Open details`}
      onPress={onOpen} style={{ padding: 20, borderWidth: 1, borderRadius: 16 }}>
      <View>
        <Text>{title}</Text>
        <Text style={{ fontSize: 24, fontWeight: '600' }}>{value}</Text>
      </View>
    </Pressable>
  );
}
```

The type describes a title, a formatted display value, and a callback. The card does not know how navigation works or where the number came from. That makes it easy to render in a component test with fixtures. A feature component can combine the repository, calculations, and navigation, then pass the result into this presentational card.

Avoid abstraction too early. Two pieces of UI that look similar may have different semantics. A destructive account-deletion button and a harmless navigation card should not share every behavior merely because both have rounded corners. Share tokens and small primitives first; extract larger components when a stable common behavior becomes clear.

Children are another kind of prop. A container can wrap arbitrary content, which is useful for consistent spacing or surface styling. Do not create a universal component with dozens of Boolean props whose combinations are impossible to explain. Prefer a few clear variants expressed as a string union, and make unsupported combinations unrepresentable where possible.

## 10. Rendering, effects, and events have different responsibilities

Rendering should calculate the interface. Event handlers respond to specific user actions. Effects synchronize the component with something external, such as a subscription or operating-system event. Confusing these roles creates duplicated requests and hard-to-debug loops.

If a user presses Save, submit from the handler. Do not set a `shouldSave` flag and then use an effect to notice it unless you have a strong reason. If a total can be derived from transactions during rendering, calculate it directly or memoize an expensive computation; do not maintain a second state variable that can drift away from the source.

```tsx
import { useEffect, useState } from 'react';
import { AppState, Text } from 'react-native';

export function ActivityLabel() {
  const [state, setState] = useState(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', setState);
    return () => subscription.remove();
  }, []);
  return <Text>App state: {state}</Text>;
}
```

The effect installs one external listener and returns cleanup. Cleanup runs when the component stops participating, and development tooling can intentionally exercise setup and cleanup more than once. Write effects so that repeating setup does not create duplicate permanent work. A subscription without cleanup can keep old components alive and dispatch updates to stale state.

An empty dependency list means the effect does not depend on changing render values. It does not mean “make this work exactly once in the lifetime of the business.” Payments, analytics deduplication, and server mutations need stronger identity and idempotency mechanisms. Treat effects as synchronization tools rather than a general-purpose scheduling system.

For remote data, a query library usually provides better cache, retry, and cancellation behavior than hand-written effects. Chapter 03 introduces that layer after you understand the underlying request timeline. The abstraction is easier to use correctly when its purpose is clear.

## 11. Model failure states explicitly

An application often starts with one `loading` Boolean and accumulates contradictory combinations. A screen can accidentally claim that it is loading and successfully loaded at the same time. A discriminated union provides a more precise model.

```ts
type LoadState<T> =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; data: T }
  | { kind: 'failed'; message: string };

function describe(state: LoadState<readonly string[]>): string {
  switch (state.kind) {
    case 'idle': return 'Not requested';
    case 'loading': return 'Loading';
    case 'ready': return `${state.data.length} transactions`;
    case 'failed': return state.message;
  }
}
```

Each variant carries only the information that makes sense for it. When the kind is `ready`, TypeScript knows data exists. Real applications may need a richer model that allows stale data and an in-progress refresh together. Extend the model to reflect that actual behavior instead of pretending a refresh erases previously useful information.

Error messages have two audiences. Users need a clear next action, such as checking a connection or retrying later. Developers need diagnostic context, such as an error category, request identifier, and sanitized stack trace. Do not display raw provider errors containing implementation details or log sensitive response bodies. A finance application should treat even seemingly harmless merchant names as potentially revealing.

## 12. Build the first vertical slice

The first slice is deliberately small: show synthetic transactions, filter them by status, and display a spending total. Keep fixture data in a normal TypeScript module. Keep the filter in component state. Keep the calculation in a pure function. Use a list component for rows and stable transaction IDs as keys.

Begin with two posted expenses, one income, and one pending expense. Decide whether your spending total includes pending rows; state the rule on screen. A pending card authorization can later change or disappear. If the UI silently adds pending and posted versions together, the user sees a frightening total that is not actually accurate.

Use a function such as `spendingMinor` that accepts a currency and excludes income and pending rows. Validate every input amount with `Number.isSafeInteger`. Throw or return a typed error if a row has the wrong currency. Ignoring an invalid row silently can be worse than surfacing a data-quality error, because it creates a plausible but incomplete answer.

After the list works, add a transaction-detail route in the next chapter. Do not add remote authentication yet. You should be able to demonstrate the entire slice offline with fixtures, because this provides a stable reference when a cloud integration later fails.

## 13. Debug by locating the boundary that failed

When something breaks, first classify the failure. A TypeScript diagnostic concerns static contracts. A Metro resolution error concerns how files and packages are located. A native module error concerns the compiled binary. An HTTP error concerns a remote service. A rendering issue concerns state, layout, or component behavior. A store rejection concerns distribution requirements. These categories can interact, but they are not interchangeable.

If a package import fails, check the spelling, installed version, documented export path, and platform support. If the JavaScript package resolves but the native implementation is missing, rebuild the development client. If a cloud endpoint is unreachable from a phone, remember that `localhost` means the phone itself. Use a reachable development host or an appropriate emulator-specific route. Never solve a production networking problem by disabling HTTPS verification.

If a screen is blank, temporarily render a static `Text` near the root and work inward. Inspect parent dimensions, conditional rendering, and navigation state. If a value is wrong, log sanitized intermediate inputs in the pure function before investigating animations. If an event fires twice, inspect duplicate listeners and effect cleanup before adding arbitrary timeout guards.

Maintain a short engineering note for each meaningful bug: observed behavior, expected behavior, smallest reproduction, root cause, and prevention. This is not a formal quiz or progress system. It is a way to transform debugging time into reusable knowledge. The best note explains why the fix works and which assumption was false.

## 14. Learn enough package management to protect your time

A dependency has a version range in `package.json` and a resolved version in the lockfile. A fresh install without the same lockfile may select different compatible versions. Native modules add platform build requirements and can depend on specific architecture support. Updating a package is therefore a small integration project, not a cosmetic housekeeping task.

Make dependency upgrades in an isolated branch. Read release notes, run Expo's compatibility checks, rebuild when native code changes, and repeat representative device flows. Do not repair an unexplained error by deleting every lockfile and upgrading everything simultaneously. That can remove the evidence needed to identify the original cause.

Use a minimal initial stack. The first slice needs React Native primitives, Expo Router, and domain utilities. Add TanStack Query when remote state exists, a form library when form complexity justifies it, and a database adapter when durability becomes necessary. An application with fewer dependencies can still be sophisticated; an application with many dependencies can still have no coherent architecture.

## 15. A worked design review of the first screen

Suppose the first implementation computes the balance by adding every fixture amount and labels the result “Available to spend.” That label overstates the calculation. A transaction sum is not necessarily an account balance. It can omit starting balances, include only a date window, and ignore transfers. Rename it to “Net activity in this sample” until you implement the actual definition.

Suppose the screen hides values by setting the text color equal to the background. A screen reader still reads the values, screenshots may reveal them through selection or contrast changes, and the data is still present. Render a redacted string and update accessibility text. Later, redact app-switcher previews separately. Each layer solves a different exposure path.

Suppose the screen formats every amount with `toFixed(2)` and a dollar symbol. It works for the USD fixture but conceals currency assumptions. Prefer `Intl.NumberFormat` for supported environments and explicit currency codes in the domain. Formatting is a display concern; stored amounts remain integers. Test negative amounts and locale separators before accepting the component as reusable.

Suppose the Save button immediately changes a label to “Saved” before any durable write. That is optimistic UI without reconciliation. It may be acceptable if the app clearly shows a pending state and can recover, but it is misleading if the app can close and lose the change. Name the states honestly: editing, saving, saved, and failed. Chapter 03 develops a durable mutation queue for this reason.

## 16. Guided reconstruction and project work

For the 18 reconstruction hours, rebuild the examples from a blank screen while keeping this chapter available as a reference. Change merchant names, add a second currency fixture, and move calculations into modules. The goal is fluent construction, not memorizing exact spelling. Compare the behavior after each small change so that a failure has a narrow cause.

For the 30 project hours, build a transaction list, a balance-visibility preference, a filter, a summary card, and a detail placeholder. Include empty, error, loading, and populated states even though the data is local. A fixture repository can return promises with controlled outcomes, which lets you rehearse asynchronous behavior without relying on an unstable internet connection.

For the 12 device-debugging hours, run on Android and iOS when hardware is available. Change font size, rotate the screen where supported, background and reopen the app, and disable networking. Record differences you actually observe. Do not count a browser as one of the two native platforms. If iOS access is unavailable, record that dependency explicitly and complete Android work while arranging it.

For the final 8 hours, write a short architecture note and a reproducible setup guide. Include the exact tool versions from your project, the amount-sign convention, what the displayed totals mean, and which platform flows remain untested. Another developer should be able to start the app without reading your mind.

## 17. Acceptance evidence and the next dependency

The chapter is complete when a fresh checkout can install from its lockfile, the app renders fixture data, the money calculations pass tests, and the balance-visibility control behaves accessibly. You should have evidence that adding a JavaScript-only utility differs from adding a native module. You should also be able to point to the domain code without navigating through UI files.

Useful evidence includes a test log, a sanitized screenshot of synthetic data, the setup guide, and a short screen recording of the filter and hidden-balance behavior. None of this requires publishing the repository or sending information to anyone. Keep real personal data out of the learning project.

In the next chapter, a single screen becomes a navigable application. The important new problem is preserving user intent across routes, forms, keyboard changes, and operating-system navigation. The TypeScript contracts, pure functions, and state boundaries established here will make that expansion manageable.

## Further explanation: interpreting a render without a browser mental model

A React Native screen is often easier to understand when you stop imagining a small web page. A `Text` component participates in native text layout. A `View` participates in native layout. There is no implicit document flow that fixes every missing parent dimension. A component tree describes ownership and composition, while the native renderer turns it into platform views. Inspect both the logical state and the physical layout when diagnosing a problem.

Consider a transaction row with a merchant name on the left and an amount on the right. A long merchant name must wrap or truncate without pushing the amount outside the screen. Give the text region a flexible width and a deliberate maximum number of lines. Avoid hardcoding a width based on one phone screenshot. A larger accessibility font or a narrower window is an ordinary supported condition, not an exotic edge case.

Next consider a row that contains a button. If the entire row is pressable and the inner button also performs an action, users can encounter ambiguous event handling and accessibility focus. Decide which interactive elements actually need to exist. Often a row should navigate to details, and the detail screen should contain the secondary action. Simplifying interaction structure improves both implementation and usability.

Finally, consider what should persist. The current filter may be a temporary screen preference. A budget limit is durable user data. A session token is security-sensitive state. A calculated monthly total is derived data. Storing all four in the same global object makes their lifetimes appear identical when they are not. The next chapters build separate mechanisms because these categories have different failure and recovery requirements.

## Further explanation: a small, useful TypeScript vocabulary

Use interfaces or object type aliases to describe shapes, unions to describe alternatives, generics to preserve relationships, and `unknown` at untrusted boundaries. Learn these tools deeply before collecting advanced type tricks. The useful question is whether a type prevents a plausible bug or explains a contract. A clever type that nobody can maintain may make the program less reliable in practice.

An optional property, such as `note?: string`, means the property may be absent. It is different from a required property whose value may be `null`. Use the distinction deliberately in update requests. An omitted field can mean “leave unchanged,” while an explicit `null` can mean “clear the existing value.” A database adapter must preserve that semantic distinction or users will lose information unexpectedly.

A generic repository method such as `Promise<Result<Transaction>>` expresses that the asynchronous operation eventually produces either a transaction or a typed failure. Do not create a generic abstraction before there are real cases to support it. Start with concrete functions, notice the repeated relationship, and extract only the stable common part. This keeps the learning sequence grounded in actual needs.

The `satisfies` operator can check that a configuration conforms to a contract while preserving its specific inferred values. A type assertion instead asks the checker to accept your claim. These tools serve different purposes. Prefer inference and ordinary annotations for application code; reach for assertions only when you can explain the runtime guarantee that makes the assertion valid.

## Further explanation: making study time productive

The 80-hour allocation is intentionally larger than the reading time. Production skill comes from reconstructing, changing, and debugging behavior under constraints. If you finish the text quickly, use the remaining implementation time to deepen the fixture app: support a second locale, introduce a controlled request failure, restore state after a restart, and write a clear bug report for a behavior you discover.

Do not equate the number of packages installed with the number of concepts learned. A useful completed foundation is a small app whose data shapes, event flow, and failure states are explainable. That app becomes the reference point for every later stack comparison. If a backend prototype changes behavior, you can compare it against a known contract instead of guessing whether the UI or the service is wrong.

Use an AI assistant as a reviewer after forming your own model. A productive prompt is: “Review this TypeScript transaction model and fixture screen. Identify possible cross-currency errors, stale-state bugs, accessibility leaks, and native-build assumptions. Explain each issue, propose a minimal fix, and give a verification step. Do not add packages unless necessary.” This is a prompt you can run; no AI review of your future project has been performed by this course.

Keep the resulting improvements small enough to understand. If an assistant replaces the entire app with an unfamiliar architecture, ask it to explain the smallest change that fixes the observed problem. The objective is to become a developer who can assess generated code, not merely a person who can request more generated code.
