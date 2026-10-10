-- Permite leer las preguntas de la partida demo publicada desde una cuenta gratuita.
-- Conserva las dos evaluaciones de clase que ya tenían permiso especial.
CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT public.campus_has_access()
    OR p_id IN (
      '7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'::uuid,
      '2fa17a3c-035a-50d7-afae-ed8fe3ba11fc'::uuid,
      'be379789-f013-4431-bb31-95b1c6f01517'::uuid
    );
$function$;

NOTIFY pgrst, 'reload schema';
