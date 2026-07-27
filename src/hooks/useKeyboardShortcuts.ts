"use client";

import { useEffect } from "react";

export interface KeyboardShortcutHandlers {
  onDockerfileTab: () => void;
  onComposeTab: () => void;
  onKubernetesTab: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onShare: () => void;
  onImport: () => void;
  onToggleDocs: () => void;
}

/**
 * Registers global keyboard shortcuts for DockerCraft.
 *
 * | Shortcut          | Action                        |
 * |-------------------|-------------------------------|
 * | Ctrl/Cmd + 1      | Switch to Dockerfile tab      |
 * | Ctrl/Cmd + 2      | Switch to Compose tab         |
 * | Ctrl/Cmd + 3      | Switch to Kubernetes tab      |
 * | Ctrl/Cmd + D      | Download current output       |
 * | Ctrl/Cmd + Shift+S| Share / copy URL              |
 * | Ctrl/Cmd + I      | Open Import Dockerfile dialog |
 * | Ctrl/Cmd + /      | Toggle Docs drawer            |
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      // Don't intercept shortcuts when typing in inputs / textareas
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      switch (true) {
        case e.key === "1" && !e.shiftKey: {
          e.preventDefault();
          handlers.onDockerfileTab();
          break;
        }
        case e.key === "2" && !e.shiftKey: {
          e.preventDefault();
          handlers.onComposeTab();
          break;
        }
        case e.key === "3" && !e.shiftKey: {
          e.preventDefault();
          handlers.onKubernetesTab();
          break;
        }
        case e.key === "d" && !e.shiftKey && !isInput: {
          e.preventDefault();
          handlers.onDownload();
          break;
        }
        case e.key === "s" && e.shiftKey: {
          e.preventDefault();
          handlers.onShare();
          break;
        }
        case e.key === "i" && !e.shiftKey && !isInput: {
          e.preventDefault();
          handlers.onImport();
          break;
        }
        case e.key === "/" && !e.shiftKey: {
          e.preventDefault();
          handlers.onToggleDocs();
          break;
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
