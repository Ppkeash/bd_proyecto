import React, { useState } from 'react';
import { setStorageItem } from '../utils/storage';

/**
 * Pantalla de inicio de sesi\u00f3n sin autenticaci\u00f3n externa.
 * Permite ingresar un alias que se guardar\u00e1 en localStorage
 * para identificar al jugador.
 */
const OfflineLogin = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Debes ingresar un nombre');
      return;
    }
    setError('');
    setStorageItem('mc_username', name.trim());
    onLogin(name.trim());
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">TECNILAND Nexus</h1>
      <p className="text-gray-600">Ingresa tu nombre de jugador</p>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Nombre o alias"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all"
      >
        Iniciar sesi\u00f3n
      </button>
    </div>
  );
};

export default OfflineLogin;
