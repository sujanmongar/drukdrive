import type { ReactElement, SVGProps } from "react";

// A small hand-authored icon set (generic line icons, not pulled from Figma —
// avoids depending on the 7-day-expiring Figma asset CDN for structural UI
// glyphs that repeat on every screen). Vehicle/profile photos still come
// from stable Unsplash/pravatar URLs in mockData.ts.

export type IconName =
  | "location"
  | "calendar"
  | "clock"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "bell"
  | "user"
  | "menu"
  | "close"
  | "search"
  | "star"
  | "heart"
  | "check"
  | "check-circle"
  | "upload"
  | "arrow-left"
  | "credit-card"
  | "bank"
  | "wallet"
  | "fuel"
  | "seat"
  | "filter"
  | "sort"
  | "car"
  | "phone"
  | "mail"
  | "lock"
  | "eye"
  | "eye-off"
  | "plus"
  | "trash"
  | "edit"
  | "logout"
  | "download"
  | "info"
  | "more"
  | "grid"
  | "list"
  | "gearbox"
  | "snowflake";

const paths: Record<IconName, ReactElement> = {
  location: (
    <>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1L12 2Z" />,
  heart: <path d="M12 20s-7-4.3-9.5-8.8C1 8 2.4 4.6 5.8 4a5 5 0 0 1 6.2 2.6A5 5 0 0 1 18.2 4c3.4.6 4.8 4 3.3 7.2C19 15.7 12 20 12 20Z" />,
  check: <path d="M4 12l5 5 11-11" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "credit-card": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  bank: (
    <>
      <path d="M3 10 12 4l9 6" />
      <path d="M4 10v9h16v-9M9 14v3M12 14v3M15 14v3" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="16" cy="14" r="1.5" />
    </>
  ),
  fuel: (
    <>
      <path d="M4 21V8a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v13" />
      <path d="M3 21h11M13 10h2l3 3v5a1.5 1.5 0 0 0 3 0v-6l-3-3" />
    </>
  ),
  seat: (
    <>
      <path d="M6 4v9a2 2 0 0 0 2 2h6" />
      <path d="M6 13H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <path d="M14 15h4l-1-6" />
    </>
  ),
  filter: <path d="M4 5h16M7 12h10M10 19h4" />,
  sort: <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />,
  car: (
    <>
      <path d="M4 16V11.5a2 2 0 0 1 .4-1.2l2-2.7A2 2 0 0 1 8 6.8h8a2 2 0 0 1 1.6.8l2 2.7a2 2 0 0 1 .4 1.2V16" />
      <path d="M2 16h20v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3Z" />
      <circle cx="7.5" cy="16" r="1.5" />
      <circle cx="16.5" cy="16" r="1.5" />
    </>
  ),
  phone: <path d="M6 3h3l1.5 5L8 9.5a12 12 0 0 0 6.5 6.5L16 14l5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.5 4.5M6.2 6.6C3.3 8.4 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    </>
  ),
  edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  gearbox: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
    </>
  ),
  snowflake: (
    <>
      <path d="M12 2v20M4.2 7l15.6 10M4.2 17l15.6-10" />
      <path d="M8 4.5 12 7l4-2.5M8 19.5 12 17l4 2.5M2.5 9.5 6 12l-3.5 2.5M21.5 9.5 18 12l3.5 2.5" />
    </>
  ),
};

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export default function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
