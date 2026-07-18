interface Props {
  filter: string;
  setFilter: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
}

export function LeaderboardFilters({ filter, setFilter, timeframe, setTimeframe }: Props) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Timeframe */}
      <div className="flex items-center gap-1 rounded-lg bg-surface border border-border p-1">
        {["daily", "weekly", "monthly", "all-time"].map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-3 py-1.5 rounded-md transition-all text-xs sm:text-sm font-mono ${
              timeframe === t
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Mode Filter */}
      <div className="flex items-center gap-1 rounded-lg bg-surface border border-border p-1">
        {["all", "time", "words"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md transition-all text-xs sm:text-sm font-mono ${
              filter === f
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "all modes" : f}
          </button>
        ))}
      </div>
    </div>
  );
}