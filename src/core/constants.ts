import { StaffMember, Tab } from './types';

export const TABS: Tab[] = [
    'Inicio',
    'Registro', 
    'Triaje', 
    'Historia Clinica de Primera', 
    'Historia Clinica Sucesiva', 
    'Inicio de tratamiento',
    'Cambio de TAR',
    'Embarazadas',
    'Laboratorios e Inmunizaciones', 
    'Staff Médico', 
    'Estadísticas',
    'Chat',
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: '1', nombre: 'Dra. María Alvarado Bruzual', especialidad: 'Médico Internista / Infectólogo' },
  { id: '2', nombre: 'Dra. María Eugenia Landaeta', especialidad: 'Médico Infectólogo' },
  { id: '3', nombre: 'Dr. Napoleón Guevara', especialidad: 'Médico Internista- Infectólogo' },
  { id: '4', nombre: 'Dra. Carolyn Redondo', especialidad: 'Médico Internista- Infectologo' },
  { id: '5', nombre: 'Dr. Martín Carballo', especialidad: 'Médico Internista- Infectólogo' },
  { id: '6', nombre: 'Dr. Luis Solano', especialidad: 'Médico Internista- Infectólogo' },
  { id: '7', nombre: 'Dr. David Flora', especialidad: 'Médico Internista- Infectólogo' },
  { id: '8', nombre: 'Dra. María Molina', especialidad: 'Médico Internista- Infectólogo' },
  { id: '9', nombre: 'Dr. David Forero', especialidad: 'Médico Internista- Infectólogo' },
  { id: '10', nombre: 'Dr. Víctor Mendoza', especialidad: 'Médico Internista- Infectólogo' },
  { id: '11', nombre: 'Dra. Jocays Caldera', especialidad: 'Médico Internista- Infectólogo' },
];