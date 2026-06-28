import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import { ProjectNav, type NavSection } from "./project-nav";

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

  const sections: NavSection[] = [
    { id: "overview", label: "Overview" },
    { id: "tech-stack", label: "Tech Stack" },
    {
      id: "key-features",
      label: "Key Features",
      sub: project.features.slice(0, 8).map((_, i) => ({
        id: `feature-${i}`,
        label: truncate(project.features[i], 40),
      })),
    },
    { id: "architecture", label: "Architecture" },
    { id: "status", label: "Status" },
  ];

  return (
    <div className="page-in max-w-7xl mx-auto px-6 py-32">
      <Breadcrumbs items={[
        { label: "AI", href: "/ai" },
        { label: "Projects", href: "/ai/projects" },
        { label: project.name },
      ]} />

      <div className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* Left Navigation */}
        <aside className="lg:w-60 lg:shrink-0">
          <ProjectNav sections={sections} accent={project.accent} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          <div className={`chip chip-${project.accent} mb-4`}>{project.category}</div>
          <h1 className="font-display font-800 text-4xl mb-3 gradient-gold">{project.name}</h1>
          <p className="text-xl text-[var(--text-dim)] mb-8">{project.tagline}</p>

          <div className="glass p-6 mb-8">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2">Highlight</p>
            <p className={`text-lg font-medium text-[var(--${project.accent})]`}>{project.highlight}</p>
          </div>

          <div className="content-prose space-y-12">
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-[var(--text)] leading-relaxed">{project.description}</p>
            </section>

            <section id="tech-stack" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="chip chip-neutral">{tech}</span>
                ))}
              </div>
            </section>

            <section id="key-features" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={feature} id={`feature-${i}`} className="scroll-mt-24 text-[var(--text)] leading-relaxed flex gap-3">
                    <span className={`text-[var(--${project.accent})] mt-0.5`}>{"\u25B8"}</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="architecture" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Architecture</h2>
              <p className="text-[var(--text)] leading-relaxed">{project.architecture}</p>
            </section>

            <section id="status" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-4">Status</h2>
              <p className="text-[var(--text)] leading-relaxed">{project.status}</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link href="/ai/projects" className="text-[var(--gold)] hover:text-[var(--gold-bright)] font-medium transition-colors">
              {"\u2190"} Back to all projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.substring(0, n) + "\u2026" : s;
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[var(--text-dim)] font-mono">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--gold)] transition-colors">{item.label}</Link>
          ) : (
            <span className="text-[var(--text-bright)]">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-[var(--border-bright)]">/</span>}
        </span>
      ))}
    </nav>
  );
}
