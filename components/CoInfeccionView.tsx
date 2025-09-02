
import React from 'react';
import { CoInfeccionData, HepatitisBData } from '../core/types';

interface CoInfeccionViewProps {
  coInfeccionData: CoInfeccionData;
  isAccordion?: boolean;
}

const COINFECTION_LABELS = {
  tb: 'TB',
  hepatitisB: 'Hepatitis B',
  hepatitisC: 'Hepatitis C',
  toxoplasmosis: 'Toxoplasmosis',
  criptococoxis: 'Criptococoxis',
  histoplasmosis: 'Histoplasmosis',
  candida: 'Candida',
  neurosifilis: 'Neurosífilis',
  paracoccidiomicosis: 'Paracoccidiomicosis',
  cmv: 'CMV',
  ebv: 'EBV',
};

const CoInfeccionDisplay = ({ coInfeccionData }: { coInfeccionData: CoInfeccionData }) => {
    const dataToShow = Object.entries(coInfeccionData)
        .map(([key, value]) => {
            let displayValue: string;
            if (key === 'hepatitisB') {
                const hbv = value as HepatitisBData;
                const markers = [];
                if (hbv.agshb === 'si') markers.push('AgSHB');
                if (hbv.aghbc === 'si') markers.push('AgHBc');
                displayValue = markers.length > 0 ? markers.join(', ') : 'No';
            } else if (key === 'neurosifilis') {
                displayValue = value === 'si' ? 'Sí' : 'No';
            } else {
                displayValue = value as string || 'No';
            }
            return { label: COINFECTION_LABELS[key as keyof typeof COINFECTION_LABELS], value: displayValue };
        })
        .filter(item => item.value !== 'No');

    if (dataToShow.length === 0) {
        return <p className="text-slate-500">No hay co-infecciones activas registradas.</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            {dataToShow.map(item => (
                <div key={item.label}>
                    <p className="font-bold text-brand-gray">{item.label}</p>
                    <p className="text-slate-600">{item.value}</p>
                </div>
            ))}
        </div>
    );
};

export default function CoInfeccionView({ coInfeccionData, isAccordion = false }: CoInfeccionViewProps) {
  if (isAccordion) {
    return (
        <details className="border rounded-lg bg-slate-50 overflow-hidden">
            <summary className="p-4 cursor-pointer font-semibold text-brand-gray hover:bg-slate-100">
                Ver/Ocultar Resumen de Co-infecciones
            </summary>
            <div className="p-4 border-t">
                <CoInfeccionDisplay coInfeccionData={coInfeccionData} />
            </div>
        </details>
    );
  }

  return (
    <fieldset className="border p-4 rounded-lg">
      <legend className="text-lg font-semibold text-brand-gray px-2">Resumen de Co-infección</legend>
      <div className="mt-2">
        <CoInfeccionDisplay coInfeccionData={coInfeccionData} />
      </div>
    </fieldset>
  );
}
