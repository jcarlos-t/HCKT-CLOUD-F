import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AnonymousRoute } from "./AnonymousRoute";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import WelcomePage from "../pages/WelcomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import CrearReportePage from "../pages/CrearReportePage";
import App from "../App";
import PerfilEstudiantePage from "../pages/PerfilEstudiantePage";
import MisReportesPage from "../pages/MisReportesPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Página de bienvenida (accesible siempre)
      { 
        index: true, 
        element: <WelcomePage /> 
      },

      // Rutas de autenticación
      {
        path: "auth",
        element: <AnonymousRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      // Rutas protegidas - Dashboard principal (accesible a todos los roles autenticados)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
        ],
      },

      // Rutas solo para estudiantes
      {
        element: <RoleProtectedRoute allowedRoles={["estudiante"]} />,
        children: [
          { path: "dashboard/reportar", element: <CrearReportePage /> },
          { path: "dashboard/mis-reportes", element: <MisReportesPage /> },
          { path: "dashboard/perfil", element: <PerfilEstudiantePage /> },
        ],
      },

      // 404 - redirigir a inicio
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);