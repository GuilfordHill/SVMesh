import { createBrowserRouter } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { lazy } from "react";
import StandardLayout from "./layouts/StandardLayout.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import ErrorScreen from "./components/ErrorScreen.tsx";

// Lazy load page components for code splitting
const Home = lazy(() => import("./pages/Home.tsx"));
const Dashboards = lazy(() => import("./pages/Dashboards.tsx"));
const Socials = lazy(() => import("./pages/Socials.tsx"));
const Knowledgebase = lazy(() => import("./pages/Knowledgebase.tsx"));
const MarkdownPage = lazy(() => import("./pages/MarkdownPage.tsx"));

// Loader for 404 routes that throws an error
function notFoundLoader({ params }: LoaderFunctionArgs) {
  const path = Object.values(params).join("/");
  throw new Error(`Page not found: /${path || ""}`);
}

// Wrap components with ErrorBoundary to catch errors
function MarkdownPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <MarkdownPage />
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StandardLayout,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "dashboards",
        Component: Dashboards,
      },
      {
        path: "socials",
        Component: Socials,
      },
      {
        path: "knowledgebase",
        Component: Knowledgebase,
      },
      {
        path: "knowledgebase/:article",
        Component: Knowledgebase,
      },
      {
        path: ":slug",
        Component: MarkdownPageWithErrorBoundary,
      },
      {
        path: "*",
        loader: notFoundLoader,
        Component: () => null,
      },
    ],
  },
]);
