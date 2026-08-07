import { NextRequest, NextResponse } from "next/server";
import {
  fetchInfrastructure,
  InfrastructureSourceError,
} from "@/lib/gis/infrastructure-service";
import {
  INFRASTRUCTURE_LAYER_IDS,
  type InfrastructureLayerId,
} from "@/lib/gis/layers";

const allowedLayers = new Set<string>(INFRASTRUCTURE_LAYER_IDS);

export async function GET(request: NextRequest) {
  const values = ["south", "west", "north", "east"].map((key) =>
    Number(request.nextUrl.searchParams.get(key)),
  );
  const [south, west, north, east] = values;
  if (
    values.some((value) => !Number.isFinite(value)) ||
    south < -90 ||
    north > 90 ||
    west < -180 ||
    east > 180 ||
    south >= north ||
    west >= east
  ) {
    return NextResponse.json(
      { error: "A valid map bounding box is required." },
      { status: 400 },
    );
  }

  const requestedLayers = new Set<InfrastructureLayerId>(
    (request.nextUrl.searchParams.get("layers") ?? "")
      .split(",")
      .filter((layer): layer is InfrastructureLayerId =>
        allowedLayers.has(layer),
      ),
  );
  const latitudeSpan = north - south;
  const longitudeSpan = east - west;
  const isSubstationsOnly =
    requestedLayers.size === 1 && requestedLayers.has("substations");
  const isCoarseSubstationQuery =
    isSubstationsOnly && (latitudeSpan > 2.5 || longitudeSpan > 3.5);
  const exceedsDetailedLimit = latitudeSpan > 2.5 || longitudeSpan > 3.5;
  const exceedsCoarseLimit = latitudeSpan > 14 || longitudeSpan > 22;
  const isPowerOnly =
    !requestedLayers.has("roads") &&
    !requestedLayers.has("substations") &&
    requestedLayers.size > 0;
  const exceedsPowerOverviewLimit = latitudeSpan > 7 || longitudeSpan > 11;

  if (
    (requestedLayers.has("roads") && exceedsDetailedLimit) ||
    (isPowerOnly && exceedsPowerOverviewLimit) ||
    (exceedsDetailedLimit && !isSubstationsOnly && !isPowerOnly) ||
    (isCoarseSubstationQuery && exceedsCoarseLimit)
  ) {
    return NextResponse.json(
      { error: "Zoom in further to load infrastructure layers." },
      { status: 400 },
    );
  }

  try {
    const result = await fetchInfrastructure(
      { south, west, north, east },
      requestedLayers,
    );
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    if (error instanceof InfrastructureSourceError) {
      console.error("[api/infrastructure] all Overpass endpoints failed", {
        failures: error.failures,
      });
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: { "Retry-After": "20" } },
      );
    }
    console.error("[api/infrastructure] unexpected failure", error);
    return NextResponse.json(
      { error: "Live infrastructure sources are temporarily unavailable." },
      { status: 502 },
    );
  }
}
