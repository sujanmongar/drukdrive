import PageShell from "../../../components/PageShell";
import SecondaryTabs from "../../../components/SecondaryTabs";
import ProfileHero from "../../../components/ProfileHero";
import VehicleCard from "../../../components/VehicleCard";
import Icon from "../../../components/Icon";
import { vehicles } from "../../../data/mockData";
import { useWishlist } from "../../../lib/wishlist";
import { accountTabs } from "./_tabs";
import { usePageTitle } from "../../../hooks/usePageTitle";

export default function AccountWishlist() {
  usePageTitle("Wishlist");
  const { ids } = useWishlist();
  const saved = vehicles.filter((v) => ids.includes(v.id));

  return (
    <PageShell>
      <ProfileHero />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={accountTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <h2 className="t-h2 text-[color:var(--color-ink)]">Wishlist</h2>
        <p className="mt-1 t-body-sm text-[color:var(--color-muted)]">
          Vehicles you've saved for later.
        </p>

        {saved.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[color:var(--color-border)] py-16 text-center">
            <Icon
              name="heart"
              size={32}
              className="text-[color:var(--color-muted)]"
            />
            <p className="mt-3 t-body-sm font-semibold text-[color:var(--color-ink)]">
              No saved vehicles yet
            </p>
            <p className="mt-1 max-w-xs t-body-sm text-[color:var(--color-muted)]">
              Tap the heart icon on any vehicle to save it here for later.
            </p>
          </div>
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
