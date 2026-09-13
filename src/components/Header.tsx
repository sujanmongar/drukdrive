import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import { routes } from "../lib/routes";
import { currentUser } from "../data/mockData";
import { useAuth } from "../lib/auth";
import CurrencySwitcher from "./CurrencySwitcher";

const accountMenuLinks: { to: string; label: string; icon: IconName }[] = [
  { to: routes.accountBookings, label: "My bookings", icon: "car" },
  { to: routes.accountNotifications, label: "Notifications", icon: "bell" },
  { to: routes.accountReviews, label: "Reviews", icon: "star" },
  { to: routes.accountFinance, label: "Finance", icon: "wallet" },
  { to: routes.accountProfile, label: "Account", icon: "user" },
];

const providerLink = { to: routes.providerProfile, label: "Driver dashboard", icon: "car" as IconName };

// used by the mobile drawer, which still lists everything as plain links
const navLinks = accountMenuLinks;

function Logo() {
  return (
    <Link to={routes.home} className="flex items-center gap-2 shrink-0">
      <span className="flex size-8 items-center justify-center rounded-lg bg-[#222] text-white">
        <Icon name="car" size={18} />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-[#222]">DrukDrive</span>
    </Link>
  );
}

function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);

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
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white py-1.5 shadow-[0px_2px_14px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
              <img src={currentUser.avatar} alt="" className="size-9 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#222]">{currentUser.name}</p>
                <p className="truncate text-xs text-[color:var(--color-muted)]">{currentUser.email}</p>
              </div>
            </div>
            <div className="py-1">
              {accountMenuLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#333] hover:bg-neutral-50"
                >
                  <Icon name={l.icon} size={17} />
                  {l.label}
                </Link>
              ))}
              <Link
                to={providerLink.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 border-t border-[color:var(--color-border)] px-4 py-2.5 text-sm text-[#333] hover:bg-neutral-50"
              >
                <Icon name={providerLink.icon} size={17} />
                {providerLink.label}
              </Link>
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    logout();
    setMenuOpen(false);
    navigate(routes.home);
  }

  return (
    <header className="relative bg-white">
      {/* Desktop */}
      <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-[60px] py-[23px] md:flex">
        <Logo />
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                to={routes.accountNotifications}
                className="relative flex size-[42px] items-center justify-center rounded-xl hover:bg-neutral-100"
                aria-label="Notifications"
              >
                <Icon name="bell" size={20} />
                <span className="absolute right-[9px] top-[9px] flex size-[14px] items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[9px] font-medium text-white">
                  1
                </span>
              </Link>
              <AccountMenu onSignOut={handleSignOut} />
            </>
          ) : (
            <Link
              to={routes.signIn}
              className="flex h-[44px] items-center gap-2 rounded-full border border-[#e5ebf0] px-4 text-sm font-semibold text-[#222] hover:border-[#222]"
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
        <Link to={routes.home} className="text-xl font-extrabold tracking-tight text-[#222]">
          DrukDrive
        </Link>
        <div className="flex items-center gap-1">
          <CurrencySwitcher />
          {isLoggedIn ? (
            <Link
              to={routes.accountProfile}
              aria-label="Account"
              className="flex size-[28px] items-center justify-center rounded-full border-2 border-[#222]"
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
              <span className="text-lg font-extrabold text-[#222]">DrukDrive</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <Icon name="close" size={22} />
              </button>
            </div>
            {isLoggedIn ? (
              <>
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
                  <img src={currentUser.avatar} alt="" className="size-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">{currentUser.email}</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {[...navLinks, providerLink].map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-neutral-100 text-[#222]" : "text-[#333]"}`
                      }
                    >
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
                  className="flex items-center justify-center gap-2 rounded-full border border-[#222] px-4 py-3 text-sm font-semibold text-[#222]"
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
