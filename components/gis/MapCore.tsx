"use client";

import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { RefObject, useEffect, useRef, useState } from "react";
import { satelliteBasemap } from "@/lib/gis/layers";

export type MapCoreContext = {
  containerRef: RefObject<HTMLDivElement | null>;
  drawingOverlayRef: RefObject<SVGSVGElement | null>;
  mapRef: RefObject<MapLibreMap | null>;
  map: MapLibreMap | null;
};

export function useMapCore(): MapCoreContext {
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
          [satelliteBasemap.id]: {
            type: "raster",
            tiles: [satelliteBasemap.tileUrl],
            tileSize: satelliteBasemap.tileSize,
            attribution: satelliteBasemap.metadata.attribution,
          },
        },
        layers: [
          {
            id: satelliteBasemap.id,
            type: "raster",
            source: satelliteBasemap.id,
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

    const resizeObserver = new ResizeObserver(() => instance.resize());
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

type MapCoreCanvasProps = Pick<
  MapCoreContext,
  "containerRef" | "drawingOverlayRef"
> & {
  ariaLabel: string;
};

export function MapCoreCanvas({
  containerRef,
  drawingOverlayRef,
  ariaLabel,
}: MapCoreCanvasProps) {
  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        aria-label={ariaLabel}
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
    </>
  );
}
