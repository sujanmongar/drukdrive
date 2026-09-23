import { routes } from "../../lib/routes";
import type { SecondaryTab } from "../../components/SecondaryTabs";
import { tx } from "../../lib/i18n";

// Shared sub-nav for every service-provider (driver) dashboard page —
// mirrors the customer account tabs, with "My Vehicle" in place of Finance's
// position for the driver's own listed vehicle(s).
export const providerTabs: SecondaryTab[] = [
  { to: routes.providerBookings, label: tx("Bookings"), icon: "car" },
  { to: routes.providerReviews, label: tx("Reviews"), icon: "star" },
  { to: routes.providerVehicles, label: tx("My Vehicle"), icon: "car" },
  { to: routes.providerFinance, label: tx("Finance"), icon: "wallet" },
  { to: routes.providerAccount, label: tx("Account"), icon: "user" },
];
