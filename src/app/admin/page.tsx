"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("asistentes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching attendees:", error);
    } else {
      setAttendees(data || []);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "IMEESDM2026" || password === "admin123") {
      setIsAuthenticated(true);
      fetchAttendees();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${nombre}?`)) {
      const { error } = await supabase.from("asistentes").delete().eq("id", id);
      if (error) {
        alert("Hubo un error al intentar eliminar el registro.");
        console.error(error);
      } else {
        // Remove from local state immediately to avoid reloading
        setAttendees(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  const exportCsv = () => {
    if (attendees.length === 0) return;
    
    // Simplistic CSV export (excluding the 'id' column for cleaner output)
    const headers = Object.keys(attendees[0]).filter(k => k !== 'id').join(",");
    const rows = attendees.map(row => 
      Object.entries(row)
        .filter(([key]) => key !== 'id')
        .map(([_, val]) => typeof val === "string" ? `"${val}"` : val).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asistentes_dialogos_imeesdm.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [activeTab, setActiveTab] = useState<"asistentes" | "archivos">("asistentes");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('event_assets')
      .upload(`cvs/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    setUploading(false);

    if (error) {
      setUploadMessage("Error al subir el archivo: " + error.message);
    } else {
      setUploadMessage(`¡PDF subido con éxito!`);
      e.target.value = "";
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadImgMessage, setUploadImgMessage] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadImgMessage("");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('event_assets')
      .upload(`galeria/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    setUploadingImage(false);

    if (error) {
      setUploadImgMessage("Error al subir la foto: " + error.message);
    } else {
      setUploadImgMessage(`¡Foto subida con éxito a la galería!`);
      e.target.value = "";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border-t-4 border-imeesdm-gold">
          <h2 className="text-2xl font-bold text-imeesdm-dark mb-6 text-center">Acceso Administrador</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold"
                placeholder="Ingresa tu clave"
              />
            </div>
            <button type="submit" className="w-full bg-imeesdm-dark text-white font-bold py-2 rounded-md hover:bg-black transition-colors">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navegación de Pestañas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border-b border-gray-200 flex gap-4">
        <button 
          onClick={() => setActiveTab("asistentes")}
          className={`px-4 py-2 font-bold rounded-md transition-colors ${activeTab === 'asistentes' ? 'bg-imeesdm-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          📋 Padrón de Asistentes
        </button>
        <button 
          onClick={() => setActiveTab("archivos")}
          className={`px-4 py-2 font-bold rounded-md transition-colors ${activeTab === 'archivos' ? 'bg-imeesdm-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          🖼️ Gestor Multimedia
        </button>
      </div>

      {/* Contenido de Asistentes */}
      {activeTab === "asistentes" && (
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-imeesdm-dark overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-imeesdm-dark">Panel de Control: Asistentes</h2>
              <p className="text-gray-500">Total registrados: {attendees.length}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={fetchAttendees}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Actualizar
              </button>
              <button 
                onClick={exportCsv}
                className="px-4 py-2 bg-imeesdm-gold text-imeesdm-dark font-bold rounded-md hover:brightness-110 transition-all flex items-center gap-2"
              >
                Descargar CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Cargando datos...</td>
                  </tr>
                ) : attendees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Aún no hay registrados.</td>
                  </tr>
                ) : (
                  attendees.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {a.nombre}
                        <div className="text-xs text-gray-500 font-normal">{a.correo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {a.tipo_asistente}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{a.institucion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{a.modalidad}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(a.id, a.nombre)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors flex items-center justify-center"
                          title="Eliminar Registro"
                        >
                          🗑️ Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido de Archivos CV */}
      {activeTab === "archivos" && (
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-imeesdm-gold overflow-hidden">
          <h2 className="text-2xl font-bold text-imeesdm-dark mb-2">Gestor de Contenido Multimedia</h2>
          <p className="text-gray-500 mb-6">Sube los currículums de los ponentes en PDF o las fotografías en JPG. Aparecerán automáticamente en la sección pública.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CVs Upload */}
            <div className="bg-gray-50 border border-dashed border-gray-300 p-6 rounded-lg text-center">
              <span className="text-4xl mb-4 block">📄</span>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Cargar documento PDF</h3>
              <p className="text-xs text-gray-500 mb-4">Solo para CVs o el Informe (Max 5MB).</p>
              
              <div className="flex justify-center">
                <label className="relative cursor-pointer bg-imeesdm-dark rounded-md font-medium text-white px-4 py-2 hover:bg-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-imeesdm-dark transition-colors text-sm">
                  <span>{uploading ? "Subiendo PDF..." : "Seleccionar PDF"}</span>
                  <input 
                    type="file" 
                    className="sr-only" 
                    accept=".pdf"
                    disabled={uploading}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              
              {uploadMessage && (
                <p className={`mt-4 text-xs font-bold ${uploadMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>

            {/* Photos Upload */}
            <div className="bg-gray-50 border border-dashed border-gray-300 p-6 rounded-lg text-center">
              <span className="text-4xl mb-4 block">📸</span>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Cargar Fotografía Oficial</h3>
              <p className="text-xs text-gray-500 mb-4">Archivos JPG o PNG para la galería del evento.</p>
              
              <div className="flex justify-center">
                <label className="relative cursor-pointer bg-indigo-600 rounded-md font-medium text-white px-4 py-2 hover:bg-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-600 transition-colors text-sm">
                  <span>{uploadingImage ? "Subiendo Foto..." : "Seleccionar Imagen"}</span>
                  <input 
                    type="file" 
                    className="sr-only" 
                    accept="image/png, image/jpeg, image/jpg"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              {uploadImgMessage && (
                <p className={`mt-4 text-xs font-bold ${uploadImgMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {uploadImgMessage}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800 text-sm">
            <strong>Instrucción para Supabase:</strong> Recuerda crear el bucket <strong>event_assets</strong> y configurarlo como <em>Público</em> en Supabase Storage.
          </div>
        </div>
      )}
    </div>
  );
}

