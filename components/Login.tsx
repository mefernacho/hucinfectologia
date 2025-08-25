
import React, { useState } from 'react';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Credenciales del único usuario autorizado, según lo solicitado.
    const authorizedEmail = 'hucsi@hucsi.com';
    const authorizedPassword = 'HUCinfectologia2025';

    // Se realiza la validación en el frontend contra el único usuario autorizado.
    if (email.trim().toLowerCase() === authorizedEmail && password === authorizedPassword) {
        try {
            await auth.signInWithEmailAndPassword(authorizedEmail, authorizedPassword);
            // onAuthStateChanged en App.tsx se encargará de la redirección y el estado.
        } catch (err: any) {
            console.error("Firebase login error:", err);
            // Manejo de errores específico para guiar al usuario
            if (err.code && err.code.includes('requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.authenticationservice.signinwithpassword-are-blocked')) {
                setError('Error de API: La API de autenticación está deshabilitada. Siga las instrucciones urgentes en el archivo `firebaseConfig.ts` para solucionarlo.');
            } else if (err.code === 'auth/configuration-not-found') {
                setError('Error de Configuración: El método de inicio de sesión por correo electrónico no está habilitado en Firebase. Siga las instrucciones en el archivo `firebaseConfig.ts`.');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                 setError('El usuario autorizado no existe en Firebase o la clave es incorrecta. Verifique que el usuario "hucsi@hucsi.com" esté creado en la sección de Authentication de Firebase.');
            } else {
                setError('Error de autenticación con el servidor. Contacte al administrador.');
            }
        } finally {
            setIsLoading(false);
        }
    } else {
        setError('Usuario o clave incorrectos.');
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
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-blue-900/50 border border-blue-400 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="hucsi@hucsi.com"
            required
            autoComplete="username"
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