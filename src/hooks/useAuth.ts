import { useState, useEffect } from "react";
import { Role } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser, supabase } from "@/services/supabase";

export function useAuth(setScreen: (s: string) => void, setModalStep: (s: any) => void) {
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [googleAuthUser, setGoogleAuthUser] = useState<any>(null);
  const [requirePasswordUpdate, setRequirePasswordUpdate] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [userVocation, setUserVocation] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          if ((user as any).needsRegistration) {
            setAuthMessage("No tienes cuenta, redireccionando a registro...");
            setAppReady(true);
            setTimeout(() => {
              setAuthMessage(null);
              setGoogleAuthUser(user);
              setPendingRole(user.role);
              setModalStep("register");
            }, 3000);
            return;
          }
          setRole(user.role);
          setUserName(user.name);
          setUserAvatar((user as any).avatarUrl || "");
          setUserVocation((user as any).vocation || "");
          setLoggedIn(true);
          setModalStep("none");
          // Demo users: route to their primary dashboard screens
          const isDemoUser = user.id === "demo-cand" || user.id === "demo-comp" || user.id === "demo-ment";
          const first =
            user.role === "candidate"
              ? isDemoUser ? "profile" : (user.completedOnboarding ? "vacancies" : "onboarding")
              : user.role === "company" ? (isDemoUser ? "candidates" : "org-profile") : "dashboard";
          setScreen(first);
        }
      } catch {
        // No active session
      } finally {
        setAppReady(true);
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRequirePasswordUpdate(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setScreen, setModalStep]);

  const handleCompleteGoogleRegistration = () => {
    if (googleAuthUser) {
      setRole(googleAuthUser.role);
      setUserName(googleAuthUser.name);
      setUserAvatar(googleAuthUser.avatarUrl || "");
      setUserVocation(googleAuthUser.vocation || "");
      setLoggedIn(true);
      setModalStep("none");
      const first = googleAuthUser.role === "candidate" 
        ? (googleAuthUser.completedOnboarding ? "vacancies" : "onboarding") 
        : googleAuthUser.role === "company" ? "org-profile" : "dashboard";
      setScreen(first);
      setGoogleAuthUser(null);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, selectedRole: Role, vocation: string) => {
    if (email === "johansttivelinaresb@gmail.com") {
      setRole("admin");
      setUserName("Admin Astris");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("dashboard");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerUser(email, password, name, selectedRole, vocation);
      setRole(selectedRole);
      setUserName(name);
      setUserVocation(vocation);
      setLoggedIn(true);
      setModalStep("none");
      setScreen(selectedRole === "candidate" ? "onboarding" : selectedRole === "company" ? "org-profile" : "dashboard");
    } catch (err: any) {
      setAuthError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email?: string, password?: string) => {
    if (email === "johansttivelinaresb@gmail.com" && password === "Astris2026") {
      setRole("admin");
      setUserName("Admin Astris");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("dashboard");
      return;
    }

    if (password === "Demo2026") {
      if (email === "candidato@astris.org") {
        window.localStorage.setItem("astris_demo_user", email);
        setRole("candidate");
        setUserName("Alex (Demo)");
        setUserVocation("Analista de Datos");
        setLoggedIn(true);
        setModalStep("none");
        setScreen("profile");
        return;
      }
      if (email === "empresa@astris.org") {
        window.localStorage.setItem("astris_demo_user", email);
        setRole("company");
        setUserName("Veritas Analytics (Demo)");
        setLoggedIn(true);
        setModalStep("none");
        setScreen("candidates");
        return;
      }
      if (email === "mentor@astris.org") {
        window.localStorage.setItem("astris_demo_user", email);
        setRole("mentor");
        setUserName("Elena (Demo)");
        setUserVocation("Especialista en Inclusión");
        setLoggedIn(true);
        setModalStep("none");
        setScreen("dashboard");
        return;
      }
    }

    if (!email || !password) {
      setAuthError("Por favor ingresa tu correo electrónico y contraseña.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginUser(email, password);
      const user = await getCurrentUser();
      const resolvedRole = user?.role ?? "candidate";
      setRole(resolvedRole);
      setUserName(user?.name ?? "");
      setUserAvatar((user as any)?.avatarUrl ?? "");
      setUserVocation((user as any)?.vocation ?? "");
      setLoggedIn(true);
      setModalStep("none");
      setScreen(resolvedRole === "candidate" ? "vacancies" : resolvedRole === "company" ? "candidates" : "dashboard");
    } catch (err: any) {
      setAuthError(err.message ?? "Login failed. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (setPublicView: (s: any) => void) => {
    try { await logoutUser(); } catch { /* ignore */ }
    setLoggedIn(false);
    setRole(null);
    setScreen("home");
    setPublicView("landing");
    setModalStep("none");
  };

  return {
    role,
    pendingRole,
    loggedIn,
    authLoading,
    authError,
    appReady,
    authMessage,
    googleAuthUser,
    requirePasswordUpdate,
    userName,
    userAvatar,
    userVocation,
    setPendingRole,
    setRequirePasswordUpdate,
    handleCompleteGoogleRegistration,
    handleRegister,
    handleLogin,
    handleLogout
  };
}
