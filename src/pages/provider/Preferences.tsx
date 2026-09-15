import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import GlobalPreferences from "../../components/GlobalPreferences";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProviderPreferences() {
  usePageTitle("Global preferences");
  const navigate = useNavigate();

  return (
    <PageShell>
      <ProfileHero
        editHref={routes.providerAccountEdit}
        reviewHref={routes.providerReviews}
      />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-[color:var(--color-muted)]">
              <Link
                to={routes.providerAccount}
                className="inline-flex min-h-11 items-center hover:text-[color:var(--color-ink)]"
              >
                Account
              </Link>
              <Icon name="chevron-right" size={14} />
              <span>Global preferences</span>
            </div>
            <h2 className="t-h2 mt-1 text-[color:var(--color-ink)]">
              Global preferences
            </h2>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <GlobalPreferences />
      </div>
    </PageShell>
  );
}
