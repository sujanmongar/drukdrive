import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import { currentUser } from "../../../data/mockData";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 3)}***@${domain}`;
}

const [defaultFirstName, ...defaultRest] = currentUser.name.split(" ");
const defaultLastName = defaultRest.join(" ");

export default function AccountProfileEdit() {
  usePageTitle("Edit profile");
  const navigate = useNavigate();
  const [first, setFirst] = useState(defaultFirstName);
  const [last, setLast] = useState(defaultLastName);

  function handleSave() {
    // No backend — simulate a save by returning to the account overview.
    navigate(routes.accountProfile);
  }

  const infoRows = [
    { label: "Gender", value: currentUser.gender },
    { label: "Email address", value: maskEmail(currentUser.email) },
    { label: "Phone number", value: currentUser.phone },
    { label: "Address", value: currentUser.address },
    { label: "Bio", value: currentUser.bio },
  ];

  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-[color:var(--color-muted)]">
              <Link to={routes.accountProfile} className="hover:text-[color:var(--color-ink)]">
                Account
              </Link>
              <Icon name="chevron-right" size={14} />
              <span>Personal info</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-[color:var(--color-ink)]">Personal Info</h2>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="mt-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-5">
            <div>
              <p className="text-sm font-semibold text-[color:var(--color-ink)]">Legal name</p>
              <p className="text-xs text-[color:var(--color-muted)]">
                This is the name on your travel document, which could be a license or a passport.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFirst(defaultFirstName);
                setLast(defaultLastName);
              }}
              className="shrink-0 text-sm font-medium text-[color:var(--color-ink)] underline"
            >
              Cancel
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[color:var(--color-muted)]">First name</span>
              <input
                type="text"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                className="rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm font-semibold text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-ink)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[color:var(--color-muted)]">Last name</span>
              <input
                type="text"
                value={last}
                onChange={(e) => setLast(e.target.value)}
                className="rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm font-semibold text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-ink)]"
              />
            </label>
          </div>

          <Button variant="primary" size="sm" className="mt-4" onClick={handleSave}>
            Save
          </Button>

          <div className="mt-2">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-[color:var(--color-border)] py-5"
              >
                <div>
                  <p className="text-xs font-medium text-[color:var(--color-muted)]">{row.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-[color:var(--color-ink)]">{row.value}</p>
                </div>
                <button type="button" className="shrink-0 text-sm font-medium text-[color:var(--color-ink)] underline">
                  Edit
                </button>
              </div>
            ))}
          </div>

          <Button variant="danger" size="sm" className="mt-8">
            Delete account
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
