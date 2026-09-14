import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import DrukDriveLogo from "./DrukDriveLogo";
import { routes } from "../lib/routes";
import { useCurrentUser } from "../lib/currentUser";
import { useAuth } from "../lib/auth";
import type { Role } from "../lib/auth";
import CurrencySwitcher from "./CurrencySwitcher";
import NotificationsDropdown from "./NotificationsDropdown";
import { useWishlist } from "../lib/wishlist";

const customerLinks: { to: string; label: string; icon: IconName }[] = [
  { to: routes.accountBookings, label: "Bookings", icon: "car" },
  { to: routes.accountWishlist, label: "Wishlist", icon: "heart" },
  { to: routes.accountNotifications, label: "Notifications", icon: "bell" },
  { to: routes.accountReviews, label: "Reviews", icon: "star" },
  { to: routes.accountFinance, label: "Finance", icon: "wallet" },
  { to: routes.accountProfile, label: "Account", icon: "user" },
];

const driverLinks: { to: string; label: string; icon: IconName }[] = [
  { to: routes.providerBookings, label: "Bookings", icon: "car" },
  { to: routes.providerNotifications, label: "Notifications", icon: "bell" },
  { to: routes.providerReviews, label: "Reviews", icon: "star" },
  { to: routes.providerVehicles, label: "My Vehicle", icon: "car" },
  { to: routes.providerFinance, label: "Finance", icon: "wallet" },
  { to: routes.providerAccount, label: "Account", icon: "user" },
];

// Airbnb-style "switch to hosting" — DrukDrive's rider/driver equivalent.
const switchTarget: Record<Role, { role: Role; label: string; to: string; icon: IconName }> = {
  customer: { role: "driver", label: "Switch to Driving", to: routes.providerBookings, icon: "car" },
  driver: { role: "customer", label: "Switch to Riding", to: routes.home, icon: "user" },
};

function WishlistButton({ compact = false }: { compact?: boolean }) {
  const { ids } = useWishlist();
  return (
    <Link
      to={routes.accountWishlist}
      aria-label="Wishlist"
      className={`relative flex items-center justify-center rounded-xl hover:bg-neutral-100 ${compact ? "size-9" : "size-[42px]"}`}
    >
      <Icon name="heart" size={compact ? 18 : 20} />
      {ids.length > 0 && (
        <span
          className={`absolute flex items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[9px] font-medium text-white ${
            compact ? "right-0.5 top-0.5 size-[13px]" : "right-[9px] top-[9px] size-[14px]"
          }`}
        >
          {ids.length}
        </span>
      )}
    </Link>
  );
}

function Logo() {
  const { role } = useAuth();
  const homeHref = role === "driver" ? routes.providerBookings : routes.home;
  return (
    <Link to={homeHref} className="flex shrink-0 items-center">
      <DrukDriveLogo className="h-7 w-auto text-[color:var(--color-ink)]" />
    </Link>
  );
}

function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useCurrentUser();
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();
  const links = role === "driver" ? driverLinks : customerLinks;
  const target = switchTarget[role];

  function handleSwitch() {
    switchRole(target.role);
    setOpen(false);
    navigate(target.to);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[48px] items-center gap-2 rounded-xl px-3 hover:bg-neutral-100"
      >
        <img src={currentUser.avatar} alt="" className="size-7 rounded-full object-cover" />
        <span className="text-sm font-semibold">{currentUser.name.split(" ")[0]}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      {open && (
        <>
          <button aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white py-1.5 shadow-[0px_2px_14px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
              <img src={currentUser.avatar} alt="" className="size-9 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[color:var(--color-ink)]">{currentUser.name}</p>
                <p className="truncate text-xs text-[color:var(--color-muted)]">{currentUser.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSwitch}
              className="flex w-full items-center gap-2.5 border-b border-[color:var(--color-border)] px-4 py-3 text-left text-sm font-semibold text-[color:var(--color-ink)] hover:bg-neutral-50"
            >
              <Icon name={target.icon} size={17} />
              {target.label}
            </button>

            <div className="py-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[color:var(--color-ink-soft)] hover:bg-neutral-50"
                >
                  <Icon name={l.icon} size={17} />
                  {l.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-2.5 border-t border-[color:var(--color-border)] px-4 py-2.5 text-left text-sm font-semibold text-[color:var(--color-danger)] hover:bg-neutral-50"
            >
              <Icon name="logout" size={17} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user: currentUser } = useCurrentUser();
  const { isLoggedIn, logout, role } = useAuth();
  const navigate = useNavigate();
  const links = role === "driver" ? driverLinks : customerLinks;
  const homeHref = role === "driver" ? routes.providerBookings : routes.home;

  function handleSignOut() {
    logout();
    setMenuOpen(false);
    navigate(routes.home);
  }

  return (
    <header className={`relative z-20 ${transparent ? "bg-transparent" : "bg-white"}`}>
      {/* Desktop */}
      <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-[60px] py-[23px] md:flex">
        <Logo />
        <div className="flex items-center gap-2">
          {role === "customer" && <WishlistButton />}
          {isLoggedIn ? (
            <>
              <NotificationsDropdown
                role={role}
                viewAllHref={role === "driver" ? routes.providerNotifications : routes.accountNotifications}
              />
              <AccountMenu onSignOut={handleSignOut} />
            </>
          ) : (
            <Link
              to={routes.signIn}
              className="flex h-[44px] items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-4 text-sm font-semibold text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            >
              <Icon name="user" size={16} />
              Login / Signup
            </Link>
          )}
          <CurrencySwitcher />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-[64px] items-center justify-between px-4 md:hidden">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex size-9 items-center justify-center"
        >
          <Icon name="menu" size={24} />
        </button>
        <Link to={homeHref} className="flex items-center">
          <DrukDriveLogo className="h-5 w-auto text-[color:var(--color-ink)]" />
        </Link>
        <div className="flex items-center gap-1">
          {role === "customer" && <WishlistButton compact />}
          <CurrencySwitcher />
          {isLoggedIn ? (
            <Link
              to={role === "driver" ? routes.providerAccount : routes.accountProfile}
              aria-label="Account"
              className="flex size-[28px] items-center justify-center rounded-full border-2 border-[color:var(--color-ink)] bg-white"
            >
              <Icon name="user" size={14} />
            </Link>
          ) : (
            <Link to={routes.signIn} aria-label="Login / Signup" className="flex size-9 items-center justify-center">
              <Icon name="user" size={20} />
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[78%] max-w-[320px] bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <DrukDriveLogo className="h-5 w-auto text-[color:var(--color-ink)]" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <Icon name="close" size={22} />
              </button>
            </div>
            {isLoggedIn ? (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
                  <img src={currentUser.avatar} alt="" className="size-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">{currentUser.email}</p>
                  </div>
                </div>
                <MobileSwitchButton onNavigated={() => setMenuOpen(false)} />
                <nav className="mt-2 flex flex-col gap-1">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-neutral-100 text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)]"}`
                      }
                    >
                      <Icon name={l.icon} size={17} />
                      {l.label}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[color:var(--color-danger)]"
                  >
                    Sign out
                  </button>
                </nav>
              </>
            ) : (
              <>
                <p className="mb-4 text-sm text-[color:var(--color-muted)]">
                  Sign in to book a ride, manage your bookings, or drive with DrukDrive.
                </p>
                <Link
                  to={routes.signIn}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-ink)] px-4 py-3 text-sm font-semibold text-[color:var(--color-ink)]"
                >
                  <Icon name="user" size={16} />
                  Login / Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileSwitchButton({ onNavigated }: { onNavigated: () => void }) {
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();
  const target = switchTarget[role];

  return (
    <button
      type="button"
      onClick={() => {
        switchRole(target.role);
        onNavigated();
        navigate(target.to);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-ink)]"
    >
      <Icon name={target.icon} size={16} />
      {target.label}
    </button>
  );
}
