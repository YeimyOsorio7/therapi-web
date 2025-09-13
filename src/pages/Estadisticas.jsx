// src/pages/Estadisticas.jsx
import { useEffect, useMemo, useState } from "react";

/* ========================= Cache helpers ========================= */
const CACHE_KEY = "statsCache:v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas

const cacheGet = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.expiresAt) return null;
    if (Date.now() > obj.expiresAt) return null; // expiró
    return obj.data;
  } catch {
    return null;
  }
};

const cacheSet = (data, ttl = CACHE_TTL_MS) => {
  const payload = { data, expiresAt: Date.now() + ttl, savedAt: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
};

const cacheClear = () => localStorage.removeItem(CACHE_KEY);

/* ========================= Utils ========================= */
const parseFecha = (str) => {
  // soporta "dd/mm/yyyy" o "yyyy-mm-dd"
  if (!str) return null;
  if (str.includes("/")) {
    const [d, m, y] = str.split("/").map(Number);
    return new Date(y, m - 1, d);
  }
  if (str.includes("-")) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
};

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const safeNumber = (n, def = 0) =>
  Number.isFinite(Number(n)) ? Number(n) : def;

/* ========================= Fuente de datos (localStorage) =========================
   - Pacientes: puedes guardar un array en localStorage.setItem('pacientes', JSON.stringify([...]))
   - Citas: idem en localStorage.setItem('citas', JSON.stringify([{fecha: '2025-01-14', estado:'completada' }]))
   Si no existen, usamos un set mínimo para que la UI no falle.
============================================================================= */

const getPacientesLS = () => {
  try {
    const raw = localStorage.getItem("pacientes");
    if (raw) return JSON.parse(raw);
  } catch {}
  // fallback (si no hay nada en LS)
  return [
    {
      nombre: "Heydi Catarina Castro Tum",
      sexo: "F",
      edad: 19,
      diagnostico: "Tristeza Leve",
      cie10: "F32.0",
      fechaConsulta: "2025-01-14",
    },
  ];
};

const getCitasLS = () => {
  try {
    const raw = localStorage.getItem("citas");
    if (raw) return JSON.parse(raw);
  } catch {}
  // fallback sencillo
  return [
    { fecha: "2025-01-10", estado: "completada" },
    { fecha: "2025-01-14", estado: "completada" },
    { fecha: "2025-02-01", estado: "pendiente" },
  ];
};

/* ========================= Cálculo de estadísticas ========================= */
const calcularEstadisticas = () => {
  const pacientes = getPacientesLS();
  const citas = getCitasLS();

  const totalPac = pacientes.length;
  const totalCitas = citas.length;

  // Sexo
  const hombres = pacientes.filter((p) => p.sexo === "H").length;
  const mujeres = pacientes.filter((p) => p.sexo !== "H").length;

  // Edad
  const edades = pacientes.map((p) => safeNumber(p.edad, 0));
  const promedioEdad =
    edades.length > 0
      ? Math.round(edades.reduce((a, b) => a + b, 0) / edades.length)
      : 0;

  // Diagnósticos (top 5)
  const diagMap = new Map();
  pacientes.forEach((p) => {
    const d = (p.diagnostico || "Sin diagnóstico").trim();
    diagMap.set(d, (diagMap.get(d) || 0) + 1);
  });
  const diagTop = Array.from(diagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, total]) => ({ nombre, total }));

  // Citas por mes (últimos 6)
  const citasMes = new Map();
  citas.forEach((c) => {
    const d = parseFecha(c.fecha);
    if (!d) return;
    const key = monthKey(d);
    citasMes.set(key, (citasMes.get(key) || 0) + 1);
  });
  const hoy = new Date();
  const ultimo6 = [];
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const key = monthKey(dt);
    ultimo6.push({ mes: key, total: citasMes.get(key) || 0 });
  }

  // Estados de citas
  const estados = citas.reduce((acc, c) => {
    const e = (c.estado || "desconocido").toLowerCase();
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  const estadosArr = Object.entries(estados).map(([estado, total]) => ({
    estado,
    total,
  }));

  return {
    resumen: {
      totalPacientes: totalPac,
      totalCitas,
      mujeres,
      hombres,
      promedioEdad,
    },
    diagnosticosTop: diagTop,
    citasUltimos6m: ultimo6,
    estadoCitas: estadosArr,
    generadoEn: new Date().toISOString(),
  };
};

/* ========================= Componente ========================= */
const Card = ({ title, value, subtitle }) => (
  <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-white dark:bg-gray-900 p-4 shadow">
    <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
    <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-1">{value}</div>
    {subtitle && (
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>
    )}
  </div>
);

const BarMini = ({ data, labelKey, valueKey }) => {
  // mini barras sin libs
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const v = d[valueKey] || 0;
        const pct = Math.round((v / max) * 100);
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate max-w-[70%]">{d[labelKey]}</span>
              <span className="font-medium">{v}</span>
            </div>
            <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 dark:bg-indigo-400"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LineMini = ({ points }) => {
  // draw simple sparkline with SVG
  const w = 240;
  const h = 60;
  const pad = 6;
  const max = Math.max(...points.map((p) => p.total), 1);
  const step = (w - pad * 2) / Math.max(1, points.length - 1);
  const ys = (v) => h - pad - (v / max) * (h - pad * 2);

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${ys(p.total)}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="block">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-indigo-500 dark:text-indigo-300"
        points={points
          .map((p, i) => `${pad + i * step},${ys(p.total)}`)
          .join(" ")}
      />
      <path d={d} className="opacity-0" />
    </svg>
  );
};

const Estadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [stats, setStats] = useState(null);

  const cargar = (opts = { force: false }) => {
    setLoading(true);
    setFromCache(false);

    // 1) Intentar caché (si no force)
    if (!opts.force) {
      const cached = cacheGet();
      if (cached) {
        setStats(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // 2) Calcular (o aquí iría tu fetch a backend, pero guardamos en caché el resultado)
    const calculadas = calcularEstadisticas();
    cacheSet(calculadas); // guarda en caché
    setStats(calculadas);
    setFromCache(false);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const lastGenerated = useMemo(() => {
    if (!stats?.generadoEn) return "";
    const d = new Date(stats.generadoEn);
    return d.toLocaleString();
  }, [stats]);

  return (
    <div className="min-h-[70vh] grid gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
            📈 Estadísticas
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fromCache ? "Cargado desde caché" : "Datos frescos"} ·{" "}
            {lastGenerated && `Generado: ${lastGenerated}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => cargar({ force: false })}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
            title="Actualizar (usa caché si está vigente)"
          >
            🔄 Actualizar
          </button>
          <button
            onClick={() => cargar({ force: true })}
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
            title="Forzar recálculo (omite caché)"
          >
            ⚡ Forzar recálculo
          </button>
          <button
            onClick={() => {
              cacheClear();
              cargar({ force: true });
            }}
            className="px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm"
            title="Borrar caché"
          >
            🗑️ Borrar caché
          </button>
        </div>
      </div>

      {/* Contenido */}
      {loading || !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 animate-pulse"
            />
          ))}
          <div className="h-64 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 animate-pulse md:col-span-2" />
          <div className="h-64 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 animate-pulse md:col-span-2" />
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card title="Pacientes" value={stats.resumen.totalPacientes} />
            <Card title="Citas" value={stats.resumen.totalCitas} />
            <Card title="Mujeres" value={stats.resumen.mujeres} />
            <Card title="Hombres" value={stats.resumen.hombres} />
            <Card title="Edad promedio" value={`${stats.resumen.promedioEdad} años`} />
          </div>

          {/* Citas últimos 6 meses */}
          <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-white dark:bg-gray-900 p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300">
                Citas en los últimos 6 meses
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (total mensual)
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <LineMini points={stats.citasUltimos6m} />
              <div className="text-xs space-y-1">
                {stats.citasUltimos6m.map((p) => (
                  <div key={p.mes} className="flex justify-between gap-4">
                    <span>{p.mes}</span>
                    <span className="font-medium">{p.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnósticos top + estados de cita */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-white dark:bg-gray-900 p-4 shadow">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Diagnósticos más frecuentes
              </h3>
              {stats.diagnosticosTop.length ? (
                <BarMini
                  data={stats.diagnosticosTop}
                  labelKey="nombre"
                  valueKey="total"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos</p>
              )}
            </div>

            <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-white dark:bg-gray-900 p-4 shadow">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Estado de citas
              </h3>
              {stats.estadoCitas.length ? (
                <BarMini data={stats.estadoCitas} labelKey="estado" valueKey="total" />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Estadisticas;
