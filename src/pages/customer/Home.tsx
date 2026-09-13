import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import BookingTypeTabs from "../../components/BookingTypeTabs";
import VehicleCard from "../../components/VehicleCard";
import Icon from "../../components/Icon";
import { routes } from "../../lib/routes";
import type { BookingType } from "../../lib/routes";
import { vehicles, recentSearches, popularCarTypes, faqs } from "../../data/mockData";

type TripMode = "one-way" | "return";

export default function Home() {
  const navigate = useNavigate();
  const [type, setType] = useState<BookingType>("daily");
  const [tripMode, setTripMode] = useState<TripMode>("one-way");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const showTripModeTabs = type === "outstation" || type === "rental";

  function handleSearch() {
    navigate(`${routes.search}?type=${type}`);
  }

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        {/* decorative blob background, hero area only */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden md:h-[651px]">
          <div className="absolute -left-24 -top-24 size-[300px] rounded-full bg-[#f7e6c4] opacity-70 blur-3xl md:size-[520px]" />
          <div className="absolute -right-24 top-6 size-[260px] rounded-full bg-[#f7e6c4] opacity-60 blur-3xl md:size-[480px] md:top-10" />
          <div className="absolute left-1/3 top-52 size-[180px] rounded-full bg-[#f7e6c4] opacity-40 blur-3xl md:size-[300px] md:top-40" />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 md:px-[60px] md:pb-24 md:pt-16">
          <h1 className="max-w-md text-2xl font-bold leading-tight text-[rgba(0,0,0,0.87)] md:max-w-[46%] md:text-[32px] md:leading-[1.2]">
            Where you want to go? - search now.
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
                className="flex h-[58px] items-center gap-2 rounded-xl border border-[#e5ebf0] px-3 text-left"
              >
                <Icon name="location" size={20} className="shrink-0 text-[#222]" />
                <span className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#333]">Pick up location</span>
                  <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">Thimphu, Druk School</span>
                </span>
              </button>
              <button
                type="button"
                className="flex h-[58px] items-center gap-2 rounded-xl border border-[#e5ebf0] px-3 text-left"
              >
                <Icon name="location" size={20} className="shrink-0 text-[#222]" />
                <span className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#333]">Drop off location</span>
                  <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">Punakha, Taxi Parking</span>
                </span>
              </button>

              <div className="flex overflow-hidden rounded-xl border border-[#e5ebf0]">
                <button type="button" className="flex h-14 flex-1 items-center gap-2 px-3 text-left">
                  <Icon name="calendar" size={20} className="shrink-0 text-[#222]" />
                  <span className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#333]">Pick up date</span>
                    <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">Thu 24 Sep</span>
                  </span>
                </button>
                <div className="w-px bg-[#e5ebf0]" />
                <button type="button" className="flex h-14 flex-1 items-center gap-2 px-3 text-left">
                  <Icon name="clock" size={20} className="shrink-0 text-[#222]" />
                  <span className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#333]">Pick up time</span>
                    <span className="text-sm font-bold text-[rgba(0,0,0,0.87)]">10:00</span>
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold text-[#00b53a]">Duration: 3 hrs</p>

            <button
              type="button"
              onClick={handleSearch}
              className="mt-4 w-full rounded-xl bg-[#222] py-4 text-base font-bold text-white transition-colors hover:bg-black"
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
                className="flex h-[79px] shrink-0 items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-left shadow-[0px_1px_3px_rgba(25,32,36,0.16)]"
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
                className="relative size-[164px] shrink-0 overflow-hidden rounded-xl bg-cover bg-center"
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
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-b border-[#e5ebf0] py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm text-[rgba(0,0,0,0.87)]">{f.q}</span>
                    <Icon
                      name="chevron-down"
                      size={16}
                      className={`shrink-0 text-[rgba(0,0,0,0.87)] transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && <p className="mt-2 text-sm leading-[1.2] text-[color:var(--color-muted)]">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Company blurb */}
        <section className="py-8 md:py-10">
          <h2 className="mb-3 text-lg font-bold text-[rgba(0,0,0,0.87)] md:text-2xl">Heavenly Bhutan Travels</h2>
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
