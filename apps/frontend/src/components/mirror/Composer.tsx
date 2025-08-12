// src/components/mirror/Composer.tsx
import { AnimatePresence, motion } from 'framer-motion';
import MicButton from '../ui/MicButton';
import Glow from './composer/Glow';
import LockHint from './composer/LockHint';
import VoicePane from './composer/VoicePane';
import TextInput from './composer/TextInput';
import { useLockGesture } from './composer/useLockGesture';

type Props = {
  inputRef?: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  sending: boolean;

  // voice state from parent
  recording: boolean;
  elapsedSec: number;
  voiceLevel: number;

  // voice gesture callbacks from parent
  onMicHoldStart?: () => void;
  onMicHoldEnd?: () => void;
  onStopLockedSend?: () => void;

  hasText: boolean;
};

export default function Composer({
  inputRef, value, onChange, onSubmit, placeholder, sending,
  recording, elapsedSec, voiceLevel,
  onMicHoldStart, onMicHoldEnd, onStopLockedSend,
  hasText
}: Props) {
  const {
    holdingUI, locked, lockPulse, progress,
    holdStart, holdMove, holdEnd, holdRelease,
    resetLockUI, unlock,
  } = useLockGesture({ threshold: 72, onMicHoldStart, onMicHoldEnd });

  const btnMode: 'idle' | 'typing' | 'sending' | 'stop' =
    sending ? 'sending'
    : (recording && locked) ? 'stop'
    : (!recording && hasText) ? 'typing'
    : 'idle';

  function handleStopSquare() {
    onStopLockedSend?.();  // stop & send
    unlock();
    resetLockUI();
  }

  return (
    <div className="px-4 pb-4">
      {/* Glow only while actually holding or recording */}
      <Glow on={holdingUI || recording} />

      {/* Surface (no overflow hidden so hints can appear) */}
      <motion.div
        layoutId="composer-surface"
        className="relative mt-3 rounded-2xl bg-white/8 backdrop-blur-xl ring-1 ring-white/15 p-1.5 pl-3 flex items-center gap-2"
        animate={{
          boxShadow: hasText ? '0 0 0 2px rgba(255,255,255,0.15)' : '0 0 0 0 rgba(0,0,0,0)',
          scaleX: recording ? 1.02 : 1,
          scaleY: recording ? 0.98 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {/* Lock hint chip: only while holding */}
        <LockHint show={holdingUI && progress > 0.1} locked={locked} progress={progress} />

        {/* Tiny pulse when snapping to lock */}
        <AnimatePresence>
          {lockPulse && holdingUI && (
            <motion.span
              key="pulse"
              className="absolute right-2 bottom-12 block w-10 h-10 rounded-full"
              style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,.22), rgba(255,255,255,0))' }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.07 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            />
          )}
        </AnimatePresence>

        {/* Left side: either voice status or the text input */}
        <AnimatePresence mode="wait" initial={false}>
          {recording ? (
            <VoicePane elapsedSec={elapsedSec} voiceLevel={voiceLevel} />
          ) : (
            <TextInput
              inputRef={inputRef}
              value={value}
              placeholder={placeholder}
              disabled={sending}
              onChange={onChange}
              onEnter={onSubmit}
            />
          )}
        </AnimatePresence>

        {/* Right-side control: mic / send / stop */}
        <MicButton
          mode={btnMode}
          disabled={!!sending}
          onClick={btnMode === 'typing' ? onSubmit : (btnMode === 'stop' ? handleStopSquare : undefined)}
          onHoldStart={holdStart}
          onHoldEnd={holdEnd}
          onHoldMove={holdMove}
          onHoldRelease={holdRelease}
          holdDelayMs={180}
        />
      </motion.div>

      <div className="px-1 pt-1 pb-0.5 text-[12px] text-white/55">
        {recording
          ? (locked ? 'Tap ■ to stop & send' : 'Slide up to lock • Release to insert text')
          : 'Try saying: “I spent 45 BGN on dinner yesterday”'}
      </div>
    </div>
  );
}