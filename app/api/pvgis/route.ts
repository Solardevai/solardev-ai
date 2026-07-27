import { NextRequest, NextResponse } from "next/server";

type PvgisResponse = {
  inputs?: { location?: { latitude?: number; longitude?: number; elevation?: number } };
  outputs?: {
    totals?: { fixed?: { E_y?: number } };
  };
};

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lon"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return NextResponse.json({ error: "Valid latitude and longitude are required." }, { status: 400 });
  }

  const url = new URL("https://re.jrc.ec.europa.eu/api/v5_3/PVcalc");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("peakpower", "1");
  url.searchParams.set("loss", "14");
  url.searchParams.set("optimalinclination", "1");
  url.searchParams.set("outputformat", "json");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 2592000 },
  });
  if (!response.ok) {
    return NextResponse.json({ error: "PVGIS has no result for this location." }, { status: 502 });
  }

  const data = (await response.json()) as PvgisResponse;
  const annualYield = data.outputs?.totals?.fixed?.E_y;
  if (!annualYield) {
    return NextResponse.json({ error: "PVGIS returned an incomplete result." }, { status: 502 });
  }

  return NextResponse.json({
    annualYield,
    specificYield: annualYield,
    monthlyAverage: annualYield / 12,
    location: {
      latitude: data.inputs?.location?.latitude ?? latitude,
      longitude: data.inputs?.location?.longitude ?? longitude,
      elevation: data.inputs?.location?.elevation,
    },
  });
}
