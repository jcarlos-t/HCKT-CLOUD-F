// src/pages/DashboardEstudiante.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import {
  listarIncidentes,
  type Incidente,
} from "../services/incidentes/incidentes";
import ReportesList from "../components/ReportesList";

const DashboardEstudiante: React.FC = () => {
  const navigate = useNavigate();
  const { logout, session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const userResponse = await getMyUser();
          setUsuario(userResponse.data.usuario);

          const incidentesResponse = await listarIncidentes({ size: 50 });
          setIncidentes(incidentesResponse.data.contents);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const estadisticas = {
    pendientes: incidentes.filter((i) => i.estado === "reportado").length,
    enAtencion: incidentes.filter((i) => i.estado === "en_progreso").length,
    resueltos: incidentes.filter((i) => i.estado === "resuelto").length,
    total: incidentes.length,
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoToProfile = () => {
    navigate("/dashboard/perfil");
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
                <p className="text-xs text-slate-500">Panel de Estudiante</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {usuario && (
                <button
                  type="button"
                  onClick={handleGoToProfile}
                  className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-full hover:bg-sky-50 border border-transparent hover:border-sky-100 transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  aria-label="Ir a la gestión de perfil"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </p>
                    <p className="text-xs text-slate-500">Estudiante</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
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
      {/* … resto igual */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* (contenido igual que antes) */}
        {/* ... */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            ¡Bienvenido, {usuario?.nombre || "Estudiante"}!
          </h2>
          <p className="text-slate-600">
            Gestiona tus reportes de incidentes en el campus.
          </p>
        </div>

        {/* Stats Cards ... */}
        {/* Acciones ... */}
        {/* Lista de reportes */}
        <ReportesList />
      </main>
    </div>
  );
};

export default DashboardEstudiante;
