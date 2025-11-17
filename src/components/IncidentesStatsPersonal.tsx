// src/components/IncidentesStatsPersonal.tsx
import React from "react";

interface EstadisticasIncidentes {
  pendientes: number;
  enProgreso: number;
  resueltos: number;
  total: number;
}

interface Props {
  estadisticas: EstadisticasIncidentes;
}

const IncidentesStatsPersonal: React.FC<Props> = ({ estadisticas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Pendientes
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {estadisticas.pendientes}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              En Progreso
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {estadisticas.enProgreso}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🔧</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Resueltos
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {estadisticas.resueltos}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-slate-900">
              {estadisticas.total}
            </p>
          </div>
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentesStatsPersonal;
