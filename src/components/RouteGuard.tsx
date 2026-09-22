import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "../lib/auth";
import { routes } from "../lib/routes";

// Wraps a route's element: requires the visitor to be signed in, and (when
// `role` is given) requires they currently be in that role — a driver who
// types /account/... into the URL bar is sent back to their own dashboard
// rather than seeing the customer UI while "in driver mode," and vice versa.
export default function RouteGuard({
  role,
  allowGuest = false,
  children,
}: {
  role?: Role;
  /** Signed-out visitors may see the page too (the wishlist). */
  allowGuest?: boolean;
  children: ReactNode;
}) {
  const { isLoggedIn, role: currentRole } = useAuth();

  if (!isLoggedIn) {
    if (allowGuest) return <>{children}</>;
    return <Navigate to={routes.signIn} replace />;
  }

  if (role && currentRole !== role) {
    return (
      <Navigate
        to={currentRole === "driver" ? routes.providerBookings : routes.home}
        replace
      />
    );
  }

  return <>{children}</>;
}
