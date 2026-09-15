import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

const steps = ["Search", "Review", "Details", "Payment", "Confirmation"];

// Numbered discs with the label beside each and a short rule between —
// centred on every width. A completed step is a link back to that page
// (with the booking preserved in the URL), so it can be revisited and the
// flow continued from there.
export default function BookingStepper({
  current,
  allDone = false,
  hrefs = [],
}: {
  current: 1 | 2 | 3 | 4 | 5;
  allDone?: boolean;
  /** Link for each step by index; only completed steps become clickable. */
  hrefs?: (string | undefined)[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  // When the strip is wider than the screen, start with the current step in
  // view (centred) rather than at the first step.
  useEffect(() => {
    const wrap = wrapRef.current;
    const li = activeRef.current;
    if (!wrap || !li || wrap.scrollWidth <= wrap.clientWidth) return;
    wrap.scrollLeft = li.offsetLeft - wrap.clientWidth / 2 + li.offsetWidth / 2;
  }, [current]);

  return (
    <div
      ref={wrapRef}
      className="scrollbar-hide -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
    >
      <ol
        className="mx-auto flex w-max items-center gap-1.5 sm:gap-3"
        aria-label="Booking progress"
      >
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < current || allDone;
          const active = stepNum === current && !allDone;
          const href = done && !allDone ? hrefs[i] : undefined;
          const disc = (
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 t-caption font-bold tabular ${
                done
                  ? "border-[color:var(--color-link)] text-[color:var(--color-link)]"
                  : active
                    ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                    : "border-[color:var(--color-border)] text-[color:var(--color-muted)]"
              }`}
            >
              {done ? <Icon name="check" size={14} strokeWidth={3} /> : stepNum}
            </span>
          );
          const text = (
            <span
              className={`whitespace-nowrap t-body-sm ${
                done
                  ? "font-semibold text-[color:var(--color-link)]"
                  : active
                    ? "font-bold text-[color:var(--color-ink)]"
                    : "font-medium text-[color:var(--color-muted)]"
              }`}
            >
              {label}
            </span>
          );
          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className="flex shrink-0 items-center gap-1.5 sm:gap-3"
            >
              {href ? (
                <Link
                  to={href}
                  className="flex min-h-11 items-center gap-2 rounded-lg hover:opacity-80"
                  aria-label={`Back to ${label}`}
                >
                  {disc}
                  {text}
                </Link>
              ) : (
                <span className="flex min-h-11 items-center gap-2">
                  {disc}
                  {text}
                </span>
              )}
              {stepNum < steps.length && (
                <span
                  aria-hidden
                  className={`h-px w-3 sm:w-8 ${done ? "bg-[color:var(--color-link)]" : "bg-[color:var(--color-border)]"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
