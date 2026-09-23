import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "./Icon";
import Button from "./Button";
import EmptyState from "./EmptyState";
import VehicleImage from "./VehicleImage";
import WriteReviewModal, { type ReviewTarget } from "./WriteReviewModal";
import { useReviews } from "../lib/reviews";
import {
  bookings,
  driverBookings,
  vehicles,
  type Review,
} from "../data/mockData";
import { card } from "../lib/ui";
import { t, tr } from "../lib/i18n";

import { formatStored } from "../lib/dates";
function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={t("{rating} out of 5 stars", { rating })}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          size={14}
          className={
            n <= rating
              ? "fill-current text-[color:var(--color-star)]"
              : "text-[color:var(--color-border)]"
          }
        />
      ))}
    </div>
  );
}

const vehicleOf = (id: string) => vehicles.find((v) => v.id === id);
const vehicleName = (id: string) => vehicleOf(id)?.name ?? t("Vehicle");
const categoryOf = (id: string) => vehicleOf(id)?.category ?? "Prime SUV";

function ReviewCard({ r, showAuthor }: { r: Review; showAuthor: boolean }) {
  return (
    <div className={`${card} flex gap-4 p-4`}>
      {showAuthor ? (
        <img
          src={r.avatar}
          alt=""
          className="size-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--color-surface-soft)]">
          <VehicleImage
            vehicleId={r.vehicleId}
            category={categoryOf(r.vehicleId)}
            transparent
            className="size-full p-1"
          />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
            {showAuthor ? r.author : vehicleName(r.vehicleId)}
          </p>
          <span className="t-caption">{formatStored(r.date)}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Stars rating={r.rating} />
          <span className="t-caption">
            {showAuthor
              ? vehicleName(r.vehicleId)
              : t("Booking {id}", { id: r.bookingId })}
          </span>
        </div>
        <p className="mt-2 t-body-sm">{r.comment}</p>
      </div>
    </div>
  );
}

// Drivers see what riders said about their vehicles. Renters see the trips
// they can still review and the reviews they have written; only a completed
// trip of their own can be reviewed, once.
export default function ReviewsList({ role }: { role: "customer" | "driver" }) {
  const { reviews, isReviewed } = useReviews();
  const [searchParams, setSearchParams] = useSearchParams();

  const mine = useMemo(() => {
    const ids = new Set(
      (role === "driver" ? driverBookings : bookings).map((b) => b.id),
    );
    return reviews.filter((r) => ids.has(r.bookingId));
  }, [reviews, role]);

  const pending: ReviewTarget[] =
    role === "customer"
      ? bookings
          .filter((b) => b.status === "Completed" && !isReviewed(b.id))
          .map((b) => ({
            bookingId: b.id,
            vehicleId: b.vehicleId,
            vehicleName: vehicleName(b.vehicleId),
            trip: `${formatStored(b.date)} · ${b.pickup} → ${b.dropoff}`,
          }))
      : [];

  // Notifications link here with ?write=<bookingId>.
  const requested = searchParams.get("write");
  const [writing, setWriting] = useState<ReviewTarget | null>(
    () => pending.find((p) => p.bookingId === requested) ?? null,
  );
  function closeWriter() {
    setWriting(null);
    if (searchParams.has("write")) {
      searchParams.delete("write");
      setSearchParams(searchParams, { replace: true });
    }
  }

  const avg = mine.length
    ? (mine.reduce((s, r) => s + r.rating, 0) / mine.length).toFixed(1)
    : null;
  const avgEl = (
    <span className="font-semibold text-[color:var(--color-ink)]">{avg}</span>
  );

  return (
    <>
      <h2 className="t-h2">{t("Reviews")}</h2>
      <p className="mt-1 flex items-center gap-1.5 t-body-sm text-[color:var(--color-muted)]">
        {role === "driver" ? (
          avg ? (
            <>
              <Icon
                name="star"
                size={14}
                className="fill-current text-[color:var(--color-star)]"
              />
              {mine.length === 1
                ? tr("{avg} from {n} rider review", { avg: avgEl, n: 1 })
                : tr("{avg} from {n} rider reviews", {
                    avg: avgEl,
                    n: mine.length,
                  })}
            </>
          ) : (
            t("What riders say about your vehicles.")
          )
        ) : (
          t("Rate the vehicles you've travelled in.")
        )}
      </p>

      {pending.length > 0 && (
        <section className="mt-6">
          <h3 className="t-h4">{t("Waiting for your review")}</h3>
          <div className="mt-3 flex flex-col gap-3">
            {pending.map((p) => (
              <div
                key={p.bookingId}
                className={`${card} flex flex-wrap items-center gap-4 p-4`}
              >
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--color-surface-soft)]">
                  <VehicleImage
                    vehicleId={p.vehicleId}
                    category={categoryOf(p.vehicleId)}
                    transparent
                    className="size-full p-1"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                    {p.vehicleName}
                  </p>
                  <p className="t-caption">{p.trip}</p>
                </div>
                <Button size="md" onClick={() => setWriting(p)}>
                  {t("Write review")}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {mine.length > 0 ? (
        <section className="mt-8">
          {role === "customer" && <h3 className="t-h4">{t("Your reviews")}</h3>}
          <div
            className={`${role === "customer" ? "mt-3" : "mt-0"} flex flex-col gap-4`}
          >
            {mine.map((r) => (
              <ReviewCard key={r.id} r={r} showAuthor={role === "driver"} />
            ))}
          </div>
        </section>
      ) : (
        pending.length === 0 && (
          <EmptyState
            icon="star"
            title={t("No reviews yet")}
            description={
              role === "driver"
                ? t(
                    "Riders can review your vehicle once their trip is complete.",
                  )
                : t(
                    "You can review a vehicle once your trip with it is complete.",
                  )
            }
          />
        )
      )}

      {writing && <WriteReviewModal target={writing} onClose={closeWriter} />}
    </>
  );
}
