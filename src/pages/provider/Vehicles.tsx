import { useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import VehicleImage from "../../components/VehicleImage";
import { useDriverVehicles } from "../../lib/driverVehicles";
import { vehicleClassOf } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { useCurrency } from "../../lib/currency";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProviderVehicles() {
  usePageTitle("My Vehicle");
  const { vehicles: driverVehicles, removeVehicle } = useDriverVehicles();
  const { format } = useCurrency();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function handleRemove(id: string, name: string) {
    setOpenMenu(null);
    if (window.confirm(`Remove ${name} from your fleet?`)) {
      removeVehicle(id);
    }
  }

  return (
    <PageShell>
      <ProfileHero
        editHref={routes.providerAccountEdit}
        reviewHref={routes.providerReviews}
      />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="t-h2 text-[color:var(--color-ink)]">My Vehicle</h2>
          <Button to={routes.providerVehicleAdd} variant="primary" size="sm">
            Add new
          </Button>
        </div>

        {driverVehicles.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[color:var(--color-border)] py-16 text-center">
            <Icon
              name="car"
              size={32}
              className="text-[color:var(--color-muted)]"
            />
            <p className="mt-3 t-body-sm font-semibold text-[color:var(--color-ink)]">
              No vehicles added yet
            </p>
            <Button
              to={routes.providerVehicleAdd}
              variant="primary"
              size="sm"
              className="mt-4"
            >
              Add your first vehicle
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {driverVehicles.map((v) => (
              <div
                key={v.id}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-3 px-5 pt-4">
                  <StatusBadge status={v.status} />
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu((cur) => (cur === v.id ? null : v.id))
                    }
                    aria-label="Vehicle options"
                    className="icon-btn icon-btn-filled size-10 shrink-0"
                  >
                    <Icon name="more" size={18} />
                  </button>
                </div>
                <div className="flex h-36 items-center justify-center px-6">
                  <VehicleImage
                    vehicleId={v.id}
                    category={v.category}
                    transparent
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-5">
                  <p className="t-h4 truncate">{v.name}</p>
                  <p className="mt-0.5 t-body-sm">
                    {vehicleClassOf[v.category]} ·{" "}
                    <span className="tabular">{v.plate}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 t-body-sm text-[color:var(--color-ink)]">
                    <span className="flex items-center gap-1.5">
                      <Icon name="seat" size={15} strokeWidth={2.2} />
                      {v.seats} seats
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="fuel" size={15} strokeWidth={2.2} />
                      {v.fuel}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-[color:var(--color-border)] pt-4">
                    <div>
                      <p className="t-caption">Your rate</p>
                      <p className="t-h4 t-amount">
                        {format(v.pricePerDay)}{" "}
                        <span className="t-caption font-medium">/day</span>
                      </p>
                    </div>
                    <Link
                      to={routes.providerVehicleAdd}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3.5 t-body-sm font-semibold text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-ink)]"
                    >
                      <Icon name="edit" size={15} />
                      Edit
                    </Link>
                  </div>
                </div>

                {openMenu === v.id && (
                  <>
                    <button
                      aria-label="Close"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="absolute right-4 top-14 z-40 w-40 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white py-1 shadow-pop">
                      <Link
                        to={`${routes.providerVehicleAdd}?edit=${v.id}`}
                        onClick={() => setOpenMenu(null)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left t-body-sm text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-surface-soft)]"
                      >
                        <Icon name="edit" size={15} />
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left t-body-sm text-[color:var(--color-danger)] hover:bg-[color:var(--color-surface-soft)]"
                        onClick={() => handleRemove(v.id, v.name)}
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
