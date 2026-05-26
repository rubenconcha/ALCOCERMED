-- ============================================================
-- AVATARES: columnas, RLS y vista segura para rankings
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================================

DO $$
BEGIN
  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar text;
    ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS full_name text;
    ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS email text;
    ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_seen timestamptz;
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Avatar user_profiles read own" ON public.user_profiles;
    CREATE POLICY "Avatar user_profiles read own"
      ON public.user_profiles FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Avatar user_profiles insert own" ON public.user_profiles;
    CREATE POLICY "Avatar user_profiles insert own"
      ON public.user_profiles FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Avatar user_profiles update own" ON public.user_profiles;
    CREATE POLICY "Avatar user_profiles update own"
      ON public.user_profiles FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar text;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz;
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Avatar profiles read own" ON public.profiles;
    CREATE POLICY "Avatar profiles read own"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Avatar profiles insert own" ON public.profiles;
    CREATE POLICY "Avatar profiles insert own"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS "Avatar profiles update own" ON public.profiles;
    CREATE POLICY "Avatar profiles update own"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Vista de solo lectura para mostrar avatares/nombres en rankings.
-- Expone solo datos publicos de perfil, no emails.
DROP VIEW IF EXISTS public.avatar_profiles;

DO $$
DECLARE
  has_user_profiles boolean := to_regclass('public.user_profiles') IS NOT NULL;
  has_profiles boolean := to_regclass('public.profiles') IS NOT NULL;
BEGIN
  IF has_user_profiles AND has_profiles THEN
    EXECUTE $view$
      CREATE VIEW public.avatar_profiles AS
      SELECT user_id, full_name, avatar
      FROM public.user_profiles
      UNION ALL
      SELECT p.id AS user_id, p.full_name, p.avatar
      FROM public.profiles p
      WHERE NOT EXISTS (
        SELECT 1 FROM public.user_profiles up WHERE up.user_id = p.id
      )
    $view$;
  ELSIF has_user_profiles THEN
    EXECUTE $view$
      CREATE VIEW public.avatar_profiles AS
      SELECT user_id, full_name, avatar
      FROM public.user_profiles
    $view$;
  ELSIF has_profiles THEN
    EXECUTE $view$
      CREATE VIEW public.avatar_profiles AS
      SELECT id AS user_id, full_name, avatar
      FROM public.profiles
    $view$;
  ELSE
    RAISE NOTICE 'No existe public.user_profiles ni public.profiles. Crea una de esas tablas para persistir avatares.';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.avatar_profiles') IS NOT NULL THEN
    GRANT SELECT ON public.avatar_profiles TO authenticated;
  END IF;
END $$;
