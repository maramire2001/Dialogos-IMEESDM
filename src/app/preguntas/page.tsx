"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PreguntasPage() {
  const [autor, setAutor] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [sesion, setSesion] = useState("Conferencia Magistral");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim()) return;
    
    setLoading(true);
    
    const { error } = await supabase.from("preguntas").insert([
      { 
        autor: autor.trim() ? autor.trim() : "Anónimo", 
        pregunta: pregunta.trim(),
        sesion: sesion
      }
    ]);

    setLoading(false);

    if (error) {
      alert("Hubo un error al enviar tu pregunta. Asegúrate de haber actualizado la base de datos.");
      console.error(error);
    } else {
      setEnviado(true);
      setPregunta("");
      setTimeout(() => setEnviado(false), 5000);
    }
  };

  return (
    <div className="space-y-4">
      <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-imeesdm-dark transition-colors font-medium">
        ← Volver al inicio
      </a>
    <div className="flex flex-col items-center justify-center py-12 px-4 border-t-4 border-imeesdm-gold min-h-[70vh] bg-white rounded-xl shadow-sm">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-imeesdm-dark">Foro de Discusión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Selecciona la mesa y envía tu pregunta en vivo. La Inteligencia Artificial la clasificará para el moderador.
          </p>
          <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-4 py-2 text-left">
            <strong>Indicación:</strong> Redacte su intervención de forma breve, clara y objetiva. Las preguntas fuera de contexto o con lenguaje inapropiado serán descartadas automáticamente por el sistema.
          </div>
        </div>
        
        {enviado && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  ¡Pregunta enviada exitosamente a la mesa de moderación!
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="sesion" className="block text-sm font-medium text-gray-700 mb-1">
                ¿A qué sesión va dirigida tu pregunta? *
              </label>
              <select
                id="sesion"
                name="sesion"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm font-bold text-imeesdm-dark"
                value={sesion}
                onChange={(e) => setSesion(e.target.value)}
              >
                <option value="Conferencia Magistral">Conferencia Magistral</option>
                <option value="Mesa 1">Mesa 1</option>
                <option value="Mesa 2">Mesa 2</option>
              </select>
            </div>

            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
                Tu Nombre (Opcional)
              </label>
              <input
                id="autor"
                name="autor"
                type="text"
                placeholder="Si lo dejas en blanco será Anónimo"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="pregunta" className="block text-sm font-medium text-gray-700 mb-1">
                Tu Pregunta *
              </label>
              <textarea
                id="pregunta"
                name="pregunta"
                required
                rows={4}
                placeholder="Escribe tu pregunta de forma clara y directa..."
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm resize-none"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !pregunta.trim()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-imeesdm-dark hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-imeesdm-dark disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Enviando..." : "Enviar a Moderación"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
