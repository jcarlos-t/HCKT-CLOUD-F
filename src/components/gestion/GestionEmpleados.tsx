// src/components/gestion/GestionEmpleados.tsx
import React, { useEffect, useState } from "react";
import {
  listarEmpleados,
  crearEmpleado,
  modificarEmpleado,
  eliminarEmpleado,
  type Empleado,
  type TipoArea,
  type EstadoEmpleado,
} from "../../services/empleados/empleados";

const GestionEmpleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<EstadoEmpleado | "todos">("todos");

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    tipo_area: "ti" as TipoArea,
    estado: "activo" as EstadoEmpleado,
    contacto: {
      telefono: "",
      correo: "",
    },
  });

  const fetchEmpleados = async (reset = false) => {
    try {
      setIsLoading(true);
      const response = await listarEmpleados({
        limit: 20,
        size: 20,
        last_key: reset ? null : lastKey,
        estado: filtroEstado === "todos" ? undefined : filtroEstado,
      });

      if (reset) {
        setEmpleados(response.data.empleados);
      } else {
        setEmpleados((prev) => [...prev, ...response.data.empleados]);
      }

      setLastKey(response.data.last_key || null);
      setError(null);
    } catch (err: any) {
      console.error("Error al obtener empleados:", err);
      setError("Error al cargar empleados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados(true);
  }, [filtroEstado]);

  const handleOpenModal = (empleado?: Empleado) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      setFormData({
        nombre: empleado.nombre,
        tipo_area: empleado.tipo_area,
        estado: empleado.estado,
        contacto: empleado.contacto || { telefono: "", correo: "" },
      });
    } else {
      setEditingEmpleado(null);
      setFormData({
        nombre: "",
        tipo_area: "ti",
        estado: "activo",
        contacto: { telefono: "", correo: "" },
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmpleado) {
        await modificarEmpleado({
          empleado_id: editingEmpleado.empleado_id!,
          ...formData,
        });
        setSuccessMessage("Empleado actualizado exitosamente");
      } else {
        await crearEmpleado(formData);
        setSuccessMessage("Empleado creado exitosamente");
      }

      setShowModal(false);
      setEditingEmpleado(null);
      fetchEmpleados(true);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al guardar empleado");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (empleadoId: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar al empleado ${nombre}?`)) {
      return;
    }

    try {
      await eliminarEmpleado({ empleado_id: empleadoId });
      setSuccessMessage("Empleado eliminado exitosamente");
      fetchEmpleados(true);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al eliminar empleado");
      setTimeout(() => setError(null), 5000);
    }
  };

  const getAreaBadge = (area: string) => {
    switch (area) {
      case "ti":
        return "bg-blue-100 text-blue-800";
      case "mantenimiento":
        return "bg-orange-100 text-orange-800";
      case "limpieza":
        return "bg-green-100 text-green-800";
      case "seguridad":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getAreaLabel = (area: string) => {
    switch (area) {
      case "ti":
        return "TI";
      case "mantenimiento":
        return "Mantenimiento";
      case "limpieza":
        return "Limpieza";
      case "seguridad":
        return "Seguridad";
      default:
        return area;
    }
  };

  const getEstadoBadge = (estado: string) => {
    return estado === "activo"
      ? "bg-green-100 text-green-800"
      : "bg-slate-100 text-slate-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Gestión de Empleados
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Administra el personal técnico y administrativo
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium text-sm flex items-center gap-2"
        >
          <span>➕</span>
          Crear Empleado
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">
          Filtrar por estado:
        </label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                Nombre
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                Área
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                Estado
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                Contacto
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && empleados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                  </div>
                </td>
              </tr>
            ) : empleados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No hay empleados registrados
                </td>
              </tr>
            ) : (
              empleados.map((empleado) => (
                <tr
                  key={empleado.empleado_id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="py-3 px-4 text-sm text-slate-900">
                    {empleado.nombre}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAreaBadge(
                        empleado.tipo_area
                      )}`}
                    >
                      {getAreaLabel(empleado.tipo_area)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(
                        empleado.estado
                      )}`}
                    >
                      {empleado.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {empleado.contacto && (
                      <div className="text-xs">
                        <div>{empleado.contacto.correo}</div>
                        <div className="text-slate-500">
                          {empleado.contacto.telefono}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleOpenModal(empleado)}
                        className="text-sky-600 hover:text-sky-800 text-sm font-medium transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(empleado.empleado_id!, empleado.nombre)
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {lastKey && (
        <div className="mt-4 text-center">
          <button
            onClick={() => fetchEmpleados(false)}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-sky-600 hover:text-sky-800 font-medium transition"
          >
            {isLoading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {editingEmpleado ? "Editar Empleado" : "Crear Empleado"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Área
                </label>
                <select
                  value={formData.tipo_area}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_area: e.target.value as TipoArea,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="ti">TI</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="seguridad">Seguridad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as EstadoEmpleado,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Correo de Contacto
                </label>
                <input
                  type="email"
                  value={formData.contacto.correo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contacto: {
                        ...formData.contacto,
                        correo: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="contacto@utec.edu.pe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.contacto.telefono}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contacto: {
                        ...formData.contacto,
                        telefono: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="+51 900 000 000"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEmpleado(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
                >
                  {editingEmpleado ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEmpleados;
