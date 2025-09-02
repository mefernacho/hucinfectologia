
import React, { useState } from 'react';
import { Patient, TARChange, TARSchemes } from '../core/types';
import CoInfeccionView from './CoInfeccionView';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface CambioTARProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => Promise<void>;
}

export default function CambioTAR({ patient, onSave }: CambioTARProps) {
  const [esquema, setEsquema] = useState<TARSchemes>('KOCITAF');
  const [notas, setNotas] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSave = async () => {
    if (!esquema) {
      alert('Por favor, seleccione un esquema de TAR.');
      return;
    }
    const newChange: TARChange = {
      id: new Date().toISOString(),
      fecha: new Date().toISOString(),
      esquema,
      notas,
    };
    const updatedPatient = {
      ...patient,
      tarChanges: [newChange, ...patient.tarChanges],
    };
    await onSave(updatedPatient);
    alert('Cambio de TAR guardado con éxito.');
    setEsquema('KOCITAF');
    setNotas('');
    setShowForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-blue mb-2">Cambio de Tratamiento Antirretroviral (TAR)</h2>
          <p className="text-xl font-semibold text-brand-gray">{patient.nombres} {patient.apellidos}</p>
        </div>
        {!showForm && (
            <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Registrar Cambio
            </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 p-6 border-2 border-dashed rounded-lg bg-slate-50">
          <h3 className="text-xl font-bold text-brand-gray mb-4">Nuevo Cambio de TAR</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-gray">Nuevo Esquema TAR</label>
              <select
                value={esquema}
                onChange={(e) => setEsquema(e.target.value as TARSchemes)}
                className="mt-1 w-full p-2 border rounded bg-white"
              >
                <option value="KOCITAF">KOCITAF</option>
                <option value="DLT+3TC">DLT+3TC</option>
                <option value="Kivexa/DLT">Kivexa/DLT</option>
                <option value="TLD">TLD</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-gray">Notas / Justificación</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={4}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Motivo del cambio, tolerancia, etc."
              />
            </div>
          </div>
           <div className="flex justify-end mt-6 space-x-4">
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition">Cancelar</button>
                <button onClick={handleSave} className="px-6 py-2 bg-brand-red text-white font-semibold rounded-lg hover:bg-red-800 transition">Guardar Cambio</button>
            </div>
        </div>
      )}

      <CoInfeccionView coInfeccionData={patient.historiaClinicaPrimera.coInfeccion} isAccordion={true} />

      <div className="mt-8">
        <h3 className="text-xl font-bold text-brand-gray mb-4">Historial de Cambios de TAR</h3>
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-3">
          {patient.tarChanges.length > 0 ? (
            patient.tarChanges.map(change => (
              <div key={change.id} className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-brand-blue text-lg">{change.esquema}</p>
                    <p className="text-sm text-slate-500">
                    {new Date(change.fecha).toLocaleString('es-VE', { dateStyle: 'long' })}
                    </p>
                </div>
                {change.notas && <p className="mt-2 text-brand-gray whitespace-pre-wrap">{change.notas}</p>}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">No hay cambios de TAR registrados para este paciente.</p>
          )}
        </div>
      </div>
    </div>
  );
}