# TAREA - Navarro Serva Lesly Brenda
# Modulo: Comite Tecnico - Creacion de Examenes

Rama de trabajo: navarro-serva-lesly-brenda

---

## Responsabilidades

Tu modulo permite a los administradores crear examenes con preguntas de opcion multiple o abiertas. Los examenes que crees en Local Storage seran leidos directamente por Benjamin para que los estudiantes los rindan.

---

## Archivos que debes implementar

```
src/
└── components/
    └── Committee/
        ├── ExamEditor.tsx             <- Pagina principal: formulario del examen
        └── QuestionForm.tsx           <- Sub-componente: formulario de una pregunta
```

---

## Tipos que usaras (de src/types.ts)

```ts
interface Exam {
  id: string;
  title: string;
  area: string;
  passingScore: number; // porcentaje de aprobacion, ej: 70
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'open';
  options: string[]; // array vacio si type es 'open'
  correctAnswer: string;
}
```

---

## Paso 1 - ExamEditor.tsx: Formulario principal del examen

Campos del formulario para crear un examen:
- title (texto): titulo del examen
- area (texto): area tematica, ej: "Matematicas", "Redes"
- passingScore (numero): porcentaje minimo para aprobar, ej: 70

Debajo del formulario del examen, mostrar la lista de preguntas agregadas hasta el momento y un boton "Agregar pregunta" que muestre el componente QuestionForm.

Estado local sugerido:
```ts
const [exam, setExam] = useState<Omit<Exam, 'id' | 'questions'>>({
  title: '',
  area: '',
  passingScore: 70,
});
const [questions, setQuestions] = useState<Question[]>([]);
```

---

## Paso 2 - QuestionForm.tsx: Sub-componente para agregar preguntas

Este componente recibe una funcion onAdd(question: Question) por props y la llama cuando el usuario confirma la pregunta.

Campos:
- text (textarea): enunciado de la pregunta
- type (select): 'multiple' o 'open'
- Si type es 'multiple':
  - 4 campos de opciones (option 1, 2, 3, 4)
  - Un campo para indicar cual es la respuesta correcta (puede ser un select con las opciones ingresadas)
- Si type es 'open':
  - Un campo correctAnswer (texto libre esperado)

```tsx
interface QuestionFormProps {
  onAdd: (question: Question) => void;
}
```

Para generar IDs unicos usar: `crypto.randomUUID()` o `Date.now().toString()`.

---

## Paso 3 - Guardar el examen en Local Storage

Cuando el usuario haga clic en "Guardar Examen":

```ts
import { getExams, saveExams } from '../../utils/storage';
import { Exam } from '../../types';

const nuevoExamen: Exam = {
  id: crypto.randomUUID(),
  title: exam.title,
  area: exam.area,
  passingScore: exam.passingScore,
  questions: questions,
};

const examenesActuales = getExams();
saveExams([...examenesActuales, nuevoExamen]);

// Limpiar formulario y mostrar mensaje de exito
```

La clave en localStorage sera 'exams'. La funcion saveExams ya lo maneja.

---

## Paso 4 - Listado de examenes existentes

En la misma pagina ExamEditor, mostrar los examenes ya guardados en una tabla o lista:
- Titulo
- Area
- Puntaje de aprobacion
- Numero de preguntas
- Boton "Eliminar"

Para eliminar:
```ts
const actualizados = getExams().filter(e => e.id !== idAEliminar);
saveExams(actualizados);
```

---

## Validaciones

- El examen debe tener al menos un titulo y un area antes de guardar.
- El examen debe tener al menos 1 pregunta.
- Cada pregunta de tipo 'multiple' debe tener exactamente 4 opciones y una respuesta correcta seleccionada.
- El passingScore debe estar entre 1 y 100.

---

## Dependencias del equipo

- Benjamin lee la clave 'exams' directamente de localStorage. El formato debe ser exactamente Exam[] segun types.ts.
- David lee 'attempts' y 'certificates', no depende directamente de tu modulo pero los certificados referencian examId y examTitle que vienen de tus examenes.

---

## Comandos utiles

```bash
# Cambiar a tu rama
git checkout navarro-serva-lesly-brenda

# Guardar cambios
git add src/components/Committee/
git commit -m "feat(committee): implementar editor de examenes y preguntas"

# Subir cambios
git push origin navarro-serva-lesly-brenda
```
