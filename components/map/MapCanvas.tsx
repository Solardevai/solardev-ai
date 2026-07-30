"use client";

import { RefObject } from "react";

type MapCanvasProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  drawingOverlayRef: RefObject<SVGSVGElement | null>;
  ariaLabel: string;
};

export function MapCanvas({
  containerRef,
  drawingOverlayRef,
  ariaLabel,
}: MapCanvasProps) {
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
