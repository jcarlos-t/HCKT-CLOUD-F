// src/components/UbicacionSection.tsx
import React, { useState } from "react";
import type { CrearIncidenteRequest } from "../services/incidentes/incidentes";

type UbicacionSectionProps = {
  piso: number;
  ubicacion: CrearIncidenteRequest["ubicacion"];
  onChangePiso: (piso: number) => void;
  onChangeUbicacion: (ubicacion: { x: number; y: number }) => void;
};

type ModoUbicacion = "imagen" | "coords";

const UbicacionSection: React.FC<UbicacionSectionProps> = ({
  piso,
  ubicacion,
  onChangePiso,
  onChangeUbicacion,
}) => {
  const [modo, setModo] = useState<ModoUbicacion>("imagen");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  // Mapea el piso a una imagen en /public
  const getFloorImageSrc = (p: number): string | null => {
    if (p >= 1 && p <= 11) {
      const num = p.toString().padStart(2, "0"); // 1 -> "01"
      return `/PISO-${num}.jpeg`;
    }
    // Aquí podrías extender para sótanos / techo:
    if (p === -1) return "/SOTANO-01.jpeg";
    if (p === -2) return "/SOTANO-02.jpeg";
    if (p === 12) return "/TECHO.jpeg";
    return null;
  };

  const floorImageSrc = getFloorImageSrc(piso);

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

  // Click en el plano para colocar el pin
  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (rect.width <= 0 || rect.height <= 0) return;

    // Normalizamos a [0,1] sobre la imagen
    const normalizedX = clickX / rect.width;
    const normalizedY = clickY / rect.height;

    onChangeUbicacion({
      x: parseFloat(normalizedX.toFixed(6)),
      y: parseFloat(normalizedY.toFixed(6)),
    });

    setStatus("success");
    setLocationError(null);
  };

  const hasValidImagePosition =
    typeof ubicacion.x === "number" &&
    typeof ubicacion.y === "number" &&
    ubicacion.x >= 0 &&
    ubicacion.x <= 1 &&
    ubicacion.y >= 0 &&
    ubicacion.y <= 1;

  return (
    <div className="border-t border-slate-200 pt-6 space-y-4">
      {/* Header + selector de modo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Ubicación</h3>

        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setModo("imagen")}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
              modo === "imagen"
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Posición en imagen
          </button>
          <button
            type="button"
            onClick={() => setModo("coords")}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
              modo === "coords"
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Latitud / Longitud
          </button>

          {status === "success" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="text-lg leading-none">✓</span>
              Ubicación establecida
            </span>
          )}
        </div>
      </div>

      {/* Piso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  onChange={(e) => {
    const value = parseInt(e.target.value, 10);
    // valor por defecto si no es número
    onChangePiso(Number.isNaN(value) ? 1 : value);
  }}
  required
  min={-2}
  max={12}
  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
/>
<p className="mt-1 text-xs text-slate-500">
  Usa valores entre -2 y 12. Los negativos son sótanos (-1: Sótano 1, -2: Sótano 2).
</p>

        </div>

        {/* Modo coordenadas: inputs + botón de geolocalización */}
        {modo === "coords" && (
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="longitud"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Longitud (x)
                </label>
                <input
                  type="number"
                  id="longitud"
                  value={ubicacion.x ?? ""}
                  onChange={(e) =>
                    onChangeUbicacion({
                      x: parseFloat(e.target.value),
                      y: ubicacion.y,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                  placeholder="Ej: -77.050..."
                />
              </div>

              <div>
                <label
                  htmlFor="latitud"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Latitud (y)
                </label>
                <input
                  type="number"
                  id="latitud"
                  value={ubicacion.y ?? ""}
                  onChange={(e) =>
                    onChangeUbicacion({
                      x: ubicacion.x,
                      y: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                  placeholder="Ej: -12.090..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGettingLocation
                  ? "Obteniendo ubicación..."
                  : "Obtener mi ubicación"}
              </button>
              <p className="text-xs text-slate-500">
                Usamos la ubicación de tu dispositivo (x = longitud, y = latitud).
              </p>
            </div>

            {status === "error" && locationError && (
              <p className="mt-1 text-xs text-red-600">{locationError}</p>
            )}
          </div>
        )}
      </div>

      {/* Modo imagen: plano + pin clicable */}
      {modo === "imagen" && (
        <div className="space-y-2">
          {floorImageSrc ? (
            <>
              <div
                className="relative w-full max-h-[520px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50 cursor-crosshair"
                onClick={handleImageClick}
              >
                {/* Imagen del piso */}
                <img
                  src={floorImageSrc}
                  alt={`Plano del piso ${piso}`}
                  className="w-full h-full object-contain select-none pointer-events-none"
                />

                {/* Pin */}
                {hasValidImagePosition && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${ubicacion.x * 100}%`,
                      top: `${ubicacion.y * 100}%`,
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-red-600 text-xl">📍</span>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/90 border border-slate-200 text-slate-600 shadow-sm">
                        x: {ubicacion.x.toFixed(2)} · y: {ubicacion.y.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Haz clic en el plano para colocar el pin. En este modo,{" "}
                <code>x</code> y <code>y</code> representan la posición relativa en
                la imagen (valores entre 0 y 1).
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No se encontró un plano para el piso {piso}. Verifica que exista un
              archivo <code>PISO-0{piso}.jpeg</code> en la carpeta <code>public/</code>.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UbicacionSection;
