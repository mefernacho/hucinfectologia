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


export default function Triaje({ patients, addPatient, updatePatient, selectedPatientId, setSelectedPatientId }: TriajeProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imc, setImc] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(true);

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
  
  const validateField = (name: string, value: string): string => {
    const numValue = parseFloat(value);
    switch (name) {
        case 'id':
            if (!/^\d+$/.test(value)) return "La cédula solo debe contener números.";
            if (patients.some(p => p.id === value)) return "Ya existe un paciente con esta cédula.";
            break;
        case 'edad':
            if (numValue <= 0 || numValue > 120) return "Edad inválida.";
            break;
        case 'talla':
            if (numValue < 0.3 || numValue > 2.5) return "La talla debe estar entre 0.3 y 2.5 metros.";
            break;
        case 'peso':
            if (numValue < 1 || numValue > 500) return "El peso debe estar entre 1 y 500 kg.";
            break;
        case 'temperatura':
            if (numValue < 35 || numValue > 43) return "La temperatura debe estar entre 35 y 43°C.";
            break;
        case 'spo2':
            if (numValue < 0 || numValue > 100) return "SpO2 debe estar entre 0 y 100%.";
            break;
        case 'fc':
            if (numValue < 30 || numValue > 300) return "FC debe estar entre 30 y 300 lpm.";
            break;
        case 'fr':
            if (numValue < 5 || numValue > 80) return "FR debe estar entre 5 y 80 rpm.";
            break;
        default:
            break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handlePatientTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (currentPatient) {
        const updatedPatient = { ...currentPatient, tipoConsulta: value as 'Primera consulta' | 'Sucesivo' };
        await updatePatient(updatedPatient);
    }
  };

  const isFormInvalid = useMemo(() => {
      const requiredFields: (keyof typeof initialFormState)[] = ['nombres', 'apellidos', 'edad', 'id', 'fechaNacimiento', 'direccion', 'motivoConsulta', 'talla', 'peso'];
      const hasEmptyFields = requiredFields.some(field => !formData[field]);
      const hasErrors = Object.values(formErrors).some(error => !!error);
      return hasEmptyFields || hasErrors;
  }, [formData, formErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) {
        alert("Por favor, corrija los errores en el formulario antes de continuar.");
        return;
    }

    const triageData: TriageData = {
      pa: formData.pa,
      talla: parseFloat(formData.talla),
      peso: parseFloat(formData.peso),
      imc: imc || 0,
      temperatura: parseFloat(formData.temperatura),
      spo2: parseFloat(formData.spo2),
      fc: parseFloat(formData.fc),
      fr: parseFloat(formData.fr),
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
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId);

  const FormInput = ({ name, label, error, ...props }: { name: keyof typeof initialFormState, label: string, error?: string, [key: string]: any }) => (
    <div>
        <input 
            name={name} 
            value={formData[name]} 
            onChange={handleChange} 
            placeholder={label} 
            className={`p-2 border rounded w-full ${error ? 'border-red-500' : ''}`}
            {...props} 
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-blue">Lista de Pacientes</h2>
            <button onClick={() => { setShowForm(true); setFormData(initialFormState); setFormErrors({}); }} className="p-2 rounded-full hover:bg-blue-100 transition-colors">
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Identificación del Paciente</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        <FormInput name="nombres" label="Nombres" required />
                        <FormInput name="apellidos" label="Apellidos" required />
                        <FormInput name="edad" label="Edad" type="number" error={formErrors.edad} required />
                        <FormInput name="fechaNacimiento" label="Fecha de Nacimiento" type="date" required />
                        <div className="w-full">
                           <select name="sexo" value={formData.sexo} onChange={handleChange} className="p-2 border rounded bg-white w-full">
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                        <FormInput name="id" label="Cédula de Identidad" error={formErrors.id} required />
                        <div className="md:col-span-2">
                           <FormInput name="direccion" label="Dirección" required />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Información de Consulta</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FormInput name="motivoConsulta" label="Motivo de Consulta" required />
                        <select name="tipoConsulta" value={formData.tipoConsulta} onChange={handleChange} className="p-2 border rounded bg-white">
                            <option>Primera consulta</option>
                            <option>Sucesivo</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Signos Vitales</legend>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-2">
                        <FormInput name="pa" label="PA (mmHg)" />
                        <FormInput name="talla" label="Talla (m)" type="number" step="0.01" error={formErrors.talla} required />
                        <FormInput name="peso" label="Peso (kg)" type="number" step="0.1" error={formErrors.peso} required />
                        <div className="p-2 border rounded bg-slate-100 flex items-center justify-center h-10">IMC: {imc || 'N/A'}</div>
                        <FormInput name="temperatura" label="T° (°C)" type="number" step="0.1" error={formErrors.temperatura} />
                        <FormInput name="spo2" label="SpO2 (%)" type="number" error={formErrors.spo2} />
                        <FormInput name="fc" label="FC (lpm)" type="number" error={formErrors.fc} />
                        <FormInput name="fr" label="FR (rpm)" type="number" error={formErrors.fr} />
                    </div>
                </fieldset>

                <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isFormInvalid}
                      className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-blue-800"
                      title={isFormInvalid ? 'Por favor, complete todos los campos requeridos y corrija los errores.' : 'Agregar Paciente'}
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