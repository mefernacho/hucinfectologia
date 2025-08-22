
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'HUCSI' && password === 'HUCinfectologia2025') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-radial from-brand-blue-center to-brand-blue text-white rounded-xl shadow-lg p-8 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Servicio de Infectología</h2>
        <p className="mt-1 text-blue-200 text-sm">"Hospital Universitario de Caracas"</p>
        <h3 className="mt-6 text-xl font-semibold text-white">Iniciar Sesión</h3>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="username"
            className="text-sm font-bold text-blue-100 block mb-2"
          >
            Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-blue-900/50 border border-blue-400 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="HUCSI"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-bold text-blue-100 block mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-blue-900/50 border border-blue-400 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-brand-red text-center bg-red-100 rounded py-1 px-2">{error}</p>}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-white text-brand-blue font-bold rounded-lg hover:bg-slate-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Acceder
          </button>
        </div>
      </form>
    </div>
  );
}
