// src/components/ui/MicButton.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Icon from './Icon';

type Props = {
  mode: 'idle' | 'typing' | 'sending' | 'stop';
  onClick?: () => void;                 // typing/stop tap
  onHoldStart?: () => void;             // fires AFTER holdDelayMs
  onHoldEnd?: () => void;               // release while holding (only when not locked)
  onHoldMove?: (dy: number) => void;    // drag delta (down +, up -) while holding
  holdDelayMs?: number;                 // default 180ms
  disabled?: boolean;
  className?: string;
  onHoldRelease?: () => void; 
};

export default function MicButton({
  mode, onClick, onHoldStart, onHoldEnd, onHoldRelease, onHoldMove,
  holdDelayMs = 180, disabled, className,
}: Props) {
  const [holding, setHolding] = useState(false);
  const startY = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);
  const pressedRef = useRef(false);

  function clearTimer() {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  // --- POINTER-ONLY (works on touch + mouse) ---
  function downPointer(e: React.PointerEvent) {
    if (disabled) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    startY.current = e.clientY;
    pressedRef.current = true;

    // In typing/sending/stop modes we don't start a hold; those are tap-only.
    if (mode === 'typing' || mode === 'sending' || mode === 'stop') return;

    clearTimer();
    holdTimer.current = window.setTimeout(() => {
      setHolding(true);
      onHoldStart?.();
    }, holdDelayMs);
  }

  function movePointer(e: React.PointerEvent) {
    if (!pressedRef.current || !holding) return;
    onHoldMove?.(e.clientY - (startY.current ?? e.clientY));
  }


  function upOrCancelPointer() {
    const wasPressed = pressedRef.current;
    const wasHolding = holding;

    pressedRef.current = false;
    clearTimer();
    setHolding(false);
    startY.current = null;

    if (wasHolding) {
      onHoldRelease?.();
    }

    if (mode === 'typing') {
      if (wasPressed && !disabled) onClick?.();
      return;
    }
    if (mode === 'stop') {
      if (!wasHolding && wasPressed && !disabled) onClick?.();
      return;
    }

    if (wasHolding) {
      onHoldEnd?.();
    }
  }


  const rippleEnabled = holding && mode === 'idle';

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onPointerDown={downPointer}
      onPointerMove={movePointer}
      onPointerUp={upOrCancelPointer}
      onPointerCancel={upOrCancelPointer}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={[
        "relative grid place-items-center w-10 h-10 rounded-xl ring-1 ring-white/[0.25]",
        "touch-none select-none", // prevent page scrolling during gesture
        mode === 'stop'
          ? "bg-white/20 hover:bg-white/25"
          : disabled
            ? "opacity-50 cursor-not-allowed bg-white/[0.12]"
            : "bg-white/[0.15] hover:bg-white/[0.20]",
        className || "",
      ].join(" ")}
      aria-label={
        mode === 'typing' ? 'Send' :
        mode === 'stop'   ? 'Stop recording' :
        'Record'
      }
    >
      {/* subtle hold ripple */}
      <AnimatePresence>
        {rippleEnabled && (
          <motion.span
            key="r"
            className="absolute inset-0 rounded-xl bg-white/[0.18]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.06, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          />
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {mode === 'sending' ? (
            <motion.svg
              key="spin" viewBox="0 0 24 24"
              className="w-5 h-5 animate-spin"
              fill="none" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <circle cx="12" cy="12" r="8" className="opacity-30" />
              <path d="M12 4a8 8 0 0 1 8 8" />
            </motion.svg>
          ) : mode === 'typing' ? (
            <motion.div
              key="send"
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="-translate-x-[1px]"
            >
              <Icon name="send" />
            </motion.div>
          ) : mode === 'stop' ? (
            <motion.div
              key="stop"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            >
              <Icon name="stop" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            >
              <Icon name="mic" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
