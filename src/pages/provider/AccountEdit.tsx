import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { currentUser } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

const inputClasses =
  "w-full rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm text-[#222] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[#222]";
const labelClasses = "mb-1.5 block text-xs font-semibold text-[#222]";

export default function ProviderAccountEdit() {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // No backend — simulate a save and return to the account overview.
    navigate(routes.providerAccount);
  }

  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[720px] px-4 py-8 md:px-[60px] md:py-10">
        <button
          type="button"
          onClick={() => navigate(routes.providerAccount)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-muted)] hover:text-[#222]"
        >
          <Icon name="arrow-left" size={16} />
          Back to Account
        </button>

        <h1 className="mt-4 text-2xl font-bold text-[#222]">Edit Account</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Update your personal details. Your reference ID cannot be changed.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-5 rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] sm:p-6"
        >
          <div className="flex items-center gap-4">
            <img src={avatar} alt={name} className="size-16 shrink-0 rounded-full object-cover" />
            <label
              htmlFor="avatar"
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[#222] hover:border-[#222]"
            >
              <Icon name="upload" size={16} />
              Change photo
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAvatar(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          <div>
            <label className={labelClasses} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="referenceId">
              Reference ID
            </label>
            <input
              id="referenceId"
              disabled
              value={currentUser.referenceId}
              className={`${inputClasses} cursor-not-allowed bg-neutral-50 font-mono text-[color:var(--color-muted)]`}
            />
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate(routes.providerAccount)}>
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
