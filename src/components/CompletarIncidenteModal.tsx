// src/components/CompletarIncidenteModal.tsx
import React from "react";
import { type Incidente } from "../services/incidentes/incidentes";

interface Props {
  isOpen: boolean;
  incidente: Incidente | null;
  detalles: string;
  onChangeDetalles: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const CompletarIncidenteModal: React.FC<Props> = ({
  isOpen,
  incidente,
  detalles,
  onChangeDetalles,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !incidente) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Completar Incidente
        </h3>
        <p className="text-slate-600 mb-2">
          <strong>Incidente:</strong> {incidente.titulo}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Detalles de la Solución *
          </label>
          <textarea
            value={detalles}
            onChange={(e) => onChangeDetalles(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
            placeholder="Describe cómo se resolvió el incidente, qué acciones se tomaron, materiales utilizados, etc."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Completar y Enviar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white text-slate-700 border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletarIncidenteModal;
