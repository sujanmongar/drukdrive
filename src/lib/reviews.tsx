import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { reviews as defaultReviews, type Review } from "../data/mockData";

// Reviews written from within the app, persisted to localStorage. Each one
// belongs to a completed booking, so a trip can be reviewed once.
// v2: reviews gained bookingId/vehicleId; older stored lists are dropped.
const STORAGE_KEY = "drukdrive:reviews:v2";

type NewReview = Omit<Review, "id" | "date">;

type ReviewsContextValue = {
  reviews: Review[];
  addReview: (review: NewReview) => void;
  /** True once this booking has a review. */
  isReviewed: (bookingId: string) => boolean;
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
      isReviewed: (bookingId: string) =>
        reviews.some((r) => r.bookingId === bookingId),
      addReview: (review: NewReview) => {
        const newReview: Review = {
          id: `r${Date.now()}`,
          // ISO date like the seeded reviews; formatted in the site
          // language where it is shown.
          date: new Date().toISOString().slice(0, 10),
          ...review,
        };
        setReviews((prev) => [newReview, ...prev]);
      },
    }),
    [reviews],
  );

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
