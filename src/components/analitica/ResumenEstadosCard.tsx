// src/components/ResumenEstadosCard.tsx
import React, { useEffect, useState } from "react";
import { getIncidentesPorPiso } from "../../services/analitica/analitica";
import type { IncidentePorPiso } from "../../interfaces/analitica/AnaliticaResponse";

const ResumenEstadosCard: React.FC = () => {
  const [data, setData] = useState<IncidentePorPiso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getIncidentesPorPiso();
        setData(response.data.resultados);
        setError(null);
      } catch (err) {
        console.error("Error al obtener resumen de estados:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar por estado
  const estadosAgrupados = data.reduce((acc, item) => {
    const estado = item.estado;
    acc[estado] = (acc[estado] || 0) + parseInt(item.total_incidentes);
    return acc;
  }, {} as Record<string, number>);

  const pendientes = estadosAgrupados["reportado"] || 0;
  const enProgreso = estadosAgrupados["en_progreso"] || 0;
  const resueltos = estadosAgrupados["resuelto"] || 0;
  const total = pendientes + enProgreso + resueltos;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Resumen de Estados
        </h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Resumen de Estados
        </h3>
        <div className="text-center py-8 text-slate-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Resumen de Estados
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-900">{pendientes}</p>
          <p className="text-xs text-yellow-600 mt-1">
            {total > 0 ? ((pendientes / total) * 100).toFixed(1) : 0}% del total
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 mb-1">En Progreso</p>
          <p className="text-2xl font-bold text-blue-900">{enProgreso}</p>
          <p className="text-xs text-blue-600 mt-1">
            {total > 0 ? ((enProgreso / total) * 100).toFixed(1) : 0}% del total
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 mb-1">Resueltos</p>
          <p className="text-2xl font-bold text-green-900">{resueltos}</p>
          <p className="text-xs text-green-600 mt-1">
            {total > 0 ? ((resueltos / total) * 100).toFixed(1) : 0}% del total
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumenEstadosCard;
