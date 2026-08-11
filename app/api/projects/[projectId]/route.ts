import { auth } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getOwnedProject, serializeProject } from "@/lib/projects/data";
import {
  isProjectStatus,
  isProjectTechnology,
  parseVisibleLayers,
} from "@/lib/projects/project-values";
import { prisma } from "@/lib/prisma";
import type { UpdateProjectPayload } from "@/types/project";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: ProjectRouteContext,
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

  return NextResponse.json({ project });
}

export async function PATCH(
  request: NextRequest,
  context: ProjectRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as UpdateProjectPayload;
  if (body.technology && !isProjectTechnology(body.technology)) {
    return NextResponse.json({ error: "Choose a valid project technology." }, { status: 400 });
  }
  if (body.status && !isProjectStatus(body.status)) {
    return NextResponse.json({ error: "Choose a valid project status." }, { status: 400 });
  }
  if (
    body.map &&
    (!Number.isFinite(body.map.center?.[0]) ||
      !Number.isFinite(body.map.center?.[1]) ||
      !Number.isFinite(body.map.zoom))
  ) {
    return NextResponse.json({ error: "The saved map view is invalid." }, { status: 400 });
  }

  const { projectId } = await context.params;
  const existingProject = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });
  if (!existingProject) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const data: Prisma.ProjectUpdateInput = {};
  if (body.name !== undefined) data.name = body.name.trim().slice(0, 120) || "Untitled site";
  if (body.technology !== undefined) data.technology = body.technology;
  if (body.country !== undefined) data.country = body.country.trim().slice(0, 100);
  if (body.status !== undefined) data.status = body.status;
  if (body.map) {
    data.mapCenterLon = body.map.center[0];
    data.mapCenterLat = body.map.center[1];
    data.mapZoom = Math.min(22, Math.max(1, body.map.zoom));
    data.visibleLayers = parseVisibleLayers(body.map.visibleLayers) as Prisma.InputJsonValue;
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  return NextResponse.json({ project: serializeProject(project) });
}

export async function DELETE(
  _request: NextRequest,
  context: ProjectRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId } = await context.params;
  const result = await prisma.project.deleteMany({
    where: { id: projectId, ownerId: userId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
