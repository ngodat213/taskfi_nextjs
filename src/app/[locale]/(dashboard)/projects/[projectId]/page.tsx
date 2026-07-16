import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <DashboardView projectId={projectId} />;
}
