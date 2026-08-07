import { currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parseVisibleLayers, isProjectTechnology } from "@/lib/projects/project-values";
import { prisma } from "@/lib/prisma";
import type { SaveProjectPayload } from "@/types/project";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to save a project." }, { status: 401 });
  }
  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "Your account has no verified email." }, { status: 400 });
  }

  const body = (await request.json()) as Partial<SaveProjectPayload>;
  if (!body.boundary || body.boundary.type !== "Polygon") {
    return NextResponse.json({ error: "A site boundary is required." }, { status: 400 });
  }
  if (body.technology && !isProjectTechnology(body.technology)) {
    return NextResponse.json({ error: "Choose a valid project technology." }, { status: 400 });
  }

  await prisma.user.upsert({
    where: { id: user.id },
    update: { email },
    create: { id: user.id, email },
  });

  const project = await prisma.project.create({
    data: {
      ownerId: user.id,
      name: body.name?.trim() || "Untitled site",
      technology: body.technology ?? "solar",
      country: body.country?.trim().slice(0, 100) ?? "",
      boundary: body.boundary as unknown as Prisma.InputJsonValue,
      areaSqm: body.areaSqm,
      perimeterM: body.perimeterM,
      centroidLat: body.centroidLat,
      centroidLon: body.centroidLon,
      mapCenterLat: body.map?.center[1] ?? body.centroidLat,
      mapCenterLon: body.map?.center[0] ?? body.centroidLon,
      mapZoom: body.map?.zoom ?? 13,
      visibleLayers: parseVisibleLayers(body.map?.visibleLayers) as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({
    id: project.id,
    name: project.name,
    workspaceUrl: `/platform/projects/${project.id}`,
  });
}
