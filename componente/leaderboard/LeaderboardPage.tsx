"use client";

import { useState } from "react";
import { Header } from "@/componente/navigations/Header";
import { Footer } from "@/componente/navigations/Footer";
import { Background } from "@/componente/globalcomponents/Background";
import { LeaderboardTable } from "../leaderboard/LeaderboardTable";
import { LeaderboardFilters } from "../leaderboard/LeaderboardFilter";

// Mock data - replace with your API call
const mockData = [
  { rank: 1, name: "speed_demon", wpm: 156, accuracy: 98.5, mode: "time", duration: 60, date: "2026-07-15" },
  { rank: 2, name: "type_master", wpm: 148, accuracy: 97.2, mode: "time", duration: 60, date: "2026-07-14" },
  { rank: 3, name: "keyboard_warrior", wpm: 142, accuracy: 96.8, mode: "words", wordCount: 100, date: "2026-07-16" },
  { rank: 4, name: "swift_keys", wpm: 139, accuracy: 99.1, mode: "time", duration: 30, date: "2026-07-13" },
  { rank: 5, name: "the_flash", wpm: 135, accuracy: 95.5, mode: "time", duration: 60, date: "2026-07-15" },
  { rank: 6, name: "ninja_typer", wpm: 131, accuracy: 97.8, mode: "words", wordCount: 50, date: "2026-07-16" },
  { rank: 7, name: "pixel_pusher", wpm: 128, accuracy: 96.0, mode: "time", duration: 120, date: "2026-07-12" },
  { rank: 8, name: "quantum_keys", wpm: 125, accuracy: 98.3, mode: "time", duration: 60, date: "2026-07-14" },
  { rank: 9, name: "blitz_typer", wpm: 122, accuracy: 94.7, mode: "words", wordCount: 25, date: "2026-07-15" },
  { rank: 10, name: "sonic_scribbler", wpm: 119, accuracy: 97.1, mode: "time", duration: 30, date: "2026-07-13" },
];

export function LeaderboardPage() {
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("daily");

  return (
    <main className="min-h-screen bg-background bg-mesh relative overflow-hidden">
      <Background />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Top typists competing for speed and accuracy
            </p>
          </div>

          {/* Filters */}
          <LeaderboardFilters
            filter={filter}
            setFilter={setFilter}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />

          {/* Top 3 Podium */}
          <div className="mb-8 sm:mb-12">
            <Podium entries={mockData.slice(0, 3)} />
          </div>

          {/* Leaderboard Table */}
          <div className="flex-1">
            <LeaderboardTable entries={mockData} />
          </div>

          {/* Pagination */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
            <button className="px-3 py-1.5 rounded-md border border-border bg-surface text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-md border border-border bg-surface text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
              2
            </button>
            <button className="px-3 py-1.5 rounded-md border border-border bg-surface text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
              3
            </button>
            <button className="px-3 py-1.5 rounded-md border border-border bg-surface text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
              Next
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

function Podium({ entries }: { entries: typeof mockData }) {
  const [first, second, third] = entries;
  
  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 pt-8">
      {/* 2nd Place */}
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface border-2 border-gray-400 mx-auto mb-2 flex items-center justify-center">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-gray-400">2</span>
        </div>
        <div className="h-24 sm:h-28 rounded-t-lg bg-surface border border-border p-3 flex flex-col items-center justify-center">
          <p className="font-mono text-sm sm:text-base font-bold text-foreground truncate max-w-[80px]">
            {second?.name || "---"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{second?.wpm || 0} wpm</p>
          <p className="text-xs text-muted-foreground">{second?.accuracy || 0}%</p>
        </div>
      </div>

      {/* 1st Place */}
      <div className="text-center -mt-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mx-auto mb-2 flex items-center justify-center"
          style={{ boxShadow: "0 0 30px rgba(251, 191, 36, 0.3)" }}>
          <span className="font-mono text-3xl sm:text-4xl font-bold text-white">1</span>
        </div>
        <div className="h-32 sm:h-36 rounded-t-lg bg-surface border border-primary/30 p-3 flex flex-col items-center justify-center relative overflow-hidden"
          style={{ boxShadow: "0 0 20px rgba(var(--primary), 0.1)" }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-600" />
          <p className="font-mono text-base sm:text-lg font-bold text-foreground truncate max-w-[100px]">
            {first?.name || "---"}
          </p>
          <p className="text-sm text-primary font-bold mt-1">{first?.wpm || 0} wpm</p>
          <p className="text-xs text-muted-foreground">{first?.accuracy || 0}% accuracy</p>
        </div>
      </div>

      {/* 3rd Place */}
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface border-2 border-amber-700 mx-auto mb-2 flex items-center justify-center">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-700">3</span>
        </div>
        <div className="h-20 sm:h-24 rounded-t-lg bg-surface border border-border p-3 flex flex-col items-center justify-center">
          <p className="font-mono text-sm sm:text-base font-bold text-foreground truncate max-w-[80px]">
            {third?.name || "---"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{third?.wpm || 0} wpm</p>
          <p className="text-xs text-muted-foreground">{third?.accuracy || 0}%</p>
        </div>
      </div>
    </div>
  );
}