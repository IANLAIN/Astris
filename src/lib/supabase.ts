import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE"
);

// ── Auth helpers (adapted from auth.js for the React/TS context) ──────────────

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "candidate" | "company" | "mentor" | "admin"
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: name || email.split("@")[0],
      },
    },
  });
  if (error) throw error;
  return data.user;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const userId = session.user.id;
  const { data: profile, error } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) return null;
  return {
    id: userId,
    email: session.user.email ?? "",
    name: profile.full_name ?? session.user.email ?? "",
    role: profile.role as "candidate" | "company" | "mentor",
    completedOnboarding: profile.completed_onboarding ?? false,
  };
}

export async function logoutUser() {
  await supabase.auth.signOut();
}
