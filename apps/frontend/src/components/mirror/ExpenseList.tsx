import SectionLabel from '../ui/SectionLabel';
import ExpenseRow from '../ExpenseRow';
import type { DisplayExpense } from '../BudgetChatMirrorUI';

/**
 * We removed per-row motion fades so the transition feels like
 * skeleton → content, not skeleton → fade-in again.
 */
type Props = {
  items: DisplayExpense[];
};

export default function ExpenseList({ items }: Props) {
  return (
    <div className="flex-1 p-4 pt-0">
      <SectionLabel label="Today" />
      <div className="mt-2 mb-3 flex items-center justify-between text-[13px]">
        <span className="text-white/70">Recent Expenses</span>
        <button className="flex items-center gap-1 text-white/80 hover:text-white">
          <span>This Week</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((e) => (
          <div key={e.id}>
            {e.divider === 'yesterday' && (
              <div className="pt-3"><SectionLabel label="Yesterday" /></div>
            )}
            {e.divider === 'earlier' && (
              <div className="pt-3"><SectionLabel label="Earlier this week" /></div>
            )}
            <ExpenseRow
              e={{
                icon: e.icon,
                title: e.title,
                note: e.note,
                when: e.when,
                amount: e.amount,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
