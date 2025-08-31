import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './ui/Icon';
import type React from 'react';
import type { Transition } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

const SPOTLIGHT: Transition = { type: 'spring', stiffness: 340, damping: 26, mass: 0.95 } as const;

type Tab = {
  to: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
};

const TABS: Tab[] = [
  { to: '/', label: 'Chat', icon: 'cube' },
  { to: '/stats', label: 'Stats', icon: 'cart' },
  { to: '/settings', label: 'Settings', icon: 'gear' },
];

function GrowingLabel({ text }: { text: string }) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState(0);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const next = Math.ceil(el.offsetWidth);
    if (next && next !== w) setW(next);
  }, [text, w]);

  return (
    <>
      <span
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none whitespace-pre font-medium text-sm"
        aria-hidden="true"
      >
        {text}
      </span>

      <motion.div
        key="growing-label"
        initial={{ width: 0, opacity: 0, x: -6 }}
        animate={{ width: w, opacity: 1, x: 0 }}
        exit={{ width: 0, opacity: 0, x: 6 }}
        transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <span className="font-medium text-sm">{text}</span>
      </motion.div>
    </>
  );
}

export default function BottomNav() {
  const tabBase =
    'relative isolate group flex-1 h-10 flex items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/5';
  const navBase =
    'relative h-14 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl flex items-center justify-between gap-1 px-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,.45)]';

  return (
    <div className="sticky bottom-4 left-0 right-0 px-4">
      <nav className={navBase} aria-label="Primary">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }: { isActive: boolean }) =>
              `${tabBase} ${isActive ? 'text-white' : 'text-white/70'}`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {isActive && (
                    <>
                      <motion.span
                        key="spot"
                        layoutId="nav-spotlight"
                        transition={SPOTLIGHT}
                        className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/25"
                        aria-hidden="true"
                      />
                      <motion.span
                        key="outline"
                        layoutId="nav-spotlight-outline"
                        transition={SPOTLIGHT}
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        style={{ outline: '1px solid rgba(180,160,255,0.35)', outlineOffset: 0 }}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </AnimatePresence>

                <motion.div
                  layout
                  transition={SPOTLIGHT}
                  className="relative z-10 flex items-center justify-center gap-2 px-3 h-full"
                >
                  <motion.div layout transition={SPOTLIGHT} className="grid place-items-center">
                    <Icon name={t.icon} className="w-5 h-5" />
                  </motion.div>

                  <AnimatePresence initial={false} mode="sync">
                    {isActive && <GrowingLabel text={t.label} />}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
