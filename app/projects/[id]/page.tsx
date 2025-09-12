import ProjectPageClient from "./ProjectClientPage";

export async function generateStaticParams() {
  return [
    { id: "1" },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectPageClient id={params.id} />;
}