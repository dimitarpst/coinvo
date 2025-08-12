import { motion } from 'framer-motion';
import type { RefObject } from 'react';

type Props = {
  inputRef?: RefObject<HTMLInputElement>;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  onEnter: () => void;
};

export default function TextInput({
  inputRef, value, placeholder, disabled, onChange, onEnter,
}: Props) {
  return (
    <motion.input
      key="input"
      ref={inputRef}
      className="flex-1 bg-transparent outline-none placeholder:text-white/60 text-[14px] py-2"
      placeholder={placeholder ?? 'I spent 30 BGN on groceries...'}
      value={value}
      disabled={!!disabled}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) onEnter(); }}
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    />
  );
}
