// src/hooks/useMicLevel.ts
import { useCallback, useEffect, useRef, useState } from 'react';

type WebAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export function useMicLevel() {
  const [level, setLevel] = useState(0);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setLevel(0);

    // Stop tracks
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Close audio context
    const ctx = ctxRef.current;
    if (ctx) {
      // close() returns a promise; we don't need to await it here
      void ctx.close();
      ctxRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;

      const win = window as WebAudioWindow;
      const Ctor = window.AudioContext ?? win.webkitAudioContext;
      if (!Ctor) {
        console.warn('Web Audio API is not available in this browser.');
        return;
      }

      const ctx = new Ctor();
      ctxRef.current = ctx;

      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);

      const loop = () => {
        analyser.getByteTimeDomainData(data);
        // Compute RMS
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length); // 0..~1
        setLevel(Math.min(1, rms * 2)); // normalize a bit
        rafRef.current = requestAnimationFrame(loop);
      };

      loop();
    } catch (e) {
      console.warn('Mic level error:', e);
      // ensure cleanup if start partially succeeded
      stop();
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { level, start, stop };
}
