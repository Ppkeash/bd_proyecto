import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

// Punto de entrada de la aplicación React

import App from "./App";
import RequestsHistory from "./pages/RequestsHistory";
import { ToastProvider } from "./components/ui/ToastProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <div className="p-4 flex gap-4 border-b">
          <Link to="/">Inicio</Link>
          <Link to="/requests">Historial</Link>
        </div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/requests" element={<RequestsHistory />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);
