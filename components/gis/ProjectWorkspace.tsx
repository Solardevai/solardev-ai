"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfrastructureAnalysisPanel from "@/components/gis/InfrastructureAnalysisPanel";
import { MapCoreCanvas, useMapCore } from "@/components/gis/MapCore";
import {
  INFRASTRUCTURE_OPTIONS,
  useInfrastructureLayer,
} from "@/components/map/layers/useInfrastructureLayer";
import { useDrawingTools } from "@/components/map/useDrawingTools";
import { formatArea, formatDistance } from "@/lib/geo/format";
import type { InfrastructureLayerId } from "@/lib/gis/layers";
import type {
  ProjectStatus,
  ProjectTechnology,
  SolarDevProject,
  UpdateProjectPayload,
} from "@/types/project";

type ProjectWorkspaceProps = {
  project: SolarDevProject;
};

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

export default function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
  const [name, setName] = useState(project.name);
  const [technology, setTechnology] = useState(project.technology);
  const [country, setCountry] = useState(project.country);
  const [status, setStatus] = useState(project.status);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [message, setMessage] = useState("Project loaded.");
  const didImportBoundary = useRef(false);
  const latitudeRef = useRef<HTMLSpanElement>(null);
  const longitudeRef = useRef<HTMLSpanElement>(null);
  const { containerRef, drawingOverlayRef, mapRef, map } = useMapCore({
    initialView: project.map,
  });
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
          href="/tools/solar-site-screening"
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06]"
        >
          New Site Check
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
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Satellite imagery
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
        </aside>

        <section className="relative order-1 h-[58vh] min-h-[440px] lg:order-2 lg:h-auto">
          <MapCoreCanvas
            containerRef={containerRef}
            drawingOverlayRef={drawingOverlayRef}
            ariaLabel={`GIS workspace map for ${project.name}`}
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/15 bg-slate-950/85 px-3 py-2 text-[11px] shadow-lg backdrop-blur">
            Saved project boundary
          </div>
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

          <InfrastructureAnalysisPanel projectId={project.id} />
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
