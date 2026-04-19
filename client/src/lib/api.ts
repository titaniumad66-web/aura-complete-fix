const raw =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  "http://localhost:5000";

/** Backend origin (no trailing slash). Set `VITE_API_URL` on Vercel to your Render API URL. */
export const API_URL = raw.replace(/\/+$/, "");

/** Absolute URL for a path served by the backend (`/api/...`, `/music/...`, `/uploads/...`). */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${p}`;
}

/** Same-origin JSON often stores `/uploads/...`; prefix with `API_URL` in split hosting (e.g. Vercel + Render). */
export function resolveBackendMediaUrl(
  url: string | undefined | null,
): string | undefined {
  if (url == null || url === "") return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  return apiUrl(url.startsWith("/") ? url : `/${url}`);
}
