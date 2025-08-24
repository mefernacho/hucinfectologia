import React, { useState, useEffect } from 'react';
import { Patient, EmbarazadaData } from '../types';
import CoInfeccionView from './CoInfeccionView';

interface EmbarazadasProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => Promise<void>;
}

const initialEmbarazadaState: EmbarazadaData = {
    fum: '',
    antecedentesObstetricos: '',
    fechaDiagnosticoVIH: '',
    hemoglobina: undefined,
    cargaViral: undefined,
    contajeCD4: undefined,
    hepatitisB: 'no-realizado',
    hepatitisC: 'no-realizado',
};

export default function Embarazadas({ patient, onSave }: EmbarazadasProps) {
  const [formData, setFormData] = useState<EmbarazadaData>(patient.embarazadaData || initialEmbarazadaState);

  useEffect(() => {
    setFormData(patient.embarazadaData || initialEmbarazadaState);
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['hemoglobina', 'cargaViral', 'contajeCD4'];
    setFormData(prev => ({
        ...prev,
        [name]: numericFields.includes(name) ? parseFloat(value) || undefined : value
    }));
  };

  const handleSave = async () => {
    const updatedPatient = { ...patient, embarazadaData: formData };
    await onSave(updatedPatient);
    alert('Datos de embarazo guardados con éxito.');
  };
  
  if (patient.sexo !== 'Femenino') {
    return (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-brand-gray">Sección No Aplicable</h2>
            <p className="text-slate-500 mt-2">Esta sección es únicamente para el registro de pacientes de sexo femenino.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-brand-blue mb-2">Registro de Paciente Embarazada</h2>
      <p className="text-xl font-semibold text-brand-gray mb-6">{patient.nombres} {patient.apellidos}</p>

      <div className="space-y-6">
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Datos Obstétricos</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Fecha de Última Menstruación (FUM)</label>
                    <input type="date" name="fum" value={formData.fum} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Fecha de Diagnóstico VIH</label>
                    <input type="date" name="fechaDiagnosticoVIH" value={formData.fechaDiagnosticoVIH} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-gray">Antecedentes Obstétricos</label>
                    <textarea name="antecedentesObstetricos" value={formData.antecedentesObstetricos} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded" placeholder="Gesta, Para, Aborto, Cesárea..."></textarea>
                </div>
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Laboratorios de Seguimiento</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Hemoglobina (g/dL)</label>
                    <input type="number" step="0.1" name="hemoglobina" value={formData.hemoglobina || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="Ej: 11.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Carga Viral (copias/mL)</label>
                    <input type="number" name="cargaViral" value={formData.cargaViral || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="Ej: 50000" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Contaje de CD4 (células/mm³)</label>
                    <input type="number" name="contajeCD4" value={formData.contajeCD4 || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="Ej: 250" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-gray">Virus de Hepatitis B</label>
                    <select name="hepatitisB" value={formData.hepatitisB} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                        <option value="no-realizado">No Realizado</option>
                        <option value="positivo">Positivo</option>
                        <option value="negativo">Negativo</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-brand-gray">Virus de Hepatitis C</label>
                    <select name="hepatitisC" value={formData.hepatitisC} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
                        <option value="no-realizado">No Realizado</option>
                        <option value="positivo">Positivo</option>
                        <option value="negativo">Negativo</option>
                    </select>
                </div>
            </div>
        </fieldset>

        <CoInfeccionView coInfeccionData={patient.historiaClinicaPrimera.coInfeccion} />

      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition"
        >
          Guardar Datos de Embarazo
        </button>
      </div>
    </div>
  );
}