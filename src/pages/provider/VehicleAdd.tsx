import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import type { Vehicle } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

const categories: Vehicle["category"][] = ["Prime SUV", "Sedan SUV", "Mini Bus", "Bus", "Two Wheels"];
const fuelTypes: Vehicle["fuel"][] = ["Petrol", "Diesel", "Electric"];

const inputClasses =
  "w-full rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm text-[#222] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[#222]";
const labelClasses = "mb-1.5 block text-xs font-semibold text-[#222]";

export default function ProviderVehicleAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Vehicle["category"]>(categories[0]);
  const [plate, setPlate] = useState("");
  const [seats, setSeats] = useState("");
  const [fuel, setFuel] = useState<Vehicle["fuel"]>(fuelTypes[0]);
  const [photoName, setPhotoName] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // No backend — simulate a save and return to the vehicle list.
    navigate(routes.providerVehicles);
  }

  return (
    <PageShell>
      <SecondaryTabs tabs={providerTabs} />

      <div className="mx-auto max-w-[720px] px-4 py-8 md:px-[60px] md:py-10">
        <button
          type="button"
          onClick={() => navigate(routes.providerVehicles)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-muted)] hover:text-[#222]"
        >
          <Icon name="arrow-left" size={16} />
          Back to My Vehicles
        </button>

        <h1 className="mt-4 text-2xl font-bold text-[#222]">Add a Vehicle</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Register a new vehicle so it can be assigned to rides.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-5 rounded-xl border border-[color:var(--color-border)] bg-white p-5 shadow-[0px_1px_3px_rgba(25,32,36,0.16)] sm:p-6"
        >
          <div>
            <label className={labelClasses} htmlFor="vehicle-name">
              Vehicle name
            </label>
            <input
              id="vehicle-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Toyota Prado GX"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Vehicle["category"])}
                className={inputClasses}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses} htmlFor="fuel">
                Fuel type
              </label>
              <select
                id="fuel"
                value={fuel}
                onChange={(e) => setFuel(e.target.value as Vehicle["fuel"])}
                className={inputClasses}
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="plate">
                Plate number
              </label>
              <input
                id="plate"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="e.g. BP-1-A2345"
                className={`${inputClasses} font-mono tracking-wide`}
              />
            </div>

            <div>
              <label className={labelClasses} htmlFor="seats">
                Number of seats
              </label>
              <input
                id="seats"
                type="number"
                min={1}
                required
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="e.g. 5"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Vehicle photo</label>
            <label
              htmlFor="photo"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--color-border)] px-4 py-8 text-center hover:border-[#222]"
            >
              <Icon name="upload" size={22} className="text-[color:var(--color-muted)]" />
              <span className="text-sm font-semibold text-[#222]">
                {photoName ?? "Click to upload a photo"}
              </span>
              <span className="text-xs text-[color:var(--color-muted)]">PNG or JPG, up to 5MB</span>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate(routes.providerVehicles)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save vehicle
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
