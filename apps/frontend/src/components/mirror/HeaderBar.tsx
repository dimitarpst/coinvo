import Icon from '../ui/Icon';

export default function HeaderBar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <div className="grid place-items-center w-7 h-7 rounded-lg bg-white/20 ring-1 ring-white/25">
          <Icon name="cube" className="w-4 h-4" />
        </div>
        <div className="text-[15px] font-semibold tracking-tight">BudgetChat</div>
      </div>
      <div className="flex items-center gap-2 text-white/80">
        <button className="grid place-items-center w-8 h-8 rounded-xl bg-white/10 ring-1 ring-white/20 hover:bg-white/15">
          <Icon name="moon" />
        </button>
        <button className="grid place-items-center w-8 h-8 rounded-xl bg-white/10 ring-1 ring-white/20 hover:bg-white/15">
          <Icon name="gear" />
        </button>
      </div>
    </div>
  );
}
