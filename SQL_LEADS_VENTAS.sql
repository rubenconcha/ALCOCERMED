-- ═══════════════════════════════════════════════════════
-- SQL PARA TABLA DE LEADS — PÁGINA DE VENTAS
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Crear tabla de leads
CREATE TABLE IF NOT EXISTS leads_ventas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT NOT NULL,
    plan TEXT DEFAULT 'general',
    estado TEXT DEFAULT 'nuevo',
    fecha TIMESTAMPTZ DEFAULT now(),
    notas TEXT
);

-- 2. Habilitar RLS
ALTER TABLE leads_ventas ENABLE ROW LEVEL SECURITY;

-- 3. Política INSERT: cualquier visitante anónimo puede insertar un lead
CREATE POLICY "Cualquiera puede insertar leads"
    ON leads_ventas
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 4. Política SELECT: solo admins autenticados pueden ver los leads
CREATE POLICY "Solo admins leen leads"
    ON leads_ventas
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_leads_fecha ON leads_ventas (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads_ventas (estado);
CREATE INDEX IF NOT EXISTS idx_leads_plan ON leads_ventas (plan);
