-- EJECUTA ESTO EN EL EDITOR SQL DE SUPABASE
-- Crea la tabla para almacenar las preguntas del público
CREATE TABLE preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor TEXT DEFAULT 'Anónimo',
    pregunta TEXT NOT NULL,
    tema_ia TEXT,
    estado TEXT DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar la seguridad RLS
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;

-- Permitir que el público envíe preguntas (INSERT)
CREATE POLICY "Permitir insercion de preguntas publicas" 
ON preguntas FOR INSERT 
TO anon 
WITH CHECK (true);

-- Permitir que el panel lea las preguntas (SELECT)
CREATE POLICY "Permitir lectura de preguntas" 
ON preguntas FOR SELECT 
TO anon 
USING (true);

-- Permitir que el panel y la IA actualicen/borren preguntas (UPDATE/DELETE)
CREATE POLICY "Permitir modificacion de preguntas" 
ON preguntas FOR UPDATE 
TO anon 
USING (true);

CREATE POLICY "Permitir borrado de preguntas" 
ON preguntas FOR DELETE 
TO anon 
USING (true);
