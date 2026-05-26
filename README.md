# Sistema de Certificaciones - Parcial 1

Plataforma de gestion de examenes y certificaciones construida con Vite + React + TypeScript + Tailwind CSS v4.

## Equipo y Ramas

| Integrante | Rama | Modulo | Carpeta |
|---|---|---|---|
| Barja Ortiz Erick Gerson | barja-ortiz-erick-gerson | Gestion de Usuarios y Enrutamiento | src/components/Auth/ |
| Navarro Serva Lesly Brenda | navarro-serva-lesly-brenda | Comite Tecnico - Examenes | src/components/Committee/ |
| Yauri Torres Benjamin Raul | yauri-torres-benjamin-raul | Rendicion de Examenes | src/components/Student/ |
| Toribio Anselmo David Angel | toribio-anselmo-david-angel | CV y Certificados PDF | src/components/PublicProfile/ |

## Configuracion inicial

```bash
npm install
npm run dev
```

## Estructura del proyecto

```
src/
├── types.ts                <- Contratos de datos compartidos (NO modificar sin acuerdo)
├── utils/
│   └── storage.ts          <- Funciones de Local Storage tipadas
├── components/
│   ├── Auth/               <- Barja Ortiz Erick Gerson
│   ├── Committee/          <- Navarro Serva Lesly Brenda
│   ├── Student/            <- Yauri Torres Benjamin Raul
│   └── PublicProfile/      <- Toribio Anselmo David Angel
└── App.tsx                 <- Barja Ortiz Erick Gerson (rutas)
```

## Claves de Local Storage

| Clave | Tipo | Descripcion |
|---|---|---|
| users | User[] | Lista de usuarios registrados |
| currentUser | User | Usuario actualmente logueado |
| exams | Exam[] | Examenes creados por el comite |
| attempts | ExamAttempt[] | Intentos de examen de los estudiantes |
| certificates | Certificate[] | Certificados generados |

## Reglas del equipo

1. Cada integrante trabaja exclusivamente en su carpeta. No modificar archivos ajenos.
2. Los archivos src/types.ts y src/utils/storage.ts son compartidos. Cualquier cambio requiere acuerdo de todo el equipo.
3. Usar siempre las constantes LS_KEYS al acceder a Local Storage para evitar errores de tipeo.
4. Formato de commits: tipo(modulo): descripcion. Ejemplo: feat(auth): agregar validacion de DNI.
5. Antes de hacer push, ejecutar git pull origin main para traer los ultimos cambios de la base.
6. Cada integrante trabaja en su propia rama. Ver el archivo TAREA_*.md en tu rama para el detalle de tu modulo.

## Archivos de tareas por integrante

- TAREA_ERICK.md - Modulo de autenticacion y enrutamiento
- TAREA_LESLY.md - Modulo del comite tecnico
- TAREA_BENJAMIN.md - Modulo de rendicion de examenes
- TAREA_DAVID.md - Modulo de CV y certificados
