import "server-only";

type PvgisResponse = {
  inputs?: {
    location?: {
      latitude?: number;
      longitude?: number;
      elevation?: number;
    };
  };
  outputs?: {
    totals?: { fixed?: { E_y?: number } };
  };
};

export type IndicativeSolarYield = {
  annualYield: number;
  monthlyAverage: number;
  specificYield: number;
  location: {
    latitude: number;
    longitude: number;
    elevation?: number;
  };
};

export async function getIndicativeSolarYield(
  latitude: number,
  longitude: number,
): Promise<IndicativeSolarYield> {
  const url = new URL("https://re.jrc.ec.europa.eu/api/v5_3/PVcalc");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("peakpower", "1");
  url.searchParams.set("loss", "14");
  url.searchParams.set("optimalinclination", "1");
  url.searchParams.set("outputformat", "json");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 2_592_000 },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`PVGIS returned HTTP ${response.status}.`);
  }

  const data = (await response.json()) as PvgisResponse;
  const annualYield = data.outputs?.totals?.fixed?.E_y;
  if (!annualYield) throw new Error("PVGIS returned an incomplete result.");

  return {
    annualYield,
    specificYield: annualYield,
    monthlyAverage: annualYield / 12,
    location: {
      latitude: data.inputs?.location?.latitude ?? latitude,
      longitude: data.inputs?.location?.longitude ?? longitude,
      elevation: data.inputs?.location?.elevation,
    },
  };
}
