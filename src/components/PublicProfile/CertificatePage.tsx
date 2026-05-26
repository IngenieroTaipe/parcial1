// src/components/PublicProfile/CertificatePage.tsx
// RESPONSABLE: Toribio Anselmo David Angel
// Vista publica de un certificado dado su hash (ruta /certificado/:hash)

import { useParams, useNavigate } from 'react-router-dom';
import { getCertificates, getUsers, getExams } from '../../utils/storage';
import CertificateView from './CertificateView';
import { ExamAttempt } from '../../types';

export default function CertificatePage() {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();

  const cert = getCertificates().find(c => c.hash === hash);

  if (!cert) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 8px', color: '#f1f5f9' }}>Certificado no valido</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 20px' }}>
            El certificado con ID "{hash}" no existe o no se ha generado aun.
          </p>
          <button
            style={btnStyle}
            onClick={() => navigate('/')}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const user = getUsers().find(u => u.document === cert.userId);
  const exam = getExams().find(e => e.id === cert.examId);

  if (!user || !exam) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 style={{ margin: 0, color: '#f1f5f9' }}>Datos incompletos</h2>
          <p style={{ color: '#94a3b8' }}>No se pudo cargar la informacion del certificado.</p>
        </div>
      </div>
    );
  }

  // Reconstruir un ExamAttempt minimo a partir del certificado
  const attemptFromCert: ExamAttempt = {
    id: cert.hash,
    userId: cert.userId,
    examId: cert.examId,
    score: 100, // No tenemos el score original aqui, se puede mejorar guardandolo en Certificate
    passed: true,
    date: cert.issueDate,
  };

  return (
    <div style={pageStyle}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '3px', color: '#818cf8', textTransform: 'uppercase' }}>
          Verificacion publica
        </p>
        <h1 style={{ margin: '4px 0', color: '#f8fafc', fontSize: '24px' }}>
          Certificado verificado
        </h1>
      </div>
      <CertificateView
        attempt={attemptFromCert}
        user={user}
        examTitle={cert.examTitle}
        examArea={exam.area}
      />
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button style={btnStyle} onClick={() => navigate(`/cv/${user.document}`)}>
          Ver perfil completo
        </button>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  fontFamily: 'Inter, sans-serif',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '32px',
  textAlign: 'center',
  maxWidth: '400px',
};

const btnStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
};
