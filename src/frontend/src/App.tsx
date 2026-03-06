import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Layout from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminLoginPage, { hasAdminSession } from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";

// Root route with layout outlet
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLoginPage,
});

// Protected layout route
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

// Admin-only layout route (uses admin session, NOT Internet Identity)
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-protected",
  component: AdminLayout,
});

function RedirectToAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/auth" });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Redirecting to login...</p>
      </div>
    </div>
  );
}

function RedirectToAdminLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/admin-login" });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">
          Redirecting to admin login...
        </p>
      </div>
    </div>
  );
}

function ProtectedLayout() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <RedirectToAuth />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AdminLayout() {
  if (!hasAdminSession()) {
    return <RedirectToAdminLogin />;
  }
  return <Outlet />;
}

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const matchesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/matches",
  component: MatchesPage,
});

const adminRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  authRoute,
  adminLoginRoute,
  protectedLayoutRoute.addChildren([
    dashboardRoute,
    profileRoute,
    matchesRoute,
  ]),
  adminLayoutRoute.addChildren([adminRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
