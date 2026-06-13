"use client";

import {
  CalendarDays,
  Calculator,
  Hotel,
  Loader2,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { destinations, vehicles } from "@/lib/data";
import {
  buildLeadMessage,
  buildWhatsAppUrl,
  calculateQuote,
  formatCurrency,
} from "@/lib/utils";

const roomRates = [
  { label: "Budget", value: 2200 },
  { label: "Comfort", value: 3600 },
  { label: "Premium", value: 6200 },
];

export function EnquiryPlanner() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(4);
  const [days, setDays] = useState(2);
  const [destinationSlug, setDestinationSlug] = useState("malpe-beach");
  const [vehicleId, setVehicleId] = useState("innova-crysta");
  const [roomRate, setRoomRate] = useState(roomRates[1].value);
  const [guide, setGuide] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedDestination = destinations.find(
    (destination) => destination.slug === destinationSlug,
  );
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === vehicleId) ?? vehicles[0];
  const selectedRoom = roomRates.find((rate) => rate.value === roomRate);
  const rooms = Math.max(1, Math.ceil(people / 3));

  const quote = useMemo(
    () =>
      calculateQuote({
        people,
        days,
        vehicleRate: selectedVehicle.ratePerDay,
        roomRate,
        rooms,
        guide,
      }),
    [days, guide, people, roomRate, rooms, selectedVehicle.ratePerDay],
  );

  const leadMessage = buildLeadMessage({
    name,
    phone,
    destination: selectedDestination?.name ?? "Udupi",
    date,
    people,
    vehicle: selectedVehicle.type,
    hotel: selectedRoom?.label ?? "Comfort",
    quote,
  });

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (!name.trim() || !phone.trim()) {
      setNotice("Enter name and phone before saving the enquiry.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          destination: selectedDestination?.name,
          date,
          people,
          vehicle: selectedVehicle.type,
          hotel: selectedRoom?.label,
          quote,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save lead");
      }

      const result = (await response.json()) as { leadId: string };
      setNotice(`Lead ${result.leadId} saved. Continue on WhatsApp.`);
    } catch {
      setNotice("Lead could not be saved. WhatsApp enquiry is still ready.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={saveLead}
      className="grid gap-5 rounded-lg border border-white/15 bg-ink/90 p-4 text-ivory shadow-2xl shadow-black/30 backdrop-blur md:grid-cols-[1.3fr_0.9fr]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="h-12 rounded-md border border-white/15 bg-white/10 px-3 text-base text-white outline-none transition focus:border-coral"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Phone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91 98765 43210"
            className="h-12 rounded-md border border-white/15 bg-white/10 px-3 text-base text-white outline-none transition focus:border-coral"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Destination
          <select
            value={destinationSlug}
            onChange={(event) => setDestinationSlug(event.target.value)}
            className="h-12 rounded-md border border-white/15 bg-white/10 px-3 text-base text-white outline-none transition focus:border-coral"
          >
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Travel date
          <span className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-white/55" />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 w-full rounded-md border border-white/15 bg-white/10 px-3 pl-11 text-base text-white outline-none transition focus:border-coral"
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          People
          <span className="relative">
            <Users className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-white/55" />
            <input
              type="number"
              min={1}
              max={80}
              value={people}
              onChange={(event) => setPeople(Number(event.target.value))}
              className="h-12 w-full rounded-md border border-white/15 bg-white/10 px-3 pl-11 text-base text-white outline-none transition focus:border-coral"
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Days
          <input
            type="number"
            min={1}
            max={14}
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="h-12 rounded-md border border-white/15 bg-white/10 px-3 text-base text-white outline-none transition focus:border-coral"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Vehicle
          <select
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            className="h-12 rounded-md border border-white/15 bg-white/10 px-3 text-base text-white outline-none transition focus:border-coral"
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.type} - {vehicle.seats} seats
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Resort category
          <span className="relative">
            <Hotel className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-white/55" />
            <select
              value={roomRate}
              onChange={(event) => setRoomRate(Number(event.target.value))}
              className="h-12 w-full rounded-md border border-white/15 bg-white/10 px-3 pl-11 text-base text-white outline-none transition focus:border-coral"
            >
              {roomRates.map((rate) => (
                <option key={rate.label} value={rate.value}>
                  {rate.label}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      <div className="flex flex-col justify-between gap-5 rounded-md border border-white/15 bg-white/[0.06] p-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-mint">
            <Calculator className="h-4 w-4" />
            Instant estimate
          </div>
          <p className="mt-4 text-4xl font-black tracking-tight">
            {formatCurrency(quote)}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Includes vehicle, {rooms} room{rooms > 1 ? "s" : ""}, planning
            fee, and service buffer. Final rate can be adjusted by Road Track
            after partner confirmation.
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={guide}
            onChange={(event) => setGuide(event.target.checked)}
            className="size-4 accent-coral"
          />
          Add local guide support
        </label>

        <div className="grid gap-3">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-coral px-4 font-bold text-ink transition hover:bg-coral/90"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Save enquiry
          </button>

          <a
            href={buildWhatsAppUrl(leadMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-mint/60 px-4 font-bold text-mint transition hover:bg-mint hover:text-ink"
          >
            <MessageCircle className="h-5 w-5" />
            Send WhatsApp
          </a>
        </div>

        {notice ? <p className="text-sm text-amber">{notice}</p> : null}
      </div>
    </form>
  );
}
