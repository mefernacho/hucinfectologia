import React, { useState } from 'react';
import { Patient, HistoriaClinicaSucesiva as SucesivaType, TriageData, StaffMember, EstudiosData } from '../../core/types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

interface HistoriaClinicaSucesivaProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => Promise<void>;
  staff: StaffMember[];
  disabled: boolean;
}

const initialTriageState: TriageData = { pa: '', talla: 0, peso: 0, imc: 0, temperatura: 0, spo2: 0, fc: 0, fr: 0 };
const initialFormState: Omit<SucesivaType, 'id' | 'fecha'> = {
    triage: initialTriageState,
    evolucion: '',
    examenFisico: '',
    plan: '',
    residente: '',
    medicoEvaluadorId: '',
};

const generateLabSummary = (estudios: EstudiosData): string | null => {
    const parts: string[] = [];
    if (estudios.cargaViral !== undefined) parts.push(`CV: ${estudios.cargaViral}`);
    if (estudios.contajeCD4 !== undefined) parts.push(`CD4: ${estudios.contajeCD4}`);
    if (estudios.hepatitisB !== 'no-realizado') parts.push(`VHB: ${estudios.hepatitisB}`);
    if (estudios.hepatitisC !== 'no-realizado') parts.push(`VHC: ${estudios.hepatitisC}`);
    if (estudios.vdrl !== 'no-realizado') parts.push(`VDRL: ${estudios.vdrl}`);
    
    return parts.length > 0 ? parts.join(' | ') : null;
}

export default function HistoriaClinicaSucesiva({ patient, onSave, staff, disabled }: HistoriaClinicaSucesivaProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  
  const handleTriageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTriage = { ...formData.triage, [name]: value ? parseFloat(value) : 0 };
    
    // Recalculate IMC
    const height = name === 'talla' ? parseFloat(value) : newTriage.talla;
    const weight = name === 'peso' ? parseFloat(value) : newTriage.peso;
    if (height > 0 && weight > 0) {
      newTriage.imc = parseFloat((weight / (height * height)).toFixed(2));
    } else {
      newTriage.imc = 0;
    }

    setFormData(prev => ({ ...prev, triage: newTriage }));
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };
  
  const handleShowForm = () => {
      let initialState = initialFormState;
      if (patient.tipoConsulta === 'Sucesivo') {
          initialState = { ...initialState, triage: patient.triage };
      }
      setFormData(initialState);
      setShowForm(true);
  }

  const handleSave = async () => {
    const newEntry: SucesivaType = {
        id: new Date().toISOString(),
        fecha: new Date().toISOString(),
        ...formData
    };
    const updatedPatient = {
        ...patient,
        historiasClinicasSucesivas: [newEntry, ...patient.historiasClinicasSucesivas]
    };
    await onSave(updatedPatient);
    alert('Historia sucesiva guardada con éxito.');
    setFormData(initialFormState);
    setShowForm(false);
  };
  
  const TriageInput = ({label, name, value, ...props}: {label: string; name: string; value: string | number; [key: string]: any }) => (
      <div>
        <label className="text-sm text-slate-500">{label}</label>
        <input name={name} value={value || ''} onChange={handleTriageChange} className="w-full p-2 border rounded" {...props} />
      </div>
  );

  const isSaveDisabled = !!formData.residente === !!formData.medicoEvaluadorId;
  
  if (disabled) {
    return (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-brand-gray">Pestaña Deshabilitada</h2>
            <p className="text-slate-500 mt-2">
                Esta pestaña solo es editable para pacientes con tipo de consulta "Sucesivo".
                <br />
                Puede cambiar el tipo de consulta en la pestaña de 'Triaje'.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-brand-blue mb-2">Historia Clínica Sucesiva</h2>
            <p className="text-xl font-semibold text-brand-gray">{patient.nombres} {patient.apellidos}</p>
        </div>
        <button onClick={handleShowForm} className="flex items-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Nueva Entrada
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-slate-50">
            <h3 className="text-xl font-bold text-brand-gray mb-4">Nueva Evaluación Sucesiva</h3>
            <div className="space-y-6">
                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Signos Vitales (Hoy)</legend>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <TriageInput label="PA (mmHg)" name="pa" type="text" placeholder="120/80" value={formData.triage.pa} />
                        <TriageInput label="Talla (m)" name="talla" type="number" step="0.01" placeholder="1.70" value={formData.triage.talla} />
                        <TriageInput label="Peso (kg)" name="peso" type="number" step="0.1" placeholder="70" value={formData.triage.peso} />
                        <div className="p-2 "><span className="text-sm text-slate-500">IMC</span><div className="w-full p-2 border rounded bg-slate-200">{formData.triage.imc || 'N/A'}</div></div>
                        <TriageInput label="T° (°C)" name="temperatura" type="number" step="0.1" placeholder="37" value={formData.triage.temperatura} />
                        <TriageInput label="SpO2 (%)" name="spo2" type="number" placeholder="98" value={formData.triage.spo2} />
                        <TriageInput label="FC (lpm)" name="fc" type="number" placeholder="80" value={formData.triage.fc} />
                        <TriageInput label="FR (rpm)" name="fr" type="number" placeholder="16" value={formData.triage.fr} />
                    </div>
                </fieldset>
                <textarea name="evolucion" value={formData.evolucion} onChange={handleTextChange} placeholder="Evolución y comentarios de la consulta actual..." rows={5} className="w-full p-2 border rounded-lg" />
                <textarea name="examenFisico" value={formData.examenFisico} onChange={handleTextChange} placeholder="Examen físico de hoy..." rows={5} className="w-full p-2 border rounded-lg" />
                <textarea name="plan" value={formData.plan} onChange={handleTextChange} placeholder="Plan a seguir..." rows={3} className="w-full p-2 border rounded-lg" />
                 <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Evaluación Médica</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                         <div>
                            <label htmlFor="residente" className="block text-sm font-medium text-brand-gray">Residente</label>
                            <select 
                                id="residente" 
                                name="residente" 
                                value={formData.residente || ''}
                                onChange={handleTextChange}
                                disabled={!!formData.medicoEvaluadorId}
                                className="mt-1 w-full p-2 border rounded bg-white disabled:bg-slate-200"
                                required
                            >
                                <option value="">-- No seleccionar --</option>
                                <option value="R1">Residente de primer año de Infectología</option>
                                <option value="R2">Residente de segundo año de Infectología</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="medicoEvaluadorId" className="block text-sm font-medium text-brand-gray">Médico Evaluador</label>
                            <select 
                                id="medicoEvaluadorId" 
                                name="medicoEvaluadorId" 
                                value={formData.medicoEvaluadorId || ''}
                                onChange={handleTextChange}
                                disabled={!!formData.residente}
                                className="mt-1 w-full p-2 border rounded bg-white disabled:bg-slate-200"
                                required
                            >
                                <option value="">-- No seleccionar --</option>
                                {staff.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.nombre} - {member.especialidad}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition">Cancelar</button>
                <button 
                    onClick={handleSave} 
                    disabled={isSaveDisabled} 
                    className={`px-6 py-2 bg-brand-red text-white font-semibold rounded-lg transition ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'}`}
                    title={isSaveDisabled ? 'Debe seleccionar un residente o un médico evaluador (solo uno).' : 'Guardar Entrada'}
                >
                    Guardar Entrada
                </button>
            </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-brand-gray mb-4">Historial de Evaluaciones</h3>
        {patient.historiasClinicasSucesivas.length === 0 ? (
          <p className="text-slate-500">No hay historias sucesivas registradas para este paciente.</p>
        ) : (
          <div className="space-y-4">
            {patient.historiasClinicasSucesivas.map(entry => {
                const medico = staff.find(s => s.id === entry.medicoEvaluadorId);
                const evaluador = entry.residente ? `Residente: ${entry.residente}` : (medico ? medico.nombre : 'No especificado');
                const isToday = new Date(entry.fecha).toDateString() === new Date().toDateString();
                const labSummary = isToday ? generateLabSummary(patient.estudios) : null;
                
                return (
                  <div key={entry.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-brand-blue">Fecha: {new Date(entry.fecha).toLocaleString('es-VE')}</p>
                        <p className="text-sm font-semibold text-brand-gray text-right">Evaluado por: <br/> {evaluador}</p>
                    </div>

                    {labSummary && (
                         <div className="mb-2 p-2 bg-yellow-100 border border-yellow-200 rounded-md">
                            <p className="font-semibold text-sm text-yellow-800">Resumen de Laboratorios de Hoy:</p>
                            <p className="text-xs text-yellow-700">{labSummary}</p>
                         </div>
                    )}
                    
                    <div className="mb-2 p-2 bg-slate-50 rounded-md">
                        <p className="font-semibold">Signos Vitales:</p>
                        <p className="text-sm text-slate-600">
                            PA: {entry.triage.pa}, Peso: {entry.triage.peso}kg, Talla: {entry.triage.talla}m, IMC: {entry.triage.imc}, T°: {entry.triage.temperatura}°C, SpO2: {entry.triage.spo2}%, FC: {entry.triage.fc} lpm, FR: {entry.triage.fr} rpm
                        </p>
                    </div>

                    <div><p className="font-semibold">Evolución:</p><p className="whitespace-pre-wrap text-slate-700">{entry.evolucion}</p></div>
                    <div className="mt-2"><p className="font-semibold">Examen Físico:</p><p className="whitespace-pre-wrap text-slate-700">{entry.examenFisico}</p></div>
                    <div className="mt-2"><p className="font-semibold">Plan:</p><p className="whitespace-pre-wrap text-slate-700">{entry.plan}</p></div>
                  </div>
                )
            })}
          </div>
        )}
      </div>
    </div>
  );
}