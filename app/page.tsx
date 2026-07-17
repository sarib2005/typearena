"use client";

import { useState } from "react";
import { useTypingTest, type Mode, type Duration, type WordCount, type Stats } from "@/componente/hooks/use-typing-test";
import { TypingArea } from "@/componente/home/TypingArea";
import { ResultsPanel } from "@/componente/home/ResultsPanel";

const DURATIONS: Duration[] = [15, 30, 60, 120];
const COUNTS: WordCount[] = [10, 25, 50, 100];

function Index() {
  const [mode, setMode] = useState<Mode>("time");
  const [duration, setDuration] = useState<Duration>(30);
  const [wordCount, setWordCount] = useState<WordCount>(25);
  const [stats, setStats] = useState<Stats | null>(null);

  const test = useTypingTest({
    mode,
    duration,
    wordCount,
    onFinish: setStats,
  });

  const handleReset = () => {
    setStats(null);
    test.reset();
  };

  const changeMode = (m: Mode) => { setMode(m); setStats(null); };
  const changeDuration = (d: Duration) => { setDuration(d); setStats(null); };
  const changeCount = (c: WordCount) => { setWordCount(c); setStats(null); };

  return (
    <main className="min-h-screen bg-background bg-mesh relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(ellipse at top, oklch(0.82 0.17 75 / 0.08), transparent 60%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-mono font-bold text-primary-foreground text-lg" style={{ boxShadow: "var(--shadow-glow)" }}>
              V
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight leading-none">velocity</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">typing, refined</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">leaderboard</a>
            <a href="#" className="hover:text-foreground transition-colors">about</a>
            <a href="#" className="px-4 py-1.5 rounded-md border border-border hover:border-primary hover:text-foreground transition-all">sign in</a>
          </nav>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto">
          {!stats ? (
            <>
              {/* Config bar */}
              <div className="mb-10 flex flex-wrap items-center justify-center gap-2 text-sm font-mono">
                <ConfigGroup>
                  <ConfigBtn active={mode === "time"} onClick={() => changeMode("time")}>time</ConfigBtn>
                  <ConfigBtn active={mode === "words"} onClick={() => changeMode("words")}>words</ConfigBtn>
                </ConfigGroup>
                <div className="w-px h-6 bg-border mx-2" />
                <ConfigGroup>
                  {mode === "time"
                    ? DURATIONS.map(d => (
                        <ConfigBtn key={d} active={duration === d} onClick={() => changeDuration(d)}>{d}</ConfigBtn>
                      ))
                    : COUNTS.map(c => (
                        <ConfigBtn key={c} active={wordCount === c} onClick={() => changeCount(c)}>{c}</ConfigBtn>
                      ))}
                </ConfigGroup>
              </div>

              {/* Live indicator */}
              <div className="mb-6 h-8 flex items-center justify-between">
                <div className="font-mono text-3xl text-primary tabular-nums">
                  {mode === "time" ? `${test.timeLeft}s` : `${test.wordIdx}/${wordCount}`}
                </div>
                <div className="font-mono text-sm text-muted-foreground tabular-nums">
                  {test.startedAt ? `${test.liveWpm} wpm` : "start typing"}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[2px] bg-border rounded-full mb-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
                  style={{ width: `${Math.min(100, test.progress * 100)}%` }}
                />
              </div>

              {/* Typing area */}
              <TypingArea
                words={test.words}
                typed={test.typed}
                wordIdx={test.wordIdx}
                finished={test.finished}
              />

              {/* Hint */}
              <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded border border-border bg-surface font-mono">tab</kbd> restart
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded border border-border bg-surface font-mono">esc</kbd> menu
                </span>
              </div>
            </>
          ) : (
            <ResultsPanel stats={stats} onRestart={handleReset} />
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>built for typists who care about the details</p>
        </footer>
      </div>
    </main>
  );
}

function ConfigGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1 rounded-lg bg-surface border border-border p-1">{children}</div>;
}

function ConfigBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md transition-all ${
        active
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default Index;