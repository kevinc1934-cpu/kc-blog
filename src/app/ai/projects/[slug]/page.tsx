import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import { ProjectDocs } from "./project-docs";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const project = getProject(p.slug);
    return project ? { title: `${project.name} — AI Projects — KC // kevcspot` } : {};
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDocs project={project} />;
}
