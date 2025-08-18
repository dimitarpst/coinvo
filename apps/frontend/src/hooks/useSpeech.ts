// src/hooks/useSpeech.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Status = 'idle' | 'listening' | 'finalizing' | 'error';

// --- Minimal Web Speech API typings (enough for our usage) ---
interface SpeechRecognitionResultAlternative {
  transcript: string;
  confidence?: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionResultAlternative;
  length: number;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}
interface SpeechRecognitionErrorLike {
  error?: string;
  message?: string;
}
interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart?: () => void;
  onresult?: (ev: SpeechRecognitionEventLike) => void;
  onerror?: (ev: SpeechRecognitionErrorLike) => void;
  onend?: () => void;
}
type ISpeechRecognitionCtor = new () => ISpeechRecognition;

declare global {
  interface Window {
    webkitSpeechRecognition?: ISpeechRecognitionCtor;
    SpeechRecognition?: ISpeechRecognitionCtor;
  }
}

export function useSpeech(lang?: string) {
  const RecogCtor = useMemo<ISpeechRecognitionCtor | undefined>(
    () =>
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined,
    [],
  );

  const supported = !!RecogCtor;

  const recRef = useRef<ISpeechRecognition | null>(null);
  const sessionActiveRef = useRef(false);
  const keepAliveRef = useRef(false);
  const firstStartRef = useRef(true);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [finalText, setFinal] = useState('');
  const [interimText, setInterim] = useState('');
  const transcript = (
    finalText + (interimText ? ' ' + interimText : '')
  ).trim();

  // Refs to avoid stale state in onend:
  const finalRef = useRef('');
  const interimRef = useRef('');
  useEffect(() => {
    finalRef.current = finalText;
  }, [finalText]);
  useEffect(() => {
    interimRef.current = interimText;
  }, [interimText]);

  const [elapsedSec, setElapsedSec] = useState(0);
  const tickRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  const [endedAt, setEndedAt] = useState(0);

  const startTimer = useCallback(() => {
    if (!startTsRef.current) startTsRef.current = Date.now();
    if (tickRef.current) return;
    tickRef.current = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTsRef.current) / 1000));
    }, 250) as unknown as number; // setInterval returns number in browsers
  }, []);

  const stopTimer = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    startTsRef.current = 0;
    setElapsedSec(0);
    stopTimer();
  }, [stopTimer]);

  const resetTexts = useCallback(() => {
    setFinal('');
    setInterim('');
    finalRef.current = '';
    interimRef.current = '';
  }, []);

  const createAndStart = useCallback(
    (language?: string) => {
      if (!supported || !RecogCtor) return;
      const rec = new RecogCtor();
      recRef.current = rec;

      rec.lang = language || lang || navigator.language || 'en-US';
      rec.interimResults = true;
      rec.continuous = true;

      rec.onstart = () => {
        setStatus('listening');
        setError(null);
        if (firstStartRef.current) {
          startTimer();
          firstStartRef.current = false;
        }
      };

      rec.onresult = (ev: SpeechRecognitionEventLike) => {
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (res.isFinal) {
            const txt = (res[0]?.transcript || '').trim();
            setFinal((prev) => {
              const combined = prev ? `${prev} ${txt}` : txt;
              finalRef.current = combined;
              return combined;
            });
            setInterim('');
            interimRef.current = '';
          } else {
            const it = res[0]?.transcript || '';
            setInterim(it);
            interimRef.current = it;
          }
        }
      };

      rec.onerror = (e: SpeechRecognitionErrorLike) => {
        if (!keepAliveRef.current) {
          setStatus('error');
          setError(e?.error || 'speech_error');
          stopTimer();
        }
      };

      rec.onend = () => {
        // keep-alive loop
        if (sessionActiveRef.current && keepAliveRef.current) {
          try {
            rec.start();
          } catch {
            // Safari sometimes throws on immediate restart; small backoff
            setTimeout(() => createAndStart(rec.lang), 50);
          }
          return;
        }

        // TRUE end: merge any remaining interim into final before emitting endedAt
        const merged = (
          finalRef.current +
          (interimRef.current ? ' ' + interimRef.current : '')
        ).trim();
        if (merged !== finalRef.current) {
          setFinal(merged);
          finalRef.current = merged;
        }
        setInterim('');
        interimRef.current = '';

        sessionActiveRef.current = false;
        keepAliveRef.current = false;
        setStatus('idle');
        stopTimer();

        // let state flush, then notify container
        setTimeout(() => setEndedAt(Date.now()), 0);
      };

      try {
        rec.start();
      } catch (e) {
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Failed to start mic');
      }
    },
    [RecogCtor, supported, lang, startTimer, stopTimer],
  );

  const start = useCallback(
    (opts?: { keepAlive?: boolean; language?: string }) => {
      if (!supported) return;
      sessionActiveRef.current = true;
      keepAliveRef.current = !!opts?.keepAlive;
      firstStartRef.current = true;
      setEndedAt(0);
      resetTexts();
      resetTimer();
      createAndStart(opts?.language);
    },
    [supported, resetTexts, resetTimer, createAndStart],
  );

  const stop = useCallback(() => {
    keepAliveRef.current = false;
    setStatus('finalizing');
    try {
      recRef.current?.stop?.();
    } catch (e) {
      // older Safari can throw if already stopped
      console.debug('stop() ignored:', e);
    }
  }, []);

  const abort = useCallback(() => {
    keepAliveRef.current = false;
    sessionActiveRef.current = false;
    stopTimer();
    try {
      recRef.current?.abort?.();
    } catch (e) {
      console.debug('abort() ignored:', e);
    }
    setStatus('idle');
  }, [stopTimer]);

  const reset = useCallback(() => {
    resetTexts();
    resetTimer();
    setError(null);
    setEndedAt(0);
    setStatus('idle');
  }, [resetTexts, resetTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      try {
        recRef.current?.abort?.();
      } catch (e) {
        console.debug('cleanup abort ignored:', e);
      }
    };
  }, [stopTimer]);

  return {
    supported,
    status,
    error,
    finalText,
    interimText,
    transcript,
    elapsedSec,
    endedAt,
    start,
    stop,
    abort,
    reset,
  };
}
