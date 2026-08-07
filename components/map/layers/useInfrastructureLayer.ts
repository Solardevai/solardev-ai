"use client";

import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapMouseEvent,
} from "maplibre-gl";
import { Popup } from "maplibre-gl";
import { RefObject, useEffect, useRef, useState } from "react";
import type { Coordinate } from "@/lib/geo/types";
import {
  createInfrastructureVisibility,
  getInfrastructureLayer,
  infrastructureLayers as infrastructureLayerRegistry,
  type InfrastructureLayerId,
} from "@/lib/gis/layers";

export type { InfrastructureLayerId } from "@/lib/gis/layers";

const INFRASTRUCTURE_LAYER_IDS: Record<InfrastructureLayerId, string[]> = {
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

export const INFRASTRUCTURE_OPTIONS = infrastructureLayerRegistry.map(
  (layer) => ({
    id: layer.id,
    label: layer.name,
    color: layer.color,
  }),
);

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

type UseInfrastructureLayerOptions = {
  map: MapLibreMap | null;
  drawingOverlayRef: RefObject<SVGSVGElement | null>;
  initialVisibility?: Partial<Record<InfrastructureLayerId, boolean>>;
};

export function useInfrastructureLayer({
  map,
  drawingOverlayRef,
  initialVisibility,
}: UseInfrastructureLayerOptions) {
  const infrastructureFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const substationFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const detailedInfrastructureFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const infrastructureAbortRef = useRef<AbortController | null>(null);
  const [infrastructureLayers, setInfrastructureLayers] = useState(() => ({
    ...createInfrastructureVisibility(),
    ...initialVisibility,
  }));
  const infrastructureLayersRef = useRef<
    Record<InfrastructureLayerId, boolean>
  >(
    infrastructureLayers,
  );
  const [isLoadingInfrastructure, setIsLoadingInfrastructure] =
    useState(false);
  const [infrastructureNote, setInfrastructureNote] = useState(
    "Substations appear as dots from zoom level 5 and gain detail as you zoom in.",
  );

  function updateInfrastructureOverlay(
    features = infrastructureFeaturesRef.current,
  ) {
    const overlay = drawingOverlayRef.current?.querySelector<SVGGElement>(
      "[data-infrastructure-overlay]",
    );
    if (!map || !overlay) return;

    const zoom = map.getZoom();
    const minimumZoom: Record<string, number> = {
      substation: getInfrastructureLayer("substations").minimumZoom,
      ehv: getInfrastructureLayer("ehv").minimumZoom,
      hv: getInfrastructureLayer("hv").minimumZoom,
      mv: getInfrastructureLayer("mv").minimumZoom,
      "power-unknown": getInfrastructureLayer("unknown").minimumZoom,
      road: getInfrastructureLayer("roads").minimumZoom,
    };
    const colors: Record<string, string> = {
      substation: getInfrastructureLayer("substations").color,
      ehv: getInfrastructureLayer("ehv").color,
      hv: getInfrastructureLayer("hv").color,
      mv: getInfrastructureLayer("mv").color,
      "power-unknown": getInfrastructureLayer("unknown").color,
      road: getInfrastructureLayer("roads").color,
    };
    const elements: SVGElement[] = [];
    const occupiedPointCells = new Set<string>();
    const stateLayer: Record<string, InfrastructureLayerId> = {
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

  async function loadInfrastructure() {
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
    const minimumZoom: Partial<Record<InfrastructureLayerId, number>> = {
      ehv: 6,
      hv: 7,
      mv: 8,
      unknown: 8,
      roads: 9,
    };
    const detailedLayers = (
      ["roads", "mv", "hv", "ehv", "unknown"] as InfrastructureLayerId[]
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
      layers: InfrastructureLayerId[],
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

  useEffect(() => {
    if (!map) return;

    const addLayers = () => {
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
        const layerState: Record<string, InfrastructureLayerId> = {
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
        const layerState: Record<string, InfrastructureLayerId> = {
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

      void loadInfrastructure();
    };
    map.once("load", addLayers);

    const handleIdentifyClick = (event: MapMouseEvent) => {
      if (map.getCanvas().dataset.drawing) return;
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
    };
    const refreshOverlay = () => updateInfrastructureOverlay();
    const refreshData = () => {
      if (Object.values(infrastructureLayersRef.current).some(Boolean)) {
        void loadInfrastructure();
      }
    };

    map.on("click", handleIdentifyClick);
    map.on("move", refreshOverlay);
    map.on("moveend", refreshData);
    map.on("resize", refreshOverlay);

    return () => {
      infrastructureAbortRef.current?.abort();
      map.off("click", handleIdentifyClick);
      map.off("move", refreshOverlay);
      map.off("moveend", refreshData);
      map.off("resize", refreshOverlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  function toggleInfrastructureLayer(layer: InfrastructureLayerId) {
    const next = {
      ...infrastructureLayersRef.current,
      [layer]: !infrastructureLayersRef.current[layer],
    };
    infrastructureLayersRef.current = next;
    setInfrastructureLayers(next);

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
    if (next[layer]) void loadInfrastructure();
  }

  return {
    infrastructureLayers,
    toggleInfrastructureLayer,
    isLoadingInfrastructure,
    infrastructureNote,
  };
}
