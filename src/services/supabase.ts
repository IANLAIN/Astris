// ── Supabase Service ──
// Real Supabase backend when VITE_SUPABASE_URL is set.
// Falls back to demo data when env vars are missing.

import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import {
  DEMO_USERS,
  ADMIN_CREDENTIALS,
  VACANCIES_FALLBACK,
  MENTORS_FALLBACK,
  CANDIDATE_RADAR_FINAL,
  CANDIDATE_ADJUSTMENTS,
  COMPANY_CANDIDATES_DATA,
  MENTOR_PROCESSES,
  ADMIN_STATS,
  ADMIN_USERS,
  ADMIN_COMPANIES,
  ADMIN_CANDIDATES
} from "./demoData";

// ── Detect mode ──
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const PLACEHOLDER = 'https://XXXXXXXXXXXX.supabase.co';

export const USE_REAL_BACKEND = !!SUPABASE_URL && !!SUPABASE_KEY && SUPABASE_URL !== PLACEHOLDER;

let _supabase: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!_supabase && USE_REAL_BACKEND) {
    _supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
  }
  return _supabase!;
}

// ── Types ──
export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "candidate" | "company" | "mentor" | "admin";
  avatarUrl: string;
  vocation: string;
  completedOnboarding: boolean;
  needsRegistration?: boolean;
  profile?: any;
}

export const DEMO_USER_IDS = ["demo-cand", "demo-comp", "demo-ment", "admin-backdoor"];

export function isDemoUser(userId: string): boolean {
  return DEMO_USER_IDS.includes(userId);
}

// ── Helper: map DB row to DemoUser ──
function rowToUser(row: any): DemoUser {
  return {
    id: row.id,
    email: row.email || '',
    name: row.full_name || '',
    role: row.role || 'candidate',
    avatarUrl: row.avatar_url || '',
    vocation: row.vocation || '',
    completedOnboarding: row.completed_onboarding || false,
  };
}

// ── Auth ──
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "candidate" | "company" | "mentor" | "admin",
  vocation: string = ""
) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await getClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
          vocation,
        },
      },
    });
    if (error) throw error;
    return { id: data.user?.id || '', email };
  }
  // Demo mode — returns a synthetic ID; the caller must persist session
  return { id: `user-${Date.now()}`, email };
}

export async function loginUser(email: string, password: string) {
  if (USE_REAL_BACKEND) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return { user: { id: data.user?.id || '', email: data.user?.email || email } };
  }
  // Demo mode: check admin backdoor
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return { user: { id: ADMIN_CREDENTIALS.id, email: ADMIN_CREDENTIALS.email } };
  }
  // Check demo users
  const demoUser = DEMO_USERS[email];
  if (demoUser && password === demoUser.password) {
    window.localStorage.setItem("astris_demo_user", email);
    return { user: { id: demoUser.id, email: demoUser.email } };
  }
  // Check non-demo locally registered users
  const localUserJson = window.localStorage.getItem("astris_local_user");
  if (localUserJson) {
    try {
      const localUser = JSON.parse(localUserJson);
      if (localUser.email === email && password === localUser.password) {
        window.localStorage.setItem("astris_local_user", localUserJson);
        return { user: { id: localUser.id, email: localUser.email } };
      }
    } catch {}
  }
  throw new Error("Credenciales invalidas.");
}

export async function getCurrentUser(): Promise<DemoUser | null> {
  if (USE_REAL_BACKEND) {
    const { data: { session } } = await getClient().auth.getSession();
    if (!session?.user) return null;
    const { data: profile } = await getClient()
      .from('users_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (profile) {
      return rowToUser(profile);
    }
    // Profile not yet created (shouldn't happen with trigger, but fallback)
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name || session.user.email || '',
      role: session.user.user_metadata?.role || 'candidate',
      avatarUrl: '',
      vocation: session.user.user_metadata?.vocation || '',
      completedOnboarding: false,
    };
  }
  // Demo mode: first check for non-demo locally registered user
  const localUserJson = typeof window !== "undefined" ? window.localStorage.getItem("astris_local_user") : null;
  if (localUserJson) {
    try {
      const u = JSON.parse(localUserJson);
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        avatarUrl: u.avatarUrl || '',
        vocation: u.vocation || '',
        completedOnboarding: !!u.completedOnboarding,
      };
    } catch {}
  }
  // Demo mode: check demo users
  const demoEmail = typeof window !== "undefined" ? window.localStorage.getItem("astris_demo_user") : null;
  if (demoEmail && DEMO_USERS[demoEmail]) {
    const u = DEMO_USERS[demoEmail];
    return {
      id: u.id, email: u.email, name: u.name, role: u.role as any,
      avatarUrl: u.avatarUrl || '', vocation: u.vocation,
      completedOnboarding: u.completedOnboarding, profile: u.profile,
    };
  }
  const adminSession = typeof window !== "undefined" ? window.localStorage.getItem("astris_admin_session") : null;
  if (adminSession === "true") {
    return {
      id: ADMIN_CREDENTIALS.id, email: ADMIN_CREDENTIALS.email,
      name: "Admin Astris", role: "admin",
      avatarUrl: "", vocation: "", completedOnboarding: true,
    };
  }
  return null;
}

export async function logoutUser() {
  if (USE_REAL_BACKEND) {
    await getClient().auth.signOut();
  }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("astris_demo_user");
    window.localStorage.removeItem("astris_admin_session");
    window.localStorage.removeItem("astris_local_user");
    window.localStorage.removeItem("astris_quiz_completed");
    window.localStorage.removeItem("astris_quiz_answers");
    window.localStorage.removeItem("astris_theme");
    window.localStorage.removeItem("astris_font");
  }
}

export async function signInWithGoogle(role?: string, intent?: 'login' | 'register') {
  if (USE_REAL_BACKEND) {
    const { error } = await getClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: role ? { role } : undefined,
      },
    });
    if (error) throw error;
    return;
  }
  // Demo
  if (role) window.localStorage.setItem("astris_pending_role", role);
  if (intent) window.localStorage.setItem("astris_google_intent", intent);
}

export async function resetPasswordForEmail(email: string) {
  if (USE_REAL_BACKEND) {
    const { error } = await getClient().auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '?screen=settings',
    });
    if (error) throw error;
    return;
  }
}

export async function updatePassword(newPassword: string) {
  if (USE_REAL_BACKEND) {
    const { error } = await getClient().auth.updateUser({ password: newPassword });
    if (error) throw error;
  }
}

export async function updateProfile(userId: string, name: string, avatarUrl: string = "", vocation: string = "") {
  if (USE_REAL_BACKEND) {
    await getClient()
      .from('users_profiles')
      .update({ full_name: name, avatar_url: avatarUrl, vocation })
      .eq('id', userId);
  }
  // Demo: update local user data
  const localUserJson = window.localStorage.getItem("astris_local_user");
  if (localUserJson) {
    try {
      const u = JSON.parse(localUserJson);
      u.name = name;
      u.avatarUrl = avatarUrl;
      u.vocation = vocation;
      window.localStorage.setItem("astris_local_user", JSON.stringify(u));
    } catch {}
  }
}

export async function deleteAccount() {
  if (USE_REAL_BACKEND) {
    await getClient().rpc('delete_user');
  }
  await logoutUser();
}

export async function saveCandidateProfile(userId: string, quizAnswers: any, theme: string, font: string) {
  if (USE_REAL_BACKEND) {
    await getClient()
      .from('candidates')
      .upsert({
        user_id: userId,
        quiz_answers: quizAnswers,
        accessibility_theme: theme,
        accessibility_font: font,
        updated_at: new Date().toISOString(),
      });
    await getClient()
      .from('users_profiles')
      .update({ completed_onboarding: true })
      .eq('id', userId);
  }
  // Demo: save to localStorage
  try {
    window.localStorage.setItem("astris_quiz_answers", JSON.stringify(quizAnswers));
    window.localStorage.setItem("astris_theme", theme);
    window.localStorage.setItem("astris_font", font);
    window.localStorage.setItem("astris_quiz_completed", "true");
    // Update local user's onboarding status
    const localUserJson = window.localStorage.getItem("astris_local_user");
    if (localUserJson) {
      const u = JSON.parse(localUserJson);
      u.completedOnboarding = true;
      window.localStorage.setItem("astris_local_user", JSON.stringify(u));
    }
  } catch (e) {
    console.error("Error saving profile:", e);
  }
}

// ── Matching ──
export async function getMatchesForCandidate(candidateId: string) {
  if (USE_REAL_BACKEND) {
    const { data: jobs } = await getClient()
      .from('jobs')
      .select('id, title, company_id, status, work_modality, contract_type, offered_accommodations, description, companies(company_name, industry, philosophy)')
      .eq('status', 'active');
    if (!jobs) return [];
    return jobs.map((j: any) => ({
      jobId: j.id,
      matchPercentage: 85 + Math.floor(Math.random() * 15),
      title: j.title,
      company: j.companies?.company_name || '',
      sector: j.companies?.industry || '',
      modality: j.work_modality || '',
      type: j.contract_type || '',
      adjustments: j.offered_accommodations || [],
      desc: j.description || '',
      companyDesc: j.companies?.philosophy || '',
    }));
  }
  // Demo: only return demo vacancies for the demo candidate
  if (candidateId === "demo-cand") {
    return VACANCIES_FALLBACK.map((v, i) => ({
      jobId: v.id, matchPercentage: v.match - (i * 4),
      title: v.title, company: v.company, sector: v.sector,
      modality: v.modality, type: v.type, adjustments: v.adjustments,
      desc: v.desc, companyDesc: v.companyDesc,
    })).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
  // Non-demo user: return empty — no data yet
  return [];
}

export async function getMatchesForCompany(companyId: string) {
  if (USE_REAL_BACKEND) {
    const { data: candidates } = await getClient()
      .from('candidates')
      .select('user_id, work_preference, neurotype, ideal_environment, interests, users_profiles(full_name, email)');
    if (!candidates) return [];
    return candidates.map((c: any) => ({
      candidateId: c.user_id,
      matchPercentage: 75 + Math.floor(Math.random() * 25),
      strengths: `${c.neurotype || 'Perfil diverso'} · Prefiere ${c.work_preference || 'entorno flexible'}`,
      radar: CANDIDATE_RADAR_FINAL,
      env: [{ req: 'Comunicación clara', met: true }, { req: 'Flexibilidad horaria', met: true }],
    }));
  }
  // Demo: only return demo candidates for the demo company
  if (companyId === "demo-comp") {
    return COMPANY_CANDIDATES_DATA.map((c) => ({
      candidateId: c.id, matchPercentage: c.match,
      strengths: c.strengths, radar: c.radar, env: c.env,
    })).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
  return [];
}

// ── Mentors ──
export async function getMentors() {
  if (USE_REAL_BACKEND) {
    const { data } = await getClient().from('mentors').select('*');
    if (data) {
      return data.map((m: any) => ({
        id: m.id, name: m.full_name, specialty: m.specialty,
        years: m.years_experience, modality: m.modality, bio: m.bio,
      }));
    }
    return [];
  }
  return MENTORS_FALLBACK;
}

// ── Companies profile ──
export async function getCompanyProfile(userId: string) {
  if (USE_REAL_BACKEND) {
    const { data } = await getClient()
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data || null;
  }
  if (userId === "demo-comp") {
    return DEMO_USERS["empresa@astris.org"]?.profile || null;
  }
  return null;
}

export async function saveCompanyProfile(userId: string, data: any) {
  if (USE_REAL_BACKEND) {
    const { error } = await getClient()
      .from('companies')
      .upsert({
        user_id: userId,
        company_name: data.company_name,
        industry: data.industry,
        philosophy: data.philosophy,
        work_environment: data.work_environment || {},
        accommodations: data.accommodations || [],
        updated_at: new Date().toISOString(),
      });
    return { error: error?.message || null };
  }
  return { error: null };
}

// ── Checkins ──
export async function saveCheckin(userId: string, role: string, note: string) {
  if (USE_REAL_BACKEND) {
    await getClient().from('checkins').insert({ user_id: userId, role, note });
    return;
  }
  try {
    const key = `astris_checkins_${userId}`;
    const existing = JSON.parse(window.localStorage.getItem(key) || "[]");
    existing.unshift({ date: new Date().toISOString(), note, role });
    window.localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) { /* ignore */ }
}

export async function getCheckins(userId: string) {
  if (USE_REAL_BACKEND) {
    const { data } = await getClient()
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data || []).map((c: any) => ({ date: c.created_at, note: c.note, role: c.role }));
  }
  try {
    const key = `astris_checkins_${userId}`;
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch { return []; }
}

// ── Admin ──
export async function getDashboardStats() {
  if (USE_REAL_BACKEND) {
    const { count: totalUsers } = await getClient()
      .from('users_profiles').select('*', { count: 'exact', head: true });
    const { count: totalCandidates } = await getClient()
      .from('users_profiles').select('*', { count: 'exact', head: true }).eq('role', 'candidate');
    const { count: totalCompanies } = await getClient()
      .from('companies').select('*', { count: 'exact', head: true });
    const { count: totalJobs } = await getClient()
      .from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active');
    return {
      totalUsers: totalUsers || 0,
      totalCandidates: totalCandidates || 0,
      totalCompanies: totalCompanies || 0,
      totalJobs: totalJobs || 0,
    };
  }
  return ADMIN_STATS;
}

export async function getAdminUsers() {
  if (USE_REAL_BACKEND) {
    const { data } = await getClient()
      .from('users_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    return (data || []).map((u: any) => ({
      id: u.id, full_name: u.full_name, email: u.email, role: u.role,
      completed_onboarding: u.completed_onboarding, deleted_at: u.deleted_at,
    }));
  }
  return ADMIN_USERS;
}

export async function getAdminCompanies() {
  if (USE_REAL_BACKEND) {
    const { data } = await getClient()
      .from('companies')
      .select('*, users_profiles!inner(email, deleted_at)');
    return (data || []).map((c: any) => ({
      user_id: c.user_id, company_name: c.company_name, industry: c.industry,
      city: c.work_environment?.city || '', country: c.work_environment?.country || '',
      esg_retention_rate: c.esg_retention_rate, esg_wellness_index: c.esg_wellness_index,
      users_profiles: c.users_profiles ? { email: c.users_profiles.email, deleted_at: c.users_profiles.deleted_at } : undefined,
    }));
  }
  return ADMIN_COMPANIES;
}

export async function getAdminCandidates() {
  if (USE_REAL_BACKEND) {
    const { data } = await getClient()
      .from('candidates')
      .select('*, users_profiles!inner(full_name, email, deleted_at)');
    return (data || []).map((c: any) => ({
      user_id: c.user_id, neurotype: c.neurotype,
      work_preference: c.work_preference, interests: c.interests || [],
      users_profiles: c.users_profiles ? {
        full_name: c.users_profiles.full_name, email: c.users_profiles.email,
        deleted_at: c.users_profiles.deleted_at,
      } : undefined,
    }));
  }
  return ADMIN_CANDIDATES;
}

export async function softDeleteUser(adminId: string, userId: string, isDeleted: boolean) {
  if (USE_REAL_BACKEND) {
    await getClient()
      .from('users_profiles')
      .update({ deleted_at: isDeleted ? new Date().toISOString() : null })
      .eq('id', userId);
    await logAdminAction(adminId, isDeleted ? 'soft_delete' : 'restore', 'users_profiles', userId);
  }
}

export async function updateUserRole(adminId: string, userId: string, newRole: string) {
  if (USE_REAL_BACKEND) {
    await getClient()
      .from('users_profiles')
      .update({ role: newRole })
      .eq('id', userId);
    await logAdminAction(adminId, 'role_change', 'users_profiles', userId, { newRole });
  }
}

export async function logAdminAction(adminId: string, action: string, targetTable: string, targetId?: string, details?: any) {
  if (USE_REAL_BACKEND) {
    await getClient().from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_table: targetTable,
      target_id: targetId,
      details: details || {},
    });
  }
}
