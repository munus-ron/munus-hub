import ProjectPageClient from "./ProjectClientPage";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectPageClient id={params.id} />;
}