import { Link } from "react-router-dom";
import Icon from "./Icon";
import type { Vehicle } from "../data/mockData";
import { routes } from "../lib/routes";

export default function VehicleCard({ vehicle, className = "" }: { vehicle: Vehicle; className?: string }) {
  return (
    <div
      className={`w-full shrink-0 overflow-hidden rounded-xl bg-white shadow-[0px_1px_3px_rgba(25,32,36,0.16)] ${className}`}
    >
      <div className="relative h-[178px] w-full">
        <img src={vehicle.image} alt={vehicle.name} className="size-full object-cover" />
        <button
          aria-label="Save"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90"
        >
          <Icon name="heart" size={16} className="text-[#222]" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <p className="text-base font-bold text-[#222]">{vehicle.name}</p>
          <span className="rounded-full bg-[color:var(--color-info-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[color:var(--color-info-text)]">
            {vehicle.category}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-[#222]">
          <Icon name="location" size={14} />
          {vehicle.location}
          <span className="text-[color:var(--color-muted)]">•</span>
          {vehicle.type}
        </div>
        <div className="mb-3 flex items-center gap-3 text-xs text-[#222]">
          <span className="flex items-center gap-1">
            <Icon name="seat" size={15} />
            {vehicle.seats} Seats
          </span>
          <span className="flex items-center gap-1">
            <Icon name="fuel" size={15} />
            {vehicle.fuel}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="star" size={13} className="fill-current text-amber-400" />
            {vehicle.rating} ({vehicle.reviewCount})
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#222]">${vehicle.pricePerDay}</span>
              <span className="text-xs text-[#222]">/day</span>
              {vehicle.strikePrice && (
                <span className="text-xs text-red-500 line-through">${vehicle.strikePrice}</span>
              )}
            </div>
            <p className="text-[10px] text-[color:var(--color-muted)]">incl. taxes & fees</p>
          </div>
          <Link
            to={routes.vehicle(vehicle.id)}
            className="rounded-xl bg-[#222] px-5 py-2.5 text-xs font-bold text-white hover:bg-black"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
