import { useState } from "react";
import PageShell from "../../components/PageShell";
import SecondaryTabs from "../../components/SecondaryTabs";
import ProfileHero from "../../components/ProfileHero";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import WriteReviewModal from "../../components/WriteReviewModal";
import { useReviews } from "../../lib/reviews";
import { routes } from "../../lib/routes";
import { providerTabs } from "./_tabs";
import { usePageTitle } from "../../hooks/usePageTitle";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={14}
          className={i < rating ? "fill-current text-amber-400" : "text-neutral-200"}
        />
      ))}
    </div>
  );
}

export default function ProviderReviews() {
  usePageTitle("Driver Reviews");
  const { reviews } = useReviews();
  const [writing, setWriting] = useState(false);
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <PageShell>
      <ProfileHero editHref={routes.providerAccountEdit} reviewHref={routes.providerReviews} />
      <div className="mt-6 md:mt-8">
        <SecondaryTabs tabs={providerTabs} />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="t-h2 text-[color:var(--color-ink)]">Reviews</h2>
            {reviews.length > 0 && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[color:var(--color-muted)]">
                <Icon name="star" size={14} className="fill-current text-amber-400" />
                <span className="font-semibold text-[color:var(--color-ink)]">{avgRating}</span> avg. of {reviews.length}
              </p>
            )}
          </div>
          <Button variant="primary" size="sm" onClick={() => setWriting(true)}>
            Write review
          </Button>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[color:var(--color-border)] py-16 text-center">
            <Icon name="star" size={32} className="text-[color:var(--color-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[color:var(--color-ink)]">You don&rsquo;t have any reviews</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="flex gap-4 rounded-xl border border-[color:var(--color-border)] p-4">
                <img src={r.avatar} alt={r.author} className="size-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[color:var(--color-ink)]">{r.author}</p>
                    <span className="text-xs text-[color:var(--color-muted)]">{r.date}</span>
                  </div>
                  <div className="mt-1">
                    <Stars rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {writing && <WriteReviewModal onClose={() => setWriting(false)} />}
    </PageShell>
  );
}
