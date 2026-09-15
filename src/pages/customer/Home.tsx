import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import VehicleImage from "../../components/VehicleImage";
import Icon from "../../components/Icon";
import SectionHeader from "../../components/SectionHeader";
import SearchFields from "../../components/SearchFields";
import { routes } from "../../lib/routes";
import type { BookingType } from "../../lib/routes";
import {
  vehicles,
  recentSearches,
  popularCarTypes,
  faqs,
} from "../../data/mockData";
import { useAuth } from "../../lib/auth";
import {
  bookingToParams,
  defaultDropoffDate,
  defaultSearch,
  isDayBased,
} from "../../lib/booking";
import type { SearchValue } from "../../lib/booking";

export default function Home() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [search, setSearch] = useState<SearchValue>(() =>
    defaultSearch("daily"),
  );
  const type = search.type;
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));

  const recentTrackRef = useRef<HTMLDivElement>(null);
  const carsTrackRef = useRef<HTMLDivElement>(null);
  const typesTrackRef = useRef<HTMLDivElement>(null);

  // Switching between a same-day ride and a by-the-day rental moves the
  // drop-off date to what that type expects, so the fields never contradict
  // the tab.
  function setType(next: BookingType) {
    setSearch((s) => {
      if (isDayBased(next) === isDayBased(s.type)) return { ...s, type: next };
      return {
        ...s,
        type: next,
        dropoffDate: defaultDropoffDate(next, s.pickupDate),
        dropoffTime: next === "daily" ? "16:00" : s.pickupTime,
      };
    });
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
    navigate(`${routes.search}?${bookingToParams(search).toString()}`);
  }

  function handleRecentSearch(
    vehicleId: string,
    recentPickup: string,
    recentDropoff: string,
  ) {
    // A recent search already implies pickup, drop-off and the vehicle —
    // jump straight to booking instead of re-running a fresh search.
    const params = bookingToParams({
      ...search,
      pickup: recentPickup,
      dropoff: recentDropoff,
      vehicleId,
    });
    navigate(`${routes.bookingReview}?${params.toString()}`);
  }

  const tripQuery = bookingToParams(search).toString();

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
      <section className="relative -mt-16 overflow-hidden bg-[color:var(--color-surface-muted)] pt-16 md:-mt-[94px] md:pt-[94px]">
        <div className="animate-fade-up relative mx-auto max-w-[1280px] px-4 pb-14 pt-10 md:px-10 md:pb-20 md:pt-16">
          <div>
            <h1 className="t-h1 max-w-[280px] text-[color:var(--color-ink)] sm:max-w-md md:max-w-[520px]">
              Go anywhere in Bhutan.
            </h1>

            {/* Mobile keeps the stacked card. From lg the widget goes
                horizontal — one field row plus an icon-only search button —
                so the hero costs far less vertical space. */}
            {/* The type tiles sit on the hero itself, above the search card,
                so the card holds only the search. */}
            <div className="mt-8 w-full max-w-[506px] md:mt-10 lg:max-w-none">
              <BookingTypeTabs value={type} onChange={setType} />
            </div>

            <div className="relative mt-4 w-full max-w-[506px] rounded-2xl bg-white p-5 shadow-card md:p-6 lg:mt-5 lg:max-w-none lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
              <div>
                <SearchFields
                  value={search}
                  onChange={setSearch}
                  layout="row"
                  anchored
                  action={
                    /* Desktop: the search action sits at the end of the field row. */
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="hidden h-[56px] shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-ink)] px-8 text-base font-bold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] lg:flex"
                    >
                      Search
                    </button>
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="mt-5 w-full rounded-xl bg-[color:var(--color-ink)] py-4 text-base font-bold text-white transition-all duration-200 hover:bg-black active:scale-[0.99] lg:hidden"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Recent searches */}
        <section className="section-y">
          <SectionHeader title="Recent searches" trackRef={recentTrackRef} />
          <div
            ref={recentTrackRef}
            className="carousel-track -mx-4 -mb-8 flex gap-4 overflow-x-auto px-4 pb-12 pt-3 md:-mx-6 md:px-6"
          >
            {recentSearches.map((s) => {
              const vehicle = vehicles.find((v) => v.id === s.vehicleId);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    handleRecentSearch(s.vehicleId, s.pickup, s.dropoff)
                  }
                  className="flex shrink-0 items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lift"
                >
                  <VehicleImage
                    vehicleId={vehicle?.id}
                    category={vehicle?.category}
                    className="size-16 shrink-0 rounded-xl"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="t-body whitespace-nowrap font-bold text-[color:var(--color-ink)]">
                      {s.title}
                    </span>
                    <span className="t-caption whitespace-nowrap text-[color:var(--color-muted)]">
                      {s.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Popular cars — a full-bleed tinted band so the white cards and their
          hover shadow read against a ground. Content stays on the grid. */}
      <section className="section-y bg-[color:var(--color-surface-subtle)]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-10">
          <SectionHeader title="Popular cars" trackRef={carsTrackRef} />
          <div
            ref={carsTrackRef}
            className="carousel-track -mx-4 -mb-8 flex gap-5 overflow-x-auto px-4 pb-12 pt-3 md:-mx-6 md:px-6"
          >
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                tripQuery={tripQuery}
                className="shrink-0 basis-[86%] sm:basis-[280px] lg:basis-[calc((100%-3.75rem)/4)]"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Popular car types — photo tiles, paged by the header arrows. */}
        <section className="section-y">
          <SectionHeader title="Popular car types" trackRef={typesTrackRef} />
          <div
            ref={typesTrackRef}
            className="carousel-track -mx-4 -mb-8 flex gap-4 overflow-x-auto px-4 pb-12 pt-3 md:-mx-6 md:gap-5 md:px-6"
          >
            {popularCarTypes.map((t) => (
              <button
                key={t.category}
                type="button"
                onClick={() =>
                  navigate(
                    `${routes.search}?category=${encodeURIComponent(t.category)}`,
                  )
                }
                className="group shrink-0 basis-[86%] cursor-pointer text-left sm:basis-[220px] lg:basis-[calc((100%-3.75rem)/4)]"
              >
                <div className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--color-surface-sunken)] transition-colors duration-300 group-hover:bg-[color:var(--color-surface-soft)]">
                  <VehicleImage
                    vehicleId={t.vehicleId}
                    category={t.category}
                    transparent
                    className="size-full p-5 transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
                <p className="t-h4 mt-3 text-[color:var(--color-ink)]">
                  {t.label}
                </p>
                <p className="t-caption text-[color:var(--color-muted)]">
                  {vehicles.filter((v) => v.category === t.category).length}{" "}
                  available
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ — one centred column of full-width accordion cards. */}
        <section className="section-y">
          <h2 className="t-h2 mb-6 text-center text-[color:var(--color-ink)] md:mb-8">
            Frequently asked questions
          </h2>
          <div className="mx-auto flex max-w-[860px] flex-col gap-3">
            {faqs.map((f, i) => {
              const open = openFaqs.has(i);
              return (
                <div
                  key={f.q}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    open
                      ? "border-[color:var(--color-ink)] bg-white shadow-pop"
                      : "border-[color:var(--color-border)] bg-white hover:border-[color:var(--color-ink)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left md:p-6"
                  >
                    <span className="t-h4 text-[color:var(--color-ink)]">
                      {f.q}
                    </span>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        open
                          ? "rotate-180 bg-[color:var(--color-ink)] text-white"
                          : "bg-[color:var(--color-surface-soft)] text-[color:var(--color-ink)]"
                      }`}
                    >
                      <Icon name="chevron-down" size={17} strokeWidth={2.2} />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="t-body-lg px-5 pb-6 text-[color:var(--color-muted)] md:px-6">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Company blurb */}
        <section className="section-y">
          <h2 className="t-h2 mb-4 text-[color:var(--color-ink)]">DrukDrive</h2>
          <p className="t-body-lg max-w-[860px] text-[color:var(--color-muted)]">
            DrukDrive partners with trusted local operators across Bhutan to
            make it easy to find, compare and book the right vehicle for your
            trip — from daily rides around Thimphu to multi-day rentals and
            self-drive rentals for exploring the valleys and dzongkhags beyond.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
