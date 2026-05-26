// src/components/Auth/UserList.tsx
// RESPONSABLE: ERICK

import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../utils/storage';

export default function UserList() {
  const users = getUsers();
  const navigate = useNavigate();

  return (
    <div className="exam-editor-container">
      {/* Header */}
      <div className="exam-editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="header-title">Usuarios Registrados</h1>
          <p className="header-subtitle">Administración — Control de Acceso</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          Volver al Editor
        </button>
      </div>

      <div className="exam-editor-body">
        <section className="card">
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No hay usuarios registrados aún.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="exams-table">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Nombre Completo</th>
                    <th>Correo</th>
                    <th>Especialidad</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.document} className="hover:bg-white/5 transition-colors">
                      <td className="td-title">{user.document}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="area-chip">{user.specialty}</span>
                      </td>
                      <td>
                        <span className={`score-badge ${user.role === 'admin' ? '' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`} style={{ textTransform: 'capitalize' }}>
                          {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
