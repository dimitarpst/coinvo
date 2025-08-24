import { NavLink } from 'react-router-dom';
import Icon from './ui/Icon';

export default function BottomNav() {
  return (
    <div className="sticky bottom-4 left-0 right-0 px-4">
      <nav
        className={[
          // rounded all around
          'h-14 rounded-2xl',
          // frosted
          'border border-white/15 bg-white/10 backdrop-blur-xl',
          // layout
          'flex justify-around items-center',
          // subtle shadow
          'shadow-[0_10px_40px_-10px_rgba(0,0,0,.45)]',
        ].join(' ')}
      >
        <NavLink
          to="/"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl ${
              isActive ? 'text-white' : 'text-white/70'
            }`
          }
        >
          <Icon name="cube" className="w-5 h-5" />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl ${
              isActive ? 'text-white' : 'text-white/70'
            }`
          }
        >
          <Icon name="cart" className="w-5 h-5" />
          <span>Stats</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl ${
              isActive ? 'text-white' : 'text-white/70'
            }`
          }
        >
          <Icon name="gear" className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
