// src/components/Auth/Register.tsx
// RESPONSABLE: ERICK

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, saveUsers, setCurrentUser } from '../../utils/storage';
import type { User } from '../../types';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isEmpty(value: string) {
  return value.trim().length === 0;
}

export default function Register() {
  const [documentValue, setDocumentValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isEmpty(documentValue) || isEmpty(fullName) || isEmpty(email) || isEmpty(specialty)) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    const users = getUsers();
    const documentTrimmed = documentValue.trim();

    if (users.some((u) => u.document === documentTrimmed)) {
      setError('El documento ya está registrado.');
      return;
    }

    const newUser: User = {
      document: documentTrimmed,
      fullName: fullName.trim(),
      email: email.trim(),
      specialty: specialty.trim(),
      role: documentTrimmed.toLowerCase() === 'admin' ? 'admin' : 'student',
    };

    saveUsers([...users, newUser]);
    setCurrentUser(newUser);

    if (newUser.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/examenes', { replace: true });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1117 0%, #151829 60%, #0f1117 100%)',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo / Titulo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>
            Sistema de Certificaciones
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            UNCP — Facultad de Ingeniería de Sistemas
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '18px', fontWeight: 700, color: '#e8eaf6' }}>
            Crear Cuenta
          </h2>

          {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-document">Documento (DNI)</label>
                <input
                  id="reg-document"
                  className="form-input"
                  type="text"
                  name="document"
                  value={documentValue}
                  onChange={(e) => setDocumentValue(e.target.value)}
                  placeholder="Número de documento"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-specialty">Especialidad</label>
                <input
                  id="reg-specialty"
                  className="form-input"
                  type="text"
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ej: Ing. de Sistemas"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-fullname">Nombre Completo</label>
              <input
                id="reg-fullname"
                className="form-input"
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Apellidos y Nombres"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Correo Electrónico</label>
              <input
                id="reg-email"
                className="form-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <p style={{ fontSize: '12px', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Registrarse con el documento <strong style={{ color: '#64748b' }}>"admin"</strong> otorga el rol de Administrador.
            </p>

            <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%', justifyContent: 'center' }}>
              Registrarse
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: '#64748b' }}>
            ¿Ya tiene cuenta?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Iniciar Sesión
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
