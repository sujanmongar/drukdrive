import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "./Icon";
import Button from "./Button";
import EmptyState from "./EmptyState";
import WriteReviewModal from "./WriteReviewModal";
import { useReviews } from "../lib/reviews";
import { card } from "../lib/ui";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={14}
          className={
            i < rating
              ? "fill-current text-[color:var(--color-star)]"
              : "text-[color:var(--color-border)]"
          }
        />
      ))}
    </div>
  );
}

// The reviews page body for both roles: title with the average, a write
// button, then one card per review.
export default function ReviewsList() {
  const { reviews } = useReviews();
  // "Rate your experience" notifications land here with ?write=1.
  const [searchParams, setSearchParams] = useSearchParams();
  const [writing, setWriting] = useState(searchParams.get("write") === "1");
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "0.0";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="t-h2">Reviews</h2>
          {reviews.length > 0 && (
            <p className="mt-1 flex items-center gap-1.5 t-body-sm text-[color:var(--color-muted)]">
              <Icon
                name="star"
                size={14}
                className="fill-current text-[color:var(--color-star)]"
              />
              <span className="font-semibold text-[color:var(--color-ink)]">
                {avgRating}
              </span>{" "}
              avg. of {reviews.length}
            </p>
          )}
        </div>
        <Button variant="primary" size="md" onClick={() => setWriting(true)}>
          Write review
        </Button>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon="star"
          title="No reviews yet"
          description="Reviews show up here once a trip has been rated."
        />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r.id} className={`${card} flex gap-4 p-4`}>
              <img
                src={r.avatar}
                alt={r.author}
                className="size-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="t-body-sm font-semibold text-[color:var(--color-ink)]">
                    {r.author}
                  </p>
                  <span className="t-caption">{r.date}</span>
                </div>
                <div className="mt-1">
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-2 t-body-sm">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {writing && (
        <WriteReviewModal
          onClose={() => {
            setWriting(false);
            if (searchParams.has("write")) {
              searchParams.delete("write");
              setSearchParams(searchParams, { replace: true });
            }
          }}
        />
      )}
    </>
  );
}
