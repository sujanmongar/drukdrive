import { routes } from "../../lib/routes";
import type { SecondaryTab } from "../../components/SecondaryTabs";

// Shared sub-nav for every service-provider (driver) dashboard page —
// mirrors the customer account tabs, with "My Vehicle" in place of Finance's
// position for the driver's own listed vehicle(s).
export const providerTabs: SecondaryTab[] = [
  { to: routes.providerBookings, label: "Bookings", icon: "car" },
  { to: routes.providerReviews, label: "Reviews", icon: "star" },
  { to: routes.providerVehicles, label: "My Vehicle", icon: "car" },
  { to: routes.providerFinance, label: "Finance", icon: "wallet" },
  { to: routes.providerAccount, label: "Account", icon: "user" },
];
