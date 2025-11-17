// src/components/TopUsuariosReportadores.tsx
import React, { useEffect, useState } from "react";
import { getReportesPorUsuario } from "../../services/analitica/analitica";
import type { ReportePorUsuario } from "../../interfaces/analitica/AnaliticaResponse";

const TopUsuariosReportadores: React.FC = () => {
  const [data, setData] = useState<ReportePorUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getReportesPorUsuario();
        // Ordenar por total de reportes descendente y tomar los primeros 10
        const topUsuarios = response.data.resultados
          .sort((a, b) => parseInt(b.total_reportes) - parseInt(a.total_reportes))
          .slice(0, 10);
        setData(topUsuarios);
        setError(null);
      } catch (err) {
        console.error("Error al obtener reportes por usuario:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Top 10 Usuarios Reportadores
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Top 10 Usuarios Reportadores
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
        Top 10 Usuarios Reportadores
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">
                #
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">
                Usuario
              </th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">
                Total
              </th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">
                Resueltos
              </th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">
                En Progreso
              </th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">
                Pendientes
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((usuario, index) => (
              <tr
                key={usuario.usuario_correo}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="py-3 px-2 text-sm text-slate-600">
                  {index + 1}
                </td>
                <td className="py-3 px-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {usuario.usuario_correo}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    {usuario.total_reportes}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {usuario.reportes_resueltos}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {usuario.reportes_en_progreso}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {usuario.reportes_pendientes}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsuariosReportadores;
