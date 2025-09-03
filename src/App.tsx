import React, { useState, useCallback, useEffect } from 'react';
import { Tab, Patient, StaffMember } from './core/types';
import { TABS } from './core/constants';
import Login from './components/Login';
import Header from './components/layout/Header';
import Inicio from './components/views/Inicio';
import Registro from './components/views/Registro';
import Triaje from './components/views/Triaje';
import HistoriaClinicaPrimera from './components/views/HistoriaClinicaPrimera';
import HistoriaClinicaSucesiva from './components/views/HistoriaClinicaSucesiva';
import LaboratoriosInmunizaciones from './components/views/EstudiosReferenciasInmunizaciones';
import StaffMedico from './components/views/StaffMedico';
import Estadisticas from './components/views/Estadisticas';
import InicioTratamiento from './components/views/InicioTratamiento';
import CambioTAR from './components/views/CambioTAR';
import Embarazadas from './components/views/Embarazadas';
import Footer from './components/layout/Footer';
import Chat from './components/views/Chat';
import { PlusIcon } from './components/icons/PlusIcon';

const API_BASE_URL = 'https://backend-api-511318369202.us-central1.run.app';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // No longer loading from Firebase on init
  const [activeTab, setActiveTab] = useState<Tab>('Inicio');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // When user logs in, we will fetch data from our new API
  useEffect(() => {
    if (user) {
      setActiveTab('Registro');
      // TODO: Fetch initial data from backend API
      // Example:
      // const fetchAllData = async () => {
      //   setIsLoading(true);
      //   try {
      //     const patientsRes = await fetch(`${API_BASE_URL}/api/patients`);
      //     const patientsData = await patientsRes.json();
      //     setPatients(patientsData);
      //
      //     const staffRes = await fetch(`${API_BASE_URL}/api/staff`);
      //     const staffData = await staffRes.json();
      //     setStaff(staffData);
      //   } catch (error) {
      //     console.error("Error fetching data from API:", error);
      //     alert("No se pudo cargar la información del servidor.");
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };
      // fetchAllData();
    } else {
      setActiveTab('Inicio');
      setPatients([]);
      setStaff([]);
      setSelectedPatientId(null);
    }
  }, [user]);

  const handleLogout = async () => {
    // TODO: Implement backend logout (e.g., clearing JWT)
    setUser(null);
  };
  
  const addPatient = useCallback(async (patient: Patient) => {
    // TODO: Reemplazar con una llamada a la API: fetch(`${API_BASE_URL}/api/patients`, { method: 'POST', body: JSON.stringify(patient) })
    alert('Funcionalidad de agregar paciente deshabilitada durante la migración.');
  }, []);
  
  const updatePatient = useCallback(async (updatedPatient: Patient) => {
    // TODO: Reemplazar con una llamada a la API: fetch(`${API_BASE_URL}/api/patients/${updatedPatient.id}`, { method: 'PUT', body: JSON.stringify(updatedPatient) })
     alert('Funcionalidad de actualizar paciente deshabilitada durante la migración.');
  }, []);

  const addStaffMember = useCallback(async (staffMember: StaffMember) => {
    // TODO: Reemplazar con una llamada a la API: fetch(`${API_BASE_URL}/api/staff`, { method: 'POST', body: JSON.stringify(staffMember) })
     alert('Funcionalidad de agregar personal deshabilitada durante la migración.');
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Inicio': return <Inicio />;
      case 'Registro': return <Registro patients={patients} />;
      case 'Triaje': return <Triaje patients={patients} addPatient={addPatient} updatePatient={updatePatient} selectedPatientId={selectedPatientId} setSelectedPatientId={setSelectedPatientId} />;
      case 'Historia Clinica de Primera': return selectedPatient ? <HistoriaClinicaPrimera patient={selectedPatient} onSave={updatePatient} staff={staff} disabled={selectedPatient.tipoConsulta !== 'Primera consulta'} /> : <NoPatientSelected />;
      case 'Historia Clinica Sucesiva': return selectedPatient ? <HistoriaClinicaSucesiva patient={selectedPatient} onSave={updatePatient} staff={staff} disabled={selectedPatient.tipoConsulta !== 'Sucesivo'} /> : <NoPatientSelected />;
      case 'Inicio de tratamiento': return selectedPatient ? <InicioTratamiento patient={selectedPatient} onSave={updatePatient} staff={staff} /> : <NoPatientSelected />;
      case 'Cambio de TAR': return selectedPatient ? <CambioTAR patient={selectedPatient} onSave={updatePatient} /> : <NoPatientSelected />;
      case 'Embarazadas': return selectedPatient ? <Embarazadas patient={selectedPatient} onSave={updatePatient} /> : <NoPatientSelected />;
      case 'Laboratorios e Inmunizaciones': return selectedPatient ? <LaboratoriosInmunizaciones patient={selectedPatient} onSave={updatePatient} /> : <NoPatientSelected />;
      case 'Staff Médico': return <StaffMedico staff={staff} addStaffMember={addStaffMember} />;
      case 'Estadísticas': return <Estadisticas patients={patients} />;
      case 'Chat': return <Chat />;
      default: return <Inicio />;
    }
  };
  
  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light-gray">
            <p className="text-xl text-brand-gray">Cargando aplicación...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col">
      {user ? (
        <>
          <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isLoggedIn={!!user}
            onLogout={handleLogout}
          />
          <main className="flex-grow p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>
        </>
      ) : (
        <main className="flex-grow flex items-center justify-center p-4">
          <Login setUser={setUser} />
        </main>
      )}
      <Footer />
    </div>
  );
}

const NoPatientSelected = () => (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-12 text-center">
        <div className="bg-blue-100 p-4 rounded-full">
            <PlusIcon className="h-12 w-12 text-brand-blue" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-brand-gray">No se ha seleccionado un paciente</h2>
        <p className="mt-2 text-slate-500">
            Por favor, vaya a la pestaña de 'Triaje' para agregar un nuevo paciente o seleccionar uno existente de la lista.
        </p>
    </div>
);