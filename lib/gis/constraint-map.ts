import type {
  ConstraintMapFeatureCollection,
  ConstraintMapFeatureProperties,
  ConstraintMapGeometry,
} from "@/types/gis";

type Coordinate = [number, number];

function closedRing(ring: number[][]): Coordinate[] {
  const coordinates = ring.map(
    ([longitude, latitude]) => [longitude, latitude] as Coordinate,
  );
  const first = coordinates[0];
  const last = coordinates.at(-1);
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    coordinates.push([...first]);
  }
  return coordinates;
}

function signedRingArea(ring: Coordinate[]) {
  let area = 0;
  for (let index = 1; index < ring.length; index += 1) {
    const previous = ring[index - 1];
    const current = ring[index];
    area += previous[0] * current[1] - current[0] * previous[1];
  }
  return area / 2;
}

function pointInRing(point: Coordinate, ring: Coordinate[]) {
  let inside = false;
  for (
    let current = 0, previous = ring.length - 1;
    current < ring.length;
    previous = current++
  ) {
    const currentPoint = ring[current];
    const previousPoint = ring[previous];
    const crosses =
      currentPoint[1] > point[1] !== previousPoint[1] > point[1] &&
      point[0] <
        ((previousPoint[0] - currentPoint[0]) *
          (point[1] - currentPoint[1])) /
          (previousPoint[1] - currentPoint[1]) +
          currentPoint[0];
    if (crosses) inside = !inside;
  }
  return inside;
}

export function polygonFromEsriRings(
  rings: number[][][],
): GeoJSON.Polygon | GeoJSON.MultiPolygon | null {
  const validRings = rings.map(closedRing).filter((ring) => ring.length >= 4);
  if (!validRings.length) return null;

  let exteriors = validRings.filter((ring) => signedRingArea(ring) < 0);
  let holes = validRings.filter((ring) => signedRingArea(ring) >= 0);
  if (!exteriors.length) {
    exteriors = validRings;
    holes = [];
  }

  const polygons = exteriors.map((ring) => [ring] as Coordinate[][]);
  for (const hole of holes) {
    const containingPolygon = polygons.find((polygon) =>
      pointInRing(hole[0], polygon[0]),
    );
    if (containingPolygon) containingPolygon.push(hole);
    else polygons.push([hole]);
  }

  return polygons.length === 1
    ? { type: "Polygon", coordinates: polygons[0] }
    : { type: "MultiPolygon", coordinates: polygons };
}

export function polylineFromEsriPaths(
  paths: number[][][],
): GeoJSON.LineString | GeoJSON.MultiLineString | null {
  const lines = paths
    .map((path) =>
      path.map(
        ([longitude, latitude]) => [longitude, latitude] as Coordinate,
      ),
    )
    .filter((line) => line.length >= 2);
  if (!lines.length) return null;
  return lines.length === 1
    ? { type: "LineString", coordinates: lines[0] }
    : { type: "MultiLineString", coordinates: lines };
}

export function constraintFeature(
  geometry: ConstraintMapGeometry,
  properties: ConstraintMapFeatureProperties,
): GeoJSON.Feature<ConstraintMapGeometry, ConstraintMapFeatureProperties> {
  return { type: "Feature", geometry, properties };
}

export function constraintFeatureCollection(
  features: ConstraintMapFeatureCollection["features"],
): ConstraintMapFeatureCollection {
  return { type: "FeatureCollection", features };
}
