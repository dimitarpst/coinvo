import { useEffect, useRef, useState } from 'react';
import HeaderBar from './mirror/HeaderBar';
import ExpenseList from './mirror/ExpenseList';
import Composer from './mirror/Composer';

export type DisplayExpense = {
  id: string;
  icon: string;
  title: string;
  note: string;
  when: string;
  amount: string;
  divider?: 'today' | 'yesterday' | 'earlier';
};

type Props = {
  items: DisplayExpense[];
  onSend?: (text: string) => void;
  placeholder?: string;
  sending?: boolean;

  // Mic interactions (provided by the page)
  onMicHoldStart?: () => void;   // hold after delay → start mic
  onMicHoldEnd?: () => void;     // release (unlocked) → stop & prefill
  onStopLockedSend?: () => void; // tap stop square (locked) → stop & send

  // Live voice state
  recording?: boolean;
  elapsedSec?: number;
  prefillText?: string;
  voiceLevel?: number;
};

export default function BudgetChatMirrorUI({
  items, onSend, placeholder, sending,
  onMicHoldStart, onMicHoldEnd, onStopLockedSend,
  recording, elapsedSec, prefillText, voiceLevel
}: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null!);

  // Sync transcript into the input when provided
  useEffect(() => {
    if (prefillText && prefillText !== text) {
      setText(prefillText);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillText]);

  const hasText = text.trim().length > 0;

  function submit() {
    const t = text.trim();
    if (!t || sending) return;
    onSend?.(t);
    setText('');
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden text-white selection:bg-white/20 selection:text-white/90"
      style={{ fontFamily: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial` }}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#4f46e5_15%,transparent_60%),radial-gradient(900px_600px_at_110%_10%,#14b8a6_10%,transparent_55%),linear-gradient(180deg,#0b1020,#0a0f1c_60%,#070b14)]" />
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Phone-like frosted panel */}
      <div className="mx-auto max-w-[420px] px-4 sm:px-8 pt-4 sm:pt-8 pb-[max(8px,env(safe-area-inset-bottom))] min-h-[100dvh] flex">
        <div className="relative flex flex-col w-full rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_20px_100px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/15">
          <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />

          <HeaderBar />

          <ExpenseList items={items} />

          <Composer
            inputRef={inputRef}
            value={text}
            onChange={setText}
            onSubmit={submit}
            placeholder={placeholder}
            sending={!!sending}
            // voice state
            recording={!!recording}
            elapsedSec={elapsedSec ?? 0}
            voiceLevel={voiceLevel ?? 0}
            // mic gestures
            onMicHoldStart={onMicHoldStart}
            onMicHoldEnd={onMicHoldEnd}
            onStopLockedSend={onStopLockedSend}
            hasText={hasText}
          />
        </div>
      </div>

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.25) transparent }
        *::-webkit-scrollbar { height: 8px; width: 8px }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 9999px }
      `}</style>
    </div>
  );
}
