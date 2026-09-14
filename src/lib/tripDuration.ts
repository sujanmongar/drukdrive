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

// Whole calendar days between two dates (ignoring time-of-day) — for
// Rental's "Duration: N days".
export function daysBetween(start: Date, end: Date): number {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const b = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

// Merge a date with an "HH:MM" time string into one Date.
export function combineDateTime(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(h || 0, m || 0, 0, 0);
  return combined;
}

// Precise day+hour breakdown between two date-times — for Self Drive's
// "Duration: N days M hrs".
export function daysHoursBetween(start: Date, end: Date): { days: number; hours: number } {
  const totalHours = Math.max(0, Math.round((end.getTime() - start.getTime()) / 3_600_000));
  return { days: Math.floor(totalHours / 24), hours: totalHours % 24 };
}

export function formatDayHour({ days, hours }: { days: number; hours: number }): string {
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0 || days === 0) parts.push(`${hours} hr${hours === 1 ? "" : "s"}`);
  return parts.join(" ");
}
