import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { reviews as defaultReviews, type Review } from "../data/mockData";

// Reviews written from within the app — persisted to localStorage so
// "Write review" actually adds a real, visible review instead of being a
// dead button.
const STORAGE_KEY = "drukdrive:reviews";

type ReviewsContextValue = {
  reviews: Review[];
  addReview: (review: { author: string; avatar: string; rating: number; comment: string }) => void;
};

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Review[]) : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  const value = useMemo(
    () => ({
      reviews,
      addReview: (review: { author: string; avatar: string; rating: number; comment: string }) => {
        const newReview: Review = {
          id: `r${Date.now()}`,
          date: new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }),
          ...review,
        };
        setReviews((prev) => [newReview, ...prev]);
      },
    }),
    [reviews],
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
