"use client";

import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { RefObject, useEffect, useRef, useState } from "react";
import {
  basemaps,
  defaultBasemapId,
  type BasemapId,
} from "@/lib/gis/layers";
import type { MapView } from "@/types/gis";

export type MapCoreContext = {
  containerRef: RefObject<HTMLDivElement | null>;
  drawingOverlayRef: RefObject<SVGSVGElement | null>;
  mapRef: RefObject<MapLibreMap | null>;
  map: MapLibreMap | null;
  basemap: BasemapId;
  setBasemap: (basemap: BasemapId) => void;
};

type UseMapCoreOptions = {
  initialView?: Pick<MapView, "center" | "zoom">;
  initialBasemap?: BasemapId;
};

export function useMapCore(options: UseMapCoreOptions = {}): MapCoreContext {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingOverlayRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const initialViewRef = useRef(options.initialView);
  const initialBasemapRef = useRef(options.initialBasemap ?? defaultBasemapId);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [basemap, setBasemapState] = useState<BasemapId>(
    () => options.initialBasemap ?? defaultBasemapId,
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialView = initialViewRef.current;
    const instance = new MapLibreMap({
      container: containerRef.current,
      center: initialView?.center ?? [10, 47],
      zoom: initialView?.zoom ?? 4,
      attributionControl: false,
      style: {
        version: 8,
        sources: Object.fromEntries(
          basemaps.map((item) => [
            item.id,
            {
              type: "raster",
              tiles: [item.tileUrl],
              tileSize: item.tileSize,
              attribution: item.metadata.attribution,
            },
          ]),
        ),
        layers: basemaps.map((item) => ({
          id: item.id,
          type: "raster" as const,
          source: item.id,
          layout: {
            visibility:
              item.id === initialBasemapRef.current ? "visible" : "none",
          },
        })),
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

  function setBasemap(nextBasemap: BasemapId) {
    const instance = mapRef.current;
    if (instance) {
      for (const item of basemaps) {
        if (instance.getLayer(item.id)) {
          instance.setLayoutProperty(
            item.id,
            "visibility",
            item.id === nextBasemap ? "visible" : "none",
          );
        }
      }
    }
    setBasemapState(nextBasemap);
  }

  return {
    containerRef,
    drawingOverlayRef,
    mapRef,
    map,
    basemap,
    setBasemap,
  };
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
