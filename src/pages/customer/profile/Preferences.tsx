import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import GlobalPreferences from "../../../components/GlobalPreferences";
import { routes } from "../../../lib/routes";
import { quietLink } from "../../../lib/ui";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";

export default function AccountPreferences() {
  usePageTitle("Global preferences");
  const navigate = useNavigate();

  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 t-body-sm text-[color:var(--color-muted)]">
              <Link
                to={routes.accountProfile}
                className={`inline-flex min-h-11 items-center ${quietLink}`}
              >
                Account
              </Link>
              <Icon name="chevron-right" size={14} />
              <span>Global preferences</span>
            </div>
            <h2 className="mt-1 t-h2">Global preferences</h2>
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
