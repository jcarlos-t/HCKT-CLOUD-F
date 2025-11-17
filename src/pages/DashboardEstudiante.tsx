// src/pages/DashboardEstudiante.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import { listarIncidentes, type Incidente } from "../services/incidentes/incidentes";
import ReportesList from "../components/ReportesList";
import NotificacionesContainer from "../components/NotificacionesContainer";
import { useWebSocket } from "../hooks/useWebSocket";
import type { NotificacionWebSocket } from "../interfaces/websocket.interface";

interface NotificacionConId extends NotificacionWebSocket {
  id: string;
}

const DashboardEstudiante: React.FC = () => {
  const navigate = useNavigate();
  const { logout, session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState<NotificacionConId[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  

  // Callback para manejar notificaciones WebSocket
  const handleNotificacion = useCallback((notificacion: NotificacionWebSocket) => {
    console.log("📬 Nueva notificación en Dashboard:", notificacion);

    // Agregar notificación a la lista con un ID único
    const notificacionConId: NotificacionConId = {
      ...notificacion,
      id: `${Date.now()}-${Math.random()}`,
    };

    setNotificaciones((prev) => [notificacionConId, ...prev].slice(0, 5)); // Máximo 5 notificaciones

    // Actualizar lista de incidentes
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Conectar WebSocket - FIX: session ya ES el token, no session.token
  const { isConnected } = useWebSocket(session || null, handleNotificacion);

  // Remover notificación
  const handleRemoveNotificacion = useCallback((id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const userResponse = await getMyUser();
          setUsuario(userResponse.data.usuario);

          const incidentesResponse = await listarIncidentes(
            { page: 0, size: 50 },
            userResponse.data.usuario.rol,
          );
          setIncidentes(incidentesResponse.data.contents);
          // no cargamos historial aquí — ahora está en la página dedicada
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, refreshKey]); // Agregar refreshKey como dependencia

  // Estados alineados con el backend: "reportado" | "en_progreso" | "resuelto"
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

  

  // la paginación usa directamente `fetchHistorial` desde los botones en el JSX

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
      {/* Contenedor de notificaciones */}
      <NotificacionesContainer
        notificaciones={notificaciones}
        onRemove={handleRemoveNotificacion}
      />

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
              {/* Indicador de conexión WebSocket */}
              {isConnected && (
                <div className="flex items-center gap-2 px-2 py-1 bg-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">En línea</span>
                </div>
              )}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            ¡Bienvenido, {usuario?.nombre || "Estudiante"}!
          </h2>
          <p className="text-slate-600">
            Gestiona tus reportes de incidentes en el campus.
          </p>
        </div>

        {/* Stats Cards */}
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
                  En Atención
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {estadisticas.enAtencion}
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

        {/* Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Reportar Incidente
            </h3>
            <p className="text-slate-600 mb-4">
              Reporta un nuevo incidente en el campus para que sea atendido
              rápidamente.
            </p>
            <button
              onClick={() => navigate("/dashboard/reportar")}
              className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition"
            >
              Nuevo Reporte
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Mis Reportes</h3>
              <p className="text-slate-600 mb-4">
                Ve el historial completo de tus reportes y su estado.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard/mis-reportes')}
                  className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition"
                >
                  Ver mi historial
                </button>
              </div>
          </div>
        </div>

        {/* Lista de reportes del estudiante dentro del dashboard */}
        <ReportesList key={refreshKey} />
      </main>
    </div>
  );
};

export default DashboardEstudiante;
