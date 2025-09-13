import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';

// Páginas públicas
import Inicio from './pages/Inicio.jsx';
import App from './App.jsx';                  // ChatBot
import Schedule from './pages/Schedule.jsx';
import Layout from './layout/Layout.jsx';

// Auth
import AuthLogin from './pages/AuthLogin.jsx';
import Registro from './pages/Registro.jsx';

// Admin (interno)
import AdminLayout from './layout/AdminLayout.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Citas from './pages/Citas.jsx';
import Conversaciones from './pages/Conversaciones.jsx';
import NotasClinicas from './pages/NotasClinicas.jsx';
import Estadisticas from './pages/Estadisticas.jsx';
import Recursos from './pages/Recursos.jsx';
import RegistroPaciente from './pages/RegistroPaciente.jsx';
import VerPacientes from './pages/VerPacientes.jsx';

// Guardia para el chatbot: solo usuarios registrados (currentUser)
const RequireUser = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  return user ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Públicas con Layout (sin barra superior, solo toggle) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/cita" element={<Schedule />} />
          <Route
            path="/chat"
            element={
              <RequireUser>
                <App />
              </RequireUser>
            }
          />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/registro" element={<Registro />} />

        {/* Panel admin (interno) */}
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="citas" element={<Citas />} />
          <Route path="conversaciones" element={<Conversaciones />} />
          <Route path="notas" element={<NotasClinicas />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="registro" element={<RegistroPaciente />} />
          <Route path="pacientes" element={<VerPacientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
