"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistrationForm() {
  const [profile, setProfile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!aceptaPrivacidad) {
      setErrorMsg("Debes aceptar el Aviso de Privacidad para completar tu registro.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Concatenar nombre completo para la base de datos
    const nombreCompleto = `${data.apellido_paterno} ${data.apellido_materno}, ${data.nombres}`;

    try {
      const { error } = await supabase
        .from('asistentes')
        .insert([
          {
            nombre: nombreCompleto,
            grado_academico: data.grado_academico,
            tipo_asistente: data.tipo_asistente,
            institucion: data.institucion,
            tipo_institucion: data.tipo_institucion,
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
            verificado: true
          }
        ]);

      if (error) {
        throw error;
      }

      // Guardar registro en localStorage para validar acceso al foro
      localStorage.setItem('imeesdn_registrado', JSON.stringify({
        nombre: nombreCompleto,
        correo: data.correo,
        fecha: new Date().toISOString()
      }));

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
        <h3 className="text-2xl font-bold text-green-800 mb-2">¡Registro exitoso!</h3>
        <p className="text-green-700">
          Tu registro ha sido completado correctamente. Ya tienes acceso completo a todas las funciones de la aplicación del evento.
        </p>
      </div>
    );
  }

  // Determinar si el perfil es de tipo Discente (Militar Activo o en Retiro)
  const isDiscente = profile.startsWith("Discente");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* NOMBRE DESGLOSADO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s) *</label>
          <input required name="nombres" type="text" placeholder="Ej: Juan Carlos" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido paterno *</label>
          <input required name="apellido_paterno" type="text" placeholder="Ej: González" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido materno *</label>
          <input required name="apellido_materno" type="text" placeholder="Ej: López" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
            <option value="Discente (Militar Activo)">Discente (Militar Activo)</option>
            <option value="Discente (Militar en Retiro)">Discente (Militar en Retiro)</option>
            <option value="Docente">Docente (Catedrático / Profesor)</option>
            <option value="Investigador">Investigador (Investigación científica / Publicaciones)</option>
            <option value="Académico">Académico (Gestión académica / Coordinación / Consultoría)</option>
          </select>
        </div>

        {/* Nota informativa de perfil */}
        {(profile === "Docente" || profile === "Investigador" || profile === "Académico") && (
          <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
            <strong>Nota sobre tu perfil:</strong>{" "}
            {profile === "Docente" && "Si tu vocación principal es la enseñanza y la formación de alumnos frente a grupo, has elegido correctamente la opción de Docente."}
            {profile === "Investigador" && "Si tu labor central es la generación de conocimiento científico, el desarrollo de proyectos y la publicación de hallazgos académicos, has elegido correctamente la opción de Investigador."}
            {profile === "Académico" && "Si desempeñas funciones de gestión, coordinación de programas, diseño curricular o actividades de apoyo a la vida institucional, has elegido correctamente la opción de Académico."}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institución de procedencia *</label>
          <input required name="institucion" type="text" placeholder="Nombre completo de tu universidad, plantel o dependencia" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de institución *</label>
          <select required name="tipo_institucion" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800 bg-white">
            <option value="">Selecciona tipo</option>
            <option value="Pública">Pública</option>
            <option value="Privada">Privada</option>
          </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
           <input required name="correo" type="email" placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad de asistencia *</label>
          <select required name="modalidad" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold focus:border-imeesdm-gold text-slate-800 bg-white">
            <option value="">Selecciona modalidad</option>
            <option value="Presencial">Presencial (Sede I.M.E.E.S.D.N.)</option>
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

            {isDiscente && (
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

      {/* AVISO DE PRIVACIDAD */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          🔒 Aviso de Privacidad
        </h4>
        <div className="text-xs text-gray-600 leading-relaxed mb-4 max-h-32 overflow-y-auto pr-2">
          <p>
            Los datos personales que nos proporciones serán protegidos, incorporados y tratados bajo nuestra Política de Privacidad, en estricto cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
          </p>
          <p className="mt-2">
            La información recabada se utilizará exclusivamente para gestionar tu registro en la plataforma, validar tu perfil profesional según las categorías anteriormente descritas y enviarte notificaciones académicas oficiales, asegurando que tus datos no serán compartidos con terceros sin tu consentimiento previo.
          </p>
          <p className="mt-2">
            Al hacer clic en &quot;Aceptar&quot;, confirmas que has leído y aceptas los términos de nuestro aviso de privacidad integral, donde podrás consultar el procedimiento para ejercer tus Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición).
          </p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={aceptaPrivacidad}
            onChange={(e) => setAceptaPrivacidad(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-imeesdm-dark focus:ring-imeesdm-gold cursor-pointer"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            <strong>Acepto</strong> el Aviso de Privacidad y autorizo el tratamiento de mis datos personales conforme a lo descrito.
          </span>
        </label>
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting || !aceptaPrivacidad}
          className="w-full bg-imeesdm-dark hover:bg-black text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando datos..." : "Completar Registro"}
        </button>
      </div>
    </form>
  );
}
