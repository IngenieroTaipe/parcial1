// src/components/Student/TakeExam.tsx
// RESPONSABLE: BENJAMIN

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, getCurrentUser, getAttemptsByUser, addAttempt } from '../../utils/storage';
import { Exam, ExamAttempt, User } from '../../types';

export default function TakeExam() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    if (!id) {
      navigate('/examenes');
      return;
    }

    const currentExam = getExamById(id);
    if (!currentExam) {
      navigate('/examenes');
      return;
    }
    setExam(currentExam);

    // Validar si el estudiante ya rindió el examen previamente
    const userAttempts = getAttemptsByUser(currentUser.document);
    const alreadyTaken = userAttempts.find((a) => a.examId === currentExam.id);
    if (alreadyTaken) {
      navigate('/examenes');
      return;
    }

    setLoading(false);
  }, [id, navigate]);

  if (loading || !user || !exam) {
    return (
      <div className="exam-editor-container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando examen...</p>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionValue: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const handleOpenAnswerChange = (questionId: string, textValue: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: textValue,
    }));
  };

  const isAllAnswered = exam.questions.every(
    (q) => answers[q.id] && answers[q.id].trim() !== ''
  );

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllAnswered) return;

    // Lógica de calificación
    let correctCount = 0;
    exam.questions.forEach((q) => {
      const userAnswer = answers[q.id] || '';
      const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / exam.questions.length) * 100);
    const passed = score >= exam.passingScore;

    const newAttempt: ExamAttempt = {
      id: crypto.randomUUID(),
      userId: user.document,
      examId: exam.id,
      score,
      passed,
      date: new Date().toISOString(),
    };

    addAttempt(newAttempt);
    setAttemptResult(newAttempt);
    setSubmitted(true);
  };

  if (submitted && attemptResult) {
    const totalQuestions = exam.questions.length;
    const correctCount = Math.round((attemptResult.score / 100) * totalQuestions);

    return (
      <div className="exam-editor-container" style={{ maxWidth: '650px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          
          {attemptResult.passed ? (
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {attemptResult.passed ? '¡Examen Aprobado!' : 'Examen No Aprobado'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {exam.title} • {exam.area}
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Respuestas Correctas
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {correctCount} / {totalQuestions}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Puntaje Obtenido
              </span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: attemptResult.passed ? 'var(--success)' : 'var(--danger)'
              }}>
                {attemptResult.score}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px', margin: '0 auto' }}>
            {attemptResult.passed && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/cv/${user.document}`)}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              >
                Ver mi Certificado
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/examenes')}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              Volver a la lista de exámenes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-editor-container" style={{ maxWidth: '800px' }}>
      {/* Encabezado */}
      <div className="exam-editor-header" style={{ marginBottom: '1.5rem', paddingBottom: '1rem' }}>
        <div className="header-icon">
          <svg className="w-8 h-8 text-[#8b84ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </div>
        <div>
          <h1 className="header-title">{exam.title}</h1>
          <p className="header-subtitle">
            Área: {exam.area} • Requisito: Mínimo {exam.passingScore}% de aprobación
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitExam}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {exam.questions.map((question, qIndex) => (
            <div key={question.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span className="question-number" style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)' }}>
                  {qIndex + 1}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                  {question.text}
                </h3>
              </div>

              {/* Opción Múltiple */}
              {question.type === 'multiple' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {question.options.map((option, oIndex) => {
                    const isSelected = answers[question.id] === option;
                    return (
                      <label
                        key={oIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          background: isSelected ? 'rgba(108, 99, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleSelectOption(question.id, option)}
                          style={{
                            accentColor: 'var(--accent)',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.95rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Respuesta Abierta */}
              {question.type === 'open' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Tu respuesta escrita
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Escribe la respuesta exacta esperada..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleOpenAnswerChange(question.id, e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          ))}

          {/* Acciones del Examen */}
          <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isAllAnswered ? (
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Todas las preguntas han sido respondidas</span>
                ) : (
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Falta responder preguntas para poder enviar</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas salir? Perderás el progreso de tus respuestas.')) {
                      navigate('/examenes');
                    }
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isAllAnswered}
                  style={{
                    opacity: isAllAnswered ? 1 : 0.5,
                    cursor: isAllAnswered ? 'pointer' : 'not-allowed',
                    boxShadow: isAllAnswered ? '0 4px 14px var(--accent-glow)' : 'none'
                  }}
                >
                  Enviar Examen
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
