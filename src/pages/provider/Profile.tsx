import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { bookings, currentUser, driverVehicles, financeSummary, reviews } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

const avgRating = reviews.length
  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  : "0.0";

const tripsCompleted = bookings.filter((b) => b.status === "Completed").length;

const quickLinks = [
  { to: routes.providerBookings, label: "My Rides", icon: "car" as const, hint: `${bookings.length} total` },
  { to: routes.providerVehicles, label: "My Vehicles", icon: "plus" as const, hint: `${driverVehicles.length} registered` },
  { to: routes.providerFinance, label: "Finance", icon: "wallet" as const, hint: `$${financeSummary.totalEarnings} earned` },
  { to: routes.providerReviews, label: "Reviews", icon: "star" as const, hint: `${avgRating} avg. rating` },
];

export default function ProviderProfile() {
  const [email, setEmail] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [lookupResult, setLookupResult] = useState<"idle" | "found" | "not-found">("idle");

  function handleLookup(e: FormEvent) {
    e.preventDefault();
    const match =
      email.trim().toLowerCase() === currentUser.email.toLowerCase() &&
      referenceId.trim().toUpperCase() === currentUser.referenceId.toUpperCase();
    setLookupResult(match ? "found" : "not-found");
  }

  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        {/* Overview hero */}
        <div className="flex flex-col gap-6 rounded-xl border border-[color:var(--color-border)] bg-white p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="size-16 shrink-0 rounded-full object-cover sm:size-20"
            />
            <div>
              <h1 className="text-xl font-bold text-[#222] sm:text-2xl">{currentUser.name}</h1>
              <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">{currentUser.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <Icon name="star" size={16} className="fill-current text-amber-400" />
                <span className="text-sm font-bold text-[#222]">{avgRating}</span>
                <span className="text-xs text-[color:var(--color-muted)]">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>
          <Button to={routes.providerAccountEdit} variant="secondary">
            <Icon name="edit" size={16} />
            Edit profile
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">Trips completed</p>
            <p className="mt-1 text-2xl font-bold text-[#222]">{tripsCompleted}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">Vehicles</p>
            <p className="mt-1 text-2xl font-bold text-[#222]">{driverVehicles.length}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">Total earnings</p>
            <p className="mt-1 text-2xl font-bold text-[#222]">${financeSummary.totalEarnings}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">Reference ID</p>
            <p className="mt-1 truncate text-2xl font-bold text-[#222]">{currentUser.referenceId}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8">
          <h2 className="text-base font-bold text-[#222]">Quick links</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-colors hover:border-[#222]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef1f4] text-[#222]">
                  <Icon name={q.icon} size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#222]">{q.label}</p>
                  <p className="truncate text-xs text-[color:var(--color-muted)]">{q.hint}</p>
                </div>
                <Icon name="chevron-right" size={16} className="ml-auto shrink-0 text-[color:var(--color-muted)]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Reservation lookup */}
        <div className="mt-10 rounded-xl border border-[color:var(--color-border)] bg-white p-6 shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
          <h2 className="text-base font-bold text-[#222]">Look up a reservation</h2>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Use your email address and reference ID to view reservation details.
          </p>

          <form onSubmit={handleLookup} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#222]" htmlFor="lookup-email">
                Email address
              </label>
              <input
                id="lookup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm text-[#222] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[#222]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#222]" htmlFor="lookup-ref">
                Reference ID
              </label>
              <input
                id="lookup-ref"
                required
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="e.g. GI1671177263"
                className="w-full rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm text-[#222] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[#222] font-mono"
              />
            </div>
            <Button type="submit" variant="primary">
              Look up
            </Button>
          </form>

          {lookupResult === "found" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-[color:var(--color-success)]">
              <Icon name="check-circle" size={18} />
              Reservation found — matches {currentUser.name}'s account.
            </div>
          )}
          {lookupResult === "not-found" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-[color:var(--color-danger)]">
              <Icon name="info" size={18} />
              No reservation matches that email and reference ID.
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
