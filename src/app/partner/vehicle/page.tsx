import Image from "next/image";
import type { ReactNode } from "react";
import {
  CalendarCheck,
  Camera,
  CarFront,
  IndianRupee,
  MessageCircle,
  Route,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

import { StatusBadge } from "@/components/DashboardBits";
import { SiteHeader } from "@/components/SiteHeader";
import { leads, vehicles } from "@/lib/data";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/utils";

const rateRows = [
  { label: "Airport pickup", rate: 2600 },
  { label: "Udupi local 8 hr", rate: 4200 },
  { label: "Agumbe day trip", rate: 6800 },
  { label: "Mangalore transfer", rate: 5200 },
];

export default function VehiclePartnerPage() {
  const vehicle = vehicles[0];
  const tripLeads = leads.filter((lead) => lead.requirement.toLowerCase().includes("innova") || lead.people >= 4);

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <SiteHeader />
      <section className="mx-auto max-w-none px-5 pb-20 pt-28 sm:px-8 lg:px-10 2xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-coral">
              Tourist Vehicle Owner
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
              Vehicle availability dashboard
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone">
              Update vehicle availability, driver details, rates, package
              routes, photos, and trip enquiry history.
            </p>
          </div>

          <article className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
            <div className="relative aspect-[16/8]">
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-3xl font-black">{vehicle.name}</h2>
                  <p className="mt-1 font-bold text-stone">
                    Driver {vehicle.driver} - {vehicle.seats} seats
                  </p>
                </div>
                <span className="rounded-full bg-mint/20 px-3 py-1 text-sm font-black text-emerald-700">
                  Available
                </span>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <ControlCard
            icon={<CarFront className="h-6 w-6" />}
            label="Vehicle type"
            value={vehicle.type}
            detail="Visible in public listings."
          />
          <ControlCard
            icon={<Users className="h-6 w-6" />}
            label="Capacity"
            value={`${vehicle.seats} seats`}
            detail="Used for package quotes."
          />
          <ControlCard
            icon={<IndianRupee className="h-6 w-6" />}
            label="Day rate"
            value={formatCurrency(vehicle.ratePerDay)}
            detail="Editable by owner, visible by admin approval."
          />
          <ControlCard
            icon={<ShieldCheck className="h-6 w-6" />}
            label="Driver"
            value={vehicle.driver}
            detail={vehicle.phone}
          />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Availability and driver</h2>
            <div className="mt-6 grid gap-5">
              <label className="flex items-center gap-3 rounded-md border border-ink/10 bg-ivory p-3 text-sm font-bold">
                <input
                  type="checkbox"
                  defaultChecked={vehicle.available}
                  className="size-4 accent-coral"
                />
                Vehicle available today
              </label>
              <label className="grid gap-2 text-sm font-black">
                Driver name
                <input
                  defaultValue={vehicle.driver}
                  className="h-12 rounded-md border border-ink/15 bg-ivory px-3 text-base outline-none focus:border-coral"
                />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Driver phone
                <input
                  defaultValue={vehicle.phone}
                  className="h-12 rounded-md border border-ink/15 bg-ivory px-3 text-base outline-none focus:border-coral"
                />
              </label>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-4 font-black text-white transition hover:bg-stone">
                <Upload className="h-5 w-5" />
                Save vehicle
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">Package rates</h2>
                <p className="mt-1 text-sm font-semibold text-stone">
                  Rate rows help Road Track build faster quotes.
                </p>
              </div>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-ink/15 px-4 font-black transition hover:border-coral hover:text-coral">
                <Camera className="h-4 w-4" />
                Upload photos
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {rateRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-md border border-ink/10 bg-ivory p-4"
                >
                  <div className="flex items-center gap-2 text-coral">
                    <Route className="h-4 w-4" />
                    <p className="font-black">{row.label}</p>
                  </div>
                  <p className="mt-3 text-2xl font-black">
                    {formatCurrency(row.rate)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 p-5">
            <h2 className="text-2xl font-black">Trip enquiries</h2>
            <p className="mt-1 text-sm font-semibold text-stone">
              Trips assigned by Road Track for vehicle confirmation.
            </p>
          </div>
          <div className="grid gap-0">
            {tripLeads.map((lead) => (
              <div
                key={lead.id}
                className="grid gap-4 border-b border-ink/10 p-5 md:grid-cols-[1fr_0.7fr_0.6fr_auto] md:items-center"
              >
                <div>
                  <p className="font-black">{lead.name}</p>
                  <p className="text-sm font-semibold text-stone">
                    {lead.place} - {lead.requirement}
                  </p>
                </div>
                <p className="font-semibold text-stone">
                  {lead.people} people - {lead.date}
                </p>
                <StatusBadge status={lead.status} />
                <a
                  href={buildWhatsAppUrl(
                    `Hello Road Track,\nVehicle availability checked for ${lead.name}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-coral px-4 font-black text-ink transition hover:bg-coral/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Reply
                </a>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function ControlCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="text-coral">{icon}</div>
      <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-stone">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-2 text-sm font-semibold text-stone">{detail}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-black text-emerald-700">
        <CalendarCheck className="h-4 w-4" />
        Admin reviewed
      </div>
    </article>
  );
}
