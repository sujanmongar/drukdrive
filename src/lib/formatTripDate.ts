// Single place that turns a pickup date + time into the display string
// threaded through the booking funnel (VehicleDetails, ReviewBooking,
// Payment, Confirmation, Invoice) so every screen shows the same format.
export function formatTripDate(date: Date, time: string): string {
  const day = date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  return `${day}, ${time}`;
}
