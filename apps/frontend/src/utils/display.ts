import type { ExpenseEntry } from '../types';
import type { DisplayExpense } from '../components/BudgetChatMirrorUI';
import type { IconName } from '../components/ui/Icon';
import { parseISO, isToday, isYesterday, isThisWeek, format } from 'date-fns';

function iconFor(category: string): IconName {
  const c = (category || '').toLowerCase();
  if (/(grocery|supermarket|market|lidl|kaufland|food)/.test(c)) return 'cart';
  if (/(restaurant|dinner|lunch|meal|pizza|burger|kebab)/.test(c)) return 'fork';
  if (/(transport|taxi|uber|bus|fuel|gas|petrol|parking)/.test(c)) return 'car';
  if (/(coffee|cafe|latte|espresso)/.test(c)) return 'coffee';
  if (/(ticket|cinema|movie|concert|entertainment)/.test(c)) return 'ticket';
  if (/(shopping|clothes|apparel|store|mall)/.test(c)) return 'bag';
  return 'bag';
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function whenLabel(dateISO: string, time?: string) {
  const d = parseISO(dateISO);
  if (isToday(d)) return time ? `Today, ${time}` : 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

export function mapToDisplay(list: ExpenseEntry[]): DisplayExpense[] {
  // newest first by date then time
  const sorted = [...list].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    if (a.time && b.time) return b.time.localeCompare(a.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const out: DisplayExpense[] = [];
  let placedYesterday = false;
  let placedEarlier = false;

  for (const e of sorted) {
    const d = parseISO(e.date);
    const row: DisplayExpense = {
      id: e.id,
      icon: iconFor(e.category),
      title: e.category,
      note: e.note ?? '',
      amount: formatAmount(e.amount, e.currency),
      when: whenLabel(e.date, e.time),
    };

    if (isYesterday(d) && !placedYesterday) {
      row.divider = 'yesterday';
      placedYesterday = true;
    } else if (!isToday(d) && !isYesterday(d) && isThisWeek(d) && !placedEarlier) {
      row.divider = 'earlier';
      placedEarlier = true;
    }

    out.push(row);
  }

  return out;
}
