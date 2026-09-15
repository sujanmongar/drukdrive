import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

const baseSteps = ["Search", "Review", "Details", "Payment", "Confirmation"];

// Numbered discs with the label beside each and a short rule between —
// centred on every width. A completed step is a link back to that page
// (with the booking preserved in the URL), so it can be revisited and the
// flow continued from there.
export default function BookingStepper({
  current,
  allDone = false,
  hrefs = [],
  detailsLabel = "Your details",
}: {
  current: 1 | 2 | 3 | 4 | 5;
  allDone?: boolean;
  /** Link for each step by index; only completed steps become clickable. */
  hrefs?: (string | undefined)[];
  /** The details step is named for who is being described: the booker, or the driver on self drive. */
  detailsLabel?: string;
}) {
  const steps = baseSteps.map((l) => (l === "Details" ? detailsLabel : l));
  const wrapRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  // When the strip is wider than the screen, start with the current step in
  // view (centred) rather than at the first step.
  useEffect(() => {
    // Centre the current step's disc-and-label (not its trailing rule).
    // Runs after paint and again shortly after, in case fonts or the page
    // entrance shift the layout.
    const centre = () => {
      const wrap = wrapRef.current;
      const li = activeRef.current;
      if (!wrap || !li || wrap.scrollWidth <= wrap.clientWidth) return;
      const target = li.firstElementChild ?? li;
      const w = wrap.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const delta = r.left + r.width / 2 - (w.left + w.width / 2);
      wrap.scrollLeft += delta;
    };
    const raf = requestAnimationFrame(centre);
    const t = window.setTimeout(centre, 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [current]);

  return (
    <div
      ref={wrapRef}
      className="scrollbar-hide -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
    >
      <ol
        className="mx-auto flex w-max items-center gap-2 sm:gap-4"
        aria-label="Booking progress"
      >
        <li aria-hidden className="w-[calc(50vw-4rem)] shrink-0 md:hidden" />
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
              ref={active ? activeRef : undefined}
              aria-current={active ? "step" : undefined}
              className="flex shrink-0 items-center gap-2 sm:gap-4"
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
                  className="h-px w-8 bg-[color:var(--color-border)] sm:w-14"
                />
              )}
            </li>
          );
        })}
        <li aria-hidden className="w-[calc(50vw-4rem)] shrink-0 md:hidden" />
      </ol>
    </div>
  );
}
