// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import type { RegisterRequest } from "../interfaces/auth/RegisterRequest";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthContext();

  const [formData, setFormData] = useState<RegisterRequest>({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "estudiante", // rol por defecto
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");

  const isValidName = (value: string): boolean => {
    const trimmed = value.trim();

    // mínimo longitud
    if (trimmed.length < 3) return false;

    // solo letras, espacios y algunos símbolos comunes
    const nameRegex =
      /^[A-Za-zÀ-ÿ\u00f1\u00d1\s'.-]+$/; // soporta acentos y ñ
    if (!nameRegex.test(trimmed)) return false;

    // al menos nombre y apellido (hay al menos un espacio interno)
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return false;

    return true;
  };

  const isValidEmail = (value: string): boolean => {
    const trimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return false;
    }

    // Si quieres forzar solo correos UTEC, descomenta esto:
    // if (!trimmed.toLowerCase().endsWith("@utec.edu.pe")) {
    //   return false;
    // }

    return true;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nombre = formData.nombre.trim();
    const correo = formData.correo.trim();
    const password = formData.contrasena;

    // Validar nombre
    if (!isValidName(nombre)) {
      setError(
        "Ingresa un nombre completo válido (solo letras, mínimo nombre y apellido)"
      );
      return;
    }

    // Validar correo
    if (!isValidEmail(correo)) {
      setError("Ingresa un correo electrónico válido");
      // Si quieres mensaje específico UTEC, cambia por:
      // setError("Debes usar tu correo institucional @utec.edu.pe");
      return;
    }

    // Validar contraseña
    const passwordError = isValidPassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Confirmación de contraseña
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Forzamos rol estudiante por seguridad
      await register({
        ...formData,
        nombre,
        correo,
        rol: "estudiante",
      });
      navigate("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error?.response?.data?.message ||
          "Error al registrarse. Intenta nuevamente."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-2xl mb-4 shadow-lg hover:bg-sky-700 transition"
          >
            <span className="text-2xl font-bold text-white">AU</span>
          </Link>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Crear cuenta
          </h1>
          <p className="text-slate-600">
            Únete a AlertaUTEC y ayuda a mejorar el campus
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
                placeholder="Juan Pérez"
              />
              <p className="mt-1 text-xs text-slate-500">
                Usa tu nombre y apellido reales
              </p>
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
                placeholder="tu.correo@utec.edu.pe"
              />
              <p className="mt-1 text-xs text-slate-500">
                Ingresa un correo válido{/* o institucional @utec.edu.pe */}
              </p>
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-500">
                Mínimo 6 caracteres, sin espacios, con letras y números
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/auth/login"
                className="text-sky-600 font-medium hover:text-sky-700 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-sky-600 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
