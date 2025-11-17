// interfaces/analitica/AnaliticaResponse.ts

// ============================================
// TRIGGER ETL - Iniciar Airflow
// ============================================
export interface TriggerETLResponse {
  message: string;
  dag_id: string;
  dag_run_id: string;
  estado: string;
  airflow_url: string;
  instrucciones: string[];
}

// ============================================
// INCIDENTES POR PISO
// ============================================
export interface IncidentePorPiso {
  piso: string;
  estado: string;
  total_incidentes: string;
}

export interface IncidentesPorPisoResponse {
  descripcion: string;
  resultados: IncidentePorPiso[];
  total_filas: number;
}

// ============================================
// INCIDENTES POR TIPO
// ============================================
export interface IncidentePorTipo {
  tipo: string;
  nivel_urgencia: string;
  cantidad: string;
  porcentaje: string;
}

export interface IncidentesPorTipoResponse {
  descripcion: string;
  resultados: IncidentePorTipo[];
  total_filas: number;
}

// ============================================
// TIEMPO DE RESOLUCIÓN
// ============================================
export interface TiempoResolucionDetalle {
  incidente_id: string;
  titulo: string;
  tipo: string;
  nivel_urgencia: string;
  creado_en: string;
  actualizado_en: string | null;
  estado: string;
  horas_resolucion: string | null;
}

export interface TiempoResolucionResponse {
  descripcion: string;
  resultados: TiempoResolucionDetalle[];
  total_filas: number;
}

// ============================================
// REPORTES POR USUARIO
// ============================================
export interface ReportePorUsuario {
  usuario_correo: string;
  nombre: string;
  rol: string;
  total_reportes: string;
  reportes_resueltos: string;
  reportes_en_progreso: string;
  reportes_pendientes: string;
}

export interface ReportesPorUsuarioResponse {
  descripcion: string;
  resultados: ReportePorUsuario[];
  total_filas: number;
}
