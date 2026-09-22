import { useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import { useCurrentUser } from "../lib/currentUser";
import { useReviews } from "../lib/reviews";
import { fieldError, label, sheet, textarea } from "../lib/ui";

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
    addReview({
      author: user.name,
      avatar: user.avatar,
      rating,
      comment: comment.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <button
        aria-label="Close"
        className="animate-scrim-in absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />
      {/* A bottom sheet on phones (flat bottom edge), a centred dialog above. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
        className={`${sheet} relative flex w-full max-w-[440px] flex-col p-5 sm:rounded-b-3xl`}
      >
        <div className="flex items-center justify-between">
          <h2 id="write-review-title" className="t-h3">
            Write a review
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="icon-btn icon-btn-filled -mr-1 size-10"
          >
            <Icon
              name="close"
              size={20}
              className="text-[color:var(--color-ink)]"
            />
          </button>
        </div>

        <p className={`mt-4 ${label}`}>Your rating</p>
        <div className="flex items-center gap-1.5">
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
                className={
                  (hoverRating || rating) >= n
                    ? "fill-current text-[color:var(--color-star)]"
                    : "text-[color:var(--color-border)]"
                }
              />
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className={label}>Your review</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share how your trip went..."
            className={`${textarea} resize-none ${
              touched && !isValid ? "border-[color:var(--color-danger)]" : ""
            }`}
          />
          {touched && !isValid && (
            <p className={fieldError}>Write a few words before submitting.</p>
          )}
        </label>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-5"
          onClick={handleSubmit}
        >
          Submit review
        </Button>
      </div>
    </div>
  );
}
