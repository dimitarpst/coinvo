import { useEffect, useRef, useState } from 'react';
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

  // short boot skeleton for consistent feel
  const [bootSkeleton, setBootSkeleton] = useState(true);
  useEffect(() => {
    const tid = window.setTimeout(() => setBootSkeleton(false), Math.max(0, initialSkeletonMs));
    return () => clearTimeout(tid);
  }, [initialSkeletonMs]);

  const showSkeleton = bootSkeleton || loadingList || (sending && items.length === 0);

  return (
    <div className="space-y-3">
      {/* Content (no extra padding here; PageLayout already provides p-4 pt-0) */}
      <AnimatePresence mode="wait" initial={false}>
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
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

      {/* Composer sits under list */}
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
  );
}
