import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import VehicleImage from "../../components/VehicleImage";
import Icon from "../../components/Icon";
import HeroBlobs from "../../components/HeroBlobs";
import LocationPickerSheet from "../../components/LocationPickerSheet";
import DatePickerSheet from "../../components/DatePickerSheet";
import TimePickerSheet from "../../components/TimePickerSheet";
import { routes } from "../../lib/routes";
import type { BookingType } from "../../lib/routes";
import { vehicles, recentSearches, popularCarTypes, faqs } from "../../data/mockData";
import { useAuth } from "../../lib/auth";
import { formatTripDate } from "../../lib/formatTripDate";
import {
  estimateDurationHours,
  formatDurationHours,
  daysBetween,
  combineDateTime,
  daysHoursBetween,
  formatDayHour,
} from "../../lib/tripDuration";

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

  const pickupAnchorRef = useRef<HTMLDivElement>(null);
  const dropoffAnchorRef = useRef<HTMLDivElement>(null);
  const dateAnchorRef = useRef<HTMLDivElement>(null);
  const pickupTimeAnchorRef = useRef<HTMLButtonElement>(null);
  const dropoffTimeAnchorRef = useRef<HTMLButtonElement>(null);

  const [activeField, setActiveField] = useState<
    "pickup" | "dropoff" | "date" | "pickupTime" | "dropoffTime" | null
  >(null);

  // Each booking type has a genuinely different field set, matching the
  // provided design: Daily Rides is the only tab with a One Way/Return
  // toggle; Rental and Self Drive always show both ends of the date range
  // (no toggle needed); Outstation and Self Drive only ask for a single
  // "Location" (no separate pickup/drop-off pair).
  const showTripModeTabs = type === "daily";
  const isSingleLocation = type === "outstation" || type === "self-drive";
  const showSecondDateBox = type === "rental" || type === "self-drive" || (type === "daily" && tripMode === "return");
  const dateMode = showSecondDateBox ? "range" : "single";

  const durationHours = estimateDurationHours(pickup, dropoff);
  const dayCount = dropoffDate ? daysBetween(pickupDate, dropoffDate) : null;
  const dayHourDuration = dropoffDate
    ? daysHoursBetween(combineDateTime(pickupDate, pickupTime), combineDateTime(dropoffDate, dropoffTime))
    : null;

  const firstDateLabel = type === "outstation" ? "Date" : type === "self-drive" ? "Start date" : "Pick up date";
  const firstTimeLabel = type === "outstation" ? "Time" : type === "self-drive" ? "Start time" : "Pick up time";
  const secondDateLabel = type === "self-drive" ? "End date" : type === "rental" ? "Dropoff date" : "Drop off date";
  const secondTimeLabel = type === "self-drive" ? "End time" : type === "rental" ? "Dropoff time" : "Drop off time";

  function toggleFaq(i: number) {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleSearch() {
    const params = new URLSearchParams({
      type,
      tripMode,
      pickup,
      dropoff,
      pickupDate: pickupDate.toISOString(),
      pickupTime,
    });
    if (dropoffDate) params.set("dropoffDate", dropoffDate.toISOString());
    params.set("dropoffTime", dropoffTime);
    navigate(`${routes.search}?${params.toString()}`);
  }

  function handleRecentSearch(vehicleId: string, recentPickup: string, recentDropoff: string) {
    // A recent search already implies pickup, drop-off and the vehicle —
    // jump straight to booking instead of re-running a fresh search.
    const params = new URLSearchParams({
      vehicleId,
      pickup: recentPickup,
      dropoff: recentDropoff,
      date: formatTripDate(pickupDate, pickupTime),
    });
    navigate(`${routes.reviewBooking}?${params.toString()}`);
  }

  const tripQuery = new URLSearchParams({
    pickup,
    dropoff,
    date: formatTripDate(pickupDate, pickupTime),
  }).toString();

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

        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 pb-10 pt-6 md:grid-cols-[1fr_auto] md:items-center md:px-[60px] md:pb-24 md:pt-16">
          <div>
            <h1 className="max-w-[280px] text-2xl font-bold leading-snug text-[color:var(--color-ink-87)] sm:max-w-md sm:text-3xl md:max-w-[420px] md:text-[40px] md:leading-[1.1]">
              Go anywhere in Bhutan.
            </h1>

            <div className="relative mt-6 w-full max-w-[506px] rounded-2xl bg-white p-4 shadow-[0px_2px_14px_rgba(0,0,0,0.1)] md:mt-8 md:p-[26px]">
              <BookingTypeTabs value={type} onChange={setType} />

              {showTripModeTabs && (
                <div className="mt-4 flex gap-4 border-b border-[color:var(--color-border)]">
                  {(["one-way", "return"] as TripMode[]).map((m) => {
                    const active = tripMode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTripMode(m)}
                        className={`pb-2 text-sm transition-colors ${
                          active ? "border-b-2 border-[color:var(--color-ink)] font-bold text-[color:var(--color-ink)]" : "text-[color:var(--color-muted)]"
                        }`}
                      >
                        {m === "one-way" ? "One Way" : "Return"}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3">
                {isSingleLocation ? (
                  <div ref={pickupAnchorRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveField(activeField === "pickup" ? null : "pickup")}
                      className="flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left transition-colors hover:border-[color:var(--color-ink)]"
                    >
                      <Icon name="location" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                      <span className="flex flex-col gap-1">
                        <span className="text-[11px] text-[color:var(--color-ink-soft)]">Location</span>
                        <span className="text-sm font-bold text-[color:var(--color-ink-87)]">{pickup}</span>
                      </span>
                    </button>
                    {activeField === "pickup" && (
                      <LocationPickerSheet
                        label="Location"
                        anchorRef={pickupAnchorRef}
                        onSelect={(v) => {
                          setPickup(v);
                          setActiveField(null);
                        }}
                        onClose={() => setActiveField(null)}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <div ref={pickupAnchorRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveField(activeField === "pickup" ? null : "pickup")}
                        className="flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left transition-colors hover:border-[color:var(--color-ink)]"
                      >
                        <Icon name="location" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                        <span className="flex flex-col gap-1">
                          <span className="text-[11px] text-[color:var(--color-ink-soft)]">Pick up location</span>
                          <span className="text-sm font-bold text-[color:var(--color-ink-87)]">{pickup}</span>
                        </span>
                      </button>
                      {activeField === "pickup" && (
                        <LocationPickerSheet
                          label="Pick up location"
                          anchorRef={pickupAnchorRef}
                          onSelect={(v) => {
                            setPickup(v);
                            setActiveField(null);
                          }}
                          onClose={() => setActiveField(null)}
                        />
                      )}
                    </div>

                    <div ref={dropoffAnchorRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveField(activeField === "dropoff" ? null : "dropoff")}
                        className="flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-3 text-left transition-colors hover:border-[color:var(--color-ink)]"
                      >
                        <Icon name="location" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                        <span className="flex flex-col gap-1">
                          <span className="text-[11px] text-[color:var(--color-ink-soft)]">Drop off location</span>
                          <span className="text-sm font-bold text-[color:var(--color-ink-87)]">{dropoff}</span>
                        </span>
                      </button>
                      {activeField === "dropoff" && (
                        <LocationPickerSheet
                          label="Drop off location"
                          anchorRef={dropoffAnchorRef}
                          onSelect={(v) => {
                            setDropoff(v);
                            setActiveField(null);
                          }}
                          onClose={() => setActiveField(null)}
                        />
                      )}
                    </div>
                  </>
                )}

                <div ref={dateAnchorRef} className="relative">
                  <div className="flex overflow-hidden rounded-xl border border-[color:var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => setActiveField(activeField === "date" ? null : "date")}
                      className="flex h-14 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50"
                    >
                      <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                      <span className="flex flex-col gap-1">
                        <span className="text-[11px] text-[color:var(--color-ink-soft)]">{firstDateLabel}</span>
                        <span className="text-sm font-bold text-[color:var(--color-ink-87)]">
                          {pickupDate.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                        </span>
                      </span>
                    </button>
                    <div className="w-px bg-[color:var(--color-border)]" />
                    <button
                      ref={pickupTimeAnchorRef}
                      type="button"
                      onClick={() => setActiveField(activeField === "pickupTime" ? null : "pickupTime")}
                      className="flex h-14 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50"
                    >
                      <Icon name="clock" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                      <span className="flex flex-col gap-1">
                        <span className="text-[11px] text-[color:var(--color-ink-soft)]">{firstTimeLabel}</span>
                        <span className="text-sm font-bold text-[color:var(--color-ink-87)]">{pickupTime}</span>
                      </span>
                    </button>
                  </div>
                  {activeField === "date" && (
                    <DatePickerSheet
                      mode={dateMode}
                      anchorRef={dateAnchorRef}
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
                  {activeField === "pickupTime" && (
                    <TimePickerSheet
                      label={firstTimeLabel}
                      value={pickupTime}
                      anchorRef={pickupTimeAnchorRef}
                      onSelect={(t) => {
                        setPickupTime(t);
                        setActiveField(null);
                      }}
                      onClose={() => setActiveField(null)}
                    />
                  )}
                </div>

                {showSecondDateBox && (
                  <div className="flex overflow-hidden rounded-xl border border-[color:var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => setActiveField(activeField === "date" ? null : "date")}
                      className="flex h-14 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50"
                    >
                      <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                      <span className="flex flex-col gap-1">
                        <span className="text-[11px] text-[color:var(--color-ink-soft)]">{secondDateLabel}</span>
                        <span className="text-sm font-bold text-[color:var(--color-ink-87)]">
                          {dropoffDate
                            ? dropoffDate.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
                            : "Select date"}
                        </span>
                      </span>
                    </button>
                    <div className="w-px bg-[color:var(--color-border)]" />
                    <button
                      ref={dropoffTimeAnchorRef}
                      type="button"
                      onClick={() => setActiveField(activeField === "dropoffTime" ? null : "dropoffTime")}
                      className="flex h-14 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50"
                    >
                      <Icon name="clock" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                      <span className="flex flex-col gap-1">
                        <span className="text-[11px] text-[color:var(--color-ink-soft)]">{secondTimeLabel}</span>
                        <span className="text-sm font-bold text-[color:var(--color-ink-87)]">{dropoffTime}</span>
                      </span>
                    </button>
                    {activeField === "dropoffTime" && (
                      <TimePickerSheet
                        label={secondTimeLabel}
                        value={dropoffTime}
                        anchorRef={dropoffTimeAnchorRef}
                        onSelect={(t) => {
                          setDropoffTime(t);
                          setActiveField(null);
                        }}
                        onClose={() => setActiveField(null)}
                      />
                    )}
                  </div>
                )}
              </div>

              {type === "daily" && (
                <p className="mt-3 text-sm font-semibold text-[#00b53a]">
                  Duration: {formatDurationHours(durationHours)}
                </p>
              )}
              {type === "rental" && dayCount !== null && (
                <p className="mt-3 text-sm font-semibold text-[#00b53a]">
                  Duration: {dayCount} day{dayCount === 1 ? "" : "s"}
                </p>
              )}
              {type === "self-drive" && dayHourDuration !== null && (
                <p className="mt-3 text-sm font-semibold text-[#00b53a]">Duration: {formatDayHour(dayHourDuration)}</p>
              )}

              <button
                type="button"
                onClick={handleSearch}
                className="mt-4 w-full rounded-xl bg-[color:var(--color-ink)] py-4 text-base font-bold text-white transition-all hover:bg-black active:scale-[0.99]"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right side of hero — otherwise-empty space on wide screens gets
              a quick trust signal instead of staying blank. */}
          <div className="relative hidden md:block md:w-[380px] lg:w-[440px]">
            <div className="relative overflow-hidden rounded-3xl">
              <svg viewBox="0 0 440 420" className="block w-full" aria-hidden="true">
                <path d="M0 300 L70 180 L130 260 L190 120 L260 280 L320 160 L390 260 L440 220 L440 420 L0 420 Z" fill="#f0deb0" />
                <path d="M0 340 L90 240 L160 320 L230 200 L300 320 L370 240 L440 300 L440 420 L0 420 Z" fill="#e7cd93" />
                <circle cx="360" cy="70" r="42" fill="#ffe9ad" />
              </svg>
            </div>
            <div className="absolute -bottom-5 left-1/2 flex w-[86%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-info-bg)]">
                <Icon name="star" size={18} className="fill-current text-amber-400" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-[color:var(--color-ink)]">4.8 / 5 average rating</p>
                <p className="text-xs text-[color:var(--color-muted)]">From 600+ verified rides across Bhutan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 md:px-[60px]">
        {/* Recent searches */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[color:var(--color-ink-87)] md:text-2xl">Recent searches</h2>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
            {recentSearches.map((s) => {
              const vehicle = vehicles.find((v) => v.id === s.vehicleId);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleRecentSearch(s.vehicleId, s.pickup, s.dropoff)}
                  className="flex h-[79px] shrink-0 items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-left shadow-[0px_1px_3px_rgba(25,32,36,0.16)] transition-shadow hover:shadow-[0px_4px_14px_rgba(25,32,36,0.22)]"
                >
                  <VehicleImage vehicleId={vehicle?.id} category={vehicle?.category} className="size-[60px] shrink-0 rounded-lg" />
                  <span className="flex flex-col gap-1.5">
                    <span className="whitespace-nowrap text-sm font-semibold text-[color:var(--color-ink-87)]">
                      {s.title}
                    </span>
                    <span className="whitespace-nowrap text-xs text-[color:var(--color-ink-87)]">{s.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Popular cars */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[color:var(--color-ink-87)] md:text-2xl">Popular cars</h2>
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} tripQuery={tripQuery} className="w-[240px] shrink-0 md:w-[270px]" />
            ))}
          </div>
        </section>

        {/* Popular car types */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[color:var(--color-ink-87)] md:text-2xl">Popular car types</h2>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
            {popularCarTypes.map((t) => (
              <button
                key={t.category}
                type="button"
                onClick={() => navigate(`${routes.search}?category=${encodeURIComponent(t.category)}`)}
                className="group relative size-[164px] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-neutral-100 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_24px_rgba(0,0,0,0.15)]"
              >
                <VehicleImage
                  vehicleId={t.vehicleId}
                  category={t.category}
                  fit="cover"
                  className="size-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                <span className="pointer-events-none absolute bottom-4 left-4 text-base font-semibold text-white">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 md:py-10">
          <h2 className="mb-4 text-lg font-bold text-[color:var(--color-ink-87)] md:text-2xl">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {faqs.map((f, i) => {
              const open = openFaqs.has(i);
              return (
                <div key={f.q} className="border-b border-[color:var(--color-border)] py-4">
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm text-[color:var(--color-ink-87)]">{f.q}</span>
                    <Icon
                      name="chevron-down"
                      size={16}
                      className={`shrink-0 text-[color:var(--color-ink-87)] transition-transform duration-200 ${
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
          <h2 className="mb-3 text-lg font-bold text-[color:var(--color-ink-87)] md:text-2xl">DrukDrive</h2>
          <p className="max-w-[1044px] text-sm leading-[1.2] text-[color:var(--color-muted)]">
            DrukDrive partners with trusted local operators across Bhutan to make it easy to find, compare and
            book the right vehicle for your trip — from daily rides around Thimphu to outstation transfers and
            self-drive rentals for exploring the valleys and dzongkhags beyond.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
