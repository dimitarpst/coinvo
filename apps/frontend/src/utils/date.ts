import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function labelFor(dateISO: string): string {
  const d = parseISO(dateISO);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, MMM d');         
}
