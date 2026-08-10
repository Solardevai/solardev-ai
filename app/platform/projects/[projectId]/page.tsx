import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProjectWorkspace from "@/components/gis/ProjectWorkspace";
import { isAuthenticationAvailable } from "@/lib/auth-config";
import { getLatestOwnedAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";
import { getOwnedProject } from "@/lib/projects/data";

export const metadata: Metadata = {
  title: "GIS Project Workspace",
  description: "Protected SolarDev GIS project workspace.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  if (!isAuthenticationAvailable()) {
    redirect("/sign-in?configuration=required");
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { projectId } = await params;
  const [project, latestAnalysis] = await Promise.all([
    getOwnedProject(userId, projectId),
    getLatestOwnedAnalysisSnapshot(userId, projectId),
  ]);
  if (!project) notFound();

  return (
    <ProjectWorkspace
      project={project}
      initialAnalysis={latestAnalysis?.payload ?? null}
    />
  );
}
