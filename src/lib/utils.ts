import { roadTrackPhone } from "@/lib/data";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function calculateQuote(input: {
  people: number;
  days: number;
  vehicleRate: number;
  roomRate: number;
  rooms: number;
  guide: boolean;
}) {
  const basePlanningFee = 1200;
  const vehicleTotal = input.vehicleRate * input.days;
  const roomTotal = input.roomRate * input.rooms * input.days;
  const guideTotal = input.guide ? 1800 * input.days : 0;
  const serviceBuffer = Math.ceil((vehicleTotal + roomTotal + guideTotal) * 0.08);

  return basePlanningFee + vehicleTotal + roomTotal + guideTotal + serviceBuffer;
}

export function buildWhatsAppUrl(message: string, phone = roadTrackPhone) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildLeadMessage(input: {
  name: string;
  phone: string;
  destination: string;
  date: string;
  people: number;
  vehicle: string;
  hotel: string;
  quote?: number;
}) {
  return [
    "Hello Road Track,",
    "",
    "I am interested in:",
    `Name: ${input.name || "Guest"}`,
    `Phone: ${input.phone || "Not provided"}`,
    `Destination: ${input.destination}`,
    `Travel Date: ${input.date || "Flexible"}`,
    `No of People: ${input.people}`,
    `Vehicle Required: ${input.vehicle}`,
    `Hotel Required: ${input.hotel}`,
    input.quote ? `Approx Quote: ${formatCurrency(input.quote)}` : "",
    "",
    "Please contact me.",
  ]
    .filter(Boolean)
    .join("\n");
}
