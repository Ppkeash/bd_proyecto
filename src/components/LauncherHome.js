import React, { useState } from 'react';

/**
 * Pantalla principal del launcher una vez iniciada la sesi\u00f3n.
 * Muestra la bienvenida, selector de versi\u00f3n de Minecraft,
 * noticias simuladas y el bot\u00f3n de juego.
 */
const versions = ['1.20.1', '1.19.4', '1.18.2'];

const LauncherHome = ({ username, onPlay }) => {
  const [version, setVersion] = useState('1.20.1');

  const news = [
    'Bienvenido al launcher oficial de TECNILAND Nexus.',
    'La versi\u00f3n 1.20.1 es la recomendada para una mejor experiencia.'
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Bienvenido, {username}</h2>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Versi\u00f3n de Minecraft</label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
        >
          {versions.map((v) => (
            <option key={v} value={v} className={v === '1.20.1' ? 'font-bold' : ''}>
              {v} {v === '1.20.1' ? '(recomendada)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">Novedades</h3>
        <ul className="list-disc ml-4 text-sm text-gray-700">
          {news.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onPlay(version)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-700 transition"
      >
        JUGAR
      </button>
    </div>
  );
};

export default LauncherHome;
