import React from "react";
import RegistrationForm from "@/components/RegistrationForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Botones Destacados de la App en Vivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
        
        {/* Cartel de Programa */}
        <div className="bg-gradient-to-r from-imeesdm-dark to-black rounded-xl p-6 text-center shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-2">Programa y Ponentes</h3>
          <p className="text-gray-300 text-sm mb-4">Currículums y material oficial del evento.</p>
          <a href="/programa" className="inline-flex items-center gap-2 bg-imeesdm-gold text-imeesdm-dark font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all shadow-md w-full justify-center">
            <span>📄</span> Ver Programa Oficial
          </a>
        </div>

        {/* Cartel de Preguntas */}
        <div className="bg-white rounded-xl p-6 text-center shadow-lg border-2 border-indigo-100 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-2">Interactivo</div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Foro de Preguntas en Vivo</h3>
            <p className="text-gray-500 text-sm mb-4">Envía tus preguntas a la mesa o al conferencista.</p>
          </div>
          <a href="/preguntas" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md w-full justify-center">
            <span>✋</span> Hacer una Pregunta
          </a>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-8 text-center border-t-4 border-imeesdm-gold">
        <h2 className="text-3xl font-bold text-imeesdm-dark mb-4">
          Bienvenidos al Evento
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          Registro oficial para los asistentes presenciales y en línea a los &quot;XI Diálogos en el Instituto: Nuevo orden mundial y Latinoamérica&quot;.
        </p>
        
        <div className="inline-block bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm border border-blue-100">
          <strong>Aviso:</strong> El registro es obligatorio para acceder a todas las funciones de la aplicación del evento.
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Formulario de registro para acceder a la app</h3>
        </div>
        <div className="p-6">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
