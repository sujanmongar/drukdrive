import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import type { IconName } from "../../../components/Icon";
import { currentUser } from "../../../data/mockData";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";

const settingsRows: { icon: IconName; label: string; hint: string }[] = [
  { icon: "credit-card", label: "Payment methods", hint: "Visa •••• 4821" },
  { icon: "bell", label: "Notification preferences", hint: "Email & SMS" },
  { icon: "lock", label: "Password & security", hint: "Last changed 3 months ago" },
  { icon: "info", label: "Language", hint: "English" },
];

export default function AccountProfile() {
  return (
    <PageShell>
      <SecondaryTabs tabs={accountTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h1 className="text-2xl font-bold text-[#222]">Account</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Manage your personal information and preferences.
        </p>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row">
          {/* Profile card */}
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-white p-6 text-center shadow-[0px_1px_3px_rgba(25,32,36,0.16)] lg:w-[320px] lg:shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="size-24 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-bold text-[#222]">{currentUser.name}</p>
              <p className="text-xs text-[color:var(--color-muted)]">Ref ID: {currentUser.referenceId}</p>
            </div>

            <div className="flex w-full flex-col gap-2 border-t border-[color:var(--color-border)] pt-4 text-left">
              <div className="flex items-center gap-2 text-sm text-[#333]">
                <Icon name="mail" size={15} className="shrink-0 text-[color:var(--color-muted)]" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#333]">
                <Icon name="phone" size={15} className="shrink-0 text-[color:var(--color-muted)]" />
                <span className="truncate">{currentUser.phone}</span>
              </div>
            </div>

            <Button to={routes.accountProfileEdit} variant="secondary" size="sm" fullWidth>
              <Icon name="edit" size={14} />
              Edit Profile
            </Button>
          </div>

          {/* Settings rows */}
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            {settingsRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center gap-3 px-5 py-4 ${
                  i !== settingsRows.length - 1 ? "border-b border-[color:var(--color-border)]" : ""
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4]">
                  <Icon name={row.icon} size={16} className="text-[#222]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#222]">{row.label}</p>
                  <p className="text-xs text-[color:var(--color-muted)]">{row.hint}</p>
                </div>
                <Icon name="chevron-right" size={16} className="shrink-0 text-[color:var(--color-muted)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
