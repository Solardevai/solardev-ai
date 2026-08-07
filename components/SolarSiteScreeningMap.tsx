"use client";

import { useUser } from "@clerk/nextjs";
import { area } from "@turf/area";
import { polygon } from "@turf/helpers";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { MapCoreCanvas, useMapCore } from "@/components/gis/MapCore";
import { useDrawingTools } from "@/components/map/useDrawingTools";
import {
  INFRASTRUCTURE_OPTIONS,
  useInfrastructureLayer,
} from "@/components/map/layers/useInfrastructureLayer";
import { formatArea, formatDistance } from "@/lib/geo/format";
import { createKml, parseKmlPolygons } from "@/lib/geo/kml";
import type { SaveProjectPayload } from "@/types/project";

type SolarResult = {
  annualYield: number;
  monthlyAverage: number;
  specificYield: number;
  location: { latitude: number; longitude: number; elevation?: number };
};
type ExportFormat = "geojson" | "kml" | "kmz";
type MeteoFormat = "csv" | "epw";

type SolarSiteScreeningMapProps = {
  authenticationAvailable: boolean;
};

export default function SolarSiteScreeningMap({
  authenticationAvailable,
}: SolarSiteScreeningMapProps) {
  return authenticationAvailable ? (
    <AuthenticatedSolarSiteScreeningMap />
  ) : (
    <SolarSiteScreeningMapContent isSignedIn={false} />
  );
}

function AuthenticatedSolarSiteScreeningMap() {
  const { isSignedIn } = useUser();

  return <SolarSiteScreeningMapContent isSignedIn={Boolean(isSignedIn)} />;
}

function SolarSiteScreeningMapContent({
  isSignedIn,
}: {
  isSignedIn: boolean;
}) {
  const kmzInputRef = useRef<HTMLInputElement>(null);
  const { containerRef, drawingOverlayRef, mapRef, map } = useMapCore();

  const [query, setQuery] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [message, setMessage] = useState(
    "Search for a location, then start drawing your site.",
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isImportingKmz, setIsImportingKmz] = useState(false);
  const [isLoadingSolar, setIsLoadingSolar] = useState(false);
  const [solar, setSolar] = useState<SolarResult | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("kmz");
  const [isExporting, setIsExporting] = useState(false);
  const [meteoFormat, setMeteoFormat] = useState<MeteoFormat>("csv");
  const [isDownloadingMeteo, setIsDownloadingMeteo] = useState(false);

  const drawing = useDrawingTools({
    map,
    drawingOverlayRef,
    onBoundaryChange: () => setSolar(null),
    onMessage: setMessage,
  });
  const infrastructure = useInfrastructureLayer({ map, drawingOverlayRef });

  const {
    points,
    isDrawing,
    closedRing,
    sitePolygon,
    siteArea,
    sitePerimeter,
    siteCentroid,
  } = drawing;

  async function importKmz(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImportingKmz(true);
    setMessage("Reading property boundary from KMZ…");
    try {
      if (!file.name.toLowerCase().endsWith(".kmz")) {
        throw new Error("Choose a .kmz file containing a KML property polygon.");
      }
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("The KMZ file is larger than the 25 MB upload limit.");
      }

      const { default: JSZip } = await import("jszip");
      const archive = await JSZip.loadAsync(file);
      const kmlEntries = Object.values(archive.files).filter(
        (entry) => !entry.dir && entry.name.toLowerCase().endsWith(".kml"),
      );
      if (!kmlEntries.length) {
        throw new Error("No KML document was found inside this KMZ file.");
      }

      const preferredEntry =
        kmlEntries.find(
          (entry) => entry.name.split("/").at(-1)?.toLowerCase() === "doc.kml",
        ) ?? kmlEntries[0];
      const rings = parseKmlPolygons(await preferredEntry.async("text"));
      if (!rings.length) {
        throw new Error("No valid property polygon was found in this KMZ file.");
      }

      const rankedRings = rings
        .map((ring) => ({
          ring,
          squareMetres: area(polygon([[...ring, ring[0]]])),
        }))
        .sort((a, b) => b.squareMetres - a.squareMetres);
      const nextPoints = rankedRings[0].ring;

      drawing.importBoundary(nextPoints);
      setMessage(
        rings.length === 1
          ? `Property boundary imported from ${file.name}. Existing analyses are ready to run.`
          : `${rings.length} polygons found in ${file.name}; the largest was imported. Existing analyses are ready to run.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The property boundary could not be imported.",
      );
    } finally {
      setIsImportingKmz(false);
      if (kmzInputRef.current) kmzInputRef.current.value = "";
    }
  }

  async function searchLocation(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setMessage("Finding location…");
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Location not found.");
      mapRef.current?.flyTo({ center: [result.longitude, result.latitude], zoom: 13 });
      setMessage(`Map centred on ${result.label}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Location search failed.");
    } finally {
      setIsSearching(false);
    }
  }

  async function runSolarCheck() {
    if (!sitePolygon || !siteCentroid) return;
    const [longitude, latitude] = siteCentroid;
    setIsLoadingSolar(true);
    setMessage("Querying PVGIS for the site centroid…");
    try {
      const response = await fetch(
        `/api/pvgis?lat=${latitude.toFixed(6)}&lon=${longitude.toFixed(6)}`,
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Solar data is unavailable.");
      setSolar(result);
      setMessage("Indicative PVGIS calculation complete.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PVGIS query failed.");
    } finally {
      setIsLoadingSolar(false);
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  async function downloadBoundary() {
    if (!sitePolygon || !closedRing) return;
    setIsExporting(true);
    try {
      if (exportFormat === "geojson") {
        downloadBlob(
          new Blob([JSON.stringify(sitePolygon, null, 2)], {
            type: "application/geo+json",
          }),
          "solardev-site-boundary.geojson",
        );
        return;
      }

      const kml = createKml(closedRing, siteArea, sitePerimeter);
      if (exportFormat === "kml") {
        downloadBlob(
          new Blob([kml], {
            type: "application/vnd.google-earth.kml+xml",
          }),
          "solardev-site-boundary.kml",
        );
        return;
      }

      const { default: JSZip } = await import("jszip");
      const archive = new JSZip();
      archive.file("doc.kml", kml);
      const kmz = await archive.generateAsync({
        type: "blob",
        mimeType: "application/vnd.google-earth.kmz",
        compression: "DEFLATE",
      });
      downloadBlob(kmz, "solardev-site-boundary.kmz");
    } finally {
      setIsExporting(false);
    }
  }

  async function downloadMeteoFile() {
    if (!sitePolygon || !siteCentroid) return;

    const [longitude, latitude] = siteCentroid;
    setIsDownloadingMeteo(true);
    setMessage(`Preparing the PVGIS TMY ${meteoFormat.toUpperCase()} file…`);

    try {
      const response = await fetch(
        `/api/pvgis/tmy?lat=${latitude.toFixed(6)}&lon=${longitude.toFixed(6)}&format=${meteoFormat}`,
      );

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          result?.error || "The PVGIS meteo file could not be downloaded.",
        );
      }

      const blob = await response.blob();
      downloadBlob(
        blob,
        `solardev-pvgis-tmy-${latitude.toFixed(4)}_${longitude.toFixed(4)}.${meteoFormat}`,
      );
      setMessage(
        `PVGIS TMY ${meteoFormat.toUpperCase()} file downloaded for the site centroid.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The PVGIS meteo file download failed.",
      );
    } finally {
      setIsDownloadingMeteo(false);
    }
  }

  async function saveProject() {
    if (!sitePolygon || !siteCentroid) return;
    if (!isSignedIn) {
      setMessage("Sign in to save this site to a project.");
      return;
    }

    setIsSavingProject(true);
    setMessage("Saving project…");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          boundary: sitePolygon.geometry,
          areaSqm: siteArea,
          perimeterM: sitePerimeter * 1000,
          centroidLon: siteCentroid[0],
          centroidLat: siteCentroid[1],
        } satisfies SaveProjectPayload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The project could not be saved.");
      setMessage(`Saved as "${result.name}".`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The project could not be saved.");
    } finally {
      setIsSavingProject(false);
    }
  }

  return (
    <section className="grid min-h-[720px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/30 lg:grid-cols-[340px_1fr]">
      <aside className="order-2 flex flex-col border-t border-white/10 bg-slate-950/90 p-5 lg:order-1 lg:max-h-[720px] lg:overflow-y-auto lg:border-r lg:border-t-0">
        <form onSubmit={searchLocation}>
          <label htmlFor="site-search" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Find a location
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Address or lat, lon"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-xl bg-emerald-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              {isSearching ? "…" : "Go"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Site boundary</p>
          <input
            ref={kmzInputRef}
            type="file"
            accept=".kmz,application/vnd.google-earth.kmz"
            onChange={importKmz}
            className="sr-only"
            aria-label="Upload property boundary KMZ"
          />
          <button
            type="button"
            onClick={() => kmzInputRef.current?.click()}
            disabled={isImportingKmz}
            className="mt-2 w-full rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImportingKmz ? "Importing KMZ…" : "Upload property KMZ"}
          </button>
          <div className="my-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
            <span className="h-px flex-1 bg-white/10" />
            or draw manually
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <button
            type="button"
            onClick={drawing.toggleDrawing}
            className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
              isDrawing
                ? "bg-emerald-400 text-slate-950"
                : "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
            }`}
          >
            {isDrawing ? "Finish drawing" : points.length ? "Continue drawing" : "Start drawing"}
          </button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={drawing.undoPoint} disabled={!points.length} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.05] disabled:opacity-40">
              Undo point
            </button>
            <button type="button" onClick={drawing.clearSite} disabled={!points.length} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.05] disabled:opacity-40">
              Clear site
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <span className="block text-xs text-slate-400">Gross area</span>
            <strong className="mt-1 block text-lg text-white">{sitePolygon ? formatArea(siteArea) : "—"}</strong>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <span className="block text-xs text-slate-400">Perimeter</span>
            <strong className="mt-1 block text-lg text-white">{sitePolygon ? formatDistance(sitePerimeter) : "—"}</strong>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <label htmlFor="project-name" className="sr-only">
            Project name
          </label>
          <input
            id="project-name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Name this site"
            disabled={!sitePolygon || isSavingProject}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 disabled:opacity-40"
          />
          <button
            type="button"
            onClick={saveProject}
            disabled={!sitePolygon || isSavingProject}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSavingProject ? "Saving…" : "Save this site"}
          </button>
        </div>

        <div aria-live="polite" className="mt-4 min-h-12 rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs leading-5 text-slate-400">
          {message}
        </div>

        <button
          type="button"
          onClick={runSolarCheck}
          disabled={!sitePolygon || isLoadingSolar}
          className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoadingSolar
            ? "Calculating with PVGIS…"
            : "Calculate indicative specific yield"}
        </button>

        {solar && (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">Indicative PVGIS result</span>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">MODEL OUTPUT</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{Math.round(solar.specificYield).toLocaleString()}</p>
            <p className="text-xs text-slate-400">
              kWh/kWp per year at the boundary centroid
            </p>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-xs">
              <span className="text-slate-400">Annual value ÷ 12</span>
              <strong>{Math.round(solar.monthlyAverage).toLocaleString()} kWh/kWp</strong>
            </div>
            <dl className="mt-3 space-y-1 border-t border-white/10 pt-3 text-[10px] leading-4">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">System basis</dt>
                <dd className="text-right text-slate-200">1 kWp nominal</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Mounting</dt>
                <dd className="text-right text-slate-200">Fixed, optimum inclination</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">System losses</dt>
                <dd className="text-right text-slate-200">14% assumed</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <label htmlFor="boundary-format" className="sr-only">
            Boundary download format
          </label>
          <select
            id="boundary-format"
            value={exportFormat}
            onChange={(event) =>
              setExportFormat(event.target.value as ExportFormat)
            }
            disabled={!sitePolygon || isExporting}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-semibold uppercase text-slate-300 outline-none focus:border-emerald-400 disabled:opacity-40"
          >
            <option value="kmz">KMZ</option>
            <option value="kml">KML</option>
            <option value="geojson">GeoJSON</option>
          </select>
          <button
            type="button"
            onClick={downloadBoundary}
            disabled={!sitePolygon || isExporting}
            className="min-w-0 flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] disabled:opacity-40"
          >
            {isExporting ? "Preparing…" : "Download boundary"}
          </button>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            PVGIS meteo file
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            Hourly Typical Meteorological Year data at the site centroid,
            including the PVGIS horizon model.
          </p>
          <div className="mt-3 flex gap-2">
            <label htmlFor="meteo-format" className="sr-only">
              Meteo file format
            </label>
            <select
              id="meteo-format"
              value={meteoFormat}
              onChange={(event) =>
                setMeteoFormat(event.target.value as MeteoFormat)
              }
              disabled={!sitePolygon || isDownloadingMeteo}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-semibold uppercase text-slate-300 outline-none focus:border-emerald-400 disabled:opacity-40"
            >
              <option value="csv">CSV</option>
              <option value="epw">EPW</option>
            </select>
            <button
              type="button"
              onClick={downloadMeteoFile}
              disabled={!sitePolygon || isDownloadingMeteo}
              className="min-w-0 flex-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isDownloadingMeteo ? "Preparing…" : "Download TMY"}
            </button>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">
            CSV is suited to data review. EPW is compatible with
            EnergyPlus-based workflows.
          </p>
        </div>

        <p className="mt-auto pt-6 text-[10px] leading-4 text-slate-500">
          Preliminary boundary measurement and modelled solar pre-check using
          third-party data. It does not assess environmental, planning, land,
          terrain, grid, legal or technical constraints and does not replace
          professional due diligence.
        </p>
      </aside>

      <div className="relative order-1 h-[480px] min-h-0 lg:order-2 lg:h-[720px]">
        <MapCoreCanvas
          containerRef={containerRef}
          drawingOverlayRef={drawingOverlayRef}
          ariaLabel="Interactive solar site screening map"
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/15 bg-slate-950/85 px-3 py-2 text-xs text-white shadow-lg backdrop-blur">
          {isDrawing
            ? "Drawing mode · left-click to add · right-click to undo"
            : "Pan and zoom to explore"}
        </div>
        <details className="absolute right-4 top-32 z-10 w-56 overflow-hidden rounded-xl border border-white/15 bg-slate-950/92 text-white shadow-xl backdrop-blur">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-xs font-bold marker:content-none">
            Infrastructure layers
            <span className="text-[10px] font-semibold text-slate-400">
              OSM beta
            </span>
          </summary>
          <div className="border-t border-white/10 p-3">
            <div className="space-y-1">
              {INFRASTRUCTURE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 transition hover:bg-white/[0.06]"
                >
                  <input
                    type="checkbox"
                    checked={infrastructure.infrastructureLayers[option.id]}
                    onChange={() => infrastructure.toggleInfrastructureLayer(option.id)}
                    className="h-3.5 w-3.5 accent-emerald-400"
                  />
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <p
              aria-live="polite"
              className="mt-2 border-t border-white/10 pt-2 text-[9px] leading-4 text-slate-400"
            >
              {infrastructure.isLoadingInfrastructure ? "Loading…" : infrastructure.infrastructureNote}
            </p>
            <p className="mt-2 text-[9px] leading-4 text-slate-500">
              Coverage varies. Proximity does not indicate connection capacity,
              availability or feasibility.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
