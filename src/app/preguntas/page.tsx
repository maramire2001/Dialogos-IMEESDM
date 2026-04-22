"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PreguntasPage() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [sesion, setSesion] = useState("Conferencia Magistral");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrado, setRegistrado] = useState<boolean | null>(null);

  useEffect(() => {
    const datos = localStorage.getItem('imeesdn_registrado');
    if (datos) {
      setRegistrado(true);
      try {
        const parsed = JSON.parse(datos);
        // Intentar pre-llenar si los datos están disponibles (aunque en el registro antiguo se guardaba concatenado)
        if (parsed.nombre) {
          // Si el nombre viene concatenado "Apellido, Nombre", intentamos separar lo básico
          const partes = parsed.nombre.split(', ');
          if (partes.length === 2) {
            setNombre(partes[1]);
            const apellidos = partes[0].split(' ');
            if (apellidos.length >= 1) setApellidoPaterno(apellidos[0]);
            if (apellidos.length >= 2) setApellidoMaterno(apellidos[1]);
          }
        }
      } catch {}
    } else {
      setRegistrado(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim() || !nombre.trim() || !apellidoPaterno.trim() || !institucion.trim()) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    
    setLoading(true);
    
    const nombreCompleto = `${apellidoPaterno} ${apellidoMaterno}, ${nombre}`;

    const { error } = await supabase.from("preguntas").insert([
      { 
        autor: nombreCompleto, // Mantener autor para compatibilidad con vistas existentes
        nombre: nombre.trim(),
        apellido_paterno: apellidoPaterno.trim(),
        apellido_materno: apellidoMaterno.trim(),
        institucion: institucion.trim(),
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

  // Pantalla de carga
  if (registrado === null) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-imeesdm-dark"></div>
      </div>
    );
  }

  // Bloqueo si no está registrado
  if (!registrado) {
    return (
      <div className="space-y-4">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-imeesdm-dark transition-colors font-medium">
          ← Volver al inicio
        </a>
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border-t-4 border-red-300 text-center">
          <span className="text-6xl mb-4">🔒</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Acceso restringido</h2>
          <p className="text-gray-600 max-w-md mb-6">
            Para participar en el Foro de Preguntas, primero debes completar tu registro como asistente al evento.
          </p>
          <a href="/" className="inline-flex items-center gap-2 bg-imeesdm-dark text-white font-bold px-6 py-3 rounded-lg hover:bg-black transition-all shadow-md">
            Ir al Registro
          </a>
        </div>
      </div>
    );
  }

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

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre(s) *
                </label>
                <input
                  id="nombre"
                  required
                  type="text"
                  placeholder="Tu nombre"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido paterno *
                  </label>
                  <input
                    id="apellidoPaterno"
                    required
                    type="text"
                    placeholder="Apellido 1"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm"
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido materno
                  </label>
                  <input
                    id="apellidoMaterno"
                    type="text"
                    placeholder="Apellido 2"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm"
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-1">
                  Institución de procedencia *
                </label>
                <input
                  id="institucion"
                  required
                  type="text"
                  placeholder="Nombre de tu institución o dependencia"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-imeesdm-gold focus:border-imeesdm-gold sm:text-sm"
                  value={institucion}
                  onChange={(e) => setInstitucion(e.target.value)}
                />
              </div>
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
              disabled={loading || !pregunta.trim() || !nombre.trim()}
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
