import { NextRequest, NextResponse } from "next/server";
import { getIndicativeSolarYield } from "@/lib/pvgis/indicative-yield";

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lon"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return NextResponse.json({ error: "Valid latitude and longitude are required." }, { status: 400 });
  }

  try {
    return NextResponse.json(
      await getIndicativeSolarYield(latitude, longitude),
    );
  } catch {
    return NextResponse.json({ error: "PVGIS has no result for this location." }, { status: 502 });
  }
}
