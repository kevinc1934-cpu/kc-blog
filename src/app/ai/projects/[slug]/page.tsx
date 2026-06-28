import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";

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

  return (
    <div className="page-in max-w-4xl mx-auto px-6 py-32">
      <Breadcrumbs items={[
        { label: "AI", href: "/ai" },
        { label: "Projects", href: "/ai/projects" },
        { label: project.name },
      ]} />

      <div className={`chip chip-${project.accent} mt-6 mb-4`}>{project.category}</div>
      <h1 className="font-display font-800 text-4xl mb-3 gradient-gold">{project.name}</h1>
      <p className="text-xl text-[var(--text-dim)] mb-8">{project.tagline}</p>

      <div className="glass p-6 mb-8">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2">Highlight</p>
        <p className={`text-lg font-medium text-[var(--${project.accent})]`}>{project.highlight}</p>
      </div>

      <div className="content-prose space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <p className="text-[var(--text)] leading-relaxed">{project.description}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="chip chip-neutral">{tech}</span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="text-[var(--text)] leading-relaxed flex gap-3">
                <span className={`text-[var(--${project.accent})] mt-0.5`}>▸</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Architecture</h2>
          <p className="text-[var(--text)] leading-relaxed">{project.architecture}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Status</h2>
          <p className="text-[var(--text)] leading-relaxed">{project.status}</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link href="/ai/projects" className="text-[var(--gold)] hover:text-[var(--gold-bright)] font-medium transition-colors">
          ← Back to all projects
        </Link>
      </div>
    </div>
  );
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
