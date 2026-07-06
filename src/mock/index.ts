import { VacancyItem, MentorItem } from "@/types";

export const VACANCIES_FALLBACK: VacancyItem[] = [
  { id: "V-1042", title: "Analista de Datos Junior", company: "Veritas Analytics", sector: "Tecnología", modality: "Remoto", type: "Tiempo completo", match: 94, socialLevel: "Bajo", adjustments: ["100% remoto", "Comunicación asíncrona", "Horario flexible", "Instrucciones escritas"], desc: "Análisis de bases de datos, generación de reportes y visualización de métricas clave.", companyDesc: "Empresa de análisis de datos con 7 años en el mercado." },
  { id: "V-0873", title: "Diseñadora UX", company: "Forma Studio", sector: "Diseño", modality: "Híbrido", type: "Tiempo completo", match: 87, socialLevel: "Medio", adjustments: ["Espacio de trabajo tranquilo", "Briefs escritos", "Evaluación por entregables"], desc: "Diseño de experiencias digitales para clientes de salud y educación.", companyDesc: "Estudio de diseño boutique con enfoque en accesibilidad digital." },
];

export const MENTORS_FALLBACK: MentorItem[] = [
  { id: "M-01", name: "Carmen Ruiz", specialty: "Inclusión laboral y funciones ejecutivas", years: 8, modality: "Virtual", bio: "Psicóloga organizacional especializada en estrategias de inserción laboral para perfiles con estilos cognitivos diversos." },
  { id: "M-02", name: "David Morales", specialty: "Aprendizaje adaptativo en entornos corporativos", years: 5, modality: "Presencial y virtual", bio: "Consultor de inclusión con experiencia en mediación empresa-candidato." },
  { id: "M-03", name: "Sofía Andrade", specialty: "Integración sensorial y entorno laboral", years: 6, modality: "Virtual", bio: "Terapeuta ocupacional con posgrado en accesibilidad laboral." },
  { id: "M-04", name: "Luis Torres", specialty: "Transición laboral y autonomía profesional", years: 10, modality: "Presencial", bio: "Coach laboral y educador especializado en autonomía profesional." },
];

export const CANDIDATE_RADAR_FINAL = [
  { axis: "Procesamiento", value: 82 },
  { axis: "T. Ambiental", value: 28 },
  { axis: "Ejecución", value: 80 },
  { axis: "Ajustes", value: 75 },
];

export const CANDIDATE_ADJUSTMENTS = [
  "Trabajo remoto o híbrido",
  "Comunicación asíncrona",
  "Instrucciones escritas",
  "Control de ruido",
  "Horario flexible",
];

export const COMPANY_CANDIDATES_DATA = [
  { id: "CAND-A7X2", match: 96, strengths: "Alto enfoque en tareas detalladas. Prefiere entorno silencioso. Requiere instrucciones escritas.", radar: [{ axis: "Procesamiento", value: 88 }, { axis: "T. Ambiental", value: 22 }, { axis: "Ejecución", value: 92 }, { axis: "Ajustes", value: 70 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Comunicación asíncrona", met: true }, { req: "Espacio individual silencioso", met: false }, { req: "Horario flexible", met: true }] },
  { id: "CAND-B3M9", match: 89, strengths: "Excelente tolerancia a entornos variables. Habilidad multitarea alta. Comunicación verbal fluida.", radar: [{ axis: "Procesamiento", value: 65 }, { axis: "T. Ambiental", value: 82 }, { axis: "Ejecución", value: 68 }, { axis: "Ajustes", value: 85 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Comunicación asíncrona", met: false }, { req: "Instrucciones escritas", met: true }, { req: "Evaluación por entregables", met: true }] },
  { id: "CAND-C1K4", match: 82, strengths: "Alta especialización en tareas repetitivas. Requiere estructura clara. Prefiere trabajo presencial o híbrido.", radar: [{ axis: "Procesamiento", value: 90 }, { axis: "T. Ambiental", value: 55 }, { axis: "Ejecución", value: 85 }, { axis: "Ajustes", value: 50 }], env: [{ req: "Trabajo remoto disponible", met: true }, { req: "Gestión visual de tareas", met: true }, { req: "Control de ruido", met: false }, { req: "Check-ins diarios estructurados", met: false }] },
];

export const MENTOR_PROCESSES = [
  { cid: "CAND-A7X2", company: "Veritas Analytics", role: "Analista de Datos Junior", stage: "Onboarding activo", stageColor: "#2D7D5F", days: 14, action: "Check-in semana 2 con líder de equipo", notes: "Candidato/a adaptándose bien. Herramientas asíncronas configuradas. Punto de fricción: llamadas de equipo sin agenda previa." },
  { cid: "CAND-B3M9", company: "Forma Studio", role: "Diseñadora UX", stage: "Preparación — Entrevista", stageColor: "#1B4B7A", days: 7, action: "Sesión de preparación para entrevista técnica", notes: "Portafolio sólido. Trabajando en presentación verbal y ritmo de respuesta en preguntas abiertas." },
  { cid: "CAND-C1K4", company: "Kestrel Systems", role: "Redactor/a Técnico/a", stage: "Período de prueba", stageColor: "#8B5C3A", days: 30, action: "Revisión de 30 días con RRHH y candidato/a", notes: "Período de prueba positivo. Empresa confirmó actualización de política de ruido para julio." },
];
