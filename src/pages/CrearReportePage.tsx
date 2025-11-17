import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  crearIncidente,
  type CrearIncidenteRequest,
  type TipoIncidente,
  type NivelUrgencia,
} from "../services/incidentes/incidentes";
import UbicacionSection from "../components/UbicacionSection";

const CrearReportePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<CrearIncidenteRequest>({
    titulo: "",
    descripcion: "",
    piso: 1,
    ubicacion: { x: 0, y: 0 },
    tipo: "mantenimiento",
    nivel_urgencia: "medio",
  });
  

  const tiposIncidente: { value: TipoIncidente; label: string }[] = [
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "TI", label: "TI" },
    { value: "limpieza", label: "Limpieza" },
    { value: "otro", label: "Otros" },
  ];

  const nivelesUrgencia: { value: NivelUrgencia; label: string }[] = [
    { value: "bajo", label: "Baja" },
    { value: "medio", label: "Media" },
    { value: "alto", label: "Alta" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setIsSubmitting(true);
      await crearIncidente(formData as any);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al crear incidente:", err);
      setError("No se pudo crear el reporte. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "piso") {
      setFormData((prev) => ({
        ...prev,
        piso: parseInt(value, 10) || 1,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-600 hover:text-sky-600 transition"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Nuevo Reporte
              </h1>
              <p className="text-sm text-slate-500">
                Reporta un incidente en el campus
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 md:p-8"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Título del Incidente *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                placeholder="Ej: Fuga de agua en el segundo piso"
              />
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition resize-none"
                placeholder="Describe el incidente con el mayor detalle posible..."
              />
            </div>

            {/* Tipo y Urgencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Tipo de Incidente *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition bg-white"
                >
                  {tiposIncidente.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="nivel_urgencia"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Nivel de Urgencia *
                </label>
                <select
                  id="nivel_urgencia"
                  name="nivel_urgencia"
                  value={formData.nivel_urgencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition bg-white"
                >
                  {nivelesUrgencia.map((nivel) => (
                    <option key={nivel.value} value={nivel.value}>
                      {nivel.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ubicación con geolocalización */}
            <UbicacionSection
              piso={formData.piso}
              ubicacion={formData.ubicacion}
              onChangePiso={(piso) =>
                setFormData((prev) => ({
                  ...prev,
                  piso,
                }))
              }
              onChangeUbicacion={(ubicacion) =>
                setFormData((prev) => ({
                  ...prev,
                  ubicacion,
                }))
              }
            />

            {/* Buttons */}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creando reporte..." : "Crear Reporte"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-white text-slate-700 border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CrearReportePage;
