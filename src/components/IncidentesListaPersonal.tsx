// src/components/IncidentesListaPersonal.tsx
import React, { useState } from "react";
import {
  type Incidente,
  type EstadoIncidente,
  type TipoIncidente,
  type NivelUrgencia,
} from "../services/incidentes/incidentes";

interface Props {
  incidentes: Incidente[];
  onCambiarEstado: (incidenteId: string, nuevoEstado: EstadoIncidente) => void;
  onAbrirCompletar: (incidente: Incidente) => void;
  // opcional: callback para aplicar filtros desde este componente
  onApplyFilters?: (filters: {
    estado?: EstadoIncidente | "";
    tipo?: TipoIncidente | "";
    nivel_urgencia?: NivelUrgencia | "";
  }) => void | Promise<void>;
}

const getEstadoColor = (estado?: EstadoIncidente) => {
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

const getEstadoLabel = (estado?: EstadoIncidente) => {
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

const IncidentesListaPersonal: React.FC<Props> = ({
  incidentes,
  onCambiarEstado,
  onAbrirCompletar,
  onApplyFilters,
}) => {
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [tipoFilter, setTipoFilter] = useState<string>("");
  const [urgenciaFilter, setUrgenciaFilter] = useState<string>("");

  const aplicar = async () => {
    if (onApplyFilters) {
      await onApplyFilters({
        estado: estadoFilter as any,
        tipo: tipoFilter as any,
        nivel_urgencia: urgenciaFilter as any,
      });
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Todos los Incidentes
      </h3>
      {/* Filtros rápidos */}
      <div className="flex gap-3 mb-4">
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

        <button
          onClick={aplicar}
          className="px-3 py-1 bg-sky-600 text-white rounded"
        >
          Aplicar
        </button>
      </div>

      {incidentes.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No hay incidentes reportados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidentes.map((incidente) => (
            <div
              key={incidente.incidente_id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {incidente.titulo}
                      </h4>
                      <p className="text-sm text-slate-500">
                        ID: {incidente.incidente_id}
                      </p>
                      {incidente.usuario_correo && (
                        <p className="text-sm text-slate-500">
                          Reportado por: {incidente.usuario_correo}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        incidente.estado
                      )}`}
                    >
                      {getEstadoLabel(incidente.estado)}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-3">
                    {incidente.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>
                      📍 Piso {incidente.piso} - ({incidente.ubicacion.x},{" "}
                      {incidente.ubicacion.y})
                    </span>
                    <span>🏷️ {incidente.tipo}</span>
                    <span>⚡ {incidente.nivel_urgencia}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* “reportado” = pendiente de tomar */}
                  {incidente.estado === "reportado" && (
                    <button
                      onClick={() =>
                        onCambiarEstado(incidente.incidente_id, "en_progreso")
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Marcar en Progreso
                    </button>
                  )}

                  {incidente.estado === "en_progreso" && (
                    <button
                      onClick={() => onAbrirCompletar(incidente)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                    >
                      Completar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentesListaPersonal;
