import { useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import { useCurrentUser } from "../lib/currentUser";
import { useReviews } from "../lib/reviews";

export default function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const { user } = useCurrentUser();
  const { addReview } = useReviews();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = comment.trim().length > 0;

  function handleSubmit() {
    if (!isValid) {
      setTouched(true);
      return;
    }
    addReview({ author: user.name, avatar: user.avatar, rating, comment: comment.trim() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div className="flex w-full max-w-[440px] flex-col rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="t-h3 text-[color:var(--color-ink)]">Write a review</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} className="text-[color:var(--color-ink)]" />
          </button>
        </div>

        <p className="mt-4 text-xs font-medium text-[color:var(--color-muted)]">Your rating</p>
        <div className="mt-2 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <Icon
                name="star"
                size={28}
                className={(hoverRating || rating) >= n ? "fill-current text-[color:var(--color-star)]" : "text-[color:var(--color-border)]"}
              />
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-[color:var(--color-muted)]">Your review</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share how your trip went..."
            className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-ink)] ${
              touched && !isValid ? "border-[color:var(--color-danger)]" : "border-[color:var(--color-border)]"
            }`}
          />
          {touched && !isValid && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">Write a few words before submitting.</p>
          )}
        </label>

        <Button variant="primary" size="lg" fullWidth className="mt-5" onClick={handleSubmit}>
          Submit review
        </Button>
      </div>
    </div>
  );
}
