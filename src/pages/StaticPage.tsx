import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";
import Button from "../components/Button";
import { card } from "../lib/ui";
import { staticPages } from "../data/staticPages";
import { routes } from "../lib/routes";
import { usePageTitle } from "../hooks/usePageTitle";
import { t } from "../lib/i18n";

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
  usePageTitle(content ? t(content.title) : "DrukDrive");

  if (!content) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[720px] px-4 py-16 text-center md:px-10">
          <h1 className="t-h2">{t("Page not found")}</h1>
          <Button variant="primary" size="lg" to={routes.home} className="mt-6">
            {t("Back to home")}
          </Button>
        </div>
      </PageShell>
    );
  }

  const icon = iconByPath[pathname] ?? "info";

  return (
    <PageShell>
      <div className="mx-auto max-w-[820px] px-4 py-10 md:px-10 md:py-14">
        <Button
          variant="link"
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <Icon name="arrow-left" size={16} />
          {t("Back")}
        </Button>

        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-info-bg)]">
            <Icon
              name={icon}
              size={22}
              className="text-[color:var(--color-info-text)]"
            />
          </span>
          <div>
            <h1 className="t-h2">{t(content.title)}</h1>
            <p className="mt-2 t-body-sm text-[color:var(--color-muted)]">
              {t(content.intro)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {content.sections.map((section) => (
            <div key={section.heading} className={`${card} p-5`}>
              <h2 className="mb-1.5 t-h4">{t(section.heading)}</h2>
              <p className="t-body-sm">{t(section.body)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-[color:var(--color-surface-subtle)] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
              {t("Still have questions?")}
            </p>
            <p className="mt-0.5 t-caption">
              {t(
                "Visit the Help & FAQ page, or head back and keep exploring DrukDrive.",
              )}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" to={routes.help}>
              {t("Help & FAQ")}
            </Button>
            <Button to={routes.home}>{t("Back to home")}</Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
