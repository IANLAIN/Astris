// ── Demo Data Service ──
// This replaces all Supabase functionality with mock data.
// No real backend is needed — everything works offline.

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

// ── Auth ──
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "candidate" | "company" | "mentor" | "admin",
  vocation: string = ""
) {
  // In demo mode, registration just returns success
  // Any registered user can login as demo
  return { id: `user-${Date.now()}`, email };
}

export async function loginUser(email: string, password: string) {
  // Check admin backdoor
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return { user: { id: ADMIN_CREDENTIALS.id, email: ADMIN_CREDENTIALS.email } };
  }

  // Check demo users
  const demoUser = DEMO_USERS[email];
  if (demoUser && password === demoUser.password) {
    window.localStorage.setItem("astris_demo_user", email);
    return { user: { id: demoUser.id, email: demoUser.email } };
  }

  // Allow any email/password combo for registered users
  if (email && password) {
    return { user: { id: `user-${Date.now()}`, email } };
  }

  throw new Error("Credenciales inválidas. Usa las credenciales demo.");
}

export async function getCurrentUser(): Promise<DemoUser | null> {
  const demoEmail = typeof window !== "undefined" ? window.localStorage.getItem("astris_demo_user") : null;

  if (demoEmail && DEMO_USERS[demoEmail]) {
    const u = DEMO_USERS[demoEmail];
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role as any,
      avatarUrl: u.avatarUrl || "",
      vocation: u.vocation,
      completedOnboarding: u.completedOnboarding,
      profile: u.profile,
    };
  }

  // Check if admin is logged in via localStorage
  const adminSession = typeof window !== "undefined" ? window.localStorage.getItem("astris_admin_session") : null;
  if (adminSession === "true") {
    return {
      id: ADMIN_CREDENTIALS.id,
      email: ADMIN_CREDENTIALS.email,
      name: "Admin Astris",
      role: "admin",
      avatarUrl: "",
      vocation: "",
      completedOnboarding: true,
    };
  }

  return null;
}

export async function logoutUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("astris_demo_user");
    window.localStorage.removeItem("astris_admin_session");
  }
}

export async function signInWithGoogle(role?: string, intent?: 'login' | 'register') {
  // Demo: just store the intent and simulate Google auth
  if (role) {
    window.localStorage.setItem("astris_pending_role", role);
  }
  if (intent) {
    window.localStorage.setItem("astris_google_intent", intent);
  }
  // In demo mode, pretend the OAuth redirect happened
  console.log("[DEMO] Google sign-in simulated. No real OAuth.");
}

export async function resetPasswordForEmail(email: string) {
  // Demo: no-op, just success
  return;
}

export async function updatePassword(newPassword: string) {
  // Demo: no-op
  return;
}

export async function updateProfile(userId: string, name: string, avatarUrl: string = "", vocation: string = "") {
  // Demo: no-op
  return;
}

export async function deleteAccount() {
  await logoutUser();
}

export async function saveCandidateProfile(userId: string, quizAnswers: any, theme: string, font: string) {
  // Demo: save to localStorage
  try {
    window.localStorage.setItem("astris_quiz_answers", JSON.stringify(quizAnswers));
    window.localStorage.setItem("astris_theme", theme);
    window.localStorage.setItem("astris_font", font);
    window.localStorage.setItem("astris_quiz_completed", "true");
  } catch (e) {
    console.error("Error saving profile demo:", e);
  }
}

// ── Matching ──
export async function getMatchesForCandidate(candidateId: string) {
  return VACANCIES_FALLBACK.map((v, i) => ({
    jobId: v.id,
    matchPercentage: v.match - (i * 4),
    title: v.title,
    company: v.company,
    sector: v.sector,
    modality: v.modality,
    type: v.type,
    adjustments: v.adjustments,
    desc: v.desc,
    companyDesc: v.companyDesc,
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function getMatchesForCompany(companyId: string) {
  return COMPANY_CANDIDATES_DATA.map((c) => ({
    candidateId: c.id,
    matchPercentage: c.match,
    strengths: c.strengths,
    radar: c.radar,
    env: c.env,
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// ── Mentors ──
export async function getMentors() {
  return MENTORS_FALLBACK;
}

// ── Companies profile ──
export async function getCompanyProfile(userId: string) {
  if (userId === "demo-comp") {
    return DEMO_USERS["empresa@astris.org"]?.profile || null;
  }
  return null;
}

export async function saveCompanyProfile(userId: string, data: any) {
  // Demo: no-op
  return { error: null };
}

// ── Checkins ──
export async function saveCheckin(userId: string, role: string, note: string) {
  // Demo: save to localStorage
  try {
    const key = `astris_checkins_${userId}`;
    const existing = JSON.parse(window.localStorage.getItem(key) || "[]");
    existing.unshift({ date: new Date().toISOString(), note, role });
    window.localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    // ignore
  }
}

export async function getCheckins(userId: string) {
  try {
    const key = `astris_checkins_${userId}`;
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

// ── Admin ──
export async function getDashboardStats() {
  return ADMIN_STATS;
}

export async function getAdminUsers() {
  return ADMIN_USERS;
}

export async function getAdminCompanies() {
  return ADMIN_COMPANIES;
}

export async function getAdminCandidates() {
  return ADMIN_CANDIDATES;
}

export async function softDeleteUser(adminId: string, userId: string, isDeleted: boolean) {
  // Demo: no-op
  return;
}

export async function updateUserRole(adminId: string, userId: string, newRole: string) {
  // Demo: no-op
  return;
}

export async function logAdminAction(adminId: string, action: string, targetTable: string, targetId?: string, details?: any) {
  // Demo: no-op
  return;
}
