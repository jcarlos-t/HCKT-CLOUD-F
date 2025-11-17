// src/router/RoleProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { getMyUser, type Usuario } from "../services/usuario/usuario";
import { useEffect, useState } from "react";

interface RoleProtectedRouteProps {
  allowedRoles: ("estudiante" | "personal_administrativo" | "autoridad")[];
}

export function RoleProtectedRoute({
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { session, isLoading: authLoading } = useAuthContext();
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

    if (session) {
      fetchUsuario();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session || !usuario) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(usuario.rol)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-slate-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

