"use client";
import { motion } from "framer-motion";
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
      {/* Category Filter — horizontal scroll on mobile */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
              activeCategory === cat
                ? "bg-docker-blue text-slate-900 font-semibold shadow-[0_0_12px_rgba(13,183,237,0.3)]"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Framework Grid — 2 cols on mobile, 3 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filtered.map((fw) => {
          const isSelected = selected === fw.id;
          return (
            <motion.button
              key={fw.id}
              onClick={() => onChange(fw.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex flex-col items-start gap-1.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer overflow-hidden",
                isSelected
                  ? "border-docker-blue/60 bg-docker-blue/10 shadow-[0_0_20px_rgba(13,183,237,0.15)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="selected-fw"
                  className="absolute inset-0 rounded-xl bg-docker-blue/5 border border-docker-blue/40"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <span className="text-lg sm:text-xl">{fw.icon}</span>
              <div className="relative z-10">
                <p className={cn(
                  "text-xs sm:text-sm font-medium leading-tight",
                  isSelected ? "text-docker-blue" : "text-slate-200"
                )}>
                  {fw.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{fw.category}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
