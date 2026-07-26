"use client";
import React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Tag = "button",
  ...otherProps
}: MovingBorderProps) {
  return (
    <Tag
      className={cn(
        "relative h-16 w-40 overflow-hidden rounded-xl p-[1px]",
        containerClassName
      )}
      {...otherProps}
    >
      <div className="absolute inset-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx="13"
            ry="13"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            style={{
              height: `${200}px`,
              width: `${200}px`,
              background: `radial-gradient(circle, #0db7ed, transparent 70%)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: duration / 1000, repeat: Infinity, ease: "linear" }}
            className={cn("opacity-60", borderClassName)}
          />
        </div>
      </div>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-xl bg-slate-900/[0.8] text-sm antialiased backdrop-blur-xl",
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
