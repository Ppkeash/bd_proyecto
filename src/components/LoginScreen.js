import React, { useState } from 'react';
import TigoLogo from '../assets/TigoLogo';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña requeridos');
      return;
    }
    setError('');
    onLogin();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <TigoLogo className="h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg focus:border-tigo-blue focus:bg-white outline-none transition-colors text-base"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg focus:border-tigo-blue focus:bg-white outline-none transition-colors text-base"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-tigo-blue text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] hover:shadow-lg transition-all hover:scale-105 duration-300"
        >
          Iniciar sesión
        </button>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-500">
          2025 Tigo. Sistema de Gestión de Base de Destinatarios
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
