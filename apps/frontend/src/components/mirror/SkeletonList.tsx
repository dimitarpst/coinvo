// src/components/mirror/SkeletonList.tsx
import { motion } from 'framer-motion';

type Props = {
  count?: number;
  className?: string;
};

function Row() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.6 }}
      className="flex items-center justify-between rounded-2xl ring-1 ring-white/15 bg-white/8 p-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* icon placeholder */}
        <div className="w-9 h-9 rounded-xl bg-white/15 ring-1 ring-white/20 animate-pulse" />
        {/* text group */}
        <div className="min-w-0">
          <div className="h-3 w-40 max-w-[50vw] rounded bg-white/15 animate-pulse" />
          <div className="mt-2 h-2.5 w-28 max-w-[40vw] rounded bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* amount pill */}
      <div className="h-6 w-16 rounded-full bg-white/12 ring-1 ring-white/20 animate-pulse" />
    </motion.div>
  );
}

export default function SkeletonList({ count = 6, className }: Props) {
  return (
    <div className={['space-y-3', className || ''].join(' ')}>
      {Array.from({ length: count }).map((_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
}
