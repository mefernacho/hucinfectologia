export interface TriageData {
  pa: string;
  talla: number;
  peso: number;
  imc: number;
  temperatura: number;
  spo2: number;
  fc: number;
  fr: number;
}

export interface HepatitisBData {
    agshb: 'si' | 'no';
    aghbc: 'si' | 'no';
}

export interface CoInfeccionData {
  tb: string;
  hepatitisB: HepatitisBData;
  hepatitisC: string;
  toxoplasmosis: string;
  criptococoxis: string;
  histoplasmosis: string;
  candida: string;
  neurosifilis: 'si' | 'no';
  paracoccidiomicosis: string;
  cmv: string;
  ebv: string;
}

export type NeoplasiaType = 'ninguna' | 'linfoma-no-hodking' | 'ca-recto' | 'sarcoma-kaposi' | 'otro';
export type CARectoClasificacion = 'no-aplica' | 'estadio-I' | 'estadio-II' | 'estadio-III' | 'estadio-IV';

export interface NeoplasiaData {
  tipo: NeoplasiaType;
  clasificacionCARecto: CARectoClasificacion;
  otroDetalle: string;
}

export interface FactoresRiesgoData {
    tabaco: boolean;
    alcohol: boolean;
    dislipidemia: boolean;
    usoDrogas: boolean;
    hta: boolean;
    dm: boolean;
}

export interface HistoriaClinicaPrimera {
  enfermedadActual: string;
  antecedentesPersonales: string;
  antecedentesFamiliares: string;
  antecedentesQuirurgicos: string;
  antecedentesAlergicos: string;
  factoresRiesgo: FactoresRiesgoData;
  otrosFactores: string;
  examenFisico: string;
  coInfeccion: CoInfeccionData;
  neoplasia: NeoplasiaData;
  residente?: string;
  medicoEvaluadorId?: string;
}

export interface HistoriaClinicaSucesiva {
    id: string;
    fecha: string;
    triage: TriageData;
    evolucion: string;
    examenFisico: string;
    plan: string;
    residente?: string;
    medicoEvaluadorId?: string;
}

export interface TratamientoNota {
    id: string;
    fecha: string;
    contenido: string;
}

export type TARSchemes = 'KOCITAF' | 'DLT+3TC' | 'Kivexa/DLT' | 'TLD';

export interface TARChange {
    id: string;
    fecha: string;
    esquema: TARSchemes;
    notas: string;
}

export interface Inmunizacion {
    aplicada: 'si' | 'no';
    fecha?: string;
}

export interface InmunizacionesData {
    neumococo: Inmunizacion;
    trivalente: Inmunizacion;
    pentavalente: Inmunizacion;
    sarsCov2: Inmunizacion;
    hepatitisA: Inmunizacion;
    influenza: Inmunizacion;
    toxoide: Inmunizacion;
}

export interface EstudiosData {
  cargaViral?: number;
  contajeCD4?: number;
  hepatitisB: 'positivo' | 'negativo' | 'no-realizado';
  hepatitisC: 'positivo' | 'negativo' | 'no-realizado';
  vdrl: 'reactivo' | 'no-reactivo' | 'no-realizado';
  citologiaAnal: string;
  trigliceridos?: number;
  colesterolTotal?: number;
  colesterolHDL?: number;
  colesterolLDL?: number;
  urea?: number;
  creatinina?: number;
  densitometria: 'normal' | 'osteopenia' | 'osteoporosis' | 'no-realizado';
  hepatitisA: 'reactivo' | 'no-reactivo' | 'no-realizado';
  inmunizaciones: InmunizacionesData;
}

export interface EmbarazadaData {
    fum: string;
    antecedentesObstetricos: string;
    fechaDiagnosticoVIH: string;
    hemoglobina?: number;
    cargaViral?: number;
    contajeCD4?: number;
    hepatitisB: 'positivo' | 'negativo' | 'no-realizado';
    hepatitisC: 'positivo' | 'negativo' | 'no-realizado';
}

export const ITRN_MEDS = ['abacavir', 'zidovudina', 'lamivudina', 'zidovudinaLamivudina', 'zidovudina3tcAbc', 'abacavirLamivudina', 'didanosina', 'stavudina', 'tenofovir'] as const;
export const ITRNN_MEDS = ['efavirenz', 'nevirapina', 'etravirina'] as const;
export const INH_FUSION_MEDS = ['enfuvirtide'] as const;
export const INH_INTEGRASA_MEDS = ['raltegravir'] as const;
export const IP_MEDS = ['saquinavir', 'lopinavirRtv', 'atazanavir', 'fosamprenavir', 'ritonavir', 'darunavir'] as const;
export const ESQUEMAS_COMBINADOS_MEDS = ['kocitaf', 'dlt3tc', 'kivexaDlt', 'tld'] as const;


type MedRecord = { selected: boolean; dosis: string };

export interface FichaInicioTratamientoData {
  id: string;
  entidadFederal: string;
  centroAsistencial: string;
  nacionalidad: 'V' | 'E' | 'I' | '';
  factoresRiesgo: FactoresRiesgoData;
  antecedentesFamiliares: string;
  otrosFactores: string;
  estadoClinico: {
    asintomatico: boolean;
    sintomaticoB: boolean;
    enfermedadB: boolean;
    sintomaticoC: boolean;
    enfermedadC: boolean;
    historiaTB: boolean;
    tipoTB: 'P' | 'EP' | '';
  };
  embarazo: {
    si: boolean;
    num: boolean;
    actualmente: boolean;
    semanaGestacional: boolean;
  };
  clasificacionClinica: string;
  anoDiagnosticoVIH: string;
  cd4Actual: string;
  cargaViralActual: string;
  tipoTratamiento: 'inicio' | 'cambio' | '';
  medicamentosARV: {
    ITRN: Record<typeof ITRN_MEDS[number], MedRecord>;
    ITRNN: Record<typeof ITRNN_MEDS[number], MedRecord>;
    IP: Record<typeof IP_MEDS[number], MedRecord>;
    InhFusion: Record<typeof INH_FUSION_MEDS[number], MedRecord>;
    InhIntegrasa: Record<typeof INH_INTEGRASA_MEDS[number], MedRecord>;
    EsquemasCombinados: Record<typeof ESQUEMAS_COMBINADOS_MEDS[number], MedRecord>;
  };
  otrasTerapias: {
    tmsSms: boolean;
    isoniazida: boolean;
    terapiaAntiTB: boolean;
    tiempoTerapiaAntiTB: string;
    otrasProfilaxis: string;
  };
  razonCambio: {
    criterioInmunologico: boolean;
    criterioClinico: boolean;
    criterioVirologico: boolean;
    toxicidadMedicamentosa: boolean;
    intoleranciaSevera: boolean;
    desabastecimientoARV: boolean;
    interaccionesMedicamentosas: boolean;
  };
  contajeCD4: {
    previo: { valor: string; fecha: string };
    actual: { valor: string; fecha: string };
  };
  cargaViral: {
    previa1: { valor: string; fecha: string };
    previa2: { valor: string; fecha: string };
    actual: { valor: string; fecha: string };
  };
  esquemaActual: string;
  justificacion: string;
  fechaElaboracion: string;
  medicoTratante: string;
  sello: string;
  coordinadorRegional: string;
}


export interface Patient {
  id: string; // Cedula
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: 'Masculino' | 'Femenino';
  fechaNacimiento: string;
  direccion: string;
  motivoConsulta: string;
  tipoConsulta: 'Primera consulta' | 'Sucesivo';
  
  consultationDate: Date;
  consultationTime: string;
  location: string;
  
  triage: TriageData;
  historiaClinicaPrimera: HistoriaClinicaPrimera;
  historiasClinicasSucesivas: HistoriaClinicaSucesiva[];
  
  tratamientoNotas: TratamientoNota[];
  tarChanges: TARChange[];
  embarazadaData: EmbarazadaData | null;
  fichaInicioTratamiento: FichaInicioTratamientoData | null;
  
  estudios: EstudiosData;
}

export interface StaffMember {
  id: string;
  nombre: string;
  especialidad: string;
}

// FIX: Add ChatMessage type for the Chat component.
export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export type Tab = 'Inicio' | 'Registro' | 'Triaje' | 'Historia Clinica de Primera' | 'Historia Clinica Sucesiva' | 'Inicio de tratamiento' | 'Cambio de TAR' | 'Embarazadas' | 'Laboratorios e Inmunizaciones' | 'Staff Médico' | 'Estadísticas';