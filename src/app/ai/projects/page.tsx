import Link from "next/link";
import { projects } from "@/lib/projects";

export const metadata = { title: "AI Projects — KC // kevcspot" };

export default function ProjectsPage() {
  return (
    <div className="page-in max-w-6xl mx-auto px-6 py-32">
      <Breadcrumbs items={[{ label: "AI", href: "/ai" }, { label: "Projects" }]} />
      <h1 className="font-display font-800 text-4xl md:text-5xl mb-4 gradient-gold mt-6">Projects</h1>
      <p className="text-lg text-[var(--text-dim)] max-w-2xl mb-12">
        AI infrastructure, desktop applications, and memory systems — all built to solve real problems.
      </p>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <Link key={project.slug} href={`/ai/projects/${project.slug}`} className="glass p-8 group block fade-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`chip chip-${project.accent}`}>{project.category}</div>
                  <span className="text-xs text-[var(--text-dim)] font-mono">{project.status}</span>
                </div>
                <h2 className="font-display font-700 text-2xl mb-2 text-[var(--text-bright)] group-hover:text-[var(--gold-bright)] transition-colors">
                  {project.name}
                </h2>
                <p className="text-[var(--text-dim)] leading-relaxed mb-4">{project.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span key={tech} className="chip chip-neutral">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="md:w-64 md:border-l md:border-[var(--border)] md:pl-6">
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2">Highlight</p>
                <p className="text-sm text-[var(--gold)]">{project.highlight}</p>
              </div>
            </div>
          </Link>
        ))}
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
