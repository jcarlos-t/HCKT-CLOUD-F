// types/index.ts

// Roles tal como los usa el backend
export type UserRole = "estudiante" | "personal_administrativo" | "autoridad";

// Mapeado a Usuario del backend
export interface User {
  // opcional si algún día usas un id interno,
  // pero el identificador real es el correo.
  id?: string;
  correo: string;
  nombre: string;
  rol: UserRole;
}

// Estados alineados con EstadoIncidente del backend
export type IncidentStatus = "reportado" | "en_progreso" | "resuelto";

// Tipos alineados con TipoIncidente (puedes extender con string si quieres más)
export type IncidentType =
  | "mantenimiento"
  | "seguridad"
  | "limpieza"
  | "TI"
  | "otro"
  | string;

// Niveles alineados con NivelUrgencia
export type UrgencyLevel = "bajo" | "medio" | "alto" | "critico";

// Historial (no está en el backend tal cual, pero lo dejamos coherente en español)
export interface IncidentHistory {
  accion: string;
  realizado_por: string;
  timestamp: string;
  notas?: string;
}

// Incidente alineado con la interfaz Incidente usada en services/incidentes
export interface Incident {
  incidente_id: string;
  titulo: string;
  descripcion: string;
  piso: number;
  ubicacion: {
    x: number;
    y: number;
  };
  tipo: IncidentType;
  nivel_urgencia: UrgencyLevel;
  estado?: IncidentStatus;
  usuario_correo?: string;     // quien lo reportó
  asignado_a?: string;         // correo o id del encargado (si lo manejas)
  historial?: IncidentHistory[];
}
