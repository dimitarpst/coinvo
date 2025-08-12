// src/components/mirror/ExpenseList.tsx
import { AnimatePresence, motion } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import ExpenseRow from '../ExpenseRow';
import type { DisplayExpense } from '../BudgetChatMirrorUI';

type Props = {
  items: DisplayExpense[];
};

export default function ExpenseList({ items }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 pt-0">
      <SectionLabel label="Today" />
      <div className="mt-2 mb-3 flex items-center justify-between text-[13px]">
        <span className="text-white/70">Recent Expenses</span>
        <button className="flex items-center gap-1 text-white/80 hover:text-white">
          <span>This Week</span>
          {/* chevron lives in header's Icon set; the label is static for now */}
          {/* If you want the dropdown later, we can make it a component */}
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.6 }}
            >
              {e.divider === 'yesterday' && (
                <div className="pt-3"><SectionLabel label="Yesterday" /></div>
              )}
              {e.divider === 'earlier' && (
                <div className="pt-3"><SectionLabel label="Earlier this week" /></div>
              )}
              <ExpenseRow e={{
                icon: e.icon,
                title: e.title,
                note: e.note,
                when: e.when,
                amount: e.amount,
              }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
