import { Link } from "react-router-dom";

const steps = ["Review", "Details", "Payment"];

// Checkout progress as three segments that fill left to right. A completed
// step is a link back to that page (with the booking preserved in the
// URL), so anything can be revisited and the flow continued from there.
export default function BookingStepper({
  current,
  allDone = false,
  hrefs = [],
}: {
  current: 1 | 2 | 3;
  allDone?: boolean;
  /** Link for each step by index; only completed steps become clickable. */
  hrefs?: (string | undefined)[];
}) {
  return (
    <ol
      className="grid grid-cols-3 gap-2 sm:gap-3"
      aria-label="Booking progress"
    >
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current || allDone;
        const active = stepNum === current && !allDone;
        const href = done && !allDone ? hrefs[i] : undefined;
        const body = (
          <>
            <span
              className={`block h-1.5 rounded-full transition-colors ${
                done
                  ? "bg-[color:var(--color-success)]"
                  : active
                    ? "bg-[color:var(--color-ink)]"
                    : "bg-[color:var(--color-border)]"
              }`}
            />
            <span
              className={`mt-2 flex min-h-8 items-center gap-1 truncate t-caption sm:t-body-sm ${
                active
                  ? "font-bold text-[color:var(--color-ink)]"
                  : done
                    ? "font-semibold text-[color:var(--color-ink-soft)]"
                    : "font-medium text-[color:var(--color-muted)]"
              }`}
            >
              <span className="tabular">{stepNum}.</span> {label}
              {href && (
                <span className="t-caption font-medium text-[color:var(--color-link)]">
                  · Edit
                </span>
              )}
            </span>
          </>
        );
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className="min-w-0"
          >
            {href ? (
              <Link
                to={href}
                className="block rounded-md hover:opacity-80"
                aria-label={`Back to ${label}`}
              >
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
