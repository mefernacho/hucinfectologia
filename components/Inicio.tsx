
import React from 'react';

export default function Inicio() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-brand-blue mb-4">Bienvenido al Sistema de Gestión</h2>
      <p className="text-brand-gray mb-6">
        Desde aquí puede gestionar toda la información relacionada con los pacientes del Servicio de Infectología "Hospital Universitario de Caracas".
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-brand-gray mb-2">Gestión de Pacientes</h3>
          <p className="text-slate-600 text-sm">Use la pestaña 'Triaje' para registrar nuevos pacientes y ver la lista de pacientes existentes.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-brand-gray mb-2">Historias Clínicas</h3>
          <p className="text-slate-600 text-sm">Acceda y edite las historias clínicas detalladas para cada paciente seleccionado.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-brand-gray mb-2">Análisis Estadístico</h3>
          <p className="text-slate-600 text-sm">Visualice datos agregados y tendencias a través de gráficos interactivos en la pestaña 'Estadísticas'.</p>
        </div>
      </div>
    </div>
  );
}
