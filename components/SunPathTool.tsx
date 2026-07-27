"use client";

import {
  AttributionControl,
  GeoJSONSource,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Point = { latitude: number; longitude: number };
type SunPoint = { minute: number; azimuth: number; elevation: number };

const SATELLITE_STYLE = {
  version: 8 as const,
  sources: {
    satellite: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        "Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
  },
  layers: [
    { id: "satellite", type: "raster" as const, source: "satellite" },
  ],
};

const DEFAULT_POINT = { latitude: 41.3874, longitude: 2.1686 };

function radians(value: number) {
  return (value * Math.PI) / 180;
}

function degrees(value: number) {
  return (value * 180) / Math.PI;
}

function dayOfYear(date: Date) {
  return Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86_400_000,
  );
}

// NOAA fractional-year approximation. Accuracy is appropriate for screening.
function solarPosition(
  dateString: string,
  minute: number,
  point: Point,
  timezoneOffset: number,
) {
  const date = new Date(`${dateString}T12:00:00`);
  const gamma =
    (2 * Math.PI) /
    365 *
    (dayOfYear(date) - 1 + (minute / 60 - 12) / 24);
  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const trueSolarMinutes =
    (minute + equationOfTime + 4 * point.longitude - 60 * timezoneOffset + 1440) %
    1440;
  const hourAngle = radians(trueSolarMinutes / 4 - 180);
  const latitude = radians(point.latitude);
  const cosineZenith =
    Math.sin(latitude) * Math.sin(declination) +
    Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosineZenith)));
  const elevation = 90 - degrees(zenith);
  const azimuth =
    (degrees(
      Math.atan2(
        Math.sin(hourAngle),
        Math.cos(hourAngle) * Math.sin(latitude) -
          Math.tan(declination) * Math.cos(latitude),
      ),
    ) +
      180 +
      360) %
    360;
  return { azimuth, elevation, zenith: degrees(zenith) };
}

function offset(point: Point, bearing: number, metres: number): [number, number] {
  const distance = metres / 6_371_000;
  const bearingRad = radians(bearing);
  const latitude = radians(point.latitude);
  const longitude = radians(point.longitude);
  const lat2 = Math.asin(
    Math.sin(latitude) * Math.cos(distance) +
      Math.cos(latitude) * Math.sin(distance) * Math.cos(bearingRad),
  );
  const lon2 =
    longitude +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distance) * Math.cos(latitude),
      Math.cos(distance) - Math.sin(latitude) * Math.sin(lat2),
    );
  return [degrees(lon2), degrees(lat2)];
}

function formatTime(minute: number) {
  const safe = Math.max(0, Math.min(1439, Math.round(minute)));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function SunIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7 7M17 17L19.1 19.1M19.1 4.9L17 7M7 17L4.9 19.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function SunPathTool() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [point, setPoint] = useState<Point>(DEFAULT_POINT);
  const [query, setQuery] = useState("Barcelona, Spain");
  const [label, setLabel] = useState("Barcelona, Spain");
  const [date, setDate] = useState("2026-12-21");
  const [minute, setMinute] = useState(630);
  const [height, setHeight] = useState(3);
  const [timezone, setTimezone] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("Click anywhere on the map to reposition the analysis.");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const latitude = Number(params.get("lat"));
    const longitude = Number(params.get("lng"));
    const nextDate = params.get("date");
    const nextTime = params.get("time");
    if (Number.isFinite(latitude) && Number.isFinite(longitude) && params.has("lat")) {
      setPoint({ latitude, longitude });
      setLabel(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
    if (nextDate && /^\d{4}-\d{2}-\d{2}$/.test(nextDate)) setDate(nextDate);
    if (nextTime && /^\d{2}:\d{2}$/.test(nextTime)) {
      const [hours, minutes] = nextTime.split(":").map(Number);
      setMinute(hours * 60 + minutes);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new MapLibreMap({
      container: mapContainer.current,
      style: SATELLITE_STYLE,
      center: [point.longitude, point.latitude],
      zoom: 16,
      attributionControl: false,
    });
    map.addControl(new NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new AttributionControl({ compact: true }), "bottom-left");
    markerRef.current = new Marker({ color: "#fbbf24" })
      .setLngLat([point.longitude, point.latitude])
      .addTo(map);
    map.on("load", () => {
      map.addSource("solar-vectors", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "sun-vector",
        type: "line",
        source: "solar-vectors",
        filter: ["==", ["get", "kind"], "sun"],
        paint: { "line-color": "#fbbf24", "line-width": 5, "line-opacity": 0.9 },
      });
      map.addLayer({
        id: "shadow-vector",
        type: "line",
        source: "solar-vectors",
        filter: ["==", ["get", "kind"], "shadow"],
        paint: { "line-color": "#22d3ee", "line-width": 5, "line-opacity": 0.9 },
      });
    });
    map.on("click", (event) => {
      const next = { latitude: event.lngLat.lat, longitude: event.lngLat.lng };
      setPoint(next);
      setLabel(`${next.latitude.toFixed(4)}, ${next.longitude.toFixed(4)}`);
      setQuery(`${next.latitude.toFixed(4)}, ${next.longitude.toFixed(4)}`);
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const path = useMemo<SunPoint[]>(
    () =>
      Array.from({ length: 97 }, (_, index) => {
        const currentMinute = index * 15;
        return {
          minute: currentMinute,
          ...solarPosition(date, currentMinute, point, timezone),
        };
      }),
    [date, point, timezone],
  );
  const sun = solarPosition(date, minute, point, timezone);
  const daylight = path.filter((item) => item.elevation >= 0);
  const sunrise = daylight[0]?.minute ?? 0;
  const sunset = daylight.at(-1)?.minute ?? 1439;
  const shadowLength =
    sun.elevation > 0 ? height / Math.tan(radians(sun.elevation)) : null;

  useEffect(() => {
    const map = mapRef.current;
    markerRef.current?.setLngLat([point.longitude, point.latitude]);
    if (!map?.isStyleLoaded()) return;
    const displayLength = Math.max(25, Math.min(120, (shadowLength ?? 50) * 4));
    const origin: [number, number] = [point.longitude, point.latitude];
    const features: GeoJSON.Feature[] = [];
    if (sun.elevation > 0) {
      features.push({
        type: "Feature",
        properties: { kind: "sun" },
        geometry: { type: "LineString", coordinates: [origin, offset(point, sun.azimuth, 85)] },
      });
      features.push({
        type: "Feature",
        properties: { kind: "shadow" },
        geometry: { type: "LineString", coordinates: [origin, offset(point, (sun.azimuth + 180) % 360, displayLength)] },
      });
    }
    (map.getSource("solar-vectors") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features,
    });
  }, [point, sun.azimuth, sun.elevation, shadowLength]);

  async function search(event: FormEvent) {
    event.preventDefault();
    setIsSearching(true);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const next = { latitude: result.latitude, longitude: result.longitude };
      setPoint(next);
      setLabel(result.label);
      mapRef.current?.flyTo({ center: [next.longitude, next.latitude], zoom: 16 });
      setMessage("Location updated. Time zone is an editable approximation.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Location search failed.");
    } finally {
      setIsSearching(false);
    }
  }

  function share() {
    const params = new URLSearchParams({
      lat: point.latitude.toFixed(5),
      lng: point.longitude.toFixed(5),
      date,
      time: formatTime(minute),
    });
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${params}`);
    setMessage("Shareable link copied to clipboard.");
  }

  function exportCsv() {
    const rows = ["time,azimuth_deg,elevation_deg", ...path.map((item) => `${formatTime(item.minute)},${item.azimuth.toFixed(2)},${item.elevation.toFixed(2)}`)];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    link.download = `solardev-sunpath-${date}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const chartPoints = path
    .filter((item) => item.elevation >= -3)
    .map((item) => `${(item.minute / 1440) * 100},${92 - Math.max(0, item.elevation)}`)
    .join(" ");
  const currentX = (minute / 1440) * 100;
  const currentY = 92 - Math.max(0, sun.elevation);

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center">
        <form onSubmit={search} className="flex min-w-0 flex-1 gap-2">
          <label className="sr-only" htmlFor="sun-location">Address or coordinates</label>
          <input id="sun-location" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Address or 41.3874, 2.1686" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/60" />
          <button className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
            {isSearching ? "Finding…" : "Find"}
          </button>
        </form>
        <div className="flex gap-2">
          <button type="button" onClick={share} className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]">Share</button>
          <button type="button" onClick={exportCsv} className="flex-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-400/15">Export CSV</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative h-[480px] overflow-hidden border-b border-white/10 bg-[#142036] lg:h-auto lg:min-h-[560px] lg:border-b-0 lg:border-r">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#142036]">
            <svg viewBox="0 0 900 620" preserveAspectRatio="xMidYMid slice" className="h-full w-full opacity-80">
              <rect width="900" height="620" fill="#142036" />
              <path d="M-40 130C120 75 205 180 345 135S575 35 940 115V-20H-40Z" fill="#1b2a42" />
              <path d="M-20 560C145 480 245 525 365 475S650 400 930 455V650H-20Z" fill="#192b39" />
              <g fill="none" strokeLinecap="round">
                <path d="M-40 485C110 440 170 310 315 315S470 420 605 340S710 135 940 80" stroke="#4a5b70" strokeWidth="18" />
                <path d="M-40 485C110 440 170 310 315 315S470 420 605 340S710 135 940 80" stroke="#94a3b8" strokeWidth="2" strokeDasharray="12 10" opacity=".7" />
                <path d="M75 -20C120 155 240 200 230 390S145 540 115 650M520 -20C485 120 500 215 650 265S845 310 930 375" stroke="#3d4e63" strokeWidth="10" />
                <path d="M75 -20C120 155 240 200 230 390S145 540 115 650M520 -20C485 120 500 215 650 265S845 310 930 375" stroke="#64748b" strokeWidth="1.5" strokeDasharray="8 9" />
                <path d="M-20 210L165 225L255 145L430 205L555 160L690 205L930 175M350 650L385 510L485 445L510 290L625 215" stroke="#273a52" strokeWidth="5" />
                <path d="M-20 75L165 125L300 75L445 110L610 65L770 105L930 45M-20 390L130 355L280 405L425 370L560 410L720 365L930 415" stroke="#20334b" strokeWidth="3" />
              </g>
              <g fill="#22384e" stroke="#304a61" strokeWidth="2">
                <path d="M285 230L380 210L405 275L312 292Z" />
                <path d="M428 238L505 222L525 275L450 292Z" />
                <path d="M550 390L650 360L680 425L575 451Z" />
                <path d="M680 110L775 92L795 145L700 163Z" />
              </g>
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(2,6,23,.3))]" />
          </div>
          <div ref={mapContainer} className="absolute inset-0 z-10 h-full w-full" aria-label="Interactive satellite map showing sun and shading directions" />
          <div className="pointer-events-none absolute left-4 top-4 z-20 max-w-[calc(100%-2rem)] rounded-xl border border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur">
            <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-1 font-mono text-xs text-slate-300">{point.latitude.toFixed(4)}°, {point.longitude.toFixed(4)}°</p>
          </div>
          <div className="pointer-events-none absolute bottom-5 right-4 z-20 flex gap-2 text-xs font-semibold">
            <span className="rounded-full border border-amber-400/25 bg-slate-950/90 px-3 py-2 text-amber-300">↗ Sun {sun.azimuth.toFixed(1)}°</span>
            <span className="rounded-full border border-cyan-400/25 bg-slate-950/90 px-3 py-2 text-cyan-300">↙ Shading {(sun.azimuth + 180) % 360 | 0}°</span>
          </div>
        </div>

        <aside className="bg-slate-950/70 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Site & time</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-xs text-slate-400">Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-400">UTC offset<input type="number" min="-12" max="14" step="0.5" value={timezone} onChange={(event) => setTimezone(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              ["Azimuth", `${sun.azimuth.toFixed(1)}°`],
              ["Elevation", `${sun.elevation.toFixed(1)}°`],
              ["Zenith", `${sun.zenith.toFixed(1)}°`],
            ].map(([name, value]) => (
              <div key={name} className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{name}</p>
                <p className="mt-1 font-mono text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Shading</p>
              <span className="font-mono text-xl text-white">{shadowLength ? `${shadowLength.toFixed(1)} m` : "Below horizon"}</span>
            </div>
            <label className="mt-4 block text-xs text-slate-400">Object height: <strong className="text-white">{height.toFixed(1)} m</strong>
              <input aria-label="Object height in metres" type="range" min="0.5" max="30" step="0.5" value={height} onChange={(event) => setHeight(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" />
            </label>
          </div>
          <div className="mt-6 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-xs leading-5 text-slate-400">
            <strong className="block text-amber-200">Screening calculation</strong>
            Uses true north and flat ground. Terrain, slope and horizon obstructions are not included.
          </div>
        </aside>
      </div>

      <div className="border-t border-white/10 bg-slate-950/80 px-5 py-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Sunrise {formatTime(sunrise)}</span>
          <span className="rounded-lg bg-amber-400/10 px-3 py-1.5 font-mono text-amber-300">{formatTime(minute)}</span>
          <span>Sunset {formatTime(sunset)}</span>
        </div>
        <input aria-label="Local time of day" type="range" min="0" max="1439" step="5" value={minute} onChange={(event) => setMinute(Number(event.target.value))} className="mt-3 w-full accent-amber-400" />
      </div>

      <div className="grid gap-4 border-t border-white/10 p-5 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-white">Solar elevation</h2><span className="text-xs text-slate-500">Local time · degrees</span></div>
          <svg viewBox="0 0 100 100" role="img" aria-label="Solar elevation throughout the selected day" className="mt-4 h-44 w-full overflow-visible">
            {[20, 40, 60, 80].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(148,163,184,.15)" strokeWidth=".4" />)}
            <polyline points={chartPoints} fill="none" stroke="#fbbf24" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            {sun.elevation >= 0 && <><line x1={currentX} y1="5" x2={currentX} y2="92" stroke="#22d3ee" strokeDasharray="2 2" strokeWidth=".7" /><circle cx={currentX} cy={currentY} r="2" fill="#fbbf24" /></>}
          </svg>
          <div className="flex justify-between font-mono text-[10px] text-slate-500"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_50%_55%,rgba(251,191,36,.12),transparent_62%)] p-4">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-white">Direction compass</h2><span className="text-xs text-slate-500">True north</span></div>
          <div className="relative mx-auto mt-4 aspect-square max-w-48 rounded-full border border-white/10">
            {[0, 45, 90, 135].map((rotation) => <span key={rotation} className="absolute inset-3 border-t border-white/10" style={{ transform: `rotate(${rotation}deg)` }} />)}
            <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] text-slate-400">N</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">S</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">W</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">E</span>
            <span className="absolute inset-[22%] rounded-full border border-amber-400/20" />
            <span className="absolute left-1/2 top-1/2 h-[34%] w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-amber-500 to-amber-200" style={{ transform: `translate(-50%, -100%) rotate(${sun.azimuth}deg)` }} />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 p-2 text-slate-950 shadow-[0_0_24px_rgba(251,191,36,.55)]"><SunIcon className="h-4 w-4" /></span>
          </div>
        </div>
      </div>
      <p role="status" className="border-t border-white/8 px-5 py-3 text-xs text-slate-500">{message}</p>
    </div>
  );
}
