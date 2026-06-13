import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  CloudSun,
  Hotel,
  IndianRupee,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import {
  destinations,
  getDestination,
  getNearbyResorts,
  getPackages,
  vehicles,
} from "@/lib/data";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    return {};
  }

  return {
    title: `${destination.name} Trip Planning | Road Track`,
    description: destination.summary,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    notFound();
  }

  const nearbyResorts = getNearbyResorts(destination.slug);
  const packages = getPackages(destination.slug);
  const availableVehicles = vehicles.filter((vehicle) => vehicle.available);

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <SiteHeader />

      <section className="relative isolate min-h-[72svh] overflow-hidden pt-24 text-ivory">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,26,22,0.72),rgba(16,26,22,0.44)_44%,rgba(16,26,22,0.92))]" />
        <div className="relative mx-auto flex min-h-[calc(72svh-6rem)] max-w-none flex-col justify-end px-5 pb-10 sm:px-8 lg:px-10 2xl:px-12">
          <Link
            href="/#destinations"
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-md border border-white/25 px-4 py-2 font-bold text-white transition hover:border-coral hover:text-coral"
          >
            <ArrowLeft className="h-4 w-4" />
            Destinations
          </Link>
          <p className="text-lg font-black text-mint">{destination.region}</p>
          <h1 className="mt-3 text-6xl font-black uppercase leading-none tracking-normal sm:text-8xl lg:text-[10rem]">
            {destination.name}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-8 text-white/85">
            {destination.summary}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-none gap-5 px-5 py-12 sm:px-8 md:grid-cols-4 lg:px-10 2xl:px-12">
        <Fact
          icon={<CalendarDays className="h-5 w-5" />}
          label="Best time"
          value={destination.bestTime}
        />
        <Fact
          icon={<MapPin className="h-5 w-5" />}
          label="Distance"
          value={destination.distanceFromUdupi}
        />
        <Fact
          icon={<IndianRupee className="h-5 w-5" />}
          label="Estimated trip"
          value={`From ${formatCurrency(destination.tripCostFrom)}`}
        />
        <Fact
          icon={<CloudSun className="h-5 w-5" />}
          label={destination.weather.label}
          value={`${destination.weather.temperature}. ${destination.weather.note}`}
        />
      </section>

      <section className="mx-auto grid max-w-none gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 2xl:px-12">
        <div className="rounded-lg bg-ink p-6 text-ivory">
          <h2 className="text-3xl font-black">Trip controls</h2>
          <div className="mt-6 grid gap-3">
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(
                destination.mapQuery,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-mint px-4 font-black text-ink transition hover:bg-mint/90"
            >
              <Navigation className="h-5 w-5" />
              Google Maps directions
            </a>
            <a
              href={buildWhatsAppUrl(
                `Hello Road Track,\nI am interested in ${destination.name}.\nPlease contact me.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-coral/70 px-4 font-black text-coral transition hover:bg-coral hover:text-ink"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
          </div>

          <div className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">
              Tourist attractions
            </p>
            <div className="mt-4 grid gap-3">
              {destination.attractions.map((attraction) => (
                <div key={attraction} className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-mint" />
                  <span className="font-bold text-white/80">{attraction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <h2 className="text-3xl font-black">Nearby resorts</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(nearbyResorts.length ? nearbyResorts : []).map((resort) => (
                <article
                  key={resort.id}
                  className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
                >
                  <Hotel className="h-6 w-6 text-coral" />
                  <h3 className="mt-3 text-xl font-black">{resort.name}</h3>
                  <p className="mt-2 text-sm font-bold text-stone">
                    {resort.location}
                  </p>
                  <p className="mt-4 text-sm text-stone">
                    {resort.roomsAvailable} rooms visible to Road Track.
                  </p>
                  <p className="mt-4 font-black">
                    From {formatCurrency(resort.priceFrom)}
                  </p>
                </article>
              ))}
              {nearbyResorts.length === 0 ? (
                <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                  <Hotel className="h-6 w-6 text-coral" />
                  <h3 className="mt-3 text-xl font-black">
                    Road Track partner pool
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone">
                    Resort assignment can be handled manually by the admin
                    team based on budget, date, and group size.
                  </p>
                </article>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black">Available vehicles</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {availableVehicles.slice(0, 2).map((vehicle) => (
                <article
                  key={vehicle.id}
                  className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
                >
                  <CarFront className="h-6 w-6 text-coral" />
                  <h3 className="mt-3 text-xl font-black">{vehicle.type}</h3>
                  <p className="mt-2 text-sm font-bold text-stone">
                    Driver {vehicle.driver} - {vehicle.seats} seats
                  </p>
                  <p className="mt-4 font-black">
                    {formatCurrency(vehicle.ratePerDay)} per day
                  </p>
                </article>
              ))}
            </div>
          </div>

          {packages.length ? (
            <div>
              <h2 className="text-3xl font-black">Packages</h2>
              <div className="mt-4 grid gap-4">
                {packages.map((pack) => (
                  <article
                    key={pack.id}
                    className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <p className="text-sm font-black text-coral">
                          {pack.days}
                        </p>
                        <h3 className="mt-1 text-xl font-black">
                          {pack.title}
                        </h3>
                      </div>
                      <p className="font-black">
                        From {formatCurrency(pack.priceFrom)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-coral">{icon}</div>
      <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-stone">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6">{value}</p>
    </article>
  );
}
