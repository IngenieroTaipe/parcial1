# Sistema de Certificaciones — Parcial 1

Plataforma de gestión de exámenes y certificaciones construida con **Vite + React + TypeScript + Tailwind CSS v4**.

## 👥 Equipo y Ramas

| Integrante | Rama | Carpeta | Tarea |
|---|---|---|---|
| **Erick** | `feature/erick` | `src/components/Auth/` + `App.tsx` | Autenticación y enrutamiento |
| **Lesly** | `feature/lesly` | `src/components/Committee/` | Creación de exámenes |
| **Benjamin** | `feature/benjamin` | `src/components/Student/` | Rendición de exámenes |
| **David** | `feature/david` | `src/components/PublicProfile/` | CV y certificados PDF |

## 🚀 Setup inicial

```bash
npm install
npm run dev
```

## 📋 Reglas del equipo

1. **Cada quien trabaja solo en su carpeta.** No tocar archivos de otros.
2. **`src/types.ts` y `src/utils/storage.ts` son de solo lectura** (solo con acuerdo de todo el equipo).
3. Usar siempre las constantes `LS_KEYS` al acceder al Local Storage.
4. Hacer commits descriptivos: `feat(auth): agregar validación de DNI`.
5. Antes de hacer push, siempre hacer `git pull origin main` para actualizar la base.

## 📦 Estructura

```
src/
├── types.ts                ← Contratos de datos compartidos
├── utils/
│   └── storage.ts          ← Funciones de Local Storage
├── components/
│   ├── Auth/               ← ERICK
│   ├── Committee/          ← LESLY
│   ├── Student/            ← BENJAMIN
│   └── PublicProfile/      ← DAVID
└── App.tsx                 ← ERICK (rutas)
```

## 🔑 Claves de Local Storage

| Clave | Tipo | Descripción |
|---|---|---|
| `users` | `User[]` | Lista de usuarios registrados |
| `currentUser` | `User` | Usuario actualmente logueado |
| `exams` | `Exam[]` | Exámenes creados por Lesly |
| `attempts` | `ExamAttempt[]` | Intentos de examen de Benjamin |
| `certificates` | `Certificate[]` | Certificados generados por David |
