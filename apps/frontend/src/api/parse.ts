import type { ExpenseEntry } from '../types';

const API_BASE = 'http://localhost:3000';

export async function parseExpenses(text: string): Promise<ExpenseEntry[]> {
  const res = await fetch(`${API_BASE}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Parse failed (${res.status}): ${msg || res.statusText}`);
  }
  return res.json();
}
