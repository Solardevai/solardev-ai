import { currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SaveProjectBody = {
  name?: string;
  boundary?: GeoJSON.Polygon;
  areaSqm?: number;
  perimeterM?: number;
  centroidLat?: number;
  centroidLon?: number;
};

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to save a project." }, { status: 401 });
  }
  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "Your account has no verified email." }, { status: 400 });
  }

  const body = (await request.json()) as SaveProjectBody;
  if (!body.boundary || body.boundary.type !== "Polygon") {
    return NextResponse.json({ error: "A site boundary is required." }, { status: 400 });
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
      boundary: body.boundary as unknown as Prisma.InputJsonValue,
      areaSqm: body.areaSqm,
      perimeterM: body.perimeterM,
      centroidLat: body.centroidLat,
      centroidLon: body.centroidLon,
    },
  });

  return NextResponse.json({ id: project.id, name: project.name });
}
