import { Navigate } from "react-router-dom";
import { routes } from "../../lib/routes";

// There's no standalone "Profile" tab in the driver dashboard, same as the
// customer side — the profile hero lives at the top of every tab. Bookings
// is the natural landing tab.
export default function ProviderProfile() {
  return <Navigate to={routes.providerBookings} replace />;
}
