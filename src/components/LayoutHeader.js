import React from 'react';
import TigoLogo from '../assets/TigoLogo';

const LayoutHeader = ({ title, onBack, onLogout, onLogoClick }) => {
  return (
    <header className="bg-tigo-blue text-white px-4 md:px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      {/* Logo + Back */}
      <div className="flex items-center gap-4">
        {onLogoClick ? (
          <button onClick={onLogoClick} className="hover:scale-110 transition-transform">
            <TigoLogo className="h-10 w-auto" />
          </button>
        ) : (
          <TigoLogo className="h-10 w-auto" />
        )}

        {onBack && (
          <button
            onClick={onBack}
            className="hidden md:flex bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
            aria-label="Atrás"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold flex-grow text-center mx-4 truncate">{title}</h1>

      {/* Logout */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Salir
        </button>
      )}
    </header>
  );
};

export default LayoutHeader;
