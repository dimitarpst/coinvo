import { useEffect, useRef, useState } from 'react';
import HeaderBar from './mirror/HeaderBar';
import ExpenseList from './mirror/ExpenseList';
import Composer from './mirror/Composer';
import SkeletonList from './mirror/SkeletonList';
import { AnimatePresence, motion } from 'framer-motion';

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
  onMicHoldStart?: () => void;
  onMicHoldEnd?: () => void;
  onStopLockedSend?: () => void;

  // Live voice state
  recording?: boolean;
  elapsedSec?: number;
  prefillText?: string;
  voiceLevel?: number;

  // Optional: set true while you fetch from the backend
  loadingList?: boolean;

  // Optional: how long to always show a “boot” skeleton on first mount
  initialSkeletonMs?: number; // default 220
};

export default function BudgetChatMirrorUI({
  items, onSend, placeholder, sending,
  onMicHoldStart, onMicHoldEnd, onStopLockedSend,
  recording, elapsedSec, prefillText, voiceLevel,
  loadingList = false,
  initialSkeletonMs = 220,
}: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null!);

  // Sync transcript into input when provided
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

  /**
   * Show a short “boot” skeleton on first paint so the UI always
   * feels consistent, even if we already have items.
   */
  const [bootSkeleton, setBootSkeleton] = useState(true);
  useEffect(() => {
    const tid = window.setTimeout(() => setBootSkeleton(false), Math.max(0, initialSkeletonMs));
    return () => clearTimeout(tid);
  }, [initialSkeletonMs]);

  /**
   * Skeleton visibility rules:
   * - bootSkeleton (first mount)
   * - OR when parent says loadingList
   * - OR while sending AND there are no items yet (first load feel)
   */
  const showSkeleton = bootSkeleton || loadingList || (sending && items.length === 0);

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
      <div className="mx-auto min-h-[100dvh] flex w-full">
        <div className="relative flex flex-col w-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_20px_100px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/15">
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

          <HeaderBar />

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-4 pt-0">
            <AnimatePresence mode="wait" initial={false}>
              {showSkeleton ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Section label skeleton */}
                  <div className="h-3 w-16 rounded bg-white/12 animate-pulse mt-1 mb-3" />
                  <SkeletonList />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ExpenseList items={items} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Composer */}
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
    </div>
  );
}
