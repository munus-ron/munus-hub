import ProjectPageClient from "./ProjectClientPage";

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

interface ProjectClientPageProps {
  id: string;
}

export default function ProjectClientPage({ id }: ProjectClientPageProps) {
  return <div>Project page for {id}</div>;
}