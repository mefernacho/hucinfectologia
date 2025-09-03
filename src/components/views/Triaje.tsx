import React, { useState, useEffect, useMemo } from 'react';
import { Patient, TriageData, InmunizacionesData, CoInfeccionData, NeoplasiaData, FactoresRiesgoData } from '../../core/types';
import { UserIcon } from '../icons/UserIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

interface TriajeProps {
  patients: Patient[];
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
}

const initialFormState = {
  nombres: '',
  apellidos: '',
  edad: '',
  sexo: 'Masculino' as 'Masculino' | 'Femenino',
  id: '', // Cedula
  fechaNacimiento: '',
  direccion: '',
  motivoConsulta: '',
  tipoConsulta: 'Primera consulta' as 'Primera consulta' | 'Sucesivo',
  pa: '',
  talla: '',
  peso: '',
  temperatura: '',
  spo2: '',
  fc: '',
  fr: '',
};

const initialImmunizations: InmunizacionesData = {
    neumococo: { aplicada: 'no' },
    trivalente: { aplicada: 'no' },
    pentavalente: { aplicada: 'no' },
    sarsCov2: { aplicada: 'no' },
    hepatitisA: { aplicada: 'no' },
    influenza: { aplicada: 'no' },
    toxoide: { aplicada: 'no' },
};

const initialCoInfeccion: CoInfeccionData = {
  tb: '',
  hepatitisB: { agshb: 'no', aghbc: 'no' },
  hepatitisC: '',
  toxoplasmosis: '',
  criptococoxis: '',
  histoplasmosis: '',
  candida: '',
  neurosifilis: 'no',
  paracoccidiomicosis: '',
  cmv: '',
  ebv: '',
};

const initialNeoplasia: NeoplasiaData = {
    tipo: 'ninguna',
    clasificacionCARecto: 'no-aplica',
    otroDetalle: '',
};

const initialFactoresRiesgo: FactoresRiesgoData = {
    tabaco: false,
    alcohol: false,
    dislipidemia: false,
    usoDrogas: false,
    hta: false,
    dm: false,
};

const validate = (data: typeof initialFormState, existingPatients: Patient[], isNewPatient: boolean): Record<string, string> => {
    const errors: Record<string, string> = {};
    const now = new Date();
    const dob = data.fechaNacimiento ? new Date(data.fechaNacimiento) : null;

    // Required personal data
    if (!data.nombres.trim()) errors.nombres = "El nombre es requerido.";
    if (!data.apellidos.trim()) errors.apellidos = "El apellido es requerido.";
    if (!data.edad) errors.edad = "La edad es requerida.";
    else if (!/^\d+$/.test(data.edad)) errors.edad = "La edad debe ser un número entero.";
    else {
        const numValue = parseInt(data.edad, 10);
        if (numValue <= 0 || numValue > 120) errors.edad = "Edad inválida (debe ser entre 1 y 120).";
    }
    if (!data.id.trim()) errors.id = "La cédula es requerida.";
    else if (!/^\d+$/.test(data.id)) errors.id = "La cédula solo debe contener números.";
    else if (isNewPatient && existingPatients.some(p => p.id === data.id)) errors.id = "Ya existe un paciente con esta cédula.";
    
    if (!data.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es requerida.";
    else if (dob && dob > now) errors.fechaNacimiento = "La fecha de nacimiento no puede ser futura.";
    
    if (!data.direccion.trim()) errors.direccion = "La dirección es requerida.";
    if (!data.motivoConsulta.trim()) errors.motivoConsulta = "El motivo de consulta es requerido.";
    
    // Vital signs validation
    if (data.pa && !/^\d{1,3}\/\d{1,3}$/.test(data.pa)) {
        errors.pa = "Formato inválido. Use NNN/NNN.";
    }

    // Talla validation
    if (!data.talla) errors.talla = "La talla es requerida.";
    else if (!/^\d*\.?\d+$/.test(data.talla)) errors.talla = "La talla debe ser un valor numérico.";
    else {
        const numValue = parseFloat(data.talla);
        if (numValue < 0.3 || numValue > 2.5) errors.talla = "Talla inválida (entre 0.3 y 2.5 m).";
    }

    // Peso validation
    if (!data.peso) errors.peso = "El peso es requerido.";
    else if (!/^\d*\.?\d+$/.test(data.peso)) errors.peso = "El peso debe ser un valor numérico.";
    else {
        const numValue = parseFloat(data.peso);
        if (numValue < 1 || numValue > 500) errors.peso = "Peso inválido (entre 1 y 500 kg).";
    }

    // Temperatura validation
    if (data.temperatura && !/^\d*\.?\d+$/.test(data.temperatura)) {
        errors.temperatura = "La temperatura debe ser un valor numérico.";
    } else if (data.temperatura) {
        const numValue = parseFloat(data.temperatura);
        if (numValue < 35 || numValue > 43) errors.temperatura = "Temp. inválida (entre 35 y 43°C).";
    }

    // SpO2 validation
    if (data.spo2 && !/^\d+$/.test(data.spo2)) {
        errors.spo2 = "SpO2 debe ser un valor numérico entero.";
    } else if (data.spo2) {
        const numValue = parseInt(data.spo2, 10);
        if (numValue < 0 || numValue > 100) errors.spo2 = "SpO2 inválido (entre 0 y 100%).";
    }

    // FC validation
    if (data.fc && !/^\d+$/.test(data.fc)) {
        errors.fc = "FC debe ser un valor numérico entero.";
    } else if (data.fc) {
        const numValue = parseInt(data.fc, 10);
        if (numValue < 30 || numValue > 300) errors.fc = "FC inválida (entre 30 y 300 lpm).";
    }

    // FR validation
    if (data.fr && !/^\d+$/.test(data.fr)) {
        errors.fr = "FR debe ser un valor numérico entero.";
    } else if (data.fr) {
        const numValue = parseInt(data.fr, 10);
        if (numValue < 5 || numValue > 80) errors.fr = "FR inválida (entre 5 y 80 rpm).";
    }

    return errors;
};


const FormInput = ({ name, label, error, ...props }: { name: string, label: string, error?: string, [key: string]: any }) => (
    <div>
        <input 
            name={name} 
            placeholder={label} 
            className={`p-2 border rounded w-full ${error ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props} 
        />
        {error && <p id={`${name}-error`} className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);


export default function Triaje({ patients, addPatient, updatePatient, selectedPatientId, setSelectedPatientId }: TriajeProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imc, setImc] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
        setSelectedPatientId(patients[0].id);
    }
    if(patients.length === 0){
        setShowForm(true);
    } else {
        setShowForm(false);
    }
  }, [patients, selectedPatientId, setSelectedPatientId]);
  
  useEffect(() => {
    const height = parseFloat(formData.talla);
    const weight = parseFloat(formData.peso);
    if (height > 0 && weight > 0) {
      const imcValue = weight / (height * height);
      setImc(parseFloat(imcValue.toFixed(2)));
    } else {
      setImc(null);
    }
  }, [formData.talla, formData.peso]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    // Re-validate on change if form has already been submitted
    if (isSubmitting) {
        setFormErrors(validate(newFormData, patients, true));
    }
  };

  const handlePatientTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (currentPatient) {
        const updatedPatient = { ...currentPatient, tipoConsulta: value as 'Primera consulta' | 'Sucesivo' };
        await updatePatient(updatedPatient);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate(formData, patients, true);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        // Find the first element with an error to focus it
        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.getElementsByName(firstErrorField)[0];
        if (element) {
            element.focus();
        }
        alert("Por favor, corrija los errores en el formulario antes de continuar.");
        return;
    }

    const triageData: TriageData = {
      pa: formData.pa,
      talla: parseFloat(formData.talla),
      peso: parseFloat(formData.peso),
      imc: imc || 0,
      temperatura: parseFloat(formData.temperatura) || 0,
      spo2: parseFloat(formData.spo2) || 0,
      fc: parseFloat(formData.fc) || 0,
      fr: parseFloat(formData.fr) || 0,
    };
    
    const currentDate = new Date();

    const newPatient: Patient = {
      id: formData.id,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      edad: parseInt(formData.edad),
      sexo: formData.sexo,
      fechaNacimiento: formData.fechaNacimiento,
      direccion: formData.direccion,
      motivoConsulta: formData.motivoConsulta,
      tipoConsulta: formData.tipoConsulta,
      consultationDate: currentDate,
      consultationTime: currentDate.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
      location: "Hospital Universitario de Caracas",
      triage: triageData,
      historiaClinicaPrimera: { 
          enfermedadActual: '', 
          antecedentesPersonales: '', 
          antecedentesFamiliares: '', 
          antecedentesQuirurgicos: '', 
          antecedentesAlergicos: '', 
          examenFisico: '',
          factoresRiesgo: initialFactoresRiesgo,
          otrosFactores: '',
          coInfeccion: initialCoInfeccion,
          neoplasia: initialNeoplasia,
      },
      historiasClinicasSucesivas: [],
      tratamientoNotas: [],
      tarChanges: [],
      embarazadaData: null,
      fichaInicioTratamiento: null,
      estudios: { 
          hepatitisB: 'no-realizado', 
          hepatitisC: 'no-realizado',
          vdrl: 'no-realizado',
          citologiaAnal: '',
          densitometria: 'no-realizado',
          hepatitisA: 'no-realizado',
          inmunizaciones: initialImmunizations
      },
    };
    
    await addPatient(newPatient);
    setFormData(initialFormState);
    setFormErrors({});
    setShowForm(false);
    setIsSubmitting(false); // Reset after successful submission
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-blue">Lista de Pacientes</h2>
            <button onClick={() => { setShowForm(true); setFormData(initialFormState); setFormErrors({}); setIsSubmitting(false); }} className="p-2 rounded-full hover:bg-blue-100 transition-colors" title="Agregar Nuevo Paciente">
                <PlusCircleIcon className="w-6 h-6 text-brand-blue"/>
            </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {patients.length === 0 ? (
            <p className="text-slate-500 text-center mt-8">No hay pacientes registrados.</p>
          ) : (
            <ul className="space-y-2">
              {patients.map(patient => (
                <li key={patient.id}>
                  <button
                    onClick={() => {
                        setSelectedPatientId(patient.id);
                        setShowForm(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedPatientId === patient.id ? 'bg-brand-blue text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-brand-gray'}`}
                  >
                    <p className="font-semibold">{patient.nombres} {patient.apellidos}</p>
                    <p className={`text-sm ${selectedPatientId === patient.id ? 'text-blue-200' : 'text-slate-500'}`}>C.I: {patient.id}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {showForm ? (
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className='flex justify-between items-start'>
                <h2 className="text-2xl font-bold text-brand-blue mb-6">Registro de Triaje</h2>
                {patients.length > 0 && <button onClick={() => setShowForm(false)} className="text-2xl text-slate-400 hover:text-brand-red">&times;</button>}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Identificación del Paciente</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        <FormInput name="nombres" label="Nombres" value={formData.nombres} onChange={handleChange} error={formErrors.nombres} required />
                        <FormInput name="apellidos" label="Apellidos" value={formData.apellidos} onChange={handleChange} error={formErrors.apellidos} required />
                        <FormInput name="edad" label="Edad" type="number" value={formData.edad} onChange={handleChange} error={formErrors.edad} required />
                        <FormInput name="fechaNacimiento" label="Fecha de Nacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} error={formErrors.fechaNacimiento} required />
                        <div className="w-full">
                           <select name="sexo" value={formData.sexo} onChange={handleChange} className="p-2 border rounded bg-white w-full border-slate-300">
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                        <FormInput name="id" label="Cédula de Identidad" value={formData.id} onChange={handleChange} error={formErrors.id} required />
                        <div className="md:col-span-2">
                           <FormInput name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} error={formErrors.direccion} required />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Información de Consulta</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FormInput name="motivoConsulta" label="Motivo de Consulta" value={formData.motivoConsulta} onChange={handleChange} error={formErrors.motivoConsulta} required />
                        <select name="tipoConsulta" value={formData.tipoConsulta} onChange={handleChange} className="p-2 border rounded bg-white border-slate-300">
                            <option>Primera consulta</option>
                            <option>Sucesivo</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Signos Vitales</legend>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-2">
                        <FormInput name="pa" label="PA (mmHg)" value={formData.pa} onChange={handleChange} error={formErrors.pa} />
                        <FormInput name="talla" label="Talla (m)" type="number" step="0.01" value={formData.talla} onChange={handleChange} error={formErrors.talla} required />
                        <FormInput name="peso" label="Peso (kg)" type="number" step="0.1" value={formData.peso} onChange={handleChange} error={formErrors.peso} required />
                        <div className="p-2 border rounded bg-slate-100 flex items-center justify-center h-10 border-slate-300">IMC: {imc || 'N/A'}</div>
                        <FormInput name="temperatura" label="T° (°C)" type="number" step="0.1" value={formData.temperatura} onChange={handleChange} error={formErrors.temperatura} />
                        <FormInput name="spo2" label="SpO2 (%)" type="number" value={formData.spo2} onChange={handleChange} error={formErrors.spo2} />
                        <FormInput name="fc" label="FC (lpm)" type="number" value={formData.fc} onChange={handleChange} error={formErrors.fc} />
                        <FormInput name="fr" label="FR (rpm)" type="number" value={formData.fr} onChange={handleChange} error={formErrors.fr} />
                    </div>
                </fieldset>

                <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg transition hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Agregar Paciente
                    </button>
                </div>
            </form>
        </div>
      ) : (
            <div className="lg:col-span-2 flex items-center justify-center bg-white rounded-lg shadow-md p-6 text-center">
                {currentPatient ? (
                    <div className='w-full'>
                        <UserIcon className="h-24 w-24 mx-auto text-slate-300" />
                        <h3 className="mt-4 text-2xl font-bold text-brand-gray">{currentPatient.nombres} {currentPatient.apellidos}</h3>
                        <p className="mt-1 text-slate-500">C.I: {currentPatient.id} - {currentPatient.edad} años</p>
                        
                        <div className="mt-4 text-sm text-left bg-slate-50 p-4 rounded-lg inline-block">
                           <p><strong>Fecha de Ingreso:</strong> {new Date(currentPatient.consultationDate).toLocaleDateString('es-VE')}</p>
                           <p><strong>Hora de Ingreso:</strong> {currentPatient.consultationTime}</p>
                           <p><strong>Ubicación:</strong> {currentPatient.location}</p>
                        </div>

                         <div className="mt-4 max-w-sm mx-auto">
                            <label className="block text-sm font-medium text-brand-gray">Tipo de Consulta</label>
                            <select 
                                name="tipoConsulta" 
                                value={currentPatient.tipoConsulta} 
                                onChange={handlePatientTypeChange} 
                                className="mt-1 w-full p-2 border rounded bg-white"
                            >
                                <option>Primera consulta</option>
                                <option>Sucesivo</option>
                            </select>
                            <p className="mt-2 text-xs text-slate-400">Cambiar el tipo de consulta afectará qué pestaña de historia clínica puede editar.</p>
                        </div>
                        
                        <p className="mt-4 text-slate-500 max-w-md mx-auto">Seleccione otro paciente de la lista o haga clic en el botón '+' para agregar uno nuevo.</p>
                    </div>
                ) : (
                     <div>
                        <UserIcon className="h-24 w-24 mx-auto text-slate-300" />
                        <h3 className="mt-4 text-2xl font-bold text-brand-gray">Gestión de Pacientes</h3>
                        <p className="mt-2 text-slate-500">Seleccione un paciente de la lista para ver sus detalles o haga clic en el botón '+' para agregar uno nuevo.</p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}