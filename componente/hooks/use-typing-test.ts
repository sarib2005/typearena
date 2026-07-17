import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeWords } from "@/componente/lib/words";

export type Mode = "time" | "words";
export type Duration = 15 | 30 | 60 | 120;
export type WordCount = 10 | 25 | 50 | 100;

export interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  elapsedMs: number;
  consistency: number;
  wpmHistory: { t: number; wpm: number; raw: number; errors: number }[];
}

interface Options {
  mode: Mode;
  duration: Duration;
  wordCount: WordCount;
  onFinish: (stats: Stats) => void;
}

export function useTypingTest({ mode, duration, wordCount, onFinish }: Options) {
  // Start empty on server, populate on client to avoid hydration mismatch
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState<string[]>([""]);
  const [wordIdx, setWordIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const historyRef = useRef<{ t: number; correct: number; incorrect: number }[]>([]);
  const lastSecondRef = useRef(0);

  const reset = useCallback(() => {
    setWords(makeWords(mode === "time" ? 80 : wordCount));
    setTyped([""]);
    setWordIdx(0);
    setStartedAt(null);
    setElapsed(0);
    setFinished(false);
    historyRef.current = [];
    lastSecondRef.current = 0;
  }, [mode, wordCount]);

  useEffect(() => { reset(); }, [reset]);

  // Compute char stats
  const charStats = useMemo(() => {
    let correct = 0, incorrect = 0, total = 0;
    for (let i = 0; i < typed.length; i++) {
      const t = typed[i];
      const w = words[i] ?? "";
      const len = Math.max(t.length, i < wordIdx ? w.length : 0);
      for (let j = 0; j < len; j++) {
        total++;
        if (t[j] !== undefined && t[j] === w[j]) correct++;
        else if (t[j] !== undefined || i < wordIdx) incorrect++;
      }
      if (i < wordIdx) total++; // space
      if (i < wordIdx) correct++;
    }
    return { correct, incorrect, total };
  }, [typed, words, wordIdx]);

  // Timer
  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => {
      const now = performance.now();
      const e = now - startedAt;
      setElapsed(e);
      const sec = Math.floor(e / 1000);
      if (sec > lastSecondRef.current) {
        lastSecondRef.current = sec;
        historyRef.current.push({ t: sec, correct: charStats.correct, incorrect: charStats.incorrect });
      }
      if (mode === "time" && e >= duration * 1000) {
        setFinished(true);
      }
    }, 50);
    return () => clearInterval(id);
  }, [startedAt, finished, duration, mode, charStats.correct, charStats.incorrect]);

  // Compute stats and call onFinish
  useEffect(() => {
    if (!finished) return;
    const totalTimeMin = Math.max(elapsed / 60000, 1 / 60);
    const wpm = (charStats.correct / 5) / totalTimeMin;
    const rawWpm = ((charStats.correct + charStats.incorrect) / 5) / totalTimeMin;
    const acc = charStats.total > 0 ? (charStats.correct / charStats.total) * 100 : 0;

    // per-second wpm
    const wpmHistory: Stats["wpmHistory"] = [];
    let prevCorrect = 0, prevIncorrect = 0;
    for (const h of historyRef.current) {
      const dCorrect = h.correct - prevCorrect;
      const dIncorrect = h.incorrect - prevIncorrect;
      wpmHistory.push({
        t: h.t,
        wpm: (h.correct / 5) / (h.t / 60 || 1/60),
        raw: ((h.correct + h.incorrect) / 5) / (h.t / 60 || 1/60),
        errors: dIncorrect,
      });
      prevCorrect = h.correct;
      prevIncorrect = h.incorrect;
    }
    // consistency = 100 - CV%
    const wpms = wpmHistory.map(h => h.wpm).filter(w => w > 0);
    let consistency = 100;
    if (wpms.length > 1) {
      const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + (b - mean) ** 2, 0) / wpms.length;
      const sd = Math.sqrt(variance);
      consistency = Math.max(0, Math.min(100, 100 - (sd / mean) * 100));
    }

    onFinish({
      wpm: Math.round(wpm),
      rawWpm: Math.round(rawWpm),
      accuracy: Math.round(acc * 10) / 10,
      correctChars: charStats.correct,
      incorrectChars: charStats.incorrect,
      totalChars: charStats.total,
      elapsedMs: elapsed,
      consistency: Math.round(consistency),
      wpmHistory,
    });
  }, [finished]); // eslint-disable-line

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (finished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key;

    if (key === "Tab") { e.preventDefault(); reset(); return; }

    if (key.length === 1 || key === "Backspace" || key === " ") {
      e.preventDefault();
      if (!startedAt) setStartedAt(performance.now());
    } else return;

    setTyped(prev => {
      const next = [...prev];
      const cur = next[wordIdx] ?? "";
      if (key === "Backspace") {
        if (cur.length === 0 && wordIdx > 0) {
          // go back to previous word only if it had errors
          const prevWord = words[wordIdx - 1];
          const prevTyped = next[wordIdx - 1] ?? "";
          if (prevTyped !== prevWord) {
            setWordIdx(wordIdx - 1);
          }
          return next;
        }
        next[wordIdx] = cur.slice(0, -1);
        return next;
      }
      if (key === " ") {
        if (cur.length === 0) return next;
        // advance
        const newIdx = wordIdx + 1;
        setWordIdx(newIdx);
        if (mode === "words" && newIdx >= wordCount) {
          setFinished(true);
        }
        // grow buffer
        if (!next[newIdx]) next[newIdx] = "";
        // append more words if running low (time mode)
        if (mode === "time" && newIdx > words.length - 20) {
          setWords(w => [...w, ...makeWords(40)]);
        }
        return next;
      }
      // regular character
      if (cur.length >= (words[wordIdx]?.length ?? 0) + 8) return next;
      next[wordIdx] = cur + key;
      return next;
    });
  }, [finished, startedAt, wordIdx, words, mode, wordCount, reset]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const timeLeft = mode === "time" ? Math.max(0, duration - Math.floor(elapsed / 1000)) : null;
  const liveWpm = useMemo(() => {
    if (!startedAt || elapsed < 1500) return 0;
    // Standard WPM: correctly typed chars / 5 per minute
    return Math.round((charStats.correct / 5) / (elapsed / 60000));
  }, [charStats.correct, elapsed, startedAt]);

  return {
    words,
    typed,
    wordIdx,
    finished,
    startedAt,
    elapsed,
    timeLeft,
    liveWpm,
    progress: mode === "words" ? wordIdx / wordCount : (elapsed / 1000) / duration,
    reset,
  };
}
