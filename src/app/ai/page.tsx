import Link from "next/link";
import { projects } from "@/lib/projects";
import { models } from "@/lib/models";

export const metadata = { title: "AI — KC // kevcspot" };

export default function AIPage() {
  return (
    <div className="page-in main-wrapper">
      <div className="mb-8">
        <div className="chip chip-gold mb-3">AI Section</div>
        <h1 className="font-display font-800 mb-3 gradient-dual" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Artificial Intelligence</h1>
        <p className="text-[var(--text-dim)]" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
          Projects I've built, and deep dives into the frontier models I work with every day.
        </p>
      </div>

      {/* Projects subsection */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h2 className="font-display font-700 text-2xl text-[var(--text-bright)]">Projects</h2>
          <Link href="/ai/projects" className="text-sm text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.slug} href={`/ai/projects/${project.slug}`} className="glass p-6 group">
              <div className={`chip chip-${project.accent} mb-4`}>{project.category}</div>
              <h3 className="font-display font-700 text-xl mb-2 text-[var(--text-bright)] group-hover:text-[var(--gold-bright)] transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-[var(--text-dim)] mb-4">{project.tagline}</p>
              <p className="text-xs text-[var(--gold)] font-mono">{project.highlight}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Models subsection */}
      <div>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h2 className="font-display font-700 text-2xl text-[var(--text-bright)]">Model Breakdowns</h2>
          <Link href="/ai/models" className="text-sm text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors">Compare all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {models.map((model) => (
            <Link key={model.slug} href={`/ai/models/${model.slug}`} className="glass p-5 group">
              <h3 className="font-display font-700 text-lg text-[var(--text-bright)] group-hover:text-[var(--cyan)] transition-colors mb-1">
                {model.name}
              </h3>
              <p className="text-xs text-[var(--text-dim)] font-mono mb-3">{model.vendor}</p>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-3">{model.tagline}</p>
              <p className="text-xs text-[var(--cyan)] font-mono">{model.overallHighlight}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
