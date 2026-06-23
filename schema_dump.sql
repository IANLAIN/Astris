<USER_REQUEST>
pues mira la basse de datos que podemos hacer -- ====================================================================================
-- ICLUSION · ESQUEMA DEFINITIVO COMPLETO
-- (BASE + MÓDULO DE ADMINISTRADOR + PERFIL "AdminAstris")
-- ====================================================================================
--
-- ANTES DE CORRER ESTE ARCHIVO:
-- 1) Ve a tu proyecto Supabase → Authentication → Users → Add user
--    Email:    johansttivelinaresb@gmail.com
--    Password: Astris2026
--    Marca "Auto Confirm User"
-- 2) Luego pega y corre TODO este archivo de una sola vez en el SQL Editor.
--
-- Si te saltas el paso 1, el script se detiene solo en la Sección 10 con un
-- mensaje de error claro indicándote que falta crear el usuario primero.
-- ====================================================================================


-- ====================================================================================
-- 0. LIMPIEZA DEL ESQUEMA ANTERIOR (DROP)
-- ====================================================================================
-- Esto elimina las tablas, vistas y tipos antiguos para evitar el error
-- "relation already exists". CUIDADO: borra los datos de prueba que tengas.
-- NO borra auth.users (eso lo gestiona Supabase Auth, no este script).

DROP VIEW IF EXISTS public.admin_checkins_overview CASCADE;
DROP VIEW IF EXISTS public.admin_accompaniments_overview CASCADE;
DROP VIEW IF EXISTS public.admin_companies_overview CASCADE;
DROP VIEW IF EXISTS public.admin_candidates_overview CASCADE;
DROP VIEW IF EXISTS public.admin_candidates_by_neurotype CASCADE;
DROP VIEW IF EXISTS public.admin_signups_by_month CASCADE;
DROP VIEW IF EXISTS public.admin_stats_overview CASCADE;
DROP TABLE IF EXISTS public.admin_logs CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

DROP TABLE IF EXISTS public.checkins CASCADE;
DROP TABLE IF EXISTS public.accompaniments CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE I
<truncated 21039 bytes>
existe, se detiene con un error claro en vez
-- de fallar en silencio.

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'johansttivelinaresb@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No existe ningún usuario en auth.users con ese correo. Ve a Authentication > Users y créalo primero (email: johansttivelinaresb@gmail.com, password: Astris2026).';
  END IF;

  INSERT INTO public.users_profiles (id, role, email, full_name, completed_onboarding)
  VALUES (v_user_id, 'admin', 'johansttivelinaresb@gmail.com', 'AdminAstris', true)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      full_name = 'AdminAstris',
      email = 'johansttivelinaresb@gmail.com',
      completed_onboarding = true;
END $$;

-- Verificación final: confirma que el perfil quedó creado y con rol admin
SELECT id, role, email, full_name, completed_onboarding, created_at
FROM public.users_profiles
WHERE email = 'johansttivelinaresb@gmail.com';

-- ====================================================================================
-- FIN DEL SCRIPT
-- ====================================================================================
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-06-20T19:48:41-05:00.

The user's current state is as follows:
Active Document: c:\Users\Sttive\.gemini\antigravity-ide\scratch\Astris\src\app\App.tsx (LANGUAGE_TSX)
Cursor is on line: 3053
Other open documents:
- c:\Users\Sttive\.gemini\antigravity-ide\scratch\Astris\src\app\App.tsx (LANGUAGE_TSX)
- c:\Users\Sttive\.gemini\antigravity-ide\scratch\Astris\src\lib\supabase.ts (LANGUAGE_TYPESCRIPT)
- c:\Users\Sttive\.gemini\antigravity-ide\scratch\Astris\src\app\components\admin\AdminPanel.tsx (LANGUAGE_TSX)
- c:\Users\Sttive\.gemini\antigravity-ide\scratch\Astris\guidelines\Guidelines.md (LANGUAGE_MARKDOWN)
Running terminal commands:
- npm run dev (in c:\Users\Sttive\.gemini\antigravity-ide\scratch\Astris, running for 29m36s)
</ADDITIONAL_METADATA>