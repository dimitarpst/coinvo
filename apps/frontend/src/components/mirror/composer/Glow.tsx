import { AnimatePresence, motion } from 'framer-motion';

export default function Glow({ on }: { on: boolean }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.span
          key="glow"
          className="absolute right-0 bottom-7 w-20 h-20 rounded-full -z-0"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,.18), rgba(255,255,255,0))' }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1.08, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        />
      )}
    </AnimatePresence>
  );
}
