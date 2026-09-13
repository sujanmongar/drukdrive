import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import Icon from "../../components/Icon";
import HeroBlobs from "../../components/HeroBlobs";
import LocationPickerSheet from "../../components/LocationPickerSheet";
import DatePickerSheet from "../../components/DatePickerSheet";
import { routes } from "../../lib/routes";
import type { BookingType } from "../../lib/routes";
import { vehicles, recentSearches, popularCarTypes, faqs } from "../../data/mockData";
import { useAuth } from "../../lib/auth";

type TripMode = "one-way" | "return";

const DEFAULT_PICKUP = "Thimphu, Druk School";
const DEFAULT_DROPOFF = "Punakha, Taxi Parking";

export default function Home() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [type, setType] = useState<BookingType>("daily");
  const [tripMode, setTripMode] = useState<TripMode>("one-way");
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));

  const [pickup, setPickup] = useState(DEFAULT_PICKUP);
  const [dropoff, setDropoff] = useState(DEFAULT_DROPOFF);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);
  const [dropoffTime, setDropoffTime] = useState("13:00");

  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | "date" | null>(null);

  const showTripModeTabs = type === "outstation" || type === "rental";
  const dateMode = showTripModeTabs && tripMode === "return" ? "range" : "single";

  function toggleFaq(i: number) {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleSearch() {
    navigate(`${routes.search}?type=${type}`);
  }

  // While "driving", the rider homepage/search isn't relevant — send the
  // driver straight to their dashboard, even on a direct nav/refresh of "/".
  // (Placed after all hooks above so hook call order stays stable.)
  if (role === "driver") {
    return <Navigate to={routes.providerBookings} replace />;
  }

  return (
    <PageShell transparentHeader>
      {/* Negative margin pulls this section up behind the (transparent) header
          so the hero background paints all the way to the top of the
          viewport; the matching padding keeps the visible content in the
          same place it would otherwise be. */}
      <section className="relative -mt-16 overflow-hidden pt-16 md:-mt-[94px] md:pt-[94px]">
        {/* decorative blob background, hero area only */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[484px] overflow-hidden transition-colors duration-500 md:h-[745px]">
          <HeroBlobs type={type} />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-6 md:px-[60px] md:pb-24 md:pt-16">
          <h1 className="max-w-[300px] text-2xl font-bold leading-snug text-[rgba(0,0,0,0.87)] sm:max-w-md sm:text-3xl md:max-w-[46%] md:text-[40px] md:leading-[1.15]">
            Your journey across Bhutan starts here.
          </h1>

          <div className="mt-6 w-full max-w-[506px] rounded-2xl bg-white p-4 shadow-[0px_2px_14px_rgba(0,0,0,0.1)] md:mt-8 md:p-[26px]">
            <BookingTypeTabs value={type} onChange={setType} />

            {showTripModeTabs && (
              <div className="mt-4 flex gap-4 border-b border-[#e5ebf0]">
                {(["one-way", "return"] as TripMode[]).map((m) => {
                  const active = tripMode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTripMode(m)}
                      className={`pb-2 text-sm transition-colors ${
                        active ? "border-b-2 border-[#222] font-bold text-[#222]" : "text-[#747474]"
                      }`}
                    >
                      {m === "one-way" ? "One Way" : "Return"}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setActiveField("pickup")}
                className="flex h-[58px] items-center gap-2 rounded-xl border border-[#e5ebf0] px-3 text-left transition-colors hover:border-[#222]"
              >
                <Icon name="location" size={20} className="shrink-0 text-[#222]" />
                <span className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#333]">Pick up location</span>
                  <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">{pickup}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveField("dropoff")}
                className="flex h-[58px] items-center gap-2 rounded-xl border border-[#e5ebf0] px-3 text-left transition-colors hover:border-[#222]"
              >
                <Icon name="location" size={20} className="shrink-0 text-[#222]" />
                <span className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#333]">Drop off location</span>
                  <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">{dropoff}</span>
                </span>
              </button>

              <div className="flex overflow-hidden rounded-xl border border-[#e5ebf0]">
                <button
                  type="button"
                  onClick={() => setActiveField("date")}
                  className="flex h-14 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <Icon name="calendar" size={20} className="shrink-0 text-[#222]" />
                  <span className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#333]">Pick up date</span>
                    <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">
                      {pickupDate.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </span>
                </button>
                <div className="w-px bg-[#e5ebf0]" />
                <button
                  type="button"
                  onClick={() => setActiveField("date")}
                  className="flex h-14 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <Icon name="clock" size={20} className="shrink-0 text-[#222]" />
                  <span className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#333]">Pick up time</span>
                    <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">{pickupTime}</span>
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold text-[#00b53a]">Duration: 3 hrs</p>

            <button
              type="button"
              onClick={handleSearch}
              className="mt-4 w-full rounded-xl bg-[#222] py-4 text-base font-bold text-white transition-all hover:bg-black active:scale-[0.99]"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 md:px-[60px]">
        {/* Recent searches */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[rgba(0,0,0,0.87)] md:text-2xl">Recent searches</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recentSearches.map((s) => (
              <button
                key={s.id}
                type="button"
                className="flex h-[79px] shrink-0 items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-left shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-shadow hover:shadow-[0px_4px_14px_rgba(25,32,36,0.22)]"
              >
                <img src={s.image} alt="" className="size-[60px] shrink-0 rounded-lg object-cover" />
                <span className="flex flex-col gap-1.5">
                  <span className="whitespace-nowrap text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                    {s.title}
                  </span>
                  <span className="whitespace-nowrap text-xs text-[rgba(0,0,0,0.87)]">{s.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Popular cars */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[rgba(0,0,0,0.87)] md:text-2xl">Popular cars</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} className="w-[240px] md:w-full" />
            ))}
          </div>
        </section>

        {/* Popular car types */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[rgba(0,0,0,0.87)] md:text-2xl">Popular car types</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {popularCarTypes.map((t) => (
              <div
                key={t.name}
                className="relative size-[164px] shrink-0 overflow-hidden rounded-xl bg-cover bg-center transition-transform hover:scale-[1.02]"
                style={{ backgroundImage: `url(${t.image})` }}
              >
                <div className="absolute inset-0 bg-black/60" />
                <span className="absolute bottom-4 left-4 text-base font-semibold text-white">{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[rgba(0,0,0,0.87)] md:text-2xl">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {faqs.map((f, i) => {
              const open = openFaqs.has(i);
              return (
                <div key={f.q} className="border-b border-[#e5ebf0] py-4">
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm text-[rgba(0,0,0,0.87)]">{f.q}</span>
                    <Icon
                      name="chevron-down"
                      size={16}
                      className={`shrink-0 text-[rgba(0,0,0,0.87)] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-200 ${
                      open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="min-h-0 text-sm leading-[1.2] text-[color:var(--color-muted)]">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Company blurb */}
        <section className="py-8 md:py-10">
          <h2 className="mb-3 text-lg font-bold text-[rgba(0,0,0,0.87)] md:text-2xl">DrukDrive</h2>
          <p className="max-w-[1044px] text-sm leading-[1.2] text-[color:var(--color-muted)]">
            DrukDrive partners with trusted local operators across Bhutan to make it easy to find, compare and
            book the right vehicle for your trip — from daily rides around Thimphu to outstation transfers and
            self-drive rentals for exploring the valleys and dzongkhags beyond.
          </p>
        </section>
      </div>

      {activeField === "pickup" && (
        <LocationPickerSheet
          label="Pick up location"
          onSelect={(v) => {
            setPickup(v);
            setActiveField(null);
          }}
          onClose={() => setActiveField(null)}
        />
      )}
      {activeField === "dropoff" && (
        <LocationPickerSheet
          label="Drop off location"
          onSelect={(v) => {
            setDropoff(v);
            setActiveField(null);
          }}
          onClose={() => setActiveField(null)}
        />
      )}
      {activeField === "date" && (
        <DatePickerSheet
          mode={dateMode}
          initialPickup={pickupDate}
          initialDropoff={dropoffDate ?? undefined}
          initialPickupTime={pickupTime}
          initialDropoffTime={dropoffTime}
          onConfirm={({ pickup: p, pickupTime: pt, dropoff: d, dropoffTime: dt }) => {
            setPickupDate(p);
            setPickupTime(pt);
            if (d) setDropoffDate(d);
            if (dt) setDropoffTime(dt);
            setActiveField(null);
          }}
          onClose={() => setActiveField(null)}
        />
      )}
    </PageShell>
  );
}
