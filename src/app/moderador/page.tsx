"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ModeradorDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchPreguntas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("preguntas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching preguntas:", error);
    } else {
      setPreguntas(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch initially
      fetchPreguntas();
      
      // Setup realtime subscription
      const channel = supabase
        .channel("public:preguntas")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "preguntas" },
          (payload) => {
            setPreguntas((current) => [payload.new, ...current]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  const [form, setForm] = useState({ nombre: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      alert("Por favor ingresa tu nombre de moderador.");
      return;
    }
    if (form.password === "IMEESDN2026" || form.password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const [filtroSesion, setFiltroSesion] = useState("Conferencia Magistral");

  const preguntasFiltradas = preguntas.filter(q => q.sesion === filtroSesion);

  const analizarConIA = async () => {
    if (preguntasFiltradas.length === 0) {
      alert("No hay preguntas en esta sesión para analizar");
      return;
    }

    setAnalyzing(true);
    
    try {
      const response = await fetch("/api/moderar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: preguntasFiltradas })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setAiAnalysis(data.analysis);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error: any) {
      console.error("Error de IA:", error);
      alert("Hubo un error al conectar con la Inteligencia Artificial: " + error.message);
    }
    
    setAnalyzing(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("preguntas").update({ 
      estado: "leída"
    }).eq("id", id);
    if (!error) {
      setPreguntas(prev => prev.map(p => p.id === id ? { ...p, estado: "leída" } : p));
    }
  };

  const deletePregunta = async (id: string) => {
    if (window.confirm("¿Seguro que deseas borrar esta pregunta de prueba permanentemente?")) {
      const { error } = await supabase.from("preguntas").delete().eq("id", id);
      if (!error) {
        setPreguntas(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Hubo un error borrando la pregunta: " + error.message);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border-t-4 border-imeesdm-gold animate-in fade-in zoom-in-95">
          <h2 className="text-2xl font-bold text-imeesdm-dark mb-2 text-center">Acceso Moderadores</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Identifícate y selecciona tu sesión para ingresar directamente.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
              <input 
                type="text" 
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold text-gray-800"
                placeholder="Ej. Dr. García"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña del Evento</label>
              <input 
                type="password" 
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-imeesdm-gold text-gray-800"
                placeholder="Ingresa clave"
              />
            </div>
            
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest text-center">Selecciona tu Sesión:</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'Conferencia Magistral', label: 'Conferencia Magistral', icon: '🎤' },
                  { id: 'Mesa 1', label: 'Mesa 1', icon: '👥' },
                  { id: 'Mesa 2', label: 'Mesa 2', icon: '👥' }
                ].map((s) => (
                  <button 
                    key={s.id}
                    type="button" 
                    onClick={() => {
                      setFiltroSesion(s.id);
                      // Disparar submit manualmente o esperar a que el usuario lo vea
                    }}
                    className={`flex items-center justify-between px-4 py-3 border-2 rounded-lg transition-all ${
                      filtroSesion === s.id 
                        ? 'border-imeesdm-dark bg-imeesdm-dark text-white shadow-md' 
                        : 'border-gray-100 hover:border-imeesdm-gold hover:bg-amber-50 text-gray-700'
                    }`}
                  >
                    <span className="font-bold text-sm tracking-tight">{s.label}</span>
                    <span>{s.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 bg-imeesdm-gold text-imeesdm-dark font-black py-3 rounded-lg hover:brightness-110 transition-all shadow-lg uppercase tracking-widest text-sm"
            >
              Entrar a la Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-imeesdm-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-imeesdm-dark">Panel de Moderación en Vivo</h2>
          <p className="text-gray-500 text-sm mt-1">
            Moderando como: <span className="font-bold text-imeesdm-gold">{form.nombre}</span>
          </p>
        </div>
        
        <div className="flex gap-3 items-center">
          <select 
            value={filtroSesion}
            onChange={(e) => setFiltroSesion(e.target.value)}
            className="border-2 border-indigo-200 rounded-md px-3 py-2 text-indigo-800 font-bold bg-indigo-50"
          >
            <option value="Conferencia Magistral">Viendo: Conferencia Magistral</option>
            <option value="Mesa 1">Viendo: Mesa 1</option>
            <option value="Mesa 2">Viendo: Mesa 2</option>
          </select>

          <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex flex-col items-center justify-center">
            <span className="text-xs uppercase font-bold">Inbox ({filtroSesion})</span>
            <span className="text-xl font-black">{preguntasFiltradas.length}</span>
          </div>
          <button 
            onClick={analizarConIA}
            disabled={analyzing || preguntasFiltradas.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-md hover:shadow-lg transition-all flex flex-col items-center justify-center disabled:opacity-50"
          >
             <span className="font-bold flex items-center gap-1">
               {analyzing ? "🧠 Procesando..." : "🧠 Agrupar Sesión Actual"}
             </span>
             <span className="text-[10px] opacity-80 uppercase">Solo para {filtroSesion}</span>
          </button>
        </div>
      </div>

      {aiAnalysis && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-100 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4 border-b border-indigo-100 pb-2">
            <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2">
              🧠 Síntesis de Inteligencia Artificial ({filtroSesion})
            </h3>
            <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {aiAnalysis.descartadas} preguntas descartadas
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiAnalysis.clusters?.map((cluster: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{cluster.tema}</h4>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                    {cluster.cantidad} personas
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic">"{cluster.pregunta_sintetizada}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 uppercase text-xs">Bandeja de Entrada: {filtroSesion}</h3>
        </div>
        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {preguntasFiltradas.length === 0 ? (
            <li className="p-8 text-center text-gray-400">Aún no hay preguntas para esta sesión.</li>
          ) : (
            preguntasFiltradas.map((q) => (
              <li key={q.id} className={`p-4 transition-colors ${q.estado === 'leída' ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{q.autor}</span>
                      <span className="text-xs text-gray-400">{new Date(q.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-800">{q.pregunta}</p>
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <button 
                      onClick={() => deletePregunta(q.id)}
                      className="text-xs text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full font-medium hover:bg-red-100 transition-colors"
                      title="Borrar de la base de datos"
                    >
                      🗑️ Borrar
                    </button>
                    {q.estado !== 'leída' ? (
                      <button 
                        onClick={() => markAsRead(q.id)}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium hover:bg-green-200 transition-colors"
                      >
                        ✓ Leída
                      </button>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-medium text-center">Leída</span>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
