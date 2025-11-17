// src/components/ReportesList.tsx
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser } from "../services/usuario/usuario";
import {
  listarIncidentes,
  type Incidente,
  type ListarIncidentesRequest,
} from "../services/incidentes/incidentes";

const ReportesList: React.FC = () => {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [role, setRole] = useState<string | null>(null);
  // filtros
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [tipoFilter, setTipoFilter] = useState<string>("");
  const [urgenciaFilter, setUrgenciaFilter] = useState<string>("");

  const { session } = useAuthContext();

  const fetchIncidentes = async (opts?: { page?: number; size?: number }) => {
    try {
      setIsLoading(true);
      // ✅ agregar page para cumplir con ListarIncidentesRequest
      const payload: ListarIncidentesRequest = {
        page: opts?.page ?? 0,
        size: opts?.size ?? 50,
      };

      if (estadoFilter) payload.estado = estadoFilter as any;
      if (tipoFilter) payload.tipo = tipoFilter as any;
      if (urgenciaFilter) payload.nivel_urgencia = urgenciaFilter as any;

      const response = await listarIncidentes(payload, role ?? undefined);
      setIncidentes(response.data.contents || []);
      setError("");
    } catch (err) {
      console.error("Error al obtener incidentes:", err);
      setError("No se pudieron cargar los reportes. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (session) {
        try {
          const { data } = await getMyUser();
          if (!mounted) return;
          setRole(data.usuario.rol);
        } catch (err) {
          console.warn("No se pudo obtener usuario:", err);
        }
      }

      await fetchIncidentes();
    })();

    return () => {
      mounted = false;
    };
  }, [session]);

  useEffect(() => {
    // recargar cuando cambian filtros o role
    fetchIncidentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFilter, tipoFilter, urgenciaFilter, role]);

  // Estados alineados al backend: "reportado" | "en_progreso" | "resuelto"
  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "reportado":
        return "bg-yellow-100 text-yellow-800";
      case "en_progreso":
        return "bg-blue-100 text-blue-800";
      case "resuelto":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (estado?: string) => {
    switch (estado) {
      case "reportado":
        return "Reportado";
      case "en_progreso":
        return "En Progreso";
      case "resuelto":
        return "Resuelto";
      default:
        return "Sin estado";
    }
  };

  const getUrgenciaColor = (urgencia?: string) => {
    switch (urgencia) {
      case "alto":
        return "bg-red-100 text-red-800";
      case "medio":
        return "bg-orange-100 text-orange-800";
      case "bajo":
        return "bg-green-100 text-green-800";
      case "critico":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "fecha inválida";
    }
  };

  return (
    <section className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Reportes recientes
        </h2>
      </div>
      <div className="flex gap-3">
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos los estados</option>
          <option value="reportado">Reportado</option>
          <option value="en_progreso">En Progreso</option>
          <option value="resuelto">Resuelto</option>
        </select>

        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos los tipos</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="seguridad">Seguridad</option>
          <option value="limpieza">Limpieza</option>
          <option value="TI">TI</option>
          <option value="otro">Otro</option>
        </select>

        <select
          value={urgenciaFilter}
          onChange={(e) => setUrgenciaFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todas las urgencias</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
          <option value="critico">Crítico</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-slate-600">Cargando reportes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-800">{error}</p>
        </div>
      ) : incidentes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tienes reportes aún
          </h3>
          <p className="text-slate-600">
            Cuando reportes incidentes, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidentes.map((incidente) => (
            <div
              key={incidente.incidente_id}
              className="bg-white rounded-xl shadow-sm border border-sky-100 p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {incidente.titulo ?? "Incidente sin título"}
                  </h3>
                  {incidente.incidente_id && (
                    <p className="text-xs text-slate-400">
                      ID: {incidente.incidente_id}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>
                        Piso {incidente.piso} - {formatDate(incidente.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🏷️</span>
                      <span>{incidente.tipo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                      incidente.estado
                    )}`}
                  >
                    {getEstadoLabel(incidente.estado)}
                  </span>
                  {incidente.nivel_urgencia && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(
                        incidente.nivel_urgencia
                      )}`}
                    >
                      Urgencia: {incidente.nivel_urgencia}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReportesList;
