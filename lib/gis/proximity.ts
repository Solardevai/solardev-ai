import type {
  InfrastructureFeature,
  InfrastructureFeatureProperties,
} from "@/lib/gis/infrastructure-service";
import type {
  InfrastructureProximityResult,
  ProximityClassification,
} from "@/types/gis";

type Coordinate = [number, number];
type ProjectedPoint = [number, number];
export type ProximityGeometry =
  | GeoJSON.Point
  | GeoJSON.LineString
  | GeoJSON.Polygon;

const EARTH_RADIUS_M = 6_371_008.8;

function radians(value: number) {
  return (value * Math.PI) / 180;
}

function createProjector(referenceLatitude: number) {
  const latitudeScale = EARTH_RADIUS_M;
  const longitudeScale = EARTH_RADIUS_M * Math.cos(radians(referenceLatitude));
  return ([longitude, latitude]: Coordinate): ProjectedPoint => [
    radians(longitude) * longitudeScale,
    radians(latitude) * latitudeScale,
  ];
}

function segments(points: ProjectedPoint[], close = false) {
  if (points.length < 2) return [];
  const result: Array<[ProjectedPoint, ProjectedPoint]> = [];
  for (let index = 1; index < points.length; index += 1) {
    result.push([points[index - 1], points[index]]);
  }
  const first = points[0];
  const last = points.at(-1)!;
  if (close && (first[0] !== last[0] || first[1] !== last[1])) {
    result.push([last, first]);
  }
  return result;
}

function pointInRing(point: ProjectedPoint, ring: ProjectedPoint[]) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
    const [currentX, currentY] = ring[current];
    const [previousX, previousY] = ring[previous];
    const crosses =
      currentY > point[1] !== previousY > point[1] &&
      point[0] <
        ((previousX - currentX) * (point[1] - currentY)) /
          (previousY - currentY) +
          currentX;
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointToSegmentDistance(
  point: ProjectedPoint,
  start: ProjectedPoint,
  end: ProjectedPoint,
) {
  const deltaX = end[0] - start[0];
  const deltaY = end[1] - start[1];
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  if (!lengthSquared) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const ratio = Math.max(
    0,
    Math.min(
      1,
      ((point[0] - start[0]) * deltaX +
        (point[1] - start[1]) * deltaY) /
        lengthSquared,
    ),
  );
  return Math.hypot(
    point[0] - (start[0] + ratio * deltaX),
    point[1] - (start[1] + ratio * deltaY),
  );
}

function orientation(
  first: ProjectedPoint,
  second: ProjectedPoint,
  third: ProjectedPoint,
) {
  return (
    (second[0] - first[0]) * (third[1] - first[1]) -
    (second[1] - first[1]) * (third[0] - first[0])
  );
}

function segmentsIntersect(
  firstStart: ProjectedPoint,
  firstEnd: ProjectedPoint,
  secondStart: ProjectedPoint,
  secondEnd: ProjectedPoint,
) {
  const epsilon = 0.000001;
  const onSegment = (
    point: ProjectedPoint,
    start: ProjectedPoint,
    end: ProjectedPoint,
  ) =>
    point[0] >= Math.min(start[0], end[0]) - epsilon &&
    point[0] <= Math.max(start[0], end[0]) + epsilon &&
    point[1] >= Math.min(start[1], end[1]) - epsilon &&
    point[1] <= Math.max(start[1], end[1]) + epsilon;
  const firstSide = orientation(firstStart, firstEnd, secondStart);
  const secondSide = orientation(firstStart, firstEnd, secondEnd);
  const thirdSide = orientation(secondStart, secondEnd, firstStart);
  const fourthSide = orientation(secondStart, secondEnd, firstEnd);
  if (firstSide * secondSide < 0 && thirdSide * fourthSide < 0) return true;
  if (Math.abs(firstSide) <= epsilon && onSegment(secondStart, firstStart, firstEnd)) return true;
  if (Math.abs(secondSide) <= epsilon && onSegment(secondEnd, firstStart, firstEnd)) return true;
  if (Math.abs(thirdSide) <= epsilon && onSegment(firstStart, secondStart, secondEnd)) return true;
  return Math.abs(fourthSide) <= epsilon && onSegment(firstEnd, secondStart, secondEnd);
}

function segmentDistance(
  firstStart: ProjectedPoint,
  firstEnd: ProjectedPoint,
  secondStart: ProjectedPoint,
  secondEnd: ProjectedPoint,
) {
  if (segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd)) return 0;
  return Math.min(
    pointToSegmentDistance(firstStart, secondStart, secondEnd),
    pointToSegmentDistance(firstEnd, secondStart, secondEnd),
    pointToSegmentDistance(secondStart, firstStart, firstEnd),
    pointToSegmentDistance(secondEnd, firstStart, firstEnd),
  );
}

function lineToSiteDistance(
  line: ProjectedPoint[],
  siteRing: ProjectedPoint[],
  closed = false,
) {
  if (line.some((point) => pointInRing(point, siteRing))) return 0;
  const siteSegments = segments(siteRing, true);
  const lineSegments = segments(line, closed);
  let minimum = Number.POSITIVE_INFINITY;
  for (const [lineStart, lineEnd] of lineSegments) {
    for (const [siteStart, siteEnd] of siteSegments) {
      minimum = Math.min(
        minimum,
        segmentDistance(lineStart, lineEnd, siteStart, siteEnd),
      );
      if (minimum === 0) return 0;
    }
  }
  return minimum;
}

function geometryDistance(
  geometry: ProximityGeometry,
  siteRing: ProjectedPoint[],
  project: (coordinate: Coordinate) => ProjectedPoint,
) {
  if (geometry.type === "Point") {
    const point = project(geometry.coordinates as Coordinate);
    if (pointInRing(point, siteRing)) return 0;
    return Math.min(
      ...segments(siteRing, true).map(([start, end]) =>
        pointToSegmentDistance(point, start, end),
      ),
    );
  }

  const coordinates =
    geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
  const line = coordinates.map((coordinate) => project(coordinate as Coordinate));
  if (geometry.type === "Polygon" && pointInRing(siteRing[0], line)) return 0;
  return lineToSiteDistance(line, siteRing, geometry.type === "Polygon");
}

export function createSiteDistanceCalculator(site: GeoJSON.Polygon) {
  const ring = site.coordinates[0] ?? [];
  if (ring.length < 4) throw new Error("A valid project polygon is required.");
  const referenceLatitude =
    ring.reduce((sum, coordinate) => sum + coordinate[1], 0) / ring.length;
  const project = createProjector(referenceLatitude);
  const siteRing = ring.map((coordinate) => project(coordinate as Coordinate));
  return (geometry: ProximityGeometry) =>
    geometryDistance(geometry, siteRing, project);
}

function thresholdsFor(id: InfrastructureProximityResult["id"]) {
  if (id === "main-road") return [1_000, 5_000] as const;
  if (id === "transmission-line") return [2_000, 10_000] as const;
  return [5_000, 15_000] as const;
}

function classify(
  id: InfrastructureProximityResult["id"],
  distanceM: number | null,
): ProximityClassification {
  if (distanceM === null) return "not-found";
  if (distanceM <= 1) return "on-site";
  const [near, moderate] = thresholdsFor(id);
  if (distanceM <= near) return "near";
  if (distanceM <= moderate) return "moderate";
  return "remote";
}

function recommendation(
  id: InfrastructureProximityResult["id"],
  classification: ProximityClassification,
) {
  if (classification === "not-found") {
    return "No mapped asset was found within the analysis radius. Check authoritative local datasets and widen the search.";
  }
  if (id === "main-road") {
    return classification === "on-site"
      ? "Confirm road setbacks, crossings and construction-access implications."
      : "Verify the practical access route, road ownership, geometry and upgrade requirements.";
  }
  if (id === "transmission-line") {
    return classification === "on-site"
      ? "Confirm easements and electrical clearances; mapped proximity does not establish a connection point."
      : "Confirm voltage, ownership, feasible point of connection and available grid capacity with authoritative sources.";
  }
  return "Confirm substation voltage, ownership, capacity, connection process and a technically feasible cable route.";
}

function nearestResult(
  id: InfrastructureProximityResult["id"],
  label: string,
  features: InfrastructureFeature[],
  siteRing: ProjectedPoint[],
  project: (coordinate: Coordinate) => ProjectedPoint,
): InfrastructureProximityResult {
  const byAsset = new Map<
    string,
    { distanceM: number; properties: InfrastructureFeatureProperties }
  >();
  for (const feature of features) {
    const assetKey = `${feature.properties.osmType}:${feature.properties.osmId}`;
    const distanceM = geometryDistance(feature.geometry, siteRing, project);
    const existing = byAsset.get(assetKey);
    if (!existing || distanceM < existing.distanceM) {
      byAsset.set(assetKey, { distanceM, properties: feature.properties });
    }
  }

  const nearest = [...byAsset.values()].reduce<
    { distanceM: number; properties: InfrastructureFeatureProperties } | null
  >(
    (current, candidate) =>
      !current || candidate.distanceM < current.distanceM ? candidate : current,
    null,
  );
  const distanceM = nearest ? Math.round(nearest.distanceM) : null;
  const classification = classify(id, distanceM);
  return {
    id,
    label,
    distanceM,
    classification,
    asset: nearest
      ? {
          osmType: nearest.properties.osmType,
          osmId: nearest.properties.osmId,
          name: nearest.properties.name,
          operator: nearest.properties.operator,
          voltage: nearest.properties.voltage,
          roadClass: nearest.properties.roadClass,
        }
      : null,
    recommendedAction: recommendation(id, classification),
  };
}

export function analyzeInfrastructureProximity(
  site: GeoJSON.Polygon,
  features: InfrastructureFeature[],
) {
  const ring = site.coordinates[0] ?? [];
  if (ring.length < 4) throw new Error("A valid project polygon is required.");
  const referenceLatitude =
    ring.reduce((sum, coordinate) => sum + coordinate[1], 0) / ring.length;
  const project = createProjector(referenceLatitude);
  const siteRing = ring.map((coordinate) => project(coordinate as Coordinate));
  const roads = features.filter((feature) => feature.properties.kind === "road");
  const substations = features.filter(
    (feature) => feature.properties.kind === "substation",
  );
  const lines = features.filter((feature) =>
    ["mv", "hv", "ehv", "power-unknown"].includes(feature.properties.kind),
  );

  return [
    nearestResult("main-road", "Nearest main road", roads, siteRing, project),
    nearestResult(
      "transmission-line",
      "Nearest transmission line",
      lines,
      siteRing,
      project,
    ),
    nearestResult(
      "substation",
      "Nearest substation",
      substations,
      siteRing,
      project,
    ),
  ];
}

export function boundsAroundSite(site: GeoJSON.Polygon, radiusKm: number) {
  const ring = site.coordinates[0] ?? [];
  if (!ring.length) throw new Error("A valid project polygon is required.");
  const longitudes = ring.map((coordinate) => coordinate[0]);
  const latitudes = ring.map((coordinate) => coordinate[1]);
  const centreLatitude =
    (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
  const latitudePadding = radiusKm / 110.574;
  const longitudePadding =
    radiusKm / Math.max(1, 111.32 * Math.cos(radians(centreLatitude)));
  return {
    south: Math.max(-90, Math.min(...latitudes) - latitudePadding),
    west: Math.max(-180, Math.min(...longitudes) - longitudePadding),
    north: Math.min(90, Math.max(...latitudes) + latitudePadding),
    east: Math.min(180, Math.max(...longitudes) + longitudePadding),
  };
}
