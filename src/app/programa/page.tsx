"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProgramaPage() {
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    setLoading(true);
    // List files in the 'cvs' folder of the 'event_assets' bucket
    const { data, error } = await supabase.storage.from('event_assets').list('cvs', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error("Error fetching CVs:", error);
    } else if (data) {
      // Filter out the empty placeholder if it exists, and get public URLs
      const validFiles = data
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const { data: linkData } = supabase.storage.from('event_assets').getPublicUrl(`cvs/${file.name}`);
          return {
            name: file.name,
            url: linkData.publicUrl,
            created_at: file.created_at
          };
        });
      setCvs(validFiles);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-imeesdm-dark">Programa Oficial</h1>
        <p className="text-lg text-gray-600">
          Descubre a nuestros ponentes y consulta el material del evento.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-imeesdm-dark text-white border-b-4 border-imeesdm-gold">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📄</span> Semblanzas y Currículums
          </h2>
          <p className="text-imeesdm-light text-sm mt-1">Conoce la trayectoria de nuestros invitados.</p>
        </div>
        
        <div className="p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-imeesdm-dark"></div>
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">Aún no se han cargado documentos.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cvs.map((file, index) => (
                <li key={index} className="bg-white border text-left border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"></path>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.3 2.3 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"></path>
                      </svg>
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-gray-800 truncate">Documento PDF</p>
                      <p className="text-xs text-gray-500">Publicado: {new Date(file.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Abrir
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
