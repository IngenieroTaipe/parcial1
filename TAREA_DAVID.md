# TAREA - Toribio Anselmo David Angel
# Modulo: CV Publico y Certificados PDF

Rama de trabajo: toribio-anselmo-david-angel

---

## Responsabilidades

Tu modulo muestra el perfil publico de un usuario (CV con informacion personal y sus certificaciones) y permite descargar un certificado en PDF. Lees datos de localStorage que Erick (usuario) y Benjamin (intentos) ya guardaron.

---

## Archivos que debes implementar

```
src/
└── components/
    └── PublicProfile/
        ├── CVPage.tsx                 <- Pagina de perfil publico con CV y certificados
        └── CertificateView.tsx        <- Componente visual del certificado descargable
```

---

## Tipos que usaras (de src/types.ts)

```ts
interface User {
  document: string;
  fullName: string;
  email: string;
  specialty: string;
  role: 'student' | 'admin';
}

interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  score: number;
  passed: boolean;
  date: string;
}

interface Certificate {
  hash: string;
  userId: string;
  examId: string;
  examTitle: string;
  issueDate: string;
  publicUrl: string;
}

interface Exam {
  id: string;
  title: string;
  area: string;
  passingScore: number;
  questions: Question[];
}
```

---

## Paso 1 - CVPage.tsx: Perfil publico

La ruta es /cv/:userId donde userId es el document del usuario.

```ts
import { useParams } from 'react-router-dom';
import { getUsers, getAttempts, getCertificates, getExams } from '../../utils/storage';

const { userId } = useParams<{ userId: string }>();

const users = getUsers();
const usuario = users.find(u => u.document === userId);

const attempts = getAttempts().filter(a => a.userId === userId && a.passed);
const certificates = getCertificates().filter(c => c.userId === userId);
const exams = getExams();
```

Secciones que debe tener la pagina CVPage:

Seccion 1 - Informacion personal:
- Nombre completo (fullName)
- Documento / DNI (document)
- Correo electronico (email)
- Especialidad (specialty)

Seccion 2 - Certificaciones obtenidas:
- Listar los intentos aprobados (passed: true)
- Para cada uno: titulo del examen, fecha, puntaje obtenido
- Buscar el titulo del examen: exams.find(e => e.id === attempt.examId)?.title
- Boton "Ver certificado" por cada examen aprobado que muestre el componente CertificateView

Diseño: usar estilo Bento (tarjetas con bordes redondeados, sombras, fondo glassmorphism). Tailwind sugerido:
```
bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20
```

---

## Paso 2 - CertificateView.tsx: Vista visual del certificado

Este componente recibe por props:
- attempt: ExamAttempt
- user: User
- examTitle: string

```tsx
interface CertificateViewProps {
  attempt: ExamAttempt;
  user: User;
  examTitle: string;
}
```

El certificado debe incluir visualmente:
- Titulo: "Certificado de Aprobacion"
- Nombre del estudiante: user.fullName
- Nombre del examen: examTitle
- Puntaje obtenido: attempt.score + "%"
- Fecha de emision: formatear attempt.date a dd/mm/yyyy
- Identificador unico: attempt.id (los primeros 8 caracteres)
- Firma o sello institucional (puede ser texto: "Sistema de Certificaciones - Parcial 1")

Asignar un id al div raiz del certificado para poder capturarlo con html2pdf:
```tsx
<div id="certificado-pdf" className="...">
  ...contenido...
</div>
```

---

## Paso 3 - Boton "Descargar PDF"

Instalar html2pdf.js:
```bash
npm install html2pdf.js
npm install -D @types/html2pdf.js
```

Uso dentro del componente:
```ts
import html2pdf from 'html2pdf.js';

function descargarPDF() {
  const elemento = document.getElementById('certificado-pdf');
  const opciones = {
    margin: 10,
    filename: `certificado-${user.document}-${attempt.examId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
  };
  html2pdf().set(opciones).from(elemento).save();
}
```

Agregar un boton "Descargar PDF" debajo del certificado que llame a esa funcion.

---

## Paso 4 - Generar y guardar el certificado en localStorage

Cuando se muestra un certificado por primera vez, verificar si ya existe en la clave 'certificates'. Si no existe, crearlo y guardarlo.

```ts
import { getCertificates, addCertificate } from '../../utils/storage';
import { Certificate } from '../../types';

const certs = getCertificates();
const yaExiste = certs.find(c => c.userId === attempt.userId && c.examId === attempt.examId);

if (!yaExiste) {
  const nuevoCert: Certificate = {
    hash: attempt.id, // usar el id del intento como hash unico
    userId: attempt.userId,
    examId: attempt.examId,
    examTitle: examTitle,
    issueDate: new Date().toISOString(),
    publicUrl: `/certificado/${attempt.id}`,
  };
  addCertificate(nuevoCert);
}
```

---

## Ruta adicional: /certificado/:hash

Esta ruta muestra el certificado publico dado un hash. Erick la registra en el enrutador. Tu solo implementas la logica.

```ts
import { useParams } from 'react-router-dom';
import { getCertificates, getUsers, getExams } from '../../utils/storage';

const { hash } = useParams<{ hash: string }>();
const cert = getCertificates().find(c => c.hash === hash);
// con cert.userId buscar el user, con cert.examId buscar el exam
// renderizar CertificateView con esos datos
```

---

## Validaciones

- Si el userId de la URL no existe en localStorage, mostrar un mensaje de error: "Perfil no encontrado".
- Si el usuario no tiene intentos aprobados, mostrar: "Aun no hay certificaciones obtenidas".
- Si el hash del certificado no existe, mostrar: "Certificado no valido o no encontrado".

---

## Dependencias del equipo

- Erick: debe existir el usuario en la clave 'users' y en 'currentUser'.
- Benjamin: debe haber guardado intentos en la clave 'attempts' con passed: true para que aparezcan certificados.
- Lesly: el examId del intento referencia a un examen en 'exams', necesitas el titulo.

---

## Datos de prueba para desarrollo local

Pegar en la consola del navegador:

```js
localStorage.setItem('users', JSON.stringify([{
  document: "12345678",
  fullName: "Juan Perez",
  email: "juan@email.com",
  specialty: "Redes",
  role: "student"
}]));

localStorage.setItem('attempts', JSON.stringify([{
  id: "abc12345",
  userId: "12345678",
  examId: "exam-1",
  score: 85,
  passed: true,
  date: new Date().toISOString()
}]));

localStorage.setItem('exams', JSON.stringify([{
  id: "exam-1",
  title: "Examen de Redes",
  area: "Redes",
  passingScore: 70,
  questions: []
}]));
```

Luego navegar a: http://localhost:5173/cv/12345678

---

## Comandos utiles

```bash
# Cambiar a tu rama
git checkout toribio-anselmo-david-angel

# Instalar dependencia PDF
npm install html2pdf.js
npm install -D @types/html2pdf.js

# Guardar cambios
git add src/components/PublicProfile/
git commit -m "feat(profile): implementar CV publico y descarga de certificado PDF"

# Subir cambios
git push origin toribio-anselmo-david-angel
```
