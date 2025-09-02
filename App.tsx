
import React, { useState, useCallback, useEffect } from 'react';
import { Tab, Patient, StaffMember } from './core/types';
import { TABS, INITIAL_STAFF } from './core/constants';
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
import ChatComponent from './components/Chat';
import { PlusIcon } from './components/icons/PlusIcon';
import { auth, db } from './firebase';
import AuthApiErrorScreen from './components/AuthApiErrorScreen';
import FirestoreErrorScreen from './components/FirestoreErrorScreen';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [setupError, setSetupError] = useState<'auth' | 'firestore' | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Inicio');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setActiveTab('Registro');
      } else {
        setActiveTab('Inicio');
        setPatients([]);
        setStaff([]);
        setSelectedPatientId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAllData = async () => {
        setIsLoading(true);
        try {
          const patientsCollectionRef = db.collection("patients");
          const patientsSnapshot = await patientsCollectionRef.get();
          const patientsList = patientsSnapshot.docs.map(doc => doc.data() as Patient);
          setPatients(patientsList);

          const staffCollectionRef = db.collection("staff");
          const staffSnapshot = await staffCollectionRef.get();
          if (staffSnapshot.empty) {
            const batch = db.batch();
            INITIAL_STAFF.forEach(member => {
              const docRef = db.collection("staff").doc(member.id);
              batch.set(docRef, member);
            });
            await batch.commit();
            setStaff(INITIAL_STAFF);
          } else {
            const staffList = staffSnapshot.docs.map(doc => doc.data() as StaffMember);
            setStaff(staffList);
          }
          setSetupError(null); // Conexión exitosa
        } catch (error: any) {
          console.error("Firebase connection error during initial data load: ", error);
          // Cualquier error durante la carga inicial de datos se considera un problema de configuración de Firestore.
          // Los errores de autenticación se detectan por separado en el componente de Login.
          setSetupError('firestore');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllData();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Error al cerrar sesión.");
    }
  };

  const addPatient = useCallback(async (patient: Patient) => {
    try {
      await db.collection("patients").doc(patient.id).set(patient);
      setPatients(prev => [...prev, patient]);
      setSelectedPatientId(patient.id);
    } catch (error) {
      console.error("Error adding patient: ", error);
      alert("Error al agregar el paciente a la base de datos.");
      throw error;
    }
  }, []);
  
  // Actualiza un paciente existente en Firestore.
  // El uso de { merge: true } es crucial aquí. Asegura que solo los campos
  // proporcionados en `updatedPatient` se modifiquen en la base de datos,
  // fusionando los datos en lugar de sobrescribir el documento completo.
  // Esto previene la pérdida de datos si diferentes partes de la aplicación
  // actualizan distintas secciones del historial del paciente.
  const updatePatient = useCallback(async (updatedPatient: Patient) => {
    try {
      await db.collection("patients").doc(updatedPatient.id).set(updatedPatient, { merge: true });
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    } catch (error) {
      console.error("Error updating patient: ", error);
      alert("Error al actualizar el paciente en la base de datos.");
      throw error;
    }
  }, []);

  const addStaffMember = useCallback(async (staffMember: StaffMember) => {
    try {
      await db.collection("staff").doc(staffMember.id).set(staffMember);
      setStaff(prev => [...prev, staffMember]);
    } catch (error) {
      console.error("Error adding staff member: ", error);
      alert("Error al agregar al miembro del personal.");
      throw error;
    }
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
      case 'Chat': return <ChatComponent />;
      case 'Staff Médico': return <StaffMedico staff={staff} addStaffMember={addStaffMember} />;
      case 'Estadísticas': return <Estadisticas patients={patients} />;
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

  if (setupError === 'firestore') {
      return <FirestoreErrorScreen />;
  }
  if (setupError === 'auth') {
      return <AuthApiErrorScreen />;
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
          <Login setSetupError={setSetupError} />
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
