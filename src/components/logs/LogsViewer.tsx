// src/components/logs/LogsViewer.tsx
import React, { useEffect, useState } from "react";
import {
  listarLogs,
  type LogEntry,
  type NivelLog,
  type TipoLog,
} from "../../services/logs/logs";

const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Filtros
  const [filtroNivel, setFiltroNivel] = useState<NivelLog | "todos">("todos");
  const [filtroTipo, setFiltroTipo] = useState<TipoLog | "todos">("todos");

  const fetchLogs = async (page = 0) => {
    try {
      setIsLoading(true);
      const params: any = {
        size: pageSize,
        page,
      };

      if (filtroNivel !== "todos") params.nivel = filtroNivel;
      if (filtroTipo !== "todos") params.tipo = filtroTipo;

      const response = await listarLogs(params);
      setLogs(response.data.contents);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setError(null);
    } catch (err: any) {
      console.error("Error al obtener logs:", err);
      setError("Error al cargar logs del sistema");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0);
  }, [filtroNivel, filtroTipo, pageSize]);

  const getNivelBadge = (nivel: NivelLog) => {
    switch (nivel) {
      case "ERROR":
        return "bg-red-100 text-red-800 border-red-200";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INFO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "AUDIT":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getTipoBadge = (tipo: TipoLog) => {
    return tipo === "sistema"
      ? "bg-sky-100 text-sky-800 border-sky-200"
      : "bg-indigo-100 text-indigo-800 border-indigo-200";
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderDetalles = (log: LogEntry) => {
    if (log.tipo === "sistema" && log.detalles_sistema) {
      return (
        <div className="mt-2 text-xs bg-slate-50 rounded p-2">
          <div className="font-semibold text-slate-700">
            {log.detalles_sistema.mensaje}
          </div>
          <div className="text-slate-600 mt-1">
            Servicio: <span className="font-mono">{log.detalles_sistema.servicio}</span>
          </div>
          {log.detalles_sistema.contexto && Object.keys(log.detalles_sistema.contexto).length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sky-600 hover:text-sky-700">
                Ver contexto
              </summary>
              <pre className="mt-1 text-xs bg-white rounded p-2 overflow-x-auto">
                {JSON.stringify(log.detalles_sistema.contexto, null, 2)}
              </pre>
            </details>
          )}
        </div>
      );
    }

    if (log.tipo === "auditoria" && log.detalles_auditoria) {
      const audit = log.detalles_auditoria;
      return (
        <div className="mt-2 text-xs bg-purple-50 rounded p-2">
          <div className="font-semibold text-purple-900">
            {audit.operacion.toUpperCase()} - {audit.entidad}
          </div>
          <div className="text-purple-800 mt-1">
            Usuario: <span className="font-mono">{audit.usuario_correo}</span>
          </div>
          <div className="text-purple-800">
            Entidad ID: <span className="font-mono">{audit.entidad_id}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(audit.valores_previos).length > 0 && (
              <details>
                <summary className="cursor-pointer text-purple-600 hover:text-purple-700">
                  Valores anteriores
                </summary>
                <pre className="mt-1 text-xs bg-white rounded p-2 overflow-x-auto">
                  {JSON.stringify(audit.valores_previos, null, 2)}
                </pre>
              </details>
            )}
            {Object.keys(audit.valores_nuevos).length > 0 && (
              <details>
                <summary className="cursor-pointer text-purple-600 hover:text-purple-700">
                  Valores nuevos
                </summary>
                <pre className="mt-1 text-xs bg-white rounded p-2 overflow-x-auto">
                  {JSON.stringify(audit.valores_nuevos, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Trazas del Sistema
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Logs de auditoría y eventos del sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Nivel:</label>
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="todos">Todos</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="AUDIT">AUDIT</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="todos">Todos</option>
            <option value="sistema">Sistema</option>
            <option value="auditoria">Auditoría</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">
            Registros por página:
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <button
          onClick={() => fetchLogs(currentPage)}
          className="ml-auto px-4 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm font-medium"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div className="text-sm text-slate-600">
          Mostrando {logs.length} de {totalElements} registros totales
        </div>
        <div className="text-sm text-slate-600">
          Página {currentPage + 1} de {totalPages}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Logs List */}
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p className="mt-2 text-sm text-slate-600">Cargando logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          No se encontraron logs con los filtros seleccionados
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.registro_id}
              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
            >
              {/* Header del log */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getNivelBadge(
                      log.nivel
                    )}`}
                  >
                    {log.nivel}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTipoBadge(
                      log.tipo
                    )}`}
                  >
                    {log.tipo === "sistema" ? "🔧 Sistema" : "📋 Auditoría"}
                  </span>
                </div>
                <div className="text-xs text-slate-500 text-right flex-shrink-0">
                  <div>{formatFecha(log.marca_tiempo)}</div>
                  <div className="font-mono text-xs text-slate-400 mt-1">
                    ID: {log.registro_id.substring(0, 8)}
                  </div>
                </div>
              </div>

              {/* Detalles */}
              {renderDetalles(log)}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchLogs(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i;
              if (totalPages > 5 && currentPage > 2) {
                pageNum = currentPage - 2 + i;
                if (pageNum >= totalPages) pageNum = totalPages - 5 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => fetchLogs(pageNum)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    currentPage === pageNum
                      ? "bg-sky-600 text-white"
                      : "border border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => fetchLogs(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default LogsViewer;
