const steps = ["Your selection", "Details", "Payment"];

// Checkout progress as three segments that fill left to right — the
// Airbnb / Trip.com shape. Each segment carries its own step name, so the
// bar reads the same on a phone and on desktop without labels colliding.
export default function BookingStepper({ current, allDone = false }: { current: 1 | 2 | 3; allDone?: boolean }) {
  return (
    <ol className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Booking progress">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current || allDone;
        const active = stepNum === current && !allDone;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="min-w-0">
            <span
              className={`block h-1.5 rounded-full transition-colors ${
                done ? "bg-[color:var(--color-success)]" : active ? "bg-[color:var(--color-ink)]" : "bg-[color:var(--color-border)]"
              }`}
            />
            <span
              className={`mt-2 block truncate t-caption sm:t-body-sm ${
                active ? "font-bold text-[color:var(--color-ink)]" : done ? "font-semibold text-[color:var(--color-ink-soft)]" : "font-medium text-[color:var(--color-muted)]"
              }`}
            >
              <span className="tabular">{stepNum}.</span> {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
