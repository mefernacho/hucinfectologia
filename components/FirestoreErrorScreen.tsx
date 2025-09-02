
import React from 'react';
import { firebaseConfig } from '../firebase/config';

export default function FirestoreErrorScreen() {
  const { projectId } = firebaseConfig;

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-8 border-4 border-red-500">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-red-700">Error Crítico de Conexión con Firestore</h1>
          <p className="mt-2 text-lg text-slate-600">
            La aplicación no puede conectarse a la base de datos. Este es un problema de configuración en Firebase, no un error en el código.
          </p>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-brand-gray mb-4">Solución: Crear la Base de Datos en Modo Nativo</h2>
          <p className="text-slate-500 mb-6">
            Por favor, sigue estos 3 pasos EXACTOS en la consola de Firebase para resolver el problema:
          </p>
          <ol className="space-y-4 list-decimal list-inside text-slate-700">
            <li>
              <span className="font-bold">Ve a la Consola de Firebase (¡NO a la de Google Cloud!).</span>
              <div className="pl-4 mt-1">
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  https://console.firebase.google.com/
                </a>
                <p className="text-sm text-slate-500">Selecciona tu proyecto: <span className="font-mono bg-slate-100 p-1 rounded">{projectId}</span></p>
              </div>
            </li>
            <li>
              <span className="font-bold">Crea la base de datos desde el menú correcto.</span>
              <div className="pl-4 mt-1">
                <p>En el menú de la izquierda, haz clic en <span className="font-bold">Build &gt; Firestore Database</span>.</p>
                <p>Presiona el botón azul grande que dice <span className="font-bold">"Crear base de datos"</span>.</p>
              </div>
            </li>
            <li className="bg-green-50 p-3 rounded-lg border border-green-200">
              <span className="font-bold text-green-800">Selecciona "Iniciar en modo de prueba". ¡ESTE ES EL PASO MÁS IMPORTANTE!</span>
              <div className="pl-4 mt-1 text-green-700">
                <p>En la ventana que aparece, te dará dos opciones. Asegúrate de seleccionar la que dice <span className="font-bold">"Iniciar en modo de prueba" (Start in test mode)</span>.</p>
                <p className="text-sm mt-1">Esto creará la base de datos en <span className="font-bold">"Modo Nativo"</span>, que es lo que la aplicación necesita. No crees una base de datos compatible con MongoDB.</p>
              </div>
            </li>
          </ol>
          <p className="mt-6 text-center text-slate-500">
            Una vez creada la base de datos, simplemente <span className="font-bold">recarga esta página</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
