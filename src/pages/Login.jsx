import Header from "../components/Header"; // ajusta la ruta según carpeta

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-sky-100 via-purple-100 to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        {/* Contenido de la página */}
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ user: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulación de autenticación
    if (form.user === 'psicologa' && form.password === '1234') {
      localStorage.setItem('auth', 'true');
      navigate('/admin');
    } else {
      setError('❌ Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-sky-100 to-teal-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-xl p-6 space-y-4 border border-gray-300 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-sky-600 dark:text-sky-300">🔐 Acceso Psicóloga</h2>

        <input
          name="user"
          type="text"
          placeholder="Usuario"
          value={form.user}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-700"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-700"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
