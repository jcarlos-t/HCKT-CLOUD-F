// src/components/MetricasPrincipalesCards.tsx
import React, { useEffect, useState } from "react";
import { getIncidentesPorPiso } from "../../services/analitica/analitica";
import type { IncidentePorPiso } from "../../interfaces/analitica/AnaliticaResponse";
import AnaliticaCard from "./AnaliticaCard";

const MetricasPrincipalesCards: React.FC = () => {
  const [data, setData] = useState<IncidentePorPiso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getIncidentesPorPiso();
        setData(response.data.resultados);
      } catch (err) {
        console.error("Error al obtener métricas principales:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular métricas
  const estadosAgrupados = data.reduce((acc, item) => {
    const estado = item.estado;
    acc[estado] = (acc[estado] || 0) + parseInt(item.total_incidentes);
    return acc;
  }, {} as Record<string, number>);

  const pendientes = estadosAgrupados["reportado"] || 0;
  const enProgreso = estadosAgrupados["en_progreso"] || 0;
  const resueltos = estadosAgrupados["resuelto"] || 0;
  const total = pendientes + enProgreso + resueltos;
  const tasaResolucion = total > 0 ? ((resueltos / total) * 100).toFixed(1) : "0";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-sky-100 p-6"
          >
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AnaliticaCard
        titulo="Total Incidentes"
        valor={total}
        icono="📊"
        color="sky"
      />
      <AnaliticaCard
        titulo="Tasa de Resolución"
        valor={`${tasaResolucion}%`}
        icono="✅"
        color="green"
      />
      <AnaliticaCard
        titulo="Pendientes"
        valor={pendientes}
        icono="⏳"
        color="yellow"
      />
      <AnaliticaCard
        titulo="En Progreso"
        valor={enProgreso}
        icono="🔧"
        color="blue"
      />
    </div>
  );
};

export default MetricasPrincipalesCards;
