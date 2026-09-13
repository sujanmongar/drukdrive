import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import { currentUser } from "../../../data/mockData";
import { routes } from "../../../lib/routes";
import { accountTabs } from "./_tabs";

export default function AccountProfileEdit() {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // No backend — simulate a save by returning to the account overview.
    navigate(routes.accountProfile);
  }

  return (
    <PageShell>
      <SecondaryTabs tabs={accountTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <h1 className="text-2xl font-bold text-[#222]">Edit Profile</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Update your personal information below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-xl rounded-xl border border-[color:var(--color-border)] bg-white p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]"
        >
          <div className="flex items-center gap-4 border-b border-[color:var(--color-border)] pb-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="size-16 rounded-full object-cover"
            />
            <div>
              <Button type="button" variant="secondary" size="sm">
                <Icon name="upload" size={14} />
                Change photo
              </Button>
              <p className="mt-1.5 text-xs text-[color:var(--color-muted)]">JPG or PNG, max 2MB.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#222]">Full name</span>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 focus-within:border-[#222]">
                <Icon name="user" size={16} className="shrink-0 text-[color:var(--color-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm text-[#222] outline-none"
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#222]">Email address</span>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 focus-within:border-[#222]">
                <Icon name="mail" size={16} className="shrink-0 text-[color:var(--color-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm text-[#222] outline-none"
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#222]">Phone number</span>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 focus-within:border-[#222]">
                <Icon name="phone" size={16} className="shrink-0 text-[color:var(--color-muted)]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm text-[#222] outline-none"
                  required
                />
              </div>
            </label>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button to={routes.accountProfile} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
