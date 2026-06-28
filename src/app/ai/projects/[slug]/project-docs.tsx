"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Project, DocBlock } from "@/lib/projects";
import { ProjectDocsNav, ProjectDocsMobileNav } from "./project-nav";

export function ProjectDocs({ project }: { project: Project }) {
  const navSections = project.sections.map((s) => ({
    id: s.id,
    label: s.label,
    icon: s.icon,
    title: s.title,
    description: s.description,
  }));

  const [activeId, setActiveId] = useState<string>(
    typeof window !== "undefined"
      ? window.location.hash.slice(1) || project.sections[0]?.id
      : project.sections[0]?.id
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && project.sections.find((s) => s.id === hash)) {
      setActiveId(hash);
    }
  }, [project.sections]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSection = project.sections.find((s) => s.id === activeId) || project.sections[0];

  return (
    <div className="page-in max-w-7xl mx-auto px-6 py-32">
      <Breadcrumbs
        items={[
          { label: "AI", href: "/ai" },
          { label: "Projects", href: "/ai/projects" },
          { label: project.name },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-10 mt-6">
        <aside className="lg:w-64 lg:shrink-0 relative">
          <ProjectDocsNav
            sections={navSections}
            activeId={activeId}
            onSelect={handleSelect}
            accent={project.accent}
            projectName={project.name}
          />
          <ProjectDocsMobileNav sections={navSections} activeId={activeId} onSelect={handleSelect} />
        </aside>

        <div className="flex-1 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className={`chip chip-${project.accent}`}>{project.category}</div>
            <span className="text-xs text-[var(--text-dim)] font-mono">{project.status}</span>
          </div>
          <h1 className="font-display font-800 text-3xl md:text-4xl mb-2 gradient-gold">{project.name}</h1>
          <p className="text-lg text-[var(--text-dim)] mb-6">{project.tagline}</p>

          <div className="glass p-4 mb-8">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-1">Highlight</p>
            <p className={`text-sm font-medium text-[var(--${project.accent})]`}>{project.highlight}</p>
          </div>

          <div key={activeSection.id} className="page-in">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{activeSection.icon}</span>
              <div>
                <h2 className="font-display font-700 text-2xl text-[var(--text-bright)]">{activeSection.title}</h2>
                <p className="text-sm text-[var(--text-dim)]">{activeSection.description}</p>
              </div>
            </div>

            <div className="divider-gold mb-8" />

            <div className="content-prose space-y-8">
              {activeSection.content.map((block, i) => (
                <DocBlockRenderer key={i} block={block} accent={project.accent} />
              ))}
            </div>

            <SectionNav
              sections={project.sections}
              activeId={activeId}
              onSelect={handleSelect}
              accent={project.accent}
            />
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

function DocBlockRenderer({ block, accent }: { block: DocBlock; accent: string }) {
  const accentVar = `var(--${accent})`;
  return (
    <div>
      {block.heading && (
        <h3 className="text-xl font-bold text-white mt-8 mb-3">{block.heading}</h3>
      )}
      {block.body && (
        <p className="text-[var(--text)] leading-relaxed">{renderInline(block.body)}</p>
      )}
      {block.list && (
        <ul className="space-y-2 mt-3">
          {block.list.map((item, j) => (
            <li key={j} className="text-[var(--text)] leading-relaxed flex gap-3">
              <span style={{ color: accentVar }} className="mt-0.5">{"\u25B8"}</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )}
      {block.code && (
        <pre className="font-mono text-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mt-3 mb-3 overflow-x-auto">
          <code>{block.code.code}</code>
        </pre>
      )}
      {block.callout && (
        <div
          className={`mt-3 p-4 rounded-xl border ${
            block.callout.type === "warning"
              ? "border-[var(--red)]/30 bg-[rgba(248,113,113,0.08)]"
              : block.callout.type === "tip"
              ? "border-[var(--green)]/30 bg-[rgba(74,222,128,0.06)]"
              : "border-[var(--cyan)]/30 bg-[rgba(25,228,212,0.06)]"
          }`}
        >
          <p className="text-sm text-[var(--text)] leading-relaxed">
            <span
              className={`font-mono font-bold uppercase text-xs mr-2 ${
                block.callout.type === "warning"
                  ? "text-[var(--red)]"
                  : block.callout.type === "tip"
                  ? "text-[var(--green)]"
                  : "text-[var(--cyan)]"
              }`}
            >
              {block.callout.type === "warning" ? "⚠ Warning" : block.callout.type === "tip" ? "✦ Tip" : "ℹ Info"}
            </span>
            {block.callout.text}
          </p>
        </div>
      )}
      {block.table && (
        <div className="overflow-x-auto mt-3 mb-3">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {block.table.headers.map((header, k) => (
                  <th key={k} className="text-left font-mono text-xs uppercase tracking-wider text-[var(--gold)] pb-2 pr-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, k) => (
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
  );
}

function SectionNav({
  sections,
  activeId,
  onSelect,
  accent,
}: {
  sections: { id: string; label: string; icon: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  accent: string;
}) {
  const idx = sections.findIndex((s) => s.id === activeId);
  const prev = idx > 0 ? sections[idx - 1] : null;
  const next = idx < sections.length - 1 ? sections[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="flex justify-between gap-4 mt-12 pt-8 border-t border-[var(--border)]">
      {prev ? (
        <button
          onClick={() => onSelect(prev.id)}
          className="glass p-4 flex-1 text-left group hover:border-[var(--gold)] transition-colors"
        >
          <p className="text-xs font-mono text-[var(--text-dim)] mb-1">{"\u2190"} Previous</p>
          <p className="text-sm font-medium text-[var(--text-bright)] group-hover:text-[var(--gold-bright)] transition-colors">
            {prev.icon} {prev.label}
          </p>
        </button>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <button
          onClick={() => onSelect(next.id)}
          className="glass p-4 flex-1 text-right group hover:border-[var(--gold)] transition-colors"
        >
          <p className="text-xs font-mono text-[var(--text-dim)] mb-1">Next {"\u2192"}</p>
          <p className="text-sm font-medium text-[var(--text-bright)] group-hover:text-[var(--gold-bright)] transition-colors">
            {next.icon} {next.label}
          </p>
        </button>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="font-mono text-sm text-[var(--cyan)] bg-[var(--surface)] px-1.5 py-0.5 rounded"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[var(--text-dim)] font-mono">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--gold)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-bright)]">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-[var(--border-bright)]">/</span>}
        </span>
      ))}
    </nav>
  );
}
