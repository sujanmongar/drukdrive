import { useClientType } from "../lib/clientType";
import { useCurrency } from "../lib/currency";
import type { ClientType } from "../lib/booking";

const options: { value: ClientType; label: string }[] = [
  { value: "tourist", label: "I'm visiting" },
  { value: "local", label: "I live in Bhutan" },
];

// Resident or visitor. Changes currency, which fields the details step
// asks for, which add-ons are offered and how payment is explained.
export default function ClientTypeSwitch({
  className = "",
}: {
  className?: string;
}) {
  const { clientType, setClientType } = useClientType();
  const { setCurrency } = useCurrency();

  function choose(next: ClientType) {
    setClientType(next);
    // Visitors think in dollars, residents in ngultrum; the user can still
    // change it in the account menu afterwards.
    setCurrency(next === "local" ? "BTN" : "USD");
  }

  return (
    <div
      role="radiogroup"
      aria-label="Booking as"
      className={`inline-flex rounded-full bg-[color:var(--color-surface-soft)] p-1 ${className}`}
    >
      {options.map((o) => {
        const active = o.value === clientType;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => choose(o.value)}
            className={`rounded-full px-3.5 py-1.5 t-caption font-semibold transition-colors ${
              active
                ? "bg-white text-[color:var(--color-ink)] shadow-card"
                : "text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
