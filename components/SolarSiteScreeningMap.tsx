"use client";

import { area, centroid, length, lineString, polygon } from "@turf/turf";
import {
  AttributionControl,
  type GeoJSONSource,
  Map as MapLibreMap,
  NavigationControl,
  Popup,
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
type ExportFormat = "geojson" | "kml" | "kmz";
type InfrastructureLayer =
  | "roads"
  | "mv"
  | "hv"
  | "ehv"
  | "substations"
  | "unknown";

const INFRASTRUCTURE_LAYER_IDS: Record<InfrastructureLayer, string[]> = {
  roads: ["infrastructure-roads", "infrastructure-roads-markers"],
  mv: ["infrastructure-mv", "infrastructure-mv-markers"],
  hv: ["infrastructure-hv", "infrastructure-hv-markers"],
  ehv: ["infrastructure-ehv", "infrastructure-ehv-markers"],
  substations: [
    "infrastructure-substation-halo",
    "infrastructure-substations",
    "infrastructure-substation-fill",
  ],
  unknown: ["infrastructure-unknown", "infrastructure-unknown-markers"],
};

const INFRASTRUCTURE_OPTIONS: Array<{
  id: InfrastructureLayer;
  label: string;
  color: string;
}> = [
  { id: "roads", label: "Main roads", color: "#f8fafc" },
  { id: "mv", label: "MV 1–<45 kV", color: "#fb923c" },
  { id: "hv", label: "HV 45–<220 kV", color: "#ef4444" },
  { id: "ehv", label: "EHV ≥220 kV", color: "#a855f7" },
  { id: "substations", label: "Substations", color: "#22d3ee" },
  { id: "unknown", label: "Voltage unknown", color: "#94a3b8" },
];

function createInfrastructureLayerState(): Record<InfrastructureLayer, boolean> {
  return {
    roads: false,
    mv: false,
    hv: false,
    ehv: false,
    substations: true,
    unknown: false,
  };
}

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
  const infrastructureFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const substationFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const detailedInfrastructureFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const infrastructureAbortRef = useRef<AbortController | null>(null);
  const infrastructureLayersRef = useRef<Record<InfrastructureLayer, boolean>>(
    createInfrastructureLayerState(),
  );
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Search for a location, then start drawing your site.");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSolar, setIsLoadingSolar] = useState(false);
  const [solar, setSolar] = useState<SolarResult | null>(null);
  const [exportFormat, setExportFormat] =
    useState<ExportFormat>("kmz");
  const [isExporting, setIsExporting] = useState(false);
  const [infrastructureLayers, setInfrastructureLayers] = useState(
    createInfrastructureLayerState,
  );
  const [isLoadingInfrastructure, setIsLoadingInfrastructure] =
    useState(false);
  const [infrastructureNote, setInfrastructureNote] = useState(
    "Substations appear as dots from zoom level 5 and gain detail as you zoom in.",
  );

  const closedRing = points.length >= 3 ? [...points, points[0]] : null;
  const sitePolygon = closedRing ? polygon([closedRing]) : null;
  const siteArea = sitePolygon ? area(sitePolygon) : 0;
  const sitePerimeter = closedRing ? length(lineString(closedRing)) : 0;

  async function loadInfrastructure(map = mapRef.current) {
    if (!map) return;

    const zoom = map.getZoom();
    const selected = infrastructureLayersRef.current;
    if (!Object.values(selected).some(Boolean)) {
      substationFeaturesRef.current = [];
      detailedInfrastructureFeaturesRef.current = [];
      infrastructureFeaturesRef.current = [];
      (map.getSource("infrastructure") as GeoJSONSource | undefined)?.setData(
        EMPTY_COLLECTION,
      );
      updateInfrastructureOverlay([]);
      return;
    }
    if (zoom < 5) {
      setInfrastructureNote("Zoom to level 5 or closer to load infrastructure.");
      return;
    }

    const bounds = map.getBounds();
    const baseParameters = {
      south: bounds.getSouth().toFixed(5),
      west: bounds.getWest().toFixed(5),
      north: bounds.getNorth().toFixed(5),
      east: bounds.getEast().toFixed(5),
    };
    const minimumZoom: Partial<Record<InfrastructureLayer, number>> = {
      ehv: 6,
      hv: 7,
      mv: 8,
      unknown: 8,
      roads: 9,
    };
    const detailedLayers = (
      ["roads", "mv", "hv", "ehv", "unknown"] as InfrastructureLayer[]
    ).filter(
      (layer) => selected[layer] && zoom >= (minimumZoom[layer] ?? 8),
    );

    infrastructureAbortRef.current?.abort();
    const controller = new AbortController();
    infrastructureAbortRef.current = controller;
    setIsLoadingInfrastructure(true);
    setInfrastructureNote("Loading visible infrastructure…");

    const requestGroup = async (
      group: "substations" | "details",
      layers: InfrastructureLayer[],
    ) => {
      const parameters = new URLSearchParams({
        ...baseParameters,
        layers: layers.join(","),
      });
      const response = await fetch(`/api/infrastructure?${parameters}`, {
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Infrastructure data is unavailable.");
      }
      return {
        group,
        features: (result.features ?? []) as GeoJSON.Feature[],
        sourceTimestamp: result.metadata?.sourceTimestamp as string | undefined,
      };
    };

    try {
      const requests: Array<ReturnType<typeof requestGroup>> = [];
      if (selected.substations) {
        requests.push(requestGroup("substations", ["substations"]));
      } else {
        substationFeaturesRef.current = [];
      }
      if (detailedLayers.length) {
        requests.push(requestGroup("details", detailedLayers));
      } else {
        detailedInfrastructureFeaturesRef.current = [];
      }

      const results = await Promise.allSettled(requests);
      let sourceTimestamp: string | undefined;
      const failures: string[] = [];
      for (const result of results) {
        if (result.status === "rejected") {
          if (
            !(result.reason instanceof DOMException) ||
            result.reason.name !== "AbortError"
          ) {
            failures.push(
              result.reason instanceof Error
                ? result.reason.message
                : "A layer request failed.",
            );
          }
          continue;
        }
        sourceTimestamp ??= result.value.sourceTimestamp;
        if (result.value.group === "substations") {
          substationFeaturesRef.current = result.value.features;
        } else {
          detailedInfrastructureFeaturesRef.current = result.value.features;
        }
      }
      if (infrastructureAbortRef.current !== controller) return;

      const features = [
        ...substationFeaturesRef.current,
        ...detailedInfrastructureFeaturesRef.current,
      ];
      infrastructureFeaturesRef.current = features;
      (map.getSource("infrastructure") as GeoJSONSource | undefined)?.setData({
        type: "FeatureCollection",
        features,
      });
      updateInfrastructureOverlay(features);

      const sourceDate = sourceTimestamp
        ? new Date(sourceTimestamp).toLocaleDateString()
        : "latest available";
      const assetCount = new Set(
        features.map(
          (feature) =>
            `${feature.properties?.osmType}-${feature.properties?.osmId}`,
        ),
      ).size;
      setInfrastructureNote(
        failures.length && assetCount === 0
          ? failures[0]
          : `${assetCount.toLocaleString()} mapped assets · OSM ${sourceDate}`,
      );
    } finally {
      if (infrastructureAbortRef.current === controller) {
        setIsLoadingInfrastructure(false);
      }
    }
  }

  function updateInfrastructureOverlay(
    features = infrastructureFeaturesRef.current,
  ) {
    const map = mapRef.current;
    const overlay = drawingOverlayRef.current?.querySelector<SVGGElement>(
      "[data-infrastructure-overlay]",
    );
    if (!map || !overlay) return;

    const zoom = map.getZoom();
    const minimumZoom: Record<string, number> = {
      substation: 5,
      ehv: 6,
      hv: 7,
      mv: 8,
      "power-unknown": 8,
      road: 9,
    };
    const colors: Record<string, string> = {
      substation: "#22d3ee",
      ehv: "#a855f7",
      hv: "#ef4444",
      mv: "#fb923c",
      "power-unknown": "#94a3b8",
      road: "#f8fafc",
    };
    const elements: SVGElement[] = [];
    const occupiedPointCells = new Set<string>();
    const stateLayer: Record<string, InfrastructureLayer> = {
      substation: "substations",
      ehv: "ehv",
      hv: "hv",
      mv: "mv",
      "power-unknown": "unknown",
      road: "roads",
    };

    for (const feature of features) {
      const kind = String(feature.properties?.kind ?? "");
      if (!infrastructureLayersRef.current[stateLayer[kind]]) continue;
      if (zoom < (minimumZoom[kind] ?? 8)) continue;
      const color = colors[kind] ?? "#ffffff";
      const geometry = feature.geometry;

      if (geometry.type === "Point") {
        if (feature.properties?.marker !== true) continue;
        const point = map.project(geometry.coordinates as Coordinate);
        const cellSize = zoom < 6 ? 20 : zoom < 7 ? 12 : 0;
        if (cellSize) {
          const cell = `${kind}-${Math.round(point.x / cellSize)}-${Math.round(point.y / cellSize)}`;
          if (occupiedPointCells.has(cell)) continue;
          occupiedPointCells.add(cell);
        }
        const halo = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        const radius =
          kind === "substation"
            ? Math.max(4, Math.min(14, 3 + (zoom - 5) * 1.35))
            : Math.max(3, Math.min(8, 3 + (zoom - 7) * 0.75));
        halo.setAttribute("cx", String(point.x));
        halo.setAttribute("cy", String(point.y));
        halo.setAttribute("r", String(radius + (kind === "substation" ? 7 : 3)));
        halo.setAttribute("fill", color);
        halo.setAttribute("fill-opacity", kind === "substation" ? "0.28" : "0.18");
        halo.setAttribute("stroke", "#ffffff");
        halo.setAttribute("stroke-opacity", "0.75");
        halo.setAttribute("stroke-width", "1");
        elements.push(halo);

        const marker = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        marker.setAttribute("cx", String(point.x));
        marker.setAttribute("cy", String(point.y));
        marker.setAttribute("r", String(radius));
        marker.setAttribute("fill", color);
        marker.setAttribute("fill-opacity", "0.98");
        marker.setAttribute("stroke", "#ffffff");
        marker.setAttribute("stroke-width", kind === "substation" ? "3" : "2");
        elements.push(marker);
        continue;
      }

      const rings =
        geometry.type === "Polygon"
          ? geometry.coordinates
          : geometry.type === "LineString"
            ? [geometry.coordinates]
            : [];
      if (!rings.length || (kind === "substation" && zoom < 10)) continue;

      for (const ring of rings) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        const projected = ring.map((coordinate) =>
          map.project(coordinate as Coordinate),
        );
        const pathData = projected
          .map(
            (point, index) =>
              `${index === 0 ? "M" : "L"}${point.x},${point.y}`,
          )
          .join(" ");
        path.setAttribute(
          "d",
          `${pathData}${geometry.type === "Polygon" ? " Z" : ""}`,
        );
        path.setAttribute(
          "fill",
          geometry.type === "Polygon" ? color : "none",
        );
        path.setAttribute(
          "fill-opacity",
          geometry.type === "Polygon" ? "0.42" : "0",
        );
        path.setAttribute("stroke", color);
        path.setAttribute(
          "stroke-width",
          kind === "substation" ? "3" : kind === "ehv" ? "4" : "3",
        );
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        if (kind === "power-unknown") {
          path.setAttribute("stroke-dasharray", "5 5");
        }
        elements.push(path);
      }
    }

    overlay.replaceChildren(...elements);
  }

  function toggleInfrastructureLayer(layer: InfrastructureLayer) {
    const next = {
      ...infrastructureLayersRef.current,
      [layer]: !infrastructureLayersRef.current[layer],
    };
    infrastructureLayersRef.current = next;
    setInfrastructureLayers(next);

    const map = mapRef.current;
    if (!map) return;
    const isVisible = next[layer];
    for (const layerId of INFRASTRUCTURE_LAYER_IDS[layer]) {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          isVisible ? "visible" : "none",
        );
      }
    }
    if (next[layer]) void loadInfrastructure(map);
  }

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
          circle.setAttribute("stroke", "#34d399");
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
          {
            id: "satellite",
            type: "raster",
            source: "satellite",
          },
        ],
      },
    });

    map.addControl(new NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      map.addSource("infrastructure", {
        type: "geojson",
        data: EMPTY_COLLECTION,
        attribution: "© OpenStreetMap contributors",
      });
      const lineLayer = (
        id: string,
        kind: string,
        color: string,
        width: number,
        dasharray?: number[],
      ) => {
        const layerState: Record<string, InfrastructureLayer> = {
          road: "roads",
          mv: "mv",
          hv: "hv",
          ehv: "ehv",
          "power-unknown": "unknown",
        };
        map.addLayer({
          id,
          type: "line",
          source: "infrastructure",
          filter: ["==", ["get", "kind"], kind],
          layout: {
            visibility: infrastructureLayersRef.current[layerState[kind]]
              ? "visible"
              : "none",
            "line-cap": "round",
          },
          paint: {
            "line-color": color,
            "line-width": width,
            "line-opacity": 0.9,
            ...(dasharray ? { "line-dasharray": dasharray } : {}),
          },
        });
      };
      const markerLayer = (
        id: string,
        kind: string,
        color: string,
        radius: number,
      ) => {
        const layerState: Record<string, InfrastructureLayer> = {
          road: "roads",
          mv: "mv",
          hv: "hv",
          ehv: "ehv",
          "power-unknown": "unknown",
        };
        map.addLayer({
          id,
          type: "circle",
          source: "infrastructure",
          filter: [
            "all",
            ["==", ["get", "kind"], kind],
            ["==", ["get", "marker"], true],
          ],
          layout: {
            visibility: infrastructureLayersRef.current[layerState[kind]]
              ? "visible"
              : "none",
          },
          paint: {
            "circle-radius": radius,
            "circle-color": color,
            "circle-opacity": 0.95,
            "circle-stroke-color": "#020617",
            "circle-stroke-width": 2,
          },
        });
      };
      lineLayer("infrastructure-roads", "road", "#f8fafc", 1.5);
      lineLayer("infrastructure-mv", "mv", "#fb923c", 2);
      lineLayer("infrastructure-hv", "hv", "#ef4444", 2.5);
      lineLayer("infrastructure-ehv", "ehv", "#a855f7", 3);
      lineLayer(
        "infrastructure-unknown",
        "power-unknown",
        "#94a3b8",
        1.5,
        [2, 2],
      );
      markerLayer("infrastructure-roads-markers", "road", "#f8fafc", 3);
      markerLayer("infrastructure-mv-markers", "mv", "#fb923c", 5);
      markerLayer("infrastructure-hv-markers", "hv", "#ef4444", 6);
      markerLayer("infrastructure-ehv-markers", "ehv", "#a855f7", 7);
      markerLayer(
        "infrastructure-unknown-markers",
        "power-unknown",
        "#94a3b8",
        4,
      );
      map.addLayer({
        id: "infrastructure-substation-fill",
        type: "fill",
        source: "infrastructure",
        filter: [
          "all",
          ["==", ["get", "kind"], "substation"],
          ["==", ["geometry-type"], "Polygon"],
        ],
        minzoom: 10,
        layout: {
          visibility: infrastructureLayersRef.current.substations
            ? "visible"
            : "none",
        },
        paint: {
          "fill-color": "#22d3ee",
          "fill-opacity": 0.62,
          "fill-outline-color": "#ffffff",
        },
      });
      map.addLayer({
        id: "infrastructure-substation-halo",
        type: "circle",
        source: "infrastructure",
        filter: [
          "all",
          ["==", ["get", "kind"], "substation"],
          ["==", ["geometry-type"], "Point"],
        ],
        minzoom: 5,
        layout: {
          visibility: infrastructureLayersRef.current.substations
            ? "visible"
            : "none",
        },
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            5,
            8,
            12,
            14,
            28,
          ],
          "circle-color": "#22d3ee",
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            0.18,
            8,
            0.3,
            14,
            0.38,
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
          "circle-stroke-opacity": 0.8,
        },
      });
      map.addLayer({
        id: "infrastructure-substations",
        type: "circle",
        source: "infrastructure",
        filter: [
          "all",
          ["==", ["get", "kind"], "substation"],
          ["==", ["geometry-type"], "Point"],
        ],
        minzoom: 5,
        layout: {
          visibility: infrastructureLayersRef.current.substations
            ? "visible"
            : "none",
        },
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            3,
            8,
            6,
            14,
            13,
          ],
          "circle-color": "#22d3ee",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            1,
            8,
            2,
            14,
            4,
          ],
        },
      });

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
        paint: { "fill-color": "#34d399", "fill-opacity": 0.25 },
      });
      map.addLayer({
        id: "site-line-casing",
        type: "line",
        source: "site-line",
        paint: {
          "line-color": "#020617",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
      map.addLayer({
        id: "site-line",
        type: "line",
        source: "site-line",
        paint: {
          "line-color": "#34d399",
          "line-width": 2,
        },
      });
      map.addLayer({
        id: "site-points",
        type: "circle",
        source: "site-points",
        paint: {
          "circle-radius": 6,
          "circle-color": "#0f172a",
          "circle-stroke-color": "#34d399",
          "circle-stroke-width": 3,
        },
      });
      void loadInfrastructure(map);
    });

    map.on("click", (event) => {
      if (!map.getCanvas().dataset.drawing) {
        const features = map.queryRenderedFeatures(event.point, {
          layers: Object.values(INFRASTRUCTURE_LAYER_IDS)
            .flat()
            .filter((layerId) => map.getLayer(layerId)),
        });
        const feature = features[0];
        if (!feature?.properties) return;
        const voltage = feature.properties.voltage
          ? `${(Number(feature.properties.voltage) / 1_000).toLocaleString()} kV`
          : "Not mapped";
        const title =
          feature.properties.name ||
          (feature.properties.kind === "road"
            ? `${feature.properties.roadClass ?? "Road"}`
            : feature.properties.kind === "substation"
              ? "Substation"
              : "Power route");
        const popupContent = document.createElement("div");
        popupContent.className = "infrastructure-popup";
        const heading = document.createElement("strong");
        heading.textContent = String(title);
        const details = document.createElement("p");
        details.textContent =
          feature.properties.kind === "road"
            ? `Road class: ${feature.properties.roadClass ?? "unknown"}`
            : `Voltage: ${voltage} · Operator: ${feature.properties.operator ?? "not mapped"}`;
        popupContent.append(heading, details);
        new Popup({ closeButton: true, maxWidth: "280px" })
          .setLngLat(event.lngLat)
          .setDOMContent(popupContent)
          .addTo(map);
        return;
      }
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
    const refreshDrawingOverlay = () => {
      updateDrawingOverlay(pointsRef.current);
      updateInfrastructureOverlay();
    };
    const refreshInfrastructure = () => {
      if (Object.values(infrastructureLayersRef.current).some(Boolean)) {
        void loadInfrastructure(map);
      }
    };
    map.on("move", refreshDrawingOverlay);
    map.on("moveend", refreshInfrastructure);
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
      infrastructureAbortRef.current?.abort();
      map.off("move", refreshDrawingOverlay);
      map.off("moveend", refreshInfrastructure);
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

  function createKml() {
    if (!closedRing) return "";
    const coordinates = closedRing
      .map(([longitude, latitude]) => `${longitude},${latitude},0`)
      .join(" ");

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>SolarDev Site Boundary</name>
    <Style id="site-boundary">
      <LineStyle><color>ff99d334</color><width>2</width></LineStyle>
      <PolyStyle><color>4099d334</color></PolyStyle>
    </Style>
    <Placemark>
      <name>SolarDev Site Boundary</name>
      <description><![CDATA[
        Gross area: ${formatArea(siteArea)}<br/>
        Perimeter: ${formatDistance(sitePerimeter)}<br/>
        Generated by SolarDev AI Site Check.
      ]]></description>
      <styleUrl>#site-boundary</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinates}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;
  }

  async function downloadBoundary() {
    if (!sitePolygon) return;
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

      const kml = createKml();
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
          <button
            type="button"
            onClick={toggleDrawing}
            className={`mt-2 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
              isDrawing
                ? "bg-emerald-400 text-slate-950"
                : "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
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
          {isLoadingSolar
            ? "Calculating with PVGIS…"
            : "Calculate indicative PV yield"}
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
              <span className="text-slate-400">Monthly average</span>
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

        <p className="mt-auto pt-6 text-[10px] leading-4 text-slate-500">
          Preliminary boundary measurement and modelled solar pre-check using
          third-party data. It does not assess environmental, planning, land,
          terrain, grid, legal or technical constraints and does not replace
          professional due diligence.
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
          <g data-infrastructure-overlay />
          <path
            data-site-path
            fill="rgba(52, 211, 153, 0.2)"
            stroke="#020617"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            data-site-path
            fill="transparent"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g data-site-vertices />
        </svg>
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/15 bg-slate-950/85 px-3 py-2 text-xs text-white shadow-lg backdrop-blur">
          {isDrawing ? "Drawing mode · click to add points" : "Pan and zoom to explore"}
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
                    checked={infrastructureLayers[option.id]}
                    onChange={() => toggleInfrastructureLayer(option.id)}
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
              {isLoadingInfrastructure ? "Loading…" : infrastructureNote}
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
