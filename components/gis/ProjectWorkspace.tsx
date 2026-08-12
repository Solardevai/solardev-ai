"use client";

import Link from "next/link";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useId, useRef, useState } from "react";
import ConstraintAnalysisPanel from "@/components/gis/ConstraintAnalysisPanel";
import DevelopmentEnvelopePanel from "@/components/gis/DevelopmentEnvelopePanel";
import FloodRiskAnalysisPanel from "@/components/gis/FloodRiskAnalysisPanel";
import InfrastructureAnalysisPanel from "@/components/gis/InfrastructureAnalysisPanel";
import SiteScorePanel from "@/components/gis/SiteScorePanel";
import SurfaceWaterAnalysisPanel from "@/components/gis/SurfaceWaterAnalysisPanel";
import TerrainAnalysisPanel from "@/components/gis/TerrainAnalysisPanel";
import { MapCoreCanvas, useMapCore } from "@/components/gis/MapCore";
import {
  INFRASTRUCTURE_OPTIONS,
  useInfrastructureLayer,
} from "@/components/map/layers/useInfrastructureLayer";
import { useDrawingTools } from "@/components/map/useDrawingTools";
import { formatArea, formatDistance } from "@/lib/geo/format";
import type { InfrastructureLayerId } from "@/lib/gis/layers";
import {
  normalizeTerrainConstraintMapFeatures,
  terrainConstraintMapFeatures,
} from "@/lib/gis/terrain-constraint-map";
import type {
  ConstraintMapFeatureCollection,
  FloodRiskAreaAnalysis,
  InfrastructureAnalysis,
  NationallyDesignatedAreasAnalysis,
  Natura2000ConstraintAnalysis,
  PreliminarySiteScore,
  SiteScoreCriterionId,
  SurfaceWaterAnalysis,
  TerrainAnalysis,
} from "@/types/gis";
import type {
  ProjectStatus,
  ProjectTechnology,
  SolarDevProject,
  UpdateProjectPayload,
} from "@/types/project";

type ProjectWorkspaceProps = {
  project: SolarDevProject;
  initialAnalysis: PreliminarySiteScore | null;
};

type IntersectionLegendItem = {
  id: SiteScoreCriterionId;
  label: string;
  color: string;
  affectedSitePercent: number | null;
};

const intersectionLegendDefinitions: Partial<
  Record<SiteScoreCriterionId, Pick<IntersectionLegendItem, "label" | "color">>
> = {
  "natura-2000": { label: "Natura 2000", color: "#f43f5e" },
  "national-designations": {
    label: "National designation",
    color: "#f59e0b",
  },
  "flood-risk-areas": { label: "Flood reporting area", color: "#38bdf8" },
  "surface-water": { label: "Surface water / wetland", color: "#22d3ee" },
  "main-road": { label: "Main road", color: "#f4f5f0" },
  "transmission-line": { label: "Transmission line", color: "#ef4444" },
  substation: { label: "Substation", color: "#a78bfa" },
  terrain: { label: "North-facing terrain mask", color: "#f97316" },
};

const emptyConstraintMap: ConstraintMapFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

function mapFeaturesFromAnalysis(
  analysis: PreliminarySiteScore | null,
): ConstraintMapFeatureCollection {
  if (analysis?.constraintMapFeatures) {
    return normalizeTerrainConstraintMapFeatures(
      analysis.constraintMapFeatures,
    );
  }
  if (!analysis?.terrainNonUsableAreas) return emptyConstraintMap;
  return terrainConstraintMapFeatures(analysis.terrainNonUsableAreas);
}

function legendItemsFromAnalysis(
  analysis: PreliminarySiteScore | null,
): IntersectionLegendItem[] {
  if (!analysis?.constraintRegister) return [];
  return analysis.constraintRegister.flatMap((row) => {
    if (!row.intersects) return [];
    const definition = intersectionLegendDefinitions[row.criterionId];
    if (!definition) return [];
    return [
      {
        id: row.criterionId,
        label: definition.label,
        color: definition.color,
        affectedSitePercent: row.affectedSitePercent,
      },
    ];
  });
}

const technologyLabels: Record<ProjectTechnology, string> = {
  solar: "Solar PV",
  bess: "BESS",
  hybrid: "Hybrid",
};

const statusLabels: Record<ProjectStatus, string> = {
  screening: "Screening",
  development: "Development",
  "due-diligence": "Due diligence",
};

function visibilityFromProject(project: SolarDevProject) {
  return Object.fromEntries(
    project.map.visibleLayers.map((layer) => [layer, true]),
  ) as Partial<Record<InfrastructureLayerId, boolean>>;
}

function boundaryPoints(boundary: GeoJSON.Polygon) {
  const ring = boundary.coordinates[0] ?? [];
  const first = ring[0];
  const last = ring.at(-1);
  const openRing =
    first && last && first[0] === last[0] && first[1] === last[1]
      ? ring.slice(0, -1)
      : ring;
  return openRing.map(
    ([longitude, latitude]) => [longitude, latitude] as [number, number],
  );
}

type ConstraintOverlayPath = {
  kind: "path";
  id: string;
  pathData: string;
  color: string;
  criterionId: SiteScoreCriterionId;
  polygon: boolean;
};

type ConstraintOverlayPoint = {
  kind: "point";
  id: string;
  x: number;
  y: number;
  color: string;
  criterionId: SiteScoreCriterionId;
};

type ConstraintOverlayShape = ConstraintOverlayPath | ConstraintOverlayPoint;

function projectLine(
  map: MapLibreMap,
  coordinates: GeoJSON.Position[],
  close = false,
) {
  const path = coordinates
    .map(([longitude, latitude], pointIndex) => {
      const point = map.project([longitude, latitude]);
      return `${pointIndex === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    })
    .join(" ");
  return close && path ? `${path} Z` : path;
}

function projectPolygon(
  map: MapLibreMap,
  polygons: GeoJSON.Position[][][],
) {
  return polygons
    .flatMap((polygon) =>
      polygon.map((ring) => projectLine(map, ring, true)),
    )
    .filter(Boolean)
    .join(" ");
}

function projectConstraintShapes(
  map: MapLibreMap,
  features: ConstraintMapFeatureCollection,
): ConstraintOverlayShape[] {
  return features.features.flatMap<ConstraintOverlayShape>((feature, index) => {
    const definition = intersectionLegendDefinitions[feature.properties.criterionId];
    if (!definition) return [];
    const base = {
      id: `${feature.properties.featureId}:${index}`,
      color: definition.color,
      criterionId: feature.properties.criterionId,
    };
    const geometry = feature.geometry;
    if (geometry.type === "Point") {
      const point = map.project(geometry.coordinates as [number, number]);
      return [{ ...base, kind: "point" as const, x: point.x, y: point.y }];
    }
    if (geometry.type === "LineString") {
      return [{
        ...base,
        kind: "path" as const,
        pathData: projectLine(map, geometry.coordinates),
        polygon: false,
      }];
    }
    if (geometry.type === "MultiLineString") {
      return [{
        ...base,
        kind: "path" as const,
        pathData: geometry.coordinates
          .map((line) => projectLine(map, line))
          .filter(Boolean)
          .join(" "),
        polygon: false,
      }];
    }
    const polygons =
      geometry.type === "Polygon"
        ? [geometry.coordinates]
        : geometry.coordinates;
    return [{
      ...base,
      kind: "path" as const,
      pathData: projectPolygon(map, polygons),
      polygon: true,
    }];
  }).filter((shape) => shape.kind === "point" || Boolean(shape.pathData));
}

function ConstraintMapOverlay({
  map,
  features,
  site,
}: {
  map: MapLibreMap | null;
  features: ConstraintMapFeatureCollection;
  site: GeoJSON.Polygon;
}) {
  const clipId = `constraint-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [overlay, setOverlay] = useState<{
    clipPath: string;
    shapes: ConstraintOverlayShape[];
  }>({ clipPath: "", shapes: [] });

  useEffect(() => {
    if (!map) return;

    const updateOverlay = () =>
      setOverlay({
        clipPath: projectPolygon(map, [site.coordinates]),
        shapes: projectConstraintShapes(map, features),
      });
    const initialFrame = requestAnimationFrame(updateOverlay);
    map.on("move", updateOverlay);
    map.on("resize", updateOverlay);
    return () => {
      cancelAnimationFrame(initialFrame);
      map.off("move", updateOverlay);
      map.off("resize", updateOverlay);
    };
  }, [map, features, site]);

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={overlay.clipPath} fillRule="evenodd" />
        </clipPath>
      </defs>
      <g
        data-constraint-overlay
        data-feature-count={map ? overlay.shapes.length : 0}
        clipPath={`url(#${clipId})`}
      >
        {map && overlay.shapes.map((shape) =>
          shape.kind === "point" ? (
            <circle
              key={shape.id}
              cx={shape.x}
              cy={shape.y}
              r="6"
              fill={shape.color}
              stroke="#071d17"
              strokeWidth="2"
              data-criterion-id={shape.criterionId}
            />
          ) : (
            <g key={shape.id} data-criterion-id={shape.criterionId}>
              {!shape.polygon && (
                <path
                  d={shape.pathData}
                  fill="none"
                  stroke="#071d17"
                  strokeOpacity="0.9"
                  strokeWidth="7"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
              <path
                d={shape.pathData}
                fill={shape.polygon ? shape.color : "none"}
                fillOpacity={shape.polygon ? "0.48" : undefined}
                fillRule="evenodd"
                stroke={shape.color}
                strokeOpacity="0.95"
                strokeWidth={shape.polygon ? "2" : "4"}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          ),
        )}
      </g>
    </>
  );
}

export default function ProjectWorkspace({
  project,
  initialAnalysis,
}: ProjectWorkspaceProps) {
  const [name, setName] = useState(project.name);
  const [technology, setTechnology] = useState(project.technology);
  const [country, setCountry] = useState(project.country);
  const [status, setStatus] = useState(project.status);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [message, setMessage] = useState("Project loaded.");
  const [intersectingConstraints, setIntersectingConstraints] = useState<
    IntersectionLegendItem[]
  >(() => legendItemsFromAnalysis(initialAnalysis));
  const [hasIntersectionAnalysis, setHasIntersectionAnalysis] = useState(
    () => Boolean(initialAnalysis?.constraintRegister),
  );
  const [constraintMapFeatures, setConstraintMapFeatures] =
    useState<ConstraintMapFeatureCollection>(() =>
      mapFeaturesFromAnalysis(initialAnalysis),
    );
  const [terrainAnalysis, setTerrainAnalysis] =
    useState<TerrainAnalysis | null>(null);
  const didImportBoundary = useRef(false);
  const latitudeRef = useRef<HTMLSpanElement>(null);
  const longitudeRef = useRef<HTMLSpanElement>(null);
  const {
    containerRef,
    drawingOverlayRef,
    mapRef,
    map,
    basemap,
    setBasemap,
  } = useMapCore({ initialView: project.map });
  const drawing = useDrawingTools({ map, drawingOverlayRef });
  const infrastructure = useInfrastructureLayer({
    map,
    drawingOverlayRef,
    initialVisibility: visibilityFromProject(project),
  });

  useEffect(() => {
    if (!map || didImportBoundary.current) return;
    didImportBoundary.current = true;
    drawing.importBoundary(boundaryPoints(project.site.geometry));
    // Initial project import should only run once after MapLibre is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, project.id]);

  useEffect(() => {
    if (!map) return;
    const updateCoordinates = (event: { lngLat: { lng: number; lat: number } }) => {
      if (latitudeRef.current) {
        latitudeRef.current.textContent = `Lat ${event.lngLat.lat.toFixed(5)}°`;
      }
      if (longitudeRef.current) {
        longitudeRef.current.textContent = `Lon ${event.lngLat.lng.toFixed(5)}°`;
      }
    };
    map.on("mousemove", updateCoordinates);
    return () => {
      map.off("mousemove", updateCoordinates);
    };
  }, [map]);

  async function saveProject() {
    const currentMap = mapRef.current;
    if (!currentMap) return;
    const center = currentMap.getCenter();
    const visibleLayers = Object.entries(infrastructure.infrastructureLayers)
      .filter(([, visible]) => visible)
      .map(([layer]) => layer as InfrastructureLayerId);
    const payload: UpdateProjectPayload = {
      name,
      technology,
      country,
      status,
      map: {
        center: [center.lng, center.lat],
        zoom: currentMap.getZoom(),
        visibleLayers,
      },
    };

    setSaveState("saving");
    setMessage("Saving project and map state…");
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Project save failed.");
      setSaveState("saved");
      setMessage("Project and map state saved.");
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Project save failed.");
    }
  }

  function updateIntersection(
    id: SiteScoreCriterionId,
    intersects: boolean,
    affectedSitePercent: number | null = null,
    labelOverride?: string,
  ) {
    setHasIntersectionAnalysis(true);
    setIntersectingConstraints((current) => {
      const withoutCurrent = current.filter((item) => item.id !== id);
      const definition = intersectionLegendDefinitions[id];
      if (!intersects || !definition) return withoutCurrent;
      return [
        ...withoutCurrent,
        {
          id,
          ...definition,
          label: labelOverride ?? definition.label,
          affectedSitePercent,
        },
      ];
    });
  }

  function replaceConstraintFeatures(
    criterionIds: SiteScoreCriterionId[],
    features: ConstraintMapFeatureCollection,
  ) {
    const replacedIds = new Set(criterionIds);
    setConstraintMapFeatures((current) => ({
      type: "FeatureCollection",
      features: [
        ...current.features.filter(
          (feature) => !replacedIds.has(feature.properties.criterionId),
        ),
        ...features.features,
      ],
    }));
  }

  function showProtectedAreaAnalysis(
    analysis:
      | Natura2000ConstraintAnalysis
      | NationallyDesignatedAreasAnalysis,
  ) {
    const id =
      analysis.result.layerId === "nationally-designated-areas"
        ? "national-designations"
        : "natura-2000";
    updateIntersection(
      id,
      analysis.result.intersects,
      analysis.result.affectedSitePercent,
    );
    replaceConstraintFeatures([id], analysis.mapFeatures);
  }

  function showFloodAnalysis(analysis: FloodRiskAreaAnalysis) {
    updateIntersection("flood-risk-areas", analysis.result.intersects);
    replaceConstraintFeatures(["flood-risk-areas"], analysis.mapFeatures);
  }

  function showSurfaceWaterAnalysis(analysis: SurfaceWaterAnalysis) {
    updateIntersection(
      "surface-water",
      analysis.results.some((result) => result.classification === "on-site"),
    );
    replaceConstraintFeatures(["surface-water"], analysis.mapFeatures);
  }

  function showInfrastructureAnalysis(analysis: InfrastructureAnalysis) {
    const ids = ["main-road", "transmission-line", "substation"] as const;
    for (const id of ids) {
      const result = analysis.results.find((item) => item.id === id);
      updateIntersection(id, result?.classification === "on-site");
    }
    replaceConstraintFeatures([...ids], analysis.mapFeatures);
  }

  function showScoreIntersections(analysis: PreliminarySiteScore) {
    setHasIntersectionAnalysis(true);
    setIntersectingConstraints(legendItemsFromAnalysis(analysis));
    setConstraintMapFeatures(mapFeaturesFromAnalysis(analysis));
  }

  function showTerrainAnalysis(analysis: TerrainAnalysis) {
    setTerrainAnalysis(analysis);
    setConstraintMapFeatures((current) => ({
      type: "FeatureCollection",
      features: [
        ...current.features.filter(
          (feature) => feature.properties.criterionId !== "terrain",
        ),
        ...terrainConstraintMapFeatures(
          analysis.nonUsableAreas,
          analysis.result.northSlopeThresholdDeg,
        ).features,
      ],
    }));
    updateIntersection(
      "terrain",
      analysis.result.nonUsableNorthSlopeAreaSqm > 0,
      analysis.result.nonUsableNorthSlopePercent,
      `North-facing slope >${analysis.result.northSlopeThresholdDeg}°`,
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="flex min-h-16 flex-wrap items-center gap-4 border-b border-white/10 bg-slate-950 px-4 py-3 lg:px-6">
        <Link href="/dashboard" className="font-bold tracking-tight text-emerald-300">
          SolarDev GIS
        </Link>
        <span className="hidden h-5 w-px bg-white/15 sm:block" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{name || "Untitled site"}</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Project workspace · GIS Lite
          </p>
        </div>
        <Link
          href={`/agents/project-development?projectId=${project.id}`}
          className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-300/15"
        >
          Open in Solar and BESS Agent
        </Link>
        <Link
          href="/tools/solar-site-screening"
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06]"
        >
          New SolarDev GIS Site Check
        </Link>
        <button
          type="button"
          onClick={saveProject}
          disabled={saveState === "saving"}
          className="rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
        >
          {saveState === "saving" ? "Saving…" : "Save project"}
        </button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[250px_minmax(0,1fr)_290px]">
        <aside className="order-2 border-t border-white/10 bg-slate-950 p-4 lg:order-1 lg:border-r lg:border-t-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Layers
          </p>
          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-300">Basemap</p>
            <div className="mt-2 space-y-1">
              {([
                ["topographic", "Esri topographic"],
                ["satellite", "Satellite imagery"],
              ] as const).map(([id, label]) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-300 hover:bg-white/[0.05]"
                >
                  <input
                    type="radio"
                    name="workspace-basemap"
                    value={id}
                    checked={basemap === id}
                    onChange={() => setBasemap(id)}
                    className="accent-emerald-400"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-300">Infrastructure</p>
            <div className="mt-2 space-y-1">
              {INFRASTRUCTURE_OPTIONS.map((layer) => (
                <label
                  key={layer.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-300 hover:bg-white/[0.05]"
                >
                  <input
                    type="checkbox"
                    checked={infrastructure.infrastructureLayers[layer.id]}
                    onChange={() => infrastructure.toggleInfrastructureLayer(layer.id)}
                    className="accent-emerald-400"
                  />
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-4 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  {layer.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-4 text-slate-500">
              {infrastructure.isLoadingInfrastructure
                ? "Loading map data…"
                : infrastructure.infrastructureNote}
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-300">Environment</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Natura 2000 screening
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                National designations
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Flood risk reporting areas
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Surface water and wetlands
              </div>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              Natura 2000 · NatDA · Floods Directive context
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-300">Terrain</p>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
              <span className="h-0.5 w-4 rounded-full bg-orange-500" />
              User-selected north-facing terrain mask
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              Public terrain DEM mosaic · approximately 30 m detail
            </p>
          </div>
        </aside>

        <section className="relative order-1 h-[58vh] min-h-[440px] lg:order-2 lg:h-[90vh] lg:min-h-[680px] lg:self-start">
          <MapCoreCanvas
            containerRef={containerRef}
            drawingOverlayRef={drawingOverlayRef}
            ariaLabel={`GIS workspace map for ${project.name}`}
            constraintOverlay={
              <ConstraintMapOverlay
                map={map}
                features={constraintMapFeatures}
                site={project.site.geometry}
              />
            }
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/15 bg-slate-950/85 px-3 py-2 text-[11px] shadow-lg backdrop-blur">
            Saved project boundary
          </div>
          <aside
            aria-label="Site and intersecting constraint legend"
            className="pointer-events-none absolute right-3 top-3 w-52 rounded-xl border border-white/15 bg-slate-950/90 p-3 text-[10px] shadow-xl backdrop-blur sm:right-4 sm:top-4"
          >
            <p className="font-bold uppercase tracking-[0.14em] text-slate-300">
              Map legend
            </p>
            <div className="mt-2 flex items-center gap-2 text-slate-200">
              <span
                aria-hidden="true"
                className="h-0.5 w-5 rounded-full bg-emerald-400"
              />
              <span>Saved site boundary</span>
            </div>
            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="font-semibold text-slate-400">
                Confirmed intersections
              </p>
              {intersectingConstraints.length > 0 ? (
                <ul className="mt-1.5 space-y-1.5">
                  {intersectingConstraints.map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className={
                          item.id === "terrain"
                            ? "mt-1.5 h-0.5 w-3 shrink-0 rounded-full"
                            : "mt-1 h-2.5 w-2.5 shrink-0 rounded-sm"
                        }
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="min-w-0 text-slate-200">
                        {item.label}
                        {item.affectedSitePercent !== null
                          ? ` · ${item.affectedSitePercent.toFixed(1)}% of site`
                          : " · intersects"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1.5 leading-4 text-slate-500">
                  {hasIntersectionAnalysis
                    ? "No confirmed overlaps in the selected analysis."
                    : "Run or open a preliminary score to identify overlaps."}
                </p>
              )}
            </div>
          </aside>
        </section>

        <aside className="order-3 border-t border-white/10 bg-slate-950 p-4 lg:border-l lg:border-t-0 lg:overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Project
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-[11px] font-semibold text-slate-400">
              Project name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={120}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block text-[11px] font-semibold text-slate-400">
              Technology
              <select
                value={technology}
                onChange={(event) => setTechnology(event.target.value as ProjectTechnology)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                {Object.entries(technologyLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] font-semibold text-slate-400">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as ProjectStatus)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] font-semibold text-slate-400">
              Country / market
              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                maxLength={100}
                placeholder="Not set"
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
              />
            </label>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Site metrics
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white/[0.04] p-3">
                <dt className="text-slate-500">Gross area</dt>
                <dd className="mt-1 font-semibold">{formatArea(project.site.areaSqm)}</dd>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-3">
                <dt className="text-slate-500">Perimeter</dt>
                <dd className="mt-1 font-semibold">{formatDistance(project.site.perimeterM / 1000)}</dd>
              </div>
            </dl>
          </div>

          <DevelopmentEnvelopePanel
            areaSqm={project.site.areaSqm}
            centroid={project.site.centroid}
            technology={technology}
            terrainAnalysis={terrainAnalysis}
          />

          <SiteScorePanel
            projectId={project.id}
            northSlopeThresholdDeg={
              terrainAnalysis?.result.northSlopeThresholdDeg ?? 5
            }
            onAnalysisChange={showScoreIntersections}
          />
          <ConstraintAnalysisPanel
            projectId={project.id}
            onAnalysisChange={showProtectedAreaAnalysis}
          />
          <FloodRiskAnalysisPanel
            projectId={project.id}
            onAnalysisChange={showFloodAnalysis}
          />
          <SurfaceWaterAnalysisPanel
            projectId={project.id}
            onAnalysisChange={showSurfaceWaterAnalysis}
          />
          <TerrainAnalysisPanel
            projectId={project.id}
            onAnalysisChange={showTerrainAnalysis}
          />
          <InfrastructureAnalysisPanel
            projectId={project.id}
            onAnalysisChange={showInfrastructureAnalysis}
          />
        </aside>
      </div>

      <footer className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/10 bg-slate-950 px-4 py-2 text-[10px] text-slate-500 lg:px-6">
        <span ref={latitudeRef}>Lat {project.map.center[1].toFixed(5)}°</span>
        <span ref={longitudeRef}>Lon {project.map.center[0].toFixed(5)}°</span>
        <span>EPSG:3857</span>
        <span className={saveState === "error" ? "text-rose-300" : "ml-auto"} role="status">
          {message}
        </span>
      </footer>
    </main>
  );
}
