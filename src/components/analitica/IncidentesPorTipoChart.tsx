// src/components/IncidentesPorTipoChart.tsx
import React, { useEffect, useState } from "react";
import { getIncidentesPorTipo } from "../../services/analitica/analitica";
import type { IncidentePorTipo } from "../../interfaces/analitica/AnaliticaResponse";

const IncidentesPorTipoChart: React.FC = () => {
  const [data, setData] = useState<IncidentePorTipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getIncidentesPorTipo();
        setData(response.data.resultados);
        setError(null);
      } catch (err) {
        console.error("Error al obtener incidentes por tipo:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar por tipo (sumar todas las urgencias)
  const incidentesPorTipo = data.reduce((acc, item) => {
    const tipo = item.tipo;
    acc[tipo] = (acc[tipo] || 0) + parseInt(item.cantidad);
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(incidentesPorTipo).reduce((a, b) => a + b, 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Incidentes por Tipo
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
          Incidentes por Tipo
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
        Incidentes por Tipo
      </h3>
      <div className="space-y-3">
        {Object.entries(incidentesPorTipo)
          .sort(([, a], [, b]) => b - a)
          .map(([tipo, cantidad]) => (
            <div key={tipo} className="flex items-center justify-between">
              <span className="text-slate-700 capitalize">{tipo}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${total > 0 ? (cantidad / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-slate-900 w-8 text-right">
                  {cantidad}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default IncidentesPorTipoChart;
