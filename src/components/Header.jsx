import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Logo / título */}
      <Link to="/" className="flex items-center gap-2">
        <span role="img" aria-label="brain" className="text-xl">🧠</span>
        <h1 className="text-lg md:text-xl font-extrabold text-indigo-700 dark:text-indigo-300">
          THERAPY-BOOT
        </h1>
      </Link>

      {/* Navegación */}
      <nav className="flex items-center gap-3 md:gap-4">
        <Link
          to="/"
          className={`px-3 py-1.5 rounded font-medium text-sm ${
            location.pathname === "/"
              ? "bg-indigo-500 text-white"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Inicio
        </Link>

        <Link
          to="/cita"
          className={`px-3 py-1.5 rounded font-medium text-sm ${
            location.pathname === "/cita"
              ? "bg-emerald-600 text-white"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Agendar cita
        </Link>

        <Link
          to="/login"
          className={`px-3 py-1.5 rounded font-medium text-sm ${
            location.pathname === "/login"
              ? "bg-indigo-600 text-white"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Iniciar sesión
        </Link>

        {/* Botón claro/oscuro */}
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;
