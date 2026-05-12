-- ============================================================
-- RLS ADMIN BYPASS — Permitir que el panel de control
-- lea TODOS los registros de estudiantes sin importar user_id
-- ============================================================
-- Ejecutar en SQL Editor de Supabase (Dashboard > SQL Editor)

-- 1. Habilitar RLS en las tablas de progreso (si no está ya)
ALTER TABLE resultados_simulacros ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_banco ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_videoclases ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- 2. Política: usuarios autenticados leen solo sus propios registros
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resultados_simulacros' AND policyname = 'Users can read own simulacros') THEN
    CREATE POLICY "Users can read own simulacros" ON resultados_simulacros FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resultados_banco' AND policyname = 'Users can read own banco') THEN
    CREATE POLICY "Users can read own banco" ON resultados_banco FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_videoclases' AND policyname = 'Users can read own videos') THEN
    CREATE POLICY "Users can read own videos" ON progreso_videoclases FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_flashcards' AND policyname = 'Users can read own flashcards') THEN
    CREATE POLICY "Users can read own flashcards" ON progreso_flashcards FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_devices' AND policyname = 'Users can read own devices') THEN
    CREATE POLICY "Users can read own devices" ON user_devices FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Política: INSERT para que estudiantes guarden su progreso
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resultados_simulacros' AND policyname = 'Users can insert own simulacros') THEN
    CREATE POLICY "Users can insert own simulacros" ON resultados_simulacros FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resultados_banco' AND policyname = 'Users can insert own banco') THEN
    CREATE POLICY "Users can insert own banco" ON resultados_banco FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_videoclases' AND policyname = 'Users can insert own videos') THEN
    CREATE POLICY "Users can insert own videos" ON progreso_videoclases FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_flashcards' AND policyname = 'Users can insert own flashcards') THEN
    CREATE POLICY "Users can insert own flashcards" ON progreso_flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_devices' AND policyname = 'Users can insert own devices') THEN
    CREATE POLICY "Users can insert own devices" ON user_devices FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Políticas UPSERT (necesarias para videoclases y flashcards que usan upsert)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_videoclases' AND policyname = 'Users can update own videos') THEN
    CREATE POLICY "Users can update own videos" ON progreso_videoclases FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_flashcards' AND policyname = 'Users can update own flashcards') THEN
    CREATE POLICY "Users can update own flashcards" ON progreso_flashcards FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_devices' AND policyname = 'Users can update own devices') THEN
    CREATE POLICY "Users can update own devices" ON user_devices FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 5. ⭐ BYPASS PARA ADMIN — Los admins pueden leer TODOS los registros
-- Reemplazá los emails por los reales de tus administradores
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resultados_simulacros' AND policyname = 'Admins can read all simulacros') THEN
    CREATE POLICY "Admins can read all simulacros" ON resultados_simulacros FOR SELECT
      USING (
        auth.uid() IN (
          SELECT id FROM auth.users
          WHERE email IN (
            'admin@alcocermed.com',
            'admin@bencarson.com',
            'rubenconcha@example.com',
            'pichon4488@gmail.com'
          )
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resultados_banco' AND policyname = 'Admins can read all banco') THEN
    CREATE POLICY "Admins can read all banco" ON resultados_banco FOR SELECT
      USING (
        auth.uid() IN (
          SELECT id FROM auth.users
          WHERE email IN (
            'admin@alcocermed.com',
            'admin@bencarson.com',
            'rubenconcha@example.com',
            'pichon4488@gmail.com'
          )
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_videoclases' AND policyname = 'Admins can read all videos') THEN
    CREATE POLICY "Admins can read all videos" ON progreso_videoclases FOR SELECT
      USING (
        auth.uid() IN (
          SELECT id FROM auth.users
          WHERE email IN (
            'admin@alcocermed.com',
            'admin@bencarson.com',
            'rubenconcha@example.com',
            'pichon4488@gmail.com'
          )
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'progreso_flashcards' AND policyname = 'Admins can read all flashcards') THEN
    CREATE POLICY "Admins can read all flashcards" ON progreso_flashcards FOR SELECT
      USING (
        auth.uid() IN (
          SELECT id FROM auth.users
          WHERE email IN (
            'admin@alcocermed.com',
            'admin@bencarson.com',
            'rubenconcha@example.com',
            'pichon4488@gmail.com'
          )
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_devices' AND policyname = 'Admins can read all devices') THEN
    CREATE POLICY "Admins can read all devices" ON user_devices FOR SELECT
      USING (
        auth.uid() IN (
          SELECT id FROM auth.users
          WHERE email IN (
            'admin@alcocermed.com',
            'admin@bencarson.com',
            'rubenconcha@example.com',
            'pichon4488@gmail.com'
          )
        )
      );
  END IF;
END $$;
