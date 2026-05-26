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

    if (
      isEmpty(documentValue) ||
      isEmpty(fullName) ||
      isEmpty(email) ||
      isEmpty(specialty)
    ) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f111a] via-[#151829] to-[#0f111a] px-4 py-12 relative overflow-hidden">
      {/* Background blobs for premium glow effect */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1a1d2e]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 tracking-tight">
            Crear Cuenta
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Regístrese en el Portal de Certificaciones
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">
              Documento (DNI)
            </label>
            <input
              value={documentValue}
              onChange={(event) => setDocumentValue(event.target.value)}
              type="text"
              name="document"
              className="w-full bg-[#0f1117]/80 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              placeholder="Ingrese su número de documento"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">
              Nombre Completo
            </label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              type="text"
              name="fullName"
              className="w-full bg-[#0f1117]/80 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              placeholder="Nombre y Apellidos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              name="email"
              className="w-full bg-[#0f1117]/80 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">
              Especialidad
            </label>
            <input
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              type="text"
              name="specialty"
              className="w-full bg-[#0f1117]/80 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              placeholder="Ej: Redes y Telecomunicaciones"
            />
          </div>

          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-xs text-emerald-300/80 leading-relaxed">
            Nota: Al ingresar "admin" como documento, la cuenta se creará con el rol de Administrador.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-600/20"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">¿Ya tiene una cuenta? </span>
          <Link
            to="/login"
            className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-all duration-200"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
