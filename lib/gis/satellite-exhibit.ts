import "server-only";

const WEB_MERCATOR_LIMIT = 20_037_508.342789244;
const SATELLITE_EXPORT_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export";

export type SatelliteExhibit = {
  imageBytes: Uint8Array;
  extent: {
    minimumX: number;
    minimumY: number;
    maximumX: number;
    maximumY: number;
  };
};

export function projectToWebMercator(longitude: number, latitude: number) {
  const clampedLatitude = Math.max(-85.05112878, Math.min(85.05112878, latitude));
  return {
    x: (longitude * WEB_MERCATOR_LIMIT) / 180,
    y:
      (Math.log(Math.tan(((90 + clampedLatitude) * Math.PI) / 360)) /
        Math.PI) *
      WEB_MERCATOR_LIMIT,
  };
}

function createExhibitExtent(
  ring: number[][],
  aspectRatio: number,
  paddingRatio: number,
) {
  const projected = ring.map(([longitude, latitude]) =>
    projectToWebMercator(longitude, latitude),
  );
  let minimumX = Math.min(...projected.map((point) => point.x));
  let maximumX = Math.max(...projected.map((point) => point.x));
  let minimumY = Math.min(...projected.map((point) => point.y));
  let maximumY = Math.max(...projected.map((point) => point.y));

  const centerX = (minimumX + maximumX) / 2;
  const centerY = (minimumY + maximumY) / 2;
  let width = Math.max(10, maximumX - minimumX) * (1 + paddingRatio * 2);
  let height = Math.max(10, maximumY - minimumY) * (1 + paddingRatio * 2);

  if (width / height > aspectRatio) {
    height = width / aspectRatio;
  } else {
    width = height * aspectRatio;
  }

  minimumX = centerX - width / 2;
  maximumX = centerX + width / 2;
  minimumY = centerY - height / 2;
  maximumY = centerY + height / 2;
  return { minimumX, minimumY, maximumX, maximumY };
}

export async function getSatelliteExhibit(
  ring: number[][],
  aspectRatio: number,
): Promise<SatelliteExhibit> {
  if (
    ring.length < 3 ||
    !ring.every(
      ([longitude, latitude]) =>
        Number.isFinite(longitude) && Number.isFinite(latitude),
    )
  ) {
    throw new Error("A valid site boundary is required for satellite imagery.");
  }

  const extent = createExhibitExtent(ring, aspectRatio, 0.12);
  const parameters = new URLSearchParams({
    bbox: [
      extent.minimumX,
      extent.minimumY,
      extent.maximumX,
      extent.maximumY,
    ].join(","),
    bboxSR: "3857",
    imageSR: "3857",
    size: "1200,937",
    format: "jpg",
    transparent: "false",
    f: "image",
  });
  const response = await fetch(`${SATELLITE_EXPORT_URL}?${parameters}`, {
    signal: AbortSignal.timeout(15_000),
    next: { revalidate: 2_592_000 },
  });
  if (!response.ok || !response.headers.get("content-type")?.includes("image/")) {
    throw new Error(`Satellite imagery request failed (${response.status}).`);
  }

  return {
    imageBytes: new Uint8Array(await response.arrayBuffer()),
    extent,
  };
}
