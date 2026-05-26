// src/App.tsx
// RESPONSABLE: ERICK
// Enrutamiento general de la aplicación.
// TODO: Implementar react-router-dom con las rutas reales.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Páginas (descomentar a medida que cada integrante las cree) ──────────────
// import Login        from './components/Auth/Login';
// import Register     from './components/Auth/Register';
// import UserList     from './components/Auth/UserList';
import ExamEditor   from './components/Committee/ExamEditor';
// import ExamList     from './components/Student/ExamList';
// import TakeExam     from './components/Student/TakeExam';
// import CVPage       from './components/PublicProfile/CVPage';

function Placeholder({ label }: { label: string }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🚧 {label}</h2>
      <p>Este componente aún no ha sido implementado.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige raíz → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ERICK */}
        <Route path="/login"    element={<Placeholder label="Login (Erick)" />} />
        <Route path="/register" element={<Placeholder label="Registro (Erick)" />} />
        <Route path="/users"    element={<Placeholder label="Lista de Usuarios (Erick)" />} />

        {/* LESLY */}
        <Route path="/admin"    element={<ExamEditor />} />

        {/* BENJAMIN */}
        <Route path="/examenes"        element={<Placeholder label="Lista de Exámenes (Benjamin)" />} />
        <Route path="/examenes/:id"    element={<Placeholder label="Rendir Examen (Benjamin)" />} />

        {/* DAVID */}
        <Route path="/cv/:userId"      element={<Placeholder label="CV / Perfil Público (David)" />} />
        <Route path="/certificado/:hash" element={<Placeholder label="Vista Certificado (David)" />} />

        {/* 404 */}
        <Route path="*" element={<Placeholder label="404 - Página no encontrada" />} />
      </Routes>
    </BrowserRouter>
  );
}
