import type { Stats } from "@/componente/hooks/use-typing-test";
import { useEffect, useRef, useState, type MouseEvent } from "react";

interface Props {
  stats: Stats;
  onRestart: () => void;
}

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function ResultsPanel({ stats, onRestart }: Props) {
  const max = Math.max(...stats.wpmHistory.map(h => h.raw), stats.rawWpm, 60);
  const w = 720, h = 200, pad = 20, padLeft = 36;
  const chartW = w - padLeft - pad;

  const points = stats.wpmHistory.map((entry, i, arr) => {
    const x = padLeft + (i / Math.max(arr.length - 1, 1)) * chartW;
    const y = entry.wpm > 0 ? (h - pad) - (entry.wpm / max) * (h - pad * 2) : h - pad;
    return { x, y, wpm: entry.wpm, raw: entry.raw, errors: entry.errors, t: entry.t };
  });
  const rawPoints = stats.wpmHistory.map((entry, i) => ({
    x: points[i]?.x ?? padLeft,
    y: (h - pad) - (entry.raw / max) * (h - pad * 2),
  }));

  const path = smoothPath(points);
  const rawPath = smoothPath(rawPoints);
  const areaPath = points.length > 0
    ? `${path} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`
    : "";
  const errorPoints = points.filter(p => p.errors > 0);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // Draw-in animation on mount
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Hover crosshair + tooltip
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    let nearest = 0, best = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - px);
      if (d < best) { best = d; nearest = i; }
    });
    setHoverIdx(nearest);
  };
  const hover = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="fade-up space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="wpm" value={stats.wpm} accent big />
        <StatCard label="accuracy" value={`${stats.accuracy}%`} />
        <StatCard label="raw" value={stats.rawWpm} />
        <StatCard label="consistency" value={`${stats.consistency}%`} />
      </div>

      {/* Performance Graph */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4 gap-2 sm:gap-0">
          <h3 className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">Performance over time</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 sm:w-3 h-[2px] bg-primary" /> wpm
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 sm:w-3 h-[2px] bg-muted-foreground/50" /> raw
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-destructive" /> errors
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${w} ${h}`}
            className="w-full min-w-[300px] h-auto"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="wpm-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* grid + y-axis labels */}
            {yTicks.map(f => {
              const y = pad + (h - pad * 2) * (1 - f);
              return (
                <g key={f}>
                  {f > 0 && f < 1 && (
                    <line x1={padLeft} x2={w - pad} y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" />
                  )}
                  <text x={padLeft - 8} y={y} textAnchor="end" dominantBaseline="middle"
                    fill="var(--muted-foreground)" style={{ fontSize: 9 }}>
                    {Math.round(max * f)}
                  </text>
                </g>
              );
            })}

            {/* x-axis time labels */}
            {points.length > 1 && [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]].map((p, i) => (
              <text key={i} x={p.x} y={h - 4} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
                fill="var(--muted-foreground)" style={{ fontSize: 9 }}>
                {p.t}s
              </text>
            ))}

            {/* raw line */}
            <path d={rawPath} fill="none" stroke="var(--muted-foreground)" strokeOpacity="0.5" strokeWidth="1.5" />

            {areaPath && <path d={areaPath} fill="url(#wpm-fill)" />}

            {/* wpm line, animated draw-in */}
            <path
              d={path}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                transition: "stroke-dashoffset 700ms ease-out",
              }}
            />

            {errorPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={h - pad} r="3" fill="var(--destructive)" />
            ))}

            {/* hover crosshair + tooltip */}
            {hover && (
              <g pointerEvents="none">
                <line x1={hover.x} x2={hover.x} y1={pad} y2={h - pad} stroke="var(--border)" strokeWidth="1" />
                <circle cx={hover.x} cy={hover.y} r="4" fill="var(--primary)" stroke="var(--surface)" strokeWidth="1.5" />
                {(() => {
                  const boxW = 74, boxH = 44;
                  const bx = Math.min(Math.max(hover.x - boxW / 2, padLeft), w - pad - boxW);
                  const by = hover.y > h / 2 ? hover.y - boxH - 10 : hover.y + 10;
                  return (
                    <g transform={`translate(${bx},${by})`}>
                      <rect width={boxW} height={boxH} rx="6" fill="var(--surface)" stroke="var(--border)" />
                      <text x="8" y="16" fill="var(--foreground)" style={{ fontSize: 10, fontWeight: 600 }}>
                        {Math.round(hover.wpm)} wpm
                      </text>
                      <text x="8" y="28" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>
                        raw {Math.round(hover.raw)} · err {hover.errors}
                      </text>
                      <text x="8" y="39" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>
                        {hover.t}s
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
        <MiniStat label="characters" value={`${stats.correctChars}/${stats.incorrectChars}`} />
        <MiniStat label="time" value={`${(stats.elapsedMs / 1000).toFixed(1)}s`} />
        <MiniStat label="correct" value={stats.correctChars} />
        <MiniStat label="errors" value={stats.incorrectChars} />
      </div>

      {/* Restart Button */}
      <div className="flex justify-center gap-3 pt-2 sm:pt-0">
        <button
          onClick={onRestart}
          className="group w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold tracking-wide hover:pulse-glow transition-all text-sm sm:text-base"
        >
          Try again
          <kbd className="ml-2 sm:ml-3 px-1.5 sm:px-2 py-0.5 rounded bg-black/20 text-xs font-mono hidden sm:inline">tab + enter</kbd>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, big }: { label: string; value: string | number; accent?: boolean; big?: boolean }) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-4 sm:p-6 ${accent ? "relative overflow-hidden" : ""}`}>
      {accent && <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />}
      <div className="relative">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 sm:mb-2">{label}</div>
        <div className={`font-mono ${big ? "text-4xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl md:text-4xl"} ${accent ? "text-gradient" : "text-foreground"} font-bold leading-none`}>
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
      <span className="font-mono text-base sm:text-lg text-foreground mt-1">{value}</span>
    </div>
  );
}