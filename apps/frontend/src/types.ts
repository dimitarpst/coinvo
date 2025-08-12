// src/types.ts
export type ExpenseEntry = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;      // ISO e.g. "2025-08-07"
  time?: string;     // optional, "14:30"
  note?: string;     // optional
};
