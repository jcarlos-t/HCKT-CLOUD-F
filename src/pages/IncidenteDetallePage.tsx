import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarIncidente, type Incidente } from "../services/incidentes/incidentes";

const IncidenteDetallePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidente, setIncidente] = useState<Incidente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const s3ToHttp = (s3url?: string) => {
    if (!s3url) return null;
    // s3://bucket/key
    if (s3url.startsWith("s3://")) {
      const parts = s3url.replace("s3://", "").split("/");
      const bucket = parts.shift();
      const key = parts.join("/");
      if (!bucket || !key) return null;
      return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
    return s3url;
  };

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const resp = await buscarIncidente({ incidente_id: id });
        setIncidente(resp.data.incidente || null);
      } catch (err: any) {
        console.error("Error al obtener incidente:", err);
        setError(err?.message || "No se pudo cargar el incidente");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-3 py-2 border rounded">Volver</button>
      </div>
    );

  if (!incidente)
    return (
      <div className="p-6">
        <p>No se encontró el incidente.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-3 py-2 border rounded">Volver</button>
      </div>
    );

  const evidencia = (incidente as any).evidencias ? ((incidente as any).evidencias[0] || (incidente as any).evidencias) : null;
  let evidenciaUrl: string | null = null;
  if (typeof evidencia === "string") evidenciaUrl = s3ToHttp(evidencia);
  else if (evidencia && typeof evidencia === "object" && evidencia.file_base64) {
    // If backend stored object with base64 (unlikely), build data URL
    evidenciaUrl = `data:${(evidencia.content_type || 'image/png')};base64,${evidencia.file_base64}`;
  } else if (evidencia && typeof evidencia === "object" && evidencia.startsWith) {
    evidenciaUrl = s3ToHttp(evidencia as any);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 p-6">
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{incidente.titulo}</h2>
            <p className="text-sm text-slate-500">ID: {incidente.incidente_id}</p>
          </div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(incidente.estado)}`}>
              {getEstadoLabel(incidente.estado)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-700">{incidente.descripcion}</p>
          <div className="text-sm text-slate-500 mt-2">Piso {incidente.piso}</div>
          <div className="text-sm text-slate-500">Tipo: {incidente.tipo} • Urgencia: {incidente.nivel_urgencia}</div>
          <div className="text-sm text-slate-500 mt-2">Creado: {incidente.created_at}</div>
        </div>

        {evidenciaUrl && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Evidencia</h3>
            <div className="border rounded p-3">
              <img src={evidenciaUrl} alt="evidencia" className="max-h-96 object-contain w-full" />
              <div className="mt-2 text-right">
                <a href={evidenciaUrl} target="_blank" rel="noreferrer" className="text-sky-600 underline">
                  Abrir en nueva ventana
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded">Volver</button>
        </div>
      </div>
    </div>
  );
};

export default IncidenteDetallePage;
