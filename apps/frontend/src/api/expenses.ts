import type { ExpenseEntry } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function listExpenses(): Promise<ExpenseEntry[]> {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) throw new Error(`Failed to load expenses: ${res.statusText}`);
  return res.json();
}

export async function createExpense(
  entry: Omit<ExpenseEntry, 'id'>,
): Promise<ExpenseEntry> {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Failed to save expense: ${res.statusText}`);
  return res.json();
}
