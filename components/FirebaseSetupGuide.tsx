
import React from 'react';
import { firebaseConfig } from '../firebaseConfig';
import { WarningIcon } from './icons/WarningIcon';
import { XIcon } from './icons/XIcon';

interface FirebaseSetupGuideProps {
  errorType: 'auth' | 'firestore';
  onClose: () => void;
}

export default function FirebaseSetupGuide({ errorType, onClose }: FirebaseSetupGuideProps) {
  const { projectId } = firebaseConfig;
  const authUrl = `https://console.firebase.google.com/u/0/project/${projectId}/authentication/providers`;
  const apiUrl = `https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=${projectId}`;
  const firestoreUrl = `https://console.firebase.google.com/u/0/project/${projectId}/firestore`;

  const Step = ({ number, title, children, isHighlighted = false }: { number: number, title: string, children: React.ReactNode, isHighlighted?: boolean }) => (
      <div className={`p-4 border rounded-lg ${isHighlighted ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className="text-lg font-bold text-brand-blue">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 ${isHighlighted ? 'bg-brand-blue text-white' : 'bg-slate-300 text-brand-gray'}`}>{number}</span>
              {title}
          </h3>
          <div className="mt-2 pl-9 text-slate-700 space-y-2">
              {children}
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl max-h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b flex-shrink-0">
           <h1 id="guide-title" className="text-2xl font-bold text-red-700">Error Crítico de Configuración de Firebase</h1>
           <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Cerrar guía">
               <XIcon className="w-6 h-6 text-slate-500" />
           </button>
        </header>
        
        <main className="overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            {errorType === 'auth' && (
              <p className="text-lg text-slate-600">La aplicación no puede iniciar sesión porque el servicio de autenticación de Firebase está deshabilitado.</p>
            )}
            {errorType === 'firestore' && (
              <p className="text-lg text-slate-600">La aplicación no puede conectar con la base de datos porque no ha sido creada en Firebase.</p>
            )}
            <p className="mt-2 text-slate-500">Por favor, siga esta guía para configurar correctamente su proyecto.</p>
          </div>
          
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start space-x-4">
              <div className="flex-shrink-0">
                  <WarningIcon className="h-12 w-12 text-yellow-400" />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-yellow-800">¡MUY IMPORTANTE! Verifique el Proyecto de Google Cloud</h3>
                  <p className="mt-2 text-yellow-700">
                      La causa más común de estos errores es realizar la configuración en el proyecto de Google Cloud <span className="font-bold">incorrecto</span>.
                      El ID del proyecto de Firebase para esta aplicación es:
                  </p>
                  <div className="my-2">
                      <strong className="text-xl font-mono bg-yellow-200 text-yellow-900 px-2 py-1 rounded">{projectId}</strong>
                  </div>
                   <p className="mt-3 text-yellow-700">
                      Antes de hacer clic en los enlaces de esta guía, <span className="font-bold">VERIFIQUE</span> que este ID aparezca en la parte superior de la consola de Google Cloud.
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

          <div className="space-y-4">
            <Step number={1} title="Habilite la Autenticación por Correo" isHighlighted={errorType === 'auth'}>
              <p>En la consola de Firebase, active el proveedor de inicio de sesión por "Correo electrónico/contraseña".</p>
              <a href={authUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">1. Ir a la sección de Autenticación de Firebase</a>
              <p>2. Haga clic en <span className="font-bold">"Add new provider"</span> (Agregar nuevo proveedor).</p>
              <p>3. Seleccione <span className="font-bold">"Email/Password"</span> (Correo/Contraseña) y habilítelo.</p>
            </Step>
            
            <Step number={2} title="Habilite la API de Identity Toolkit" isHighlighted={errorType === 'auth'}>
              <p>Esta API es necesaria para que la autenticación funcione. Debe habilitarse en la consola de Google Cloud.</p>
               <a href={apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">1. Ir a la página de la API de Identity Toolkit</a>
               <p>2. Asegúrese de que el proyecto seleccionado sea <span className="font-mono bg-slate-200 p-1 rounded">{projectId}</span>.</p>
               <p>3. Presione el botón azul que dice <span className="font-bold">"HABILITAR" (ENABLE)</span>. Si dice "ADMINISTRAR", ya está habilitada.</p>
            </Step>
            
            <Step number={3} title="Cree la Base de Datos Firestore" isHighlighted={errorType === 'firestore'}>
                <p>La aplicación necesita una base de datos Firestore para almacenar los datos de los pacientes.</p>
                <a href={firestoreUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">1. Ir a la sección de Firestore Database en Firebase</a>
                <p>2. Haga clic en el botón <span className="font-bold">"Crear base de datos"</span>.</p>
                <p className="p-2 bg-green-100 border border-green-300 text-green-800 rounded">3. ¡MUY IMPORTANTE! Seleccione <span className="font-bold">"Iniciar en modo de prueba" (Start in test mode)</span>. Esto asegura que la base de datos se cree en "Modo Nativo", que es lo que la aplicación requiere.</p>
            </Step>
          </div>
        </main>
        
        <footer className="p-4 border-t bg-slate-100 text-center flex-shrink-0">
            <button onClick={onClose} className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition">
              He completado los pasos, cerrar guía
            </button>
        </footer>
      </div>
    </div>
  );
}