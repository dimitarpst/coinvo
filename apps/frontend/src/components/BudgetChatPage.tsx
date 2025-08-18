// src/components/BudgetChatPage.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import BudgetChatMirrorUI, { type DisplayExpense } from './BudgetChatMirrorUI';
import type { ExpenseEntry } from '../types';
import { parseExpenses } from '../api/parse';
import { listExpenses, createExpense } from '../api/expenses';
import { mapToDisplay } from '../utils/display';
import { useSpeech } from '../hooks/useSpeech';
import { useMicLevel } from '../hooks/useMicLevel';

export default function BudgetChatPage() {
  const [data, setData] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');

  const {
    supported, status, transcript, finalText, elapsedSec, endedAt,
    start: startMic, stop: stopMic, reset: resetMic,
  } = useSpeech();

  const { level, start: startLevel, stop: stopLevel } = useMicLevel();
  const sendAfterStopRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const rows = await listExpenses();
        setData(rows);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('Failed to load expenses:', msg);
      }
    })();
  }, []);

  useEffect(() => {
    if (!endedAt) return;
    const t = (finalText || transcript).trim();
    if (t) {
      setDraft(t);
      if (sendAfterStopRef.current) {
        setTimeout(() => handleSend(t), 0);
      }
    }
    sendAfterStopRef.current = false;
    resetMic();
  }, [endedAt, finalText, transcript, resetMic]); 

  async function handleSend(text: string) {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const parsed = await parseExpenses(text);

      const saved: ExpenseEntry[] = [];
      for (const p of parsed) {
        const created = await createExpense({
          amount: p.amount,
          currency: p.currency,
          category: p.category,
          date: p.date,
          note: p.note,
        });
        saved.push(created);
      }

      setData(prev => [...saved, ...prev]);
      setDraft('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg || 'Failed to parse/save expenses');
    } finally {
      setLoading(false);
    }
  }

  function startMicHold() {
    if (!supported) {
      alert('Voice input is not supported in this browser. Try Chrome on Android/Desktop.');
      return;
    }
    sendAfterStopRef.current = false;
    startLevel();
    startMic({ keepAlive: true });
  }

  function endMicHold() {
    stopMic();
    stopLevel();
  }

  function stopLockedAndSend() {
    sendAfterStopRef.current = true;
    stopLevel();
    stopMic();
  }

  const items: DisplayExpense[] = useMemo(() => mapToDisplay(data), [data]);

  return (
    <BudgetChatMirrorUI
      items={items}
      onSend={handleSend}
      sending={loading}
      recording={status === 'listening'}
      elapsedSec={elapsedSec}
      prefillText={draft}
      voiceLevel={level}
      onMicHoldStart={startMicHold}
      onMicHoldEnd={endMicHold}
      onStopLockedSend={stopLockedAndSend}
    />
  );
}
