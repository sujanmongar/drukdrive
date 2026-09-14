import { Link } from "react-router-dom";
import { currencies, useCurrency } from "../lib/currency";
import { routes } from "../lib/routes";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", to: routes.about },
      { label: "Blog", to: routes.blog },
      { label: "Privacy", to: routes.privacyPolicy },
      { label: "Terms & Conditions", to: routes.termsOfService },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Help/FAQ", to: routes.help },
      { label: "Affiliates", to: routes.affiliates },
      { label: "Advertise with us", to: routes.advertise },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Rewards", to: routes.rewards },
      { label: "Partners", to: routes.partners },
    ],
  },
];

const bottomLinks = [
  { label: "Terms & Conditions", to: routes.termsOfService },
  { label: "Privacy Policy", to: routes.privacyPolicy },
  { label: "Refund Policy", to: routes.refundPolicy },
  { label: "Career", to: routes.careers },
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
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-10 px-6 py-10 md:grid-cols-5 md:px-10 md:py-12">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs text-white/70 hover:text-white hover:underline">
                    {l.label}
                  </Link>
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
          <div className="flex flex-1 items-center justify-between rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold">
            English
          </div>
          <button
            type="button"
            onClick={cycleCurrency}
            className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
          >
            {active.flag} {active.code}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/10 px-6 py-5 text-[11px] text-white/60 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {bottomLinks.map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-white hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
        <p>Copyright © 2024 - {new Date().getFullYear()} DrukDrive. All rights reserved.</p>
      </div>
    </footer>
  );
}
