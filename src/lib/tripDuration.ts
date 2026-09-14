// Rough estimated driving duration between Bhutan towns, for the "Duration"
// hint on the Daily Rides search widget — no live routing API, so this is a
// static lookup keyed by city pair (approximate real-world drive times).

export function cityOf(address: string): string {
  return address.split(",")[0]?.trim() || address;
}

const DURATION_HOURS: Record<string, number> = {
  "Thimphu|Paro": 1,
  "Thimphu|Punakha": 3,
  "Thimphu|Phuentsholing": 6,
  "Thimphu|Bumthang": 8,
  "Paro|Punakha": 4,
  "Paro|Phuentsholing": 7,
  "Paro|Bumthang": 9,
  "Punakha|Phuentsholing": 5,
  "Punakha|Bumthang": 5,
  "Phuentsholing|Bumthang": 10,
};

export function estimateDurationHours(pickup: string, dropoff: string): number {
  const a = cityOf(pickup);
  const b = cityOf(dropoff);
  if (a === b) return 0.5;
  return DURATION_HOURS[`${a}|${b}`] ?? DURATION_HOURS[`${b}|${a}`] ?? 3;
}

export function formatDurationHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} mins`;
  if (Number.isInteger(hours)) return `${hours} hr${hours === 1 ? "" : "s"}`;
  return `${hours.toFixed(1)} hrs`;
}
