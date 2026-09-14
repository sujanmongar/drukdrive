import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";
import Button from "../components/Button";
import { staticPages } from "../data/staticPages";
import { routes } from "../lib/routes";
import { usePageTitle } from "../hooks/usePageTitle";

const iconByPath: Record<string, IconName> = {
  "/about": "car",
  "/blog": "edit",
  "/legal/privacy": "lock",
  "/legal/terms": "check-circle",
  "/legal/user-agreement": "user",
  "/legal/refund-policy": "wallet",
  "/help": "info",
  "/affiliates": "star",
  "/advertise": "search",
  "/rewards": "star",
  "/partners": "user",
  "/careers": "mail",
};

export default function StaticPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const content = staticPages[pathname];
  usePageTitle(content?.title ?? "DrukDrive");

  if (!content) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[720px] px-4 py-16 text-center md:px-10">
          <h1 className="t-h2 text-[color:var(--color-ink)]">Page not found</h1>
          <Button variant="primary" size="lg" to={routes.home} className="mt-6">
            Back to home
          </Button>
        </div>
      </PageShell>
    );
  }

  const icon = iconByPath[pathname] ?? "info";

  return (
    <PageShell>
      <div className="mx-auto max-w-[820px] px-4 py-10 md:px-10 md:py-14">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:underline"
        >
          <Icon name="arrow-left" size={16} />
          Back
        </button>

        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-info-bg)]">
            <Icon name={icon} size={22} className="text-[color:var(--color-info-text)]" />
          </span>
          <div>
            <h1 className="t-h2 text-[color:var(--color-ink)]">{content.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">{content.intro}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {content.sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-2xl border border-[color:var(--color-border)] p-5 shadow-[var(--shadow-card)]"
            >
              <h2 className="mb-1.5 text-base font-bold text-[color:var(--color-ink)]">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-[color:var(--color-ink-soft)]">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold text-[color:var(--color-ink)]">Still have questions?</p>
            <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">
              Visit the Help & FAQ page, or head back and keep exploring DrukDrive.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" size="sm" to={routes.help}>
              Help &amp; FAQ
            </Button>
            <Button variant="primary" size="sm" to={routes.home}>
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
