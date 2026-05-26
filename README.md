# Sistema de Certificaciones - Parcial 1

Plataforma de gestion de examenes y certificaciones construida con Vite + React + TypeScript + Tailwind CSS v4.

## Equipo y Ramas

| Integrante | Rama | Modulo | Carpeta |
|---|---|---|---|
| Barja Ortiz Erick Gerson | barja-ortiz-erick-gerson | Gestion de Usuarios y Enrutamiento | src/components/Auth/ |
| Navarro Serva Lesly Brenda | navarro-serva-lesly-brenda | Comite Tecnico - Examenes | src/components/Committee/ |
| Yauri Torres Benjamin Raul | yauri-torres-benjamin-raul | Rendicion de Examenes | src/components/Student/ |
| Toribio Anselmo David Angel | toribio-anselmo-david-angel | CV y Certificados PDF | src/components/PublicProfile/ |

## Requisitos previos

Antes de empezar, asegurate de tener instalado lo siguiente en tu computadora:

- Node.js version 18 o superior: https://nodejs.org
- Git: https://git-scm.com
- Un editor de codigo (se recomienda Visual Studio Code): https://code.visualstudio.com

Para verificar que Node y Git esten instalados, abre una terminal y ejecuta:

```bash
node -v
git -v
```

## Instalacion y ejecucion del proyecto

Sigue estos pasos en orden. Solo hay que hacerlo una vez al clonar el proyecto.

### Paso 1 - Clonar el repositorio

```bash
git clone https://github.com/IngenieroTaipe/parcial1.git
```

### Paso 2 - Entrar a la carpeta del proyecto

```bash
cd parcial1
```

### Paso 3 - Instalar dependencias

```bash
npm install
npm install -D @vitejs/plugin-react vite typescript @types/react @types/react-dom
```

### Paso 4 - Cambiarse a tu rama de trabajo

Reemplaza el nombre de la rama con la tuya:

```bash
# Barja Ortiz Erick Gerson
git checkout barja-ortiz-erick-gerson

# Navarro Serva Lesly Brenda
git checkout navarro-serva-lesly-brenda

# Yauri Torres Benjamin Raul
git checkout yauri-torres-benjamin-raul

# Toribio Anselmo David Angel
git checkout toribio-anselmo-david-angel
```

### Paso 5 - Ejecutar el proyecto

```bash
npm run dev
```

Esto abre el servidor local. Abre tu navegador y entra a:

```
http://localhost:5173
```

### Solo para David (Toribio Anselmo David Angel) - modulo PDF

Tu modulo necesita una dependencia adicional para generar PDFs. Ejecuta esto una vez:

```bash
npm install html2pdf.js
npm install -D @types/html2pdf.js
```

## Comandos Git del dia a dia

```bash
# Ver en que rama estas
git branch

# Ver que archivos cambiaste
git status

# Guardar tus cambios
git add src/components/TuCarpeta/
git commit -m "feat(modulo): descripcion de lo que hiciste"

# Subir tus cambios a GitHub
git push origin nombre-de-tu-rama

# Traer los ultimos cambios de main (hacer esto antes de empezar a trabajar cada dia)
git pull origin main
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
