// src/pages/WelcomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: "📱",
      title: "Reporta desde cualquier lugar",
      description: "Usa tu celular o laptop para reportar incidentes en segundos",
    },
    {
      icon: "⚡",
      title: "Respuesta inmediata",
      description: "Las autoridades reciben tu reporte al instante",
    },
    {
      icon: "👀",
      title: "Sigue el progreso",
      description: "Ve en tiempo real cómo se está atendiendo tu reporte",
    },
    {
      icon: "🔔",
      title: "Notificaciones automáticas",
      description: "Te avisamos cuando tu reporte cambia de estado",
    },
  ];

  const incidentTypes = [
    "Fuga de agua",
    "Corte de luz",
    "Emergencia médica",
    "Riesgo estructural",
    "Problema de seguridad",
    "Fallo en servicios",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 flex items-center justify-center px-4 py-8">
      {/* Hero Section */}
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-sky-100 text-sky-700 mb-6 shadow-sm">
            <span className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse"></span>
            UTEC · Sistema de Alertas del Campus
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 animate-slide-up">
            Bienvenido a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
              AlertaUTEC
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 animate-slide-up-delay">
            La plataforma oficial de UTEC para reportar y dar seguimiento a
            incidentes en el campus. Tu voz importa para mantener nuestro
            campus seguro y funcional.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 animate-fade-in-delay">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Column - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {/* Feature Carousel */}
              <div className="mb-8">
                <div className="h-32 flex items-center justify-center mb-6">
                  <div
                    key={currentFeature}
                    className="text-center animate-fade-in"
                  >
                    <div className="text-6xl mb-4 animate-bounce-slow">
                      {features[currentFeature].icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                      {features[currentFeature].title}
                    </h3>
                    <p className="text-slate-600">
                      {features[currentFeature].description}
                    </p>
                  </div>
                </div>
                
                {/* Feature Indicators */}
                <div className="flex justify-center gap-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentFeature
                          ? "w-8 bg-sky-600"
                          : "w-2 bg-sky-300"
                      }`}
                      aria-label={`Característica ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                    <span className="text-sky-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Reporta fácilmente
                    </p>
                    <p className="text-sm text-slate-600">
                      Describe el incidente, ubícalo y selecciona la urgencia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                    <span className="text-sky-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Seguimiento en tiempo real
                    </p>
                    <p className="text-sm text-slate-600">
                      Observa cómo se atiende tu reporte paso a paso
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center mt-0.5">
                    <span className="text-sky-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Comunicación directa
                    </p>
                    <p className="text-sm text-slate-600">
                      Conecta estudiantes, personal y autoridades del campus
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-sky-700 hover:to-blue-700"
                >
                  Iniciar Sesión
                </button>
                
                <button
                  onClick={() => navigate("/auth/register")}
                  className="flex-1 bg-white text-sky-600 border-2 border-sky-300 py-4 px-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 hover:bg-sky-50"
                >
                  Crear Cuenta
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-6 text-center">
                Usa tus credenciales institucionales de UTEC. Cada reporte
                queda registrado para garantizar transparencia y seguimiento.
              </p>
            </div>

            {/* Right Column - Visual Info */}
            <div className="bg-gradient-to-br from-sky-600 to-blue-600 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">
                  Estados de tu Reporte
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold">Pendiente</p>
                      <p className="text-sm text-sky-100">
                        Tu reporte está siendo revisado
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold">En Atención</p>
                      <p className="text-sm text-sky-100">
                        El equipo está trabajando en la solución
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold">Resuelto</p>
                      <p className="text-sm text-sky-100">
                        El incidente ha sido solucionado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="font-semibold mb-4 text-sky-100">
                  Tipos de incidentes que puedes reportar:
                </p>
                <div className="flex flex-wrap gap-2">
                  {incidentTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-all duration-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-delay-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl font-bold text-sky-600 mb-2">Rápido</div>
            <div className="text-slate-600 font-medium">Reporte en segundos</div>
            <div className="text-sm text-slate-500 mt-1">
              Desde tu dispositivo móvil
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl font-bold text-sky-600 mb-2">Seguro</div>
            <div className="text-slate-600 font-medium">Datos protegidos</div>
            <div className="text-sm text-slate-500 mt-1">
              Solo personal autorizado
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl font-bold text-sky-600 mb-2">Eficiente</div>
            <div className="text-slate-600 font-medium">Respuesta inmediata</div>
            <div className="text-sm text-slate-500 mt-1">
              Notificaciones al instante
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.2s both;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
