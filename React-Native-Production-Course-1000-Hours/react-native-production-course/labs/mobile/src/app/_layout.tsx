import { Stack } from 'expo-router';
export default function Layout() {
  return <Stack screenOptions={{ headerStyle: { backgroundColor: '#F7F8FA' }, headerTintColor: '#17202A' }}>
    <Stack.Screen name="index" options={{ title: 'PocketPilot' }} />
    <Stack.Screen name="transactions/[id]" options={{ title: 'Demo transaction' }} />
    <Stack.Screen name="budgets" options={{ title: 'Demo budget' }} />
  </Stack>;
}
