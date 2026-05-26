// src/components/Student/ExamList.tsx
// RESPONSABLE: BENJAMIN

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getExams, getCurrentUser, getAttemptsByUser, setCurrentUser } from '../../utils/storage';
import { Exam, ExamAttempt, User } from '../../types';

export default function ExamList() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setExams(getExams());
    setAttempts(getAttemptsByUser(currentUser.document));
  }, [navigate]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  // Filtrar exámenes
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.area.toLowerCase().includes(search.toLowerCase());
    const matchesArea = selectedArea === '' || exam.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  // Obtener áreas únicas para el filtro
  const areas = Array.from(new Set(exams.map((e) => e.area)));

  return (
    <div className="exam-editor-container">
      {/* Perfil del Estudiante */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              fontSize: '2rem',
              background: 'var(--accent-glow)',
              color: 'var(--accent-light)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700'
            }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {user.fullName}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '2px 0 0' }}>
                Estudiante • {user.specialty}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span><strong>DNI:</strong> {user.document}</span>
              <span><strong>Correo:</strong> {user.email}</span>
            </div>
            <Link
              to={`/cv/${user.document}`}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Ver mi CV
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Header del Portal de Exámenes */}
      <div className="exam-editor-header" style={{ borderBottom: 'none', marginBottom: '1.5rem', paddingBottom: 0 }}>
        <div className="header-icon">
          <svg className="w-8 h-8 text-[#8b84ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M12 2.25V9.75m0 0 3-3m-3 3-3-3" />
          </svg>
        </div>
        <div>
          <h1 className="header-title">Portal de Certificaciones</h1>
          <p className="header-subtitle">Exámenes disponibles para tu especialización y desarrollo profesional</p>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar exámenes por título o palabra clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ minWidth: '180px' }}
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">Todas las áreas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Exámenes */}
      <div className="exam-editor-body">
        {filteredExams.length === 0 ? (
          <div className="empty-state" style={{ padding: '3.5rem 2rem' }}>
            <svg className="w-12 h-12 text-[#9da5c8]/30 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18M2.25 13.5V6.25A2.25 2.25 0 0 1 4.5 4h5.25a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h5.1c1.243 0 2.25 1.007 2.25 2.25v7.25c0 1.243-1.007 2.25-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 13.5Z" />
            </svg>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              No se encontraron exámenes disponibles
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {exams.length === 0
                ? 'El comité técnico aún no ha publicado ningún examen.'
                : 'Intenta modificar tus criterios de búsqueda o filtros.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {filteredExams.map((exam) => {
              const previousAttempt = attempts.find((a) => a.examId === exam.id);

              return (
                <div
                  key={exam.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    borderLeft: previousAttempt
                      ? previousAttempt.passed
                        ? '4px solid var(--success)'
                        : '4px solid var(--danger)'
                      : '4px solid var(--accent)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span className="area-chip" style={{ marginRight: '0.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                        {exam.area}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {exam.title}
                      </h3>
                    </div>

                    {/* Mostrar Estado / Resultado previo */}
                    {previousAttempt ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span className={`question-badge ${previousAttempt.passed ? 'open' : 'multiple'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                          {previousAttempt.passed ? 'Aprobado' : 'Reprobado'}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          Puntaje: {previousAttempt.score}% (Mín. {exam.passingScore}%)
                        </span>
                      </div>
                    ) : (
                      <span className="question-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <span>Preguntas: <strong>{exam.questions.length}</strong></span>
                      <span>Mínimo <strong>{exam.passingScore}%</strong> para aprobar</span>
                    </div>

                    <div>
                      {previousAttempt ? (
                        previousAttempt.passed ? (
                          <Link
                            to={`/cv/${user.document}`}
                            className="btn btn-secondary"
                            style={{ gap: '0.5rem' }}
                          >
                            Ver mi certificado
                          </Link>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            disabled
                            style={{ cursor: 'not-allowed', opacity: 0.6 }}
                            title="Ya has rendido este examen y no se permiten más intentos."
                          >
                            No disponible
                          </button>
                        )
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/examenes/${exam.id}`)}
                          style={{ gap: '0.5rem' }}
                        >
                          Rendir Examen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
