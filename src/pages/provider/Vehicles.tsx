import { useState } from "react";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import VehicleImage from "../../components/VehicleImage";
import { driverVehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

export default function ProviderVehicles() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} reviewHref={routes.providerReviews} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#222]">My Vehicle</h2>
          <Button to={routes.providerVehicleAdd} variant="primary" size="sm">
            Add new
          </Button>
        </div>

        {driverVehicles.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] py-16 text-center">
            <Icon name="car" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[#222]">No vehicles added yet</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {driverVehicles.map((v) => (
              <div
                key={v.id}
                className="relative flex w-full items-center gap-4 rounded-xl border border-[color:var(--color-border)] p-4 sm:w-[380px]"
              >
                <VehicleImage vehicleId={v.id} category={v.category} className="size-14 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#222]">{v.name}</p>
                  <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">Available from: Sat 12 Dec&rsquo; 22, 10:00</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenMenu((cur) => (cur === v.id ? null : v.id))}
                  aria-label="Vehicle options"
                  className="shrink-0 rounded-full p-1.5 hover:bg-neutral-100"
                >
                  <Icon name="more" size={18} className="text-[color:var(--color-muted)]" />
                </button>

                {openMenu === v.id && (
                  <>
                    <button
                      aria-label="Close"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="absolute right-4 top-14 z-40 w-40 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white py-1 shadow-[0px_2px_14px_rgba(0,0,0,0.1)]">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#333] hover:bg-neutral-50"
                        onClick={() => setOpenMenu(null)}
                      >
                        <Icon name="edit" size={15} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[color:var(--color-danger)] hover:bg-neutral-50"
                        onClick={() => setOpenMenu(null)}
                      >
                        <Icon name="trash" size={15} />
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
