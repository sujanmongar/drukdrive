import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import DrukDriveLogo from "./DrukDriveLogo";
import { routes } from "../lib/routes";
import { useCurrentUser } from "../lib/currentUser";
import { useAuth } from "../lib/auth";
import type { Role } from "../lib/auth";
import PreferenceLists from "./PreferenceLists";
import NotificationsDropdown from "./NotificationsDropdown";
import { useWishlist } from "../lib/wishlist";
import Button from "./Button";
import { menu, menuItem } from "../lib/ui";

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
const switchTarget: Record<
  Role,
  { role: Role; label: string; to: string; icon: IconName }
> = {
  customer: {
    role: "driver",
    label: "Switch to Driving",
    to: routes.providerBookings,
    icon: "car",
  },
  driver: {
    role: "customer",
    label: "Switch to Riding",
    to: routes.home,
    icon: "user",
  },
};

// Shared shell for the header's icon controls, so wishlist / notifications /
// account all read as the same class of button.
export const headerControl = "icon-btn";

function WishlistButton({ compact = false }: { compact?: boolean }) {
  const { enabled, ids } = useWishlist();
  if (!enabled) return null;
  return (
    <Link
      to={routes.accountWishlist}
      aria-label="Wishlist"
      className={`relative ${headerControl} ${compact ? "size-10" : "size-[42px]"}`}
    >
      <Icon
        name="heart"
        size={20}
        className={
          ids.length > 0 ? "fill-current text-[color:var(--color-danger)]" : ""
        }
      />
      {ids.length > 0 && (
        <span
          className={`absolute -right-0.5 -top-0.5 flex ${compact ? "size-[15px]" : "size-[17px]"} items-center justify-center rounded-full bg-[color:var(--color-danger)] t-label text-white ring-2 ring-white`}
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
    <Link
      to={homeHref}
      aria-label="DrukDrive home"
      className="flex shrink-0 items-center"
    >
      <DrukDriveLogo className="h-7 w-auto text-[color:var(--color-ink)]" />
    </Link>
  );
}

function AccountMenu({
  onSignOut,
  compact = false,
}: {
  onSignOut: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useCurrentUser();
  const { isLoggedIn, role, switchRole } = useAuth();
  const navigate = useNavigate();
  // The menu is a shortcut, not the full tab bar: bookings and account only.
  const links = (role === "driver" ? driverLinks : customerLinks).filter((l) =>
    /Bookings|Account/.test(l.label),
  );
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
        aria-label="Account menu"
        className={`icon-btn icon-btn-avatar overflow-hidden ${compact ? "size-10" : "size-[42px]"}`}
      >
        {isLoggedIn ? (
          <img
            src={currentUser.avatar}
            alt=""
            className="size-full rounded-full object-cover"
          />
        ) : (
          <Icon
            name="user"
            size={20}
            className="fill-current"
            strokeWidth={1.4}
          />
        )}
      </button>

      {open && (
        <>
          <button
            aria-label="Close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute right-0 top-full z-50 mt-2 max-h-[80svh] w-64 overflow-y-auto ${menu}`}
          >
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="size-9 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate t-body-sm font-semibold text-[color:var(--color-ink)]">
                      {currentUser.name}
                    </p>
                    <p className="truncate t-caption">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSwitch}
                  className={`${menuItem} border-b border-[color:var(--color-border)] font-semibold`}
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
                      className={menuItem}
                    >
                      <Icon name={l.icon} size={17} />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              // The click bubbles up from the link, so the menu closes even
              // when the sign-in page is the one already open.
              <div
                className="border-b border-[color:var(--color-border)] p-3"
                onClick={() => setOpen(false)}
              >
                <Button to={routes.signIn} fullWidth>
                  <Icon name="user" size={16} />
                  Login / Signup
                </Button>
              </div>
            )}

            <div className="border-t border-[color:var(--color-border)] pb-1">
              <PreferenceLists />
            </div>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className={`${menuItem} border-t border-[color:var(--color-border)] font-semibold text-[color:var(--color-danger)]!`}
              >
                <Icon name="logout" size={17} />
                Sign out
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({
  transparent = false,
  sticky = false,
}: {
  transparent?: boolean;
  sticky?: boolean;
}) {
  const { isLoggedIn, logout, role } = useAuth();
  const navigate = useNavigate();
  const homeHref = role === "driver" ? routes.providerBookings : routes.home;

  function handleSignOut() {
    logout();
    navigate(routes.home);
  }

  return (
    <header
      className={`z-30 ${transparent ? "bg-transparent" : "bg-white"} ${
        sticky
          ? "sticky top-0 border-b border-[color:var(--color-border)] bg-white"
          : "relative"
      }`}
    >
      {/* Desktop */}
      <div className="hidden items-center justify-between px-6 py-[23px] md:flex lg:px-10">
        <Logo />
        <div className="flex items-center gap-2.5">
          <WishlistButton />
          {isLoggedIn && (
            <NotificationsDropdown
              role={role}
              viewAllHref={
                role === "driver"
                  ? routes.providerNotifications
                  : routes.accountNotifications
              }
            />
          )}
          <AccountMenu onSignOut={handleSignOut} />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-[64px] items-center justify-between px-4 md:hidden">
        <Link
          to={homeHref}
          aria-label="DrukDrive home"
          className="-ml-2 flex min-h-11 items-center px-2"
        >
          <DrukDriveLogo className="h-5 w-auto text-[color:var(--color-ink)]" />
        </Link>
        <div className="flex items-center gap-3">
          <WishlistButton compact />
          <AccountMenu onSignOut={handleSignOut} compact />
        </div>
      </div>
    </header>
  );
}
