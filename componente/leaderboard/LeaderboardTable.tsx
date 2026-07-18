interface Entry {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  mode: string;
  duration?: number;
  wordCount?: number;
  date: string;
}

export function LeaderboardTable({ entries }: { entries: Entry[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-surface/50 text-xs uppercase tracking-widest text-muted-foreground">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Typist</div>
        <div className="col-span-2 text-right">WPM</div>
        <div className="col-span-2 text-right">Accuracy</div>
        <div className="col-span-2 text-right">Mode</div>
        <div className="col-span-2 text-right">Date</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 items-center hover:bg-primary/5 transition-colors"
          >
            {/* Rank */}
            <div className="flex items-center gap-3 sm:col-span-1">
              <span className={`font-mono text-sm sm:text-base font-bold ${
                entry.rank === 1 ? "text-yellow-400" :
                entry.rank === 2 ? "text-gray-400" :
                entry.rank === 3 ? "text-amber-700" :
                "text-muted-foreground"
              }`}>
                {entry.rank}
              </span>
            </div>

            {/* Name */}
            <div className="sm:col-span-3">
              <p className="font-mono text-sm sm:text-base font-medium text-foreground truncate">
                {entry.name}
              </p>
            </div>

            {/* WPM */}
            <div className="sm:col-span-2 sm:text-right">
              <span className="font-mono text-sm sm:text-base text-primary font-semibold">
                {entry.wpm}
              </span>
            </div>

            {/* Accuracy */}
            <div className="sm:col-span-2 sm:text-right">
              <span className="font-mono text-sm sm:text-base text-foreground">
                {entry.accuracy}%
              </span>
            </div>

            {/* Mode */}
            <div className="sm:col-span-2 sm:text-right">
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                  {entry.mode}
                </span>
                <span className="text-xs">
                  {entry.duration ? `${entry.duration}s` : `${entry.wordCount}w`}
                </span>
              </span>
            </div>

            {/* Date */}
            <div className="sm:col-span-2 sm:text-right">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {formatDate(entry.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}