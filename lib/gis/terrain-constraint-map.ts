import type {
  ConstraintMapFeatureCollection,
  TerrainAnalysis,
} from "@/types/gis";

type Segment = [GeoJSON.Position, GeoJSON.Position];

function pointKey([longitude, latitude]: GeoJSON.Position) {
  return `${longitude.toFixed(12)},${latitude.toFixed(12)}`;
}

function edgeKey(segment: Segment) {
  const first = pointKey(segment[0]);
  const second = pointKey(segment[1]);
  return first < second ? `${first}|${second}` : `${second}|${first}`;
}

function polygonRings(geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon) {
  return geometry.type === "Polygon"
    ? geometry.coordinates
    : geometry.coordinates.flat();
}

function exteriorSegments(
  geometries: Array<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
) {
  const edges = new Map<string, { count: number; segment: Segment }>();
  for (const geometry of geometries) {
    for (const ring of polygonRings(geometry)) {
      for (let index = 1; index < ring.length; index += 1) {
        const segment: Segment = [ring[index - 1], ring[index]];
        const key = edgeKey(segment);
        const existing = edges.get(key);
        edges.set(key, {
          count: (existing?.count ?? 0) + 1,
          segment: existing?.segment ?? segment,
        });
      }
    }
  }
  return [...edges.values()]
    .filter(({ count }) => count % 2 === 1)
    .map(({ segment }) => segment);
}

function connectSegments(segments: Segment[]) {
  const unused = new Set(segments.map((_, index) => index));
  const byEndpoint = new Map<string, number[]>();
  segments.forEach((segment, index) => {
    for (const point of segment) {
      const key = pointKey(point);
      byEndpoint.set(key, [...(byEndpoint.get(key) ?? []), index]);
    }
  });

  const lines: GeoJSON.Position[][] = [];
  while (unused.size > 0) {
    const firstIndex = unused.values().next().value as number;
    const firstSegment = segments[firstIndex];
    unused.delete(firstIndex);
    const line = [...firstSegment];

    while (true) {
      const endKey = pointKey(line.at(-1)!);
      const nextIndex = (byEndpoint.get(endKey) ?? []).find((index) =>
        unused.has(index),
      );
      if (nextIndex === undefined) break;
      const nextSegment = segments[nextIndex];
      unused.delete(nextIndex);
      const nextPoint =
        pointKey(nextSegment[0]) === endKey
          ? nextSegment[1]
          : nextSegment[0];
      line.push(nextPoint);
    }
    lines.push(line);
  }
  return lines;
}

function terrainOutlineFeature(
  geometries: Array<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
): ConstraintMapFeatureCollection["features"][number] | null {
  const lines = connectSegments(exteriorSegments(geometries));
  if (!lines.length) return null;
  return {
    type: "Feature",
    geometry: { type: "MultiLineString", coordinates: lines },
    properties: {
      criterionId: "terrain",
      label: "North-facing slope >5°",
      featureId: "terrain:non-usable-boundary",
      featureName: "Non-usable area boundary",
    },
  };
}

export function terrainConstraintMapFeatures(
  nonUsableAreas: TerrainAnalysis["nonUsableAreas"],
): ConstraintMapFeatureCollection {
  const geometries = nonUsableAreas.features.map((feature) => feature.geometry);
  const outline = terrainOutlineFeature(geometries);
  return {
    type: "FeatureCollection",
    features: outline ? [outline] : [],
  };
}

export function normalizeTerrainConstraintMapFeatures(
  collection: ConstraintMapFeatureCollection,
): ConstraintMapFeatureCollection {
  const otherFeatures = collection.features.filter(
    (feature) => feature.properties.criterionId !== "terrain",
  );
  const terrainFeatures = collection.features.filter(
    (feature) => feature.properties.criterionId === "terrain",
  );
  const terrainPolygons = terrainFeatures.flatMap((feature) =>
    feature.geometry.type === "Polygon" ||
    feature.geometry.type === "MultiPolygon"
      ? [feature.geometry]
      : [],
  );
  if (!terrainPolygons.length) return collection;
  const outline = terrainOutlineFeature(terrainPolygons);
  return {
    type: "FeatureCollection",
    features: outline ? [...otherFeatures, outline] : otherFeatures,
  };
}
