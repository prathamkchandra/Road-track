import { NextRequest, NextResponse } from "next/server";

import { leads } from "@/lib/data";

type EnquiryPayload = {
  name?: unknown;
  phone?: unknown;
  destination?: unknown;
  date?: unknown;
  people?: unknown;
  vehicle?: unknown;
  hotel?: unknown;
  quote?: unknown;
};

const phonePattern = /^\+?[0-9\s-]{8,18}$/;

export async function GET() {
  return NextResponse.json({ leads });
}

export async function POST(request: NextRequest) {
  let payload: EnquiryPayload;

  try {
    payload = (await request.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const name = readString(payload.name);
  const phone = readString(payload.phone);
  const destination = readString(payload.destination);
  const vehicle = readString(payload.vehicle);
  const hotel = readString(payload.hotel);
  const date = readString(payload.date) || "Flexible";
  const people = Number(payload.people);
  const quote = Number(payload.quote);

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Name must contain at least two characters." },
      { status: 422 },
    );
  }

  if (!phone || !phonePattern.test(phone)) {
    return NextResponse.json(
      { error: "Enter a valid phone number with country code." },
      { status: 422 },
    );
  }

  if (!destination || !vehicle || !hotel) {
    return NextResponse.json(
      { error: "Destination, vehicle, and hotel are required." },
      { status: 422 },
    );
  }

  if (!Number.isFinite(people) || people < 1 || people > 100) {
    return NextResponse.json(
      { error: "People count must be between 1 and 100." },
      { status: 422 },
    );
  }

  const leadId = `LD-${Date.now().toString().slice(-6)}`;

  return NextResponse.json(
    {
      leadId,
      status: "New",
      received: {
        name,
        phone,
        destination,
        date,
        people,
        vehicle,
        hotel,
        quote: Number.isFinite(quote) ? quote : null,
      },
    },
    { status: 201 },
  );
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 160) : "";
}
