import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import VehicleImage from "../../components/VehicleImage";
import { vehicleTemplates, type VehicleCategory } from "../../data/mockData";
import { useDriverVehicles } from "../../lib/driverVehicles";
import { currencies } from "../../lib/currency";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
  card,
  fieldError,
  inset,
  input,
  label as labelClass,
  rowHover,
} from "../../lib/ui";

const vehicleTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Bus",
  "Minibus",
  "Minivan",
] as const;
type VehicleType = (typeof vehicleTypes)[number];

const categoryByType: Record<VehicleType, VehicleCategory> = {
  SUV: "Prime SUV",
  Sedan: "Sedan SUV",
  Hatchback: "Sedan SUV",
  Bus: "Bus",
  Minibus: "Mini Bus",
  Minivan: "Mini Bus",
};

const seatsByType: Record<VehicleType, number> = {
  SUV: 7,
  Sedan: 5,
  Hatchback: 5,
  Bus: 21,
  Minibus: 9,
  Minivan: 7,
};

// mockData prices are USD; the on-page price field is shown in BTN (Nu.) to
// match the reference design, so convert both ways through this fixed rate.
const BTN_RATE = currencies.find((c) => c.code === "BTN")!.rateFromUsd;

function YesNo({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-6">
      {[true, false].map((v) => (
        <label
          key={String(v)}
          className={`-mx-2 flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl px-2 t-body-sm text-[color:var(--color-ink)] ${rowHover}`}
        >
          <input
            type="radio"
            checked={value === v}
            onChange={() => onChange(v)}
            className="size-5 accent-[color:var(--color-ink)]"
          />
          {v ? "Yes" : "No"}
        </label>
      ))}
    </div>
  );
}

function Dropzone({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--color-border)] py-10 text-center">
      <Icon
        name="upload"
        size={22}
        className="text-[color:var(--color-muted)]"
      />
      <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
        Drag your photo here
      </p>
      <p className="t-caption">{label}</p>
    </div>
  );
}

export default function ProviderVehicleAdd() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const {
    vehicles: driverVehicles,
    addVehicle,
    updateVehicle,
  } = useDriverVehicles();
  const editingVehicle = editId
    ? driverVehicles.find((v) => v.id === editId)
    : undefined;
  usePageTitle(editingVehicle ? `Edit ${editingVehicle.name}` : "Add Vehicle");

  const [vehicleName, setVehicleName] = useState(editingVehicle?.name ?? "");
  const [type, setType] = useState<VehicleType>(
    (Object.entries(categoryByType).find(
      ([, cat]) => cat === editingVehicle?.category,
    )?.[0] as VehicleType) ?? "SUV",
  );
  const [brand, setBrand] = useState("Toyota");
  const [modelYear, setModelYear] = useState("2022");
  const [transmission, setTransmission] = useState("Automatic");
  const [fuelType, setFuelType] = useState<string>(
    editingVehicle?.fuel ?? "Petrol",
  );
  const [seats, setSeats] = useState(
    String(editingVehicle?.seats ?? seatsByType[type]),
  );
  const [hasAc, setHasAc] = useState(true);
  const [vehicleNumber, setVehicleNumber] = useState(
    editingVehicle?.plate ?? "",
  );
  const [hasInsurance, setHasInsurance] = useState(true);
  const [price, setPrice] = useState(
    editingVehicle
      ? String(Math.round(editingVehicle.pricePerDay * BTN_RATE))
      : "3000",
  );
  const [touched, setTouched] = useState(false);

  // Keep the seat count's default in step with the vehicle type, unless
  // editing an existing vehicle whose seat count should stay as-is.
  useEffect(() => {
    if (!editingVehicle) setSeats(String(seatsByType[type]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const isValid =
    vehicleName.trim() !== "" &&
    vehicleNumber.trim() !== "" &&
    Number(price) > 0;

  function handleSave() {
    if (!isValid) {
      setTouched(true);
      return;
    }
    const payload = {
      name: vehicleName.trim(),
      plate: vehicleNumber.trim(),
      category: categoryByType[type],
      seats: Number(seats) || seatsByType[type],
      fuel: fuelType as "Petrol" | "Diesel" | "Electric",
      pricePerDay: Math.round((Number(price) / BTN_RATE) * 100) / 100,
      status: editingVehicle?.status ?? ("Under review" as const),
    };
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, payload);
    } else {
      addVehicle(payload);
    }
    navigate(routes.providerVehicles);
  }

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="t-h2">My Vehicle</h2>
          <Button variant="ghost" size="md" to={routes.providerVehicles}>
            Cancel
          </Button>
        </div>

        <div className={`mt-6 max-w-2xl ${card} p-6`}>
          <h3 className="t-h4">
            {editingVehicle ? "Edit vehicle" : "Add vehicle"}
          </h3>

          <label className="mt-5 block">
            <span className={labelClass}>Vehicle name *</span>
            <input
              type="text"
              placeholder="e.g. Toyota Prado GX"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className={`${input} ${touched && !vehicleName.trim() ? "border-[color:var(--color-danger)]" : ""}`}
            />
          </label>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className={input}
              >
                {vehicleTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Brand</span>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={input}
              >
                {[
                  "Toyota",
                  "Hyundai",
                  "Maruti",
                  "Mahindra",
                  "Honda",
                  "Tata",
                ].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <p className="mb-2 t-body-sm">
              Or pick a common model to prefill the name.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {vehicleTemplates.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVehicleName(v.name);
                    const matchedType =
                      (Object.entries(categoryByType).find(
                        ([, cat]) => cat === v.category,
                      )?.[0] as VehicleType) ?? "SUV";
                    setType(matchedType);
                  }}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors duration-150 ${
                    vehicleName === v.name
                      ? "border-[color:var(--color-ink)] ring-1 ring-[color:var(--color-ink)]"
                      : "border-[color:var(--color-border)] hover:border-[color:var(--color-ink)]"
                  }`}
                >
                  <span className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                    {v.name}
                  </span>
                  <VehicleImage
                    vehicleId={v.id}
                    category={v.category}
                    className="size-10 rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Model year</span>
              <input
                type="text"
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                className={input}
              />
            </label>
            <label>
              <span className={labelClass}>Transmission</span>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className={input}
              >
                {["Automatic", "Manual"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Fuel type</span>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className={input}
              >
                {["Petrol", "Diesel", "Electric"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Seats</span>
              <input
                type="number"
                min={1}
                max={40}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className={input}
              />
            </label>
          </div>

          <div className="mt-5">
            <span className={labelClass}>Do you have AC in your vehicle?</span>
            <YesNo value={hasAc} onChange={setHasAc} />
          </div>

          <label className="mt-5 block">
            <span className={labelClass}>Vehicle number *</span>
            <input
              type="text"
              placeholder="BP-1-F0987"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className={`${input} ${touched && !vehicleNumber.trim() ? "border-[color:var(--color-danger)]" : ""}`}
            />
          </label>

          <div className="mt-5">
            <span className={labelClass}>
              Do you have premium vehicle insurance?
            </span>
            <YesNo value={hasInsurance} onChange={setHasInsurance} />
          </div>

          {hasInsurance && (
            <div className="mt-4">
              <Dropzone label="Upload insurance here" />
            </div>
          )}

          <div className="mt-5">
            <span className={labelClass}>
              Upload vehicle registration certificate (RC)
            </span>
            <Dropzone label="Upload RC here" />
          </div>

          <div className="mt-6">
            <h3 className="t-h4">Set your price</h3>
            <p className="t-caption">You can change it anytime</p>
            <div
              className={`mt-3 flex flex-col items-center gap-1 ${inset} py-6`}
            >
              <div className="flex items-center gap-1 t-h2 t-amount">
                <span>Nu.</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                  className="h-12 w-28 rounded-xl border border-transparent bg-transparent text-center outline-none transition-colors duration-150 hover:border-[color:var(--color-border)] focus:border-[color:var(--color-ink)]"
                />
              </div>
              <span className="t-caption">per day</span>
            </div>
            {touched && !(Number(price) > 0) && (
              <p className={fieldError}>Enter a price greater than 0.</p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="primary" size="lg" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" size="lg" to={routes.providerVehicles}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
