import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import useAuthStore from "./stores/authStore.ts";

import { CustomThemeProvider } from "./theme/ThemeContext"; // <-- Your provider

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    //@ts-ignore - it will be set in the App component
    authStore: undefined,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const authStore = useAuthStore();

  return (
    <CustomThemeProvider>
      <RouterProvider router={router} context={{ authStore }} />
    </CustomThemeProvider>
  );
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

reportWebVitals();
