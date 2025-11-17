// src/components/TriggerETLButton.tsx
import React, { useState } from "react";
import { triggerETL } from "../../services/analitica/analitica";

interface TriggerETLButtonProps {
  onSuccess?: () => void;
}

const TriggerETLButton: React.FC<TriggerETLButtonProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrigger = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      setError(null);

      const response = await triggerETL();
      setMessage(response.data.message);

      if (onSuccess) {
        // Esperar 3 segundos antes de llamar onSuccess para recargar datos
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }

      // Limpiar mensaje después de 10 segundos
      setTimeout(() => {
        setMessage(null);
      }, 10000);
    } catch (err: any) {
      console.error("Error al disparar ETL:", err);
      setError(
        err?.response?.data?.message || "Error al iniciar el proceso ETL"
      );

      // Limpiar error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={handleTrigger}
        disabled={isLoading}
        className={`
          px-6 py-3 rounded-lg font-medium text-sm transition-all
          ${
            isLoading
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-sky-600 text-white hover:bg-sky-700 active:scale-95"
          }
          focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
        `}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Iniciando ETL...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>🔄</span>
            Actualizar Datos Analíticos
          </span>
        )}
      </button>

      {!message && !error && (
        <p className="text-xs text-slate-500 text-center max-w-xs">
          <span className="inline-block">⏰</span> El proceso ETL se ejecuta automáticamente cada día a medianoche
        </p>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md">
          <p className="text-sm text-green-800 font-medium">{message}</p>
          <p className="text-xs text-green-600 mt-1">
            Los datos se actualizarán en 3-5 minutos
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md">
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TriggerETLButton;
