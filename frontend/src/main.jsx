import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import CompetitionById from "./pages/CompetitionById.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import { AuthProvider } from "./contexts/AuthContext";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/competition/:id", element: <CompetitionById /> },
  { path: "*", element: <PageNotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);