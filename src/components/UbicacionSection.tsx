import React, { useState } from "react";
import type { CrearIncidenteRequest } from "../services/incidentes/incidentes";

type UbicacionSectionProps = {
  piso: number;
  ubicacion: CrearIncidenteRequest["ubicacion"];
  onChangePiso: (piso: number) => void;
  onChangeUbicacion: (ubicacion: { x: number; y: number }) => void;
};

const UbicacionSection: React.FC<UbicacionSectionProps> = ({
  piso,
  ubicacion,
  onChangePiso,
  onChangeUbicacion,
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsGettingLocation(true);
    setStatus("idle");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Asumimos: x = longitud, y = latitud
        onChangeUbicacion({
          x: longitude,
          y: latitude,
        });

        setIsGettingLocation(false);
        setStatus("success");
      },
      (error) => {
        setIsGettingLocation(false);
        setStatus("error");

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "No se obtuvo permiso para usar la ubicación. Revisa los permisos del navegador."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("La ubicación no está disponible en este momento.");
            break;
          case error.TIMEOUT:
            setLocationError(
              "La solicitud de ubicación tardó demasiado. Intenta nuevamente."
            );
            break;
          default:
            setLocationError("Ocurrió un error al obtener la ubicación.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div className="border-t border-slate-200 pt-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Ubicación
        </h3>
        <div className="flex items-center gap-3">
          {status === "success" && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="text-lg leading-none">✓</span>
              Ubicación obtenida
            </span>
          )}
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGettingLocation ? "Obteniendo ubicación..." : "Obtener mi ubicación"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Piso (editable como antes) */}
        <div>
          <label
            htmlFor="piso"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Piso *
          </label>
          <input
            type="number"
            id="piso"
            name="piso"
            value={piso}
            onChange={(e) =>
              onChangePiso(parseInt(e.target.value, 10) || 1)
            }
            required
            min={1}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          />
        </div>

        {/* Latitud (solo lectura) */}
        <div>
          <label
            htmlFor="latitud"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Latitud
          </label>
          <input
            type="number"
            id="latitud"
            value={ubicacion.y || ""}
            readOnly
            className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg text-slate-700 focus:outline-none"
            placeholder="Aún sin ubicación"
          />
        </div>

        {/* Longitud (solo lectura) */}
        <div>
          <label
            htmlFor="longitud"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Longitud
          </label>
          <input
            type="number"
            id="longitud"
            value={ubicacion.x || ""}
            readOnly
            className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg text-slate-700 focus:outline-none"
            placeholder="Aún sin ubicación"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Usaremos la ubicación de tu dispositivo para asociar el incidente al lugar donde te encuentras.
      </p>

      {status === "error" && locationError && (
        <p className="mt-3 text-xs text-red-600">
          {locationError}
        </p>
      )}
    </div>
  );
};

export default UbicacionSection;
