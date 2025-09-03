import React, { useState } from 'react';

interface LoginProps {
  setUser: (user: any) => void;
}

export default function Login({ setUser }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // TODO: Reemplazar esto con una llamada a nuestro endpoint de backend /api/login
    // que devolverá un token JWT en caso de éxito.
    // Por ahora, simularemos un login exitoso para continuar con el desarrollo.
    if (email && password) {
      setTimeout(() => {
        setUser({ email: email, name: "Usuario de Prueba" });
        setIsLoading(false);
      }, 1000);
    } else {
      setError("Por favor ingrese usuario y clave.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-radial from-brand-blue-center to-brand-blue text-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Servicio de Infectología</h2>
        <p className="mt-1 text-blue-200 text-sm">"Hospital Universitario de Caracas"</p>
        <h3 className="mt-6 text-xl font-semibold text-white">Iniciar Sesión</h3>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="email"
            className="text-sm font-bold text-blue-100 block mb-2"
          >
            Usuario
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-blue-900/50 border border-blue-400 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="usuario@dominio.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-bold text-blue-100 block mb-2"
          >
            Clave
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-blue-900/50 border border-blue-400 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-red-400 text-center bg-red-900/50 rounded py-1 px-2">{error}</p>}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-brand-blue font-bold rounded-lg hover:bg-slate-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Accediendo...' : 'Acceder'}
          </button>
        </div>
      </form>
    </div>
  );
}