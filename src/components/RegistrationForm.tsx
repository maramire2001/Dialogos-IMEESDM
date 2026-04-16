"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistrationForm() {
  const [profile, setProfile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase
        .from('asistentes')
        .insert([
          {
            nombre: data.nombre,
            grado_academico: data.grado_academico,
            tipo_asistente: data.tipo_asistente,
            institucion: data.institucion,
            correo: data.correo,
            modalidad: data.modalidad,
            carrera: data.carrera || null,
            semestre: data.semestre || null,
            fuerza_armada: data.fuerza_armada || null,
            grado_militar: data.grado_militar || null,
            plantel: data.plantel || null,
            especialidad_militar: data.especialidad_militar || null,
            area_conocimiento: data.area_conocimiento || null,
            linea_investigacion: data.linea_investigacion || null,
            nivel_sni: data.nivel_sni || null,
            verificado: false // Inicialmente falso hasta verificar email
          }
        ]);

      if (error) {
        throw error;
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error('Error insertando registro:', error);
      setErrorMsg("Ocurrió un error al registrarte. Verifica si el correo ya está registrado o intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-2xl font-bold text-green-800 mb-2">¡Registro completado!</h3>
        <p className="text-green-700">
          Tus datos han sido guardados en nuestra base de datos.
          En breve recibirás un correo electrónico con tu código PIN de verificación.
          Recuerda que deberás validarlo para asegurar tu acceso al evento.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CAMPOS COMUNES */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
          <input required name="nombre" type="text" placeholder="Apellido paterno, materno y nombre(s)" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grado académico *</label>
          <select required name="grado_academico" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800 bg-white">
            <option value="">Selecciona tu grado</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Especialidad">Especialidad</option>
            <option value="Maestría">Maestría</option>
            <option value="Doctorado">Doctorado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de asistente *</label>
          <select 
            required 
            name="tipo_asistente"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800 bg-white"
          >
            <option value="">Selecciona un perfil</option>
            <option value="Alumno">Alumno</option>
            <option value="Discente">Discente (Militar)</option>
            <option value="Docente">Docente</option>
            <option value="Académico">Académico</option>
            <option value="Investigador">Investigador</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Institución de procedencia *</label>
          <input required name="institucion" type="text" placeholder="Nombre completo de tu universidad, plantel o dependencia" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
           <input required name="correo" type="email" placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad de asistencia *</label>
          <select required name="modalidad" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800 bg-white">
            <option value="">Selecciona modalidad</option>
            <option value="Presencial">Presencial (Sede IMEESDM)</option>
            <option value="En línea">En línea (Transmisión)</option>
          </select>
        </div>
      </div>

      {/* CAMPOS CONDICIONALES POR PERFIL */}
      {profile && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-bold text-imeesdm-dark uppercase mb-4 border-b pb-2">Información específica: {profile}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {profile === "Alumno" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carrera o programa *</label>
                  <input required name="carrera" type="text" placeholder="Ej: Licenciatura en Relaciones Internacionales" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semestre o año en curso</label>
                  <input name="semestre" type="text" placeholder="Opcional" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
              </>
            )}

            {profile === "Discente" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuerza armada *</label>
                  <select required name="fuerza_armada" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold bg-white">
                    <option value="">Selecciona tu fuerza</option>
                    <option value="Ejército Mexicano">Ejército Mexicano</option>
                    <option value="Fuerza Aérea Mexicana">Fuerza Aérea Mexicana</option>
                    <option value="Armada de México">Armada de México</option>
                    <option value="Guardia Nacional">Guardia Nacional (G.N.)</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grado *</label>
                  <input required name="grado_militar" type="text" placeholder="Ej: Capitán 1/o." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escuela o plantel *</label>
                  <input required name="plantel" type="text" placeholder="Nombre completo de tu escuela o plantel militar" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arma, servicio o especialidad</label>
                  <input name="especialidad_militar" type="text" placeholder="Opcional" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
              </>
            )}

            {profile === "Docente" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de conocimiento *</label>
                <input required name="area_conocimiento" type="text" placeholder="Área o materia que impartes" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
              </div>
            )}

            {(profile === "Académico" || profile === "Investigador") && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Línea de investigación *</label>
                  <input required name="linea_investigacion" type="text" placeholder="Ej: Seguridad Nacional, Geopolítica" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel SNI o distinción</label>
                  <input name="nivel_sni" type="text" placeholder="Opcional" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold" />
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-imeesdm-dark hover:bg-black text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "Guardando datos..." : "Completar Registro"}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4">
          Al registrarte aceptas las políticas de privacidad del IMEESDM. Los datos serán utilizados exclusivamente con fines académicos y de seguridad del evento.
        </p>
      </div>
    </form>
  );
}
