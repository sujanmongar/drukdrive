import { Link } from "react-router-dom";
import DrukDriveLogo from "./DrukDriveLogo";
import Icon from "./Icon";
import SocialIcon, { type SocialName } from "./SocialIcon";
import { currencies, useCurrency } from "../lib/currency";
import { languages, useLanguage } from "../lib/language";
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
      { label: "Career", to: routes.careers },
    ],
  },
];

const socialUrls: Record<SocialName, string> = {
  facebook: "https://www.facebook.com/drukdrive",
  instagram: "https://www.instagram.com/drukdrive",
  x: "https://x.com/drukdrive",
  linkedin: "https://www.linkedin.com/company/drukdrive",
  youtube: "https://www.youtube.com/@drukdrive",
};

const socials: { name: SocialName; label: string }[] = [
  { name: "facebook", label: "Facebook" },
  { name: "instagram", label: "Instagram" },
  { name: "x", label: "X" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "youtube", label: "YouTube" },
];

const bottomLinks = [
  { label: "Terms & Conditions", to: routes.termsOfService },
  { label: "Privacy Policy", to: routes.privacyPolicy },
  { label: "Refund Policy", to: routes.refundPolicy },
];

export default function Footer() {
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();

  const selectClass =
    "w-full cursor-pointer appearance-none rounded-xl border border-white/25 bg-transparent px-4 py-3 t-body-sm font-semibold text-white outline-none transition-colors hover:border-white/60 focus-visible:border-white";

  return (
    <footer className="mt-auto bg-[#161616] text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <Link
              to={routes.home}
              aria-label="DrukDrive home"
              className="-m-2 inline-flex p-2"
            >
              <DrukDriveLogo className="h-7 w-auto text-white" />
            </Link>
            <p className="t-body-sm mt-4 max-w-[280px] text-white/60">
              Compare and book vehicles from trusted local operators across
              Bhutan.
            </p>

            <p className="t-caption mb-3 mt-7 font-semibold uppercase tracking-wide text-white/50">
              Follow us
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={socialUrls[s.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-[color:var(--color-ink)]"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="t-caption mb-3 font-semibold uppercase tracking-wide text-white/50">
                {col.title}
              </p>
              <ul className="flex flex-col">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="t-body-sm -ml-1 inline-flex min-h-11 items-center rounded-lg px-1 text-white/75 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-1">
            <p className="t-caption mb-3 font-semibold uppercase tracking-wide text-white/50">
              Preferences
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="relative">
                <select
                  aria-label="Language"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as typeof language)
                  }
                  className={selectClass}
                >
                  {languages.map((l) => (
                    <option
                      key={l.code}
                      value={l.code}
                      className="text-[color:var(--color-ink)]"
                    >
                      {l.native}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                />
              </div>
              <div className="relative">
                <select
                  aria-label="Currency"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as typeof currency)
                  }
                  className={selectClass}
                >
                  {currencies.map((c) => (
                    <option
                      key={c.code}
                      value={c.code}
                      className="text-[color:var(--color-ink)]"
                    >
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                />
              </div>
            </div>

            <p className="t-caption mb-3 mt-7 font-semibold uppercase tracking-wide text-white/50">
              We accept
            </p>
            <div className="flex flex-wrap gap-2">
              {["VISA", "MC", "PayPal", "GPay"].map((p) => (
                <span
                  key={p}
                  className="flex h-8 items-center rounded-lg bg-white px-2.5 t-label font-bold text-[color:var(--color-ink)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/10 px-6 py-5 t-label text-white/55 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-wrap gap-x-2">
          {bottomLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="-ml-2 inline-flex min-h-11 items-center px-2 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p>© 2024–{new Date().getFullYear()} DrukDrive. All rights reserved.</p>
      </div>
    </footer>
  );
}
