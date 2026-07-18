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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl tracking-tight leading-none">TypingArena</h1>
            </div>
          </div>
          <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors hidden sm:inline">leaderboard</a>
            <a href="#" className="hover:text-foreground transition-colors hidden sm:inline">about</a>
            <a href="#" className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-md border border-border hover:border-primary hover:text-foreground transition-all text-xs sm:text-sm">sign in</a>
          </nav>
        </header>

        <div className="flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto">
          {!stats ? (
            <>
              {/* Config bar */}
              <div className="mb-6 sm:mb-10 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono">
                <ConfigGroup>
                  <ConfigBtn active={mode === "time"} onClick={() => changeMode("time")}>time</ConfigBtn>
                  <ConfigBtn active={mode === "words"} onClick={() => changeMode("words")}>words</ConfigBtn>
                </ConfigGroup>
                <div className="w-px h-4 sm:h-6 bg-border mx-1 sm:mx-2" />
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
              <div className="mb-4 sm:mb-6 h-6 sm:h-8 flex items-center justify-between">
                <div className="font-mono text-xl sm:text-2xl md:text-3xl text-primary tabular-nums">
                  {mode === "time" ? `${test.timeLeft}s` : `${test.wordIdx}/${wordCount}`}
                </div>
                <div className="font-mono text-xs sm:text-sm text-muted-foreground tabular-nums">
                  {test.startedAt ? `${test.liveWpm} wpm` : "start typing"}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[2px] bg-border rounded-full mb-6 sm:mb-8 overflow-hidden">
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
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border bg-surface font-mono text-xs">tab</kbd> 
                  <span className="hidden sm:inline">restart</span>
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border bg-surface font-mono text-xs">esc</kbd> 
                  <span className="hidden sm:inline">menu</span>
                </span>
              </div>
            </>
          ) : (
            <ResultsPanel stats={stats} onRestart={handleReset} />
          )}
        </div>

        <footer className="mt-8 sm:mt-12 text-center text-xs text-muted-foreground">
          <p>built for typists who care about the details</p>
        </footer>
      </div>
    </main>
  );
}

function ConfigGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1 rounded-lg bg-surface border border-border p-0.5 sm:p-1">
      {children}
    </div>
  );
}

function ConfigBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-xs sm:text-sm ${
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