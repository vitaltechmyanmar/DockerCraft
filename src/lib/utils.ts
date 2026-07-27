import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ─── URL Config Sharing ────────────────────────────────────────────────────

/**
 * Serialise any config object to a URL-safe base64 string.
 */
export function encodeConfig(config: unknown): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(config)));
  } catch {
    return "";
  }
}

/**
 * Deserialise a base64 config string back to a plain object.
 * Returns `null` on any parse failure.
 */
export function decodeConfig<T>(encoded: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded))) as T;
  } catch {
    return null;
  }
}

/**
 * Write the current config to the browser URL bar and copy the full URL to
 * clipboard. Returns `true` if clipboard write succeeded.
 */
export async function shareUrl(
  tab: string,
  config: unknown
): Promise<boolean> {
  const encoded = encodeConfig(config);
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  url.searchParams.set("config", encoded);
  window.history.replaceState(null, "", url.toString());
  try {
    await navigator.clipboard.writeText(url.toString());
    return true;
  } catch {
    return false;
  }
}
