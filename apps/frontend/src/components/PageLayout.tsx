import type { ReactNode } from 'react';
import HeaderBar from './mirror/HeaderBar';
import BottomNav from './BottomNav';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden text-white selection:bg-white/20 selection:text-white/90"
      style={{ fontFamily: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial` }}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#4f46e5_15%,transparent_60%),radial-gradient(900px_600px_at_110%_10%,#14b8a6_10%,transparent_55%),linear-gradient(180deg,#0b1020,#0a0f1c_60%,#070b14)]" />
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Phone-like frosted panel */}
      <div className="mx-auto min-h-[100dvh] flex w-full">
        <div className="relative flex flex-col w-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_20px_100px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/15">
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

          <HeaderBar />

          {/* Single scroll region for page content.
              Padding bottom reserves space so Composer sits above BottomNav. */}
          <div className="flex-1 overflow-y-auto p-4 pt-0 pb-24">
            {children}
          </div>

          {/* Bottom nav pinned to the very bottom of the panel */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
