import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const post = getPost(p.slug);
    return post ? { title: `${post.title} — KC // kevcspot` } : {};
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="page-in max-w-3xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-dim)] font-mono mb-8">
        <Link href="/" className="hover:text-[var(--gold)] transition-colors">Blog</Link>
        <span className="text-[var(--border-bright)]">/</span>
        <span className="text-[var(--text-bright)]">{post.title}</span>
      </nav>

      <div className={`chip chip-${post.accent} mb-4`}>{post.category}</div>
      <h1 className="font-display font-800 text-3xl md:text-4xl mb-4 gradient-gold">{post.title}</h1>
      <p className="text-lg text-[var(--text-dim)] mb-4">{post.description}</p>
      <div className="flex items-center gap-3 text-xs text-[var(--text-dim)] font-mono mb-12">
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readTime} read</span>
        <span>·</span>
        <span>by {post.author}</span>
        {post.isAiGenerated && <><span>·</span><span className="text-[var(--purple)]">AI-generated</span></>}
      </div>

      <div className="divider-gold mb-8" />

      <article className="content-prose">
        {post.content.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="text-2xl font-bold text-white mt-10 mb-4 first:mt-0">{section.heading}</h2>
            )}
            {section.body && (
              <p className="text-[var(--text)] leading-relaxed mb-6">{renderInline(section.body)}</p>
            )}
            {section.list && (
              <ul className="space-y-2 mb-6">
                {section.list.map((item, j) => (
                  <li key={j} className="text-[var(--text)] leading-relaxed flex gap-3">
                    <span className="text-[var(--gold)] mt-0.5">▸</span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.code && (
              <pre className="font-mono text-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-6 overflow-x-auto">
                <code>{section.code.code}</code>
              </pre>
            )}
            {section.callout && (
              <div className={`my-6 p-4 rounded-xl border ${
                section.callout.type === "warning"
                  ? "border-[var(--red)]/30 bg-[rgba(248,113,113,0.08)]"
                  : section.callout.type === "tip"
                  ? "border-[var(--green)]/30 bg-[rgba(74,222,128,0.06)]"
                  : "border-[var(--cyan)]/30 bg-[rgba(25,228,212,0.06)]"
              }`}>
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  <span className={`font-mono font-bold uppercase text-xs mr-2 ${
                    section.callout.type === "warning" ? "text-[var(--red)]"
                    : section.callout.type === "tip" ? "text-[var(--green)]"
                    : "text-[var(--cyan)]"
                  }`}>
                    {section.callout.type === "warning" ? "⚠ Warning" : section.callout.type === "tip" ? "✦ Tip" : "ℹ Info"}
                  </span>
                  {section.callout.text}
                </p>
              </div>
            )}
            {section.table && (
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {section.table.headers.map((header, k) => (
                        <th key={k} className="text-left font-mono text-xs uppercase tracking-wider text-[var(--gold)] pb-2 pr-4">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, k) => (
                      <tr key={k} className="border-b border-[var(--border)]/50">
                        {row.map((cell, l) => (
                          <td key={l} className="py-2 pr-4 text-sm text-[var(--text)]">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </article>

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <Link href="/" className="text-[var(--gold)] hover:text-[var(--gold-bright)] font-medium transition-colors">
          ← Back to blog
        </Link>
      </div>
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="font-mono text-sm text-[var(--cyan)] bg-[var(--surface)] px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
