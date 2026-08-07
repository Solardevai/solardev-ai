import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  fetchInfrastructure,
  InfrastructureSourceError,
} from "@/lib/gis/infrastructure-service";
import type { InfrastructureLayerId } from "@/lib/gis/layers";
import {
  analyzeInfrastructureProximity,
  boundsAroundSite,
} from "@/lib/gis/proximity";
import { getOwnedProject } from "@/lib/projects/data";
import type { InfrastructureAnalysis } from "@/types/gis";

type AnalysisRouteContext = {
  params: Promise<{ projectId: string }>;
};

const SEARCH_RADIUS_KM = 15;
const ANALYSIS_LAYERS = new Set<InfrastructureLayerId>([
  "roads",
  "mv",
  "hv",
  "ehv",
  "substations",
  "unknown",
]);

export async function POST(
  _request: NextRequest,
  context: AnalysisRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId } = await context.params;
  const project = await getOwnedProject(userId, projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  try {
    const infrastructure = await fetchInfrastructure(
      boundsAroundSite(project.site.geometry, SEARCH_RADIUS_KM),
      ANALYSIS_LAYERS,
    );
    const uniqueAssets = new Set(
      infrastructure.features.map(
        (feature) =>
          `${feature.properties.osmType}:${feature.properties.osmId}`,
      ),
    );
    const analysis: InfrastructureAnalysis = {
      projectId,
      generatedAt: new Date().toISOString(),
      searchRadiusKm: SEARCH_RADIUS_KM,
      assetsScanned: uniqueAssets.size,
      results: analyzeInfrastructureProximity(
        project.site.geometry,
        infrastructure.features,
      ),
      source: {
        provider: infrastructure.metadata.source,
        endpoint: infrastructure.metadata.sourceEndpoint,
        datasetTimestamp: infrastructure.metadata.sourceTimestamp,
        retrievedAt: infrastructure.metadata.retrievedAt,
        licence: "OpenStreetMap data © contributors, ODbL 1.0",
      },
      limitations: [
        "OpenStreetMap coverage and tagging vary by location.",
        "Distances are geospatial screening measurements, not surveyed routes.",
        "Mapped proximity does not establish access rights, grid capacity or connection feasibility.",
        `Assets outside the ${SEARCH_RADIUS_KM} km search radius are not evaluated.`,
      ],
    };

    return NextResponse.json(
      { analysis },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof InfrastructureSourceError) {
      console.error("[project infrastructure analysis] Overpass failed", {
        projectId,
        failures: error.failures,
      });
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: { "Retry-After": "20" } },
      );
    }
    console.error("[project infrastructure analysis] unexpected failure", {
      projectId,
      error,
    });
    return NextResponse.json(
      { error: "Infrastructure analysis could not be completed." },
      { status: 502 },
    );
  }
}
