import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { transactions, usd } from '../../features/fixtures';

export default function Detail() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const transaction = typeof id === 'string' ? transactions.find(row => row.id === id) : undefined;
  if (!transaction) return <Text style={{ padding: 24 }}>Transaction unavailable.</Text>;
  return <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
    <Text>Synthetic data only</Text>
    <Text style={{ fontSize: 28, fontWeight: '700' }}>{transaction.merchant}</Text>
    <Text style={{ fontSize: 32 }}>{usd(transaction.amountMinor)}</Text>
    <Text>{transaction.category}</Text>
    <Text>{transaction.postedOn} · {transaction.pending ? 'Pending estimate' : 'Posted'}</Text>
    <Text>This fixture screen has no bank connection. Add authorized annotation editing through the course repository layer.</Text>
  </ScrollView>;
}
