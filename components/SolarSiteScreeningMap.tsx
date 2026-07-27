"use client";

import { area, centroid, length, lineString, polygon } from "@turf/turf";
import {
  AttributionControl,
  type GeoJSONSource,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FormEvent, useEffect, useRef, useState } from "react";

type Coordinate = [number, number];
type SolarResult = {
  annualYield: number;
  monthlyAverage: number;
  specificYield: number;
  location: { latitude: number; longitude: number; elevation?: number };
};
type Basemap = "streets" | "satellite";

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

function formatArea(squareMetres: number) {
  return squareMetres >= 10_000
    ? `${(squareMetres / 10_000).toFixed(2)} ha`
    : `${Math.round(squareMetres).toLocaleString()} m²`;
}

function formatDistance(kilometres: number) {
  return kilometres >= 1
    ? `${kilometres.toFixed(2)} km`
    : `${Math.round(kilometres * 1_000)} m`;
}

export default function SolarSiteScreeningMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingOverlayRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const pointsRef = useRef<Coordinate[]>([]);
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Search for a location, then start drawing your site.");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSolar, setIsLoadingSolar] = useState(false);
  const [solar, setSolar] = useState<SolarResult | null>(null);
  const [basemap, setBasemap] = useState<Basemap>("streets");

  const closedRing = points.length >= 3 ? [...points, points[0]] : null;
  const sitePolygon = closedRing ? polygon([closedRing]) : null;
  const siteArea = sitePolygon ? area(sitePolygon) : 0;
  const sitePerimeter = closedRing ? length(lineString(closedRing)) : 0;

  function updateDrawingOverlay(nextPoints: Coordinate[]) {
    const map = mapRef.current;
    const overlay = drawingOverlayRef.current;
    if (!map || !overlay) return;

    const projectedPoints = nextPoints.map((coordinate) =>
      map.project(coordinate),
    );
    const path = projectedPoints
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ");
    const closedPath =
      projectedPoints.length >= 3 ? `${path} Z` : path;

    overlay
      .querySelectorAll<SVGPathElement>("[data-site-path]")
      .forEach((element) => element.setAttribute("d", closedPath));

    const vertices = overlay.querySelector<SVGGElement>(
      "[data-site-vertices]",
    );
    if (vertices) {
      vertices.replaceChildren(
        ...projectedPoints.map((point) => {
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          circle.setAttribute("cx", String(point.x));
          circle.setAttribute("cy", String(point.y));
          circle.setAttribute("r", "6");
          circle.setAttribute("fill", "#020617");
          circle.setAttribute("stroke", "#fbbf24");
          circle.setAttribute("stroke-width", "3");
          return circle;
        }),
      );
    }
  }

  function updateMap(nextPoints: Coordinate[]) {
    const map = mapRef.current;
    if (!map?.getSource("site-line")) return;

    const lineCoordinates =
      nextPoints.length >= 3 ? [...nextPoints, nextPoints[0]] : nextPoints;

    (map.getSource("site-line") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features:
        lineCoordinates.length >= 2
          ? [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: lineCoordinates,
                },
              },
            ]
          : [],
    });
    (map.getSource("site-points") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: nextPoints.map((coordinates, index) => ({
        type: "Feature",
        properties: { index },
        geometry: { type: "Point", coordinates },
      })),
    });
    (map.getSource("site-polygon") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features:
        nextPoints.length >= 3
          ? [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [[...nextPoints, nextPoints[0]]],
                },
              },
            ]
          : [],
    });
    updateDrawingOverlay(nextPoints);
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      center: [10, 47],
      zoom: 4,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
          satellite: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution:
              "Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
          },
        },
        layers: [
          { id: "osm", type: "raster", source: "osm" },
          {
            id: "satellite",
            type: "raster",
            source: "satellite",
            layout: { visibility: "none" },
          },
        ],
      },
    });

    map.addControl(new NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      map.addSource("site-polygon", {
        type: "geojson",
        data: EMPTY_COLLECTION,
      });
      map.addSource("site-line", { type: "geojson", data: EMPTY_COLLECTION });
      map.addSource("site-points", {
        type: "geojson",
        data: EMPTY_COLLECTION,
      });
      map.addLayer({
        id: "site-fill",
        type: "fill",
        source: "site-polygon",
        paint: { "fill-color": "#fbbf24", "fill-opacity": 0.25 },
      });
      map.addLayer({
        id: "site-line-casing",
        type: "line",
        source: "site-line",
        paint: {
          "line-color": "#020617",
          "line-width": 7,
          "line-opacity": 0.8,
        },
      });
      map.addLayer({
        id: "site-line",
        type: "line",
        source: "site-line",
        paint: {
          "line-color": "#fbbf24",
          "line-width": 4,
        },
      });
      map.addLayer({
        id: "site-points",
        type: "circle",
        source: "site-points",
        paint: {
          "circle-radius": 6,
          "circle-color": "#0f172a",
          "circle-stroke-color": "#fbbf24",
          "circle-stroke-width": 3,
        },
      });
    });

    map.on("click", (event) => {
      if (!map.getCanvas().dataset.drawing) return;
      const nextPoints: Coordinate[] = [
        ...pointsRef.current,
        [event.lngLat.lng, event.lngLat.lat],
      ];
      pointsRef.current = nextPoints;
      setPoints(nextPoints);
      setSolar(null);
      updateMap(nextPoints);
      setMessage(
        nextPoints.length < 3
          ? `Add ${3 - nextPoints.length} more point${3 - nextPoints.length === 1 ? "" : "s"} to form a site.`
          : "Boundary ready. Add more points or finish drawing.",
      );
    });
    const refreshDrawingOverlay = () =>
      updateDrawingOverlay(pointsRef.current);
    map.on("move", refreshDrawingOverlay);
    map.on("resize", refreshDrawingOverlay);

    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(containerRef.current);
    const resizeFrame = requestAnimationFrame(() => map.resize());

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      map.off("move", refreshDrawingOverlay);
      map.off("resize", refreshDrawingOverlay);
      map.remove();
      mapRef.current = null;
    };
    // MapLibre owns this imperative instance for the component lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleDrawing() {
    const map = mapRef.current;
    if (!map) return;
    const next = !isDrawing;
    setIsDrawing(next);
    map.getCanvas().dataset.drawing = next ? "true" : "";
    map.getCanvas().style.cursor = next ? "crosshair" : "";
    setMessage(next ? "Click the map to add boundary points." : "Drawing paused.");
  }

  function selectBasemap(nextBasemap: Basemap) {
    const map = mapRef.current;
    if (!map?.getLayer("osm") || !map.getLayer("satellite")) return;
    map.setLayoutProperty(
      "osm",
      "visibility",
      nextBasemap === "streets" ? "visible" : "none",
    );
    map.setLayoutProperty(
      "satellite",
      "visibility",
      nextBasemap === "satellite" ? "visible" : "none",
    );
    setBasemap(nextBasemap);
  }

  function clearSite() {
    pointsRef.current = [];
    setPoints([]);
    setSolar(null);
    updateMap([]);
    setMessage("Site cleared. Start drawing a new boundary.");
  }

  function undoPoint() {
    const nextPoints = pointsRef.current.slice(0, -1);
    pointsRef.current = nextPoints;
    setPoints(nextPoints);
    setSolar(null);
    updateMap(nextPoints);
    setMessage(nextPoints.length ? "Last point removed." : "Boundary cleared.");
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
    if (!sitePolygon) return;
    const [longitude, latitude] = centroid(sitePolygon).geometry.coordinates;
    setIsLoadingSolar(true);
    setMessage("Querying PVGIS for the site centroid…");
    try {
      const response = await fetch(
        `/api/pvgis?lat=${latitude.toFixed(6)}&lon=${longitude.toFixed(6)}`,
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Solar data is unavailable.");
      setSolar(result);
      setMessage("Preliminary solar resource check complete.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PVGIS query failed.");
    } finally {
      setIsLoadingSolar(false);
    }
  }

  function downloadGeoJson() {
    if (!sitePolygon) return;
    const blob = new Blob([JSON.stringify(sitePolygon, null, 2)], {
      type: "application/geo+json",
    });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "solardev-site-boundary.geojson";
    anchor.click();
    URL.revokeObjectURL(href);
  }

  return (
    <section className="grid min-h-[720px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/30 lg:grid-cols-[340px_1fr]">
      <aside className="order-2 flex flex-col border-t border-white/10 bg-slate-950/90 p-5 lg:order-1 lg:border-r lg:border-t-0">
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
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-xl bg-amber-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
            >
              {isSearching ? "…" : "Go"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Site boundary</p>
          <button
            type="button"
            onClick={toggleDrawing}
            className={`mt-2 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
              isDrawing
                ? "bg-amber-400 text-slate-950"
                : "border border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
            }`}
          >
            {isDrawing ? "Finish drawing" : points.length ? "Continue drawing" : "Start drawing"}
          </button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={undoPoint} disabled={!points.length} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.05] disabled:opacity-40">
              Undo point
            </button>
            <button type="button" onClick={clearSite} disabled={!points.length} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.05] disabled:opacity-40">
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

        <div aria-live="polite" className="mt-4 min-h-12 rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs leading-5 text-slate-400">
          {message}
        </div>

        <button
          type="button"
          onClick={runSolarCheck}
          disabled={!sitePolygon || isLoadingSolar}
          className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoadingSolar ? "Checking PVGIS…" : "Run solar resource check"}
        </button>

        {solar && (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">PVGIS result</span>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">RESOURCE FOUND</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{Math.round(solar.specificYield).toLocaleString()}</p>
            <p className="text-xs text-slate-400">kWh/kWp per year · fixed, optimum angle</p>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-xs">
              <span className="text-slate-400">Monthly average</span>
              <strong>{Math.round(solar.monthlyAverage).toLocaleString()} kWh/kWp</strong>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={downloadGeoJson}
          disabled={!sitePolygon}
          className="mt-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] disabled:opacity-40"
        >
          Download boundary (.geojson)
        </button>

        <p className="mt-auto pt-6 text-[10px] leading-4 text-slate-500">
          Preliminary desktop screening using third-party datasets. Results do not replace environmental, planning, grid, legal or technical due diligence.
        </p>
      </aside>

      <div className="relative order-1 h-[480px] min-h-0 lg:order-2 lg:h-[720px]">
        <div
          ref={containerRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Interactive solar site screening map"
        />
        <svg
          ref={drawingOverlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-hidden"
        >
          <path
            data-site-path
            fill="rgba(251, 191, 36, 0.24)"
            stroke="#020617"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            data-site-path
            fill="transparent"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <g data-site-vertices />
        </svg>
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/15 bg-slate-950/85 px-3 py-2 text-xs text-white shadow-lg backdrop-blur">
          {isDrawing ? "Drawing mode · click to add points" : "Pan and zoom to explore"}
        </div>
        <div
          className="absolute bottom-9 left-4 z-10 flex rounded-xl border border-white/15 bg-slate-950/90 p-1 shadow-xl backdrop-blur"
          aria-label="Basemap style"
        >
          {(["streets", "satellite"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={basemap === option}
              onClick={() => selectBasemap(option)}
              className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition ${
                basemap === option
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
