import { formatDate } from "./dates";
// Single place that turns a pickup date + time into the display string
// threaded through the booking funnel (ReviewBooking, Payment, Confirmation,
// Invoice) so every screen shows the same format.
export function formatTripDate(date: Date, time: string): string {
  const day = formatDate(date, "weekday");
  return `${day}, ${time}`;
}
