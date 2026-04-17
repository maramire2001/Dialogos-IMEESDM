"use client";

import React, { useState, useEffect } from "react";

export default function ForoButton() {
  const [registrado, setRegistrado] = useState<boolean | null>(null);

  useEffect(() => {
    const datos = localStorage.getItem('imeesdn_registrado');
    setRegistrado(!!datos);
  }, []);

  // Mientras carga, no mostrar nada
  if (registrado === null) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center shadow-lg border-2 border-gray-200 flex flex-col justify-between animate-pulse">
        <div className="h-32"></div>
      </div>
    );
  }

  if (registrado) {
    return (
      <div className="bg-white rounded-xl p-6 text-center shadow-lg border-2 border-indigo-100 flex flex-col justify-between">
        <div>
          <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-2">Interactivo</div>
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Foro de Preguntas</h3>
          <p className="text-gray-500 text-xs mb-4">Envía tus preguntas a la mesa o al conferencista.</p>
        </div>
        <a href="/preguntas" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md w-full justify-center text-sm">
          ✋ Hacer una Pregunta
        </a>
      </div>
    );
  }

  // No registrado — candado
  return (
    <div className="bg-gray-50 rounded-xl p-6 text-center shadow-lg border-2 border-gray-200 flex flex-col justify-between">
      <div>
        <span className="text-4xl block mb-2">🔒</span>
        <h3 className="text-lg font-bold text-gray-400 mb-2">Foro de Preguntas</h3>
        <p className="text-gray-400 text-xs mb-4">Regístrate primero para participar en el foro interactivo.</p>
      </div>
      <span className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 font-bold px-4 py-3 rounded-lg w-full justify-center text-sm cursor-not-allowed">
        Requiere Registro
      </span>
    </div>
  );
}
