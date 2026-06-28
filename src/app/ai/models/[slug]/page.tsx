import Link from "next/link";
import { notFound } from "next/navigation";
import { models, getModel } from "@/lib/models";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const model = getModel(p.slug);
    return model ? { title: `${model.name} — AI Models — KC // kevcspot` } : {};
  });
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  return (
    <div className="page-in max-w-4xl mx-auto px-6 py-32">
      <Breadcrumbs items={[
        { label: "AI", href: "/ai" },
        { label: "Models", href: "/ai/models" },
        { label: model.name },
      ]} />

      <div className={`chip chip-${model.accent} mt-6 mb-4`}>{model.vendor}</div>
      <h1 className="font-display font-800 text-4xl mb-3 gradient-cyan">{model.name}</h1>
      <p className="text-xl text-[var(--text-dim)] mb-8">{model.tagline}</p>

      <div className="glass p-6 mb-8">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2">Overall Highlight</p>
        <p className={`text-lg font-medium text-[var(--${model.accent})]`}>{model.overallHighlight}</p>
      </div>

      <div className="content-prose space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <p className="text-[var(--text)] leading-relaxed">{model.description}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Capabilities</h2>
          <ul className="space-y-2">
            {model.capabilities.map((cap) => (
              <li key={cap} className="text-[var(--text)] leading-relaxed flex gap-3">
                <span className={`text-[var(--${model.accent})] mt-0.5`}>▸</span>
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Use Cases</h2>
          <ul className="space-y-2">
            {model.useCases.map((useCase) => (
              <li key={useCase} className="text-[var(--text)] leading-relaxed flex gap-3">
                <span className="text-[var(--cyan)] mt-0.5">→</span>
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        {/* Version Breakdowns */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Version Breakdown</h2>
          <div className="space-y-6">
            {model.versions.map((version, i) => (
              <div key={version.version} className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-700 text-xl text-[var(--gold-bright)]">{version.version}</h3>
                  <span className="chip chip-neutral">{version.releaseDate}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-1">Context Window</p>
                    <p className="text-[var(--text)] font-medium">{version.contextWindow}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-1">Parameters</p>
                    <p className="text-[var(--text)] font-medium">{version.parameters}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-1">Release</p>
                    <p className="text-[var(--text)] font-medium">{version.releaseDate}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2">Highlights</p>
                  <ul className="space-y-1.5">
                    {version.highlights.map((highlight) => (
                      <li key={highlight} className="text-sm text-[var(--text)] flex gap-2">
                        <span className="text-[var(--cyan)]">▸</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {version.benchmarks && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2">Benchmarks</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {version.benchmarks.map((bench) => (
                        <div key={bench.name} className="bg-[var(--surface)] rounded-lg p-3 text-center">
                          <p className="text-xs font-mono text-[var(--text-dim)] mb-1">{bench.name}</p>
                          <p className="text-lg font-bold text-[var(--gold)]">{bench.score}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link href="/ai/models" className="text-[var(--gold)] hover:text-[var(--gold-bright)] font-medium transition-colors">
          ← Back to all models
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
