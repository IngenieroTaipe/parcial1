// src/components/Auth/Login.tsx
// RESPONSABLE: ERICK

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-3xl font-bold">Iniciar sesión</h1>
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-medium">Documento (DNI)</span>
          <input
            value={documentValue}
            onChange={(event) => setDocumentValue(event.target.value)}
            type="text"
            name="document"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="font-medium">Contraseña</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            name="password"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <p className="text-sm text-gray-600">Para este parcial la contraseña es el mismo documento.</p>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
