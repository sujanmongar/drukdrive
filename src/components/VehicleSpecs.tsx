import Icon from "./Icon";
import type { Vehicle } from "../data/mockData";

// Compact at-a-glance spec strip: a bold icon carries the meaning, the text
// beside it is just the value (5, A, 4, …) rather than a spelled-out label.
export default function VehicleSpecs({ vehicle, className = "" }: { vehicle: Vehicle; className?: string }) {
  const items: { name: Parameters<typeof Icon>[0]["name"]; value: string; title: string }[] = [
    { name: "seat", value: String(vehicle.seats), title: `${vehicle.seats} seats` },
    { name: "door", value: String(vehicle.doors), title: `${vehicle.doors} doors` },
    { name: "luggage", value: String(vehicle.luggage), title: `${vehicle.luggage} bags` },
    {
      name: "gearbox",
      value: vehicle.transmission === "Automatic" ? "A" : "M",
      title: vehicle.transmission,
    },
    { name: "fuel", value: vehicle.fuel.charAt(0), title: vehicle.fuel },
  ];
  if (vehicle.ac) items.push({ name: "snowflake", value: "A/C", title: "Air conditioning" });

  return (
    <div className={`t-caption flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[color:var(--color-ink)] ${className}`}>
      {items.map((item) => (
        <span key={item.name} className="flex items-center gap-1" title={item.title}>
          <Icon name={item.name} size={15} strokeWidth={2.3} className="shrink-0 text-[color:var(--color-ink-soft)]" />
          <span className="font-semibold">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
