export type DemoTransaction = Readonly<{
  id: string; merchant: string; amountMinor: number; postedOn: string;
  category: string; pending: boolean;
}>;
export const transactions: readonly DemoTransaction[] = [
  { id: 'demo-market', merchant: 'Corner Market', amountMinor: -4235, postedOn: '2026-10-02', category: 'Food', pending: false },
  { id: 'demo-cloud', merchant: 'Demo Cloud Tools', amountMinor: -1200, postedOn: '2026-10-03', category: 'Software', pending: false },
  { id: 'demo-income', merchant: 'Synthetic Client Payment', amountMinor: 150000, postedOn: '2026-10-04', category: 'Income', pending: false },
  { id: 'demo-pending', merchant: 'Demo Cafe', amountMinor: -650, postedOn: '2026-10-05', category: 'Dining', pending: true },
];
export function usd(minor: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100);
}
export const demoPostedSpending = -transactions.filter(row => !row.pending && row.amountMinor < 0)
  .reduce((total, row) => total + row.amountMinor, 0);
