import { t } from "../lib/i18n";

const accentByCategory: Record<string, string> = {
  "Prime SUV": "#94a3b8",
  "Sedan SUV": "#a5b4c4",
  "Mini Bus": "#93a5b1",
  Bus: "#9caebb",
  "Two Wheels": "#a8a29e",
};

// Real, license-free product photography (plain background, no landscape)
// for each specific vehicle we have a matching photo for. Anything without
// one — a category browse tile, or a vehicle we haven't photographed —
// falls back to the flat illustration below, tinted by category.
const photoByVehicleId: Record<string, string> = {
  "toyota-prado-gx": "/vehicles/toyota-prado-gx.webp",
  "toyota-coaster-bus": "/vehicles/toyota-coaster-bus.webp",
  "toyota-hiace-bus": "/vehicles/toyota-hiace-bus.webp",
  "hyundai-santa-fe": "/vehicles/hyundai-santa-fe.webp",
  "toyota-innova": "/vehicles/toyota-innova.webp",
  "hyundai-creta": "/vehicles/hyundai-creta.webp",
  "royal-enfield-meteor": "/vehicles/royal-enfield.webp",
};

export default function VehicleImage({
  vehicleId,
  category,
  className = "",
  fit = "contain",
  transparent = false,
  padded = true,
}: {
  vehicleId?: string;
  category?: string;
  className?: string;
  /** "contain" (default) keeps the whole car visible — right for
   * cards/thumbnails. "cover" fills the frame edge-to-edge, cropping —
   * right for fixed-aspect hero tiles like the "Popular car types" grid. */
  fit?: "contain" | "cover";
  /** Drop the neutral backdrop — for cards whose own container already
   * supplies a background (or wants the card's own bg to show through). */
  transparent?: boolean;
  /** Inset the (contain-fit) photo slightly so it doesn't touch the frame.
   * Set false for edge-to-edge cards that want the photo flush to the box. */
  padded?: boolean;
}) {
  const photo = vehicleId && photoByVehicleId[vehicleId];
  if (photo) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${transparent ? "" : "bg-[color:var(--color-surface-soft)]"} ${className}`}
      >
        <img
          src={photo}
          alt={category ? t(category) : ""}
          loading="lazy"
          className={
            fit === "cover"
              ? "h-full w-full object-cover"
              : `h-full w-full object-contain ${padded ? "p-2" : ""}`
          }
        />
      </div>
    );
  }

  const accent = (category && accentByCategory[category]) || "#9ca3af";
  return (
    <div
      className={`flex items-center justify-center ${transparent ? "" : "bg-[color:var(--color-surface-soft)]"} ${className}`}
    >
      <svg viewBox="0 0 200 100" className="h-[62%] w-[82%]" aria-hidden="true">
        <ellipse cx="100" cy="82" rx="78" ry="6" fill="#00000012" />
        <path
          d="M20 66 L28 44 Q34 34 46 32 L74 28 Q84 20 100 20 L124 20 Q138 20 146 30 L162 42 Q178 44 182 58 L182 66 Z"
          fill={accent}
        />
        <path
          d="M52 32 L78 30 Q86 24 98 24 L118 24 Q130 24 137 32 L146 40 L58 40 Z"
          fill="#e5eaf0"
          opacity="0.9"
        />
        <rect
          x="18"
          y="60"
          width="166"
          height="10"
          rx="5"
          fill="#222"
          opacity="0.85"
        />
        <circle cx="56" cy="72" r="14" fill="#222" />
        <circle cx="56" cy="72" r="6" fill="#cbd5e1" />
        <circle cx="146" cy="72" r="14" fill="#222" />
        <circle cx="146" cy="72" r="6" fill="#cbd5e1" />
      </svg>
    </div>
  );
}
