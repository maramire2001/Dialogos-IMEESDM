"use client";

export default function ProgramaPDFPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-imeesdm-dark transition-colors font-medium">
          ← Volver al inicio
        </a>
      </div>
      <h2 className="text-2xl font-bold text-imeesdm-dark text-center">Programa Oficial del Evento</h2>
      <p className="text-gray-500 text-sm text-center">XI Diálogos en el Instituto — I.M.E.E.S.D.N.</p>
      
      <div className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height: "80vh" }}>
        <iframe 
          src="/programa-oficial.pdf" 
          className="w-full h-full"
          title="Programa del Evento"
        />
      </div>

      <a 
        href="/programa-oficial.pdf" 
        download
        className="text-sm text-gray-500 hover:text-imeesdm-dark underline transition-colors"
      >
        ¿No se muestra? Descargar PDF
      </a>
    </div>
  );
}
