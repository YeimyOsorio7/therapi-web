// src/layout/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("adminSidebarCollapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  // Solo psicóloga
  useEffect(() => {
    const isAdmin = localStorage.getItem("auth") === "true";
    const user = localStorage.getItem("currentUser");
    if (!isAdmin || user !== "psicologa") navigate("/login");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const linkBase =
    "flex items-center gap-3 px-3 py-2 rounded text-gray-800 hover:bg-gray-100 transition dark:text-gray-100 dark:hover:bg-gray-700";
  const linkActive =
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200";

  // Componente para un enlace con control de visibilidad de etiquetas
  const MenuLink = ({ to, icon, label, showLabels }) => (
    <NavLink to={to} className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
      <span aria-hidden>{icon}</span>
      {showLabels && <span>{label}</span>}
    </NavLink>
  );

  // Grupo de links (reutilizable)
  const MenuLinks = ({ showLabels }) => (
    <nav className="flex flex-col gap-2 mt-3">
      <MenuLink to="/admin/citas"          icon="🗓️" label="Citas"           showLabels={showLabels} />
      <MenuLink to="/admin/conversaciones" icon="💬" label="Conversaciones"  showLabels={showLabels} />
      <MenuLink to="/admin/notas"          icon="📝" label="Notas clínicas"  showLabels={showLabels} />
      <MenuLink to="/admin/estadisticas"   icon="📊" label="Estadísticas"    showLabels={showLabels} />
      <MenuLink to="/admin/registro"       icon="🧾" label="Registro"        showLabels={showLabels} />
      <MenuLink to="/admin/pacientes"      icon="👩‍⚕️" label="Pacientes"     showLabels={showLabels} />
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar Desktop (colapsable) */}
      <aside
        className={`hidden sm:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ${
          collapsed ? "w-16" : "w-72"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            {!collapsed && (
              <h2 className="text-xl font-bold text-sky-600 dark:text-sky-300">Psicóloga</h2>
            )}
          </div>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
            aria-label="Colapsar/expandir menú"
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* En desktop, mostrar etiquetas solo cuando NO esté colapsado */}
        <MenuLinks showLabels={!collapsed} />

        <div className="mt-auto p-3">
          <button
            onClick={logout}
            className={`w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-3 rounded shadow transition flex items-center justify-center gap-2 ${
              collapsed ? "px-0" : ""
            }`}
          >
            <span>🧱</span>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 sm:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar Mobile (offcanvas) – SIEMPRE con etiquetas visibles */}
      <aside
        className={`fixed z-50 sm:hidden h-full top-0 left-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-sky-600 dark:text-sky-300 flex items-center gap-2">
            <span>🧠</span> Psicóloga
          </h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Cerrar menú"
          >
            ✖
          </button>
        </div>
        <div className="p-3">
          {/* En móvil, forzamos showLabels = true */}
          <MenuLinks showLabels={true} />
        </div>
        <div className="mt-auto p-3">
          <button
            onClick={logout}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-3 rounded shadow transition flex items-center justify-center gap-2"
          >
            🧱 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mínima para abrir menú en móvil */}
        <div className="sm:hidden flex items-center justify-between px-3 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="px-3 py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
