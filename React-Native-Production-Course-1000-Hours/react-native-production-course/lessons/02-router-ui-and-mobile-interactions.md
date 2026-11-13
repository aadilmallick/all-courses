# 02 — Router, accessible UI, forms, lists, and motion

[Previous](01-typescript-react-and-expo.md) · [Course home](../README.md) · [Next](03-state-offline-and-expo-sdk.md)

**Planned time: 100 hours.** Allocate 14 hours to the teaching material, 26 to guided screen reconstruction, 36 to the finance interface, 14 to accessibility and keyboard testing, and 10 to navigation and interaction debugging. The finished result is a coherent fixture application with real routes and editable budgets.

## 1. Navigation is a model of user intent

A finance app has several kinds of movement. A user switches between overview and budgets, opens a transaction, edits a category, follows an email link, or returns from a sign-in browser. Treating all of these as “show another component” misses the history and lifecycle requirements. Navigation must answer what Back means, which screen owns a form, and what happens if the app starts directly at a detail URL.

Expo Router maps files to routes. A layout defines navigation structure shared by its descendant routes. A screen file defines a destination. Parentheses create a route group without adding that group name to the URL. Square brackets define a dynamic path segment. The [Router introduction](https://docs.expo.dev/router/introduction/) and [navigation guide](https://docs.expo.dev/router/basics/navigation/) are the primary API references.

Keep navigation structure simpler than the visual design. A bottom tab bar is appropriate for a few stable top-level destinations, while a stack handles drill-down and return. A modal fits a temporary task that can be dismissed. A drawer can be useful for a large information hierarchy, but it hides destinations and should not be your default solution for five finance screens.

| File under `src/app` | Meaning | Example URL |
| --- | --- | --- |
| `_layout.tsx` | Root navigation and providers | No standalone destination |
| `index.tsx` | Landing or redirect route | `/` |
| `(tabs)/_layout.tsx` | Shared tab navigation | No added URL segment |
| `(tabs)/overview.tsx` | Overview tab | `/overview` |
| `(tabs)/budgets.tsx` | Budgets tab | `/budgets` |
| `transactions/[id].tsx` | Transaction detail | `/transactions/txn-1` |
| `budget-edit.tsx` | Editing task presented as a modal | `/budget-edit` |
| `+not-found.tsx` | Unmatched route handling | Invalid URL |

Place domain code, repositories, and shared components outside this route tree. A route file should usually assemble a feature screen and pass route parameters. If it also contains all database logic, all formatting, and all UI, it becomes difficult to test or reuse.

## 2. Create a stack and then add tabs

The following root layout is a complete navigation skeleton for an app that already has the referenced route files. It introduces no authentication yet.

```tsx
// src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transactions/[id]" options={{ title: 'Transaction' }} />
      <Stack.Screen name="budget-edit" options={{ presentation: 'modal', title: 'Edit budget' }} />
    </Stack>
  );
}
```

```tsx
// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function FinanceTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="overview" options={{ title: 'Overview' }} />
      <Tabs.Screen name="budgets" options={{ title: 'Budgets' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

```tsx
// src/app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/overview" />;
}
```

Each layout owns a navigator. Hiding the root header for the tab group avoids a duplicated header when the tab navigator renders its own. A modal presentation is a navigation decision, not merely a rounded `View` drawn over another screen. It has dismissal and history semantics that the platform can help manage.

Expo SDK 58 also documents stable native tabs and newer Router data-loading features. Learn the ordinary stack and JavaScript tab model first because it makes the route tree clear. Then evaluate native tabs for the platform behavior and design you need. Do not mix examples from an older `unstable-native-tabs` import with a newer stable API without consulting the current [native-tabs reference](https://docs.expo.dev/versions/latest/sdk/router/native-tabs/).

## 3. Pass identifiers, then load authorized data

A URL should usually contain an identifier, not an entire serialized transaction. Data in a URL can be stale, logged, shared, or modified. The detail screen loads the current record and handles missing or unauthorized data.

```tsx
// Complete link component; the target route must exist.
import { Link } from 'expo-router';
import { Text } from 'react-native';

export function TransactionLink({ id }: { id: string }) {
  return (
    <Link href={{ pathname: '/transactions/[id]', params: { id } }}>
      <Text>Open transaction</Text>
    </Link>
  );
}
```

```tsx
// src/app/transactions/[id].tsx — fixture detail example.
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const fixtures = new Map([
  ['txn-1', { merchant: 'Corner Market', displayAmount: '$42.35' }],
]);

export default function TransactionDetail() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const transaction = id ? fixtures.get(id) : undefined;
  if (!transaction) return <Text>Transaction unavailable.</Text>;
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>{transaction.merchant}</Text>
      <Text>{transaction.displayAmount}</Text>
    </View>
  );
}
```

The parameter annotation documents expected shapes but does not validate an incoming deep link. The runtime check narrows the actual value. In a production repository, an authenticated request would load the record and enforce ownership. The UI should avoid revealing whether another person's transaction exists. “Unavailable” can be appropriate for both missing and inaccessible records.

Use `router.push` when the user opens a new destination, `router.replace` when the old destination should not remain in history, and back navigation when returning through an existing history entry. A sign-in completion often replaces a login screen. Repeatedly pushing the home screen can create a stack of identical destinations that Back then exposes.

## 4. Authentication changes route availability

Authentication has at least three states: session restoration in progress, signed out, and signed in. Rendering the signed-out navigator before restoration finishes can cause a visible flash and lose the user's intended destination. Wait until the session provider resolves its initial state.

The following is an integration fragment. `useSession` is a course-level hook that you implement with the provider chosen in Chapters 04 through 06; it is not an Expo export.

```tsx
// Integration fragment for src/app/_layout.tsx.
import { Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useSession } from '../features/auth/use-session';

export default function RootLayout() {
  const { ready, userId } = useSession();
  if (!ready) return <ActivityIndicator accessibilityLabel="Restoring session" />;
  return (
    <Stack>
      <Stack.Protected guard={!userId}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(userId)}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transactions/[id]" />
      </Stack.Protected>
    </Stack>
  );
}
```

Protected routes control client navigation. They do not authorize a database query or a server endpoint. A modified client can call the backend directly. Always apply ownership rules at the service or database boundary. The [protected-routes guide](https://docs.expo.dev/router/advanced/protected/) also explains how history is removed when a guard becomes false.

If a user opens a deep link while signed out, preserve only a validated internal destination. After authentication, return there if the user can access it. Do not accept an arbitrary external URL as a redirect target. This prevents an authentication completion from becoming an open redirect into a malicious site.

## 5. Deep links are external input

There are several ways to enter an app: a custom URL scheme, an HTTPS app or universal link, a notification, an authentication callback, and a store launch. Each should resolve into a small set of permitted internal actions. Define a link contract before writing handlers.

For PocketPilot, a transaction link can contain a transaction ID but no token or account balance. An invitation link can contain a short-lived invitation reference, which the server validates. An OAuth callback belongs to the authentication SDK and its exact configured redirect URI. A malformed or expired link should produce a recoverable screen rather than a crash.

Custom schemes are convenient in development, but other apps can potentially register similar schemes. HTTPS app links and universal links use domain association and are preferable where supported. Configure the website association files and native entitlements together, then test cold launch and warm launch on real devices. A link that opens correctly from a terminal command may behave differently when tapped in a mail client.

Never put session credentials in a normal marketing URL or analytics event. A callback URL may temporarily carry sensitive parameters as part of an established protocol; let the SDK consume them, and avoid logging the raw URL. Separate “where the user wants to go” from “proof the user is authenticated.”

## 6. Design tokens create consistency before a component library does

A design system begins with decisions about spacing, typography, color, and interaction. Installing a component library does not make those decisions for your product. Start with a small token module and apply it consistently.

```ts
// src/ui/tokens.ts
export const tokens = {
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { card: 16, control: 10 },
  light: {
    background: '#F7F8FA', surface: '#FFFFFF', text: '#17202A',
    muted: '#4B5563', accent: '#176B46', danger: '#B42318', border: '#D1D5DB',
  },
  dark: {
    background: '#111827', surface: '#1F2937', text: '#F9FAFB',
    muted: '#D1D5DB', accent: '#6EE7B7', danger: '#FDA29B', border: '#6B7280',
  },
} as const;
```

The names describe roles rather than particular screens. `surface` can be used by a budget card or a transaction detail panel. A danger color signals a destructive action, but never make color the only signal. Include text, icons with labels, or another clear distinction. Red and green bars alone are inadequate for many users.

Use `useColorScheme` to select a system theme, and optionally provide a user override. Respect text scaling. Avoid fixing every row to a height that only fits your default font size. A larger text setting should reflow the content rather than clip the amount or hide the action. Check contrast with an actual contrast tool when finalizing a palette; attractive colors are not proof of sufficient contrast.

## 7. Choose UI libraries according to what they own

| Tool | What it helps with | What you still own |
| --- | --- | --- |
| React Native primitives + StyleSheet | Minimal dependency surface and full control | Tokens, variants, accessibility, composition |
| NativeWind | Utility-style styling conventions | Native layout understanding and class consistency |
| React Native Paper | Material-oriented components | Product information architecture and brand fit |
| Tamagui or similar systems | Shared styling and component abstractions | Compatibility, build configuration, design choices |
| Expo UI | Native SwiftUI/Compose and universal component options | Platform differences and current component contracts |
| Reanimated + Gesture Handler | Responsive motion and gestures | Accessible alternatives, correct interaction semantics |
| FlashList | Recycling-oriented long lists | Stable IDs, row design, measured performance |
| Skia / SVG chart tooling | Custom visualization rendering | Financial definitions, accessible summaries, labels |

This is a selection framework, not a requirement to install everything. The course default uses primitives and a small token system first. Evaluate Expo UI when a genuinely native control improves the experience. Read current platform and component documentation because some newer capabilities may have narrower support than familiar React Native primitives.

For charts, start with a simple accessible summary and a table of categories before adding a custom canvas. A beautiful donut chart that cannot explain its total is a poor finance feature. Render the same underlying calculated data in text so screen-reader users can access it and visual users can verify it.

## 8. Safe areas and responsive layout are normal requirements

Safe areas represent regions where system UI or device geometry can interfere with content. Use `react-native-safe-area-context` in the generated Expo setup rather than guessing top padding. Do not apply the same inset twice because both a navigator and a screen have already handled it.

```tsx
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HelpScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 24 }}>Understanding your budget</Text>
        <Text>Posted spending is compared with your monthly category limit.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
```

The omitted top edge assumes a navigator header already manages the top region. That assumption belongs in the screen's surrounding layout contract. If there is no header, include the top edge. A universal copy-paste wrapper cannot decide this correctly without knowing its context.

Use available window dimensions for responsive layouts, not a one-time device-width constant. A tablet, split-screen window, foldable device, or resizable iOS window can change the usable space. Prefer a readable maximum content width for forms and a two-column layout only when there is genuinely enough room. Do not stretch a narrow phone design across an entire tablet merely because Flexbox allows it.

## 9. Build forms around text, validation, and submission

A budget form has several responsibilities: editing a name, entering an amount, displaying validation, submitting once, preserving input on failure, and making the result clear. React Hook Form is useful when those responsibilities grow beyond a couple of fields. Native inputs use `Controller` or `useController`; they do not behave like ordinary uncontrolled browser form elements. See the [official Controller reference](https://react-hook-form.com/docs/usecontroller/controller).

```sh
npm install react-hook-form zod @hookform/resolvers
```

The following complete local form uses manual conversion so its money rules remain visible. Replace the callback with an authorized repository mutation later.

```tsx
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TextInput, View } from 'react-native';

type Fields = { name: string; amount: string };
type SavedBudget = { name: string; limitMinor: number };

function parseUsd(text: string): number | null {
  const normalized = text.trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fractional = ''] = normalized.split('.');
  const value = Number(whole) * 100 + Number(fractional.padEnd(2, '0'));
  return Number.isSafeInteger(value) ? value : null;
}

export function BudgetForm({ onSave }: { onSave: (value: SavedBudget) => Promise<void> }) {
  const [status, setStatus] = useState('');
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({
    defaultValues: { name: '', amount: '' },
  });
  const submit = handleSubmit(async fields => {
    const limitMinor = parseUsd(fields.amount);
    if (limitMinor === null) return;
    setStatus('Saving');
    try {
      await onSave({ name: fields.name.trim(), limitMinor });
      setStatus('Budget saved');
    } catch {
      setStatus('Could not save. Your entries are still here. Try again.');
    }
  });
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>Budget name</Text>
      <Controller control={control} name="name"
        rules={{ validate: value => value.trim().length > 0 || 'Enter a name', maxLength: 80 }}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <TextInput ref={ref} value={value} onChangeText={onChange} onBlur={onBlur}
            accessibilityLabel="Budget name" maxLength={80}
            style={{ borderWidth: 1, padding: 12 }} />
        )} />
      {errors.name && <Text accessibilityRole="alert">{errors.name.message ?? 'Name is too long'}</Text>}
      <Text>Monthly limit in USD</Text>
      <Controller control={control} name="amount"
        rules={{ validate: value => parseUsd(value) !== null || 'Enter an amount such as 250.00' }}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <TextInput ref={ref} value={value} onChangeText={onChange} onBlur={onBlur}
            keyboardType="decimal-pad" accessibilityLabel="Monthly limit in US dollars"
            style={{ borderWidth: 1, padding: 12 }} />
        )} />
      {errors.amount && <Text accessibilityRole="alert">{errors.amount.message}</Text>}
      <Button title={isSubmitting ? 'Saving…' : 'Save budget'} disabled={isSubmitting}
        onPress={() => { void submit(); }} />
      <Text accessibilityLiveRegion="polite">{status}</Text>
    </View>
  );
}
```

The parser accepts a deliberately narrow USD input format. It does not claim to parse every locale. A decimal keyboard may produce a comma in some locales, so the production form must either support the selected locale explicitly or communicate the expected format and normalize it safely. Never strip every non-digit character, because that can silently change a user's intended amount.

`isSubmitting` disables repeated local submissions while the promise is active. This improves UX but does not prevent retries after a network interruption or duplicate requests from another client. The server still needs an idempotency strategy for important mutations. A form's valid state is not a security boundary; the server validates the same business constraints independently.

The error path keeps the fields intact. Clearing user input after a failed save forces re-entry and encourages abandonment. If the user navigates away with unsaved changes, provide an appropriate discard confirmation. Do not trap them indefinitely. A draft can be stored separately from the saved budget so recovery does not confuse unsaved data with confirmed server state.

## 10. Keyboard behavior is part of the form

The keyboard reduces usable space and can obscure the Save button. Test the form on a small device, with large text, and with both software and hardware keyboards. `KeyboardAvoidingView` can help in straightforward layouts, while a keyboard-controller library can support more complex interactions. Adding multiple avoidance layers often creates excessive gaps or double movement.

Choose return-key behavior and focus order deliberately. An email field should use an appropriate keyboard and avoid automatic capitalization. Password fields need secure text entry and compatible autofill hints. A money field needs a clear currency label and a way to finish editing on keyboards without an obvious Done button. Do not depend solely on a placeholder, which disappears when text is entered.

Keep visible labels associated with inputs through appropriate accessibility properties for the platform. Present an error near the field and announce changes where supported. A red border alone is insufficient. When submission fails, focus management should help the user find the first relevant error without jumping unpredictably on every keystroke.

## 11. Long lists require stable identity and restrained work

Start with `FlatList` and measure. A finance app can accumulate thousands of transactions, so rendering all of them in a `ScrollView` is a poor long-term choice. Virtualized or recycling lists limit the active view work. They do not fix an expensive data transformation repeated on every keystroke.

```tsx
import { FlatList, Pressable, Text, View } from 'react-native';

type Row = { id: string; merchant: string; amountLabel: string };

export function TransactionList({ rows, onOpen }: {
  rows: readonly Row[]; onOpen: (id: string) => void;
}) {
  return (
    <FlatList data={rows} keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      ListEmptyComponent={<Text>No transactions in this period.</Text>}
      renderItem={({ item }) => (
        <Pressable onPress={() => onOpen(item.id)} accessibilityRole="button"
          accessibilityLabel={`${item.merchant}, ${item.amountLabel}. Open transaction`}
          style={{ padding: 16, minHeight: 56 }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Text numberOfLines={2} style={{ flex: 1 }}>{item.merchant}</Text>
            <Text>{item.amountLabel}</Text>
          </View>
        </Pressable>
      )} />
  );
}
```

The ID is stable when rows are inserted or reordered. Using the array index as a key can attach local row state to the wrong transaction after a filter changes. A merchant name is also unsuitable because many transactions share one merchant. Identity belongs to the domain, not the current visual position.

For genuinely large lists, evaluate FlashList using its current version's documentation. Recycling means a view may be reused for another item, so row-local state must reset correctly or be derived from item identity. Measure a release-like build with representative rows. A list of twenty short fixtures cannot reveal the behavior of ten thousand transactions with images and grouped headers.

Avoid nesting a vertical virtualized list inside an ordinary vertical scroll container. Prefer list headers, footers, and sectioned list structures. Keep row rendering free from network requests and heavyweight formatting where practical. Paginate through a stable sort order, usually a date plus unique ID, so equal dates do not cause missing or duplicated pages.

## 12. Motion should explain state changes

Animation can show that a card expanded, an item moved, or a save completed. It should not delay access to financial information or conceal a slow network call. Start with small transitions, honor reduced-motion preferences, and provide static equivalents for important meaning.

```sh
npx expo install react-native-reanimated react-native-worklets
```

Use the configuration required by the current Expo-compatible versions rather than pasting an old Babel plugin recipe. The following component illustrates a small budget progress transition.

```tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  ReduceMotion, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';

export function BudgetProgress({ fraction }: { fraction: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(Math.min(1, Math.max(0, fraction)), {
      duration: 250, reduceMotion: ReduceMotion.System,
    });
  }, [fraction, progress]);
  const animated = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(Math.min(1, Math.max(0, fraction)) * 100) }}
      style={{ height: 12, backgroundColor: '#D1D5DB', overflow: 'hidden', borderRadius: 6 }}>
      <Animated.View style={[{ height: 12, backgroundColor: '#176B46' }, animated]} />
    </View>
  );
}
```

The shared value is animation state, not a saved budget. The domain still owns the real spending and limit. The visual bar clamps at its container width, while adjacent text should say when spending exceeds the limit. Do not clamp the underlying financial calculation and hide overspending. The [withTiming documentation](https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/) defines the reduced-motion option.

Gesture Handler is useful for interactions such as swipe actions or draggable sheets. Wrap the app as required by the library and keep gesture callbacks compatible with the chosen animation runtime. A swipe-to-delete action needs a discoverable alternative, confirmation where appropriate, and a clear recovery path. A gesture that only experienced users discover is a convenience, not the sole route to essential functionality.

## 13. A chart needs a financial definition before a drawing API

For a monthly spending chart, define which transactions qualify, which time zone determines the month, how refunds are handled, and whether transfers are excluded. Derive a category summary with pure functions. Then render that summary as bars, a donut, or a text table. Changing the drawing library should not change the amount.

SVG-based charts can be straightforward for modest data. Skia can support custom high-performance drawing and richer interactions, but introduces another rendering model and additional accessibility work. A native chart wrapper may provide useful platform behavior. Choose the smallest solution that meets the information and performance requirements.

Provide a text summary such as “Food: 243 dollars of a 300 dollar budget.” A tooltip that appears only under a precise drag is insufficient for screen-reader access. Avoid implying that a smooth curve represents continuous financial measurements when the underlying data consists of discrete transactions. Visual polish must not change the meaning of the data.

## 14. Work through a complete budget-edit interaction

The user opens Budgets, selects Food, and sees the existing limit. The edit route receives the budget ID, loads the current record, and initializes the form once that record is available. If fresh server data arrives while the user is typing, do not overwrite the draft silently. Decide whether to show a “changed elsewhere” notice or preserve the local draft until submission.

On Save, validate the text, convert to minor units, and submit an update with a known record version if the backend supports optimistic concurrency. While saving, prevent accidental duplicate local taps and keep the form readable. If the server accepts the change, update or invalidate the relevant cache and close the modal. If it reports a conflict, show both the current server value and the user's draft so the person can decide.

On Back or dismiss, an unchanged form can close immediately. A changed form should offer to discard or continue editing. If the app is terminated unexpectedly, a local draft can be restored, but label it as a draft. Distinguish restoration from a successful save. This full interaction teaches more production behavior than adding ten decorative screens.

## 15. Accessibility and usability review

Review the app with VoiceOver or TalkBack, larger text, reduced motion, and a small screen. Navigate every essential flow without relying on color or a hidden gesture. Check whether buttons announce their role and action, whether focus moves logically after navigation, and whether a loading state explains what is happening.

Touch targets should be comfortably usable and appropriately spaced. A tiny icon next to a financial amount can be frustrating even when technically tappable. Use visible labels for important actions such as Restore purchases and Delete account. Avoid generic labels such as “click here,” because they lose meaning when read out of visual context.

Test long merchant names, negative values, large balances, empty lists, and untranslated fallback strings. A layout that looks correct with a short English fixture may fail with a longer locale. Test right-to-left layout if you plan to support it. Localization is a product commitment with testing costs; start with a deliberate supported-language set.

## 16. Troubleshooting the interface systematically

If navigation cannot find a screen, compare the filename, layout screen name, and href. Route groups alter organization but not ordinary URL segments. If Back behaves strangely, inspect whether a flow repeatedly pushes destinations that should replace an entry. If a deep link opens an empty screen, validate its parameters before investigating the visual component.

If a form value disappears, look for a changing React key, a component being unmounted, or an effect that resets defaults after every fetch. If the keyboard causes a large blank region, remove duplicate avoidance wrappers and inspect inset handling. If the list jumps, verify keys and whether pagination changes the sort order.

If animation appears smooth in development but behaves poorly in a release build, inspect runtime compatibility and measure actual frame work. If the UI freezes during filtering, the problem may be synchronous data processing rather than animation itself. Move and cache calculations based on measured need. Do not add memoization everywhere before identifying the expensive path.

## 17. Project work and acceptance evidence

Build Overview, Transactions, Budgets, Recurring, and Settings using synthetic data. Implement transaction detail, budget editing, and a settings privacy toggle. Every primary screen needs loading, empty, error, and populated states. Use a small shared component vocabulary and tokens rather than unrelated styling in each route.

Spend the guided reconstruction time reproducing the Router skeleton, then intentionally enter the detail route from a cold launch. Spend the larger project block integrating forms, lists, and a clear budget summary. Use the testing block to document keyboard and accessibility observations on both platforms. The debugging block should produce reproducible fixes, not merely a list of unexplained workarounds.

Acceptance evidence includes a route map, a recording of budget editing and cancellation, a screen-reader walkthrough, and a list stress test with at least several thousand synthetic rows. Record the device and build mode for performance observations. “Feels fast” is useful feedback but not a reproducible measurement.

## 18. A deeper case study: notification to transaction detail

Imagine that PocketPilot eventually sends a notification saying a recurring bill was detected. The user taps it while the app is closed. The operating system launches the app, the session restores, and the notification payload is interpreted. The target transaction may have been deleted or may belong to a previously signed-in account. A robust app treats the payload as a navigation suggestion that must be validated, not a command that bypasses normal authorization.

Store a minimal target reference in the notification. After session restoration, load the referenced record through the current account's repository. If access fails, show an explanation with a path back to the main screen. If the user signed out between receiving and opening the notification, complete sign-in first and then re-evaluate access. Do not cache a foreign account's detail view merely because it was open before logout.

This case also reveals why providers belong near the root. The navigation tree, query cache, session state, and notification listener need a coherent lifecycle. Installing listeners in every tab can process one tap several times. Installing a listener before required providers exist can create a race. Keep the event entry point centralized and delegate the resulting validated intent to navigation.

The same reasoning applies to marketing links and authentication callbacks, but the parsing rules differ. Do not route every incoming URL through a single permissive string concatenation. A small explicit mapping from allowed input to internal destinations is easier to audit and test. Unknown inputs should fail closed with a useful fallback screen.

## 19. A deeper case study: designing a truthful overview

An overview screen is tempting to fill with every metric you can calculate. Start by identifying the user's next useful decision. For a personal-finance app, that might be whether this month's spending is within planned limits and which bills are expected soon. A balance chart, savings goal, promotional banner, and paywall all competing above the fold can obscure that decision.

Use a hierarchy: period and freshness first, the primary financial summary next, a small set of actionable categories after that. Show whether the data is current or last synced yesterday. Do not make an old cached balance look live through a perpetual animated shimmer. An honest stale-data label increases trust and gives the user a reason to refresh.

Budget progress requires careful copy. “You have 50 dollars left” assumes the chosen transactions, refunds, and pending charges match the user's interpretation. A more precise label can say “50 dollars remaining from posted Food spending.” As the product matures, simplify wording through user research while preserving access to the calculation details.

Premium promotion should appear after the user understands the product's value. It should not block the basic explanation of their own data. A well-timed upgrade offer can explain a concrete premium benefit, such as multi-period comparisons or custom alerts. Repeating a full-screen paywall on every tab switch damages usability and makes conversion metrics difficult to interpret.

## 20. Further practice: from attractive screenshots to durable components

Choose one screen and write down all states it can enter before polishing its appearance. For a transaction list, include first load, refresh with old data, offline with cached data, offline without cached data, permission failure, no results after filtering, and an error while loading the next page. Render each state with a fixture switch. This exposes missing interactions much earlier than waiting for a real service outage.

Next, inspect component ownership. The list row should display a transaction summary and report an open action. The feature container should choose the repository and format the record. The route should interpret the URL. The backend should decide which records the current user can access. When these responsibilities are explicit, changing a provider does not require rewriting the visual component.

Finally, test one unsupported assumption at a time. Increase the merchant name to eighty characters, enlarge the font, change the amount to a large negative number, remove the network, and reopen from a deep link. Document what failed and repair the smallest responsible layer. This is how a UI becomes production-capable without turning into a maze of defensive conditions.

An optional AI review prompt is: “Review my Expo Router route map and budget-edit flow. Check cold deep links, session restoration, Back behavior, unsaved drafts, keyboard access, screen-reader labels, and list identity. Give a prioritized set of concrete failures with reproduction steps. Keep domain and server authorization separate from navigation.” Use the response as hypotheses to test, not as proof that a device flow works.
