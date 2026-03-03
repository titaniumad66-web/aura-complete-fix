import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setLocation("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <Link href="/">Aura ✨</Link>

      <div className="flex gap-4 items-center">
        <Link href="/create">Create</Link>

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