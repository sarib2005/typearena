import type { Stats } from "@/componente/hooks/use-typing-test";

interface Props {
  stats: Stats;
  onRestart: () => void;
}

export function ResultsPanel({ stats, onRestart }: Props) {
  const max = Math.max(...stats.wpmHistory.map(h => h.raw), stats.rawWpm, 60);
  const w = 720, h = 200, pad = 20;
  const points = stats.wpmHistory.map((h, i, arr) => {
    const x = pad + (i / Math.max(arr.length - 1, 1)) * (w - pad * 2);
    const y = h.wpm > 0 ? (h.wpm / max) * (200 - pad * 2) : 0;
    return { x, y: (200 - pad) - y, wpm: h.wpm, raw: h.raw, errors: h.errors, t: h.t };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = points.length > 0
    ? `${path} L${points[points.length - 1].x},${200 - pad} L${points[0].x},${200 - pad} Z`
    : "";

  const errorPoints = points.filter(p => p.errors > 0);

  return (
    <div className="fade-up space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="wpm" value={stats.wpm} accent big />
        <StatCard label="accuracy" value={`${stats.accuracy}%`} />
        <StatCard label="raw" value={stats.rawWpm} />
        <StatCard label="consistency" value={`${stats.consistency}%`} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Performance over time</h3>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="w-3 h-[2px] bg-primary" /> wpm</span>
            <span className="flex items-center gap-2"><span className="w-3 h-[2px] bg-muted-foreground/50" /> raw</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-destructive" /> errors</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          <defs>
            <linearGradient id="wpm-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* grid */}
          {[0.25, 0.5, 0.75].map(f => (
            <line key={f} x1={pad} x2={w - pad} y1={pad + (h - pad * 2) * f} y2={pad + (h - pad * 2) * f}
              stroke="var(--border)" strokeDasharray="3 4" />
          ))}
          {/* raw line */}
          <path
            d={points.map((_, i) => {
              const p = points[i];
              const x = p.x;
              const y = (h - pad) - (stats.wpmHistory[i].raw / max) * (h - pad * 2);
              return `${i === 0 ? "M" : "L"}${x},${y}`;
            }).join(" ")}
            fill="none" stroke="var(--muted-foreground)" strokeOpacity="0.5" strokeWidth="1.5"
          />
          {areaPath && <path d={areaPath} fill="url(#wpm-fill)" />}
          <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {errorPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={h - pad} r="3" fill="var(--destructive)" />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <MiniStat label="characters" value={`${stats.correctChars}/${stats.incorrectChars}`} />
        <MiniStat label="time" value={`${(stats.elapsedMs / 1000).toFixed(1)}s`} />
        <MiniStat label="correct" value={stats.correctChars} />
        <MiniStat label="errors" value={stats.incorrectChars} />
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onRestart}
          className="group px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold tracking-wide hover:pulse-glow transition-all"
        >
          Try again
          <kbd className="ml-3 px-2 py-0.5 rounded bg-black/20 text-xs font-mono">tab + enter</kbd>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, big }: { label: string; value: string | number; accent?: boolean; big?: boolean }) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-6 ${accent ? "relative overflow-hidden" : ""}`}>
      {accent && <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />}
      <div className="relative">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
        <div className={`font-mono ${big ? "text-6xl" : "text-4xl"} ${accent ? "text-gradient" : "text-foreground"} font-bold leading-none`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-mono text-lg text-foreground mt-1">{value}</span>
    </div>
  );
}
