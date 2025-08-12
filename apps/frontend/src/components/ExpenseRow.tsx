import Icon, { type IconName } from './ui/Icon';

export type ExpenseRowData = {
  icon: IconName;
  title: string;
  note: string;
  when: string;
  amount: string;
};

export default function ExpenseRow({ e }: { e: ExpenseRowData }) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] transition p-3.5 ring-1 ring-white/[0.10]">
      <div className="flex items-center gap-3.5">
        <div className="grid place-items-center w-9 h-9 rounded-xl bg-white/[0.20] ring-1 ring-white/[0.25] backdrop-blur-md text-white/[0.90]">
          <Icon name={e.icon} className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] text-white/[0.95] font-medium">{e.title}</div>
          <div className="text-[12px] text-white/[0.60]">{e.note}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[15px] font-semibold text-white/[0.95] tabular-nums">{e.amount}</div>
        <div className="text-[12px] text-white/[0.60]">{e.when}</div>
      </div>
    </div>
  );
}
