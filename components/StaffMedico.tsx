import React, { useState } from 'react';
import { StaffMember } from '../types';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface StaffMedicoProps {
  staff: StaffMember[];
  addStaffMember: (staffMember: StaffMember) => void;
}

export default function StaffMedico({ staff, addStaffMember }: StaffMedicoProps) {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && especialidad) {
      const newMember: StaffMember = {
        id: new Date().getTime().toString(),
        nombre,
        especialidad,
      };
      addStaffMember(newMember);
      setNombre('');
      setEspecialidad('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Staff List */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Staff Médico</h2>
        <div className="space-y-4">
          {staff.map(member => (
            <div key={member.id} className="flex items-center p-4 bg-slate-50 rounded-lg border">
              <div className="p-3 bg-blue-100 rounded-full">
                <BriefcaseIcon className="h-6 w-6 text-brand-blue" />
              </div>
              <div className="ml-4">
                <p className="font-bold text-brand-gray">{member.nombre}</p>
                <p className="text-sm text-slate-500">{member.especialidad}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-brand-blue mb-6 flex items-center">
            <UserPlusIcon className="h-6 w-6 mr-2"/>
            Agregar Nuevo Miembro
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-gray">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              placeholder="Dr. Juan Pérez"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray">Especialidad</label>
            <input
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              placeholder="Cardiólogo"
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}