"use client";
import { cn } from "@/lib/utils";
import { FRAMEWORK_TEMPLATES, CATEGORIES } from "@/lib/generators/templates";
import { FrameworkId } from "@/types/dockerfile";
import { useState } from "react";

interface FrameworkSelectorProps {
  selected: FrameworkId;
  onChange: (id: FrameworkId) => void;
}

export function FrameworkSelector({ selected, onChange }: FrameworkSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...CATEGORIES];
  const frameworks = Object.values(FRAMEWORK_TEMPLATES);

  const filtered =
    activeCategory === "All"
      ? frameworks
      : frameworks.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 whitespace-nowrap flex-shrink-0"
            style={
              activeCategory === cat
                ? { background: "var(--accent)", color: "#0f1117", fontWeight: 600 }
                : { background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Framework grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {filtered.map((fw) => {
          const isSelected = selected === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => onChange(fw.id)}
              className="flex items-center gap-2 px-2.5 py-2 rounded text-left transition-colors duration-150 cursor-pointer"
              style={{
                border: isSelected ? "1px solid var(--accent-border)" : "1px solid var(--border)",
                background: isSelected ? "var(--accent-dim)" : "var(--bg-elevated)",
              }}
            >
              <span className="text-base flex-shrink-0">{fw.icon}</span>
              <div className="min-w-0">
                <p
                  className="text-xs font-medium leading-tight truncate"
                  style={{ color: isSelected ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {fw.label}
                </p>
                <p className="text-[10px] truncate" style={{ color: "var(--text-subtle)" }}>{fw.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
