// src/components/PublicProfile/CVPage.tsx
// RESPONSABLE: Toribio Anselmo David Angel

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getUsers,
  getAttempts,
  getCertificates,
  getExams,
  addCertificate,
} from '../../utils/storage';
import { User, ExamAttempt, Exam, Certificate } from '../../types';
import CertificateView from './CertificateView';

export default function CVPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<User | null>(null);
  const [intentosAprobados, setIntentosAprobados] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [certSeleccionado, setCertSeleccionado] = useState<{
    attempt: ExamAttempt;
    examTitle: string;
    examArea: string;
  } | null>(null);

  useEffect(() => {
    const users = getUsers();
    const found = users.find(u => u.document === userId);
    if (!found) return;
    setUsuario(found);

    const todosExamenes = getExams();
    setExams(todosExamenes);

    const aprobados = getAttempts().filter(
      a => a.userId === userId && a.passed
    );
    setIntentosAprobados(aprobados);

    // Generar certificados que aun no existen
    const certsActuales = getCertificates();
    const nuevos: Certificate[] = [];
    aprobados.forEach(a => {
      const yaExiste = certsActuales.find(
        c => c.userId === a.userId && c.examId === a.examId
      );
      if (!yaExiste) {
        const exam = todosExamenes.find(e => e.id === a.examId);
        nuevos.push({
          hash: a.id,
          userId: a.userId,
          examId: a.examId,
          examTitle: exam?.title ?? 'Examen',
          issueDate: new Date().toISOString(),
          publicUrl: `/certificado/${a.id}`,
        });
      }
    });
    nuevos.forEach(c => addCertificate(c));
  }, [userId]);

  if (!usuario) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Perfil no encontrado</h2>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            No existe un usuario con el documento "{userId}".
          </p>
          <button style={styles.btnSecondary} onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatarCircle}>
          {usuario.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>
            {usuario.fullName}
          </h1>
          <p style={{ margin: 0, color: '#818cf8', fontWeight: '500' }}>
            {usuario.specialty}
          </p>
        </div>
      </div>

      {/* Grid Bento */}
      <div style={styles.grid}>

        {/* Tarjeta informacion personal */}
        <div style={{ ...styles.card, gridColumn: 'span 1' }}>
          <h2 style={styles.cardTitle}>Informacion Personal</h2>
          <div style={styles.infoRow}>
            <span style={styles.label}>DNI / Documento</span>
            <span style={styles.value}>{usuario.document}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Correo electronico</span>
            <span style={styles.value}>{usuario.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Especialidad</span>
            <span style={styles.value}>{usuario.specialty}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Rol</span>
            <span style={{
              ...styles.value,
              background: usuario.role === 'admin' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)',
              color: usuario.role === 'admin' ? '#818cf8' : '#34d399',
              borderRadius: '9999px',
              padding: '2px 12px',
              fontSize: '12px',
              fontWeight: '600',
            }}>
              {usuario.role === 'admin' ? 'Administrador' : 'Estudiante'}
            </span>
          </div>
        </div>

        {/* Tarjeta estadisticas */}
        <div style={{ ...styles.card, gridColumn: 'span 1' }}>
          <h2 style={styles.cardTitle}>Resumen</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{intentosAprobados.length}</span>
              <span style={styles.statLabel}>Examenes aprobados</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>
                {intentosAprobados.length > 0
                  ? Math.round(
                      intentosAprobados.reduce((acc, a) => acc + a.score, 0) /
                        intentosAprobados.length
                    )
                  : 0}%
              </span>
              <span style={styles.statLabel}>Puntaje promedio</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>
                {intentosAprobados.length > 0
                  ? Math.max(...intentosAprobados.map(a => a.score))
                  : 0}%
              </span>
              <span style={styles.statLabel}>Mejor puntaje</span>
            </div>
          </div>
        </div>

        {/* Tarjeta certificaciones */}
        <div style={{ ...styles.card, gridColumn: 'span 2' }}>
          <h2 style={styles.cardTitle}>Certificaciones Obtenidas</h2>

          {intentosAprobados.length === 0 ? (
            <p style={{ color: '#64748b', margin: 0 }}>
              Aun no hay certificaciones obtenidas.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {intentosAprobados.map(intento => {
                const exam = exams.find(e => e.id === intento.examId);
                const titulo = exam?.title ?? 'Examen';
                const area = exam?.area ?? '';
                return (
                  <div key={intento.id} style={styles.certRow}>
                    <div style={styles.certBadge}>
                      {titulo.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontWeight: '600', color: '#f1f5f9' }}>
                        {titulo}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        {area} &nbsp;|&nbsp; {new Date(intento.date).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)',
                        color: '#818cf8',
                        borderRadius: '9999px',
                        padding: '4px 14px',
                        fontSize: '13px',
                        fontWeight: '700',
                      }}>
                        {intento.score}%
                      </span>
                      <button
                        style={styles.btnPrimary}
                        onClick={() =>
                          setCertSeleccionado({
                            attempt: intento,
                            examTitle: titulo,
                            examArea: area,
                          })
                        }
                      >
                        Ver certificado
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal certificado */}
      {certSeleccionado && (
        <div style={styles.overlay} onClick={() => setCertSeleccionado(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '18px' }}>
                Certificado
              </h3>
              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
                onClick={() => setCertSeleccionado(null)}
              >
                x
              </button>
            </div>
            <CertificateView
              attempt={certSeleccionado.attempt}
              user={usuario}
              examTitle={certSeleccionado.examTitle}
              examArea={certSeleccionado.examArea}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    padding: '2rem',
    fontFamily: 'Inter, sans-serif',
    color: '#f1f5f9',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    maxWidth: '960px',
    margin: '0 auto 32px',
    padding: '24px 28px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  avatarCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '960px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    margin: '0 0 20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#818cf8',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  label: {
    fontSize: '13px',
    color: '#64748b',
  },
  value: {
    fontSize: '13px',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginTop: '4px',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '12px',
    padding: '16px 8px',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#818cf8',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '6px',
    textAlign: 'center',
  },
  certRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  certBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.08)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  errorCard: {
    maxWidth: '400px',
    margin: '80px auto',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '32px',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '20px',
  },
  modal: {
    background: '#1e293b',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '28px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
  },
};
