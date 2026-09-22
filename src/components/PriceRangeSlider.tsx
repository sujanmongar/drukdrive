// Dual-handle range slider for picking a [min, max] window — the selected
// span is highlighted between the two draggable handles.
export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  formatLabel,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel: (n: number) => string;
}) {
  const [lo, hi] = value;
  const span = max - min || 1;
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;

  return (
    <div className="w-full">
      <div className="relative flex h-6 items-center">
        <div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-[color:var(--color-border)]" />
        <div
          className="pointer-events-none absolute h-1.5 rounded-full bg-[color:var(--color-ink)]"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="dual-range absolute inset-x-0 w-full"
          style={{ zIndex: lo >= hi ? 2 : 1 }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="dual-range absolute inset-x-0 w-full"
          style={{ zIndex: 1 }}
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-1.5 flex justify-between t-caption">
        <span className="t-amount">{formatLabel(lo)}</span>
        <span className="t-amount">{formatLabel(hi)}</span>
      </div>
    </div>
  );
}
