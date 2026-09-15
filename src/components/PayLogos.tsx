// Small brand marks for the payment page. Drawn inline (no brand SVG
// assets in the repo) with each brand's colours, so they read as logos
// without shipping images.

export function VisaMark() {
  return (
    <span
      className="inline-flex h-6 items-center rounded-[4px] border border-[color:var(--color-border)] bg-white px-1.5 text-[11px] font-black italic tracking-tight text-[#1a1f71]"
      aria-label="Visa"
    >
      VISA
    </span>
  );
}

export function MastercardMark() {
  return (
    <span
      className="inline-flex h-6 items-center rounded-[4px] border border-[color:var(--color-border)] bg-white px-1.5"
      aria-label="Mastercard"
    >
      <span className="size-3.5 rounded-full bg-[#eb001b]" />
      <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] opacity-90" />
    </span>
  );
}

export function AmexMark() {
  return (
    <span
      className="inline-flex h-6 items-center rounded-[4px] bg-[#016fd0] px-1.5 text-[10px] font-black tracking-wide text-white"
      aria-label="American Express"
    >
      AMEX
    </span>
  );
}

export function PayPalMark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return (
    <span
      className={`inline-flex items-baseline font-black italic tracking-tight ${cls}`}
      aria-label="PayPal"
    >
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009cde]">Pal</span>
    </span>
  );
}

const bankColours: Record<string, string> = {
  BoB: "#0b5fb3",
  BNB: "#c8102e",
  DPNB: "#ff7a00",
  TB: "#0d6b3f",
};

export function BankMark({ short }: { short: string }) {
  return (
    <span
      className="inline-flex h-6 min-w-8 items-center justify-center rounded-[4px] px-1.5 text-[10px] font-black tracking-wide text-white"
      style={{ backgroundColor: bankColours[short] ?? "#333" }}
      aria-label={short}
    >
      {short}
    </span>
  );
}
