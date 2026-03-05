import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getValidAuthToken, clearAuthToken } from "@/lib/queryClient";
import { Share2, LogOut, Plus, ExternalLink } from "lucide-react";

type Website = {
  id: string;
  title: string;
  theme: string;
  createdAt?: string;
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getValidAuthToken();
    if (!token) {
      setLocation("/login");
      return;
    }
    const load = async () => {
      try {
        const res = await fetch("/api/websites", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) {
          setError("Failed to load websites");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setWebsites(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load websites");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setLocation]);

  const handleLogout = () => {
    clearAuthToken();
    setLocation("/login");
  };

  const copyLink = async (id: string) => {
    const link = `${window.location.origin}/w/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-xl font-serif">Aura Dashboard</div>
          <div className="flex items-center gap-3">
            <Link href="/create">
              <button
                type="button"
                className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Website
                </span>
              </button>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl">
            <div className="text-sm uppercase tracking-[0.2em] text-primary/70">
              My Websites
            </div>
            <div className="mt-2 text-3xl font-semibold">{websites.length}</div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl">
            <div className="text-sm uppercase tracking-[0.2em] text-primary/70">
              Templates
            </div>
            <div className="mt-2 text-3xl font-semibold">Premium</div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl">
            <div className="text-sm uppercase tracking-[0.2em] text-primary/70">
              AI Assistant
            </div>
            <div className="mt-2 text-3xl font-semibold">Available</div>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-serif font-semibold">Your websites</h2>
            <Link href="/create">
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium"
              >
                Create
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/40 bg-white/70 p-8 text-center shadow-xl">
              Loading...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-white/40 bg-white/70 p-8 text-center shadow-xl">
              {error}
            </div>
          ) : websites.length === 0 ? (
            <div className="rounded-3xl border border-white/40 bg-white/70 p-8 text-center shadow-xl">
              You haven’t created any websites yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {websites.map((site) => (
                <div
                  key={site.id}
                  className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl"
                >
                  <div className="text-sm uppercase tracking-[0.2em] text-primary/70">
                    {site.theme}
                  </div>
                  <div className="mt-2 truncate text-lg font-semibold">
                    {site.title}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`/w/${site.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Preview
                    </a>
                    <button
                      type="button"
                      onClick={() => copyLink(site.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

