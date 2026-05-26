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
  getCurrentUser,
  getProfileByUser,
  saveProfile,
} from '../../utils/storage';
import { User, ExamAttempt, Exam, Certificate, WorkExperience, Education, UserProfile } from '../../types';
import CertificateView from './CertificateView';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso || iso.toLowerCase() === 'actualidad') return 'Actualidad';
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      margin: '0 0 20px',
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: '#818cf8',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      {children}
    </h2>
  );
}

// ─── WorkExperience form ──────────────────────────────────────────────────────

interface WorkFormProps {
  initial?: WorkExperience;
  onSave: (w: WorkExperience) => void;
  onCancel: () => void;
}

function WorkForm({ initial, onSave, onCancel }: WorkFormProps) {
  const [form, setForm] = useState<Omit<WorkExperience, 'id'>>({
    company: initial?.company ?? '',
    position: initial?.position ?? '',
    startDate: initial?.startDate ?? '',
    endDate: initial?.endDate ?? '',
    description: initial?.description ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim() || !form.startDate.trim()) return;
    onSave({ id: initial?.id ?? crypto.randomUUID(), ...form });
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#64748b',
    marginBottom: '4px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Empresa</label>
          <input style={inputStyle} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required placeholder="Nombre de la empresa" />
        </div>
        <div>
          <label style={labelStyle}>Cargo</label>
          <input style={inputStyle} value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} required placeholder="Tu puesto" />
        </div>
        <div>
          <label style={labelStyle}>Fecha inicio</label>
          <input style={inputStyle} type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Fecha fin (deja vacío si es actual)</label>
          <input style={inputStyle} type="month" value={form.endDate === 'Actualidad' ? '' : form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value || 'Actualidad' })} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Descripción breve</label>
        <textarea
          style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe brevemente tus responsabilidades..."
        />
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={btnSecondaryStyle}>Cancelar</button>
        <button type="submit" style={btnPrimaryStyle}>Guardar</button>
      </div>
    </form>
  );
}

// ─── Education form ───────────────────────────────────────────────────────────

interface EduFormProps {
  initial?: Education;
  onSave: (ed: Education) => void;
  onCancel: () => void;
}

function EduForm({ initial, onSave, onCancel }: EduFormProps) {
  const [form, setForm] = useState<Omit<Education, 'id'>>({
    institution: initial?.institution ?? '',
    degree: initial?.degree ?? '',
    field: initial?.field ?? '',
    startDate: initial?.startDate ?? '',
    endDate: initial?.endDate ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institution.trim() || !form.degree.trim()) return;
    onSave({ id: initial?.id ?? crypto.randomUUID(), ...form });
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#64748b',
    marginBottom: '4px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Institución</label>
          <input style={inputStyle} value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} required placeholder="Universidad / Instituto" />
        </div>
        <div>
          <label style={labelStyle}>Grado / Título</label>
          <input style={inputStyle} value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} required placeholder="Ej: Bachiller, Técnico" />
        </div>
        <div>
          <label style={labelStyle}>Campo de estudio</label>
          <input style={inputStyle} value={form.field} onChange={e => setForm({ ...form, field: e.target.value })} placeholder="Ej: Ingeniería de Sistemas" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={labelStyle}>Inicio</label>
            <input style={inputStyle} type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Fin</label>
            <input style={inputStyle} type="month" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={btnSecondaryStyle}>Cancelar</button>
        <button type="submit" style={btnPrimaryStyle}>Guardar</button>
      </div>
    </form>
  );
}

// ─── Shared button styles ─────────────────────────────────────────────────────

const btnPrimaryStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 18px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnSecondaryStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  color: '#e2e8f0',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '8px 18px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnDangerStyle: React.CSSProperties = {
  background: 'rgba(255,92,108,0.1)',
  color: '#ff8a94',
  border: '1px solid rgba(255,92,108,0.2)',
  borderRadius: '6px',
  padding: '4px 10px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

// ─── Main CVPage component ────────────────────────────────────────────────────

export default function CVPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<User | null>(null);
  const [intentosAprobados, setIntentosAprobados] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ userId: userId ?? '', workExperience: [], education: [] });
  const [certSeleccionado, setCertSeleccionado] = useState<{
    attempt: ExamAttempt;
    examTitle: string;
    examArea: string;
  } | null>(null);

  // Edit states
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkExperience | null>(null);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const currentUser = getCurrentUser();
  const isOwner = currentUser?.document === userId;

  useEffect(() => {
    const users = getUsers();
    const found = users.find(u => u.document === userId);
    if (!found) return;
    setUsuario(found);

    const todosExamenes = getExams();
    setExams(todosExamenes);

    const aprobados = getAttempts().filter(a => a.userId === userId && a.passed);
    setIntentosAprobados(aprobados);

    // Load profile
    setProfile(getProfileByUser(userId ?? ''));

    // Generar certificados que aun no existen
    const certsActuales = getCertificates();
    aprobados.forEach(a => {
      const yaExiste = certsActuales.find(c => c.userId === a.userId && c.examId === a.examId);
      if (!yaExiste) {
        const exam = todosExamenes.find(e => e.id === a.examId);
        const newCert: Certificate = {
          hash: a.id,
          userId: a.userId,
          examId: a.examId,
          examTitle: exam?.title ?? 'Examen',
          issueDate: new Date().toISOString(),
          publicUrl: `/certificado/${a.id}`,
        };
        addCertificate(newCert);
      }
    });
  }, [userId]);

  // ── Work Experience handlers ──
  const handleSaveWork = (w: WorkExperience) => {
    const updated = editingWork
      ? profile.workExperience.map(x => x.id === w.id ? w : x)
      : [...profile.workExperience, w];
    const newProfile = { ...profile, workExperience: updated };
    setProfile(newProfile);
    saveProfile(newProfile);
    setShowWorkForm(false);
    setEditingWork(null);
  };

  const handleDeleteWork = (id: string) => {
    const newProfile = { ...profile, workExperience: profile.workExperience.filter(x => x.id !== id) };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // ── Education handlers ──
  const handleSaveEdu = (ed: Education) => {
    const updated = editingEdu
      ? profile.education.map(x => x.id === ed.id ? ed : x)
      : [...profile.education, ed];
    const newProfile = { ...profile, education: updated };
    setProfile(newProfile);
    saveProfile(newProfile);
    setShowEduForm(false);
    setEditingEdu(null);
  };

  const handleDeleteEdu = (id: string) => {
    const newProfile = { ...profile, education: profile.education.filter(x => x.id !== id) };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  if (!usuario) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#f1f5f9' }}>Perfil no encontrado</h2>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            No existe un usuario con el documento "{userId}".
          </p>
          <button style={{ ...btnSecondaryStyle, marginTop: '16px' }} onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.avatarCircle}>
          {usuario.fullName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {usuario.fullName}
          </h1>
          <p style={{ margin: 0, color: '#818cf8', fontWeight: 600 }}>{usuario.specialty}</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{usuario.email}</span>
            <span style={{ fontSize: '13px', color: '#64748b' }}>DNI: {usuario.document}</span>
            <span style={{
              fontSize: '12px',
              background: usuario.role === 'admin' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.15)',
              color: usuario.role === 'admin' ? '#818cf8' : '#34d399',
              borderRadius: '9999px',
              padding: '2px 10px',
              fontWeight: 700,
            }}>
              {usuario.role === 'admin' ? 'Administrador' : 'Estudiante'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          {isOwner && (
            <button style={btnSecondaryStyle} onClick={() => navigate('/examenes')}>
              Mis Exámenes
            </button>
          )}
          <span style={{ fontSize: '11px', color: '#334155', fontFamily: 'monospace' }}>
            /cv/{usuario.document}
          </span>
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div style={styles.grid}>

        {/* Estadísticas */}
        <div style={{ ...styles.card, gridColumn: 'span 2' }}>
          <SectionTitle>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            Resumen de Rendimiento
          </SectionTitle>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{intentosAprobados.length}</span>
              <span style={styles.statLabel}>Exámenes aprobados</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>
                {intentosAprobados.length > 0
                  ? Math.round(intentosAprobados.reduce((acc, a) => acc + a.score, 0) / intentosAprobados.length)
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
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile.workExperience.length}</span>
              <span style={styles.statLabel}>Experiencias laborales</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{profile.education.length}</span>
              <span style={styles.statLabel}>Formaciones académicas</span>
            </div>
          </div>
        </div>

        {/* Certificaciones */}
        <div style={{ ...styles.card, gridColumn: 'span 2' }}>
          <SectionTitle>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
            Certificaciones Obtenidas
          </SectionTitle>

          {intentosAprobados.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.07)' }}>
              <p style={{ margin: 0 }}>Aún no se han obtenido certificaciones.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {intentosAprobados.map(intento => {
                const exam = exams.find(e => e.id === intento.examId);
                const titulo = exam?.title ?? 'Examen';
                const area = exam?.area ?? '';
                return (
                  <div key={intento.id} style={styles.certRow}>
                    <div style={styles.certBadge}>{titulo.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#f1f5f9', fontSize: '15px' }}>{titulo}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        {area} &nbsp;|&nbsp; Emitido: {new Date(intento.date).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: '9999px', padding: '4px 12px', fontSize: '13px', fontWeight: 700 }}>
                        {intento.score}%
                      </span>
                      <button style={btnPrimaryStyle} onClick={() => setCertSeleccionado({ attempt: intento, examTitle: titulo, examArea: area })}>
                        Ver certificado
                      </button>
                      <a
                        href={`/certificado/${intento.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...btnSecondaryStyle, textDecoration: 'none', fontSize: '12px', padding: '6px 12px' }}
                      >
                        URL pública
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Experiencia Laboral */}
        <div style={{ ...styles.card, gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <SectionTitle>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              Experiencia Laboral
            </SectionTitle>
            {isOwner && !showWorkForm && !editingWork && (
              <button style={{ ...btnPrimaryStyle, fontSize: '12px', padding: '5px 12px' }} onClick={() => setShowWorkForm(true)}>
                + Agregar
              </button>
            )}
          </div>

          {(showWorkForm || editingWork) && isOwner && (
            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <WorkForm
                initial={editingWork ?? undefined}
                onSave={handleSaveWork}
                onCancel={() => { setShowWorkForm(false); setEditingWork(null); }}
              />
            </div>
          )}

          {profile.workExperience.length === 0 && !showWorkForm ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#475569', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.07)' }}>
              <p style={{ margin: 0, fontSize: '13px' }}>Sin experiencia laboral registrada.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.workExperience.map(w => (
                <div key={w.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{w.position}</p>
                      <p style={{ margin: '0 0 4px', color: '#818cf8', fontSize: '13px', fontWeight: 600 }}>{w.company}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                        {formatDate(w.startDate)} — {w.endDate ? (w.endDate === 'Actualidad' ? 'Actualidad' : formatDate(w.endDate)) : 'Actualidad'}
                      </p>
                      {w.description && <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{w.description}</p>}
                    </div>
                    {isOwner && (
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                        <button style={{ ...btnSecondaryStyle, padding: '4px 10px', fontSize: '12px' }} onClick={() => { setEditingWork(w); setShowWorkForm(false); }}>Editar</button>
                        <button style={btnDangerStyle} onClick={() => handleDeleteWork(w.id)}>Eliminar</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formación Académica */}
        <div style={{ ...styles.card, gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <SectionTitle>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 1 12 20.055a11.952 11.952 0 0 1-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z" /></svg>
              Formación Académica
            </SectionTitle>
            {isOwner && !showEduForm && !editingEdu && (
              <button style={{ ...btnPrimaryStyle, fontSize: '12px', padding: '5px 12px' }} onClick={() => setShowEduForm(true)}>
                + Agregar
              </button>
            )}
          </div>

          {(showEduForm || editingEdu) && isOwner && (
            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <EduForm
                initial={editingEdu ?? undefined}
                onSave={handleSaveEdu}
                onCancel={() => { setShowEduForm(false); setEditingEdu(null); }}
              />
            </div>
          )}

          {profile.education.length === 0 && !showEduForm ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#475569', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.07)' }}>
              <p style={{ margin: 0, fontSize: '13px' }}>Sin formación académica registrada.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.education.map(ed => (
                <div key={ed.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{ed.degree}</p>
                      <p style={{ margin: '0 0 4px', color: '#818cf8', fontSize: '13px', fontWeight: 600 }}>{ed.institution}</p>
                      {ed.field && <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#94a3b8' }}>{ed.field}</p>}
                      {(ed.startDate || ed.endDate) && (
                        <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                          {formatDate(ed.startDate)}{ed.endDate ? ` — ${formatDate(ed.endDate)}` : ''}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                        <button style={{ ...btnSecondaryStyle, padding: '4px 10px', fontSize: '12px' }} onClick={() => { setEditingEdu(ed); setShowEduForm(false); }}>Editar</button>
                        <button style={btnDangerStyle} onClick={() => handleDeleteEdu(ed.id)}>Eliminar</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Modal certificado ── */}
      {certSeleccionado && (
        <div style={styles.overlay} onClick={() => setCertSeleccionado(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '18px', fontWeight: 700 }}>Certificado Digital</h3>
              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
                onClick={() => setCertSeleccionado(null)}
              >
                ×
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
    alignItems: 'flex-start',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto 28px',
    padding: '24px 28px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    flexWrap: 'wrap',
  },
  avatarCircle: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.09)',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(99,102,241,0.08)',
    borderRadius: '12px',
    padding: '16px 8px',
    border: '1px solid rgba(99,102,241,0.15)',
  },
  statNumber: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#818cf8',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '6px',
    textAlign: 'center' as const,
  },
  certRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.07)',
    flexWrap: 'wrap' as const,
  },
  certBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
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
    background: 'rgba(0,0,0,0.75)',
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
