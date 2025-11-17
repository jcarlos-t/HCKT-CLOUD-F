// src/components/IncidentesPorPisoChart.tsx
import React, { useEffect, useState } from "react";
import { getIncidentesPorPiso } from "../../services/analitica/analitica";
import type { IncidentePorPiso } from "../../interfaces/analitica/AnaliticaResponse";

const IncidentesPorPisoChart: React.FC = () => {
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
        console.error("Error al obtener incidentes por piso:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar por piso (sumar todos los estados)
  const incidentesPorPiso = data.reduce((acc, item) => {
    const piso = item.piso;
    acc[piso] = (acc[piso] || 0) + parseInt(item.total_incidentes);
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Incidentes por Piso
        </h3>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Incidentes por Piso
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
        Incidentes por Piso
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(incidentesPorPiso)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([piso, cantidad]) => (
            <div key={piso} className="text-center p-4 bg-sky-50 rounded-lg">
              <p className="text-2xl font-bold text-sky-600">{cantidad}</p>
              <p className="text-sm text-slate-600">Piso {piso}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default IncidentesPorPisoChart;
