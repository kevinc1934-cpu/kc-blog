import Link from "next/link";
import { models } from "@/lib/models";

export const metadata = { title: "AI Models — KC // kevcspot" };

export default function ModelsPage() {
  return (
    <div className="page-in max-w-6xl mx-auto px-6 py-32">
      <Breadcrumbs items={[{ label: "AI", href: "/ai" }, { label: "Models" }]} />
      <h1 className="font-display font-800 text-4xl md:text-5xl mb-4 gradient-cyan mt-6">Model Breakdowns</h1>
      <p className="text-lg text-[var(--text-dim)] max-w-2xl mb-12">
        Version-by-version analysis of frontier AI models — context windows, benchmarks, and highlights.
      </p>

      {/* Comparison Table */}
      <div className="glass p-6 mb-12 overflow-x-auto">
        <h2 className="font-display font-700 text-lg text-[var(--text-bright)] mb-4">Quick Comparison</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] pb-3 pr-4">Model</th>
              <th className="text-left font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] pb-3 pr-4">Vendor</th>
              <th className="text-left font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] pb-3 pr-4">Max Context</th>
              <th className="text-left font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] pb-3 pr-4">Versions</th>
              <th className="text-left font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] pb-3 pr-4">MMLU (top)</th>
              <th className="text-left font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] pb-3 pr-4">HumanEval (top)</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const topVersion = model.versions[0];
              const topMMLU = topVersion.benchmarks?.find((b) => b.name === "MMLU");
              const topHumanEval = topVersion.benchmarks?.find((b) => b.name === "HumanEval");
              return (
                <tr key={model.slug} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)] transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/ai/models/${model.slug}`} className={`text-[var(--${model.accent})] font-semibold hover:underline`}>
                      {model.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-dim)] font-mono text-xs">{model.vendor}</td>
                  <td className="py-3 pr-4 text-[var(--text)]">{topVersion.contextWindow}</td>
                  <td className="py-3 pr-4 text-[var(--text-dim)]">{model.versions.length}</td>
                  <td className="py-3 pr-4 text-[var(--gold)] font-mono">{topMMLU?.score || "—"}</td>
                  <td className="py-3 pr-4 text-[var(--cyan)] font-mono">{topHumanEval?.score || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Model Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {models.map((model, i) => (
          <Link key={model.slug} href={`/ai/models/${model.slug}`} className="glass p-6 group fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-700 text-xl text-[var(--text-bright)] group-hover:text-[var(--cyan)] transition-colors">
                  {model.name}
                </h3>
                <p className="text-xs text-[var(--text-dim)] font-mono">{model.vendor}</p>
              </div>
              <div className={`chip chip-${model.accent}`}>{model.versions.length} versions</div>
            </div>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-4">{model.tagline}</p>
            <p className="text-xs text-[var(--cyan)] font-mono">{model.overallHighlight}</p>
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
