// src/pages/DashboardAutoridad.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import IncidentesPorPisoChart from "../components/analitica/IncidentesPorPisoChart";
import IncidentesPorTipoChart from "../components/analitica/IncidentesPorTipoChart";
import IncidentesPorUrgenciaChart from "../components/analitica/IncidentesPorUrgenciaChart";
import TiempoResolucionCard from "../components/analitica/TiempoResolucionCard";
import TopUsuariosReportadores from "../components/analitica/TopUsuariosReportadores";
import TriggerETLButton from "../components/analitica/TriggerETLButton";
import MetricasPrincipalesCards from "../components/analitica/MetricasPrincipalesCards";

const DashboardAutoridad: React.FC = () => {
  const navigate = useNavigate();
  const { logout, session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      if (session) {
        const userResponse = await getMyUser();
        setUsuario(userResponse.data.usuario);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleRefreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AU</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  AlertaUTEC
                </h1>
                <p className="text-xs text-slate-500">Panel de Analítica</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {usuario && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </p>
                    <p className="text-xs text-slate-500">Autoridad</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón ETL */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Analítica de Reportes y Soluciones
              </h2>
              <p className="text-slate-600">
                Análisis completo de incidentes y tendencias en el campus.
              </p>
            </div>
            <TriggerETLButton onSuccess={handleRefreshData} />
          </div>
        </div>

        {/* Métricas Principales */}
        <MetricasPrincipalesCards key={refreshKey} />

        {/* Tiempo de Resolución */}
        <div className="mb-8">
          <TiempoResolucionCard key={refreshKey} />
        </div>

        {/* Análisis por Categorías */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IncidentesPorTipoChart key={`tipo-${refreshKey}`} />
          <IncidentesPorUrgenciaChart key={`urgencia-${refreshKey}`} />
        </div>

        {/* Por Piso */}
        <div className="mb-8">
          <IncidentesPorPisoChart key={`piso-${refreshKey}`} />
        </div>

        {/* Top Usuarios Reportadores */}
        <TopUsuariosReportadores key={`usuarios-${refreshKey}`} />
      </main>
    </div>
  );
};

export default DashboardAutoridad;

