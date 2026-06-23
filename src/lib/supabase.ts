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
  // Ensure a profile row exists in `users_profiles` for this user
  try {
    if (data?.user?.id) {
      const upsertBody: any = {
        id: data.user.id,
        email: email,
        full_name: name || data.user.user_metadata?.full_name || email.split("@")[0],
        role,
        completed_onboarding: false,
      };
      const { error: upsertErr } = await supabase.from("users_profiles").upsert(upsertBody);
      if (upsertErr) console.error("Error upserting users_profiles after register:", upsertErr);
    }
  } catch (e) {
    console.error("Unexpected error ensuring users_profiles on register:", e);
  }

  return data.user;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  // Ensure profile exists for signed-in user
  try {
    const userId = data?.user?.id;
    if (userId) {
      const { data: profile } = await supabase.from("users_profiles").select("id").eq("id", userId).single();
      if (!profile) {
        const { error: upsertErr } = await supabase.from("users_profiles").upsert({
          id: userId,
          email: email,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split("@")[0],
          role: data.user.user_metadata?.role ?? null,
          completed_onboarding: false,
        });
        if (upsertErr) console.error("Error upserting users_profiles after login:", upsertErr);
      }
    }
  } catch (e) {
    console.error("Unexpected error ensuring users_profiles on login:", e);
  }

  return data.user;
}

export async function signInWithGoogle(role?: string, intent?: 'login' | 'register') {
  if (role) {
    localStorage.setItem("astris_pending_role", role);
  }
  if (intent) {
    localStorage.setItem("astris_google_intent", intent);
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const userId = session.user.id;
  let { data: profile, error } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const pendingRole = localStorage.getItem("astris_pending_role");
  const intent = localStorage.getItem("astris_google_intent");
  
  let needsRegistration = false;

  if (pendingRole || intent) {
    if (!profile || !profile.role) {
      needsRegistration = true; // Siempre mostrar confirmación de registro para nuevos usuarios de Google
      
      const roleToSet = pendingRole || "candidate";
      const { data: updatedProfile, error: updateError } = await supabase
        .from("users_profiles")
        .upsert({ 
          id: userId, 
          role: roleToSet,
          email: session.user.email,
          full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0]
        })
        .select()
        .single();
      
      if (updateError) {
        console.error("Error al crear perfil en users_profiles:", updateError);
      }
      
      if (!updateError && updatedProfile) {
        profile = updatedProfile;
        error = null;
      }
    }
    localStorage.removeItem("astris_pending_role");
    localStorage.removeItem("astris_google_intent");
  }

  // If no profile exists at all, try to create one from auth metadata
  if (!profile) {
    try {
      const fallback = {
        id: userId,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0],
        role: session.user.user_metadata?.role ?? null,
        completed_onboarding: false,
      };
      const { data: created, error: createErr } = await supabase.from("users_profiles").upsert(fallback).select().single();
      if (createErr) {
        console.error("Error creating fallback users_profiles:", createErr);
      } else {
        profile = created;
        error = null;
      }
    } catch (e) {
      console.error("Unexpected error creating fallback users_profiles:", e);
    }
  }

  if (error || !profile) return null;
  return {
    id: userId,
    email: session.user.email ?? "",
    name: profile.full_name ?? session.user.email ?? "",
    role: profile.role as "candidate" | "company" | "mentor",
    completedOnboarding: profile.completed_onboarding ?? false,
    needsRegistration,
  };
}

export async function logoutUser() {
  await supabase.auth.signOut();
}
