// src/components/Committee/ExamEditor.tsx
// RESPONSABLE: LESLY

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Exam, Question } from '../../types';
import { getExams, saveExams, getCurrentUser, setCurrentUser } from '../../utils/storage';
import QuestionForm from './QuestionForm';

export default function ExamEditor() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
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
    setSuccessMsg(`Examen "${nuevoExamen.title}" guardado exitosamente.`);

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
      <div className="exam-editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="header-icon">
            <svg className="w-8 h-8 text-[#8b84ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
            </svg>
          </div>
          <div>
            <h1 className="header-title">Editor de Exámenes</h1>
            <p className="header-subtitle">Comité Técnico — Panel de Administración</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {currentUser && (
            <Link
              to={`/cv/${currentUser.document}`}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Mi CV
            </Link>
          )}
          <Link to="/users" className="btn btn-secondary">
            Ver Usuarios
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => { setCurrentUser(null); navigate('/login'); }}
          >
            Cerrar Sesión
          </button>
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
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <svg className="w-12 h-12 text-[#9da5c8]/30 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
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
                      {q.type === 'multiple' ? 'Múltiple opción' : 'Abierta'}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-icon btn-danger"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handleRemoveQuestion(q.id)}
                  title="Eliminar pregunta"
                >
                  <svg className="w-5 h-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6.6m-2.77 0-.34-6.6M9.25 16h8.5M4 6.05h16M19.32 9.176l-.818 10.84a1.5 1.5 0 0 1-1.493 1.384H6.992a1.5 1.5 0 0 1-1.493-1.384L4.68 9.176M9.25 6h5.5M10.5 3.5h3" />
                  </svg>
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
              Guardar Examen
            </button>
          </div>
        </section>

        {/* ── Lista de exámenes guardados ── */}
        <section className="card">
          <h2 className="card-title">Exámenes guardados ({savedExams.length})</h2>

          {savedExams.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <svg className="w-12 h-12 text-[#9da5c8]/30 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18M2.25 13.5V6.25A2.25 2.25 0 0 1 4.5 4h5.25a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h5.1c1.243 0 2.25 1.007 2.25 2.25v7.25c0 1.243-1.007 2.25-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 13.5Z" />
              </svg>
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
