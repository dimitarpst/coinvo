// src/components/ui/WaveformBars.tsx
export default function WaveformBars({ level = 0 }: { level?: number }) {
  const bars = 16;
  const weights = [0.5,0.9,1,0.85,0.7,0.55,0.45,0.4,0.4,0.45,0.55,0.7,0.85,1,0.9,0.5];
  return (
    <div className="flex items-center gap-[3px] h-6">
      {Array.from({ length: bars }).map((_, i) => {
        const h = Math.max(3, Math.round(24 * (0.15 + level * 0.85 * weights[i])));
        return (
          <div
            key={i}
            className="w-[3px] rounded-full bg-white/70"
            style={{ height: h }}
          />
        );
      })}
    </div>
  );
}
