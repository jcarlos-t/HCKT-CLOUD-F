// src/components/TiempoResolucionCard.tsx
import React, { useEffect, useState } from "react";
import { getTiempoResolucion } from "../../services/analitica/analitica";
import type { TiempoResolucionDetalle } from "../../interfaces/analitica/AnaliticaResponse";

const TiempoResolucionCard: React.FC = () => {
  const [data, setData] = useState<TiempoResolucionDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTiempoResolucion();
        setData(response.data.resultados);
        setError(null);
      } catch (err) {
        console.error("Error al obtener tiempo de resolución:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular estadísticas
  const tiemposResolucion = data
    .filter((item) => item.horas_resolucion !== null)
    .map((item) => parseFloat(item.horas_resolucion!));

  const promedioHoras =
    tiemposResolucion.length > 0
      ? (
          tiemposResolucion.reduce((a, b) => a + b, 0) / tiemposResolucion.length
        ).toFixed(1)
      : "0";

  const minimoHoras =
    tiemposResolucion.length > 0 ? Math.min(...tiemposResolucion) : 0;

  const maximoHoras =
    tiemposResolucion.length > 0 ? Math.max(...tiemposResolucion) : 0;

  const totalResueltos = data.filter((item) => item.estado === "resuelto").length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Tiempo de Resolución
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
          Tiempo de Resolución
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
        Tiempo de Resolución
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 mb-1">Promedio</p>
          <p className="text-2xl font-bold text-blue-900">{promedioHoras}</p>
          <p className="text-xs text-blue-600 mt-1">horas</p>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-xs text-green-600 mb-1">Mínimo</p>
          <p className="text-2xl font-bold text-green-900">{minimoHoras}</p>
          <p className="text-xs text-green-600 mt-1">horas</p>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-600 mb-1">Máximo</p>
          <p className="text-2xl font-bold text-orange-900">{maximoHoras}</p>
          <p className="text-xs text-orange-600 mt-1">horas</p>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-xs text-purple-600 mb-1">Total Resueltos</p>
          <p className="text-2xl font-bold text-purple-900">{totalResueltos}</p>
          <p className="text-xs text-purple-600 mt-1">incidentes</p>
        </div>
      </div>
    </div>
  );
};

export default TiempoResolucionCard;
