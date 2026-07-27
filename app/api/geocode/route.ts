import { NextRequest, NextResponse } from "next/server";

const COORDINATES = /^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Enter an address or coordinates." }, { status: 400 });
  }

  const coordinateMatch = query.match(COORDINATES);
  if (coordinateMatch) {
    const latitude = Number(coordinateMatch[1]);
    const longitude = Number(coordinateMatch[2]);
    if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
      return NextResponse.json({ latitude, longitude, label: `${latitude}, ${longitude}` });
    }
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "SolarDev.ai site screening tool (https://www.solardev.ai)",
      Accept: "application/json",
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Location search is temporarily unavailable." }, { status: 502 });
  }

  const results = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  if (!results[0]) {
    return NextResponse.json({ error: "No matching location found." }, { status: 404 });
  }

  return NextResponse.json({
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
    label: results[0].display_name,
  });
}
