// src/utils/storage.ts
// Funciones compartidas para leer/escribir en Local Storage de forma tipada.

import { LS_KEYS, User, Exam, ExamAttempt, Certificate, UserProfile } from '../types';

// ─── Genérico ─────────────────────────────────────────────────────────────────

export function getItem<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Usuarios ─────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return getItem<User[]>(LS_KEYS.USERS) ?? [];
}

export function saveUsers(users: User[]): void {
  setItem(LS_KEYS.USERS, users);
}

export function getCurrentUser(): User | null {
  return getItem<User>(LS_KEYS.CURRENT_USER);
}

export function setCurrentUser(user: User | null): void {
  if (user === null) {
    localStorage.removeItem(LS_KEYS.CURRENT_USER);
  } else {
    setItem(LS_KEYS.CURRENT_USER, user);
  }
}

// ─── Exámenes ─────────────────────────────────────────────────────────────────

export function getExams(): Exam[] {
  return getItem<Exam[]>(LS_KEYS.EXAMS) ?? [];
}

export function saveExams(exams: Exam[]): void {
  setItem(LS_KEYS.EXAMS, exams);
}

export function getExamById(id: string): Exam | undefined {
  return getExams().find((e) => e.id === id);
}

// ─── Intentos ─────────────────────────────────────────────────────────────────

export function getAttempts(): ExamAttempt[] {
  return getItem<ExamAttempt[]>(LS_KEYS.ATTEMPTS) ?? [];
}

export function saveAttempts(attempts: ExamAttempt[]): void {
  setItem(LS_KEYS.ATTEMPTS, attempts);
}

export function addAttempt(attempt: ExamAttempt): void {
  const attempts = getAttempts();
  attempts.push(attempt);
  saveAttempts(attempts);
}

export function getAttemptsByUser(userId: string): ExamAttempt[] {
  return getAttempts().filter((a) => a.userId === userId);
}

// ─── Certificados ─────────────────────────────────────────────────────────────

export function getCertificates(): Certificate[] {
  return getItem<Certificate[]>(LS_KEYS.CERTIFICATES) ?? [];
}

export function saveCertificates(certs: Certificate[]): void {
  setItem(LS_KEYS.CERTIFICATES, certs);
}

export function addCertificate(cert: Certificate): void {
  const certs = getCertificates();
  certs.push(cert);
  saveCertificates(certs);
}

export function getCertificatesByUser(userId: string): Certificate[] {
  return getCertificates().filter((c) => c.userId === userId);
}

// ─── Perfiles (CV Digital) ────────────────────────────────────────────────────

export function getProfiles(): UserProfile[] {
  return getItem<UserProfile[]>(LS_KEYS.PROFILES) ?? [];
}

export function saveProfiles(profiles: UserProfile[]): void {
  setItem(LS_KEYS.PROFILES, profiles);
}

export function getProfileByUser(userId: string): UserProfile {
  const profiles = getProfiles();
  return profiles.find((p) => p.userId === userId) ?? {
    userId,
    workExperience: [],
    education: [],
  };
}

export function saveProfile(profile: UserProfile): void {
  const profiles = getProfiles();
  const idx = profiles.findIndex((p) => p.userId === profile.userId);
  if (idx >= 0) {
    profiles[idx] = profile;
  } else {
    profiles.push(profile);
  }
  saveProfiles(profiles);
}
