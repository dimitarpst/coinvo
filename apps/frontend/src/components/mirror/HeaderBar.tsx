import Icon from '../ui/Icon';
import logo from '../../assets/images/coinvo_logo.png';

export default function HeaderBar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <div className="grid place-items-center w-10 h-10 rounded-lg bg-white/20 ring-1 ring-white/25">
         <img
          src={logo}
          alt="Coinvo logo"
          className="h-8 object-cover select-none"
          draggable={false}
        />

        </div>
        <div className="text-[15px] font-semibold tracking-tight">Coinvo</div>
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
