import { NextRequest, NextResponse } from "next/server";

const PVGIS_TMY_FORMATS = new Set(["csv", "epw"]);

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lon"));
  const format = request.nextUrl.searchParams.get("format")?.toLowerCase();

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return NextResponse.json(
      { error: "Valid latitude and longitude are required." },
      { status: 400 },
    );
  }

  if (!format || !PVGIS_TMY_FORMATS.has(format)) {
    return NextResponse.json(
      { error: "The meteo file format must be CSV or EPW." },
      { status: 400 },
    );
  }

  const url = new URL("https://re.jrc.ec.europa.eu/api/v5_3/tmy");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("usehorizon", "1");
  url.searchParams.set("outputformat", format);
  url.searchParams.set("browser", "0");

  try {
    const response = await fetch(url, {
      headers: { Accept: format === "csv" ? "text/csv" : "text/plain" },
      next: { revalidate: 2592000 },
    });

    if (!response.ok || !response.body) {
      return NextResponse.json(
        {
          error:
            response.status === 529
              ? "PVGIS is temporarily busy. Please try the download again."
              : "PVGIS could not prepare a TMY file for this location.",
        },
        { status: response.status === 529 ? 503 : 502 },
      );
    }

    const coordinateLabel = `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;

    return new Response(response.body, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          (format === "csv"
            ? "text/csv; charset=utf-8"
            : "text/plain; charset=utf-8"),
        "Content-Disposition": `attachment; filename="solardev-pvgis-tmy-${coordinateLabel}.${format}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PVGIS is currently unavailable. Please try again later." },
      { status: 502 },
    );
  }
}
