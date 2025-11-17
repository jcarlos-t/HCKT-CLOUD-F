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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const tiposIncidente: { value: TipoIncidente; label: string }[] = [
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "infraestructura", label: "Infraestructura" },
    { value: "servicios", label: "Servicios" },
    { value: "emergencia", label: "Emergencia" },
    { value: "limpieza", label: "Limpieza" },
    { value: "otros", label: "Otros" },
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
      // Backend espera `evidencias` como un objeto con `file_base64` (no array).
      // Construimos un payload compatible sin cambiar los tipos del formulario.
      const payload: any = { ...formData };
      if (Array.isArray((formData as any).evidencias) && (formData as any).evidencias.length > 0) {
        payload.evidencias = (formData as any).evidencias[0];
      }

      await crearIncidente(payload as any);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al crear incidente:", err);
      setError("No se pudo crear el reporte. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is like: data:<mime>;base64,<base64data>
        const parts = result.split(",");
        if (parts.length === 2) {
          resolve(parts[1]);
        } else {
          // fallback: try to strip data: prefix if present
          const idx = result.indexOf("base64,");
          if (idx >= 0) resolve(result.substring(idx + 7));
          else resolve(result);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    try {
      const b64 = await fileToBase64(f);
      const evidencia = {
        filename: f.name,
        content_type: f.type || "image/png",
        file_base64: b64,
      };

      setFormData((prev) => ({ ...prev, evidencias: [evidencia] }));
      setSelectedFileName(f.name);
      // create preview data url for UI
      const previewReader = new FileReader();
      previewReader.onload = () => setPreviewDataUrl(previewReader.result as string);
      previewReader.readAsDataURL(f);
    } catch (err) {
      console.error("Error al procesar el archivo:", err);
      setError("No se pudo procesar la imagen seleccionada.");
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => {
      const copy = { ...prev } as any;
      delete copy.evidencias;
      return copy;
    });
    setSelectedFileName(null);
    setPreviewDataUrl(null);
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
            {/* Evidencia (imagen) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Evidencia (imagen)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                {selectedFileName && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{selectedFileName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
              {previewDataUrl && (
                <div className="mt-3">
                  <img src={previewDataUrl} alt="preview" className="max-h-48 rounded" />
                </div>
              )}
            </div>
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
