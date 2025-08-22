import React, { useState, useCallback } from 'react';
import { Tab, Patient, StaffMember } from './types';
import { TABS, INITIAL_STAFF } from './constants';
import Login from './components/Login';
import Header from './components/Header';
import Inicio from './components/Inicio';
import Registro from './components/Registro';
import Triaje from './components/Triaje';
import HistoriaClinicaPrimera from './components/HistoriaClinicaPrimera';
import HistoriaClinicaSucesiva from './components/HistoriaClinicaSucesiva';
import LaboratoriosInmunizaciones from './components/EstudiosReferenciasInmunizaciones';
import StaffMedico from './components/StaffMedico';
import Estadisticas from './components/Estadisticas';
import InicioTratamiento from './components/InicioTratamiento';
import CambioTAR from './components/CambioTAR';
import Embarazadas from './components/Embarazadas';
import Footer from './components/Footer';
import { PlusIcon } from './components/icons/PlusIcon';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Tab>('Inicio');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveTab('Registro');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('Inicio');
    setSelectedPatientId(null);
  };

  const addPatient = useCallback((patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    setSelectedPatientId(patient.id);
  }, []);
  
  const updatePatient = useCallback((updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  }, []);

  const addStaffMember = useCallback((staffMember: StaffMember) => {
    setStaff(prev => [...prev, staffMember]);
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Inicio':
        return <Inicio />;
      case 'Registro':
        return <Registro patients={patients} />;
      case 'Triaje':
        return (
            <Triaje 
                patients={patients}
                addPatient={addPatient}
                updatePatient={updatePatient}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
            />
        );
      case 'Historia Clinica de Primera':
        return selectedPatient ? <HistoriaClinicaPrimera patient={selectedPatient} onSave={updatePatient} staff={staff} disabled={selectedPatient.tipoConsulta !== 'Primera consulta'} /> : <NoPatientSelected />;
      case 'Historia Clinica Sucesiva':
        return selectedPatient ? <HistoriaClinicaSucesiva patient={selectedPatient} onSave={updatePatient} staff={staff} disabled={selectedPatient.tipoConsulta !== 'Sucesivo'} /> : <NoPatientSelected />;
       case 'Inicio de tratamiento':
        return selectedPatient ? <InicioTratamiento patient={selectedPatient} onSave={updatePatient} staff={staff} /> : <NoPatientSelected />;
      case 'Cambio de TAR':
        return selectedPatient ? <CambioTAR patient={selectedPatient} onSave={updatePatient} /> : <NoPatientSelected />;
      case 'Embarazadas':
        return selectedPatient ? <Embarazadas patient={selectedPatient} onSave={updatePatient} /> : <NoPatientSelected />;
      case 'Laboratorios e Inmunizaciones':
        return selectedPatient ? <LaboratoriosInmunizaciones patient={selectedPatient} onSave={updatePatient} /> : <NoPatientSelected />;
      case 'Staff Médico':
        return <StaffMedico staff={staff} addStaffMember={addStaffMember} />;
      case 'Estadísticas':
        return <Estadisticas patients={patients} />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col">
      {isLoggedIn ? (
        <>
          <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
          <main className="flex-grow p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>
        </>
      ) : (
        <main className="flex-grow flex items-center justify-center p-4">
          <Login onLoginSuccess={handleLoginSuccess} />
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