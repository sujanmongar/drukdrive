import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import { driverVehicles } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

export default function ProviderVehicles() {
  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#222]">My Vehicles</h1>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              Vehicles registered under your account for rides.
            </p>
          </div>
          <Button to={routes.providerVehicleAdd} variant="primary">
            <Icon name="plus" size={16} />
            Add vehicle
          </Button>
        </div>

        {driverVehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white py-16 text-center shadow-[0px_1px_3px_rgba(25,32,36,0.16)]">
            <Icon name="car" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[#222]">No vehicles yet</p>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              Add a vehicle to start accepting rides.
            </p>
            <Button to={routes.providerVehicleAdd} variant="primary" className="mt-4">
              <Icon name="plus" size={16} />
              Add vehicle
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {driverVehicles.map((v) => (
              <div
                key={v.id}
                className="flex flex-col overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)]"
              >
                <img src={v.image} alt={v.name} className="h-40 w-full object-cover" />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#222]">{v.name}</p>
                      <p className="text-xs text-[color:var(--color-muted)]">{v.category}</p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-[#333]">
                    <Icon name="credit-card" size={14} className="text-[color:var(--color-muted)]" />
                    <span className="font-mono tracking-wide">{v.plate}</span>
                  </div>

                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-[#222] hover:border-[#222]"
                    >
                      <Icon name="edit" size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-[color:var(--color-danger)] hover:border-[color:var(--color-danger)]"
                    >
                      <Icon name="trash" size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
