// src/components/Auth/Register.tsx
// RESPONSABLE: ERICK

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    navigate('/examenes', { replace: true });
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-3xl font-bold">Crear cuenta</h1>
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
          <span className="font-medium">Nombre completo</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            type="text"
            name="fullName"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="font-medium">Correo electrónico</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            name="email"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="font-medium">Especialidad</span>
          <input
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            type="text"
            name="specialty"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <p className="text-sm text-gray-600">El primer usuario con documento "admin" recibirá rol de administrador.</p>
        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
