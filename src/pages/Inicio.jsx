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

import { Link } from "react-router-dom";

const Inicio = () => {
  return (
    <div className="min-h-[calc(100vh-48px)]">
      {/* Título alineado a la izquierda */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-indigo-700 dark:text-indigo-300">
          THERAPY-BOOT
        </h1>
      </div>

      <section className="max-w-5xl mx-auto px-6 py-8 grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">
            IA para apoyo emocional y acompañamiento psicológico
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Esta plataforma integra un asistente virtual impulsado por inteligencia artificial
            para brindar orientación emocional inicial y herramientas de autocuidado.
          </p>

          {/* Un solo set de botones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/cita"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow"
            >
              Agendar cita
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium shadow"
            >
              Probar el chat
            </Link>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow">
          <h3 className="text-xl font-bold mb-2">¿Cómo funciona?</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>El chatbot ofrece apoyo emocional inicial y psicoeducación.</li>
            <li>Los usuarios pueden agendar citas y recibir material de apoyo.</li>
            <li>Interfaz clara con modo claro/oscuro agradable.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            * El asistente virtual no reemplaza la atención profesional. Para emergencias, contacte a los números locales de ayuda.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
