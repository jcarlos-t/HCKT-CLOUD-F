// src/components/SeleccionarEmpleadoModal.tsx
import React, { useEffect, useState } from "react";
import {
  listarEmpleados,
  type Empleado,
  type ListarEmpleadosRequest,
} from "../services/empleados/empleados";

interface SeleccionarEmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (correoEmpleado: string) => void;
}

const SeleccionarEmpleadoModal: React.FC<SeleccionarEmpleadoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCorreo, setSelectedCorreo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchEmpleados = async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload: ListarEmpleadosRequest = {
        limit: 10,
        size: 10,
        estado: "activo",
        last_key: reset ? null : lastKey ?? undefined,
      };

      const response = await listarEmpleados(payload);
      const nuevos = response.data.empleados ?? [];

      setEmpleados((prev) => (reset ? nuevos : [...prev, ...nuevos]));
      setLastKey(response.data.last_key ?? null);
      setHasMore(Boolean(response.data.last_key));
    } catch (err) {
      console.error("Error al listar empleados:", err);
      setError("No se pudieron cargar los empleados. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cada vez que se abre el modal, reseteamos y cargamos la primera página
  useEffect(() => {
    if (isOpen) {
      setEmpleados([]);
      setLastKey(null);
      setHasMore(true);
      setSelectedCorreo(null);
      fetchEmpleados(true);
    }
  }, [isOpen]);

  const filteredEmpleados = empleados.filter((e) =>
    e.contacto?.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedCorreo) {
      alert("Por favor selecciona un empleado");
      return;
    }
    onConfirm(selectedCorreo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Seleccionar empleado
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Elige el empleado al que se asignará este incidente.
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="border rounded-xl max-h-72 overflow-y-auto mb-4">
          {isLoading && empleados.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">
              Cargando empleados...
            </div>
          )}

          {!isLoading && empleados.length === 0 && !error && (
            <div className="p-4 text-center text-slate-500 text-sm">
              No se encontraron empleados activos.
            </div>
          )}

          {!isLoading && filteredEmpleados.length === 0 && empleados.length > 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">
              No se encontraron empleados con ese correo.
            </div>
          )}

          <ul className="divide-y divide-slate-100">
            {filteredEmpleados
              .filter((e) => e.contacto?.correo)
              .map((empleado) => {
                const correo = empleado.contacto!.correo;
                const isSelected = selectedCorreo === correo;

                return (
                  <li
                    key={empleado.empleado_id ?? correo}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                      isSelected ? "bg-sky-50" : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedCorreo(correo)}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {empleado.nombre}
                      </p>
                      <p className="text-xs text-slate-500">
                        {empleado.tipo_area.toUpperCase()} · {correo}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-sky-600 bg-sky-600"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <span className="block w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => fetchEmpleados(false)}
            disabled={isLoading}
            className="w-full mb-4 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-60"
          >
            {isLoading ? "Cargando..." : "Cargar más"}
          </button>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-60"
            disabled={!selectedCorreo}
          >
            Confirmar asignación
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeleccionarEmpleadoModal;
