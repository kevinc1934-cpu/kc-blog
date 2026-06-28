"use client";

import { useState, useEffect, useCallback } from "react";
import type { Accent } from "@/lib/projects";

export interface DocSection {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
}

export function ProjectDocsNav({
  sections,
  activeId,
  onSelect,
  accent,
  projectName,
}: {
  sections: DocSection[];
  activeId: string;
  onSelect: (id: string) => void;
  accent: Accent;
  projectName: string;
}) {
  const accentVar = `var(--${accent})`;

  return (
    <nav className="sticky top-20 hidden lg:block max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="glass p-5 w-64">
        <p className="font-display font-700 text-sm text-[var(--text-bright)] mb-1">{projectName}</p>
        <p className="text-xs font-mono text-[var(--text-dim)] mb-4">Reference</p>
        <div className="divider-gold mb-4" />
        <ul className="space-y-1">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => onSelect(section.id)}
                  className="flex items-start gap-2.5 w-full py-2 px-3 rounded-lg text-sm transition-all duration-200 text-left"
                  style={{
                    color: isActive ? accentVar : "var(--text-dim)",
                    background: isActive ? `color-mix(in srgb, ${accentVar} 10%, transparent)` : "transparent",
                    fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive ? `2px solid ${accentVar}` : "2px solid transparent",
                  }}
                >
                  <span className="text-base leading-none mt-0.5">{section.icon}</span>
                  <span className="flex-1">{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function ProjectDocsMobileNav({
  sections,
  activeId,
  onSelect,
}: {
  sections: DocSection[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="glass w-full p-3 flex items-center justify-between text-sm"
      >
        <span className="font-mono text-[var(--text-dim)]">
          {sections.find((s) => s.id === activeId)?.icon} {sections.find((s) => s.id === activeId)?.label}
        </span>
        <span className="text-[var(--text-dim)]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="glass mt-2 p-2 absolute z-30 w-full max-w-[calc(100vw-3rem)]">
          <ul className="space-y-0.5">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    onSelect(section.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full py-2 px-3 rounded-lg text-sm text-left text-[var(--text-dim)] hover:text-[var(--text-bright)] hover:bg-[var(--surface)] transition-colors"
                  style={activeId === section.id ? { color: "var(--text-bright)", background: "var(--surface)" } : {}}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
