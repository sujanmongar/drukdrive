import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { routes } from "../lib/routes";
import { currentUser } from "../data/mockData";
import { useAuth } from "../lib/auth";

const navLinks = [
  { to: routes.home, label: "Home" },
  { to: routes.accountBookings, label: "My bookings" },
  { to: routes.accountNotifications, label: "Notifications" },
  { to: routes.accountReviews, label: "Reviews" },
  { to: routes.accountFinance, label: "Finance" },
  { to: routes.accountProfile, label: "Account" },
];

const providerLink = { to: routes.providerProfile, label: "Driver dashboard" };

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
        {isLoggedIn && (
          <nav className="flex items-center gap-1 text-sm font-medium text-[#222]">
            {navLinks.slice(0, 4).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 hover:bg-neutral-100 ${isActive ? "bg-neutral-100" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
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
              <Link
                to={routes.accountProfile}
                className="flex h-[48px] items-center gap-2 rounded-xl px-3 hover:bg-neutral-100"
              >
                <img src={currentUser.avatar} alt="" className="size-7 rounded-full object-cover" />
                <span className="text-sm font-semibold">{currentUser.name.split(" ")[0]}</span>
                <Icon name="chevron-down" size={14} />
              </Link>
              <Link
                to={providerLink.to}
                className="rounded-xl border border-[#222] px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
              >
                Driver dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-[color:var(--color-danger)] hover:bg-neutral-50"
              >
                Sign out
              </button>
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
          <div className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium">
            <span className="text-base leading-none">🇧🇹</span>
            BTN
          </div>
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
