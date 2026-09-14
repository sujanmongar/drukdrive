import Icon from "./Icon";

const steps = ["Your Selection", "Details", "Final Step"];

export default function BookingStepper({ current, allDone = false }: { current: 1 | 2 | 3; allDone?: boolean }) {
  return (
    <div className="mx-auto flex max-w-md items-center justify-between px-2">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current || allDone;
        const active = stepNum === current && !allDone;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`t-caption flex size-8 items-center justify-center rounded-full border-2 font-bold transition-colors ${
                  done
                    ? "border-[color:var(--color-success)] bg-[color:var(--color-success)] text-white"
                    : active
                      ? "border-[color:var(--color-ink)] text-[color:var(--color-ink)]"
                      : "border-[color:var(--color-border)] text-[color:var(--color-muted)]"
                }`}
              >
                {done ? <Icon name="check" size={14} /> : stepNum}
              </div>
              <span
                className={`t-caption whitespace-nowrap font-medium ${
                  done || active ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-muted)]"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && (
              <div className={`mx-2 mb-4 h-0.5 flex-1 ${done ? "bg-[color:var(--color-success)]" : "bg-[color:var(--color-border)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
