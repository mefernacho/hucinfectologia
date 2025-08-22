import React, { useState, useEffect } from 'react';
import { Patient, FichaInicioTratamientoData, ITRN_MEDS, ITRNN_MEDS, IP_MEDS, INH_FUSION_MEDS, INH_INTEGRASA_MEDS, ESQUEMAS_COMBINADOS_MEDS, StaffMember } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface InicioTratamientoProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => void;
  staff: StaffMember[];
}

const buildInitialMeds = (meds: readonly string[]) => {
    return meds.reduce((acc, med) => {
        acc[med] = { selected: false, dosis: '' };
        return acc;
    }, {} as Record<string, { selected: boolean; dosis: string }>);
};

const initialFichaState: FichaInicioTratamientoData = {
    id: '',
    entidadFederal: '',
    centroAsistencial: '',
    nacionalidad: '',
    factoresRiesgo: { tabaco: false, alcohol: false, dislipidemia: false, usoDrogas: false, hta: false, dm: false },
    antecedentesFamiliares: '',
    otrosFactores: '',
    estadoClinico: { asintomatico: false, sintomaticoB: false, enfermedadB: false, sintomaticoC: false, enfermedadC: false, historiaTB: false, tipoTB: '' },
    embarazo: { si: false, num: false, actualmente: false, semanaGestacional: false },
    clasificacionClinica: '',
    anoDiagnosticoVIH: '',
    cd4Actual: '',
    cargaViralActual: '',
    tipoTratamiento: '',
    medicamentosARV: {
        ITRN: buildInitialMeds(ITRN_MEDS),
        ITRNN: buildInitialMeds(ITRNN_MEDS),
        IP: buildInitialMeds(IP_MEDS),
        InhFusion: buildInitialMeds(INH_FUSION_MEDS),
        InhIntegrasa: buildInitialMeds(INH_INTEGRASA_MEDS),
        EsquemasCombinados: buildInitialMeds(ESQUEMAS_COMBINADOS_MEDS),
    },
    otrasTerapias: { tmsSms: false, isoniazida: false, terapiaAntiTB: false, tiempoTerapiaAntiTB: '', otrasProfilaxis: '' },
    razonCambio: { criterioInmunologico: false, criterioClinico: false, criterioVirologico: false, toxicidadMedicamentosa: false, intoleranciaSevera: false, desabastecimientoARV: false, interaccionesMedicamentosas: false },
    contajeCD4: { previo: { valor: '', fecha: '' }, actual: { valor: '', fecha: '' } },
    cargaViral: { previa1: { valor: '', fecha: '' }, previa2: { valor: '', fecha: '' }, actual: { valor: '', fecha: '' } },
    esquemaActual: '',
    justificacion: '',
    fechaElaboracion: new Date().toISOString().split('T')[0],
    medicoTratante: '',
    sello: '',
    coordinadorRegional: '',
};

const MED_LABELS = {
    ITRN: { abacavir: 'Abacavir (ABC)', zidovudina: 'Zidovudina (AZT)', lamivudina: 'Lamivudina (3TC)', zidovudinaLamivudina: 'Zidovudina/Lamivudina', zidovudina3tcAbc: 'Zidovudina/3TC/ABC', abacavirLamivudina: 'Abacavir/Lamivudina', didanosina: 'Didanosina (DDI)', stavudina: 'Stavudina (D4T)', tenofovir: 'Tenofovir (TDF)' },
    ITRNN: { efavirenz: 'Efavirenz (EFV)', nevirapina: 'Nevirapina (NVP)', etravirina: 'Etravirina* (ETRV)' },
    InhFusion: { enfuvirtide: 'Enfuvirtide*(T20)' },
    InhIntegrasa: { raltegravir: 'Raltegravir*(RALT)' },
    IP: { saquinavir: 'Saquinavir (SQV)', lopinavirRtv: 'Lopinavir/Rtv (LPV/r)', atazanavir: 'Atazanavir(ATV)', fosamprenavir: 'Fosamprenavir (FPV)', ritonavir: 'Ritonavir (RTV)', darunavir: 'Darunavir* (DRV)' },
    EsquemasCombinados: { kocitaf: 'Kocitaf', dlt3tc: 'DLT+3TC', kivexaDlt: 'Kivexa+DLT', tld: 'TLD' }
};

export default function InicioTratamiento({ patient, onSave, staff }: InicioTratamientoProps) {
  const [formData, setFormData] = useState<FichaInicioTratamientoData>(patient.fichaInicioTratamiento || initialFichaState);

  useEffect(() => {
    const initialData = patient.fichaInicioTratamiento || { ...initialFichaState, id: new Date().toISOString() };
    initialData.antecedentesFamiliares = patient.historiaClinicaPrimera.antecedentesFamiliares || initialData.antecedentesFamiliares;
    initialData.factoresRiesgo = patient.historiaClinicaPrimera.factoresRiesgo || initialData.factoresRiesgo;
    initialData.otrosFactores = patient.historiaClinicaPrimera.otrosFactores || initialData.otrosFactores;
    setFormData(initialData);
  }, [patient]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: keyof FichaInicioTratamientoData, field: string, value: any) => {
    setFormData(prev => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
  };

  const handleCheckboxChange = (section: keyof FichaInicioTratamientoData, field: string) => {
    setFormData(prev => ({ ...prev, [section]: { ...(prev[section] as any), [field]: !(prev[section] as any)[field] } }));
  };
  
  const handleMedChange = (type: keyof FichaInicioTratamientoData['medicamentosARV'], med: string, field: 'selected' | 'dosis', value: any) => {
    setFormData(prev => ({
        ...prev,
        medicamentosARV: {
            ...prev.medicamentosARV,
            [type]: {
                ...prev.medicamentosARV[type],
                [med]: {
                    ...prev.medicamentosARV[type][med],
                    [field]: value
                }
            }
        }
    }))
  }

  const handleSave = () => {
    const updatedPatient = { ...patient, fichaInicioTratamiento: formData };
    onSave(updatedPatient);
    alert('Ficha de inicio de tratamiento guardada con éxito.');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('ficha-to-print');
    if (!printContent) return;

    const title = `Ficha_Tratamiento_${patient.nombres}_${patient.apellidos}`;
    
    // Clone the content to avoid modifying the live DOM
    const contentClone = printContent.cloneNode(true) as HTMLElement;

    // Manually sync the current values of form elements to the clone
    const originalElements = printContent.querySelectorAll('input, select, textarea');
    const clonedElements = contentClone.querySelectorAll('input, select, textarea');

    originalElements.forEach((originalEl, index) => {
      const clonedEl = clonedElements[index];

      if (originalEl instanceof HTMLInputElement && clonedEl instanceof HTMLInputElement) {
        if (originalEl.type === 'checkbox' || originalEl.type === 'radio') {
          clonedEl.checked = originalEl.checked;
        } else {
          // For text inputs, set both property and attribute
          clonedEl.value = originalEl.value;
          clonedEl.setAttribute('value', originalEl.value);
        }
      } else if (originalEl instanceof HTMLTextAreaElement && clonedEl instanceof HTMLTextAreaElement) {
        clonedEl.value = originalEl.value;
        clonedEl.textContent = originalEl.value;
      } else if (originalEl instanceof HTMLSelectElement && clonedEl instanceof HTMLSelectElement) {
        clonedEl.value = originalEl.value;
        // This makes sure the selected option is reflected in the printed HTML
        Array.from(clonedEl.options).forEach(opt => {
          if (opt.value === originalEl.value) {
            opt.setAttribute('selected', 'true');
          } else {
            opt.removeAttribute('selected');
          }
        });
      }
    });

    const html = `
      <html>
        <head>
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'brand-blue': '#2E5A88',
                    'brand-gray': '#4A4A4A',
                  },
                },
              },
            }
          </script>
          <style>
            body { font-family: Arial, sans-serif; }
            @page { size: A4; margin: 10mm; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .overflow-x-auto { overflow-x: visible !important; }
            }
          </style>
        </head>
        <body class="bg-white">
          ${contentClone.outerHTML}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      // Give the browser and Tailwind a moment to render before printing
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

  const renderMedCell = (type, medKey, label) => {
      if (!medKey) return <><td className="border px-2 py-1"></td><td className="border px-2 py-1"></td></>;
      return <>
          <td className="border px-2 py-1">
              <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked={formData.medicamentosARV[type][medKey].selected} onChange={e => handleMedChange(type, medKey, 'selected', e.target.checked)} />
                  <span>{label}</span>
              </label>
          </td>
          <td className="border px-2 py-1">
              <input type="text" value={formData.medicamentosARV[type][medKey].dosis} onChange={e => handleMedChange(type, medKey, 'dosis', e.target.value)} className="w-full p-1 border rounded text-sm" />
          </td>
      </>
  }
  
  const renderMedicationRow = (index: number) => {
    const itrnMed = ITRN_MEDS[index];
    const itrnnMed = ITRNN_MEDS[index];
    const ipMed = IP_MEDS[index];

    return (
        <tr key={index}>
            {renderMedCell('ITRN', itrnMed, MED_LABELS.ITRN[itrnMed])}
            {renderMedCell('ITRNN', itrnnMed, MED_LABELS.ITRNN[itrnnMed])}
            {renderMedCell('IP', ipMed, MED_LABELS.IP[ipMed])}
        </tr>
    );
  };
  
  const renderSpecialMedRow = (type, medKey, label, colSpanStart) => (
      <tr>
          {[...Array(colSpanStart - 1)].map((_, i) => <td key={i} className="border px-2 py-1"></td>)}
          <td className="border px-2 py-1 font-bold text-sm bg-slate-100" colSpan={6}>{type === 'InhFusion' ? 'Inh Fusión' : 'Inh Integrasa'}</td>
      </tr>
  );

  const maxRows = Math.max(ITRN_MEDS.length, ITRNN_MEDS.length, IP_MEDS.length);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md print-container">
      <div id="ficha-to-print">
        <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-brand-blue">FICHA DE FORMATO UNICO DE SOLICITUD DE INICIO O CAMBIO TRATAMIENTO</h2>
        </div>

        {/* SECTION 1 & 2 */}
        <fieldset className="border rounded-lg p-4 mb-4">
            <legend className="px-2 font-semibold text-brand-gray">SECCIÓN 1 y 2: IDENTIFICACIÓN</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <TextInput label="1. Entidad Federal" value={formData.entidadFederal} onChange={e => handleFieldChange('entidadFederal', e.target.value)} />
                <TextInput label="2. Centro Asistencial" value={formData.centroAsistencial} onChange={e => handleFieldChange('centroAsistencial', e.target.value)} />
                <InfoDisplay label="3. Nombre Completo" value={`${patient.nombres} ${patient.apellidos}`} />
                <div className="border rounded p-2">
                    <label className="block font-medium text-slate-700 text-xs">3.1 Nacionalidad y C.I.</label>
                    <div className="flex items-center space-x-4 mt-1">
                        {['V', 'E', 'I'].map(n => (
                            <label key={n} className="flex items-center space-x-1">
                                <input type="radio" name="nacionalidad" value={n} checked={formData.nacionalidad === n} onChange={e => handleFieldChange('nacionalidad', e.target.value)} />
                                <span>{n}</span>
                            </label>
                        ))}
                    </div>
                    <InfoDisplay label="C.I." value={patient.id} />
                </div>
                <InfoDisplay label="5. Fecha de Nacimiento" value={new Date(patient.fechaNacimiento).toLocaleDateString('es-VE')} />
                <InfoDisplay label="6. Edad" value={`${patient.edad} años`} />
                <InfoDisplay label="7. Sexo" value={patient.sexo} />
            </div>
        </fieldset>

        {/* SECTION 3 */}
        <fieldset className="border rounded-lg p-4 mb-4 text-sm">
            <legend className="px-2 font-semibold text-brand-gray">SECCIÓN 3: ANTECEDENTES CLÍNICOS</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <p className="font-semibold mb-2">8. Factores de riesgo cardiovascular:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.keys(formData.factoresRiesgo).map(key => 
                            <Checkbox key={key} label={key.toUpperCase()} checked={formData.factoresRiesgo[key]} onChange={() => handleCheckboxChange('factoresRiesgo', key)} />
                        )}
                    </div>
                    <TextInputArea label="Antecedentes familiares" value={formData.antecedentesFamiliares} onChange={e => handleFieldChange('antecedentesFamiliares', e.target.value)} />
                    <TextInputArea label="Otros factores (especificar)" value={formData.otrosFactores} onChange={e => handleFieldChange('otrosFactores', e.target.value)} />
                </div>
                 <div>
                    <p className="font-semibold mb-2">(Marcar con X):</p>
                    <div className="space-y-1">
                        <Checkbox label="Asintomático" checked={formData.estadoClinico.asintomatico} onChange={() => handleCheckboxChange('estadoClinico', 'asintomatico')} />
                        <div className="flex items-center space-x-4">
                             <Checkbox label="Sintomático (grupo B)" checked={formData.estadoClinico.sintomaticoB} onChange={() => handleCheckboxChange('estadoClinico', 'sintomaticoB')} />
                             <Checkbox label="Enfermedad B" checked={formData.estadoClinico.enfermedadB} onChange={() => handleCheckboxChange('estadoClinico', 'enfermedadB')} />
                        </div>
                        <div className="flex items-center space-x-4">
                             <Checkbox label="Sintomático (grupo C)" checked={formData.estadoClinico.sintomaticoC} onChange={() => handleCheckboxChange('estadoClinico', 'sintomaticoC')} />
                             <Checkbox label="Enfermedad C" checked={formData.estadoClinico.enfermedadC} onChange={() => handleCheckboxChange('estadoClinico', 'enfermedadC')} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox label="Historia de tuberculosis (TB)" checked={formData.estadoClinico.historiaTB} onChange={() => handleCheckboxChange('estadoClinico', 'historiaTB')} />
                            <label className="flex items-center"><input type="radio" name="tipoTB" value="P" checked={formData.estadoClinico.tipoTB === 'P'} onChange={e => handleNestedChange('estadoClinico', 'tipoTB', e.target.value)} /> P</label>
                            <label className="flex items-center"><input type="radio" name="tipoTB" value="EP" checked={formData.estadoClinico.tipoTB === 'EP'} onChange={e => handleNestedChange('estadoClinico', 'tipoTB', e.target.value)} /> EP</label>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-x-6">
                    <div>
                        <p className="font-semibold mb-2">9. Embarazo:</p>
                        <div className="flex space-x-4">
                            {Object.keys(formData.embarazo).map(key => <Checkbox key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} checked={formData.embarazo[key]} onChange={() => handleCheckboxChange('embarazo', key)} />)}
                        </div>
                    </div>
                    <div>
                         <TextInput label="10. Clasificación clínica:" value={formData.clasificacionClinica} onChange={e => handleFieldChange('clasificacionClinica', e.target.value)} />
                    </div>
                    <TextInput label="Año diagnóstico VIH:" value={formData.anoDiagnosticoVIH} onChange={e => handleFieldChange('anoDiagnosticoVIH', e.target.value)} />
                    <TextInput label="ACTUAL: Contaje de CD4:" value={formData.cd4Actual} onChange={e => handleFieldChange('cd4Actual', e.target.value)} />
                    <TextInput label="Carga viral:" value={formData.cargaViralActual} onChange={e => handleFieldChange('cargaViralActual', e.target.value)} />
                </div>
            </div>
        </fieldset>

        {/* SECTION 4 */}
        <fieldset className="border rounded-lg p-4 mb-4 text-sm">
            <legend className="px-2 font-semibold text-brand-gray">SECCIÓN 4: TRATAMIENTO ARV</legend>
            <div className="flex items-center space-x-4 mb-2">
                <span>Marque con X si es:</span>
                <label className="flex items-center"><input type="radio" name="tipoTratamiento" value="inicio" checked={formData.tipoTratamiento === 'inicio'} onChange={e => handleFieldChange('tipoTratamiento', e.target.value)}/> INICIO</label>
                <label className="flex items-center"><input type="radio" name="tipoTratamiento" value="cambio" checked={formData.tipoTratamiento === 'cambio'} onChange={e => handleFieldChange('tipoTratamiento', e.target.value)}/> CAMBIO</label>
            </div>
            <p className="font-semibold mb-2">11. Medicamentos antirretrovirales:</p>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="border p-1">ITRN</th><th className="border p-1">DOSIS/presentación</th>
                            <th className="border p-1">ITRNN</th><th className="border p-1">DOSIS/presentación</th>
                            <th className="border p-1">IP</th><th className="border p-1">DOSIS/presentación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: maxRows }).map((_, i) => renderMedicationRow(i))}
                        {renderSpecialMedRow('InhFusion', 'enfuvirtide', 'Inh Fusión', 3)}
                        <tr>
                            <td/><td/>
                            {renderMedCell('InhFusion', 'enfuvirtide', MED_LABELS.InhFusion.enfuvirtide)}
                            <td/><td/>
                        </tr>
                        {renderSpecialMedRow('InhIntegrasa', 'raltegravir', 'Inh Integrasa', 3)}
                         <tr>
                            <td/><td/>
                            {renderMedCell('InhIntegrasa', 'raltegravir', MED_LABELS.InhIntegrasa.raltegravir)}
                            <td/><td/>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="overflow-x-auto mt-4">
                 <p className="font-semibold mb-2">Esquemas Combinados:</p>
                 <table className="w-full border-collapse border">
                     <thead>
                        <tr className="bg-slate-100">
                            <th className="border p-1">Esquema</th><th className="border p-1">DOSIS/presentación</th>
                        </tr>
                     </thead>
                     <tbody>
                        {ESQUEMAS_COMBINADOS_MEDS.map(med => (
                            <tr key={med}>
                                {renderMedCell('EsquemasCombinados', med, MED_LABELS.EsquemasCombinados[med])}
                            </tr>
                        ))}
                     </tbody>
                 </table>
            </div>
             <div className="mt-4">
                <p className="font-semibold mb-2">12. Otras (Marcar con X o especificar donde sea apropiado):</p>
                <div className="flex flex-wrap gap-4 items-center">
                    <Checkbox label="TMS/SMS" checked={formData.otrasTerapias.tmsSms} onChange={() => handleCheckboxChange('otrasTerapias', 'tmsSms')} />
                    <Checkbox label="Isoniazida" checked={formData.otrasTerapias.isoniazida} onChange={() => handleCheckboxChange('otrasTerapias', 'isoniazida')} />
                    <Checkbox label="Terapia anti-TB" checked={formData.otrasTerapias.terapiaAntiTB} onChange={() => handleCheckboxChange('otrasTerapias', 'terapiaAntiTB')} />
                    <TextInput label="Tiempo (Meses):" value={formData.otrasTerapias.tiempoTerapiaAntiTB} onChange={e => handleNestedChange('otrasTerapias', 'tiempoTerapiaAntiTB', e.target.value)} />
                </div>
                 <TextInput label="Otras Profilaxis Infecciones oportunistas (IO) (especificar):" value={formData.otrasTerapias.otrasProfilaxis} onChange={e => handleNestedChange('otrasTerapias', 'otrasProfilaxis', e.target.value)} />
            </div>
        </fieldset>

        {/* SECTION 5 */}
        <fieldset className="border rounded-lg p-4 mb-4 text-sm">
             <legend className="px-2 font-semibold text-brand-gray">SECCIÓN 5: CAMBIO DE TRATAMIENTO</legend>
             <p className="font-semibold mb-2">13. Razón de cambio:</p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                 {Object.keys(formData.razonCambio).map(k => <Checkbox key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} checked={formData.razonCambio[k]} onChange={() => handleCheckboxChange('razonCambio', k)} />)}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <div className="border p-2 rounded">
                    <p className="font-semibold text-xs">14. Contaje de CD4:</p>
                    <DateValueInput group="contajeCD4" field="previo" label="Previo*:" formData={formData} setFormData={setFormData} />
                    <DateValueInput group="contajeCD4" field="actual" label="Actual:" formData={formData} setFormData={setFormData} />
                 </div>
                 <div className="border p-2 rounded">
                    <p className="font-semibold text-xs">15. Carga Viral:</p>
                    <DateValueInput group="cargaViral" field="previa1" label="Previa*:" formData={formData} setFormData={setFormData} />
                    <DateValueInput group="cargaViral" field="previa2" label="Previa**:" formData={formData} setFormData={setFormData} />
                    <DateValueInput group="cargaViral" field="actual" label="Actual:" formData={formData} setFormData={setFormData} />
                 </div>
             </div>
             <TextInputArea label="16. Esquema actualmente cumplido por el paciente y que desea cambiar:" value={formData.esquemaActual} onChange={e => handleFieldChange('esquemaActual', e.target.value)} />
             <p className="text-center font-semibold bg-slate-100 p-1">REGISTRAR EN LA SECCIÓN 4 EL ESQUEMA QUE DESEA SOLICITAR</p>
        </fieldset>

        {/* BOTTOM SECTION */}
        <div className="space-y-4 text-sm">
            <TextInputArea label="17. Justifique el inicio del tratamiento con el esquema solicitado." value={formData.justificacion} onChange={e => handleFieldChange('justificacion', e.target.value)} rows={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="18. Fecha de Elaboración" type="date" value={formData.fechaElaboracion} onChange={e => handleFieldChange('fechaElaboracion', e.target.value)} />
                <div>
                    <label className="block font-medium text-slate-700 text-xs mb-1">19. Médico tratante (Nombre y Firma)</label>
                     <select 
                        value={formData.medicoTratante} 
                        onChange={e => handleFieldChange('medicoTratante', e.target.value)}
                        className="w-full p-1 border rounded text-sm bg-white"
                     >
                        <option value="" disabled>Seleccione un médico</option>
                        {staff.map(member => (
                            <option key={member.id} value={member.nombre}>
                                {member.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <TextInput label="SELLO" value={formData.sello} onChange={e => handleFieldChange('sello', e.target.value)} />
                <TextInput label="20. Coordinador Regional de Programa SIDA/ITS (Nombre y Firma)" value={formData.coordinadorRegional} onChange={e => handleFieldChange('coordinadorRegional', e.target.value)} />
            </div>
        </div>
      </div>


      <div className="flex justify-end items-center mt-8 space-x-4 no-print">
        <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition">
          <DownloadIcon className="w-5 h-5 mr-2" />
          Descargar PDF
        </button>
        <button onClick={handleSave} className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition">
          Guardar Ficha
        </button>
      </div>
    </div>
  );
}

// Helper Components
const TextInput = ({ label, ...props }: {label: string; [key: string]: any}) => (
    <div>
        <label className="block font-medium text-slate-700 text-xs mb-1">{label}</label>
        <input {...props} className="w-full p-1 border rounded text-sm" />
    </div>
);
const TextInputArea = ({ label, ...props }: {label: string; [key: string]: any}) => (
    <div className="mt-2">
        <label className="block font-medium text-slate-700 text-xs mb-1">{label}</label>
        <textarea {...props} rows={2} className="w-full p-1 border rounded text-sm" />
    </div>
);
const InfoDisplay = ({ label, value }: {label: string; value: string}) => (
    <div>
        <label className="block font-medium text-slate-700 text-xs">{label}</label>
        <p className="w-full p-1 text-sm bg-slate-100 rounded min-h-[26px]">{value}</p>
    </div>
);
const Checkbox = ({ label, checked, onChange }: {label: string; checked: boolean; onChange: () => void}) => (
    <label className="flex items-center space-x-1 whitespace-nowrap">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="text-xs">{label}</span>
    </label>
);

const DateValueInput = ({ group, field, label, formData, setFormData }: {group: any, field: any, label: string, formData: any, setFormData: any}) => {
    const handleChange = (subField: string, value: string) => {
        setFormData((prev: FichaInicioTratamientoData) => ({
            ...prev,
            [group]: { ...prev[group], [field]: { ...prev[group][field], [subField]: value } }
        }));
    };
    return (
        <div className="flex items-center space-x-2 mt-1">
            <label className="text-xs w-16">{label}</label>
            <input type="text" placeholder="valor" value={formData[group][field].valor} onChange={e => handleChange('valor', e.target.value)} className="w-full p-1 border rounded text-xs"/>
            <input type="date" value={formData[group][field].fecha} onChange={e => handleChange('fecha', e.target.value)} className="w-full p-1 border rounded text-xs"/>
        </div>
    );
};