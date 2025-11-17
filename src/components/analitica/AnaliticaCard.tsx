// src/components/AnaliticaCard.tsx
import React from "react";

interface AnaliticaCardProps {
  titulo: string;
  valor: string | number;
  icono: string;
  color?: "sky" | "green" | "yellow" | "blue" | "red" | "purple";
  subtitulo?: string;
}

const AnaliticaCard: React.FC<AnaliticaCardProps> = ({
  titulo,
  valor,
  icono,
  color = "sky",
  subtitulo,
}) => {
  const colorClasses = {
    sky: "bg-sky-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    blue: "bg-blue-100",
    red: "bg-red-100",
    purple: "bg-purple-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{titulo}</p>
          <p className="text-3xl font-bold text-slate-900">{valor}</p>
          {subtitulo && (
            <p className="text-xs text-slate-500 mt-1">{subtitulo}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
        >
          <span className="text-2xl">{icono}</span>
        </div>
      </div>
    </div>
  );
};

export default AnaliticaCard;
