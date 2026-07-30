"use client";

import { area } from "@turf/area";
import { centroid } from "@turf/centroid";
import { lineString, polygon } from "@turf/helpers";
import { length } from "@turf/length";
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapMouseEvent,
} from "maplibre-gl";
import { RefObject, useEffect, useRef, useState } from "react";
import type { Coordinate } from "@/lib/geo/types";

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

type UseDrawingToolsOptions = {
  map: MapLibreMap | null;
  drawingOverlayRef: RefObject<SVGSVGElement | null>;
  onBoundaryChange?: () => void;
  onMessage?: (message: string) => void;
};

export function useDrawingTools({
  map,
  drawingOverlayRef,
  onBoundaryChange,
  onMessage,
}: UseDrawingToolsOptions) {
  const pointsRef = useRef<Coordinate[]>([]);
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const closedRing = points.length >= 3 ? [...points, points[0]] : null;
  const sitePolygon = closedRing ? polygon([closedRing]) : null;
  const siteArea = sitePolygon ? area(sitePolygon) : 0;
  const sitePerimeter = closedRing ? length(lineString(closedRing)) : 0;
  const siteCentroid = sitePolygon
    ? (centroid(sitePolygon).geometry.coordinates as Coordinate)
    : null;

  function updateDrawingOverlay(nextPoints: Coordinate[]) {
    const overlay = drawingOverlayRef.current;
    if (!map || !overlay) return;

    const projectedPoints = nextPoints.map((coordinate) =>
      map.project(coordinate),
    );
    const path = projectedPoints
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ");
    const closedPath = projectedPoints.length >= 3 ? `${path} Z` : path;

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

  function syncBoundarySources(nextPoints: Coordinate[]) {
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
    if (!map) return;

    const addSources = () => {
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
    };
    map.once("load", addSources);

    const handleClick = (event: MapMouseEvent) => {
      if (!map.getCanvas().dataset.drawing) return;
      const nextPoints: Coordinate[] = [
        ...pointsRef.current,
        [event.lngLat.lng, event.lngLat.lat],
      ];
      pointsRef.current = nextPoints;
      setPoints(nextPoints);
      onBoundaryChange?.();
      syncBoundarySources(nextPoints);
      onMessage?.(
        nextPoints.length < 3
          ? `Add ${3 - nextPoints.length} more point${3 - nextPoints.length === 1 ? "" : "s"} to form a site.`
          : "Boundary ready. Add more points or finish drawing.",
      );
    };
    const handleContextMenu = (event: MapMouseEvent) => {
      if (!map.getCanvas().dataset.drawing || !pointsRef.current.length) {
        return;
      }
      event.originalEvent.preventDefault();
      const nextPoints = pointsRef.current.slice(0, -1);
      pointsRef.current = nextPoints;
      setPoints(nextPoints);
      onBoundaryChange?.();
      syncBoundarySources(nextPoints);
      onMessage?.(
        nextPoints.length
          ? "Last point removed. Right-click again to undo another point."
          : "Boundary cleared.",
      );
    };
    const refreshOverlay = () => updateDrawingOverlay(pointsRef.current);

    map.on("click", handleClick);
    map.on("contextmenu", handleContextMenu);
    map.on("move", refreshOverlay);
    map.on("resize", refreshOverlay);

    return () => {
      map.off("click", handleClick);
      map.off("contextmenu", handleContextMenu);
      map.off("move", refreshOverlay);
      map.off("resize", refreshOverlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  function toggleDrawing() {
    if (!map) return;
    const next = !isDrawing;
    setIsDrawing(next);
    map.getCanvas().dataset.drawing = next ? "true" : "";
    map.getCanvas().style.cursor = next ? "crosshair" : "";
    onMessage?.(
      next
        ? "Left-click to add points. Right-click to undo the last point."
        : "Drawing paused.",
    );
  }

  function clearSite() {
    pointsRef.current = [];
    setPoints([]);
    onBoundaryChange?.();
    syncBoundarySources([]);
    onMessage?.("Site cleared. Start drawing a new boundary.");
  }

  function undoPoint() {
    const nextPoints = pointsRef.current.slice(0, -1);
    pointsRef.current = nextPoints;
    setPoints(nextPoints);
    onBoundaryChange?.();
    syncBoundarySources(nextPoints);
    onMessage?.(nextPoints.length ? "Last point removed." : "Boundary cleared.");
  }

  function importBoundary(nextPoints: Coordinate[]) {
    pointsRef.current = nextPoints;
    setPoints(nextPoints);
    onBoundaryChange?.();
    setIsDrawing(false);
    if (map) {
      map.getCanvas().dataset.drawing = "";
      map.getCanvas().style.cursor = "";
    }
    syncBoundarySources(nextPoints);

    const longitudes = nextPoints.map(([longitude]) => longitude);
    const latitudes = nextPoints.map(([, latitude]) => latitude);
    map?.fitBounds(
      [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ],
      { padding: 60, maxZoom: 17, duration: 900 },
    );
  }

  return {
    points,
    isDrawing,
    closedRing,
    sitePolygon,
    siteArea,
    sitePerimeter,
    siteCentroid,
    toggleDrawing,
    undoPoint,
    clearSite,
    importBoundary,
  };
}
