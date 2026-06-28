import type { MDXComponents } from "mdx/types";

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-6 mt-12 first:mt-0 text-[var(--gold)]">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-10 text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-8 text-[var(--cyan)]">{children}</h3>,
    p: ({ children }) => <p className="text-[var(--text)] leading-relaxed mb-6">{children}</p>,
    ul: ({ children }) => <ul className="list-none mb-6 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-[var(--text)]">{children}</ol>,
    li: ({ children }) => <li className="text-[var(--text)] leading-relaxed pl-1">{children}</li>,
    a: ({ children, href }) => <a href={href} className="text-[var(--cyan)] underline decoration-[var(--cyan)]/40 underline-offset-4 hover:decoration-[var(--cyan)] transition-colors">{children}</a>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-[var(--gold)] pl-6 my-6 italic text-[var(--text-dim)]">{children}</blockquote>,
    code: ({ children }) => <code className="font-mono text-sm text-[var(--cyan)] bg-[var(--surface)] px-1.5 py-0.5 rounded">{children}</code>,
    pre: ({ children }) => <pre className="font-mono text-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-6 overflow-x-auto">{children}</pre>,
    table: ({ children }) => <table className="w-full mb-6 border-collapse">{children}</table>,
    th: ({ children }) => <th className="text-left font-semibold text-[var(--gold)] border-b border-[var(--border)] pb-2 pr-4">{children}</th>,
    td: ({ children }) => <td className="text-[var(--text)] border-b border-[var(--border)]/50 pb-2 pr-4">{children}</td>,
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    hr: () => <hr className="border-[var(--border)] my-8" />,
  };
}
