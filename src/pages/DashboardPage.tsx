// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import DashboardEstudiante from "./DashboardEstudiante";
import DashboardPersonal from "./DashboardPersonal";
import DashboardAutoridad from "./DashboardAutoridad";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuthContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        if (session) {
          const userResponse = await getMyUser();
          setUsuario(userResponse.data.usuario);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuario();
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard según el rol
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No se pudo cargar la información del usuario</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Renderizar el dashboard correspondiente según el rol
  switch (usuario.rol) {
    case "estudiante":
      return <DashboardEstudiante />;
    case "personal_administrativo":
      return <DashboardPersonal />;
    case "autoridad":
      return <DashboardAutoridad />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">Rol no reconocido</p>
          </div>
        </div>
      );
  }
};

export default DashboardPage;
