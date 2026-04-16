-- Ejecuta este código en el editor SQL de tu panel de Supabase:
-- URL: https://supabase.com/dashboard/project/_/sql

CREATE TABLE asistentes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Campos Comunes
  nombre TEXT NOT NULL,
  grado_academico TEXT NOT NULL,
  tipo_asistente TEXT NOT NULL,
  institucion TEXT NOT NULL,
  correo TEXT NOT NULL,
  modalidad TEXT NOT NULL,
  verificado BOOLEAN DEFAULT FALSE,
  
  -- Campos Condicionales
  carrera TEXT,
  semestre TEXT,
  fuerza_armada TEXT,
  grado_militar TEXT,
  plantel TEXT,
  especialidad_militar TEXT,
  area_conocimiento TEXT,
  linea_investigacion TEXT,
  nivel_sni TEXT
);

-- Habilitar Seguridad a Nivel de Fila (RLS) para permitir INSERTS anónimos seguros
ALTER TABLE asistentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserciones anónimas" 
ON asistentes FOR INSERT 
TO anon 
WITH CHECK (true);

-- (Opcional) Si quieres ver los datos en la tabla (como superadministrador desde el panel):
CREATE POLICY "Permitir lecturas públicas (solo tests, cambiar en prod)" 
ON asistentes FOR SELECT 
TO anon 
USING (true);
