
import React, { useState, useEffect } from 'react';
import { Patient, EstudiosData, Inmunizacion, InmunizacionesData } from '../core/types';

interface LaboratoriosInmunizacionesProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => Promise<void>;
}

export default function LaboratoriosInmunizaciones({ patient, onSave }: LaboratoriosInmunizacionesProps) {
  const [estudios, setEstudios] = useState<EstudiosData>(patient.estudios);

  useEffect(() => {
    setEstudios(patient.estudios);
  }, [patient]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['cargaViral', 'contajeCD4', 'trigliceridos', 'colesterolTotal', 'colesterolHDL', 'colesterolLDL', 'urea', 'creatinina'];
    setEstudios(prev => ({ ...prev, [name]: numericFields.includes(name) ? parseFloat(value) || undefined : value }));
  };

  const handleImmunizationChange = (name: keyof InmunizacionesData, field: keyof Inmunizacion, value: string) => {
    setEstudios(prev => ({
      ...prev,
      inmunizaciones: {
        ...prev.inmunizaciones,
        [name]: {
          ...prev.inmunizaciones[name],
          [field]: value,
        }
      }
    }));
  };
  
  const handleSave = async () => {
    const updatedPatient = { ...patient, estudios: estudios };
    await onSave(updatedPatient);
    alert('Laboratorios e inmunizaciones guardados con éxito.');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-blue mb-2">Laboratorios e Inmunizaciones</h2>
        <p className="text-xl font-semibold text-brand-gray mb-6">{patient.nombres} {patient.apellidos}</p>
      </div>
      
      <div className="space-y-6">
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Marcadores Virales e Inmunológicos</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <DataInput label="Carga Viral (copias/mL)" type="number" name="cargaViral" value={estudios.cargaViral || ''} onChange={handleDataChange} placeholder="Ej: 50000" />
                <DataInput label="Contaje de CD4 (células/mm³)" type="number" name="contajeCD4" value={estudios.contajeCD4 || ''} onChange={handleDataChange} placeholder="Ej: 250" />
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Serologías</legend>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <DataSelect label="Virus de Hepatitis B" name="hepatitisB" value={estudios.hepatitisB} onChange={handleDataChange} options={[{v:'no-realizado',l:'No Realizado'},{v:'positivo',l:'Positivo'},{v:'negativo',l:'Negativo'}]} />
                <DataSelect label="Virus de Hepatitis C" name="hepatitisC" value={estudios.hepatitisC} onChange={handleDataChange} options={[{v:'no-realizado',l:'No Realizado'},{v:'positivo',l:'Positivo'},{v:'negativo',l:'Negativo'}]} />
                <DataSelect label="VDRL" name="vdrl" value={estudios.vdrl} onChange={handleDataChange} options={[{v:'no-realizado',l:'No Realizado'},{v:'reactivo',l:'Reactivo'},{v:'no-reactivo',l:'No Reactivo'}]} />
                <DataSelect label="Hepatitis A" name="hepatitisA" value={estudios.hepatitisA} onChange={handleDataChange} options={[{v:'no-realizado',l:'No Realizado'},{v:'reactivo',l:'Reactivo'},{v:'no-reactivo',l:'No Reactivo'}]} />
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Perfil Metabólico y Renal</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <DataInput label="Triglicéridos (mg/dL)" type="number" name="trigliceridos" value={estudios.trigliceridos || ''} onChange={handleDataChange} placeholder="Ej: 150" />
                <DataInput label="Colesterol Total (mg/dL)" type="number" name="colesterolTotal" value={estudios.colesterolTotal || ''} onChange={handleDataChange} placeholder="Ej: 200" />
                <DataInput label="Colesterol HDL (mg/dL)" type="number" name="colesterolHDL" value={estudios.colesterolHDL || ''} onChange={handleDataChange} placeholder="Ej: 40" />
                <DataInput label="Colesterol LDL (mg/dL)" type="number" name="colesterolLDL" value={estudios.colesterolLDL || ''} onChange={handleDataChange} placeholder="Ej: 130" />
                <DataInput label="Urea (mg/dL)" type="number" name="urea" value={estudios.urea || ''} onChange={handleDataChange} placeholder="Ej: 20" />
                <DataInput label="Creatinina (mg/dL)" type="number" name="creatinina" value={estudios.creatinina || ''} onChange={handleDataChange} placeholder="Ej: 0.9" />
            </div>
        </fieldset>
        
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Otros Estudios</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <DataInput label="Citología Anal" name="citologiaAnal" value={estudios.citologiaAnal || ''} onChange={handleDataChange} placeholder="Resultado..." />
                <DataSelect label="Densitometría" name="densitometria" value={estudios.densitometria} onChange={handleDataChange} options={[{v:'no-realizado',l:'No Realizado'},{v:'normal',l:'Normal'},{v:'osteopenia',l:'Osteopenia'},{v:'osteoporosis',l:'Osteoporosis'}]} />
            </div>
        </fieldset>
      </div>

       {/* Immunizations Section */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-brand-gray mb-4">Registro de Inmunizaciones</h3>
        <div className="space-y-4">
            <ImmunizationRow label="Neumococo" name="neumococo" data={estudios.inmunizaciones.neumococo} onChange={handleImmunizationChange} />
            <ImmunizationRow label="Trivalente Viral" name="trivalente" data={estudios.inmunizaciones.trivalente} onChange={handleImmunizationChange} />
            <ImmunizationRow label="Pentavalente" name="pentavalente" data={estudios.inmunizaciones.pentavalente} onChange={handleImmunizationChange} />
            <ImmunizationRow label="Sars-Cov2" name="sarsCov2" data={estudios.inmunizaciones.sarsCov2} onChange={handleImmunizationChange} />
            <ImmunizationRow label="Hepatitis A" name="hepatitisA" data={estudios.inmunizaciones.hepatitisA} onChange={handleImmunizationChange} />
            <ImmunizationRow label="Influenza" name="influenza" data={estudios.inmunizaciones.influenza} onChange={handleImmunizationChange} />
            <ImmunizationRow label="Toxoide Diftérico" name="toxoide" data={estudios.inmunizaciones.toxoide} onChange={handleImmunizationChange} />
        </div>
      </div>
      
      <div className="flex justify-end mt-8 border-t pt-6">
        <button onClick={handleSave} className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition">
          Guardar Laboratorios e Inmunizaciones
        </button>
      </div>
    </div>
  );
}

const DataInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-brand-gray">{label}</label>
        <input {...props} className="mt-1 w-full p-2 border rounded" />
    </div>
);

const DataSelect = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-brand-gray">{label}</label>
        <select {...props} className="mt-1 w-full p-2 border rounded bg-white">
            {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
    </div>
);

const ImmunizationRow = ({ label, name, data, onChange }: { label: string, name: keyof InmunizacionesData, data: Inmunizacion, onChange: (name: keyof InmunizacionesData, field: keyof Inmunizacion, value: string) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-2 bg-slate-50 rounded-lg">
        <label className="font-medium text-brand-gray">{label}</label>
        <div className="flex items-center space-x-4">
            <span className="text-sm">Aplicada:</span>
            <select value={data.aplicada} onChange={(e) => onChange(name, 'aplicada', e.target.value)} className="p-1 border rounded bg-white">
                <option value="no">No</option>
                <option value="si">Sí</option>
            </select>
        </div>
        <div className="flex items-center space-x-2">
            <label className="text-sm">Fecha:</label>
            <input type="date" value={data.fecha || ''} onChange={(e) => onChange(name, 'fecha', e.target.value)} disabled={data.aplicada === 'no'} className="p-1 border rounded disabled:bg-slate-200" />
        </div>
    </div>
);
