import React, { useState, useEffect } from 'react';
import { Patient, TriageData, InmunizacionesData, CoInfeccionData, NeoplasiaData, FactoresRiesgoData } from '../types';
import { UserIcon } from './icons/UserIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (patients.some(p => p.id === formData.id)) {
        alert("Error: Ya existe un paciente con esa cédula.");
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
    setShowForm(false);
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-blue">Lista de Pacientes</h2>
            <button onClick={() => setShowForm(true)} className="p-2 rounded-full hover:bg-blue-100 transition-colors">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <input name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Nombres" className="p-2 border rounded" required />
                        <input name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Apellidos" className="p-2 border rounded" required />
                        <input name="edad" value={formData.edad} onChange={handleChange} type="number" placeholder="Edad" className="p-2 border rounded" required />
                        <input name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} type="date" placeholder="Fecha de Nacimiento" className="p-2 border rounded" required />
                        <select name="sexo" value={formData.sexo} onChange={handleChange} className="p-2 border rounded bg-white">
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                        <input name="id" value={formData.id} onChange={handleChange} placeholder="Cédula de Identidad" className="p-2 border rounded" required />
                        <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" className="p-2 border rounded md:col-span-2" required />
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Información de Consulta</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <input name="motivoConsulta" value={formData.motivoConsulta} onChange={handleChange} placeholder="Motivo de Consulta" className="p-2 border rounded" required />
                        <select name="tipoConsulta" value={formData.tipoConsulta} onChange={handleChange} className="p-2 border rounded bg-white">
                            <option>Primera consulta</option>
                            <option>Sucesivo</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-brand-gray px-2">Signos Vitales</legend>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <input name="pa" value={formData.pa} onChange={handleChange} placeholder="PA (mmHg)" className="p-2 border rounded" />
                        <input name="talla" value={formData.talla} onChange={handleChange} type="number" step="0.01" placeholder="Talla (m)" className="p-2 border rounded" required />
                        <input name="peso" value={formData.peso} onChange={handleChange} type="number" step="0.1" placeholder="Peso (kg)" className="p-2 border rounded" required />
                        <div className="p-2 border rounded bg-slate-100 flex items-center justify-center">IMC: {imc || 'N/A'}</div>
                        <input name="temperatura" value={formData.temperatura} onChange={handleChange} type="number" step="0.1" placeholder="T° (°C)" className="p-2 border rounded" />
                        <input name="spo2" value={formData.spo2} onChange={handleChange} type="number" placeholder="SpO2 (%)" className="p-2 border rounded" />
                        <input name="fc" value={formData.fc} onChange={handleChange} type="number" placeholder="FC (lpm)" className="p-2 border rounded" />
                        <input name="fr" value={formData.fr} onChange={handleChange} type="number" placeholder="FR (rpm)" className="p-2 border rounded" />
                    </div>
                </fieldset>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition">
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