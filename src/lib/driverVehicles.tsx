import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { driverVehicles as defaultVehicles, type DriverVehicle } from "../data/mockData";

// The signed-in driver's vehicle fleet — persisted to localStorage so
// add/edit/remove from "My Vehicle" is real and survives a refresh.
const STORAGE_KEY = "drukdrive:driverVehicles";

type DriverVehiclesContextValue = {
  vehicles: DriverVehicle[];
  addVehicle: (vehicle: Omit<DriverVehicle, "id">) => DriverVehicle;
  updateVehicle: (id: string, patch: Partial<DriverVehicle>) => void;
  removeVehicle: (id: string) => void;
};

const DriverVehiclesContext = createContext<DriverVehiclesContextValue | null>(null);

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "vehicle"
  );
}

export function DriverVehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<DriverVehicle[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DriverVehicle[]) : defaultVehicles;
    } catch {
      return defaultVehicles;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      // ignore
    }
  }, [vehicles]);

  const value = useMemo(
    () => ({
      vehicles,
      addVehicle: (vehicle: Omit<DriverVehicle, "id">) => {
        const base = slugify(vehicle.name);
        const existingIds = new Set(vehicles.map((v) => v.id));
        let id = base;
        let n = 2;
        while (existingIds.has(id)) {
          id = `${base}-${n}`;
          n += 1;
        }
        const newVehicle: DriverVehicle = { ...vehicle, id };
        setVehicles((prev) => [newVehicle, ...prev]);
        return newVehicle;
      },
      updateVehicle: (id: string, patch: Partial<DriverVehicle>) =>
        setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v))),
      removeVehicle: (id: string) => setVehicles((prev) => prev.filter((v) => v.id !== id)),
    }),
    [vehicles],
  );

  return <DriverVehiclesContext.Provider value={value}>{children}</DriverVehiclesContext.Provider>;
}

export function useDriverVehicles() {
  const ctx = useContext(DriverVehiclesContext);
  if (!ctx) throw new Error("useDriverVehicles must be used within DriverVehiclesProvider");
  return ctx;
}
