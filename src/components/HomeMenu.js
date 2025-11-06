import React from 'react';
import NacionalPlaceholder from '../assets/NacionalPlaceholder';
import RegionalPlaceholder from '../assets/RegionalPlaceholder';
import TigoLogo from '../assets/TigoLogo';

const HomeMenu = ({ onSelectTrade }) => {
  const today = new Date().toLocaleDateString('es-CO');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <TigoLogo className="h-16 mx-auto" />
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">BASE DE DESTINATARIOS</h2>
        <p className="text-sm text-gray-500">{today}</p>
        <p className="text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Sistema para gestionar solicitudes de material POP y mantener actualizados los puntos de venta.
        </p>
      </div>

      {/* Grid de Trade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trade Nacional */}
        <button
          onClick={() => onSelectTrade('nacional')}
          className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105"
        >
          <NacionalPlaceholder className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center space-y-4">
            <h3 className="text-white text-3xl font-bold drop-shadow-lg group-hover:text-yellow-300 transition-colors">TRADE NACIONAL</h3>
            <div className="bg-white text-tigo-blue font-bold py-2 px-8 rounded-lg shadow-md group-hover:bg-gray-100 transition-all">
              Ingresar →
            </div>
          </div>
        </button>

        {/* Trade Regional */}
        <button
          onClick={() => onSelectTrade('regional')}
          className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105"
        >
          <RegionalPlaceholder className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center space-y-4">
            <h3 className="text-white text-3xl font-bold drop-shadow-lg group-hover:text-yellow-300 transition-colors">TRADE REGIONAL</h3>
            <div className="bg-white text-tigo-blue font-bold py-2 px-8 rounded-lg shadow-md group-hover:bg-gray-100 transition-all">
              Ingresar →
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomeMenu;
