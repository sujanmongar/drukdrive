import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageShell from "../../components/PageShell";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import PriceSummarySheet from "../../components/PriceSummarySheet";
import { vehicles, currentUser } from "../../data/mockData";
import { routes } from "../../lib/routes";
import { RENTAL_DAYS, computeFare } from "../../lib/pricing";
import { useCurrency } from "../../lib/currency";

export default function ReviewBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { format } = useCurrency();

  const vehicleId = searchParams.get("vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  const { baseFare, taxes, total } = computeFare(vehicle.pricePerDay);

  const [title, setTitle] = useState("Mr");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [priceSummaryOpen, setPriceSummaryOpen] = useState(false);

  function handleProceed() {
    navigate(`${routes.payment}?vehicleId=${vehicle.id}`);
  }

  const inputClass =
    "w-full rounded-xl border border-[color:var(--color-border)] px-3.5 py-2.5 text-sm text-[#222] outline-none placeholder:text-[color:var(--color-muted)] focus:border-[#222]";
  const labelClass = "mb-1.5 block text-xs font-medium text-[#333]";

  return (
    <PageShell noFooter>
      <div className="mx-auto max-w-[720px] px-4 py-6 pb-32 md:px-[60px] md:py-10 md:pb-32">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-lg font-bold text-[#222]"
        >
          <Icon name="chevron-left" size={22} />
          Review Your Booking
        </button>

        <div className="flex flex-col gap-4 rounded-xl bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-[color:var(--color-muted)]">Pick up</p>
            <p className="text-sm font-bold text-[#222]">
              {vehicle.location}, near {vehicle.name.split(" ")[0]} depot
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 text-xs text-[color:var(--color-muted)]">
            <Icon name="car" size={16} />
            {RENTAL_DAYS * 24} hrs
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-[color:var(--color-muted)]">Drop off</p>
            <p className="text-sm font-bold text-[#222]">Same location</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[color:var(--color-border)] p-4">
          <div className="flex items-center gap-4">
            <img src={vehicle.image} alt={vehicle.name} className="size-16 shrink-0 rounded-lg object-cover" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-bold text-[#222]">{vehicle.name}</p>
                <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
                  {vehicle.category}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
                <Icon name="seat" size={13} />
                {vehicle.seats} Seats
                <Icon name="fuel" size={13} className="ml-1" />
                {vehicle.fuel}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
                <Icon name="location" size={13} />
                {vehicle.location}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-[color:var(--color-border)] pt-4 text-sm text-[#333]">
            <span className="flex items-center gap-2">
              <Icon name="check" size={14} className="text-[color:var(--color-success)]" />
              {vehicle.type}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size={14} className="text-[color:var(--color-success)]" />
              Pick up &amp; drop
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size={14} className="text-[color:var(--color-success)]" />
              Up to {vehicle.seats} person, 2 luggage bags
            </span>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-bold text-[#222]">Personal Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[color:var(--color-border)] pt-5 sm:grid-cols-[100px_1fr]">
          <label>
            <span className={labelClass}>Title</span>
            <select value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass}>
              {["Mr", "Mrs", "Ms"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Full Name</span>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <label>
            <span className={labelClass}>Email</span>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Phone</span>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Pickup address</span>
            <input
              type="text"
              placeholder="Enter point/address"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Drop off address</span>
            <input
              type="text"
              placeholder="Enter point/address"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-[color:var(--color-muted)]">
          <span className="font-semibold text-[#222]">Note:</span> Your information is required for{" "}
          {currentUser.name ? "booking confirmation and driver contact." : "booking confirmation."}
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-border)] bg-white p-4 shadow-[0px_-2px_14px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-[720px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setPriceSummaryOpen(true)}
            className="flex flex-col items-start"
          >
            <span className="flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
              Net Payable
              <Icon name="info" size={13} />
            </span>
            <span className="text-lg font-extrabold text-[#222]">{format(total)}</span>
          </button>
          <Button variant="primary" size="lg" onClick={handleProceed}>
            Proceed To Payment
          </Button>
        </div>
      </div>

      {priceSummaryOpen && (
        <PriceSummarySheet
          pricePerDay={vehicle.pricePerDay}
          baseFare={baseFare}
          taxes={taxes}
          total={total}
          onClose={() => setPriceSummaryOpen(false)}
        />
      )}
    </PageShell>
  );
}
