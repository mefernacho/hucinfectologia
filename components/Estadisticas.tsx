import React, { useState, useMemo } from 'react';
import { Patient, InmunizacionesData, CoInfeccionData, NeoplasiaData, NeoplasiaType, HepatitisBData, FichaInicioTratamientoData, TARSchemes } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface EstadisticasProps {
  patients: Patient[];
}

type TimeFrame = 'all' | 'year' | 'semester' | 'quarter' | 'month' | 'week';

const COLORS = ['#2E5A88', '#C21807', '#4A4A4A', '#88B04B', '#F7CAC9', '#82607E', '#F4A261'];
const COINFECTION_NAMES: Record<keyof Omit<CoInfeccionData, 'hepatitisB'>, string> & { hepatitisB: string } = {
    tb: 'Tuberculosis',
    hepatitisB: 'Hepatitis B',
    hepatitisC: 'Hepatitis C',
    toxoplasmosis: 'Toxoplasmosis',
    criptococoxis: 'Criptococoxis',
    histoplasmosis: 'Histoplasmosis',
    candida: 'Cándida',
    neurosifilis: 'Neurosífilis',
    paracoccidiomicosis: 'Paracoccidio.',
    cmv: 'CMV',
    ebv: 'EBV',
};
const NEOPLASIA_NAMES: Record<NeoplasiaType, string> = {
    'ninguna': 'Ninguna',
    'linfoma-no-hodking': 'Linfoma no Hodking',
    'ca-recto': 'CA de Recto',
    'sarcoma-kaposi': 'Sarcoma de Kaposi',
    'otro': 'Otro'
};

const MED_LABELS = {
    abacavir: 'Abacavir (ABC)', zidovudina: 'Zidovudina (AZT)', lamivudina: 'Lamivudina (3TC)', zidovudinaLamivudina: 'Zidovudina/Lamivudina', zidovudina3tcAbc: 'Zidovudina/3TC/ABC', abacavirLamivudina: 'Abacavir/Lamivudina', didanosina: 'Didanosina (DDI)', stavudina: 'Stavudina (D4T)', tenofovir: 'Tenofovir (TDF)',
    efavirenz: 'Efavirenz (EFV)', nevirapina: 'Nevirapina (NVP)', etravirina: 'Etravirina* (ETRV)',
    enfuvirtide: 'Enfuvirtide*(T20)',
    raltegravir: 'Raltegravir*(RALT)',
    saquinavir: 'Saquinavir (SQV)', lopinavirRtv: 'Lopinavir/Rtv (LPV/r)', atazanavir: 'Atazanavir(ATV)', fosamprenavir: 'Fosamprenavir (FPV)', ritonavir: 'Ritonavir (RTV)', darunavir: 'Darunavir* (DRV)',
    kocitaf: 'Kocitaf', dlt3tc: 'DLT+3TC', kivexaDlt: 'Kivexa+DLT', tld: 'TLD',
};

export default function Estadisticas({ patients }: EstadisticasProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

  const filteredPatients = useMemo(() => {
    if (timeFrame === 'all') return patients;
    const now = new Date();
    const filterDate = new Date();

    switch (timeFrame) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'semester':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    return patients.filter(p => new Date(p.consultationDate) >= filterDate);
  }, [patients, timeFrame]);

  const processData = (key: keyof Patient['estudios'] | keyof Patient, source: 'root' | 'estudios' = 'root') => {
    return filteredPatients.reduce((acc, patient) => {
        let value: any;
        if (source === 'root' && key in patient) {
            value = patient[key as keyof Patient];
        } else if (source === 'estudios' && patient.estudios && key in patient.estudios) {
            value = patient.estudios[key as keyof Patient['estudios']];
        }

        if (value === undefined || value === 'no-realizado' || value === '') return acc;

        const entry = acc.find(item => item.name === value);
        if (entry) {
            entry.value += 1;
        } else {
            acc.push({ name: value, value: 1 });
        }
        return acc;
    }, [] as { name: any; value: number }[]);
  };

  const ageData = useMemo(() => {
    const ageGroups = {
      '0-4': 0, '5-9': 0, '10-14': 0, '15-19': 0, '20-24': 0, '25-29': 0, 
      '30-34': 0, '35-39': 0, '40-44': 0, '45-49': 0, '50-54': 0, '55-59': 0,
      '60-64': 0, '65-69': 0, '70+': 0,
    };
    filteredPatients.forEach(p => {
      if (p.edad < 5) ageGroups['0-4']++;
      else if (p.edad < 10) ageGroups['5-9']++;
      else if (p.edad < 15) ageGroups['10-14']++;
      else if (p.edad < 20) ageGroups['15-19']++;
      else if (p.edad < 25) ageGroups['20-24']++;
      else if (p.edad < 30) ageGroups['25-29']++;
      else if (p.edad < 35) ageGroups['30-34']++;
      else if (p.edad < 40) ageGroups['35-39']++;
      else if (p.edad < 45) ageGroups['40-44']++;
      else if (p.edad < 50) ageGroups['45-49']++;
      else if (p.edad < 55) ageGroups['50-54']++;
      else if (p.edad < 60) ageGroups['55-59']++;
      else if (p.edad < 65) ageGroups['60-64']++;
      else if (p.edad < 70) ageGroups['65-69']++;
      else ageGroups['70+']++;
    });
    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  }, [filteredPatients]);

  const coInfeccionData = useMemo(() => {
    const counts: Record<keyof CoInfeccionData, number> = {
        tb: 0,
        hepatitisB: 0,
        hepatitisC: 0,
        toxoplasmosis: 0,
        criptococoxis: 0,
        histoplasmosis: 0,
        candida: 0,
        neurosifilis: 0,
        paracoccidiomicosis: 0,
        cmv: 0,
        ebv: 0,
    };
    
    filteredPatients.forEach(p => {
        const coInfeccion = p.historiaClinicaPrimera.coInfeccion;
        if(coInfeccion.tb) counts.tb++;
        if(coInfeccion.hepatitisB.agshb === 'si' || coInfeccion.hepatitisB.aghbc === 'si') counts.hepatitisB++;
        if(coInfeccion.hepatitisC) counts.hepatitisC++;
        if(coInfeccion.toxoplasmosis) counts.toxoplasmosis++;
        if(coInfeccion.criptococoxis) counts.criptococoxis++;
        if(coInfeccion.histoplasmosis) counts.histoplasmosis++;
        if(coInfeccion.candida) counts.candida++;
        if(coInfeccion.neurosifilis === 'si') counts.neurosifilis++;
        if(coInfeccion.paracoccidiomicosis) counts.paracoccidiomicosis++;
        if(coInfeccion.cmv) counts.cmv++;
        if(coInfeccion.ebv) counts.ebv++;
    });
    
    return Object.entries(counts).map(([key, value]) => ({ name: COINFECTION_NAMES[key as keyof CoInfeccionData], value })).filter(d => d.value > 0);
  }, [filteredPatients]);

  const neoplasiaData = useMemo(() => {
      const counts: Record<NeoplasiaType, number> = {
          'ninguna': 0,
          'linfoma-no-hodking': 0,
          'ca-recto': 0,
          'sarcoma-kaposi': 0,
          'otro': 0
      };

      filteredPatients.forEach(p => {
          const tipo = p.historiaClinicaPrimera.neoplasia.tipo;
          if (counts[tipo] !== undefined) {
              counts[tipo]++;
          }
      });
      return Object.entries(counts).map(([key, value]) => ({name: NEOPLASIA_NAMES[key as NeoplasiaType], value})).filter(d => d.name !== 'Ninguna' && d.value > 0);
  }, [filteredPatients]);

  const factoresRiesgoData = useMemo(() => {
    const counts = { Tabaco: 0, Alcohol: 0, Dislipidemia: 0, 'Uso Drogas': 0, HTA: 0, DM: 0 };
    filteredPatients.forEach(p => {
        if(p.fichaInicioTratamiento?.factoresRiesgo) {
            const { factoresRiesgo } = p.fichaInicioTratamiento;
            if(factoresRiesgo.tabaco) counts.Tabaco++;
            if(factoresRiesgo.alcohol) counts.Alcohol++;
            if(factoresRiesgo.dislipidemia) counts.Dislipidemia++;
            if(factoresRiesgo.usoDrogas) counts['Uso Drogas']++;
            if(factoresRiesgo.hta) counts.HTA++;
            if(factoresRiesgo.dm) counts.DM++;
        }
    });
    return Object.entries(counts).map(([name, value]) => ({name, value})).filter(d => d.value > 0);
  }, [filteredPatients]);
  
  const razonCambioData = useMemo(() => {
    const counts = { 'Inmunológico': 0, 'Clínico': 0, 'Virológico': 0, 'Toxicidad': 0, 'Intolerancia': 0, 'Desabastecimiento': 0, 'Interacciones': 0 };
    filteredPatients.forEach(p => {
        if(p.fichaInicioTratamiento?.razonCambio) {
            const { razonCambio } = p.fichaInicioTratamiento;
            if(razonCambio.criterioInmunologico) counts['Inmunológico']++;
            if(razonCambio.criterioClinico) counts['Clínico']++;
            if(razonCambio.criterioVirologico) counts['Virológico']++;
            if(razonCambio.toxicidadMedicamentosa) counts['Toxicidad']++;
            if(razonCambio.intoleranciaSevera) counts['Intolerancia']++;
            if(razonCambio.desabastecimientoARV) counts['Desabastecimiento']++;
            if(razonCambio.interaccionesMedicamentosas) counts['Interacciones']++;
        }
    });
    return Object.entries(counts).map(([name, value]) => ({name, value})).filter(d => d.value > 0);
  }, [filteredPatients]);
  
   const estadoClinicoData = useMemo(() => {
    const counts = { 'Asintomático': 0, 'Sintomático B': 0, 'Enfermedad B': 0, 'Sintomático C': 0, 'Enfermedad C': 0, 'Historia TB': 0 };
     filteredPatients.forEach(p => {
        if(p.fichaInicioTratamiento?.estadoClinico) {
            const { estadoClinico } = p.fichaInicioTratamiento;
            if(estadoClinico.asintomatico) counts['Asintomático']++;
            if(estadoClinico.sintomaticoB) counts['Sintomático B']++;
            if(estadoClinico.enfermedadB) counts['Enfermedad B']++;
            if(estadoClinico.sintomaticoC) counts['Sintomático C']++;
            if(estadoClinico.enfermedadC) counts['Enfermedad C']++;
            if(estadoClinico.historiaTB) counts['Historia TB']++;
        }
    });
    return Object.entries(counts).map(([name, value]) => ({name, value})).filter(d => d.value > 0);
  }, [filteredPatients]);

  const cd4Data = useMemo(() => {
    const counts = { '< 200': 0, '200-350': 0, '351-500': 0, '> 500': 0 };
    filteredPatients.forEach(p => {
        const cd4 = p.estudios?.contajeCD4;
        if (typeof cd4 === 'number') {
            if (cd4 < 200) counts['< 200']++;
            else if (cd4 <= 350) counts['200-350']++;
            else if (cd4 <= 500) counts['351-500']++;
            else counts['> 500']++;
        }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPatients]);

  const cargaViralData = useMemo(() => {
    const counts = { 'Indetectable (<50)': 0, 'Baja (50-1k)': 0, 'Moderada (1k-100k)': 0, 'Alta (>100k)': 0 };
     filteredPatients.forEach(p => {
        const cv = p.estudios?.cargaViral;
        if (typeof cv === 'number') {
            if (cv < 50) counts['Indetectable (<50)']++;
            else if (cv <= 1000) counts['Baja (50-1k)']++;
            else if (cv <= 100000) counts['Moderada (1k-100k)']++;
            else counts['Alta (>100k)']++;
        }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPatients]);
  
  const inmunizacionesData = useMemo(() => {
    const counts: Record<string, number> = { 'Neumococo': 0, 'Trivalente': 0, 'Pentavalente': 0, 'Sars-Cov2': 0, 'Hepatitis A': 0, 'Influenza': 0, 'Toxoide': 0 };
    const keyMap: Record<string, keyof InmunizacionesData> = { 'Neumococo': 'neumococo', 'Trivalente': 'trivalente', 'Pentavalente': 'pentavalente', 'Sars-Cov2': 'sarsCov2', 'Hepatitis A': 'hepatitisA', 'Influenza': 'influenza', 'Toxoide': 'toxoide' };
    filteredPatients.forEach(p => {
        if (p.estudios?.inmunizaciones) {
            Object.entries(keyMap).forEach(([label, key]) => {
                if (p.estudios.inmunizaciones[key]?.aplicada === 'si') {
                    counts[label]++;
                }
            });
        }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [filteredPatients]);

  const arvMedsData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredPatients.forEach(p => {
        if (p.fichaInicioTratamiento?.medicamentosARV) {
            const { medicamentosARV } = p.fichaInicioTratamiento;
            Object.values(medicamentosARV).forEach(category => {
                Object.entries(category).forEach(([med, data]) => {
                    if ((data as any).selected) {
                        counts[med] = (counts[med] || 0) + 1;
                    }
                });
            });
        }
    });
    return Object.entries(counts)
        .map(([name, value]) => ({ name: MED_LABELS[name as keyof typeof MED_LABELS] || name, value }))
        .filter(d => d.value > 0)
        .sort((a,b) => b.value - a.value);
  }, [filteredPatients]);

  const tarSchemesData = useMemo(() => {
    const counts: Record<TARSchemes, number> = { 'KOCITAF': 0, 'DLT+3TC': 0, 'Kivexa/DLT': 0, 'TLD': 0 };
    filteredPatients.forEach(p => {
        p.tarChanges.forEach(change => {
            if (counts[change.esquema] !== undefined) {
                counts[change.esquema]++;
            }
        });
    });
    return Object.entries(counts).map(([name, value]) => ({name, value})).filter(d => d.value > 0);
  }, [filteredPatients]);


  const densitometriaData = useMemo(() => processData('densitometria', 'estudios').filter(item => item.name !== 'no-realizado'), [filteredPatients]);
  const hepatitisBData = useMemo(() => processData('hepatitisB', 'estudios').filter(item => item.name !== 'no-realizado'), [filteredPatients]);
  const hepatitisCData = useMemo(() => processData('hepatitisC', 'estudios').filter(item => item.name !== 'no-realizado'), [filteredPatients]);
  const vdrlData = useMemo(() => processData('vdrl', 'estudios').filter(item => item.name !== 'no-realizado'), [filteredPatients]);

  const sexData = useMemo(() => processData('sexo'), [filteredPatients]);
  const consultationTypeData = useMemo(() => processData('tipoConsulta'), [filteredPatients]);

  const Summary = () => {
      if (filteredPatients.length === 0) return null;
      
      const mostCommonAgeGroup = ageData.reduce((max, current) => current.value > max.value ? current : max, {name: 'N/A', value: 0});
      const mostCommonCoInfection = coInfeccionData.reduce((max, current) => current.value > max.value ? current : max, {name: 'ninguna', value: 0});
      const undetectableCount = filteredPatients.filter(p => p.estudios?.cargaViral !== undefined && p.estudios.cargaViral < 50).length;
      const undetectablePercentage = filteredPatients.length > 0 ? ((undetectableCount / filteredPatients.length) * 100).toFixed(0) : 0;
      const cd4Counts = filteredPatients.map(p => p.estudios?.contajeCD4).filter(cd4 => typeof cd4 === 'number') as number[];
      const averageCD4 = cd4Counts.length > 0 ? (cd4Counts.reduce((a, b) => a + b, 0) / cd4Counts.length).toFixed(0) : 'N/A';


      return (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-8 space-y-1">
            <h3 className="font-bold text-lg">Resumen del Período</h3>
            <p className="text-sm">
                Se han evaluado un total de <span className="font-bold">{filteredPatients.length}</span> pacientes. 
                El grupo etario predominante es de <span className="font-bold">{mostCommonAgeGroup.name}</span> años.
                {mostCommonCoInfection.value > 0 && (
                    <>
                        {' '}La co-infección más reportada es <span className="font-bold">{mostCommonCoInfection.name}</span>.
                    </>
                )}
            </p>
            <p className="text-sm">
                El <span className="font-bold">{undetectablePercentage}%</span> de los pacientes presenta carga viral indetectable. El contaje promedio de CD4 es de <span className="font-bold">{averageCD4}</span> células/mm³.
            </p>
        </div>
      );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Estadísticas Generales</h2>
        <div>
          <label className="text-sm font-medium text-brand-gray mr-2">Período:</label>
          <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value as TimeFrame)} className="p-2 border rounded-lg bg-white">
            <option value="all">Todo el tiempo</option>
            <option value="year">Último año</option>
            <option value="semester">Último semestre</option>
            <option value="quarter">Último trimestre</option>
            <option value="month">Último mes</option>
            <option value="week">Última semana</option>
          </select>
        </div>
      </div>
      
      <Summary />

      {filteredPatients.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-brand-gray">No hay datos disponibles</h3>
            <p className="text-slate-500 mt-2">No se encontraron registros de pacientes para el período de tiempo seleccionado.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        
        <ChartContainer title="Distribución por Grupos de Edad">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} tick={{fontSize: 12}} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#2E5A88" strokeWidth={2} name="Pacientes" />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Distribución por Sexo">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sexData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {sexData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Tipos de Consulta">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consultationTypeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#C21807" name="Nº de Pacientes" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
        
        <div className="lg:col-span-2 xl:col-span-3">
          <ChartContainer title="Distribución de Co-infecciones">
              <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={coInfeccionData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#88B04B" name="Nº de Casos" />
                  </BarChart>
              </ResponsiveContainer>
          </ChartContainer>
        </div>

        <ChartContainer title="Distribución de Neoplasias">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={neoplasiaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {neoplasiaData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Factores de Riesgo Cardiovascular">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={factoresRiesgoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#F4A261" name="Nº de Casos" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Razón de Cambio de Tratamiento">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={razonCambioData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                        {razonCambioData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
        
        <div className="lg:col-span-2 xl:col-span-3">
            <ChartContainer title="Uso de Medicamentos ARV (Tratamiento Inicial)">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={arvMedsData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82607E" name="Nº de Pacientes" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>

        <ChartContainer title="Esquemas de Cambio de TAR">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={tarSchemesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {tarSchemesData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Estado Clínico al Ingreso">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={estadoClinicoData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82607E" name="Nº de Casos" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
        
        {/* NEW LAB CHARTS */}
        <div className="lg:col-span-2 xl:col-span-3">
             <ChartContainer title="Cobertura de Inmunizaciones">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={inmunizacionesData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2E5A88" name="Pacientes Vacunados" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
        
        <ChartContainer title="Distribución de Contaje CD4 (células/mm³)">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cd4Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Bar dataKey="value" fill="#4A4A4A" name="Nº de Pacientes" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Distribución de Carga Viral (copias/mL)">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cargaViralData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Bar dataKey="value" fill="#C21807" name="Nº de Pacientes" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Resultados de Densitometría Ósea">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={densitometriaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {densitometriaData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>

        <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ChartContainer title="Resultados Hepatitis B">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={hepatitisBData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label>
                           {hepatitisBData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index + 1 % COLORS.length]} />)}
                        </Pie>
                        <Tooltip/><Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            <ChartContainer title="Resultados Hepatitis C">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={hepatitisCData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label>
                           {hepatitisCData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />)}
                        </Pie>
                        <Tooltip/><Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            <ChartContainer title="Resultados VDRL">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={vdrlData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label>
                            {vdrlData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index + 3 % COLORS.length]} />)}
                        </Pie>
                        <Tooltip/><Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>


      </div>
      )}
    </div>
  );
}

const ChartContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-brand-gray mb-4 text-center">{title}</h3>
        {children}
    </div>
)