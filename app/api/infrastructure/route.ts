import { NextRequest, NextResponse } from "next/server";

type OverpassTags = Record<string, string>;
type OverpassPoint = { lat: number; lon: number };
type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  geometry?: OverpassPoint[];
  center?: OverpassPoint;
  tags?: OverpassTags;
};

type OverpassResponse = {
  osm3s?: { timestamp_osm_base?: string };
  elements?: OverpassElement[];
};

function parseVoltage(value?: string) {
  if (!value) return null;
  const voltages = value
    .split(";")
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isFinite(entry) && entry > 0);
  return voltages.length ? Math.max(...voltages) : null;
}

function classifyPower(tags: OverpassTags) {
  if (tags.power === "substation") return "substation";
  const voltage = parseVoltage(tags.voltage);
  if (!voltage) return "power-unknown";
  if (voltage >= 220_000) return "ehv";
  if (voltage >= 45_000) return "hv";
  if (voltage >= 1_000) return "mv";
  return "power-unknown";
}

function geometryFor(element: OverpassElement) {
  if (element.type === "node" && element.lon != null && element.lat != null) {
    return {
      type: "Point" as const,
      coordinates: [element.lon, element.lat],
    };
  }

  if (element.geometry?.length) {
    const coordinates = element.geometry.map(
      (point) => [point.lon, point.lat] as [number, number],
    );
    if (
      element.tags?.power === "substation" &&
      coordinates.length >= 4 &&
      coordinates[0][0] === coordinates.at(-1)?.[0] &&
      coordinates[0][1] === coordinates.at(-1)?.[1]
    ) {
      return {
        type: "Polygon" as const,
        coordinates: [coordinates],
      };
    }
    return {
      type: "LineString" as const,
      coordinates,
    };
  }

  if (element.center) {
    return {
      type: "Point" as const,
      coordinates: [element.center.lon, element.center.lat],
    };
  }
  return null;
}

function representativePoint(
  geometry: NonNullable<ReturnType<typeof geometryFor>>,
) {
  if (geometry.type === "Point") return geometry.coordinates;

  const coordinates =
    geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
  if (!coordinates.length) return null;

  const middle = coordinates[Math.floor((coordinates.length - 1) / 2)];
  return middle;
}

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
    return NextResponse.json({ error: "A valid map bounding box is required." }, { status: 400 });
  }

  if (north - south > 2.5 || east - west > 3.5) {
    return NextResponse.json(
      { error: "Zoom in further to load infrastructure layers." },
      { status: 400 },
    );
  }

  const allowedLayers = new Set([
    "roads",
    "mv",
    "hv",
    "ehv",
    "substations",
    "unknown",
  ]);
  const requestedLayers = new Set(
    (request.nextUrl.searchParams.get("layers") ?? "")
      .split(",")
      .filter((layer) => allowedLayers.has(layer)),
  );
  if (!requestedLayers.size) {
    return NextResponse.json({
      type: "FeatureCollection",
      features: [],
      metadata: {
        source: "OpenStreetMap contributors via Overpass API",
        sourceTimestamp: null,
        retrievedAt: new Date().toISOString(),
      },
    });
  }

  const bbox = `${south},${west},${north},${east}`;
  const clauses = [
    requestedLayers.has("roads")
      ? `way["highway"~"^(motorway|trunk|primary|secondary)$"](${bbox});`
      : "",
    ["mv", "hv", "ehv", "unknown"].some((layer) =>
      requestedLayers.has(layer),
    )
      ? `way["power"~"^(line|minor_line|cable)$"](${bbox});`
      : "",
    requestedLayers.has("substations")
      ? `nwr["power"="substation"](${bbox});`
      : "",
  ]
    .filter(Boolean)
    .join("\n  ");
  const query = `[out:json][timeout:20];
(
  ${clauses}
);
out geom center tags;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "SolarDev.ai Site Check infrastructure beta",
      },
      body: new URLSearchParams({ data: query }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Infrastructure data is temporarily unavailable." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as OverpassResponse;
    const features: GeoJSON.Feature[] = [];

    for (const element of data.elements ?? []) {
      const tags = element.tags ?? {};
      const geometry = geometryFor(element);
      if (!geometry) continue;

      const isRoad = Boolean(tags.highway);
      const kind = isRoad ? "road" : classifyPower(tags);
      const requestedKind =
        kind === "road"
          ? requestedLayers.has("roads")
          : kind === "substation"
            ? requestedLayers.has("substations")
            : kind === "power-unknown"
              ? requestedLayers.has("unknown")
              : requestedLayers.has(kind);
      if (!requestedKind) continue;
      const properties = {
        kind,
        osmType: element.type,
        osmId: element.id,
        voltage: parseVoltage(tags.voltage),
        voltageRaw: tags.voltage ?? null,
        operator: tags.operator ?? null,
        name: tags.name ?? tags.ref ?? null,
        roadClass: tags.highway ?? null,
        powerType: tags.power ?? null,
        location: tags.location ?? null,
        marker: false,
      };
      features.push({
        type: "Feature",
        geometry,
        properties,
      });

      const point = representativePoint(geometry);
      if (point) {
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: point },
          properties: { ...properties, marker: true },
        });
      }
    }

    return NextResponse.json({
      type: "FeatureCollection",
      features,
      metadata: {
        source: "OpenStreetMap contributors via Overpass API",
        sourceTimestamp: data.osm3s?.timestamp_osm_base ?? null,
        retrievedAt: new Date().toISOString(),
        classification:
          "MV 1–<45 kV; HV 45–<220 kV; EHV ≥220 kV; missing voltage shown as unclassified.",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Infrastructure data is temporarily unavailable." },
      { status: 502 },
    );
  }
}
