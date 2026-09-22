import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import VehicleCard from "../../../components/VehicleCard";
import EmptyState from "../../../components/EmptyState";
import { vehicles } from "../../../data/mockData";
import { useWishlist } from "../../../lib/wishlist";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { Link } from "react-router-dom";
import { useAuth } from "../../../lib/auth";
import { routes } from "../../../lib/routes";
import { inlineLink } from "../../../lib/ui";

export default function AccountWishlist() {
  usePageTitle("Wishlist");
  const { ids } = useWishlist();
  const { isLoggedIn } = useAuth();
  const saved = vehicles.filter((v) => ids.includes(v.id));

  return (
    <PageShell>
      {isLoggedIn && (
        <>
          <ProfileHero />
          <div className="mt-6 md:mt-8">
            <SecondaryTabs tabs={accountTabs} />
          </div>
        </>
      )}

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <h2 className="t-h2">Wishlist</h2>
        <p className="mt-1 t-body-sm text-[color:var(--color-muted)]">
          {isLoggedIn ? (
            "Vehicles you've saved for later."
          ) : (
            <>
              Saved on this device.{" "}
              <Link to={routes.signIn} className={inlineLink}>
                Sign in
              </Link>{" "}
              to keep your list with your account.
            </>
          )}
        </p>

        {saved.length === 0 ? (
          <EmptyState
            icon="heart"
            title="No saved vehicles yet"
            description="Tap the heart icon on any vehicle to save it here for later."
          />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
