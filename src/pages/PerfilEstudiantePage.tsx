// src/pages/PerfilEstudiantePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyUser,
  updateMyUser,
  deleteUserByCorreo,
  changeMyPassword,
  type Usuario,
  type UpdateMyUserRequest,
} from "../services/usuario/usuario";
import { useAuthContext } from "../contexts/AuthContext";

const PerfilEstudiantePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyUser();
        setUsuario(res.data.usuario);
        setNombre(res.data.usuario.nombre);
        setCorreo(res.data.usuario.correo);
      } catch (error: unknown) {
        console.error("Error cargando usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const isValidName = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length < 3) return false;
    const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s'.-]+$/;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return false;
    return nameRegex.test(trimmed);
  };

  const isValidEmail = (value: string): boolean => {
    const trimmed = value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(trimmed);
    // Si quieres solo @utec.edu.pe:
    // return /^[a-zA-Z0-9._%+-]+@utec\.edu\.pe$/i.test(trimmed);
  };

  const isValidPassword = (value: string): string | null => {
    if (value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    if (/\s/.test(value)) {
      return "La contraseña no debe contener espacios";
    }
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return "La contraseña debe incluir al menos una letra y un número";
    }
    return null;
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuario) return;

    setProfileMessage(null);

    if (!isValidName(nombre)) {
      setProfileMessage(
        "Ingresa un nombre completo válido (solo letras, mínimo nombre y apellido)",
      );
      return;
    }

    if (!isValidEmail(correo)) {
      setProfileMessage("Ingresa un correo electrónico válido");
      return;
    }

    const trimmedNombre = nombre.trim();
    const trimmedCorreo = correo.trim();

    const payload: UpdateMyUserRequest = {
      correo: usuario.correo,
    };

    if (trimmedNombre !== usuario.nombre) {
      payload.nombre = trimmedNombre;
    }
    if (trimmedCorreo !== usuario.correo) {
      payload.nuevo_correo = trimmedCorreo;
    }

    if (!payload.nombre && !payload.nuevo_correo) {
      setProfileMessage("No hay cambios para guardar");
      return;
    }

    try {
      setSavingProfile(true);
      const res = await updateMyUser(payload);
      setUsuario(res.data.usuario);
      setNombre(res.data.usuario.nombre);
      setCorreo(res.data.usuario.correo);
      setProfileMessage("Perfil actualizado correctamente");
    } catch (error: unknown) {
      console.error("Error actualizando perfil:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err?.response?.data?.message ||
        "No se pudo actualizar el perfil. Intenta nuevamente.";
      setProfileMessage(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage("Completa todos los campos de contraseña");
      return;
    }

    const passwordError = isValidPassword(newPassword);
    if (passwordError) {
      setPasswordMessage(passwordError);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage("Las nuevas contraseñas no coinciden");
      return;
    }

    try {
      setChangingPassword(true);
      await changeMyPassword({
        contrasena_actual: currentPassword,
        nueva_contrasena: newPassword,
      });
      setPasswordMessage("Contraseña cambiada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: unknown) {
      console.error("Error cambiando contraseña:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err?.response?.data?.message ||
        "No se pudo cambiar la contraseña. Intenta nuevamente.";
      setPasswordMessage(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeleteMessage(null);
    if (!usuario) return;

    if (deleteConfirm !== usuario.correo) {
      setDeleteMessage(
        "Debes escribir tu correo exactamente para confirmar la eliminación.",
      );
      return;
    }

    try {
      setDeleting(true);
      await deleteUserByCorreo(usuario.correo);
      setDeleteMessage("Cuenta eliminada correctamente.");
      logout();
      navigate("/");
    } catch (error: unknown) {
      console.error("Error eliminando cuenta:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err?.response?.data?.message ||
        "No se pudo eliminar la cuenta. Intenta nuevamente.";
      setDeleteMessage(msg);
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
          <p className="mt-4 text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">
          No se pudo cargar la información del usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-600 hover:text-sky-600 text-sm"
          >
            ← Volver al dashboard
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            Gestión de Perfil
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Datos de perfil */}
        <section className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Datos de perfil
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Actualiza tu nombre y correo asociado a tu cuenta.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileMessage && (
              <div
                className={`text-sm px-4 py-2 rounded-lg border mb-2 ${
                  profileMessage.includes("correctamente") ||
                  profileMessage.includes("No hay cambios")
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {profileMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>

        {/* Cambiar contraseña */}
        <section className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Cambiar contraseña
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Mantén tu cuenta segura actualizando periódicamente tu contraseña.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordMessage && (
              <div
                className={`text-sm px-4 py-2 rounded-lg border mb-2 ${
                  passwordMessage.includes("correctamente")
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {passwordMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Contraseña actual
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
              />
              <p className="mt-1 text-xs text-slate-500">
                Mínimo 6 caracteres, sin espacios, con letras y números.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword
                  ? "Cambiando contraseña..."
                  : "Cambiar contraseña"}
              </button>
            </div>
          </form>
        </section>

        {/* Eliminar cuenta */}
        <section className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Eliminar cuenta
          </h2>
          <p className="text-sm text-slate-700 mb-4">
            Esta acción es permanente. Si eliminas tu cuenta, se cerrará sesión y
            no podrás acceder nuevamente con este usuario.
          </p>

          <form onSubmit={handleDeleteAccount} className="space-y-4">
            {deleteMessage && (
              <div
                className={`text-sm px-4 py-2 rounded-lg border mb-2 ${
                  deleteMessage.includes("correctamente")
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {deleteMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="deleteConfirm"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Escribe tu correo para confirmar
              </label>
              <input
                id="deleteConfirm"
                type="email"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={usuario.correo}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? "Eliminando cuenta..." : "Eliminar cuenta"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default PerfilEstudiantePage;
