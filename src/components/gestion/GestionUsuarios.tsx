// src/components/gestion/GestionUsuarios.tsx
import React, { useEffect, useState } from "react";
import {
  listUsuarios,
  createUserAsAutoridad,
  deleteUserByCorreo,
  type Usuario,
} from "../../services/usuario/usuario";

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "estudiante" as "estudiante" | "personal_administrativo" | "autoridad",
  });

  const fetchUsuarios = async (reset = false) => {
    try {
      setIsLoading(true);
      const response = await listUsuarios({
        limit: 20,
        size: 20,
        last_key: reset ? null : lastKey,
      });
      
      if (reset) {
        setUsuarios(response.data.usuarios);
      } else {
        setUsuarios((prev) => [...prev, ...response.data.usuarios]);
      }
      
      setLastKey(response.data.last_key || null);
      setError(null);
    } catch (err: any) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(true);
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserAsAutoridad(formData);
      setSuccessMessage("Usuario creado exitosamente");
      setShowModal(false);
      setFormData({
        nombre: "",
        correo: "",
        contrasena: "",
        rol: "estudiante",
      });
      fetchUsuarios(true);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al crear usuario");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteUser = async (correo: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario ${correo}?`)) {
      return;
    }

    try {
      await deleteUserByCorreo(correo);
      setSuccessMessage("Usuario eliminado exitosamente");
      fetchUsuarios(true);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al eliminar usuario");
      setTimeout(() => setError(null), 5000);
    }
  };

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case "estudiante":
        return "bg-blue-100 text-blue-800";
      case "personal_administrativo":
        return "bg-purple-100 text-purple-800";
      case "autoridad":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case "estudiante":
        return "Estudiante";
      case "personal_administrativo":
        return "Personal Adm.";
      case "autoridad":
        return "Autoridad";
      default:
        return rol;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Gestión de Usuarios
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium text-sm flex items-center gap-2"
        >
          <span>➕</span>
          Crear Usuario
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                Nombre
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                Correo
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                Rol
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                  </div>
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.correo}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="py-3 px-4 text-sm text-slate-900">
                    {usuario.nombre}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {usuario.correo}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRolBadge(
                        usuario.rol
                      )}`}
                    >
                      {getRolLabel(usuario.rol)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteUser(usuario.correo)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      Eliminar
                    </button>
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
            onClick={() => fetchUsuarios(false)}
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Crear Usuario
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
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
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="usuario@utec.edu.pe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={formData.contrasena}
                  onChange={(e) =>
                    setFormData({ ...formData, contrasena: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rol: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="personal_administrativo">
                    Personal Administrativo
                  </option>
                  <option value="autoridad">Autoridad</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
