import Link from "next/link";
import { projects } from "@/lib/projects";

export const metadata = { title: "AI Projects — KC // kevcspot" };

export default function ProjectsPage() {
  return (
    <div className="page-in main-wrapper">
      <Breadcrumbs items={[{ label: "AI", href: "/ai" }, { label: "Projects" }]} />
      <h1 className="font-display font-800 mb-3 gradient-gold mt-4" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Projects</h1>
      <p className="text-[var(--text-dim)] mb-6" style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)" }}>
        The Forge ecosystem — AI infrastructure, memory systems, chat interfaces, training, and more.
      </p>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/ai/projects/${project.slug}#overview`}
            className="glass p-4 group block fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`chip chip-${project.accent} flex-shrink-0`}>{project.category}</div>
                <h2 className="font-display font-700 text-[var(--text-bright)] group-hover:text-[var(--gold-bright)] transition-colors truncate" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                  {project.name}
                </h2>
              </div>
              <p className="text-xs text-[var(--gold)] font-mono truncate flex-shrink-0">{project.highlight}</p>
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
