// src/pages/DashboardPersonal.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import {
  listarIncidentes,
  actualizarEstadoIncidente,
  type Incidente,
  type EstadoIncidente,
} from "../services/incidentes/incidentes";

import IncidentesStatsPersonal from "../components/IncidentesStatsPersonal";
import IncidentesListaPersonal from "../components/IncidentesListaPersonal";
import CompletarIncidenteModal from "../components/CompletarIncidenteModal";
import SeleccionarEmpleadoModal from "../components/SeleccionarEmpleadoModal"; // ⬅️ nuevo

const DashboardPersonal: React.FC = () => {
  const navigate = useNavigate();
  const { logout, session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(
    null
  );
  const [showCompletarModal, setShowCompletarModal] = useState(false);
  const [detallesCompletado, setDetallesCompletado] = useState("");

  // ⬇️ estados para asignar empleado cuando pasa a "en_progreso"
  const [incidenteParaAsignar, setIncidenteParaAsignar] =
    useState<Incidente | null>(null);
  const [showSeleccionarEmpleadoModal, setShowSeleccionarEmpleadoModal] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const userResponse = await getMyUser();
          setUsuario(userResponse.data.usuario);

          const incidentesResponse = await listarIncidentes(
            { page: 0, size: 100 },
            userResponse.data.usuario.rol,
          );
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

  const recargarIncidentes = async () => {
    const incidentesResponse = await listarIncidentes(
      { page: 0, size: 100 },
      usuario?.rol,
    );
    setIncidentes(incidentesResponse.data.contents);
  };

  // aplicar filtros desde la UI de la lista personal
  const handleApplyFilters = async (filters: {
    estado?: string;
    tipo?: string;
    nivel_urgencia?: string;
  }) => {
    const payload: any = {
      page: 0,
      size: 100,
    };
    if (filters.estado) payload.estado = filters.estado;
    if (filters.tipo) payload.tipo = filters.tipo;
    if (filters.nivel_urgencia) payload.nivel_urgencia = filters.nivel_urgencia;

    const incidentesResponse = await listarIncidentes(payload, usuario?.rol);
    setIncidentes(incidentesResponse.data.contents || []);
  };

  const handleCambiarEstado = async (
    incidenteId: string,
    nuevoEstado: EstadoIncidente
  ) => {
    // Si el nuevo estado es "en_progreso", abrimos el modal para seleccionar empleado
    if (nuevoEstado === "en_progreso") {
      const incidente = incidentes.find(
        (i) => i.incidente_id === incidenteId
      );
      if (!incidente) return;

      setIncidenteParaAsignar(incidente);
      setShowSeleccionarEmpleadoModal(true);
      return;
    }

    // Para otros estados (si aplica), se actualiza directo
    try {
      const payload: any = {
        incidente_id: incidenteId,
        estado: nuevoEstado,
      };

      await actualizarEstadoIncidente(payload);
      await recargarIncidentes();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("No se pudo actualizar el estado del incidente");
    }
  };

  const handleAbrirCompletar = (incidente: Incidente) => {
    setSelectedIncidente(incidente);
    setShowCompletarModal(true);
  };

  const handleCompletar = async () => {
    if (!selectedIncidente || !detallesCompletado.trim()) {
      alert("Por favor ingresa los detalles de la solución");
      return;
    }

    try {
      await actualizarEstadoIncidente({
        incidente_id: selectedIncidente.incidente_id,
        estado: "resuelto",
        comentario_resolucion: detallesCompletado,
        // opcional: empleado_correo: usuario?.correo,
      });

      await recargarIncidentes();

      setShowCompletarModal(false);
      setSelectedIncidente(null);
      setDetallesCompletado("");
    } catch (error) {
      console.error("Error al completar incidente:", error);
      alert("No se pudo completar el incidente");
    }
  };

  // ⬇️ cuando el usuario elige un empleado en el modal
  const handleConfirmEmpleado = async (correoEmpleado: string) => {
    if (!incidenteParaAsignar) return;

    try {
      await actualizarEstadoIncidente({
        incidente_id: incidenteParaAsignar.incidente_id,
        estado: "en_progreso",
        empleado_correo: correoEmpleado, // correo seleccionado del modal
      });

      await recargarIncidentes();

      setShowSeleccionarEmpleadoModal(false);
      setIncidenteParaAsignar(null);
    } catch (error) {
      console.error("Error al asignar empleado:", error);
      alert("No se pudo asignar el empleado al incidente");
    }
  };

  const estadisticas = {
    pendientes: incidentes.filter((i) => i.estado === "reportado").length,
    enProgreso: incidentes.filter((i) => i.estado === "en_progreso").length,
    resueltos: incidentes.filter((i) => i.estado === "resuelto").length,
    total: incidentes.length,
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
                <p className="text-xs text-slate-500">
                  Panel de Personal Administrativo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {usuario && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {usuario.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      Personal Administrativo
                    </p>
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
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Gestión de Incidentes
          </h2>
          <p className="text-slate-600">
            Administra todos los incidentes reportados en el campus.
          </p>
        </div>

        <IncidentesStatsPersonal estadisticas={estadisticas} />

        <IncidentesListaPersonal
          incidentes={incidentes}
          onCambiarEstado={handleCambiarEstado}
          onAbrirCompletar={handleAbrirCompletar}
          onApplyFilters={handleApplyFilters}
        />
      </main>

      <CompletarIncidenteModal
        isOpen={showCompletarModal}
        incidente={selectedIncidente}
        detalles={detallesCompletado}
        onChangeDetalles={setDetallesCompletado}
        onConfirm={handleCompletar}
        onClose={() => {
          setShowCompletarModal(false);
          setSelectedIncidente(null);
          setDetallesCompletado("");
        }}
      />

      <SeleccionarEmpleadoModal
        isOpen={showSeleccionarEmpleadoModal}
        onClose={() => {
          setShowSeleccionarEmpleadoModal(false);
          setIncidenteParaAsignar(null);
        }}
        onConfirm={handleConfirmEmpleado}
      />
    </div>
  );
};

export default DashboardPersonal;
