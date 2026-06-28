import Link from "next/link";
import { tutorials, tutorialCategories } from "@/lib/tutorials";

export const metadata = { title: "Tutorials — KC // kevcspot" };

export default function TutorialsPage() {
  return (
    <div className="page-in max-w-6xl mx-auto px-6 py-32">
      <h1 className="font-display font-800 text-4xl md:text-5xl mb-4 gradient-gold">Tutorials</h1>
      <p className="text-lg text-[var(--text-dim)] max-w-2xl mb-12">
        Practical guides on sweepstakes casino strategy, local LLM deployment, and anti-detection techniques.
      </p>

      {tutorialCategories.map((cat) => {
        const catTutorials = tutorials.filter((t) => t.categorySlug === cat.slug);
        return (
          <div key={cat.slug} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`chip chip-${cat.accent}`}>{cat.name}</div>
              <span className="text-sm text-[var(--text-dim)]">{catTutorials.length} articles</span>
            </div>
            <p className="text-[var(--text-dim)] mb-6">{cat.description}</p>

            <div className="grid md:grid-cols-2 gap-4">
              {catTutorials.map((tut, i) => (
                <Link
                  key={tut.slug}
                  href={`/tutorials/${tut.categorySlug}/${tut.slug}`}
                  className="glass p-6 group fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[var(--text-dim)] font-mono">{tut.date}</span>
                    <span className="text-xs text-[var(--text-dim)] font-mono">·</span>
                    <span className="text-xs text-[var(--text-dim)] font-mono">{tut.readTime}</span>
                  </div>
                  <h3 className="font-display font-700 text-lg mb-2 text-[var(--text-bright)] group-hover:text-[var(--gold-bright)] transition-colors">
                    {tut.title}
                  </h3>
                  <p className="text-sm text-[var(--text-dim)] leading-relaxed">{tut.description}</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
