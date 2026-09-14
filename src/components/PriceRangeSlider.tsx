// Kayak-style dual-handle range slider: a ticked track with two draggable
// circular handles for picking a [min, max] window.
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

  return (
    <div className="w-full">
      <div className="relative flex h-6 items-center">
        <div
          className="pointer-events-none absolute inset-x-0 h-2.5 rounded-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-ink) 0px, var(--color-ink) 2px, transparent 2px, transparent 6px)",
          }}
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
      <div className="mt-1.5 flex justify-between text-xs text-[color:var(--color-muted)]">
        <span>{formatLabel(lo)}</span>
        <span>{formatLabel(hi)}</span>
      </div>
    </div>
  );
}
