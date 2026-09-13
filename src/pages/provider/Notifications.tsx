import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import { driverNotifications } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProviderNotifications() {
  usePageTitle("Driver Notifications");
  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} reviewHref={routes.providerReviews} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h2 className="text-2xl font-bold text-[color:var(--color-ink)]">Notifications</h2>

        {driverNotifications.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] py-16 text-center">
            <Icon name="bell" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[color:var(--color-ink)]">You don&rsquo;t have any messages</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-[color:var(--color-border)]">
            {driverNotifications.map((n, i) => (
              <button
                key={n.id}
                type="button"
                className={`flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-neutral-50 ${
                  i !== 0 ? "border-t border-[color:var(--color-border)]" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-[color:var(--color-ink)]">{n.title}</p>
                  <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">{n.body}</p>
                </div>
                <Icon name="chevron-right" size={18} className="shrink-0 text-[color:var(--color-muted)]" />
              </button>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
