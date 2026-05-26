# TAREA - Yauri Torres Benjamin Raul
# Modulo: Rendicion de Examenes

Rama de trabajo: yauri-torres-benjamin-raul

---

## Responsabilidades

Tu modulo permite a los estudiantes ver los examenes disponibles, responderlos y ver su resultado. Dependes de que Lesly haya guardado examenes en localStorage bajo la clave 'exams', y de que Erick haya guardado el usuario activo en 'currentUser'.

---

## Archivos que debes implementar

```
src/
└── components/
    └── Student/
        ├── ExamList.tsx               <- Listado de examenes disponibles
        └── TakeExam.tsx               <- Pantalla para responder el examen
```

---

## Tipos que usaras (de src/types.ts)

```ts
interface Exam {
  id: string;
  title: string;
  area: string;
  passingScore: number;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'open';
  options: string[];
  correctAnswer: string;
}

interface ExamAttempt {
  id: string;
  userId: string;    // document del usuario (currentUser.document)
  examId: string;
  score: number;     // porcentaje obtenido, ej: 85
  passed: boolean;
  date: string;      // ISO string: new Date().toISOString()
}
```

---

## Paso 1 - ExamList.tsx: Listado de examenes

Leer los examenes disponibles de localStorage:

```ts
import { getExams, getCurrentUser, getAttempts } from '../../utils/storage';

const exams = getExams();       // lista de Exam[]
const user = getCurrentUser();  // usuario logueado
const attempts = getAttempts(); // intentos anteriores
```

Mostrar por cada examen:
- Titulo
- Area
- Puntaje de aprobacion (ej: "Aprobar con 70%")
- Numero de preguntas
- Si el estudiante ya rindio ese examen: mostrar su puntaje y si aprobo o no
- Boton "Rendir examen" que navega a /examenes/:id

Verificar intento previo:
```ts
const intentoPrevio = attempts.find(
  a => a.userId === user?.document && a.examId === exam.id
);
```

Si ya tiene un intento, deshabilitar el boton y mostrar el resultado anterior.

---

## Paso 2 - TakeExam.tsx: Pantalla para responder el examen

Leer el examen por ID desde la URL:

```ts
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, getCurrentUser, getAttempts } from '../../utils/storage';

const { id } = useParams<{ id: string }>();
const exam = getExamById(id!);
const user = getCurrentUser();
```

Guardar las respuestas del usuario en estado local:
```ts
const [respuestas, setRespuestas] = useState<Record<string, string>>({});
// clave: question.id, valor: respuesta elegida
```

Para cada pregunta mostrar:
- El texto de la pregunta
- Si type es 'multiple': mostrar los options como radio buttons
- Si type es 'open': mostrar un input de texto

---

## Paso 3 - Logica de evaluacion al enviar

Cuando el usuario hace clic en "Enviar examen":

```ts
// 1. Calcular puntaje
let correctas = 0;
exam.questions.forEach(pregunta => {
  const respuestaUsuario = respuestas[pregunta.id] ?? '';
  if (respuestaUsuario.trim().toLowerCase() === pregunta.correctAnswer.trim().toLowerCase()) {
    correctas++;
  }
});

const score = Math.round((correctas / exam.questions.length) * 100);
const passed = score >= exam.passingScore;

// 2. Crear el intento
const intento: ExamAttempt = {
  id: crypto.randomUUID(),
  userId: user!.document,
  examId: exam.id,
  score,
  passed,
  date: new Date().toISOString(),
};

// 3. Guardar en localStorage
import { addAttempt } from '../../utils/storage';
addAttempt(intento);

// 4. Mostrar resultado al usuario
// Si passed: mensaje de aprobacion y, si quieres, un boton para ver el certificado
// Si !passed: mensaje de reprobacion con el puntaje obtenido
```

---

## Paso 4 - Resultado y certificado

Despues de guardar el intento, mostrar en pantalla:
- Puntaje obtenido: X de Y preguntas correctas (Z%)
- Aprobado / Reprobado
- Si aprobo: mostrar boton "Ver mi certificado" que navega a /cv/:userId (ruta de David)
- Boton "Volver a la lista de examenes"

No generar el certificado tu mismo. Solo guardar el intento. David se encarga de generar el certificado a partir de los intentos aprobados.

---

## Validaciones

- Si no hay currentUser al entrar a /examenes, redirigir a /login.
- Si el estudiante ya tiene un intento para ese examen, no dejar que ingrese a /examenes/:id de nuevo. Redirigir a la lista con un mensaje.
- No dejar enviar el examen si hay preguntas sin responder.

---

## Dependencias del equipo

- Lesly debe haber guardado al menos un examen en la clave 'exams' para que tu lista no quede vacia. Para pruebas, puedes agregar un examen de ejemplo directamente en localStorage desde la consola del navegador.
- Erick debe haber guardado currentUser para que puedas identificar al estudiante.
- David lee la clave 'attempts' para generar certificados. Asegurate de que el formato ExamAttempt sea exacto.

---

## Datos de prueba para desarrollo local

Pegar en la consola del navegador para simular que Lesly ya creo un examen:

```js
localStorage.setItem('exams', JSON.stringify([{
  id: "exam-1",
  title: "Examen de Redes",
  area: "Redes",
  passingScore: 70,
  questions: [
    { id: "q1", text: "Que protocolo usa HTTP?", type: "multiple", options: ["TCP", "UDP", "ICMP", "FTP"], correctAnswer: "TCP" },
    { id: "q2", text: "Cuantas capas tiene el modelo OSI?", type: "multiple", options: ["4", "5", "7", "3"], correctAnswer: "7" }
  ]
}]));
```

---

## Comandos utiles

```bash
# Cambiar a tu rama
git checkout yauri-torres-benjamin-raul

# Guardar cambios
git add src/components/Student/
git commit -m "feat(student): implementar lista y rendicion de examenes"

# Subir cambios
git push origin yauri-torres-benjamin-raul
```
