-- ============================================
-- EJECUTAR EN EL SQL EDITOR DE SUPABASE
-- Ajustes solicitados para el registro v2
-- ============================================

-- 1. Agregar campo de tipo de institución (pública/privada)
ALTER TABLE asistentes ADD COLUMN IF NOT EXISTS tipo_institucion TEXT DEFAULT NULL;

-- Listo. El campo "nombre" se sigue usando tal cual (el formulario ahora envía
-- "Apellido Paterno Apellido Materno, Nombre(s)" en automático).
