// Sistema de autenticación y gestión de usuarios (Supabase)

// Configuración de Supabase
export const supabase = window.supabase ? window.supabase.createClient('https://oupbptgzfevkzzvscekj.supabase.co', 'sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE') : null;

// Escuchar cambios de estado de autenticación (opcional, para redirecciones globales)
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      window.location.href = window.location.pathname.includes('pages/') ? '../index.html' : 'index.html';
    }
  });
}

export async function signInWithGoogle() {
  if (!supabase) return;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) throw error;
}

// Obtener usuario actual desde Supabase (incluyendo perfil extendido)
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const userId = session.user.id;

  // 1. Obtener perfil base
  const { data: profileBase, error: profileErr } = await supabase
    .from('users_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileErr || !profileBase) return null;

  let extendedProfile = {};

  // 2. Obtener perfil específico según rol
  if (profileBase.role === 'candidate') {
    const { data: candidateData } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (candidateData) extendedProfile = candidateData;
  } else if (profileBase.role === 'company') {
    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (companyData) extendedProfile = companyData;
  }

  return {
    id: userId,
    email: session.user.email,
    name: profileBase.full_name,
    role: profileBase.role,
    profile: {
      ...profileBase,
      ...extendedProfile,
      avatar: profileBase.avatar_url,
      completedOnboarding: profileBase.completed_onboarding
    }
  };
}

// Cerrar sesión
export async function logout() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  window.location.href = window.location.pathname.includes('pages/') ? '../index.html' : 'index.html';
}

// Registrar nuevo usuario con correo y contraseña
export async function registerUser(email, password, name, role, additionalData = {}) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: role,
        full_name: name || email.split('@')[0],
      }
    }
  });
  
  if (error) throw error;
  
  // Nota: El trigger en la BD crea automáticamente el users_profiles y candidate/company
  return data.user;
}

// Iniciar sesión con correo y contraseña
export async function loginUser(email, password) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data.user;
}

// Actualizar perfil del usuario actual
export async function updateUserProfile(updates) {
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    // Si hay actualizaciones del perfil base
    const baseUpdates = {};
    if (updates.name !== undefined) baseUpdates.full_name = updates.name;
    if (updates.profile?.avatar !== undefined) baseUpdates.avatar_url = updates.profile.avatar;
    if (updates.profile?.bio !== undefined) baseUpdates.bio = updates.profile.bio;
    if (updates.profile?.completedOnboarding !== undefined) baseUpdates.completed_onboarding = updates.profile.completedOnboarding;

    if (Object.keys(baseUpdates).length > 0) {
      const { error: err1 } = await supabase
        .from('users_profiles')
        .update(baseUpdates)
        .eq('id', user.id);
      if (err1) throw err1;
    }

    // Actualizaciones específicas de rol
    if (user.role === 'candidate' && updates.profile) {
      const candUpdates = {};
      const { neurotype, workPreference, environment, interests, skills, accessibility_theme, accessibility_font } = updates.profile;
      
      if (neurotype !== undefined) candUpdates.neurotype = neurotype;
      if (workPreference !== undefined) candUpdates.work_preference = workPreference;
      if (environment !== undefined) candUpdates.ideal_environment = environment;
      if (interests !== undefined) candUpdates.interests = interests;
      if (skills !== undefined) candUpdates.skills = skills;
      if (accessibility_theme !== undefined) candUpdates.accessibility_theme = accessibility_theme;
      if (accessibility_font !== undefined) candUpdates.accessibility_font = accessibility_font;

      if (Object.keys(candUpdates).length > 0) {
        const { error: err2 } = await supabase
          .from('candidates')
          .update(candUpdates)
          .eq('user_id', user.id);
        if (err2) throw err2;
      }
    } else if (user.role === 'company' && updates.profile) {
      const compUpdates = {};
      const { industry, philosophy, workEnvironment, accommodations } = updates.profile;
      
      if (industry !== undefined) compUpdates.industry = industry;
      if (philosophy !== undefined) compUpdates.philosophy = philosophy;
      if (workEnvironment !== undefined) compUpdates.work_environment = workEnvironment;
      if (accommodations !== undefined) compUpdates.accommodations = accommodations;

      if (Object.keys(compUpdates).length > 0) {
        const { error: err3 } = await supabase
          .from('companies')
          .update(compUpdates)
          .eq('user_id', user.id);
        if (err3) throw err3;
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}

// Obtener todos los candidatos (para empresas)
export async function getCandidates() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('users_profiles')
    .select('*, candidates(*)');
    
  if (error) return [];
  return data.filter(u => u.role === 'candidate').map(u => ({
    id: u.id,
    name: u.full_name,
    role: u.role,
    profile: { ...u, ...u.candidates[0] }
  }));
}

// Obtener todas las empresas (para candidatos)
export async function getCompanies() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('users_profiles')
    .select('*, companies(*)');
    
  if (error) return [];
  return data.filter(u => u.role === 'company').map(u => ({
    id: u.id,
    name: u.full_name,
    role: u.role,
    profile: { ...u, ...u.companies[0] }
  }));
}

// Simular match entre candidato y vacante (lógica simple migrada a DB)
export async function getMatchesForCandidate(candidateId) {
  if (!supabase) return [];
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*, companies(company_name)');
    
  if (error || !jobs) return [];
  
  return jobs.map(j => ({
    id: j.id,
    title: j.title,
    company: j.companies?.company_name || 'Empresa',
    match: Math.floor(Math.random() * 30) + 70, // Simulación de match
    skills: j.required_skills,
    environment: j.work_modality
  })).sort((a,b) => b.match - a.match);
}

export async function getMatchesForCompany(companyId) {
  const candidates = await getCandidates();
  return candidates.map(c => ({
    ...c,
    match: Math.floor(Math.random() * 30) + 70 // entre 70 y 99
  })).sort((a,b) => b.match - a.match);
}