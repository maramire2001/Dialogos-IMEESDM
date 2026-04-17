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
    if (password === "IMEESDN2026" || password === "admin123") {
      setIsAuthenticated(true);
      fetchAttendees();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Eliminar permanentemente a ${nombre}?`)) {
      const { error } = await supabase.from("asistentes").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar.");
        console.error(error);
      } else {
        setAttendees(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  const exportCsv = () => {
    if (attendees.length === 0) return;
    const headers = Object.keys(attendees[0]).filter(k => k !== 'id').join(",");
    const rows = attendees.map(row => 
      Object.entries(row)
        .filter(([key]) => key !== 'id')
        .map(([_, val]) => typeof val === "string" ? `"${val}"` : val).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "asistentes_dialogos_imeesdn.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---- PESTAÑAS ----
  const [activeTab, setActiveTab] = useState<"asistentes" | "archivos">("asistentes");

  // ---- SUBIDA DE ARCHIVOS ----
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadImgMessage, setUploadImgMessage] = useState("");

  // ---- LISTAS DE ARCHIVOS ----
  const [cvFiles, setCvFiles] = useState<any[]>([]);
  const [photoFiles, setPhotoFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const fetchFiles = async () => {
    setLoadingFiles(true);
    const { data: cData } = await supabase.storage.from('event_assets').list('cvs', {
      limit: 100, sortBy: { column: 'created_at', order: 'desc' }
    });
    if (cData) setCvFiles(cData.filter(f => f.name !== '.emptyFolderPlaceholder'));

    const { data: pData } = await supabase.storage.from('event_assets').list('galeria', {
      limit: 100, sortBy: { column: 'created_at', order: 'desc' }
    });
    if (pData) setPhotoFiles(pData.filter(f => f.name !== '.emptyFolderPlaceholder'));
    setLoadingFiles(false);
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "archivos") {
      fetchFiles();
    }
  }, [isAuthenticated, activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMessage("");
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('event_assets').upload(`cvs/${fileName}`, file, { cacheControl: '3600', upsert: false });
    setUploading(false);
    if (error) { setUploadMessage("Error: " + error.message); }
    else { setUploadMessage("¡PDF subido!"); e.target.value = ""; fetchFiles(); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadImgMessage("");
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('event_assets').upload(`galeria/${fileName}`, file, { cacheControl: '3600', upsert: false });
    setUploadingImage(false);
    if (error) { setUploadImgMessage("Error: " + error.message); }
    else { setUploadImgMessage("¡Foto subida!"); e.target.value = ""; fetchFiles(); }
  };

  const deleteFile = async (folder: string, fileName: string) => {
    if (!window.confirm(`¿Eliminar "${fileName}" permanentemente?`)) return;
    const { error } = await supabase.storage.from('event_assets').remove([`${folder}/${fileName}`]);
    if (error) {
      alert("Error al borrar: " + error.message);
    } else {
      if (folder === "cvs") setCvFiles(prev => prev.filter(f => f.name !== fileName));
      else setPhotoFiles(prev => prev.filter(f => f.name !== fileName));
    }
  };

  // ---- LOGIN ----
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

  // ---- DASHBOARD ----
  return (
    <div className="space-y-6">
      {/* Pestañas */}
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

      {/* ============ TAB: ASISTENTES ============ */}
      {activeTab === "asistentes" && (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-t-4 border-imeesdm-dark">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <div>
              <h2 className="text-xl font-bold text-imeesdm-dark">Panel de Control: Asistentes</h2>
              <p className="text-gray-500 text-sm">Total registrados: {attendees.length}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={fetchAttendees} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                Actualizar
              </button>
              <button onClick={exportCsv} className="px-3 py-2 bg-imeesdm-gold text-imeesdm-dark font-bold rounded-md hover:brightness-110 transition-all text-sm">
                Descargar CSV
              </button>
            </div>
          </div>

          {/* Lista tipo tarjetas en vez de tabla — siempre visible */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Cargando datos...</p>
            ) : attendees.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aún no hay registrados.</p>
            ) : (
              attendees.map((a) => (
                <div key={a.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{a.nombre}</span>
                      <span className="px-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{a.tipo_asistente}</span>
                      <span className="text-xs text-gray-400">{a.modalidad}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {a.correo} · {a.institucion} · {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(a.id, a.nombre)}
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md transition-colors text-sm font-bold flex-shrink-0"
                  >
                    🗑️ Borrar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============ TAB: GESTOR MULTIMEDIA ============ */}
      {activeTab === "archivos" && (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-t-4 border-imeesdm-gold">
          <h2 className="text-xl font-bold text-imeesdm-dark mb-2">Gestor de Contenido Multimedia</h2>
          <p className="text-gray-500 text-sm mb-6">Sube y administra los currículums (PDF) y las fotografías (JPG) del evento.</p>
          
          {/* Zona de Subida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* CVs Upload */}
            <div className="bg-gray-50 border border-dashed border-gray-300 p-5 rounded-lg text-center">
              <span className="text-3xl mb-2 block">📄</span>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Cargar PDF</h3>
              <div className="flex justify-center mt-3">
                <label className="cursor-pointer bg-imeesdm-dark rounded-md font-medium text-white px-4 py-2 hover:bg-black transition-colors text-sm">
                  <span>{uploading ? "Subiendo..." : "Seleccionar PDF"}</span>
                  <input type="file" className="sr-only" accept=".pdf" disabled={uploading} onChange={handleFileUpload} />
                </label>
              </div>
              {uploadMessage && <p className={`mt-3 text-xs font-bold ${uploadMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{uploadMessage}</p>}
            </div>

            {/* Photos Upload */}
            <div className="bg-gray-50 border border-dashed border-gray-300 p-5 rounded-lg text-center">
              <span className="text-3xl mb-2 block">📸</span>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Cargar Foto</h3>
              <div className="flex justify-center mt-3">
                <label className="cursor-pointer bg-indigo-600 rounded-md font-medium text-white px-4 py-2 hover:bg-indigo-700 transition-colors text-sm">
                  <span>{uploadingImage ? "Subiendo..." : "Seleccionar Imagen"}</span>
                  <input type="file" className="sr-only" accept="image/png, image/jpeg, image/jpg" disabled={uploadingImage} onChange={handleImageUpload} />
                </label>
              </div>
              {uploadImgMessage && <p className={`mt-3 text-xs font-bold ${uploadImgMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{uploadImgMessage}</p>}
            </div>
          </div>

          {/* Lista de PDFs subidos */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-2">📄 PDFs subidos ({cvFiles.length})</h3>
            {loadingFiles ? (
              <p className="text-gray-400 text-sm">Cargando...</p>
            ) : cvFiles.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">No hay PDFs subidos aún.</p>
            ) : (
              <ul className="space-y-2">
                {cvFiles.map((f, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">📄</span>
                      <span className="text-sm text-gray-700 truncate">{f.name}</span>
                      <span className="text-xs text-gray-400">{new Date(f.created_at).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => deleteFile("cvs", f.name)} 
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-bold transition-colors flex-shrink-0"
                    >
                      🗑️ Borrar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Lista de Fotos subidas */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-2">📸 Fotos subidas ({photoFiles.length})</h3>
            {loadingFiles ? (
              <p className="text-gray-400 text-sm">Cargando...</p>
            ) : photoFiles.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">No hay fotos subidas aún.</p>
            ) : (
              <ul className="space-y-2">
                {photoFiles.map((f, i) => {
                  const { data: urlData } = supabase.storage.from('event_assets').getPublicUrl(`galeria/${f.name}`);
                  return (
                    <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={urlData.publicUrl} alt="" className="w-12 h-12 object-cover rounded-md border border-gray-300 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-sm text-gray-700 truncate block">{f.name}</span>
                          <span className="text-xs text-gray-400">{new Date(f.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteFile("galeria", f.name)} 
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-bold transition-colors flex-shrink-0"
                      >
                        🗑️ Borrar
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
