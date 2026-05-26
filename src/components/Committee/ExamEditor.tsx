import { useState, useEffect } from 'react';
import { Exam, Question } from '../../types';
import { getExams, saveExams } from '../../utils/storage';
import QuestionForm from './QuestionForm';

export default function ExamEditor() {
  const [exam, setExam] = useState<Omit<Exam, 'id' | 'questions'>>({
    title: '',
    area: '',
    passingScore: 70,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [savedExams, setSavedExams] = useState<Exam[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setSavedExams(getExams());
  }, []);

  const handleAddQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
    setShowQuestionForm(false);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveExam = () => {
    setError('');
    setSuccessMsg('');

    if (!exam.title.trim() || !exam.area.trim()) {
      setError('El título y el área del examen son obligatorios.');
      return;
    }
    if (questions.length === 0) {
      setError('El examen debe tener al menos una pregunta.');
      return;
    }
    if (exam.passingScore < 1 || exam.passingScore > 100) {
      setError('El puntaje de aprobación debe estar entre 1 y 100.');
      return;
    }

    const nuevoExamen: Exam = {
      id: crypto.randomUUID(),
      title: exam.title.trim(),
      area: exam.area.trim(),
      passingScore: exam.passingScore,
      questions,
    };

    const examenesActuales = getExams();
    saveExams([...examenesActuales, nuevoExamen]);

    // Limpiar formulario y mostrar mensaje de éxito
    setExam({ title: '', area: '', passingScore: 70 });
    setQuestions([]);
    setShowQuestionForm(false);
    setSavedExams(getExams());
    setSuccessMsg(`✅ Examen "${nuevoExamen.title}" guardado exitosamente.`);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteExam = (id: string) => {
    const actualizados = getExams().filter((e) => e.id !== id);
    saveExams(actualizados);
    setSavedExams(actualizados);
  };

  return (
    <div className="exam-editor-container">
      {/* Header */}
      <div className="exam-editor-header">
        <div className="header-icon">📋</div>
        <div>
          <h1 className="header-title">Editor de Exámenes</h1>
          <p className="header-subtitle">Comité Técnico — Panel de Administración</p>
        </div>
      </div>

      <div className="exam-editor-body">
        {/* ── Formulario del examen ── */}
        <section className="card">
          <h2 className="card-title">Crear nuevo examen</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="exam-title">Título del examen</label>
              <input
                id="exam-title"
                className="form-input"
                type="text"
                placeholder="Ej: Fundamentos de Redes"
                value={exam.title}
                onChange={(e) => setExam({ ...exam, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exam-area">Área temática</label>
              <input
                id="exam-area"
                className="form-input"
                type="text"
                placeholder="Ej: Matemáticas, Redes, Programación"
                value={exam.area}
                onChange={(e) => setExam({ ...exam, area: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exam-score">
                Puntaje mínimo de aprobación (%)
              </label>
              <input
                id="exam-score"
                className="form-input"
                type="number"
                min={1}
                max={100}
                value={exam.passingScore}
                onChange={(e) =>
                  setExam({ ...exam, passingScore: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* ── Lista de preguntas agregadas ── */}
          <div className="questions-section">
            <div className="questions-header">
              <h3 className="section-subtitle">
                Preguntas ({questions.length})
              </h3>
              {!showQuestionForm && (
                <button
                  id="btn-add-question"
                  className="btn btn-outline"
                  onClick={() => setShowQuestionForm(true)}
                >
                  + Agregar pregunta
                </button>
              )}
            </div>

            {questions.length === 0 && !showQuestionForm && (
              <div className="empty-state">
                <span className="empty-icon">🗒️</span>
                <p>Aún no hay preguntas. Agrega al menos una.</p>
              </div>
            )}

            {questions.map((q, index) => (
              <div key={q.id} className="question-item">
                <div className="question-item-left">
                  <span className="question-number">{index + 1}</span>
                  <div>
                    <p className="question-text">{q.text}</p>
                    <span className={`question-badge ${q.type}`}>
                      {q.type === 'multiple' ? '📌 Múltiple opción' : '✏️ Abierta'}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleRemoveQuestion(q.id)}
                  title="Eliminar pregunta"
                >
                  🗑️
                </button>
              </div>
            ))}

            {showQuestionForm && (
              <QuestionForm
                onAdd={handleAddQuestion}
                onCancel={() => setShowQuestionForm(false)}
              />
            )}
          </div>

          {error && <p className="form-error">{error}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <div className="save-actions">
            <button
              id="btn-save-exam"
              className="btn btn-primary btn-large"
              onClick={handleSaveExam}
            >
              💾 Guardar Examen
            </button>
          </div>
        </section>

        {/* ── Lista de exámenes guardados ── */}
        <section className="card">
          <h2 className="card-title">Exámenes guardados ({savedExams.length})</h2>

          {savedExams.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📂</span>
              <p>No hay exámenes guardados aún.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="exams-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Área</th>
                    <th>% Aprobación</th>
                    <th>Preguntas</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {savedExams.map((e) => (
                    <tr key={e.id}>
                      <td className="td-title">{e.title}</td>
                      <td>
                        <span className="area-chip">{e.area}</span>
                      </td>
                      <td className="td-center">
                        <span className="score-badge">{e.passingScore}%</span>
                      </td>
                      <td className="td-center">{e.questions.length}</td>
                      <td className="td-center">
                        <button
                          className="btn btn-danger-sm"
                          onClick={() => handleDeleteExam(e.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
