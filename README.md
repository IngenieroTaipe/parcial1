# Sistema de Certificaciones — UNCP

**Curso:** Desarrollo de Aplicaciones Web  
**Facultad:** Ingeniería de Sistemas — Universidad Nacional del Centro del Perú  
**Stack:** React 18 · Vite · TypeScript · Tailwind CSS v4 · LocalStorage

---

## Cómo ejecutar el proyecto

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en **http://localhost:5173**

---

## Flujo completo de la aplicación

```
/login  ──▶  ¿Rol admin?  ──▶  /admin   (Editor de Exámenes)
                │                  │
                │                  ├──▶ /users        (Lista de usuarios)
                │                  └──▶ /cv/:dni      (Ver / editar mi CV)
                │
                └──▶  /examenes    (Portal de Exámenes — estudiante)
                           │
                           ├──▶ /examenes/:id        (Rendir examen)
                           ├──▶ /cv/:dni             (Ver / editar mi CV)
                           └──▶ /certificado/:hash   (URL pública del certificado)
```

---

## Cómo ingresar como ADMINISTRADOR

1. Ve a **http://localhost:5173/register**
2. Registra una cuenta con los siguientes datos:

| Campo | Valor |
|---|---|
| Documento (DNI) | `admin` |
| Nombre completo | Tu nombre |
| Correo | tu@correo.com |
| Especialidad | La que quieras |

> El sistema detecta automáticamente que el documento es `"admin"` y asigna el rol de **Administrador**.

3. Serás redirigido al **Panel de Administración** (`/admin`).

### Qué puede hacer el Administrador

- **Crear exámenes** — con título, área temática, preguntas de opción múltiple o respuesta abierta, y porcentaje mínimo de aprobación.
- **Agregar / Eliminar preguntas** — formulario dinámico con validación.
- **Ver la lista de usuarios registrados** — desde el botón "Ver Usuarios" en el panel.
- **Cerrar sesión** — botón en la barra superior.
- **Ver y editar su propio CV** — botón "Mi CV" en la barra superior.

---

## Cómo ingresar como ESTUDIANTE

1. Ve a **http://localhost:5173/register**
2. Registra una cuenta con cualquier DNI que no sea `"admin"`.
3. Serás redirigido al **Portal de Exámenes** (`/examenes`).

### Qué puede hacer el Estudiante

| Acción | Cómo |
|---|---|
| Ver exámenes disponibles | Pantalla principal `/examenes` |
| Buscar exámenes por nombre o área | Barra de búsqueda + filtro |
| Rendir un examen | Botón **Rendir Examen** en la tarjeta |
| Ver su puntaje final | Pantalla de resultados automática al enviar |
| Ver su certificado digital | Botón **Ver mi certificado** (solo si aprobó) |
| Descargar el certificado en PDF | Botón dentro del modal del certificado |
| Ver y editar su CV | Botón **Ver mi CV** en la barra superior |
| Cerrar sesión | Botón **Cerrar Sesión** en la barra superior |

> **Control de intentos:** Cada estudiante puede rendir cada examen **una sola vez**. Si ya lo rindió, el botón aparece deshabilitado.

---

## Cómo ver un Currículum Vitae (CV)

Cada usuario tiene una URL pública única para su CV:

```
http://localhost:5173/cv/<DNI_DEL_USUARIO>
```

**Ejemplo:** Si tu DNI es `12345678`, tu CV está en:
```
http://localhost:5173/cv/12345678
```

### Desde dentro de la app

- **Estudiante:** Botón **"Ver mi CV"** en la barra superior de `/examenes`
- **Administrador:** Botón **"Mi CV"** en la barra superior de `/admin`
- **Desde el resultado de un examen aprobado:** Botón "Ver mi Certificado" redirige al CV

### Qué contiene el CV

| Sección | Editable por el dueño |
|---|---|
| Información personal (DNI, correo, especialidad) | No (se actualiza desde el registro) |
| Resumen de rendimiento (exámenes, puntajes) | No (automático) |
| Certificaciones obtenidas con URL pública | No (automático al aprobar) |
| **Experiencia Laboral** | **Sí — solo el propietario** |
| **Formación Académica** | **Sí — solo el propietario** |

> El CV es **público** — cualquiera puede verlo con la URL. Solo el dueño de la cuenta (sesión activa) puede editar la experiencia y formación.

---

## Cómo ver un certificado públicamente

Al aprobar un examen se genera automáticamente una URL pública:

```
http://localhost:5173/certificado/<HASH_UNICO>
```

Esta URL puede compartirse con cualquier persona para verificar el certificado. También puedes descargar el certificado en PDF desde la vista.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx          # Inicio de sesión
│   │   ├── Register.tsx       # Registro de usuarios
│   │   └── UserList.tsx       # Lista de usuarios (admin)
│   ├── Committee/
│   │   ├── ExamEditor.tsx     # Crear y gestionar exámenes (admin)
│   │   └── QuestionForm.tsx   # Formulario de pregunta
│   ├── Student/
│   │   ├── ExamList.tsx       # Portal de exámenes (estudiante)
│   │   └── TakeExam.tsx       # Rendir un examen
│   └── PublicProfile/
│       ├── CVPage.tsx          # Perfil / CV público y editable
│       ├── CertificatePage.tsx # Vista pública del certificado
│       └── CertificateView.tsx # Componente del certificado (PDF)
├── types.ts                   # Interfaces TypeScript compartidas
├── utils/
│   └── storage.ts             # Funciones de LocalStorage tipadas
├── App.tsx                    # Rutas de la aplicación
└── index.css                  # Estilos globales + variables CSS
```

---

## Persistencia de datos (LocalStorage)

Toda la información se guarda en el navegador:

| Clave | Contenido |
|---|---|
| `users` | Usuarios registrados |
| `currentUser` | Sesión activa |
| `exams` | Exámenes creados por el comité |
| `attempts` | Resultados de exámenes rendidos |
| `certificates` | Certificados generados |
| `profiles` | Experiencia laboral y formación académica del CV |

> Para reiniciar todos los datos abre las **DevTools** (`F12`) → pestaña **Application** → **Local Storage** → borra las claves.

---

## Funcionalidades implementadas

| # | Requisito del parcial | Puntos | Estado |
|---|---|---|---|
| 1 | Edición y gestión de exámenes (comité técnico) | 6 | Completo |
| 2 | Rendición de exámenes online por usuarios | 5 | Completo |
| 3 | Generación de certificados con URL pública | 3 | Completo |
| 4 | Gestión de usuarios registrados | 3 | Completo |
| 5 | Currículum digital vinculado a certificaciones | 3 | Completo |

---

## Equipo de desarrollo

| Integrante | Módulo |
|---|---|
| Barja Ortiz Erick Gerson | Autenticación, enrutamiento (`/login`, `/register`, `/users`) |
| Navarro Serva Lesly Brenda | Editor de exámenes (`/admin`) |
| Yauri Torres Benjamin Raul | Portal de exámenes estudiante (`/examenes`, `/examenes/:id`) |
| Toribio Anselmo David Angel | CV y certificados (`/cv/:id`, `/certificado/:hash`) |
