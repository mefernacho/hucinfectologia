import React, { useState } from 'react';
import { Patient, HistoriaClinicaSucesiva, TriageData, FactoresRiesgoData, FichaInicioTratamientoData } from '../types';
import CoInfeccionView from './CoInfeccionView';
import { DownloadIcon } from './icons/DownloadIcon';

const Section = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode, defaultOpen?: boolean }) => (
    <details className="border rounded-lg" open={defaultOpen}>
        <summary className="p-4 cursor-pointer font-bold text-lg text-brand-blue bg-slate-50 hover:bg-slate-100 rounded-t-lg">
            {title}
        </summary>
        <div className="p-4 border-t">
            {children}
        </div>
    </details>
);

const DataPair = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-brand-gray text-md">{value || 'No registrado'}</p>
    </div>
);

const TriageView = ({ triage }: { triage: TriageData }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-md border">
        <DataPair label="PA" value={triage.pa} />
        <DataPair label="Talla" value={`${triage.talla} m`} />
        <DataPair label="Peso" value={`${triage.peso} kg`} />
        <DataPair label="IMC" value={triage.imc} />
        <DataPair label="Temp." value={`${triage.temperatura} °C`} />
        <DataPair label="SpO2" value={`${triage.spo2} %`} />
        <DataPair label="FC" value={`${triage.fc} lpm`} />
        <DataPair label="FR" value={`${triage.fr} rpm`} />
    </div>
);

const FactoresRiesgoView = ({ factores, otros }: { factores: FactoresRiesgoData, otros: string }) => {
    const activos = Object.entries(factores)
        .filter(([, value]) => value)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    return (
        <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Factores de Riesgo Cardiovascular</h4>
            {activos.length > 0 ? (
                 <p className="text-brand-gray text-md">{activos.join(', ')}</p>
            ) : (
                <p className="text-slate-500 text-md">No se registraron factores de riesgo.</p>
            )}
            {otros && <DataPair label="Otros Factores" value={otros}/>}
        </div>
    )
}


export default function Registro({ patients }: { patients: Patient[] }) {
    const [searchId, setSearchId] = useState('');
    const [foundPatient, setFoundPatient] = useState<Patient | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const patient = patients.find(p => p.id.trim().toLowerCase() === searchId.trim().toLowerCase());
        setFoundPatient(patient || null);
        if (!patient) {
            alert('Paciente no encontrado.');
        }
    };
    
    const handleDownloadHistory = (patient: Patient) => {
        const formatDate = (dateStr: string | Date | undefined) => {
            if (!dateStr) return 'N/A';
            return new Date(dateStr).toLocaleString('es-VE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        };
        const justDate = (dateStr: string | Date | undefined) => {
            if (!dateStr) return 'N/A';
            return new Date(dateStr).toLocaleDateString('es-VE');
        }

        const textValue = (text: string | number | undefined | null) => {
            if (text === null || text === undefined || text === '') {
                return 'No registrado';
            }
            return String(text);
        };

        const dataRow = (label: string, value: any) => `
            <div class="data-pair"><span class="data-label">${label}:</span> <span class="data-value">${textValue(value)}</span></div>`;

        const textAreaRow = (label: string, value: string | undefined) => `
            <div class="data-pair-full"><span class="data-label">${label}:</span><p class="data-text">${textValue(value).replace(/\n/g, '<br>')}</p></div>`;

        const patientInfo = `
            <div class="section">
                <h2>Información del Paciente</h2>
                <div class="data-grid">
                    ${dataRow('Nombres', patient.nombres)}
                    ${dataRow('Apellidos', patient.apellidos)}
                    ${dataRow('C.I.', patient.id)}
                    ${dataRow('Edad', `${patient.edad} años`)}
                    ${dataRow('Sexo', patient.sexo)}
                    ${dataRow('Fecha de Nacimiento', justDate(patient.fechaNacimiento))}
                    <div class="data-pair-full"><span class="data-label">Dirección:</span> <span class="data-value">${textValue(patient.direccion)}</span></div>
                </div>
            </div>`;

        const historiaPrimera = `
            <div class="section">
                <h2>Historia Clínica de Primera Vez</h2>
                <div class="data-grid">
                    ${textAreaRow('Enfermedad Actual', patient.historiaClinicaPrimera.enfermedadActual)}
                    ${textAreaRow('Antecedentes Personales', patient.historiaClinicaPrimera.antecedentesPersonales)}
                    ${textAreaRow('Antecedentes Familiares', patient.historiaClinicaPrimera.antecedentesFamiliares)}
                    ${textAreaRow('Antecedentes Quirúrgicos', patient.historiaClinicaPrimera.antecedentesQuirurgicos)}
                    ${textAreaRow('Antecedentes Alérgicos', patient.historiaClinicaPrimera.antecedentesAlergicos)}
                    ${textAreaRow('Examen Físico', patient.historiaClinicaPrimera.examenFisico)}
                </div>
                <h3>Factores de Riesgo</h3>
                <p>${Object.entries(patient.historiaClinicaPrimera.factoresRiesgo).filter(([,v])=>v).map(([k])=>k).join(', ') || 'Ninguno'}</p>
                <h3>Co-infecciones</h3>
                <p>${Object.entries(patient.historiaClinicaPrimera.coInfeccion).filter(([,v])=>v && (typeof v !== 'object' || v.agshb === 'si' || v.aghbc === 'si')).map(([k,v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(', ') || 'Ninguna'}</p>
            </div>`;

        const historiasSucesivas = `
            <div class="section">
                <h2>Historias Clínicas Sucesivas</h2>
                ${patient.historiasClinicasSucesivas.map(h => `
                    <div class="sucesiva-entry">
                        <h3>Fecha: ${formatDate(h.fecha)}</h3>
                        <div class="data-grid">
                            ${dataRow('PA', h.triage.pa)}
                            ${dataRow('Peso', `${h.triage.peso} kg`)}
                            ${dataRow('Talla', `${h.triage.talla} m`)}
                            ${dataRow('IMC', h.triage.imc)}
                            ${dataRow('Temp', `${h.triage.temperatura} °C`)}
                            ${dataRow('SpO2', `${h.triage.spo2} %`)}
                            ${dataRow('FC', `${h.triage.fc} lpm`)}
                            ${dataRow('FR', `${h.triage.fr} rpm`)}
                        </div>
                        ${textAreaRow('Evolución', h.evolucion)}
                        ${textAreaRow('Examen Físico', h.examenFisico)}
                        ${textAreaRow('Plan', h.plan)}
                    </div>
                `).join('') || '<p>No hay registros.</p>'}
            </div>`;
            
        const laboratorios = `
            <div class="section">
                <h2>Laboratorios e Inmunizaciones</h2>
                <h3>Marcadores Virales e Inmunológicos</h3>
                <div class="data-grid">${dataRow('Carga Viral', patient.estudios.cargaViral)} ${dataRow('Contaje CD4', patient.estudios.contajeCD4)}</div>
                <h3>Serologías</h3>
                <div class="data-grid">${dataRow('Hepatitis B', patient.estudios.hepatitisB)} ${dataRow('Hepatitis C', patient.estudios.hepatitisC)} ${dataRow('VDRL', patient.estudios.vdrl)} ${dataRow('Hepatitis A', patient.estudios.hepatitisA)}</div>
                <h3>Inmunizaciones</h3>
                <table>
                    <thead><tr><th>Vacuna</th><th>Aplicada</th><th>Fecha</th></tr></thead>
                    <tbody>
                        ${Object.entries(patient.estudios.inmunizaciones).map(([key, value]) => `
                            <tr><td>${key}</td><td>${value.aplicada}</td><td>${value.aplicada === 'si' ? justDate(value.fecha) : 'N/A'}</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        const fichaTratamiento = (ficha: FichaInicioTratamientoData | null) => {
            if (!ficha) return '<div class="section"><h2>Ficha de Inicio de Tratamiento</h2><p>No registrada.</p></div>';
            return `
                <div class="section">
                    <h2>Ficha de Inicio de Tratamiento</h2>
                    <div class="data-grid">
                        ${dataRow('Fecha de Elaboración', justDate(ficha.fechaElaboracion))}
                        ${dataRow('Médico Tratante', ficha.medicoTratante)}
                        ${dataRow('Tipo de Tratamiento', ficha.tipoTratamiento)}
                        ${textAreaRow('Justificación', ficha.justificacion)}
                    </div>
                </div>
            `;
        }

        const cambiosTAR = `
            <div class="section">
                <h2>Historial de Cambios de TAR</h2>
                ${patient.tarChanges.map(c => `
                    <div class="sucesiva-entry">
                        <h3>Fecha: ${formatDate(c.fecha)}</h3>
                        ${dataRow('Nuevo Esquema', c.esquema)}
                        ${textAreaRow('Notas', c.notas)}
                    </div>
                `).join('') || '<p>No hay registros.</p>'}
            </div>
        `;

        const htmlContent = `
            <html>
            <head>
                <title>Historial Clínico - ${patient.nombres} ${patient.apellidos}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    h1, h2, h3 { color: #2E5A88; } h1 { font-size: 24px; text-align: center; border-bottom: 2px solid #2E5A88; padding-bottom: 10px; margin-bottom: 20px; }
                    h2 { font-size: 20px; margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; } h3 { font-size: 16px; margin-top: 15px; color: #4A4A4A;}
                    .section { margin-bottom: 20px; page-break-inside: avoid; }
                    .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .data-pair { margin-bottom: 5px; } .data-pair-full { grid-column: 1 / -1; }
                    .data-label { font-weight: bold; } .data-value { } 
                    .data-text { background-color: #f9f9f9; border: 1px solid #eee; padding: 8px; border-radius: 4px; margin-top: 4px; white-space: pre-wrap; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; } .sucesiva-entry { border: 1px solid #ccc; padding: 15px; margin-top: 15px; border-radius: 5px; page-break-inside: avoid; background-color: #fafafa; }
                </style>
            </head>
            <body>
                <h1>Historial Clínico del Paciente</h1>
                ${patientInfo}
                ${historiaPrimera}
                ${historiasSucesivas}
                ${laboratorios}
                ${fichaTratamiento(patient.fichaInicioTratamiento)}
                ${cambiosTAR}
            </body>
            </html>`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };
    
    const formatDate = (dateString: string | Date) => new Date(dateString).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-blue mb-4">Registro Histórico de Pacientes</h2>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Buscar por Cédula de Identidad..."
                        className="w-full p-2 border rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                        aria-label="Cédula de Identidad del Paciente"
                    />
                    <button type="submit" className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition whitespace-nowrap">
                        Buscar Paciente
                    </button>
                </form>
            </div>

            {foundPatient && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-fade-in">
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-blue">{foundPatient.nombres} {foundPatient.apellidos}</h2>
                            <p className="text-slate-500">C.I: {foundPatient.id}</p>
                        </div>
                        <button
                            onClick={() => handleDownloadHistory(foundPatient)}
                            className="flex items-center px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition whitespace-nowrap"
                            title="Descargar Historial Completo del Paciente"
                        >
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Descargar Historial
                        </button>
                    </header>
                    
                    <Section title="Información General y Triaje Inicial">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 mb-4">
                           <DataPair label="Edad" value={`${foundPatient.edad} años`} />
                           <DataPair label="Sexo" value={foundPatient.sexo} />
                           <DataPair label="Fecha de Nacimiento" value={formatDate(foundPatient.fechaNacimiento)} />
                           <DataPair label="Dirección" value={foundPatient.direccion} />
                           <DataPair label="Motivo de Consulta" value={foundPatient.motivoConsulta} />
                           <DataPair label="Tipo de Consulta" value={foundPatient.tipoConsulta} />
                           <DataPair label="Fecha de Ingreso" value={formatDate(foundPatient.consultationDate)} />
                           <DataPair label="Hora de Ingreso" value={foundPatient.consultationTime} />
                        </div>
                        <TriageView triage={foundPatient.triage} />
                    </Section>
                    
                    <Section title="Historia Clínica de Primera Vez">
                        <div className="space-y-3">
                            <DataPair label="Enfermedad Actual" value={foundPatient.historiaClinicaPrimera.enfermedadActual} />
                            <DataPair label="Antecedentes Personales" value={foundPatient.historiaClinicaPrimera.antecedentesPersonales} />
                            <DataPair label="Antecedentes Familiares" value={foundPatient.historiaClinicaPrimera.antecedentesFamiliares} />
                            <DataPair label="Antecedentes Quirúrgicos" value={foundPatient.historiaClinicaPrimera.antecedentesQuirurgicos} />
                            <DataPair label="Antecedentes Alérgicos" value={foundPatient.historiaClinicaPrimera.antecedentesAlergicos} />
                            <FactoresRiesgoView factores={foundPatient.historiaClinicaPrimera.factoresRiesgo} otros={foundPatient.historiaClinicaPrimera.otrosFactores} />
                            <DataPair label="Examen Físico" value={foundPatient.historiaClinicaPrimera.examenFisico} />
                            <CoInfeccionView coInfeccionData={foundPatient.historiaClinicaPrimera.coInfeccion} />
                        </div>
                    </Section>
                    
                    <Section title={`Historias Clínicas Sucesivas (${foundPatient.historiasClinicasSucesivas.length})`} defaultOpen={false}>
                        {foundPatient.historiasClinicasSucesivas.length > 0 ? (
                            <div className="space-y-4">
                                {foundPatient.historiasClinicasSucesivas.map((historia, index) => (
                                    <div key={index} className="border p-4 rounded-lg bg-slate-50">
                                        <p className="font-bold text-brand-gray mb-2">Fecha: {new Date(historia.fecha).toLocaleString('es-VE')}</p>
                                        <div className="mb-3">
                                            <p className="font-semibold text-sm text-slate-600">Signos Vitales:</p>
                                            <TriageView triage={historia.triage}/>
                                        </div>
                                        <DataPair label="Evolución" value={historia.evolucion} />
                                        <DataPair label="Examen Físico" value={historia.examenFisico} />
                                        <DataPair label="Plan" value={historia.plan} />
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-slate-500">No hay registros de historias sucesivas.</p>}
                    </Section>

                    {foundPatient.fichaInicioTratamiento && (
                        <Section title="Ficha de Inicio de Tratamiento" defaultOpen={false}>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DataPair label="Entidad Federal" value={foundPatient.fichaInicioTratamiento.entidadFederal} />
                                <DataPair label="Centro Asistencial" value={foundPatient.fichaInicioTratamiento.centroAsistencial} />
                                <DataPair label="Fecha de Elaboración" value={formatDate(foundPatient.fichaInicioTratamiento.fechaElaboracion)} />
                                <DataPair label="Médico Tratante" value={foundPatient.fichaInicioTratamiento.medicoTratante} />
                                <DataPair label="Justificación" value={foundPatient.fichaInicioTratamiento.justificacion} />
                            </div>
                        </Section>
                    )}

                    {foundPatient.embarazadaData && (
                        <Section title="Datos de Embarazo" defaultOpen={false}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DataPair label="FUM" value={formatDate(foundPatient.embarazadaData.fum)} />
                                <DataPair label="Fecha Diag. VIH" value={formatDate(foundPatient.embarazadaData.fechaDiagnosticoVIH)} />
                                <DataPair label="Antecedentes Obstétricos" value={foundPatient.embarazadaData.antecedentesObstetricos} />
                                <DataPair label="Hemoglobina" value={`${foundPatient.embarazadaData.hemoglobina} g/dL`} />
                                <DataPair label="Carga Viral" value={`${foundPatient.embarazadaData.cargaViral} copias/mL`} />
                                <DataPair label="Contaje CD4" value={`${foundPatient.embarazadaData.contajeCD4} células/mm³`} />
                            </div>
                        </Section>
                    )}

                </div>
            )}
        </div>
    );
}