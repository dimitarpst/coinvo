import { useState } from 'react';

type Opts = {
  threshold?: number;
  onMicHoldStart?: () => void;
  onMicHoldEnd?: () => void;
};

export function useLockGesture({ threshold = 72, onMicHoldStart, onMicHoldEnd }: Opts) {
  const [holdingUI, setHoldingUI] = useState(false);
  const [locked, setLocked] = useState(false);
  const [dragDy, setDragDy] = useState(0);
  const [lockPulse, setLockPulse] = useState(false);

  const progress = Math.max(0, Math.min(1, -dragDy / threshold));

  function holdStart() {
    setHoldingUI(true);
    setDragDy(0);
    setLocked(false);
    setLockPulse(false);
    onMicHoldStart?.();
  }

  function holdMove(dy: number) {
    if (!holdingUI || locked) return;
    setDragDy(dy);
    if (dy <= -threshold) {
      setLocked(true);
      setLockPulse(true);
      setTimeout(() => setLockPulse(false), 200);
    }
  }

  function holdEnd() {
    if (locked) {
      // release AFTER lock keeps recording; just hide hint
      setHoldingUI(false);
      return;
    }
    setHoldingUI(false);
    onMicHoldEnd?.(); // stop & prefill
  }

  function holdRelease() {
    // always hide hint on lift (locked or not)
    setHoldingUI(false);
  }

  function resetLockUI() {
    setHoldingUI(false);
    setLockPulse(false);
    setDragDy(0);
  }

  function unlock() {
    setLocked(false);
  }

  return {
    // state
    holdingUI, locked, dragDy, lockPulse, progress,
    // handlers
    holdStart, holdMove, holdEnd, holdRelease,
    // helpers
    resetLockUI, unlock,
  };
}
