import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getExams, getCurrentUser, getAttemptsByUser } from '../../utils/storage';
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
    // Validar sesión: Si no hay usuario logueado o no es un estudiante/usuario, redirigir
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Cargar exámenes e intentos
    setExams(getExams());
    setAttempts(getAttemptsByUser(currentUser.document));
  }, [navigate]);

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span><strong>DNI:</strong> {user.document}</span>
            <span><strong>Correo:</strong> {user.email}</span>
          </div>
        </div>
      </div>

      {/* Header del Portal de Exámenes */}
      <div className="exam-editor-header" style={{ borderBottom: 'none', marginBottom: '1.5rem', paddingBottom: 0 }}>
        <div className="header-icon">🎓</div>
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
            <span className="empty-icon">📁</span>
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
              // Buscar si hay un intento previo
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
                          {previousAttempt.passed ? '✓ Aprobado' : '✗ Reprobado'}
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
                      <span>📋 <strong>{exam.questions.length}</strong> {exam.questions.length === 1 ? 'Pregunta' : 'Preguntas'}</span>
                      <span>🎯 <strong>Mínimo {exam.passingScore}%</strong> para aprobar</span>
                    </div>

                    <div>
                      {previousAttempt ? (
                        previousAttempt.passed ? (
                          <Link
                            to={`/cv/${user.document}`}
                            className="btn btn-secondary"
                            style={{ gap: '0.5rem' }}
                          >
                            <span>🎓</span> Ver mi certificado
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
                          <span>✍️</span> Rendir Examen
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
