import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { clearAuthToken, getAuthPayload } from "@/lib/queryClient";

export function Navbar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const updateRole = () => {
      const payload = getAuthPayload();
      setUserRole(payload?.role ?? null);
    };

    updateRole();
    window.addEventListener("auth-changed", updateRole);
    return () => window.removeEventListener("auth-changed", updateRole);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUserRole(null);
    setLocation("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <Link href="/">Aura ✨</Link>

      <div className="flex gap-4 items-center">
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
            className="bg-black text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
