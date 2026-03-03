import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";

import Home from "@/pages/Home";
import CreateWebsite from "@/pages/CreateWebsite";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import WebsiteView from "@/pages/WebsiteView"; // ✅ ADD THIS
import NotFound from "@/pages/not-found";

// 🔒 Protected Route (Logged in users only)
function ProtectedRoute({ component: Component }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return <Component />;
}

// 👑 Admin Only Route
function AdminRoute({ component: Component }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));

  if (payload.role !== "admin") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🚫 Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />

      <Route path="/create">
        {() => <ProtectedRoute component={CreateWebsite} />}
      </Route>

      <Route path="/admin">
        {() => <AdminRoute component={AdminDashboard} />}
      </Route>

      {/* ✅ PUBLIC WEBSITE ROUTE */}
      <Route path="/w/:id" component={WebsiteView} />

      {/* ⚠️ ALWAYS KEEP THIS LAST */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;