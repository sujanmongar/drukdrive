import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import VehicleImage from "../../components/VehicleImage";
import Icon from "../../components/Icon";
import SectionHeader from "../../components/SectionHeader";
import Reveal from "../../components/Reveal";
import SearchFields from "../../components/SearchFields";
import Button from "../../components/Button";
import { cardLink } from "../../lib/ui";
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
            <h1 className="t-h1 max-w-[280px] sm:max-w-md md:max-w-[560px]">
              Go anywhere in Bhutan.
            </h1>

            {/* The type strip floats over the top edge of the search card,
                so the switch and the search read as one control. */}
            <div className="relative z-10 mt-10 flex justify-center md:mt-12 lg:justify-start lg:pl-6">
              <BookingTypeTabs value={type} onChange={setType} />
            </div>

            <div className="relative -mt-6 w-full rounded-2xl bg-white p-5 pt-11 shadow-modal md:p-6 md:pt-12">
              <div>
                <SearchFields
                  value={search}
                  onChange={setSearch}
                  layout="row"
                  anchored
                  action={
                    /* Desktop: the search action sits at the end of the field row. */
                    <div className="hidden lg:flex">
                      <Button
                        size="lg"
                        onClick={handleSearch}
                        className="h-14 px-8"
                      >
                        Search
                      </Button>
                    </div>
                  }
                />
              </div>

              <Button
                size="lg"
                fullWidth
                onClick={handleSearch}
                className="mt-5 h-14 lg:hidden"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Recent searches */}
        <section className="section-y">
          <Reveal>
            <SectionHeader title="Recent searches" trackRef={recentTrackRef} />
            <div
              ref={recentTrackRef}
              className="carousel-track -mx-4 -mb-8 flex gap-4 overflow-x-auto px-4 pb-8 pt-3 md:-mx-6 md:px-6"
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
                    className={`${cardLink} flex shrink-0 items-center gap-4 p-4 text-left`}
                  >
                    <VehicleImage
                      vehicleId={vehicle?.id}
                      category={vehicle?.category}
                      className="size-16 shrink-0 rounded-xl"
                    />
                    <span className="flex flex-col gap-1">
                      <span className="t-h4 whitespace-nowrap">{s.title}</span>
                      <span className="t-caption whitespace-nowrap">
                        {s.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </section>
      </div>

      {/* Popular cars — a full-bleed tinted band so the white cards and their
          hover shadow read against a ground. Content stays on the grid. */}
      <section className="section-y bg-[color:var(--color-surface-subtle)]">
        <Reveal>
          <div className="mx-auto max-w-[1280px] px-4 md:px-10">
            <SectionHeader title="Popular cars" trackRef={carsTrackRef} />
            <div
              ref={carsTrackRef}
              className="carousel-track -mx-4 -mb-8 flex gap-5 overflow-x-auto px-4 pb-8 pt-3 md:-mx-6 md:px-6"
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
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        {/* Popular car types — photo tiles, paged by the header arrows. */}
        <section className="section-y">
          <Reveal>
            <SectionHeader title="Popular car types" trackRef={typesTrackRef} />
            <div
              ref={typesTrackRef}
              className="carousel-track -mx-4 -mb-8 flex gap-4 overflow-x-auto px-4 pb-8 pt-3 md:-mx-6 md:gap-5 md:px-6"
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
                  <div className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--color-surface-sunken)] transition-colors duration-150 group-hover:bg-[color:var(--color-surface-soft)]">
                    <VehicleImage
                      vehicleId={t.vehicleId}
                      category={t.category}
                      transparent
                      className="size-full p-5 transition-transform duration-200 group-hover:scale-[1.06]"
                    />
                  </div>
                  <p className="t-h4 mt-3">{t.label}</p>
                  <p className="t-caption">
                    {vehicles.filter((v) => v.category === t.category).length}{" "}
                    available
                  </p>
                </button>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FAQ — one centred column of full-width accordion cards. */}
        <section className="section-y">
          <Reveal>
            <h2 className="t-h3 mb-6 text-center md:mb-8">
              Frequently asked questions
            </h2>
            <div className="mx-auto flex max-w-[860px] flex-col gap-3">
              {faqs.map((f, i) => {
                const open = openFaqs.has(i);
                // Closed, the whole card is the toggle, so it hovers like any
                // clickable card; open, it holds the answer and rests.
                return (
                  <div
                    key={f.q}
                    className={`overflow-hidden ${
                      open
                        ? "rounded-2xl border border-[color:var(--color-ink)] bg-white shadow-pop transition-all duration-200"
                        : cardLink
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left md:p-6"
                    >
                      <span className="t-h4">{f.q}</span>
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
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
          </Reveal>
        </section>

        {/* Company blurb */}
        <section className="section-y">
          <Reveal>
            <h2 className="t-h3 mb-4">DrukDrive</h2>
            <p className="t-body-lg max-w-[860px] text-[color:var(--color-muted)]">
              DrukDrive partners with trusted local operators across Bhutan to
              make it easy to find, compare and book the right vehicle for your
              trip — from daily rides around Thimphu to multi-day rentals and
              self-drive rentals for exploring the valleys and dzongkhags
              beyond.
            </p>
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}
