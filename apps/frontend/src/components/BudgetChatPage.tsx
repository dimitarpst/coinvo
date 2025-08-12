import { useEffect, useMemo, useRef, useState } from 'react';
import BudgetChatMirrorUI, { type DisplayExpense } from './BudgetChatMirrorUI';
import type { ExpenseEntry } from '../types';
import { parseExpenses } from '../api/parse';
import { mapToDisplay } from '../utils/display';
import { useSpeech } from '../hooks/useSpeech';
import { useMicLevel } from '../hooks/useMicLevel';

const seed: ExpenseEntry[] = [
  { id: 's1', amount: 86.5, currency: 'BGN', category: 'Groceries',  date: new Date().toISOString().slice(0,10), time: '14:30', note: 'Weekly shopping at Lidl' },
  { id: 's2', amount: 42,   currency: 'BGN', category: 'Restaurant', date: new Date().toISOString().slice(0,10), time: '12:15', note: 'Lunch with Alex' },
];

export default function BudgetChatPage() {
  const [data, setData]   = useState<ExpenseEntry[]>(seed);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(''); // shows transcript in the input

  const {
    supported, status, transcript, finalText, elapsedSec, endedAt,
    start: startMic, stop: stopMic, reset: resetMic,
  } = useSpeech();

  const { level, start: startLevel, stop: stopLevel } = useMicLevel();

  // 👇 tells the endedAt effect whether this stop came from the "locked stop" flow
  const sendAfterStopRef = useRef(false);

  async function handleSend(text: string) {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const parsed = await parseExpenses(text);
      setData(prev => [...parsed, ...prev]);
      setDraft(''); // clear the input after successful send
    } catch (e: any) {
      alert(e?.message || 'Failed to parse expenses');
    } finally {
      setLoading(false);
    }
  }

  function startMicHold() {
    if (!supported) {
      alert('Voice input is not supported in this browser. Try Chrome on Android/Desktop.');
      return;
    }
    sendAfterStopRef.current = false; // fresh session, default: don’t auto-send
    startLevel();
    startMic({ keepAlive: true });
  }

  // Release (unlocked) → stop & prefill (no auto-send)
  function endMicHold() {
    stopMic();
    stopLevel();
  }

  // Locked → user taps the stop square
  function stopLockedAndSend() {
    sendAfterStopRef.current = true; // signal that we want to auto-send after transcript finalizes
    stopLevel();
    stopMic();
  }

  // When ASR session truly ends, act based on which flow ended
  useEffect(() => {
    if (!endedAt) return;
    const t = (finalText || transcript).trim();
    if (t) {
      // Always show what we heard in the input first (so the user sees it)
      setDraft(t);

      // If this was the locked-stop flow → also send
      if (sendAfterStopRef.current) {
        // allow the input to visually update this tick before sending
        setTimeout(() => handleSend(t), 0);
      }
    }
    // reset hook state for next session
    sendAfterStopRef.current = false;
    resetMic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endedAt]);

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
