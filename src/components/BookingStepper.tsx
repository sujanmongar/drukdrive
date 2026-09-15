import Icon from "./Icon";

const steps = ["Your selection", "Details", "Payment"];

// Checkout progress. Each step is a numbered disc with its label beside it
// and a connector that fills once the step is done — the shape used by
// Booking.com / Economy Bookings, so it reads as "where am I" at a glance
// on a phone as well as on desktop.
export default function BookingStepper({ current, allDone = false }: { current: 1 | 2 | 3; allDone?: boolean }) {
  return (
    <ol className="flex items-center" aria-label="Booking progress">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current || allDone;
        const active = stepNum === current && !allDone;
        const last = stepNum === steps.length;
        return (
          <li key={label} className={`flex items-center ${last ? "shrink-0" : "min-w-0 flex-1"}`} aria-current={active ? "step" : undefined}>
            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full t-caption font-bold transition-colors sm:size-8 ${
                  done
                    ? "bg-[color:var(--color-success)] text-white"
                    : active
                      ? "bg-[color:var(--color-ink)] text-white"
                      : "border border-[color:var(--color-border)] bg-white text-[color:var(--color-muted)]"
                }`}
              >
                {done ? <Icon name="check" size={15} strokeWidth={2.5} /> : stepNum}
              </span>
              {/* Phones only have room for the current step's name; the
                  other steps read from their disc alone. */}
              <span
                className={`whitespace-nowrap t-body-sm ${active ? "" : "hidden sm:inline"} ${
                  active ? "font-bold text-[color:var(--color-ink)]" : done ? "font-semibold text-[color:var(--color-ink)]" : "font-medium text-[color:var(--color-muted)]"
                }`}
              >
                {label}
              </span>
            </div>
            {!last && (
              <span
                aria-hidden
                className={`mx-3 h-px min-w-4 flex-1 sm:mx-4 ${done ? "bg-[color:var(--color-success)]" : "bg-[color:var(--color-border)]"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
