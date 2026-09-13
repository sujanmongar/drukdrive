import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { vehicleTemplates } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";

const selectClass =
  "w-full rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm text-[#222] outline-none focus:border-[#222]";
const inputClass = selectClass;
const labelClass = "mb-1.5 block text-xs font-medium text-[color:var(--color-muted)]";

function YesNo({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-6">
      {[true, false].map((v) => (
        <label key={String(v)} className="flex cursor-pointer items-center gap-2 text-sm text-[#222]">
          <input
            type="radio"
            checked={value === v}
            onChange={() => onChange(v)}
            className="size-4 accent-[#222]"
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
      <Icon name="upload" size={22} className="text-[color:var(--color-muted)]" />
      <p className="text-sm font-semibold text-[#222]">Drag your photo here</p>
      <p className="text-xs text-[color:var(--color-muted)]">{label}</p>
    </div>
  );
}

export default function ProviderVehicleAdd() {
  const navigate = useNavigate();
  const [type, setType] = useState("SUV");
  const [brand, setBrand] = useState("Toyota");
  const [selectedTemplate, setSelectedTemplate] = useState(vehicleTemplates[0].id);
  const [modelYear, setModelYear] = useState("2022");
  const [transmission, setTransmission] = useState("Automatic");
  const [fuelType, setFuelType] = useState("Petrol");
  const [hasAc, setHasAc] = useState(true);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [hasInsurance, setHasInsurance] = useState(true);
  const [price, setPrice] = useState("3000");

  function handleSave() {
    // No backend — simulate a save by returning to the vehicle list.
    navigate(routes.providerVehicles);
  }

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} reviewHref={routes.providerReviews} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[60px] md:py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#222]">My Vehicle</h2>
          <Button variant="secondary" size="sm" to={routes.providerVehicles}>
            Cancel
          </Button>
        </div>

        <div className="mt-6 max-w-2xl rounded-xl border border-[color:var(--color-border)] p-6">
          <h3 className="text-base font-bold text-[#222]">Add vehicle</h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                {["SUV", "Sedan", "Hatchback", "Bus", "Minibus", "Minivan"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Brand</span>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
                {["Toyota", "Hyundai", "Maruti", "Mahindra", "Honda", "Tata"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm text-[#333]">Select your vehicle from the listed below.</p>
            <div className="flex flex-wrap gap-3">
              {vehicleTemplates.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedTemplate(v.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                    selectedTemplate === v.id ? "border-[#222] ring-1 ring-[#222]" : "border-[color:var(--color-border)]"
                  }`}
                >
                  <span className="text-sm font-semibold text-[#222]">{v.name}</span>
                  <img src={v.image} alt={v.name} className="size-10 rounded-md object-cover" />
                </button>
              ))}
            </div>
            <button type="button" className="mt-2 text-sm font-semibold text-[#2276e3]">
              View more
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Model year</span>
              <input
                type="text"
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                className={inputClass}
              />
            </label>
            <label>
              <span className={labelClass}>Transmission</span>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className={selectClass}>
                {["Automatic", "Manual"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Fuel type</span>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={selectClass}>
                {["Petrol", "Diesel", "Electric"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
            <div>
              <span className={labelClass}>Do you have AC in your vehicle?</span>
              <YesNo value={hasAc} onChange={setHasAc} />
            </div>
          </div>

          <label className="mt-5 block">
            <span className={labelClass}>Vehicle number</span>
            <input
              type="text"
              placeholder="BP-1-F0987"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className={inputClass}
            />
          </label>

          <div className="mt-5">
            <span className={labelClass}>Do you have premium vehicle insurance?</span>
            <YesNo value={hasInsurance} onChange={setHasInsurance} />
          </div>

          {hasInsurance && (
            <div className="mt-4">
              <Dropzone label="Upload insurance here" />
            </div>
          )}

          <div className="mt-5">
            <span className={labelClass}>Upload vehicle registration certificate (RC)</span>
            <Dropzone label="Upload RC here" />
          </div>

          <div className="mt-6">
            <h3 className="text-base font-bold text-[#222]">Set your price</h3>
            <p className="text-sm text-[color:var(--color-muted)]">You can change it anytime</p>
            <div className="mt-3 flex flex-col items-center gap-1 rounded-xl bg-[color:var(--color-info-bg)] py-6">
              <div className="flex items-center gap-1 text-2xl font-extrabold text-[#222]">
                <span>Nu.</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                  className="w-28 bg-transparent text-center outline-none"
                />
              </div>
              <span className="text-sm text-[color:var(--color-muted)]">per day</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" size="sm" to={routes.providerVehicles}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
