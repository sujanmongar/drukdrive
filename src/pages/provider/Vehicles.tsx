import { useState } from "react";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import VehicleImage from "../../components/VehicleImage";
import { useDriverVehicles } from "../../lib/driverVehicles";
import { vehicleClassOf } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { useCurrency } from "../../lib/currency";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";
import { t, tn } from "../../lib/i18n";
import { card, menu, menuItem, metaLabel } from "../../lib/ui";

export default function ProviderVehicles() {
  usePageTitle(t("My Vehicle"));
  const { vehicles: driverVehicles, removeVehicle } = useDriverVehicles();
  const { format } = useCurrency();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function handleRemove(id: string, name: string) {
    setOpenMenu(null);
    if (
      window.confirm(t("Remove {vehicle} from your fleet?", { vehicle: name }))
    ) {
      removeVehicle(id);
    }
  }

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="t-h2">{t("My Vehicle")}</h2>
          <Button to={routes.providerVehicleAdd} variant="primary" size="md">
            {t("Add new")}
          </Button>
        </div>

        {driverVehicles.length === 0 ? (
          <EmptyState
            icon="car"
            title={t("No vehicles yet")}
            description={t("Add a vehicle to start receiving bookings.")}
            action={
              <Button to={routes.providerVehicleAdd} variant="primary">
                {t("Add your first vehicle")}
              </Button>
            }
          />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {driverVehicles.map((v) => (
              <div
                key={v.id}
                className={`relative flex flex-col overflow-hidden ${card}`}
              >
                <div className="flex items-center justify-between gap-3 px-5 pt-4">
                  <StatusBadge status={v.status} />
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu((cur) => (cur === v.id ? null : v.id))
                    }
                    aria-label={t("Vehicle options")}
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
                  <p className="mt-0.5 t-caption">
                    {t(vehicleClassOf[v.category])} ·{" "}
                    <span className="tabular">{v.plate}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 t-body-sm text-[color:var(--color-ink)]">
                    <span className="flex items-center gap-1.5">
                      <Icon name="seat" size={15} strokeWidth={2.2} />
                      {tn(v.seats, "{n} seat", "{n} seats")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="fuel" size={15} strokeWidth={2.2} />
                      {t(v.fuel)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-[color:var(--color-border)] pt-4">
                    <div>
                      <p className={metaLabel}>{t("Your rate")}</p>
                      <p>
                        <span className="t-h4 t-amount">
                          {format(v.pricePerDay)}
                        </span>{" "}
                        <span className="t-caption">{t("/day")}</span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="md"
                      to={`${routes.providerVehicleAdd}?edit=${v.id}`}
                    >
                      <Icon name="edit" size={15} />
                      {t("Edit")}
                    </Button>
                  </div>
                </div>

                {openMenu === v.id && (
                  <>
                    <button
                      aria-label={t("Close")}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div
                      className={`absolute right-4 top-14 z-40 w-40 ${menu}`}
                    >
                      <button
                        type="button"
                        className={`${menuItem} text-[color:var(--color-danger)]!`}
                        onClick={() => handleRemove(v.id, v.name)}
                      >
                        <Icon name="trash" size={15} />
                        {t("Remove")}
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
