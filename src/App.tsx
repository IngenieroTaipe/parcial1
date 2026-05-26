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
import CertificateView from './components/PublicProfile/CertificateView';
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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>404 — Página no encontrada</h2>
      <p>Revisa la URL o regresa a la página de inicio de sesión.</p>
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
        <Route path="/cv/:userId" element={<PrivateRoute><CVPage /></PrivateRoute>} />
        <Route path="/certificado/:hash" element={<PrivateRoute><CertificateView /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
