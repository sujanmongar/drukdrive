import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import VehicleImage from "../../components/VehicleImage";
import Icon from "../../components/Icon";
import SectionHeader from "../../components/SectionHeader";
import LocationPickerSheet from "../../components/LocationPickerSheet";
import DatePickerSheet from "../../components/DatePickerSheet";
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
  const recentTrackRef = useRef<HTMLDivElement>(null);
  const carsTrackRef = useRef<HTMLDivElement>(null);
  const typesTrackRef = useRef<HTMLDivElement>(null);

  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | "date" | null>(null);

  // Each booking type has a genuinely different field set, matching the
  // provided design: Daily Rides is the only tab with a One Way/Return
  // toggle; Rental and Self Drive always show both ends of the date range
  // (no toggle needed); Outstation and Self Drive only ask for a single
  // "Location" (no separate pickup/drop-off pair).
  const showTripModeTabs = type === "daily" || type === "outstation";
  const isSingleLocation = type === "outstation" || type === "self-drive";
  const showSecondDateBox = type === "rental" || type === "self-drive" || (showTripModeTabs && tripMode === "return");
  const dateMode = showSecondDateBox ? "range" : "single";

  const durationHours = estimateDurationHours(pickup, dropoff);
  const dayCount = dropoffDate ? daysBetween(pickupDate, dropoffDate) : null;
  const dayHourDuration = dropoffDate
    ? daysHoursBetween(combineDateTime(pickupDate, pickupTime), combineDateTime(dropoffDate, dropoffTime))
    : null;

  const firstPointLabel = type === "outstation" ? "Date" : type === "self-drive" ? "Start" : "Pick up date";
  const secondPointLabel = type === "self-drive" ? "End" : "Drop off date";

  function formatDateLabel(d: Date) {
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

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
      <section className="relative -mt-16 overflow-hidden bg-[#f6f7f8] pt-16 md:-mt-[94px] md:pt-[94px]">

        <div className="animate-fade-up relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 pb-14 pt-10 md:grid-cols-[1fr_auto] md:items-center md:px-10 md:pb-24 md:pt-16 lg:grid-cols-1 lg:pb-20">
          <div>
            <h1 className="t-h1 max-w-[280px] text-[color:var(--color-ink)] sm:max-w-md md:max-w-[520px]">
              Go anywhere in Bhutan.
            </h1>

            {/* Mobile keeps the stacked card. From lg the widget goes
                horizontal — one field row plus an icon-only search button —
                so the hero costs far less vertical space. */}
            <div className="relative mt-8 w-full max-w-[506px] rounded-2xl bg-white p-5 shadow-[0px_2px_14px_rgba(0,0,0,0.08)] md:mt-10 md:p-6 lg:max-w-none lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <BookingTypeTabs value={type} onChange={setType} />

              {showTripModeTabs && (
                <div className="mt-5 flex w-fit gap-5">
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

              <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-3">
                {isSingleLocation ? (
                  <div ref={pickupAnchorRef} className="relative lg:min-w-0 lg:flex-1">
                    <button
                      type="button"
                      onClick={() => setActiveField(activeField === "pickup" ? null : "pickup")}
                      className="flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-white px-3 text-left transition-colors hover:border-[color:var(--color-ink)] lg:h-[56px]"
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
                    <div ref={pickupAnchorRef} className="relative lg:min-w-0 lg:flex-1">
                      <button
                        type="button"
                        onClick={() => setActiveField(activeField === "pickup" ? null : "pickup")}
                        className="flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-white px-3 text-left transition-colors hover:border-[color:var(--color-ink)] lg:h-[56px]"
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

                    <div ref={dropoffAnchorRef} className="relative lg:min-w-0 lg:flex-1">
                      <button
                        type="button"
                        onClick={() => setActiveField(activeField === "dropoff" ? null : "dropoff")}
                        className="flex h-[58px] w-full items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-white px-3 text-left transition-colors hover:border-[color:var(--color-ink)] lg:h-[56px]"
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

                <div ref={dateAnchorRef} className="relative lg:min-w-0 lg:flex-1">
                  <div className="flex overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white lg:h-[56px]">
                    <button
                      type="button"
                      onClick={() => setActiveField(activeField === "date" ? null : "date")}
                      className="flex h-14 min-w-0 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50 lg:h-full"
                    >
                      <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="text-[11px] text-[color:var(--color-ink-soft)]">{firstPointLabel}</span>
                        <span className="truncate text-sm font-bold text-[color:var(--color-ink-87)]">
                          {formatDateLabel(pickupDate)}, {pickupTime}
                        </span>
                      </span>
                    </button>
                    {showSecondDateBox && (
                      <>
                        <div className="w-px bg-[color:var(--color-border)]" />
                        <button
                          type="button"
                          onClick={() => setActiveField(activeField === "date" ? null : "date")}
                          className="flex h-14 min-w-0 flex-1 items-center gap-2 px-3 text-left transition-colors hover:bg-neutral-50 lg:h-full"
                        >
                          <Icon name="calendar" size={20} className="shrink-0 text-[color:var(--color-ink)]" />
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="text-[11px] text-[color:var(--color-ink-soft)]">{secondPointLabel}</span>
                            <span className="truncate text-sm font-bold text-[color:var(--color-ink-87)]">
                              {dropoffDate ? `${formatDateLabel(dropoffDate)}, ${dropoffTime}` : "Select date"}
                            </span>
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                  {activeField === "date" && (
                    <DatePickerSheet
                      mode={dateMode}
                      anchorRef={dateAnchorRef}
                      initialPickup={pickupDate}
                      initialDropoff={dropoffDate ?? undefined}
                      initialPickupTime={pickupTime}
                      initialDropoffTime={dropoffTime}
                      pickupLabel={firstPointLabel}
                      dropoffLabel={secondPointLabel}
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
                </div>

                {/* Desktop: the search action collapses into the field row. */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="hidden h-[56px] shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-ink)] px-8 text-base font-bold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] lg:flex"
                >
                  Search
                </button>
              </div>

              {type === "daily" && tripMode === "return" && dayHourDuration !== null && (
                <p className="t-body mt-4 font-semibold text-[color:var(--color-success)]">Duration: {formatDayHour(dayHourDuration)}</p>
              )}
              {type === "daily" && tripMode === "one-way" && (
                <p className="t-body mt-4 font-semibold text-[color:var(--color-success)]">
                  Duration: {formatDurationHours(durationHours)}
                </p>
              )}
              {type === "rental" && dayCount !== null && (
                <p className="t-body mt-4 font-semibold text-[color:var(--color-success)]">
                  Duration: {dayCount} day{dayCount === 1 ? "" : "s"}
                </p>
              )}
              {type === "self-drive" && dayHourDuration !== null && (
                <p className="t-body mt-4 font-semibold text-[color:var(--color-success)]">Duration: {formatDayHour(dayHourDuration)}</p>
              )}

              <button
                type="button"
                onClick={handleSearch}
                className="mt-5 w-full rounded-xl bg-[color:var(--color-ink)] py-4 text-base font-bold text-white transition-all duration-200 hover:bg-black active:scale-[0.99] lg:hidden"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right side of hero — fills the empty space beside the stacked
              widget at md. From lg the widget goes full-width horizontal, so
              this steps aside and the trust signal moves beneath it. */}
          <div className="relative hidden md:block md:w-[380px] lg:hidden">
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

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Recent searches */}
        <section className="py-12 md:py-20">
          <SectionHeader title="Recent searches" trackRef={recentTrackRef} />
          <div ref={recentTrackRef} className="carousel-track -mx-4 -mb-8 flex gap-4 overflow-x-auto px-4 pb-12 pt-3 md:-mx-6 md:px-6">
            {recentSearches.map((s) => {
              const vehicle = vehicles.find((v) => v.id === s.vehicleId);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleRecentSearch(s.vehicleId, s.pickup, s.dropoff)}
                  className="flex shrink-0 items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0px_10px_28px_rgba(25,32,36,0.14)]"
                >
                  <VehicleImage vehicleId={vehicle?.id} category={vehicle?.category} className="size-16 shrink-0 rounded-xl" />
                  <span className="flex flex-col gap-1">
                    <span className="t-body whitespace-nowrap font-bold text-[color:var(--color-ink)]">{s.title}</span>
                    <span className="t-caption whitespace-nowrap text-[color:var(--color-muted)]">{s.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {/* Popular cars — a full-bleed tinted band so the white cards and their
          hover shadow read against a ground. Content stays on the grid. */}
      <section className="bg-[#f6f7f8] py-12 md:py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <SectionHeader title="Popular cars" trackRef={carsTrackRef} />
          <div ref={carsTrackRef} className="carousel-track -mx-4 -mb-8 flex gap-5 overflow-x-auto px-4 pb-12 pt-3 md:-mx-6 md:px-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                tripQuery={tripQuery}
                className="w-[260px] shrink-0 sm:w-[280px] lg:w-[calc((100%-3.75rem)/4)]"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Popular car types — photo tiles, paged by the header arrows. */}
        <section className="py-12 md:py-20">
          <SectionHeader title="Popular car types" trackRef={typesTrackRef} />
          <div ref={typesTrackRef} className="carousel-track -mx-4 -mb-8 flex gap-4 overflow-x-auto px-4 pb-12 pt-3 md:-mx-6 md:gap-5 md:px-6">
            {popularCarTypes.map((t) => (
              <button
                key={t.category}
                type="button"
                onClick={() => navigate(`${routes.search}?category=${encodeURIComponent(t.category)}`)}
                className="group w-[210px] shrink-0 cursor-pointer text-left sm:w-[220px] lg:w-[calc((100%-3.75rem)/4)]"
              >
                <div className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl bg-[#f2f4f6] transition-colors duration-300 group-hover:bg-[#e9edf1]">
                  <VehicleImage
                    vehicleId={t.vehicleId}
                    category={t.category}
                    transparent
                    className="size-full p-5 transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
                <p className="t-h4 mt-3 text-[color:var(--color-ink)]">{t.label}</p>
                <p className="t-caption text-[color:var(--color-muted)]">
                  {vehicles.filter((v) => v.category === t.category).length} available
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ — one centred column of full-width accordion cards. */}
        <section className="py-12 md:py-20">
          <h2 className="t-h2 mb-6 text-center text-[color:var(--color-ink)] md:mb-8">Frequently asked questions</h2>
          <div className="mx-auto flex max-w-[860px] flex-col gap-3">
            {faqs.map((f, i) => {
              const open = openFaqs.has(i);
              return (
                <div
                  key={f.q}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    open
                      ? "border-[color:var(--color-ink)] bg-white shadow-[0px_8px_24px_rgba(25,32,36,0.10)]"
                      : "border-[color:var(--color-border)] bg-white hover:border-[color:var(--color-ink)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left md:p-6"
                  >
                    <span className="t-h4 text-[color:var(--color-ink)]">{f.q}</span>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        open ? "rotate-180 bg-[color:var(--color-ink)] text-white" : "bg-neutral-100 text-[color:var(--color-ink)]"
                      }`}
                    >
                      <Icon name="chevron-down" size={17} strokeWidth={2.2} />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="t-body-lg px-5 pb-6 text-[color:var(--color-muted)] md:px-6">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Company blurb */}
        <section className="py-12 md:py-20">
          <h2 className="t-h2 mb-4 text-[color:var(--color-ink)]">DrukDrive</h2>
          <p className="t-body-lg max-w-[860px] text-[color:var(--color-muted)]">
            DrukDrive partners with trusted local operators across Bhutan to make it easy to find, compare and
            book the right vehicle for your trip — from daily rides around Thimphu to outstation transfers and
            self-drive rentals for exploring the valleys and dzongkhags beyond.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
