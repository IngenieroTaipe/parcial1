// src/types.ts
// ⚠️ ARCHIVO CRÍTICO: No modificar sin consenso del equipo.
// Todos los integrantes deben usar estas interfaces para leer/escribir en Local Storage.

export interface User {
  document: string; // ID único (DNI)
  fullName: string;
  email: string;
  specialty: string;
  role: 'student' | 'admin';
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'open';
  options: string[]; // Vacío si es 'open'
  correctAnswer: string;
}

export interface Exam {
  id: string;
  title: string;
  area: string;
  passingScore: number; // porcentaje ej: 70
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  userId: string; // Documento del usuario
  examId: string;
  score: number;
  passed: boolean;
  date: string; // ISO string
}

export interface Certificate {
  hash: string;
  userId: string; // Documento del usuario
  examId: string;
  examTitle: string;
  issueDate: string; // ISO string
  publicUrl: string;
}

// ─── Currículum Digital ───────────────────────────────────────────────────────

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string; // 'Actualidad' si es presente
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface UserProfile {
  userId: string; // Documento del usuario
  workExperience: WorkExperience[];
  education: Education[];
}

// ─── Claves de Local Storage ─────────────────────────────────────────────────
// Úsenlas como constantes para evitar typos.
export const LS_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  EXAMS: 'exams',
  ATTEMPTS: 'attempts',
  CERTIFICATES: 'certificates',
  PROFILES: 'profiles',
} as const;
