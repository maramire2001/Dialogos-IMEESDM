import React from "react";
import SatisfactionForm from "@/components/SatisfactionForm";

export default function SatisfaccionPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-imeesdm-dark transition-colors font-medium mb-6">
          ← Volver al inicio
        </a>
        <h1 className="text-3xl font-black text-imeesdm-dark uppercase tracking-tight">Evaluación de Calidad</h1>
        <div className="mt-2 h-1.5 w-24 bg-imeesdm-gold mx-auto rounded-full"></div>
      </div>
      
      <SatisfactionForm />
    </div>
  );
}
