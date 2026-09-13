import type { BookingType } from "../lib/routes";

// Decorative organic-blob hero background, recreated to match the Figma
// design (one blob layout, recolored per booking type — cream/mint/blue).

const themes: Record<BookingType, { bg: string; blob: string }> = {
  daily: { bg: "#fdf3dd", blob: "#fce7ae" },
  outstation: { bg: "#e1fbec", blob: "#c6f5da" },
  rental: { bg: "#e2f5fc", blob: "#c6ecfa" },
  "self-drive": { bg: "#fdf3dd", blob: "#fce7ae" },
};

export default function HeroBlobs({ type, className = "" }: { type: BookingType; className?: string }) {
  const { bg, blob } = themes[type];
  return (
    <svg
      className={`absolute inset-0 size-full ${className}`}
      viewBox="0 0 2000 912"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="2000" height="912" fill={bg} />
      <path
        d="M -100,20 C -60,-110 180,-150 340,-40 C 420,20 400,120 300,160 C 180,205 20,190 -60,110 C -100,70 -110,50 -100,20 Z"
        fill={blob}
      />
      <path
        d="M 1560,20 C 1700,10 1840,90 1825,195 C 1810,290 1700,345 1575,338 C 1450,332 1285,292 1280,190 C 1276,88 1420,30 1560,20 Z"
        fill={blob}
      />
      <path
        d="M -120,560 C -145,435 20,368 165,374 C 325,380 472,462 466,592 C 460,724 330,812 178,817 C 28,822 -98,700 -120,560 Z"
        fill={blob}
      />
      <path
        d="M 1750,780 C 1770,698 1902,688 1994,730 C 2084,772 2112,864 2060,924 C 2008,974 1878,978 1798,932 C 1748,902 1734,840 1750,780 Z"
        fill={blob}
      />
    </svg>
  );
}
