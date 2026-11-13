import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { demoPostedSpending, transactions, usd } from '../features/fixtures';

export default function Overview() {
  const [hidden, setHidden] = useState(false);
  return <SafeAreaView style={styles.page} edges={['left', 'right', 'bottom']}>
    <FlatList data={transactions} keyExtractor={row => row.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<View style={styles.header}>
        <Text style={styles.eyebrow}>SYNTHETIC DEMO · OCTOBER 2026</Text>
        <Text style={styles.title}>Understand your spending.</Text>
        <Text>Posted expenses in this sample, excluding pending activity</Text>
        <Text style={styles.total} accessibilityLabel={hidden ? 'Spending hidden' : `Posted spending ${usd(demoPostedSpending)}`}>
          {hidden ? '••••' : usd(demoPostedSpending)}
        </Text>
        <Button title={hidden ? 'Show amounts' : 'Hide amounts'} onPress={() => setHidden(value => !value)} />
        <Link href="/budgets" style={styles.link}>Open demo budget</Link>
        <Text style={styles.subtitle}>Recent activity</Text>
      </View>}
      renderItem={({ item }) => <Pressable style={styles.row} accessibilityRole="button"
        accessibilityLabel={`${item.merchant}, ${hidden ? 'amount hidden' : usd(item.amountMinor)}, ${item.pending ? 'pending' : 'posted'}. Open details`}
        onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: item.id } })}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.merchant}>{item.merchant}</Text>
          <Text>{item.category} · {item.pending ? 'Pending' : item.postedOn}</Text>
        </View>
        <Text style={styles.amount}>{hidden ? '••••' : usd(item.amountMinor)}</Text>
      </Pressable>} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F7F8FA' },
  content: { padding: 20, gap: 12, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { gap: 16, paddingBottom: 12 },
  eyebrow: { color: '#4B5563', fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '700', color: '#17202A' },
  total: { fontSize: 40, fontWeight: '700', color: '#176B46' },
  subtitle: { fontSize: 22, fontWeight: '600' },
  link: { color: '#145A96', fontSize: 18, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#D1D5DB' },
  merchant: { fontWeight: '600', fontSize: 17 },
  amount: { fontWeight: '600' },
});
