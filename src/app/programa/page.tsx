"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProgramaPage() {
  const [cvs, setCvs] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // FETCH CVS
    const res = await fetch('/api/cvs');
    if (res.ok) {
      const data = await res.json();
      setCvs(data);
    } else {
      setError('Error al cargar los currículums.');
    }

    // FETCH PHOTOS
    const { data: photoData, error: photoError } = await supabase.storage.from('event_assets').list('galeria', {
      limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' },
    });

    if (photoError) {
      console.error('Error fetching photos:', photoError);
    } else if (photoData) {
      const validPhotos = photoData.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => {
        const { data: linkData } = supabase.storage.from('event_assets').getPublicUrl(`galeria/${f.name}`);
        return { name: f.name, url: linkData.publicUrl, created_at: f.created_at };
      });
      setPhotos(validPhotos);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in py-8">
      <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-imeesdm-dark transition-colors font-medium">
        ← Volver al inicio
      </a>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-imeesdm-dark">Portal Oficial del Evento</h1>
        <p className="text-lg text-gray-600">
          Descubre a nuestros ponentes, consulta material y visualiza la galería.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-imeesdm-dark text-white border-b-4 border-imeesdm-gold">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📄</span> Currículums de los Ponentes
          </h2>
          <p className="text-imeesdm-light text-sm mt-1">Conoce la trayectoria profesional de nuestros invitados.</p>
        </div>
        <div className="p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-imeesdm-dark"></div></div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 font-medium text-sm">{error}</p>
              <button onClick={fetchData} className="mt-3 text-sm text-imeesdm-dark underline hover:no-underline">Reintentar</button>
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Aún no se han cargado documentos.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cvs.map((file, index) => (
                <li key={index} className="bg-white border text-left border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                      <span className="text-2xl block drop-shadow-sm">📄</span>
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                    </div>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-2 rounded-lg text-sm transition-colors">
                    Abrir
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8">
        <div className="p-6 bg-indigo-600 text-white border-b-4 border-indigo-300">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📸</span> Galería del Evento
          </h2>
          <p className="text-indigo-100 text-sm mt-1">Memorias visuales de los Diálogos en el Instituto.</p>
        </div>
        <div className="p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Aún no hay fotos en la galería.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <a key={index} href={photo.url} target="_blank" rel="noopener noreferrer" className="block group relative rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all aspect-video bg-gray-200">
                  <img src={photo.url} alt="Foto del evento" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Ver completa</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
