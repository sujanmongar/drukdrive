import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { currentUser } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

const fields = [
  { label: "Full name", value: currentUser.name, icon: "user" as const },
  { label: "Email address", value: currentUser.email, icon: "mail" as const },
  { label: "Phone number", value: currentUser.phone, icon: "phone" as const },
  { label: "Reference ID", value: currentUser.referenceId, icon: "credit-card" as const },
];

export default function ProviderAccount() {
  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[900px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#222]">Account</h1>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              Your account details as they appear to riders and support.
            </p>
          </div>
          <Button to={routes.providerAccountEdit} variant="secondary">
            <Icon name="edit" size={16} />
            Edit
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <img src={currentUser.avatar} alt={currentUser.name} className="size-16 shrink-0 rounded-full object-cover" />
          <div>
            <p className="text-base font-bold text-[#222]">{currentUser.name}</p>
            <p className="text-sm text-[color:var(--color-muted)]">{currentUser.email}</p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <div className="divide-y divide-[color:var(--color-border)]">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center gap-4 px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef1f4] text-[#222]">
                  <Icon name={f.icon} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[color:var(--color-muted)]">{f.label}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-[#222]">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <h2 className="text-sm font-bold text-[#222]">Security</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[#222] hover:border-[#222]"
            >
              <Icon name="lock" size={16} />
              Change password
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-danger)] hover:border-[color:var(--color-danger)]"
            >
              <Icon name="logout" size={16} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
