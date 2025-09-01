import React from 'react';
import { firebaseConfig } from '../firebaseConfig';
import { WarningIcon } from './icons/WarningIcon';

export default function AuthApiErrorScreen() {
  const { projectId } = firebaseConfig;
  const apiUrl = `https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=${projectId}`;
  const credentialsUrl = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;
  const billingUrl = `https://console.cloud.google.com/billing?project=${projectId}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8 border-4 border-red-500">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-red-700">Error Crítico de Autenticación</h1>
          <p className="mt-2 text-lg text-slate-600">
            El servicio de inicio de sesión de Firebase está deshabilitado o mal configurado para este proyecto.
          </p>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-shrink-0">
                <WarningIcon className="h-12 w-12 text-yellow-400" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-yellow-800">¡ATENCIÓN! Verifique el Proyecto de Google Cloud</h3>
                <p className="mt-2 text-yellow-700">
                    La causa más común de este error persistente es habilitar la API en el proyecto de Google Cloud <span className="font-bold">incorrecto</span>.
                </p>
                <p className="mt-2 text-yellow-700">
                    El ID del proyecto de Firebase para esta aplicación es:
                </p>
                <div className="my-2">
                    <strong className="text-xl font-mono bg-yellow-200 text-yellow-900 px-2 py-1 rounded">{projectId}</strong>
                </div>
                <p className="mt-3 text-yellow-700">
                    Por favor, asegúrese de que este MISMO ID aparezca en la parte superior de la consola de Google Cloud antes de continuar.
                </p>
                <div className="mt-3 p-3 bg-slate-700 text-white font-mono rounded-md text-sm border-l-4 border-blue-400">
                    <p className="text-slate-300">{'// Fíjese en la barra superior de la consola de Google Cloud:'}</p>
                    <p>
                        <span className="text-blue-300">Google Cloud</span>
                        <span className="text-slate-400"> [ </span>
                        <span className="text-white font-bold">{projectId}</span>
                        <span className="text-slate-400"> ⌄ ] </span>
                        <span className="text-slate-500">[ Buscar... ]</span>
                    </p>
                </div>
                <p className="mt-2 text-sm text-yellow-600">Si ve un nombre de proyecto diferente, debe hacer clic en él y seleccionar el correcto de la lista.</p>
            </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-brand-gray mb-4">Pasos para Solucionar (Causa más común)</h2>
          <p className="text-slate-500 mb-6">
            Para solucionar este problema, debes habilitar la API de "Identity Toolkit".
          </p>
          <ol className="space-y-4 list-decimal list-inside text-slate-700">
            <li>
              <span className="font-bold">Haz clic en el siguiente enlace para ir directamente a la página correcta.</span>
              <div className="pl-4 mt-1">
                <a href={apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {apiUrl}
                </a>
              </div>
            </li>
            <li className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <span className="font-bold text-blue-800">Presiona el botón azul que dice "HABILITAR" (ENABLE).</span>
              <p className="mt-1 text-blue-700">
                Si el botón dice "ADMINISTRAR", significa que ya está habilitada, y el problema es casi con seguridad un desajuste del proyecto (ver la advertencia amarilla de arriba).
              </p>
            </li>
            <li>
              <span className="font-bold">Recarga esta página.</span>
              <p className="mt-1 text-sm text-slate-500">
                Después de habilitar la API en el proyecto correcto, el inicio de sesión funcionará.
              </p>
            </li>
          </ol>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-brand-gray mb-4">Si el problema persiste...</h2>
          <p className="text-slate-500 mb-6">
            Si has seguido los pasos anteriores y el error continúa, revisa estos dos puntos de configuración avanzados:
          </p>
          <ol className="space-y-4 list-decimal list-inside text-slate-700">
            <li>
              <span className="font-bold">Verifica las Restricciones de la Clave API (API Key).</span>
              <div className="pl-4 mt-1">
                <p>A veces, la clave API de Firebase tiene restricciones que bloquean las solicitudes.</p>
                <p className="mt-1">
                  - Ve a <a href={credentialsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Credenciales de API en Google Cloud</a>.
                </p>
                <p className="mt-1">
                  - Busca la clave llamada <span className="font-bold font-mono">Browser key (auto created by Firebase)</span>.
                </p>
                <p className="mt-1">
                  - Haz clic en ella. En <span className="font-bold">"Restricciones de la aplicación"</span>, para desarrollo local, selecciona <span className="font-bold">"Ninguna"</span>. Para producción, asegúrate de que tu dominio esté en la lista de "Referencias de HTTP".
                </p>
              </div>
            </li>
            <li>
              <span className="font-bold">Asegúrate de que la Facturación esté Habilitada en el Proyecto.</span>
              <div className="pl-4 mt-1">
                <p>Google Cloud requiere que un proyecto tenga una cuenta de facturación activa para usar ciertas APIs, incluso si el uso está dentro del nivel gratuito.</p>
                <p className="mt-1">
                  - Ve a la <a href={billingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">página de Facturación de tu proyecto</a> y confirma que esté vinculada a una cuenta activa.
                </p>
              </div>
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
}
