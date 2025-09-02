
import React from 'react';
import { firebaseConfig } from '../firebase/config';
import { WarningIcon } from './icons/WarningIcon';

export default function AuthApiErrorScreen() {
  const { projectId } = firebaseConfig;
  const apiUrl = `https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=${projectId}`;
  const authUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
  const credentialsUrl = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;
  const billingUrl = `https://console.cloud.google.com/billing?project=${projectId}`;

  const Step = ({ number, title, children, isHighlighted = false }: { number: string, title: string, children: React.ReactNode, isHighlighted?: boolean }) => (
      <div className={`p-4 border rounded-lg ${isHighlighted ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className="text-lg font-bold text-brand-blue flex items-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-lg ${isHighlighted ? 'bg-brand-blue text-white' : 'bg-slate-300 text-brand-gray'}`}>{number}</span>
              {title}
          </h3>
          <div className="mt-2 text-slate-600 pl-11">
              {children}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8 border-4 border-red-500">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-red-700">Error Crítico de Autenticación</h1>
          <p className="mt-2 text-lg text-slate-600">
            El servicio de inicio de sesión de Firebase está bloqueado. Esto casi siempre es un problema de configuración en su proyecto de Google Cloud.
          </p>
        </div>
        
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-2xl font-bold text-brand-gray mb-4 text-center">Guía de Diagnóstico Definitiva</h2>
          <p className="text-slate-500 mb-6 text-center">
            Por favor, siga <span className='font-bold'>TODOS</span> los siguientes pasos en orden. El error que está viendo indica que uno de ellos es la causa.
          </p>
          <div className="space-y-6">

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center"><WarningIcon className="h-6 w-6 mr-2" />Paso 0: Verifique el ID del Proyecto de Google Cloud</h3>
                <p className="mt-2 text-yellow-700">
                    La causa #1 de este error es aplicar la configuración en el proyecto de Google Cloud <span className="font-bold">incorrecto</span>.
                </p>
                <p className="mt-2 text-yellow-700">
                    El ID de proyecto para esta aplicación es: <strong className="text-xl font-mono bg-yellow-200 text-yellow-900 px-2 py-1 rounded">{projectId}</strong>
                </p>
                <p className="mt-3 text-yellow-700">
                    Antes de continuar, vaya a la consola de Google Cloud y <span className="font-bold">ASEGÚRESE</span> de que este mismo ID aparezca en la barra de navegación superior. Si no es así, selecciónelo de la lista de proyectos.
                </p>
            </div>

            <Step number="1" title="Confirme que el Proveedor 'Correo/Contraseña' está Habilitado">
                <p>En Firebase, este método de inicio de sesión debe estar activado.</p>
                <ol className="mt-2 space-y-1 list-decimal list-inside text-slate-700">
                  <li>Abra la <a href={authUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">página de proveedores de autenticación de Firebase</a>.</li>
                  <li>Busque <span className="font-semibold">"Correo electrónico/Contraseña"</span> en la lista y asegúrese de que esté <span className="font-bold text-green-700">Habilitado</span>.</li>
                </ol>
            </Step>

            <Step number="2" title="Confirme que la API de 'Identity Toolkit' está Habilitada">
                <p>Usted mencionó que ya hizo esto, pero por favor verifique de nuevo. Esta API es esencial.</p>
                <ol className="mt-2 space-y-1 list-decimal list-inside text-slate-700">
                  <li>Abra la <a href={apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">página de la API de Identity Toolkit en Google Cloud</a>.</li>
                  <li className="font-semibold text-blue-800">El botón superior debe decir "ADMINISTRAR" (MANAGE).
                      <p className="font-normal text-sm mt-1 text-blue-700">Si el botón dice "HABILITAR" (ENABLE), significa que no está activa. Haga clic para habilitarla.</p>
                  </li>
                </ol>
            </Step>

            <Step number="3" title="Revise las Restricciones de la Clave de API (API Key)" isHighlighted={true}>
                <p>Una clave de API restringida puede bloquear las solicitudes de autenticación, especialmente desde un entorno de desarrollo local (`localhost`).</p>
                 <ol className="mt-2 space-y-1 list-decimal list-inside text-slate-700">
                    <li>Vaya a la <a href={credentialsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">página de Credenciales de API en Google Cloud</a>.</li>
                    <li>Busque la clave llamada <span className="font-semibold font-mono">Browser key (auto created by Firebase)</span> y haga clic en ella.</li>
                    <li>En la sección <span className="font-semibold">"Restricciones de la aplicación"</span>, seleccione temporalmente <span className="font-bold text-red-700">"Ninguna"</span> y guarde los cambios. Esto eliminará cualquier bloqueo por dominio.</li>
                    <li className="text-sm mt-1 text-slate-500">Si esto soluciona el problema, recuerde volver más tarde y añadir su dominio de producción (y `localhost` si es necesario) a las "Referencias de HTTP" para mayor seguridad.</li>
                </ol>
            </Step>

            <Step number="4" title="Asegúrese de que la Facturación esté Habilitada en el Proyecto">
                <p>Google Cloud requiere que los proyectos tengan una cuenta de facturación activa para usar ciertas APIs, incluso si el uso está dentro del nivel gratuito.</p>
                <ol className="mt-2 space-y-1 list-decimal list-inside text-slate-700">
                    <li>Vaya a la <a href={billingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">página de Facturación de su proyecto</a>.</li>
                    <li>Confirme que el proyecto esté vinculado a una cuenta de facturación activa. Si no lo está, deberá crear o vincular una.</li>
                </ol>
            </Step>
          </div>
           <p className="mt-8 text-center text-slate-600 font-semibold">
            Después de verificar <span className='font-bold text-red-700'>TODOS</span> los puntos, por favor, <span className="font-bold">recargue esta página</span>.
          </p>
        </div>
      </div>
    </div>
  );
}