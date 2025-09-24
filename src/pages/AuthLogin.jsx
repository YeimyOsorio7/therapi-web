import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!form.username.trim() || !form.password.trim()) {
      setError("Por favor, complete todos los campos");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar credenciales de administrador
      if (form.username === "psicologa" && form.password === "1234") {
        localStorage.setItem("auth", "true");
        localStorage.setItem("currentUser", form.username);
        localStorage.setItem("userRole", "admin");
        navigate("/admin/citas");
        return;
      }else {
        setError("Usuario o contraseña incorrectos");
      }



      if (form.username && form.password) {
        localStorage.setItem("currentUser", form.username);
        localStorage.setItem("userRole", "user");
        navigate("/chat");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
        >
          {isLoading ? "Iniciando sesión..." : "Ingresar"}
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
