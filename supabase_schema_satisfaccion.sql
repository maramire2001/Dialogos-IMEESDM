-- EJECUTAR EN EL SQL EDITOR DE SUPABASE
CREATE TABLE satisfaccion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    p1 INTEGER NOT NULL, -- Relevancia de los temas
    p2 INTEGER NOT NULL, -- Calidad de los ponentes
    p3 INTEGER NOT NULL, -- Organización del evento
    p4 INTEGER NOT NULL, -- Plataforma digital
    p5 INTEGER NOT NULL, -- Recomendación
    p6 TEXT,             -- Sugerencias adicionales (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE satisfaccion ENABLE ROW LEVEL SECURITY;

-- Permitir inserción anónima
CREATE POLICY "Permitir insercion de encuestas" 
ON satisfaccion FOR INSERT 
TO anon 
WITH CHECK (true);

-- Permitir lectura al admin
CREATE POLICY "Permitir lectura de encuestas" 
ON satisfaccion FOR SELECT 
TO anon 
USING (true);
