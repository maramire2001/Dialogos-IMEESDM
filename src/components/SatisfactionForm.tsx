"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

const QUESTIONS = [
  { id: 'p1', label: '¿Cómo califica la relevancia de los temas abordados?' },
  { id: 'p2', label: '¿La calidad de los ponentes cumplió sus expectativas?' },
  { id: 'p3', label: '¿Qué tan clara fue la organización del evento?' },
  { id: 'p4', label: '¿La plataforma digital facilitó su participación?' },
  { id: 'p5', label: '¿Recomendaría este evento a otros colegas?' }
];

const SCALE = [
  { value: 5, label: 'Excelente', color: 'bg-green-600' },
  { value: 4, label: 'Muy bueno', color: 'bg-green-500' },
  { value: 3, label: 'Regular', color: 'bg-amber-500' },
  { value: 2, label: 'Deficiente', color: 'bg-orange-500' },
  { value: 1, label: 'Muy deficiente', color: 'bg-red-600' }
];

export default function SatisfactionForm() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRatingChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar obligatoriedad
    const allAnswered = QUESTIONS.every(q => answers[q.id]);
    if (!allAnswered) {
      setErrorMsg("Por favor, responda las 5 preguntas obligatorias antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from('satisfaccion')
        .insert([{
          p1: answers.p1,
          p2: answers.p2,
          p3: answers.p3,
          p4: answers.p4,
          p5: answers.p5,
          p6: suggestion.trim() || null
        }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error al enviar encuesta:", err);
      setErrorMsg("Ocurrió un error al enviar tu evaluación. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-xl border border-green-100 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-4">¡Muchas gracias!</h3>
        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
          Tus respuestas han sido registradas. Tu opinión es fundamental para seguir mejorando los Diálogos en el Instituto.
        </p>
        <div className="mt-8">
          <a href="/" className="text-imeesdm-dark font-bold hover:underline">← Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-imeesdm-dark p-6 text-white text-center">
        <h3 className="text-xl font-bold uppercase tracking-wider">Evaluación de Satisfacción</h3>
        <p className="text-xs text-gray-300 mt-1 opacity-80 italic">XI Diálogos en el Instituto: Nuevo orden mundial y Latinoamérica</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-bold flex items-center gap-2 animate-pulse">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <div className="space-y-12">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="space-y-6">
              <label className="block text-lg font-bold text-gray-800 leading-tight">
                <span className="text-imeesdm-gold mr-2 text-2xl font-black">{idx + 1}.</span> {q.label} *
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {SCALE.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleRatingChange(q.id, s.value)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group ${
                      answers[q.id] === s.value 
                        ? `${s.color} border-transparent text-white shadow-lg scale-105 z-10` 
                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <span className={`text-2xl font-black mb-1 ${answers[q.id] === s.value ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {s.value}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-tighter text-center leading-none ${answers[q.id] === s.value ? 'text-white' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
          <label className="block text-lg font-bold text-gray-800">
             6. ¿Tiene alguna sugerencia adicional para mejorar nuestros próximos diálogos?
          </label>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={4}
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-imeesdm-gold focus:border-imeesdm-gold text-gray-800 placeholder-gray-400 bg-gray-50 resize-none transition-all"
            placeholder="Escribe aquí tus comentarios o sugerencias (opcional)..."
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-imeesdm-dark text-white font-black py-4 rounded-xl shadow-xl hover:bg-black transition-all transform active:scale-[0.98] disabled:bg-gray-300 tracking-widest uppercase"
          >
            {isSubmitting ? "Enviando evaluación..." : "Enviar Respuestas Finales"}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Su opinión será tratada de forma confidencial.</p>
        </div>
      </form>
    </div>
  );
}
