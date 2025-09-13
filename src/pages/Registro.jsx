import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const suggestUsernames = (base, taken) => {
  const clean = base.replace(/\s+/g, "").toLowerCase().slice(0, 15) || "usuario";
  const suggestions = new Set([clean, `${clean}01`, `${clean}${new Date().getFullYear()}`, `${clean}_gt`, `${clean}x`]);
  const out = [];
  for (const s of suggestions) if (!taken.has(s)) out.push(s);
  let i = 2;
  while (out.length < 5) {
    const s = `${clean}${i++}`;
    if (!taken.has(s)) out.push(s);
  }
  return out.slice(0, 5);
};

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const users = useMemo(() => JSON.parse(localStorage.getItem("users") || "[]"), []);
  const taken = useMemo(() => new Set(users.map((u) => u.username.toLowerCase())), [users]);

  const reservedName = form.username.trim().toLowerCase() === "psicologa";
  const exists = form.username.trim() && (taken.has(form.username.trim().toLowerCase()) || reservedName);
  const suggestions = exists ? suggestUsernames(form.username.trim(), taken) : [];

  const onSubmit = (e) => {
    e.preventDefault();
    const name = form.username.trim();
    if (!name || reservedName) return;

    const current = JSON.parse(localStorage.getItem("users") || "[]");
    if (current.find((u) => u.username.toLowerCase() === name.toLowerCase())) {
      return; // ya existe; el aviso ya se muestra
    }

    current.push({ username: name, password: form.password });
    localStorage.setItem("users", JSON.stringify(current));
    localStorage.setItem("currentUser", name);

    // Redirección por tipo de usuario
    if (name === "psicologa") {
      localStorage.setItem("auth", "true");
      navigate("/NotasClinicas");
    } else {
      navigate("/chat"); // usuario común al chatbot
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-300">🆕 Crear cuenta</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className={`w-full px-4 py-2 rounded border bg-white dark:bg-gray-700 ${
            exists ? "border-rose-400 dark:border-rose-500" : "border-gray-300 dark:border-gray-600"
          }`}
          required
        />

        {exists && (
          <div className="text-sm bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700 rounded p-3">
            {reservedName ? (
              <>El usuario <strong>psicologa</strong> está reservado para uso interno.</>
            ) : (
              <>El usuario <strong>{form.username}</strong> ya existe.</>
            )}{" "}
            Pruebe con:
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setForm({ ...form, username: s })}
                  className="px-2 py-1 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          required
        />

        <button
          type="submit"
          disabled={exists}
          className={`w-full font-semibold py-2 px-4 rounded transition text-white ${
            exists ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
};

export default Registro;
