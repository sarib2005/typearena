export function Background() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{
        background: "radial-gradient(ellipse at top, oklch(0.82 0.17 75 / 0.08), transparent 60%)",
      }}
    />
  );
}