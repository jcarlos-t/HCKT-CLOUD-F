import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarHistorial, type Incidente } from "../services/incidentes/incidentes";

const MisReportesPage: React.FC = () => {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<Incidente[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState("");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "fecha inválida";
    }
  };

  const fetchHistorial = async (p = 0, estado?: string) => {
    setLoading(true);
    try {
      const payload: any = { page: p, size };
      if (estado) payload.estado = estado;
      const resp = await listarHistorial(payload);
      setHistorial(resp.data.contents || []);
      setPage(resp.data.page || 0);
      setTotalPages(resp.data.totalPages || 0);
    } catch (err) {
      console.warn("Error al cargar historial:", err);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial(0, estadoFilter || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Mis Reportes</h1>
            <p className="text-xs text-slate-500">Historial de tus reportes</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-white border rounded hover:bg-slate-50"
            >
              Volver
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-600">Consulta el estado y detalles de tus reportes.</p>
            <select
              value={estadoFilter}
              onChange={(e) => {
                const v = e.target.value;
                setEstadoFilter(v);
                fetchHistorial(0, v || undefined);
              }}
              className="border rounded px-2 py-1"
            >
              <option value="">Todos</option>
              <option value="reportado">Reportado</option>
              <option value="en_progreso">En Progreso</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Cargando historial...</p>
          ) : historial.length === 0 ? (
            <p className="text-sm text-slate-500">No hay reportes para mostrar.</p>
          ) : (
            <div className="space-y-3">
              {historial.map((h) => (
                <div key={h.incidente_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{h.titulo}</p>
                    <p className="text-xs text-slate-500">Piso {h.piso} • {formatDate(h.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs px-2 py-1 rounded-full inline-block bg-gray-100">{h.estado}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Página {page + 1} de {totalPages || 1}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchHistorial(Math.max(0, page - 1), estadoFilter || undefined)}
                    disabled={page <= 0}
                    className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchHistorial(page + 1, estadoFilter || undefined)}
                    disabled={page + 1 >= (totalPages || 1)}
                    className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MisReportesPage;
