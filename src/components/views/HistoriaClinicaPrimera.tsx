import React, { useState, useEffect } from 'react';
import { Patient, HistoriaClinicaPrimera as HistoriaClinicaType, StaffMember, FactoresRiesgoData } from '../../core/types';

interface HistoriaClinicaPrimeraProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => Promise<void>;
  staff: StaffMember[];
  disabled: boolean;
}

export default function HistoriaClinicaPrimera({ patient, onSave, staff, disabled }: HistoriaClinicaPrimeraProps) {
  const [formData, setFormData] = useState<HistoriaClinicaType>(patient.historiaClinicaPrimera);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(patient.historiaClinicaPrimera);
    setErrors({}); // Clear errors when patient changes
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFactoresRiesgoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          factoresRiesgo: {
              ...prev.factoresRiesgo,
              [name]: checked,
          }
      }));
  };

  const handleCoInfeccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          coInfeccion: {
              ...prev.coInfeccion,
              [name]: value,
          }
      }))
  };
  
  const handleHepatitisBChange = (marker: 'agshb' | 'aghbc', value: 'si' | 'no') => {
    setFormData(prev => ({
        ...prev,
        coInfeccion: {
            ...prev.coInfeccion,
            hepatitisB: {
                ...prev.coInfeccion.hepatitisB,
                [marker]: value,
            }
        }
    }));
  };

  const handleNeoplasiaChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => {
          const newNeoplasia = { ...prev.neoplasia, [name]: value };
          if (name === 'tipo' && value !== 'ca-recto') {
              newNeoplasia.clasificacionCARecto = 'no-aplica';
          }
          if (name === 'tipo' && value !== 'otro') {
              newNeoplasia.otroDetalle = '';
          }
          return { ...prev, neoplasia: newNeoplasia };
      });
  };
  
  const validate = (): boolean => {
      const newErrors: Record<string, string> = {};
      if (!formData.enfermedadActual.trim()) {
          newErrors.enfermedadActual = 'La enfermedad actual es requerida.';
      }
      if (!formData.examenFisico.trim()) {
          newErrors.examenFisico = 'El examen físico es requerido.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSave = async () => {
    if (!validate()) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }
    const updatedPatient = { ...patient, historiaClinicaPrimera: formData };
    await onSave(updatedPatient);
    alert('Historia clínica guardada con éxito.');
  };

  const { triage } = patient;
  
  const isEvaluatorSelected = !!formData.residente || !!formData.medicoEvaluadorId;
  const isOnlyOneEvaluator = !(!!formData.residente && !!formData.medicoEvaluadorId);
  const isSaveDisabled = !isEvaluatorSelected || !isOnlyOneEvaluator;


  if (disabled) {
    return (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-brand-gray">Pestaña Deshabilitada</h2>
            <p className="text-slate-500 mt-2">
                Esta pestaña solo es editable para pacientes con tipo de consulta "Primera consulta".
                <br />
                Puede cambiar el tipo de consulta en la pestaña de 'Triaje'.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-brand-blue mb-2">Historia Clínica de Primera Consulta</h2>
      <p className="text-xl font-semibold text-brand-gray mb-6">{patient.nombres} {patient.apellidos}</p>

      {/* Triage Summary */}
      <div className="mb-6 border rounded-lg p-4 bg-slate-50">
        <h3 className="text-lg font-semibold text-brand-gray mb-3">Resumen de Triaje Inicial</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
            <InfoItem label="PA" value={triage.pa || 'N/A'} />
            <InfoItem label="Talla" value={`${triage.talla} m`} />
            <InfoItem label="Peso" value={`${triage.peso} kg`} />
            <InfoItem label="IMC" value={triage.imc.toString()} />
            <InfoItem label="T°" value={`${triage.temperatura} °C`} />
            <InfoItem label="SpO2" value={`${triage.spo2} %`} />
            <InfoItem label="FC" value={`${triage.fc} lpm`} />
            <InfoItem label="FR" value={`${triage.fr} rpm`} />
        </div>
      </div>

      {/* History Form */}
      <div className="space-y-6">
        <TextArea
          label="Enfermedad Actual"
          name="enfermedadActual"
          value={formData.enfermedadActual}
          onChange={handleChange}
          error={errors.enfermedadActual}
          rows={4}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextArea label="Antecedentes Personales" name="antecedentesPersonales" value={formData.antecedentesPersonales} onChange={handleChange} />
            <TextArea label="Antecedentes Familiares" name="antecedentesFamiliares" value={formData.antecedentesFamiliares} onChange={handleChange} />
            <TextArea label="Antecedentes Quirúrgicos" name="antecedentesQuirurgicos" value={formData.antecedentesQuirurgicos} onChange={handleChange} />
            <TextArea label="Antecedentes Alérgicos" name="antecedentesAlergicos" value={formData.antecedentesAlergicos} onChange={handleChange} />
        </div>
        
        {/* Factores de Riesgo */}
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Factores de Riesgo Cardiovascular</legend>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <Checkbox label="Tabaco" name="tabaco" checked={formData.factoresRiesgo.tabaco} onChange={handleFactoresRiesgoChange} />
                <Checkbox label="Alcohol" name="alcohol" checked={formData.factoresRiesgo.alcohol} onChange={handleFactoresRiesgoChange} />
                <Checkbox label="Dislipidemia" name="dislipidemia" checked={formData.factoresRiesgo.dislipidemia} onChange={handleFactoresRiesgoChange} />
                <Checkbox label="Uso de Drogas" name="usoDrogas" checked={formData.factoresRiesgo.usoDrogas} onChange={handleFactoresRiesgoChange} />
                <Checkbox label="HTA" name="hta" checked={formData.factoresRiesgo.hta} onChange={handleFactoresRiesgoChange} />
                <Checkbox label="DM" name="dm" checked={formData.factoresRiesgo.dm} onChange={handleFactoresRiesgoChange} />
            </div>
            <div className="mt-4">
                 <TextArea label="Otros factores (especificar)" name="otrosFactores" value={formData.otrosFactores} onChange={handleChange} rows={2} />
            </div>
        </fieldset>

        {/* Co-infección Section */}
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Co-infección</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <FormInput label="TB" name="tb" value={formData.coInfeccion.tb} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                
                <div className="border p-2 rounded-md bg-slate-50">
                    <p className="text-sm font-medium text-brand-gray mb-1">Hepatitis B</p>
                    <div className="space-y-1">
                        <RadioGroup 
                            label="AgSHB" 
                            name="agshb" 
                            value={formData.coInfeccion.hepatitisB.agshb} 
                            onChange={(val: 'si' | 'no') => handleHepatitisBChange('agshb', val)} 
                        />
                        <RadioGroup 
                            label="AgHBc" 
                            name="aghbc" 
                            value={formData.coInfeccion.hepatitisB.aghbc} 
                            onChange={(val: 'si' | 'no') => handleHepatitisBChange('aghbc', val)} 
                        />
                    </div>
                </div>

                <FormInput label="Hepatitis C" name="hepatitisC" value={formData.coInfeccion.hepatitisC} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormInput label="Toxoplasmosis" name="toxoplasmosis" value={formData.coInfeccion.toxoplasmosis} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormInput label="Criptococoxis" name="criptococoxis" value={formData.coInfeccion.criptococoxis} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormInput label="Histoplasmosis" name="histoplasmosis" value={formData.coInfeccion.histoplasmosis} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormInput label="Candida" name="candida" value={formData.coInfeccion.candida} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormSelect label="Neurosífilis" name="neurosifilis" value={formData.coInfeccion.neurosifilis} onChange={handleCoInfeccionChange} options={[{v:'no', l:'No'}, {v:'si', l:'Sí'}]} />
                <FormInput label="Paracoccidiomicosis" name="paracoccidiomicosis" value={formData.coInfeccion.paracoccidiomicosis} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormInput label="CMV" name="cmv" value={formData.coInfeccion.cmv} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
                <FormInput label="EBV" name="ebv" value={formData.coInfeccion.ebv} onChange={handleCoInfeccionChange} placeholder="Detalles..."/>
            </div>
        </fieldset>

        {/* Neoplasias Section */}
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-brand-gray px-2">Neoplasias</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                    <FormSelect label="Tipo de Neoplasia" name="tipo" value={formData.neoplasia.tipo} onChange={handleNeoplasiaChange} options={[
                        {v:'ninguna', l:'Ninguna'}, 
                        {v:'linfoma-no-hodking', l:'Linfoma no Hodking'}, 
                        {v:'ca-recto', l:'CA de Recto'},
                        {v:'sarcoma-kaposi', l:'Sarcoma de Kaposi'},
                        {v:'otro', l:'Otro'}
                    ]}/>
                </div>
                <div>
                    {formData.neoplasia.tipo === 'ca-recto' && (
                         <FormSelect label="Clasificación CA de Recto" name="clasificacionCARecto" value={formData.neoplasia.clasificacionCARecto} onChange={handleNeoplasiaChange} options={[
                             {v: 'no-aplica', l:'N/A'},
                             {v: 'estadio-I', l:'Estadio I'},
                             {v: 'estadio-II', l:'Estadio II'},
                             {v: 'estadio-III', l:'Estadio III'},
                             {v: 'estadio-IV', l:'Estadio IV'},
                         ]} />
                    )}
                     {formData.neoplasia.tipo === 'otro' && (
                         <FormInput label="Especifique Otra Neoplasia" name="otroDetalle" value={formData.neoplasia.otroDetalle} onChange={handleNeoplasiaChange} placeholder="Detalles..."/>
                    )}
                </div>
            </div>
        </fieldset>

        <TextArea
          label="Examen Físico por Sistemas (Modificable)"
          name="examenFisico"
          value={formData.examenFisico}
          onChange={handleChange}
          error={errors.examenFisico}
          rows={10}
        />
        
        {/* Evaluator Section */}
        <fieldset className="border p-4 rounded-lg bg-slate-50">
            <legend className="text-lg font-semibold text-brand-gray px-2">Evaluación Médica</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                 <div>
                    <label htmlFor="residente" className="block text-sm font-medium text-brand-gray">Residente</label>
                    <select 
                        id="residente" 
                        name="residente" 
                        value={formData.residente || ''}
                        onChange={handleChange}
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
                        onChange={handleChange}
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

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg transition ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
          title={isSaveDisabled ? 'Debe seleccionar un residente o un médico evaluador (solo uno) y completar los campos requeridos.' : 'Guardar Cambios'}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="font-bold text-brand-gray">{label}</p>
        <p className="text-slate-600">{value}</p>
    </div>
);

const RadioGroup = ({ label, name, value, onChange }: { label: string, name: string, value: 'si' | 'no', onChange: (val: 'si' | 'no') => void }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-slate-700">{label}</label>
        <div className="flex space-x-2">
            <label className="text-sm flex items-center cursor-pointer">
                <input className="mr-1" type="radio" name={name} value="si" checked={value === 'si'} onChange={() => onChange('si')} /> Sí
            </label>
            <label className="text-sm flex items-center cursor-pointer">
                <input className="mr-1" type="radio" name={name} value="no" checked={value === 'no'} onChange={() => onChange('no')} /> No
            </label>
        </div>
    </div>
);


const FormInput = ({ label, name, value, onChange, ...props }: {label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray">{label}</label>
        <input id={name} name={name} value={value} onChange={onChange} className="mt-1 w-full p-2 border rounded" {...props} />
    </div>
);

const FormSelect = ({ label, name, value, onChange, options }: {label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {v: string, l: string}[]}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 w-full p-2 border rounded bg-white">
            {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
    </div>
);

interface TextAreaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    rows?: number;
    error?: string;
}

const TextArea = ({ label, name, value, onChange, rows = 3, error }: TextAreaProps) => (
    <div>
        <label className="block text-md font-semibold text-brand-gray mb-2">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition ${error ? 'border-red-500' : 'border-slate-300'}`}
            placeholder={`Detalles sobre ${label.toLowerCase()}...`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && <p id={`${name}-error`} className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Checkbox = ({ label, name, checked, onChange }: { label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
        />
        <span className="text-sm font-medium text-brand-gray">{label}</span>
    </label>
);