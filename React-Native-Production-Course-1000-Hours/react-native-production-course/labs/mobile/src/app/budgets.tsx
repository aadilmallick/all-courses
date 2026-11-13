import { useState } from 'react';
import { Button, ScrollView, Text, TextInput } from 'react-native';
import { usd } from '../features/fixtures';

export default function Budgets() {
  const [draft, setDraft] = useState('300.00');
  const [limit, setLimit] = useState(30000);
  const [message, setMessage] = useState('');
  const spending = 4235;
  function save() {
    const match = /^(\d{1,7})(?:\.(\d{1,2}))?$/.exec(draft.trim());
    if (!match) { setMessage('Enter USD using a format such as 300.00.'); return; }
    const minor = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
    setLimit(minor); setMessage('Updated in memory only. This demo resets when the screen remounts.');
  }
  return <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, gap: 16 }}>
    <Text style={{ fontSize: 28, fontWeight: '700' }}>Food budget</Text>
    <Text>Synthetic October 2026 data · local demonstration</Text>
    <Text>Posted spending: {usd(spending)}</Text>
    <Text>Limit: {usd(limit)}</Text>
    <Text>{limit >= spending ? 'Remaining' : 'Over budget'}: {usd(Math.abs(limit - spending))}</Text>
    <Text>Monthly limit in USD</Text>
    <TextInput accessibilityLabel="Monthly limit in US dollars" value={draft} onChangeText={setDraft}
      keyboardType="decimal-pad" style={{ borderWidth: 1, borderColor: '#4B5563', padding: 14, borderRadius: 10 }} />
    <Button title="Update local demo budget" onPress={save} />
    <Text accessibilityLiveRegion="polite">{message}</Text>
  </ScrollView>;
}
