import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../../ui/Icon';

type Props = {
  show: boolean;
  locked: boolean;
  progress: number; // 0..1
};

export default function LockHint({ show, locked, progress }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="lock-hint"
          className="absolute right-2 bottom-12 select-none pointer-events-none"
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: locked ? -56 : -Math.min(56, Math.max(10, progress * 64)),
            scale: 1,
          }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <div className="grid place-items-center w-7 h-7 rounded-lg bg-white/18 ring-1 ring-white/25 backdrop-blur-sm">
            <Icon name="lock" className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
