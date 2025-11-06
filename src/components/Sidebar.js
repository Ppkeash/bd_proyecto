// Sidebar.jsx
import React, { useState } from "react";
import {
  HomeIcon,
  DatabaseIcon,
  CollectionIcon,
  LogoutIcon,
  DownloadIcon,
  CampaignIcon,
} from "./icons"; // Asume que tienes algunos SVG sencillos, si no te los muestro básicos abajo

const Sidebar = ({
  onHome,
  onChannels,
  onCampaigns,
  onExport,
  onLogout,
  showManagement,
  active = "home", // puedes pasarle el valor activo actual
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Overlay for mobile menu */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-label="Cerrar menú lateral"
      ></div>
      <aside
        className={`${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        } fixed lg:static top-0 left-0 z-40 h-full bg-white border-r border-gray-200 flex flex-col w-64 pt-20 pb-6 lg:pt-0 lg:translate-x-0 transition-transform`}
      >
        {/* Modo desktop */}
        <nav className="flex flex-col gap-1 mt-4 px-6">
          <SidebarButton
            label="Inicio"
            icon={<HomeIcon />}
            active={active === "home"}
            onClick={() => {
              setOpen(false);
              onHome();
            }}
          />
          <SidebarButton
            label="Canales"
            icon={<CollectionIcon />}
            active={active === "channels"}
            onClick={() => {
              setOpen(false);
              onChannels();
            }}
          />
          <SidebarButton
            label="Campañas"
            icon={<CampaignIcon />}
            active={active === "campaigns"}
            onClick={() => {
              setOpen(false);
              onCampaigns();
            }}
          />
          {showManagement && (
            <SidebarButton
              label="Exportar"
              icon={<DownloadIcon />}
              active={active === "export"}
              onClick={() => {
                setOpen(false);
                onExport();
              }}
            />
          )}
          <div className="mt-auto mb-2">
            <SidebarButton
              label="Cerrar sesión"
              icon={<LogoutIcon />}
              active={active === "logout"}
              onClick={onLogout}
              danger
            />
          </div>
        </nav>
      </aside>
      {/* Botón flotante solo en mobile */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-tigo-blue text-white p-3 rounded-full shadow-lg hover:bg-tigo-cyan transition-colors"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú lateral" : "Abrir menú lateral"}
      >
        {/* Ícono hamburguesa */}
        <svg
          className={`w-6 h-6 transition-all ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          viewBox="0 0 24 24"
        >
          <path
            d={
              open
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
};

const SidebarButton = ({ label, icon, onClick, active, danger }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg text-base font-medium transition-all
      ${active
        ? "bg-tigo-blue text-white shadow"
        : `text-gray-700 hover:bg-tigo-cyan/20 hover:text-tigo-blue`}
      ${danger ? "hover:bg-red-100 text-red-700 mt-6" : ""}
    `}
  >
    <span className="h-6 w-6 flex-shrink-0">{icon}</span>
    {label}
  </button>
);

export default Sidebar;
