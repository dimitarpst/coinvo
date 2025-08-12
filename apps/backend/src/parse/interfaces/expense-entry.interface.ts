export interface ExpenseEntry {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  time?: string;
  note?: string;
}