import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u) => u.username === form.username && u.password === form.password
    );

    if (found) {
      localStorage.setItem("currentUser", form.username);

      if (form.username === "psicologa") {
        // acceso al panel interno
        localStorage.setItem("auth", "true"); // para los guards del admin
        navigate("/admin-panel");
      } else {
        // usuario regular → chatbot
        navigate("/chat");
      }
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-300">🔐 Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          required
        />

        {error && <p className="text-rose-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Ingresar
        </button>

        <div className="text-center text-sm">
          ¿No tiene cuenta?{" "}
          <Link to="/registro" className="text-indigo-600 dark:text-indigo-300 underline">
            Crear cuenta
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthLogin;
