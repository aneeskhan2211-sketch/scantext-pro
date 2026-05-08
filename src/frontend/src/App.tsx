import { Layout } from "@/components/Layout";
import { SkeletonList } from "@/components/SkeletonCard";
import { useTheme } from "@/hooks/useTheme";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";

// Lazy page imports
const SplashPage = lazy(() => import("@/pages/SplashPage"));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const ScanPage = lazy(() => import("@/pages/ScanPage"));
const EnhancePage = lazy(() => import("@/pages/EnhancePage"));
const ResultPage = lazy(() => import("@/pages/ResultPage"));
const HistoryPage = lazy(() => import("@/pages/HistoryPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const FoldersPage = lazy(() => import("@/pages/FoldersPage"));
const ToolsPage = lazy(() => import("@/pages/ToolsPage"));
const SubscriptionPage = lazy(() => import("@/pages/SubscriptionPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));

// --- Root layout ---
function RootLayout() {
  useTheme();
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// --- Routes ---
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/splash" });
  },
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/splash",
  component: () => (
    <Suspense fallback={null}>
      <SplashPage />
    </Suspense>
  ),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: () => (
    <Suspense fallback={null}>
      <OnboardingPage />
    </Suspense>
  ),
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: () => (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <HomePage />
    </Suspense>
  ),
});

const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <ScanPage />
    </Suspense>
  ),
});

const enhanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan/enhance",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <EnhancePage />
    </Suspense>
  ),
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan/result",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <ResultPage />
    </Suspense>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <HistoryPage />
    </Suspense>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <SearchPage />
    </Suspense>
  ),
});

const foldersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/folders",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <FoldersPage />
    </Suspense>
  ),
});

const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tools",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <ToolsPage />
    </Suspense>
  ),
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscription",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <SubscriptionPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <ProfilePage />
    </Suspense>
  ),
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/help",
  component: () => (
    <Suspense fallback={<SkeletonList />}>
      <HelpPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  splashRoute,
  onboardingRoute,
  authRoute,
  homeRoute,
  scanRoute,
  enhanceRoute,
  resultRoute,
  historyRoute,
  searchRoute,
  foldersRoute,
  toolsRoute,
  subscriptionRoute,
  profileRoute,
  helpRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "font-body",
          },
        }}
      />
    </>
  );
}
