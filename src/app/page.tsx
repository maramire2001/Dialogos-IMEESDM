import React from "react";
import RegistrationForm from "@/components/RegistrationForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="bg-white rounded-xl shadow-sm p-8 text-center border-t-4 border-imeesdm-gold">
        <h2 className="text-3xl font-bold text-imeesdm-dark mb-4">
          Bienvenidos al Evento
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          Registro oficial para los asistentes presenciales y en línea a los "XI Diálogos en el Instituto: Nuevo orden mundial y Latinoamérica".
        </p>
        
        <div className="inline-block bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm border border-blue-100">
          <strong>Aviso:</strong> El registro es obligatorio para acceder a cualquier función del evento y generar tu credencial de acceso.
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Formulario de Registro</h3>
        </div>
        <div className="p-6">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
