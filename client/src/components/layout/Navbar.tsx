import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { clearAuthToken, getAuthPayload } from "@/lib/queryClient";
import { Menu } from "lucide-react";

export function Navbar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const updateRole = () => {
      const payload = getAuthPayload();
      setUserRole(payload?.role ?? null);
    };

    updateRole();
    window.addEventListener("auth-changed", updateRole);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("auth-changed", updateRole);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUserRole(null);
    setLocation("/login");
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "backdrop-blur-xl bg-black/30 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">Aura ✨</Link>

        <div className="hidden md:flex gap-4 items-center">
          {userRole && <Link href="/dashboard">Dashboard</Link>}
          <Link href="/create">Create</Link>
          <Link
            href="/ai-websites"
            className="rounded-full border border-border px-3 py-1 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Dynamic AI Websites
          </Link>
          <Link href="/templates">Templates</Link>
          {userRole === "admin" && (
            <Link
              href="/admin"
              className="rounded-full border border-border px-3 py-1 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Edit Templates
            </Link>
          )}

          {userRole && (
            <span className="text-sm font-semibold">
              Logged in as {userRole === "admin" ? "👑 Admin" : "User"}
            </span>
          )}

          {userRole ? (
            <button
              onClick={handleLogout}
              className="bg-white/10 text-white px-3 py-1 rounded border border-white/20"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div
        className={`md:hidden absolute inset-x-0 top-full mx-auto max-w-6xl px-6 transition-all duration-300 ${
          menuOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="flex flex-col divide-y divide-border">
            <Link
              href="/create"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 text-sm font-medium hover:bg-secondary/50"
            >
              Create
            </Link>
            <Link
              href="/templates"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 text-sm font-medium hover:bg-secondary/50"
            >
              Templates
            </Link>
            <Link
              href="/ai-websites"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 text-sm font-medium hover:bg-secondary/50"
            >
              AI Websites
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 text-sm font-medium hover:bg-secondary/50"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
