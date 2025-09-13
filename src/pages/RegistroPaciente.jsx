// src/pages/RegistroPaciente.jsx
import { useEffect, useMemo, useState } from "react";

const formatDDMMYYYY = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const calcEdad = (isoBirth) => {
  if (!isoBirth) return "";
  const b = new Date(isoBirth);
  const t = new Date();
  let e = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) e--;
  return e;
};

const getPacientesLS = () => {
  try {
    const raw = localStorage.getItem("pacientes");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

const setPacientesLS = (arr) => {
  try {
    localStorage.setItem("pacientes", JSON.stringify(arr));
  } catch {}
};

const RegistroPaciente = () => {
  const [pacientes, setPacientes] = useState(getPacientesLS());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    dpi: "",
    fechaNacimientoISO: "",
    edad: "",
    sexo: "F", // F/H (coherente con el resto de páginas)
    tipoConsulta: "",
    patologia: "",
    codigo: "",
    tipoTerapia: "",
    escolaridad: "",
    ocupacion: "",
    estadoCivil: "",
    municipio: "",
    aldea: "",
    embarazo: "", // "< 14 años" | ">= edad"
    referido: false,
    institucion: "",
    motivo: "",
    fechaRefISO: "",
    observaciones: "",
    fechaConsultaISO: "", // opcional (si registras el día de la consulta)
  });

  // Actualizar edad cuando cambia fecha de nacimiento
  useEffect(() => {
    const e = calcEdad(form.fechaNacimientoISO);
    setForm((f) => ({ ...f, edad: e || "" }));
  }, [form.fechaNacimientoISO]);

  const menorDeEdad = useMemo(
    () => typeof form.edad === "number" ? form.edad < 18 : (Number(form.edad) < 18),
    [form.edad]
  );

  const handleChange = (key) => (e) => {
    const val = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      dpi: "",
      fechaNacimientoISO: "",
      edad: "",
      sexo: "F",
      tipoConsulta: "",
      patologia: "",
      codigo: "",
      tipoTerapia: "",
      escolaridad: "",
      ocupacion: "",
      estadoCivil: "",
      municipio: "",
      aldea: "",
      embarazo: "",
      referido: false,
      institucion: "",
      motivo: "",
      fechaRefISO: "",
      observaciones: "",
      fechaConsultaISO: "",
    });
    setError("");
  };

  const guardarPaciente = () => {
    setError("");

    // Validación mínima (igual que en tu versión original pero con textos)
    if (
      !form.nombre ||
      form.edad === "" ||
      !form.sexo ||
      !form.tipoConsulta ||
      !form.patologia ||
      !form.codigo ||
      !form.tipoTerapia
    ) {
      setError("Por favor completa los campos obligatorios: Nombre, Edad (se calcula), Sexo, Tipo de consulta, Patología, Código CIE-10 y Tipo de terapia.");
      return;
    }

    const nuevo = {
      nombre: form.nombre,
      dpi: form.dpi || "---",
      nacimiento: formatDDMMYYYY(form.fechaNacimientoISO),
      edad: form.edad || "",
      sexo: form.sexo, // "F" o "H"
      tipoConsulta: form.tipoConsulta, // "Primera" | "Reconsulta"
      diagnostico: form.patologia,
      cie10: form.codigo,
      terapia: form.tipoTerapia,
      escolaridad: form.escolaridad,
      ocupacion: form.ocupacion,
      estadoCivil: form.estadoCivil,
      municipio: form.municipio,
      aldea: form.aldea,
      embarazo: form.sexo === "F" ? form.embarazo : "",
      referido: form.referido,
      institucion: form.institucion,
      motivo: form.motivo,
      fechaReferencia: formatDDMMYYYY(form.fechaRefISO),
      observaciones: form.observaciones,
      fechaConsulta: form.fechaConsultaISO ? formatDDMMYYYY(form.fechaConsultaISO) : formatDDMMYYYY(new Date().toISOString()),
      // estos campos ayudan a integrarlo con VerPacientes si lo lees de localStorage
      consulta: {
        primera: form.tipoConsulta === "Primera",
        reconsulta: form.tipoConsulta === "Reconsulta",
        emergencia: false,
      },
      menorDe15: typeof form.edad === "number" ? form.edad < 15 : Number(form.edad) < 15,
      adulto: typeof form.edad === "number" ? form.edad >= 18 : Number(form.edad) >= 18,
      no: pacientes.length + 1,
      historia: String(pacientes.length + 1).padStart(3, "0"),
    };

    setSaving(true);
    // Simular persistencia local rápida sin base de datos
    const updated = [...pacientes, nuevo];
    setPacientes(updated);
    setPacientesLS(updated);
    setSaving(false);
    resetForm();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-violet-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-[1200px] rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 bg-white dark:bg-gray-900 shadow">
        {/* Header */}
        <div className="px-5 md:px-6 py-4 md:py-5 rounded-t-2xl bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-200/60 dark:border-indigo-800/50">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <span role="img" aria-label="doc">🧾</span> Registro de Paciente
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Completa la información. La edad se calcula automáticamente con la fecha de nacimiento.
          </p>
        </div>

        {/* Formulario */}
        <div className="p-5 md:p-6 space-y-6">
          {/* Alert de error */}
          {error && (
            <div className="rounded-lg border border-rose-300/60 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-200 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Datos principales */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">Datos principales</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs mb-1">Nombres y apellidos *</label>
                <input
                  value={form.nombre}
                  onChange={handleChange("nombre")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Fecha de nacimiento *</label>
                <input
                  type="date"
                  value={form.fechaNacimientoISO}
                  onChange={handleChange("fechaNacimientoISO")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Edad calculada</label>
                <div className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                  <span className="font-semibold">{form.edad || "—"} años</span>{" "}
                  {form.edad !== "" && (
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        menorDeEdad
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                      }`}
                    >
                      {menorDeEdad ? "Menor de edad" : "Mayor de edad"}
                    </span>
                  )}
                </div>
              </div>

              {/* DPI solo para mayores de edad */}
              {(!menorDeEdad || form.edad === "") && (
                <div>
                  <label className="block text-xs mb-1">DPI</label>
                  <input
                    value={form.dpi}
                    onChange={handleChange("dpi")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="DPI (solo si aplica)"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs mb-1">Sexo *</label>
                <select
                  value={form.sexo}
                  onChange={handleChange("sexo")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="F">Mujer</option>
                  <option value="H">Hombre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1">Tipo de consulta *</label>
                <select
                  value={form.tipoConsulta}
                  onChange={handleChange("tipoConsulta")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="">Selecciona…</option>
                  <option value="Primera">Primera</option>
                  <option value="Reconsulta">Reconsulta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1">Patología / Diagnóstico *</label>
                <input
                  value={form.patologia}
                  onChange={handleChange("patologia")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Ej. Tristeza leve"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Código CIE-10 *</label>
                <input
                  value={form.codigo}
                  onChange={handleChange("codigo")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Ej. F32.0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs mb-1">Tipo de terapia *</label>
                <input
                  value={form.tipoTerapia}
                  onChange={handleChange("tipoTerapia")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Ej. Psicoterapia"
                />
              </div>
            </div>
          </section>

          {/* Información socio-demográfica */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
              Información socio-demográfica
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="block text-xs mb-1">Municipio</label>
                <input
                  value={form.municipio}
                  onChange={handleChange("municipio")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Aldea</label>
                <input
                  value={form.aldea}
                  onChange={handleChange("aldea")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Escolaridad</label>
                <input
                  value={form.escolaridad}
                  onChange={handleChange("escolaridad")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Ocupación</label>
                <input
                  value={form.ocupacion}
                  onChange={handleChange("ocupacion")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Estado civil</label>
                <input
                  value={form.estadoCivil}
                  onChange={handleChange("estadoCivil")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Embarazo solo para F */}
              {form.sexo === "F" && (
                <div>
                  <label className="block text-xs mb-1">Embarazo</label>
                  <select
                    value={form.embarazo}
                    onChange={handleChange("embarazo")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="">Selecciona…</option>
                    <option value="< 14 años">Menor de 14 años</option>
                    <option value=">= edad">Mayor de edad</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Referencias */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">Referencia</h2>
            <label className="inline-flex items-center gap-2 text-sm mb-3">
              <input
                type="checkbox"
                checked={form.referido}
                onChange={handleChange("referido")}
              />
              Paciente referido
            </label>

            {form.referido && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block text-xs mb-1">Institución referida</label>
                  <input
                    value={form.institucion}
                    onChange={handleChange("institucion")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Motivo</label>
                  <input
                    value={form.motivo}
                    onChange={handleChange("motivo")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Fecha de referencia</label>
                  <input
                    type="date"
                    value={form.fechaRefISO}
                    onChange={handleChange("fechaRefISO")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs mb-1">Observaciones</label>
                  <textarea
                    value={form.observaciones}
                    onChange={handleChange("observaciones")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Fecha de consulta opcional */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">Consulta</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="block text-xs mb-1">Fecha de consulta</label>
                <input
                  type="date"
                  value={form.fechaConsultaISO}
                  onChange={handleChange("fechaConsultaISO")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Si se omite, se guarda la fecha de hoy"
                />
              </div>
            </div>
          </section>

          {/* Acciones */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              type="button"
            >
              Limpiar
            </button>
            <button
              onClick={guardarPaciente}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
              type="button"
            >
              {saving ? "Guardando…" : "Guardar paciente"}
            </button>
          </div>

          {/* Lista rápida (misma estética base) */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">📋 Pacientes registrados (local)</h2>
            {pacientes.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Aún no se han registrado pacientes.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-[700px] w-full text-sm border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                      {["#", "Nombre", "Edad", "Sexo", "Tipo consulta", "Diagnóstico", "CIE-10", "Fecha consulta"].map(
                        (h, i, arr) => (
                          <th
                            key={h}
                            className={`px-3 py-2 font-semibold border-b border-gray-200 dark:border-gray-700 ${
                              i === 0 ? "rounded-tl-lg" : ""
                            } ${i === arr.length - 1 ? "rounded-tr-lg" : ""}`}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((p, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                      >
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{idx + 1}</td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{p.nombre}</td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{p.edad ?? "—"}</td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                          {p.sexo === "H" ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                              Hombre
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200">
                              Mujer
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{p.tipoConsulta}</td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{p.diagnostico}</td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{p.cie10}</td>
                        <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">{p.fechaConsulta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegistroPaciente;
