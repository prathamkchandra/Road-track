import Image from "next/image";
import type { ReactNode } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Hotel,
  IndianRupee,
  MessageCircle,
  Upload,
} from "lucide-react";

import { StatusBadge } from "@/components/DashboardBits";
import { SiteHeader } from "@/components/SiteHeader";
import { leads, resorts } from "@/lib/data";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/utils";

const amenityControls = ["AC", "Pool", "Breakfast", "Parking", "Family room", "Sea view"];

export default function ResortPartnerPage() {
  const resort = resorts[0];
  const resortLeads = leads.filter((lead) =>
    ["New", "Contacted", "Confirmed"].includes(lead.status),
  );

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <SiteHeader />
      <section className="mx-auto max-w-none px-5 pb-20 pt-28 sm:px-8 lg:px-10 2xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-coral">
              Resort Owner
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
              Room availability dashboard
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone">
              Update rooms, prices, media, amenities, sold-out status, and
              respond to booking enquiries assigned by Road Track.
            </p>
          </div>

          <article className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
            <div className="relative aspect-[16/8]">
              <Image
                src={resort.image}
                alt={resort.name}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-3xl font-black">{resort.name}</h2>
                  <p className="mt-1 font-bold text-stone">{resort.location}</p>
                </div>
                <span className="rounded-full bg-mint/20 px-3 py-1 text-sm font-black text-emerald-700">
                  {resort.status}
                </span>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <ControlCard
            icon={<Hotel className="h-6 w-6" />}
            label="Rooms available"
            value={String(resort.roomsAvailable)}
            detail="Set live count or mark sold out."
          />
          <ControlCard
            icon={<IndianRupee className="h-6 w-6" />}
            label="Starting price"
            value={formatCurrency(resort.priceFrom)}
            detail="Pricing visibility can be controlled by admin."
          />
          <ControlCard
            icon={<Clock3 className="h-6 w-6" />}
            label="Response target"
            value="15 min"
            detail="Fast partner response improves conversion."
          />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Update listing</h2>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm font-black">
                Room price
                <input
                  defaultValue={resort.priceFrom}
                  type="number"
                  className="h-12 rounded-md border border-ink/15 bg-ivory px-3 text-base outline-none focus:border-coral"
                />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Rooms available
                <input
                  defaultValue={resort.roomsAvailable}
                  type="number"
                  className="h-12 rounded-md border border-ink/15 bg-ivory px-3 text-base outline-none focus:border-coral"
                />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-ink/10 bg-ivory p-3 text-sm font-bold">
                <input type="checkbox" className="size-4 accent-coral" />
                Mark rooms as sold out
              </label>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-4 font-black text-white transition hover:bg-stone">
                <Upload className="h-5 w-5" />
                Save availability
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">Amenities and media</h2>
                <p className="mt-1 text-sm font-semibold text-stone">
                  Photos, videos, amenities, and enquiry history stay together.
                </p>
              </div>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-ink/15 px-4 font-black transition hover:border-coral hover:text-coral">
                <Camera className="h-4 w-4" />
                Upload media
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenityControls.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 rounded-md border border-ink/10 bg-ivory p-3 text-sm font-bold"
                >
                  <input
                    type="checkbox"
                    defaultChecked={resort.amenities.some((item) =>
                      item.toLowerCase().includes(amenity.toLowerCase()),
                    )}
                    className="size-4 accent-coral"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 p-5">
            <h2 className="text-2xl font-black">Booking enquiries</h2>
            <p className="mt-1 text-sm font-semibold text-stone">
              Leads assigned by Road Track for resort follow-up.
            </p>
          </div>
          <div className="grid gap-0">
            {resortLeads.map((lead) => (
              <div
                key={lead.id}
                className="grid gap-4 border-b border-ink/10 p-5 md:grid-cols-[1fr_0.8fr_0.6fr_auto] md:items-center"
              >
                <div>
                  <p className="font-black">{lead.name}</p>
                  <p className="text-sm font-semibold text-stone">
                    {lead.requirement}
                  </p>
                </div>
                <p className="font-semibold text-stone">
                  {lead.people} people - {lead.date}
                </p>
                <StatusBadge status={lead.status} />
                <a
                  href={buildWhatsAppUrl(
                    `Hello Road Track,\nI have checked availability for ${lead.name}.`,
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
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-2 text-sm font-semibold text-stone">{detail}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-black text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        Synced with admin review
      </div>
    </article>
  );
}
