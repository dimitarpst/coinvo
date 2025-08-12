import { motion } from 'framer-motion';
import WaveformBars from '../../ui/WaveformBars';

type Props = {
  elapsedSec: number;
  voiceLevel: number;
};

export default function VoicePane({ elapsedSec, voiceLevel }: Props) {
  const mm = String(Math.floor((elapsedSec ?? 0) / 60)).padStart(2, '0');
  const ss = String((elapsedSec ?? 0) % 60).padStart(2, '0');

  return (
    <motion.div
      key="voice"
      className="flex-1 flex items-center justify-between pr-1"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-[12px]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
          Listening… {mm}:{ss}
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-2">
          <WaveformBars level={voiceLevel ?? 0} />
        </div>
      </div>
    </motion.div>
  );
}
