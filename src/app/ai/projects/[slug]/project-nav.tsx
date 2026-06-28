"use client";

import { useEffect, useState } from "react";

export interface NavSection {
  id: string;
  label: string;
  sub?: { id: string; label: string }[];
}

export function ProjectNav({ sections, accent }: { sections: NavSection[]; accent: string }) {
  const [active, setActive] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
      for (const sub of s.sub || []) {
        const subEl = document.getElementById(sub.id);
        if (subEl) observer.observe(subEl);
      }
    }

    return () => observer.disconnect();
  }, [sections]);

  const accentVar = `var(--${accent})`;

  return (
    <nav className="sticky top-24 hidden lg:block">
      <div className="glass p-5 w-60">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-4">
          Sections
        </p>
        <ul className="space-y-1">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                    setActive(section.id);
                  }}
                  className="block py-1.5 px-3 rounded-lg text-sm transition-all duration-200"
                  style={{
                    color: isActive ? accentVar : "var(--text-dim)",
                    background: isActive ? `color-mix(in srgb, ${accentVar} 10%, transparent)` : "transparent",
                    fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive ? `2px solid ${accentVar}` : "2px solid transparent",
                  }}
                >
                  {section.label}
                </a>
                {section.sub && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
                    {section.sub.map((sub) => {
                      const isSubActive = active === sub.id;
                      return (
                        <li key={sub.id}>
                          <a
                            href={`#${sub.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(sub.id)?.scrollIntoView({ behavior: "smooth" });
                              setActive(sub.id);
                            }}
                            className="block py-1 px-2.5 rounded-md text-xs transition-all duration-200"
                            style={{
                              color: isSubActive ? accentVar : "var(--text-dim)",
                              background: isSubActive ? `color-mix(in srgb, ${accentVar} 8%, transparent)` : "transparent",
                              fontWeight: isSubActive ? 600 : 400,
                            }}
                          >
                            {sub.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
