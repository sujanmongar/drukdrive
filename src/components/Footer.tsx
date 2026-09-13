import { currencies, useCurrency } from "../lib/currency";

const columns = [
  {
    title: "Company",
    links: ["About", "Blog", "Privacy", "Terms & Conditions"],
  },
  {
    title: "Contact",
    links: ["Help/FAQ", "Affiliates", "Advertise with us"],
  },
  {
    title: "More",
    links: ["Rewards", "Partners"],
  },
];

export default function Footer() {
  const { currency, setCurrency } = useCurrency();
  const active = currencies.find((c) => c.code === currency)!;

  function cycleCurrency() {
    const i = currencies.findIndex((c) => c.code === currency);
    setCurrency(currencies[(i + 1) % currencies.length].code);
  }

  return (
    <footer className="mt-auto bg-[#161616] text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-6 py-10 md:grid-cols-5 md:px-[60px] md:py-12">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l} className="text-xs text-white/70">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <p className="mb-3 text-sm font-semibold">Payment we accept</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {["VISA", "MC", "PayPal", "GPay"].map((p) => (
              <span
                key={p}
                className="flex h-8 items-center rounded bg-white px-2 text-[10px] font-bold text-[color:var(--color-ink)]"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="mb-3 text-sm font-semibold">Follow us</p>
          <div className="flex gap-2">
            {["FB", "IG", "TW", "LI", "YT"].map((s) => (
              <span
                key={s}
                className="flex size-8 items-center justify-center rounded-full border border-white/40 text-[10px]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex flex-row gap-3 md:col-span-1 md:flex-col">
          <button className="flex flex-1 items-center justify-between rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold">
            English
          </button>
          <button
            type="button"
            onClick={cycleCurrency}
            className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold"
          >
            {active.flag} {active.code}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-white/10 px-6 py-5 text-[11px] text-white/60 md:flex-row md:items-center md:justify-between md:px-[60px]">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
          <span>Refund Policy</span>
          <span>Career</span>
        </div>
        <p>Copyright © 2024 - {new Date().getFullYear()} DrukDrive. All rights reserved.</p>
      </div>
    </footer>
  );
}
