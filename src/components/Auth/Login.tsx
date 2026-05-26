// src/components/Auth/Login.tsx
// RESPONSABLE: ERICK

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, setCurrentUser } from '../../utils/storage';

function isEmpty(value: string) {
  return value.trim().length === 0;
}

export default function Login() {
  const [documentValue, setDocumentValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isEmpty(documentValue) || isEmpty(password)) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const users = getUsers();
    const user = users.find((u) => u.document === documentValue.trim());

    if (!user) {
      setError('Usuario no encontrado.');
      return;
    }

    if (password !== user.document) {
      setError('Credenciales inválidas.');
      return;
    }

    setCurrentUser(user);
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/examenes', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f111a] via-[#151829] to-[#0f111a] px-4 py-12 relative overflow-hidden">
      {/* Background blobs for premium glow effect */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1a1d2e]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Plataforma de Certificaciones Técnicas
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5">
              Documento (DNI)
            </label>
            <input
              value={documentValue}
              onChange={(event) => setDocumentValue(event.target.value)}
              type="text"
              name="document"
              className="w-full bg-[#0f1117]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="Ingrese su número de documento"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              name="password"
              className="w-full bg-[#0f1117]/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="Ingrese su contraseña"
            />
          </div>

          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3 text-xs text-indigo-300/80 leading-relaxed">
            Nota: Para esta evaluación, la contraseña es idéntica a su número de documento.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/20"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">¿No tiene una cuenta? </span>
          <Link
            to="/register"
            className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all duration-200"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
