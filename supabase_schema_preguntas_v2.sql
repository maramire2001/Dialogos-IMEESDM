-- EJECUTAR EN EL SQL EDITOR DE SUPABASE
-- 1. Agregar nuevas columnas a la tabla preguntas
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS nombre TEXT;
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS apellido_paterno TEXT;
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS apellido_materno TEXT;
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS institucion TEXT;

-- 2. (Opcional) Si quieres que sean obligatorios en la BD después de limpiar datos viejos:
-- ALTER TABLE preguntas ALTER COLUMN nombre SET NOT NULL;
-- ...etc...
