// src/components/Auth/UserList.tsx
// RESPONSABLE: ERICK

import { getUsers } from '../../utils/storage';

export default function UserList() {
  const users = getUsers();

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Usuarios registrados</h1>
      {users.length === 0 ? (
        <p>No hay usuarios registrados aún.</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-left text-sm uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Nombre completo</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
              {users.map((user) => (
                <tr key={user.document}>
                  <td className="px-4 py-3">{user.document}</td>
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.specialty}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
