"use client";

import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

export function useMapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingOverlayRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const instance = new MapLibreMap({
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

    instance.addControl(
      new NavigationControl({ showCompass: true }),
      "top-right",
    );
    instance.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
    instance.addControl(
      new AttributionControl({ compact: true }),
      "bottom-right",
    );

    mapRef.current = instance;
    setMap(instance);

    const resizeObserver = new ResizeObserver(() => {
      instance.resize();
    });
    resizeObserver.observe(containerRef.current);
    const resizeFrame = requestAnimationFrame(() => instance.resize());

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      instance.remove();
      mapRef.current = null;
      setMap(null);
    };
  }, []);

  return { containerRef, drawingOverlayRef, mapRef, map };
}
