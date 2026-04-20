import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  clearAuthToken,
  getAuthPayload,
  getValidAuthToken,
  queryClient,
} from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { Navbar } from "./components/layout/Navbar";
import { JSX, useEffect, lazy, Suspense } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const PreviewWebsite = lazy(() => import("./pages/PreviewWebsite"));
const CreateWebsite = lazy(() => import("./pages/CreateWebsite"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AllTemplates = lazy(() => import("./pages/AllTemplates"));
const WebsiteView = lazy(() => import("./pages/WebsiteView"));
const LetterView = lazy(() => import("./pages/LetterView"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Payment = lazy(() => import("./pages/Payment"));
const NotFound = lazy(() => import("./pages/not-found"));

import AuraAI from "./components/AuraAI";

// 🔒 Protected Route (Logged in users only)
function ProtectedRoute({ component: Component }: any) {
  const token = getValidAuthToken();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) {
      clearAuthToken();
      setLocation("/login");
    }
  }, [token, setLocation]);

  if (!token) return null;
  return <Component />;
}

// 👑 Admin Only Route
function AdminRoute({ component: Component }: any) {
  const token = getValidAuthToken();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) {
      clearAuthToken();
      setLocation("/login");
    }
  }, [token, setLocation]);

  if (!token) return null;

  const payload = getAuthPayload();

  if (payload?.role !== "admin") {
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
    <Suspense
      fallback={
        <div className="flex h-[50vh] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/preview" component={PreviewWebsite} />
        <Route path="/preview/:id" component={PreviewWebsite} />
        <Route path="/templates" component={AllTemplates} />

        <Route path="/create">
          {() => <ProtectedRoute component={CreateWebsite} />}
        </Route>

        <Route path="/admin">
          {() => <AdminRoute component={AdminDashboard} />}
        </Route>

        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>

        <Route path="/pay" component={Payment} />

        <Route path="/letter/:id" component={LetterView} />

        {/* ✅ PUBLIC WEBSITE ROUTE */}
        <Route path="/w/:id" component={WebsiteView} />

        {/* ⚠️ ALWAYS KEEP THIS LAST */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App(): JSX.Element {
  const [location] = useLocation();
  useEffect(() => {
    console.log(`[NAV] Navigated to: ${location}`);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  const showAuraAi = location !== "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex flex-1 flex-col pt-20 md:pt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col"
              >
                <Router />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        {showAuraAi ? <AuraAI /> : null}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

