-- ═══ AGREGAR COLUMNA modo_sesion A LA TABLA evaluaciones ═══
-- Ejecutar en Supabase SQL Editor antes de usar Modo Test o Modo Equipo

ALTER TABLE evaluaciones
ADD COLUMN IF NOT EXISTS modo_sesion TEXT DEFAULT 'clasico';

-- Comentario para referencia
COMMENT ON COLUMN evaluaciones.modo_sesion IS 'Modo de sesión: clasico, test, equipo';

-- ═══ AGREGAR COLUMNA equipo A LA TABLA evaluacion_participantes ═══
-- Para soportar Modo Equipo

ALTER TABLE evaluacion_participantes
ADD COLUMN IF NOT EXISTS equipo TEXT DEFAULT NULL;

COMMENT ON COLUMN evaluacion_participantes.equipo IS 'Nombre del equipo asignado al participante (solo modo equipo)';
