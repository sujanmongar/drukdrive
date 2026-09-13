const accentByCategory: Record<string, string> = {
  "Prime SUV": "#94a3b8",
  "Sedan SUV": "#a5b4c4",
  "Mini Bus": "#93a5b1",
  Bus: "#9caebb",
  "Two Wheels": "#a8a29e",
};

// A clean, generic car illustration used everywhere a vehicle "photo" would
// go — avoids depending on specific stock photography for a prototype.
export default function VehicleImage({
  category,
  className = "",
}: {
  category?: string;
  className?: string;
}) {
  const accent = (category && accentByCategory[category]) || "#9ca3af";
  return (
    <div className={`flex items-center justify-center bg-neutral-100 ${className}`}>
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
        <rect x="18" y="60" width="166" height="10" rx="5" fill="#222" opacity="0.85" />
        <circle cx="56" cy="72" r="14" fill="#222" />
        <circle cx="56" cy="72" r="6" fill="#cbd5e1" />
        <circle cx="146" cy="72" r="14" fill="#222" />
        <circle cx="146" cy="72" r="6" fill="#cbd5e1" />
      </svg>
    </div>
  );
}
