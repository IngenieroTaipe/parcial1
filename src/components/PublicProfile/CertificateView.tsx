// src/components/PublicProfile/CertificateView.tsx
// RESPONSABLE: Toribio Anselmo David Angel

import { useRef } from 'react';
import { User, ExamAttempt } from '../../types';

interface CertificateViewProps {
  attempt: ExamAttempt;
  user: User;
  examTitle: string;
  examArea: string;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function CertificateView({ attempt, user, examTitle, examArea }: CertificateViewProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const opciones = {
      margin: 10,
      filename: `certificado-${user.document}-${attempt.examId}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const },
    };
    html2pdf().set(opciones).from(certRef.current).save();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Certificado visual */}
      <div
        ref={certRef}
        id="certificado-pdf"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          border: '2px solid #334155',
          borderRadius: '1rem',
          padding: '3rem',
          width: '780px',
          minHeight: '520px',
          fontFamily: 'Inter, sans-serif',
          color: '#f1f5f9',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Decoracion esquinas */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px',
          width: '48px', height: '48px',
          borderTop: '3px solid #6366f1', borderLeft: '3px solid #6366f1',
          borderRadius: '4px 0 0 0',
        }} />
        <div style={{
          position: 'absolute', top: '16px', right: '16px',
          width: '48px', height: '48px',
          borderTop: '3px solid #6366f1', borderRight: '3px solid #6366f1',
          borderRadius: '0 4px 0 0',
        }} />
        <div style={{
          position: 'absolute', bottom: '16px', left: '16px',
          width: '48px', height: '48px',
          borderBottom: '3px solid #6366f1', borderLeft: '3px solid #6366f1',
          borderRadius: '0 0 0 4px',
        }} />
        <div style={{
          position: 'absolute', bottom: '16px', right: '16px',
          width: '48px', height: '48px',
          borderBottom: '3px solid #6366f1', borderRight: '3px solid #6366f1',
          borderRadius: '0 0 4px 0',
        }} />

        {/* Cabecera */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#818cf8', textTransform: 'uppercase', marginBottom: '8px' }}>
            Sistema de Certificaciones
          </p>
          <h1 style={{
            fontSize: '32px', fontWeight: '700', margin: '0',
            background: 'linear-gradient(90deg, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Certificado de Aprobacion
          </h1>
          <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, #818cf8, #c084fc)', margin: '12px auto 0' }} />
        </div>

        {/* Cuerpo */}
        <div style={{ textAlign: 'center', padding: '1rem 2rem' }}>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 8px' }}>
            Se certifica que
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
            {user.fullName}
          </p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px' }}>
            DNI: {user.document} &nbsp;|&nbsp; {user.specialty}
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 8px' }}>
            ha aprobado satisfactoriamente el examen
          </p>
          <p style={{ fontSize: '22px', fontWeight: '600', color: '#818cf8', margin: '0 0 4px' }}>
            {examTitle}
          </p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px' }}>
            Area: {examArea}
          </p>

          {/* Badge puntaje */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '9999px',
            padding: '8px 28px',
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}>
            Puntaje: {attempt.score}%
          </div>
        </div>

        {/* Pie */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 1rem' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 2px' }}>Fecha de emision</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0' }}>{formatDate(attempt.date)}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', height: '1px', background: '#334155', margin: '0 auto 4px' }} />
            <p style={{ fontSize: '11px', color: '#475569', margin: '0' }}>Firma del Comite</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 2px' }}>ID de verificacion</p>
            <p style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace', margin: '0' }}>
              {attempt.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Boton descargar */}
      <button
        onClick={handleDownloadPDF}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#fff', border: 'none', borderRadius: '8px',
          padding: '12px 28px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
      >
        Descargar PDF
      </button>
    </div>
  );
}
