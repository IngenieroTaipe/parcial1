// src/App.tsx
// RESPONSABLE: ERICK
// Enrutamiento general de la aplicación.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserList from './components/Auth/UserList';
import ExamEditor from './components/Committee/ExamEditor';
import ExamList from './components/Student/ExamList';
import TakeExam from './components/Student/TakeExam';
import CVPage from './components/PublicProfile/CVPage';
import CertificatePage from './components/PublicProfile/CertificatePage';
import { getCurrentUser } from './utils/storage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '48px 64px',
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        <p style={{ fontSize: '72px', fontWeight: 900, color: '#818cf8', margin: '0 0 8px', lineHeight: 1 }}>404</p>
        <h2 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: 700, color: '#f1f5f9' }}>
          Página no encontrada
        </h2>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>
          Revisa la URL o regresa al inicio de sesión.
        </p>
        <a href="/login" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#fff',
          borderRadius: '10px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          Ir al inicio
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<AdminRoute><UserList /></AdminRoute>} />
        <Route path="/admin" element={<PrivateRoute><ExamEditor /></PrivateRoute>} />
        <Route path="/examenes" element={<PrivateRoute><ExamList /></PrivateRoute>} />
        <Route path="/examenes/:id" element={<PrivateRoute><TakeExam /></PrivateRoute>} />
        
        {/* Rutas públicas de David */}
        <Route path="/cv/:userId" element={<CVPage />} />
        <Route path="/certificado/:hash" element={<CertificatePage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
