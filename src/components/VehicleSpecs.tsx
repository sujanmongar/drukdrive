import Icon from "./Icon";
import type { Vehicle } from "../data/mockData";

// Compact at-a-glance spec strip: a bold icon carries the meaning, the text
// beside it is just the value (5, A, 4, …) rather than a spelled-out label.
export default function VehicleSpecs({ vehicle, className = "" }: { vehicle: Vehicle; className?: string }) {
  const items: { name: Parameters<typeof Icon>[0]["name"]; value: string; title: string }[] = [
    { name: "seat", value: String(vehicle.seats), title: `${vehicle.seats} seats` },
    {
      name: "gearbox",
      value: vehicle.transmission === "Automatic" ? "A" : "M",
      title: vehicle.transmission,
    },
    { name: "fuel", value: vehicle.fuel.charAt(0), title: vehicle.fuel },
  ];
  if (vehicle.ac) items.push({ name: "snowflake", value: "A/C", title: "Air conditioning" });

  return (
    // Single line, always: the strip is a scannable at-a-glance row, so it
    // tightens rather than wrapping a stray spec onto its own line.
    <div
      className={`flex flex-nowrap items-center gap-3 text-[11px] leading-none text-[color:var(--color-ink)] sm:gap-3.5 sm:text-xs ${className}`}
    >
      {items.map((item) => (
        <span key={item.name} className="flex shrink-0 items-center gap-1 whitespace-nowrap" title={item.title}>
          <Icon
            name={item.name}
            size={14}
            strokeWidth={2.3}
            className="shrink-0 text-[color:var(--color-ink-soft)]"
          />
          <span className="font-semibold">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
