-- ====================================================================================
-- ASTRIS / INCLUSION LABORAL
-- ESQUEMA COMPLETO Y CORREGIDO PARA SUPABASE (PostgreSQL 15+)
-- ====================================================================================

-- ====================================================================================
-- 0. LIMPIEZA
-- ====================================================================================

DROP VIEW IF EXISTS public.admin_hiring_funnel CASCADE;
DROP VIEW IF EXISTS public.admin_top_mentors CASCADE;
DROP VIEW IF EXISTS public.admin_top_companies CASCADE;
DROP VIEW IF EXISTS public.admin_checkins_overview CASCADE;
DROP VIEW IF EXISTS public.admin_accompaniments_overview CASCADE;
DROP VIEW IF EXISTS public.admin_companies_overview CASCADE;
DROP VIEW IF EXISTS public.admin_candidates_overview CASCADE;
DROP VIEW IF EXISTS public.admin_candidates_by_neurotype CASCADE;
DROP VIEW IF EXISTS public.admin_signups_by_month CASCADE;
DROP VIEW IF EXISTS public.admin_stats_overview CASCADE;

-- Solo borramos manualmente este trigger porque la tabla auth.users NO se va a destruir.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.provision_admin(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.prevent_unauthorized_role_changes() CASCADE;
DROP FUNCTION IF EXISTS public.company_has_application_for_candidate(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.log_admin_action_trigger() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_set_timestamp() CASCADE;

DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversation_participants CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.candidate_certifications CASCADE;
DROP TABLE IF EXISTS public.candidate_education CASCADE;
DROP TABLE IF EXISTS public.candidate_experience CASCADE;
DROP TABLE IF EXISTS public.job_skills CASCADE;
DROP TABLE IF EXISTS public.candidate_skills CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.saved_jobs CASCADE;
DROP TABLE IF EXISTS public.admin_logs CASCADE;
DROP TABLE IF EXISTS public.checkins CASCADE;
DROP TABLE IF EXISTS public.accompaniments CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.mentors CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.candidates CASCADE;
DROP TABLE IF EXISTS public.users_profiles CASCADE;

DROP TYPE IF EXISTS app_role CASCADE;
DROP TYPE IF EXISTS work_modality CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS accompaniment_status CASCADE;
DROP TYPE IF EXISTS conversation_status CASCADE;

-- ====================================================================================
-- 1. EXTENSIONES Y ENUMS
-- ====================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE app_role AS ENUM ('candidate', 'company', 'mentor', 'admin');
CREATE TYPE work_modality AS ENUM ('remote', 'hybrid', 'in-person');
CREATE TYPE job_status AS ENUM ('draft', 'open', 'closed', 'filled');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'interviewing', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE accompaniment_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE conversation_status AS ENUM ('active', 'archived');

-- ====================================================================================
-- 2. TABLAS (Deben crearse ANTES que las funciones)
-- ====================================================================================

CREATE TABLE public.users_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    completed_onboarding BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.candidates (
    user_id UUID PRIMARY KEY REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    quiz_answers JSONB,
    neurotype TEXT,
    work_preference TEXT,
    ideal_environment TEXT,
    interests TEXT[] DEFAULT '{}',
    accessibility_theme TEXT,
    accessibility_font TEXT,
    adjustments_needed TEXT[] DEFAULT '{}',
    match_visibility BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.companies (
    user_id UUID PRIMARY KEY REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    logo_url TEXT,
    philosophy TEXT,
    work_environment TEXT,
    accommodations TEXT[] DEFAULT '{}',
    company_size TEXT,
    country TEXT,
    city TEXT,
    esg_retention_rate NUMERIC(5,2) CHECK (esg_retention_rate >= 0 AND esg_retention_rate <= 100),
    esg_wellness_index NUMERIC(5,2) CHECK (esg_wellness_index >= 0 AND esg_wellness_index <= 100),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.mentors (
    user_id UUID PRIMARY KEY REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    expertise TEXT[] DEFAULT '{}',
    availability_status TEXT DEFAULT 'available',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    work_modality work_modality NOT NULL,
    location_text TEXT,
    contract_type TEXT,
    salary_min NUMERIC(12,2),
    salary_max NUMERIC(12,2),
    salary_currency TEXT DEFAULT 'USD',
    required_skills TEXT[] DEFAULT '{}',
    offered_accommodations TEXT[] DEFAULT '{}',
    status job_status DEFAULT 'open',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (salary_min IS NULL OR salary_min >= 0),
    CHECK (salary_max IS NULL OR salary_max >= 0),
    CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_max >= salary_min)
);

CREATE TABLE public.candidate_skills (
    candidate_id UUID NOT NULL REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    level TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE public.job_skills (
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_level TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (job_id, skill_id)
);

CREATE TABLE public.candidate_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.candidate_education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.candidate_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    certification_name TEXT NOT NULL,
    issuer TEXT,
    issue_date DATE,
    expiration_date DATE,
    credential_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.saved_jobs (
    candidate_id UUID NOT NULL REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (candidate_id, job_id)
);

CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(user_id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    match_details JSONB,
    match_version TEXT,
    ai_explanation TEXT,
    generated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, candidate_id)
);

CREATE TABLE public.accompaniments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.mentors(user_id) ON DELETE CASCADE,
    status accompaniment_status DEFAULT 'active',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (application_id)
);

CREATE TABLE public.checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accompaniment_id UUID NOT NULL REFERENCES public.accompaniments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    adaptation_status TEXT,
    scheduled_for TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    is_public BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    subject TEXT,
    status conversation_status DEFAULT 'active',
    last_message_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    participant_role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================================
-- 3. FUNCIONES AUXILIARES
-- ====================================================================================

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'admin'
      AND up.deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.company_has_application_for_candidate(p_candidate_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = p_candidate_id
      AND a.deleted_at IS NULL
      AND j.deleted_at IS NULL
      AND j.company_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.bypass_role_protection', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role NOT IN ('candidate', 'company', 'mentor', 'admin') THEN
      RAISE EXCEPTION 'Rol inválido.';
    END IF;

    IF NEW.role = 'admin' THEN
      RAISE EXCEPTION 'Solo un proceso protegido puede crear administradores.';
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.role <> OLD.role AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'No puedes cambiar tu rol desde tu propio perfil.';
    END IF;

    IF NEW.role = 'admin' AND OLD.role <> 'admin' AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Solo un administrador puede promover usuarios a admin.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_logs (
    admin_id,
    action,
    target_table,
    target_id,
    details
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE
      WHEN TG_OP = 'DELETE' THEN jsonb_build_object('old', to_jsonb(OLD))
      WHEN TG_OP = 'INSERT' THEN jsonb_build_object('new', to_jsonb(NEW))
      ELSE jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    END
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := lower(COALESCE(NEW.raw_user_meta_data->>'role', 'candidate'));

  IF v_role NOT IN ('candidate', 'company', 'mentor') THEN
    v_role := 'candidate';
  END IF;

  INSERT INTO public.users_profiles (
    id,
    role,
    email,
    full_name,
    completed_onboarding
  )
  VALUES (
    NEW.id,
    v_role::app_role,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.provision_admin(
  p_email TEXT,
  p_full_name TEXT DEFAULT 'AdminAstris'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  PERFORM set_config('app.bypass_role_protection', 'on', true);

  SELECT id
  INTO v_user_id
  FROM auth.users
  WHERE email = p_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No existe ningún usuario en auth.users con ese correo. Créalo primero en Authentication > Users.';
  END IF;

  INSERT INTO public.users_profiles (
    id,
    role,
    email,
    full_name,
    completed_onboarding
  )
  VALUES (
    v_user_id,
    'admin',
    p_email,
    p_full_name,
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      email = p_email,
      full_name = p_full_name,
      completed_onboarding = true,
      deleted_at = NULL;

  RETURN v_user_id;
END;
$$;

-- ====================================================================================
-- 4. TRIGGERS
-- ====================================================================================

CREATE TRIGGER set_timestamp_users_profiles
BEFORE UPDATE ON public.users_profiles
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_candidates
BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_companies
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_mentors
BEFORE UPDATE ON public.mentors
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_candidate_experience
BEFORE UPDATE ON public.candidate_experience
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_candidate_education
BEFORE UPDATE ON public.candidate_education
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_candidate_certifications
BEFORE UPDATE ON public.candidate_certifications
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_jobs
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_applications
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_accompaniments
BEFORE UPDATE ON public.accompaniments
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_checkins
BEFORE UPDATE ON public.checkins
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_documents
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_conversations
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_messages
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER protect_profile_roles
BEFORE INSERT OR UPDATE ON public.users_profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_unauthorized_role_changes();

CREATE TRIGGER log_jobs_changes
AFTER INSERT OR UPDATE OR DELETE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action_trigger();

CREATE TRIGGER log_applications_changes
AFTER INSERT OR UPDATE OR DELETE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action_trigger();

CREATE TRIGGER log_accompaniments_changes
AFTER INSERT OR UPDATE OR DELETE ON public.accompaniments
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action_trigger();

CREATE TRIGGER log_checkins_changes
AFTER INSERT OR UPDATE OR DELETE ON public.checkins
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action_trigger();

CREATE TRIGGER log_messages_changes
AFTER INSERT OR UPDATE OR DELETE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action_trigger();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================================
-- 5. ÍNDICES
-- ====================================================================================

CREATE INDEX idx_users_profiles_role ON public.users_profiles(role);
CREATE INDEX idx_users_profiles_deleted_at ON public.users_profiles(deleted_at);

CREATE INDEX idx_candidates_neurotype ON public.candidates(neurotype);
CREATE INDEX idx_candidates_deleted_at ON public.candidates(deleted_at);

CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_companies_deleted_at ON public.companies(deleted_at);

CREATE INDEX idx_mentors_deleted_at ON public.mentors(deleted_at);

CREATE INDEX idx_skills_name ON public.skills(name);

CREATE INDEX idx_candidate_experience_candidate_id ON public.candidate_experience(candidate_id);
CREATE INDEX idx_candidate_education_candidate_id ON public.candidate_education(candidate_id);
CREATE INDEX idx_candidate_certifications_candidate_id ON public.candidate_certifications(candidate_id);

CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at);

CREATE INDEX idx_job_skills_job_id ON public.job_skills(job_id);
CREATE INDEX idx_candidate_skills_candidate_id ON public.candidate_skills(candidate_id);

CREATE INDEX idx_saved_jobs_candidate_id ON public.saved_jobs(candidate_id);
CREATE INDEX idx_saved_jobs_job_id ON public.saved_jobs(job_id);

CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_applications_status ON public.applications(status);

CREATE INDEX idx_accompaniments_mentor_id ON public.accompaniments(mentor_id);
CREATE INDEX idx_accompaniments_application_id ON public.accompaniments(application_id);

CREATE INDEX idx_checkins_accompaniment_id ON public.checkins(accompaniment_id);
CREATE INDEX idx_checkins_author_id ON public.checkins(author_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);

CREATE INDEX idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);

CREATE INDEX idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX idx_admin_logs_target_table ON public.admin_logs(target_table);

-- ====================================================================================
-- 6. RLS
-- ====================================================================================

ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accompaniments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- ====================================================================================
-- 7. USERS PROFILES
-- ====================================================================================

CREATE POLICY "Users can read own profile"
ON public.users_profiles
FOR SELECT
USING (
  auth.uid() = id
  OR public.is_admin()
  OR (role = 'candidate' AND public.company_has_application_for_candidate(id))
);

CREATE POLICY "Users can insert own non-admin profile"
ON public.users_profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  AND role IN ('candidate', 'company', 'mentor')
);

CREATE POLICY "Users can update own profile"
ON public.users_profiles
FOR UPDATE
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- ====================================================================================
-- 8. CANDIDATES / COMPANIES / MENTORS
-- ====================================================================================

CREATE POLICY "Candidates can read own profile or companies with applications"
ON public.candidates
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.is_admin()
  OR public.company_has_application_for_candidate(user_id)
);

CREATE POLICY "Candidates manage own profile"
ON public.candidates
FOR ALL
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = user_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = candidates.user_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Companies can read public company profiles"
ON public.companies
FOR SELECT
USING (deleted_at IS NULL OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Companies manage own profile"
ON public.companies
FOR ALL
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = user_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = companies.user_id
      AND up.role = 'company'
  )
);

CREATE POLICY "Mentors can read own profile"
ON public.mentors
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Mentors manage own profile"
ON public.mentors
FOR ALL
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = user_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = mentors.user_id
      AND up.role = 'mentor'
  )
);

-- ====================================================================================
-- 9. SKILLS Y RELACIONES NORMALIZADAS
-- ====================================================================================

CREATE POLICY "Everyone can read skills"
ON public.skills
FOR SELECT
USING (TRUE);

CREATE POLICY "Admins manage skills"
ON public.skills
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Candidates manage own candidate_skills"
ON public.candidate_skills
FOR ALL
USING (auth.uid() = candidate_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = candidate_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = candidate_skills.candidate_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Companies can read candidate_skills for their applicants"
ON public.candidate_skills
FOR SELECT
USING (
  public.is_admin()
  OR public.company_has_application_for_candidate(candidate_id)
);

CREATE POLICY "Public can read job_skills for open jobs"
ON public.job_skills
FOR SELECT
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = job_skills.job_id
      AND j.deleted_at IS NULL
      AND (j.status = 'open' OR j.company_id = auth.uid())
  )
);

CREATE POLICY "Companies manage job_skills for own jobs"
ON public.job_skills
FOR ALL
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = job_skills.job_id
      AND j.company_id = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = job_skills.job_id
      AND j.company_id = auth.uid()
  )
);

-- ====================================================================================
-- 10. HISTORIAL DEL CANDIDATO
-- ====================================================================================

CREATE POLICY "Candidates manage own experience"
ON public.candidate_experience
FOR ALL
USING (auth.uid() = candidate_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = candidate_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = candidate_experience.candidate_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Companies can read candidate experience for their applicants"
ON public.candidate_experience
FOR SELECT
USING (public.is_admin() OR public.company_has_application_for_candidate(candidate_id));

CREATE POLICY "Candidates manage own education"
ON public.candidate_education
FOR ALL
USING (auth.uid() = candidate_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = candidate_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = candidate_education.candidate_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Companies can read candidate education for their applicants"
ON public.candidate_education
FOR SELECT
USING (public.is_admin() OR public.company_has_application_for_candidate(candidate_id));

CREATE POLICY "Candidates manage own certifications"
ON public.candidate_certifications
FOR ALL
USING (auth.uid() = candidate_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = candidate_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = candidate_certifications.candidate_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Companies can read candidate certifications for their applicants"
ON public.candidate_certifications
FOR SELECT
USING (public.is_admin() OR public.company_has_application_for_candidate(candidate_id));

-- ====================================================================================
-- 11. JOBS / SAVED JOBS / APPLICATIONS
-- ====================================================================================

CREATE POLICY "Public open jobs"
ON public.jobs
FOR SELECT
USING (
  public.is_admin()
  OR auth.uid() = company_id
  OR (status = 'open' AND deleted_at IS NULL)
);

CREATE POLICY "Companies and admins can create jobs"
ON public.jobs
FOR INSERT
WITH CHECK (
  (auth.uid() = company_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = jobs.company_id
      AND up.role = 'company'
  )
);

CREATE POLICY "Companies and admins can update own jobs"
ON public.jobs
FOR UPDATE
USING (auth.uid() = company_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = company_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = jobs.company_id
      AND up.role = 'company'
  )
);

CREATE POLICY "Companies and admins can delete own jobs"
ON public.jobs
FOR DELETE
USING (auth.uid() = company_id OR public.is_admin());

CREATE POLICY "Candidates manage own saved jobs"
ON public.saved_jobs
FOR ALL
USING (auth.uid() = candidate_id OR public.is_admin())
WITH CHECK (
  (auth.uid() = candidate_id OR public.is_admin())
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = saved_jobs.candidate_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Candidates can read own applications"
ON public.applications
FOR SELECT
USING (
  auth.uid() = candidate_id
  OR public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = applications.job_id
      AND j.company_id = auth.uid()
  )
);

CREATE POLICY "Candidates can apply to open jobs"
ON public.applications
FOR INSERT
WITH CHECK (
  auth.uid() = candidate_id
  AND EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = applications.job_id
      AND j.status = 'open'
      AND j.deleted_at IS NULL
  )
  AND EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = applications.candidate_id
      AND up.role = 'candidate'
  )
);

CREATE POLICY "Candidates can withdraw own applications"
ON public.applications
FOR UPDATE
USING (
  auth.uid() = candidate_id
  OR public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = applications.job_id
      AND j.company_id = auth.uid()
  )
)
WITH CHECK (
  (
    auth.uid() = candidate_id
    AND status = 'withdrawn'
  )
  OR public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = applications.job_id
      AND j.company_id = auth.uid()
  )
);

CREATE POLICY "Companies can see applications to their jobs"
ON public.applications
FOR SELECT
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = applications.job_id
      AND j.company_id = auth.uid()
  )
);

-- ====================================================================================
-- 12. ACOMPAÑAMIENTOS / CHECKINS
-- ====================================================================================

CREATE POLICY "Related users can read accompaniments"
ON public.accompaniments
FOR SELECT
USING (
  public.is_admin()
  OR auth.uid() = mentor_id
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = accompaniments.application_id
      AND a.candidate_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = accompaniments.application_id
      AND j.company_id = auth.uid()
  )
);

CREATE POLICY "Companies and admins can create accompaniments"
ON public.accompaniments
FOR INSERT
WITH CHECK (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = accompaniments.application_id
      AND j.company_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.users_profiles up
    WHERE up.id = accompaniments.mentor_id
      AND up.role = 'mentor'
      AND auth.uid() = accompaniments.mentor_id
  )
);

CREATE POLICY "Related users can update accompaniments"
ON public.accompaniments
FOR UPDATE
USING (
  public.is_admin()
  OR auth.uid() = mentor_id
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = accompaniments.application_id
      AND a.candidate_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = accompaniments.application_id
      AND j.company_id = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR auth.uid() = mentor_id
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = accompaniments.application_id
      AND a.candidate_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = accompaniments.application_id
      AND j.company_id = auth.uid()
  )
);

CREATE POLICY "Related users can delete accompaniments"
ON public.accompaniments
FOR DELETE
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = accompaniments.application_id
      AND j.company_id = auth.uid()
  )
);

CREATE POLICY "Related users can read checkins"
ON public.checkins
FOR SELECT
USING (
  public.is_admin()
  OR auth.uid() = author_id
  OR EXISTS (
    SELECT 1
    FROM public.accompaniments ac
    JOIN public.applications a ON a.id = ac.application_id
    JOIN public.jobs j ON j.id = a.job_id
    WHERE ac.id = checkins.accompaniment_id
      AND (
        ac.mentor_id = auth.uid()
        OR a.candidate_id = auth.uid()
        OR j.company_id = auth.uid()
      )
  )
);

CREATE POLICY "Related users can create checkins"
ON public.checkins
FOR INSERT
WITH CHECK (
  public.is_admin()
  OR auth.uid() = author_id
  OR EXISTS (
    SELECT 1
    FROM public.accompaniments ac
    JOIN public.applications a ON a.id = ac.application_id
    JOIN public.jobs j ON j.id = a.job_id
    WHERE ac.id = checkins.accompaniment_id
      AND (
        ac.mentor_id = auth.uid()
        OR a.candidate_id = auth.uid()
        OR j.company_id = auth.uid()
      )
  )
);

CREATE POLICY "Related users can update checkins"
ON public.checkins
FOR UPDATE
USING (
  public.is_admin()
  OR auth.uid() = author_id
  OR EXISTS (
    SELECT 1
    FROM public.accompaniments ac
    JOIN public.applications a ON a.id = ac.application_id
    JOIN public.jobs j ON j.id = a.job_id
    WHERE ac.id = checkins.accompaniment_id
      AND (
        ac.mentor_id = auth.uid()
        OR a.candidate_id = auth.uid()
        OR j.company_id = auth.uid()
      )
  )
)
WITH CHECK (
  public.is_admin()
  OR auth.uid() = author_id
  OR EXISTS (
    SELECT 1
    FROM public.accompaniments ac
    JOIN public.applications a ON a.id = ac.application_id
    JOIN public.jobs j ON j.id = a.job_id
    WHERE ac.id = checkins.accompaniment_id
      AND (
        ac.mentor_id = auth.uid()
        OR a.candidate_id = auth.uid()
        OR j.company_id = auth.uid()
      )
  )
);

CREATE POLICY "Related users can delete checkins"
ON public.checkins
FOR DELETE
USING (
  public.is_admin()
  OR auth.uid() = author_id
  OR EXISTS (
    SELECT 1
    FROM public.accompaniments ac
    JOIN public.applications a ON a.id = ac.application_id
    JOIN public.jobs j ON j.id = a.job_id
    WHERE ac.id = checkins.accompaniment_id
      AND (
        ac.mentor_id = auth.uid()
        OR a.candidate_id = auth.uid()
        OR j.company_id = auth.uid()
      )
  )
);

-- ====================================================================================
-- 13. NOTIFICACIONES / DOCUMENTOS
-- ====================================================================================

CREATE POLICY "Users can read own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users and admins can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Owners and related companies can read documents"
ON public.documents
FOR SELECT
USING (
  public.is_admin()
  OR auth.uid() = user_id
  OR is_public = TRUE
  OR public.company_has_application_for_candidate(user_id)
);

CREATE POLICY "Owners can manage own documents"
ON public.documents
FOR ALL
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ====================================================================================
-- 14. CONVERSACIONES / MENSAJES
-- ====================================================================================

CREATE POLICY "Participants and admins can read conversations"
ON public.conversations
FOR SELECT
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own conversations"
ON public.conversations
FOR INSERT
WITH CHECK (auth.uid() = created_by OR public.is_admin());

CREATE POLICY "Participants and admins can update conversations"
ON public.conversations
FOR UPDATE
USING (
  public.is_admin()
  OR auth.uid() = created_by
  OR EXISTS (
    SELECT 1
    FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR auth.uid() = created_by
  OR EXISTS (
    SELECT 1
    FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants and admins can read participant rows"
ON public.conversation_participants
FOR SELECT
USING (
  public.is_admin()
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
      AND c.created_by = auth.uid()
  )
);

CREATE POLICY "Conversation creators and admins can add participants"
ON public.conversation_participants
FOR INSERT
WITH CHECK (
  public.is_admin()
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
      AND c.created_by = auth.uid()
  )
);

CREATE POLICY "Conversation creators and admins can update participants"
ON public.conversation_participants
FOR UPDATE
USING (
  public.is_admin()
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
      AND c.created_by = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
      AND c.created_by = auth.uid()
  )
);

CREATE POLICY "Participants and admins can read messages"
ON public.messages
FOR SELECT
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.conversation_participants cp
    WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants and admins can create messages"
ON public.messages
FOR INSERT
WITH CHECK (
  (sender_id = auth.uid() OR public.is_admin())
  AND EXISTS (
    SELECT 1
    FROM public.conversation_participants cp
    WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants and admins can update messages"
ON public.messages
FOR UPDATE
USING (
  public.is_admin()
  OR sender_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND c.created_by = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR sender_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND c.created_by = auth.uid()
  )
);

CREATE POLICY "Participants and admins can delete messages"
ON public.messages
FOR DELETE
USING (
  public.is_admin()
  OR sender_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND c.created_by = auth.uid()
  )
);

-- ====================================================================================
-- 15. ADMIN LOGS
-- ====================================================================================

CREATE POLICY "Admins can read admin logs"
ON public.admin_logs
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage admin logs"
ON public.admin_logs
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ====================================================================================
-- 16. VISTAS DE ADMIN CON security_invoker
-- ====================================================================================

CREATE OR REPLACE VIEW public.admin_stats_overview
WITH (security_invoker = true)
AS
SELECT
  (SELECT COUNT(*) FROM public.users_profiles WHERE role = 'candidate' AND deleted_at IS NULL) AS total_candidates,
  (SELECT COUNT(*) FROM public.users_profiles WHERE role = 'company' AND deleted_at IS NULL) AS total_companies,
  (SELECT COUNT(*) FROM public.users_profiles WHERE role = 'mentor' AND deleted_at IS NULL) AS total_mentors,
  (SELECT COUNT(*) FROM public.users_profiles WHERE role = 'admin' AND deleted_at IS NULL) AS total_admins,

  (SELECT COUNT(*) FROM public.jobs WHERE status = 'open' AND deleted_at IS NULL) AS jobs_open,
  (SELECT COUNT(*) FROM public.jobs WHERE status = 'draft' AND deleted_at IS NULL) AS jobs_draft,
  (SELECT COUNT(*) FROM public.jobs WHERE status = 'closed' AND deleted_at IS NULL) AS jobs_closed,
  (SELECT COUNT(*) FROM public.jobs WHERE status = 'filled' AND deleted_at IS NULL) AS jobs_filled,

  (SELECT COUNT(*) FROM public.applications WHERE status = 'pending' AND deleted_at IS NULL) AS applications_pending,
  (SELECT COUNT(*) FROM public.applications WHERE status = 'reviewing' AND deleted_at IS NULL) AS applications_reviewing,
  (SELECT COUNT(*) FROM public.applications WHERE status = 'interviewing' AND deleted_at IS NULL) AS applications_interviewing,
  (SELECT COUNT(*) FROM public.applications WHERE status = 'accepted' AND deleted_at IS NULL) AS applications_accepted,
  (SELECT COUNT(*) FROM public.applications WHERE status = 'rejected' AND deleted_at IS NULL) AS applications_rejected,
  (SELECT COUNT(*) FROM public.applications WHERE status = 'withdrawn' AND deleted_at IS NULL) AS applications_withdrawn,

  (SELECT ROUND(AVG(match_score), 1) FROM public.applications WHERE match_score IS NOT NULL AND deleted_at IS NULL) AS avg_match_score,
  (
    SELECT CASE
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'accepted') / COUNT(*), 1)
    END
    FROM public.applications
    WHERE deleted_at IS NULL
  ) AS placement_rate_pct,

  (SELECT COUNT(*) FROM public.accompaniments WHERE status = 'active' AND deleted_at IS NULL) AS accompaniments_active,
  (SELECT COUNT(*) FROM public.accompaniments WHERE status = 'completed' AND deleted_at IS NULL) AS accompaniments_completed,
  (SELECT COUNT(*) FROM public.accompaniments WHERE status = 'cancelled' AND deleted_at IS NULL) AS accompaniments_cancelled,

  (SELECT COUNT(*) FROM public.checkins WHERE deleted_at IS NULL) AS total_checkins,
  (SELECT COUNT(*) FROM public.documents WHERE deleted_at IS NULL) AS total_documents,

  (SELECT ROUND(AVG(esg_retention_rate), 1) FROM public.companies WHERE deleted_at IS NULL) AS avg_retention_rate,
  (SELECT ROUND(AVG(esg_wellness_index), 1) FROM public.companies WHERE deleted_at IS NULL) AS avg_wellness_index;

CREATE OR REPLACE VIEW public.admin_signups_by_month
WITH (security_invoker = true)
AS
SELECT
  date_trunc('month', created_at) AS month,
  role,
  COUNT(*) AS total
FROM public.users_profiles
WHERE deleted_at IS NULL
GROUP BY date_trunc('month', created_at), role
ORDER BY month, role;

CREATE OR REPLACE VIEW public.admin_candidates_by_neurotype
WITH (security_invoker = true)
AS
SELECT
  COALESCE(neurotype, 'No especificado') AS neurotype,
  COUNT(*) AS total
FROM public.candidates
WHERE deleted_at IS NULL
GROUP BY COALESCE(neurotype, 'No especificado')
ORDER BY total DESC, neurotype;

CREATE OR REPLACE VIEW public.admin_candidates_overview
WITH (security_invoker = true)
AS
SELECT
  c.user_id,
  up.full_name,
  up.email,
  up.completed_onboarding,
  c.neurotype,
  c.work_preference,
  c.ideal_environment,
  c.interests,
  c.adjustments_needed,
  c.match_visibility,
  (SELECT COUNT(*) FROM public.applications a WHERE a.candidate_id = c.user_id AND a.deleted_at IS NULL) AS total_applications,
  (SELECT COUNT(*) FROM public.applications a WHERE a.candidate_id = c.user_id AND a.status = 'accepted' AND a.deleted_at IS NULL) AS accepted_applications,
  up.created_at
FROM public.candidates c
JOIN public.users_profiles up ON up.id = c.user_id
WHERE c.deleted_at IS NULL
  AND up.deleted_at IS NULL;

CREATE OR REPLACE VIEW public.admin_companies_overview
WITH (security_invoker = true)
AS
SELECT
  co.user_id,
  up.full_name AS contact_name,
  up.email,
  co.company_name,
  co.industry,
  co.website,
  co.company_size,
  co.country,
  co.city,
  co.accommodations,
  co.esg_retention_rate,
  co.esg_wellness_index,
  (SELECT COUNT(*) FROM public.jobs j WHERE j.company_id = co.user_id AND j.deleted_at IS NULL) AS total_jobs,
  (SELECT COUNT(*) FROM public.jobs j WHERE j.company_id = co.user_id AND j.status = 'open' AND j.deleted_at IS NULL) AS open_jobs,
  up.created_at
FROM public.companies co
JOIN public.users_profiles up ON up.id = co.user_id
WHERE co.deleted_at IS NULL
  AND up.deleted_at IS NULL;

CREATE OR REPLACE VIEW public.admin_accompaniments_overview
WITH (security_invoker = true)
AS
SELECT
  ac.id AS accompaniment_id,
  mentor_profile.full_name AS mentor_name,
  candidate_profile.full_name AS candidate_name,
  company.company_name,
  j.title AS job_title,
  ac.status,
  ac.started_at,
  ac.completed_at,
  (SELECT COUNT(*) FROM public.checkins ch WHERE ch.accompaniment_id = ac.id AND ch.deleted_at IS NULL) AS total_checkins,
  (SELECT MAX(ch.created_at) FROM public.checkins ch WHERE ch.accompaniment_id = ac.id AND ch.deleted_at IS NULL) AS last_checkin_at
FROM public.accompaniments ac
JOIN public.mentors m ON m.user_id = ac.mentor_id
JOIN public.users_profiles mentor_profile ON mentor_profile.id = m.user_id
JOIN public.applications app ON app.id = ac.application_id
JOIN public.users_profiles candidate_profile ON candidate_profile.id = app.candidate_id
JOIN public.jobs j ON j.id = app.job_id
JOIN public.companies company ON company.user_id = j.company_id
WHERE ac.deleted_at IS NULL
  AND m.deleted_at IS NULL
  AND mentor_profile.deleted_at IS NULL
  AND candidate_profile.deleted_at IS NULL
  AND j.deleted_at IS NULL
  AND company.deleted_at IS NULL
  AND app.deleted_at IS NULL;

CREATE OR REPLACE VIEW public.admin_checkins_overview
WITH (security_invoker = true)
AS
SELECT
  ch.id,
  ch.accompaniment_id,
  author.full_name AS author_name,
  author.role AS author_role,
  ch.notes,
  ch.adaptation_status,
  ch.scheduled_for,
  ch.created_at
FROM public.checkins ch
JOIN public.users_profiles author ON author.id = ch.author_id
WHERE ch.deleted_at IS NULL
  AND author.deleted_at IS NULL;

CREATE OR REPLACE VIEW public.admin_top_companies
WITH (security_invoker = true)
AS
SELECT
  co.user_id,
  co.company_name,
  COALESCE(COUNT(j.id), 0) AS total_jobs,
  COALESCE(COUNT(j.id) FILTER (WHERE j.status = 'open'), 0) AS open_jobs,
  COALESCE(AVG(co.esg_retention_rate), 0) AS avg_retention_rate,
  COALESCE(AVG(co.esg_wellness_index), 0) AS avg_wellness_index
FROM public.companies co
LEFT JOIN public.jobs j
  ON j.company_id = co.user_id
 AND j.deleted_at IS NULL
WHERE co.deleted_at IS NULL
GROUP BY co.user_id, co.company_name
ORDER BY total_jobs DESC, avg_wellness_index DESC;

CREATE OR REPLACE VIEW public.admin_top_mentors
WITH (security_invoker = true)
AS
SELECT
  m.user_id,
  up.full_name,
  m.expertise,
  m.availability_status,
  COUNT(ac.id) FILTER (WHERE ac.status = 'active' AND ac.deleted_at IS NULL) AS active_accompaniments,
  COUNT(ac.id) FILTER (WHERE ac.status = 'completed' AND ac.deleted_at IS NULL) AS completed_accompaniments
FROM public.mentors m
JOIN public.users_profiles up ON up.id = m.user_id
LEFT JOIN public.accompaniments ac ON ac.mentor_id = m.user_id
WHERE m.deleted_at IS NULL
  AND up.deleted_at IS NULL
GROUP BY m.user_id, up.full_name, m.expertise, m.availability_status
ORDER BY active_accompaniments DESC, completed_accompaniments DESC;

CREATE OR REPLACE VIEW public.admin_hiring_funnel
WITH (security_invoker = true)
AS
SELECT
  COUNT(*) FILTER (WHERE a.status = 'pending' AND a.deleted_at IS NULL) AS pending,
  COUNT(*) FILTER (WHERE a.status = 'reviewing' AND a.deleted_at IS NULL) AS reviewing,
  COUNT(*) FILTER (WHERE a.status = 'interviewing' AND a.deleted_at IS NULL) AS interviewing,
  COUNT(*) FILTER (WHERE a.status = 'accepted' AND a.deleted_at IS NULL) AS accepted,
  COUNT(*) FILTER (WHERE a.status = 'rejected' AND a.deleted_at IS NULL) AS rejected,
  COUNT(*) FILTER (WHERE a.status = 'withdrawn' AND a.deleted_at IS NULL) AS withdrawn
FROM public.applications a;

-- ====================================================================================
-- 17. GRANTS
-- ====================================================================================

GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT SELECT ON public.job_skills TO anon, authenticated;
GRANT SELECT ON public.admin_stats_overview TO authenticated;
GRANT SELECT ON public.admin_signups_by_month TO authenticated;
GRANT SELECT ON public.admin_candidates_by_neurotype TO authenticated;
GRANT SELECT ON public.admin_candidates_overview TO authenticated;
GRANT SELECT ON public.admin_companies_overview TO authenticated;
GRANT SELECT ON public.admin_accompaniments_overview TO authenticated;
GRANT SELECT ON public.admin_checkins_overview TO authenticated;
GRANT SELECT ON public.admin_top_companies TO authenticated;
GRANT SELECT ON public.admin_top_mentors TO authenticated;
GRANT SELECT ON public.admin_hiring_funnel TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_experience TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_education TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_certifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accompaniments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkins TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_logs TO authenticated;

-- ====================================================================================
-- 18. REaltime
-- ====================================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checkins;

-- ====================================================================================
-- 19. PROVISIÓN DEL ADMINISTRADOR
-- ====================================================================================

DO $$
BEGIN
  PERFORM public.provision_admin(
    'johansttivelinaresb@gmail.com',
    'AdminAstris'
  );
END $$;

-- ====================================================================================
-- 20. VERIFICACIÓN FINAL
-- ====================================================================================

SELECT id, role, email, full_name, completed_onboarding, created_at
FROM public.users_profiles
WHERE email = 'johansttivelinaresb@gmail.com';

-- ====================================================================================
-- FIN
-- ====================================================================================