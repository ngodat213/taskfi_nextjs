import { RetroDetailView } from "@/features/retros/components/retro-detail-view";

interface RetroDetailPageProps {
  params: Promise<{
    retroId: string;
  }>;
}

export default async function RetroDetailPage({
  params,
}: RetroDetailPageProps) {
  const { retroId } = await params;
  return <RetroDetailView retroId={retroId} />;
}
