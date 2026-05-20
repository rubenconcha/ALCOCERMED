-- ═══ AGREGAR COLUMNA MODO_SESION A LA TABLA EVALUACIONES ═══
-- Esto soluciona el "Error al publicar" y permite habilitar los otros modos (Test, Equipo, etc.)
-- Ejecutar en: Supabase Dashboard > SQL Editor

ALTER TABLE evaluaciones 
ADD COLUMN IF NOT EXISTS modo_sesion VARCHAR(50) DEFAULT 'clasico';

-- Verificar que se aplicó:
SELECT id, titulo, modo_sesion 
FROM evaluaciones 
LIMIT 5;
