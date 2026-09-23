import { t, tx } from "./i18n";

// Dates in the site language. Browsers only ship date names for some
// languages (Dzongkha and Nepali are often missing), so the names and the
// order come from the dictionaries instead of Intl.

const WEEKDAYS = [
  tx("Sun"),
  tx("Mon"),
  tx("Tue"),
  tx("Wed"),
  tx("Thu"),
  tx("Fri"),
  tx("Sat"),
];
const MONTHS = [
  tx("Jan"),
  tx("Feb"),
  tx("Mar"),
  tx("Apr"),
  tx("May"),
  tx("Jun"),
  tx("Jul"),
  tx("Aug"),
  tx("Sep"),
  tx("Oct"),
  tx("Nov"),
  tx("Dec"),
];
const MONTHS_LONG = [
  tx("January"),
  tx("February"),
  tx("March"),
  tx("April"),
  tx("May"),
  tx("June"),
  tx("July"),
  tx("August"),
  tx("September"),
  tx("October"),
  tx("November"),
  tx("December"),
];

export type DateStyle =
  | "weekday" // Thu 24 Sep
  | "day" // 24 Sep
  | "full" // 24 Sep 2026
  | "month"; // September 2026

export function formatDate(d: Date, style: DateStyle): string {
  const vars = {
    weekday: t(WEEKDAYS[d.getDay()]),
    day: d.getDate(),
    month: t(MONTHS[d.getMonth()]),
    monthLong: t(MONTHS_LONG[d.getMonth()]),
    year: d.getFullYear(),
  };
  if (style === "weekday") return t("{weekday} {day} {month}", vars);
  if (style === "day") return t("{day} {month}", vars);
  if (style === "full") return t("{day} {month} {year}", vars);
  return t("{monthLong} {year}", vars);
}

/** "2026-09-24T10:00" → "Thu 24 Sep, 10:00"; a plain "2026-09-08" → "8 Sep 2026".
 *  Anything else (text saved by an older version) is shown as it is. */
export function formatStored(value: string): string {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}))?/);
  if (!m) return value;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return m[4] ? `${formatDate(d, "weekday")}, ${m[4]}` : formatDate(d, "full");
}
