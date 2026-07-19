import { useState, useEffect } from "react";
import { Role } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/services/supabase";
import { ADMIN_CREDENTIALS } from "@/services/demoData";

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
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Load quiz completion status from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem("astris_quiz_completed");
    if (stored === "true") {
      setQuizCompleted(true);
    }
  }, []);

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
          
          // If candidate hasn't completed quiz, force onboarding/quiz
          const isDemoUser = user.id === "demo-cand" || user.id === "demo-comp" || user.id === "demo-ment" || user.id === "admin-backdoor";
          if (user.role === "candidate") {
            if (isDemoUser) {
              // Demo candidate skips quiz — mark as completed
              setQuizCompleted(true);
              window.localStorage.setItem("astris_quiz_completed", "true");
              setScreen("profile");
            } else if (!user.completedOnboarding || !quizCompleted) {
              setScreen("onboarding");
            } else {
              setScreen("vacancies");
            }
          } else if (user.role === "company") {
            setScreen(isDemoUser ? "candidates" : "org-profile");
          } else if (user.role === "admin") {
            window.localStorage.setItem("astris_admin_session", "true");
            setScreen("dashboard");
          } else {
            setScreen("dashboard");
          }
        }
      } catch {
        // No active session
      } finally {
        setAppReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setScreen, setModalStep]);

  const handleCompleteGoogleRegistration = () => {
    if (googleAuthUser) {
      setRole(googleAuthUser.role);
      setUserName(googleAuthUser.name);
      setUserAvatar(googleAuthUser.avatarUrl || "");
      setUserVocation(googleAuthUser.vocation || "");
      setLoggedIn(true);
      setModalStep("none");
      if (googleAuthUser.role === "candidate" && !quizCompleted) {
        setScreen("onboarding");
      } else {
        const first = googleAuthUser.role === "candidate" 
          ? "vacancies"
          : googleAuthUser.role === "company" ? "org-profile" : "dashboard";
        setScreen(first);
      }
      setGoogleAuthUser(null);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, selectedRole: Role, vocation: string) => {
    if (email === ADMIN_CREDENTIALS.email) {
      setRole("admin");
      setUserName("Admin Astris");
      window.localStorage.setItem("astris_admin_session", "true");
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
      if (selectedRole === "candidate" && !quizCompleted) {
        setScreen("onboarding");
      } else {
        setScreen(selectedRole === "candidate" ? "vacancies" : selectedRole === "company" ? "org-profile" : "dashboard");
      }
    } catch (err: any) {
      setAuthError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email?: string, password?: string) => {
    // Admin backdoor
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setRole("admin");
      setUserName("Admin Astris");
      window.localStorage.setItem("astris_admin_session", "true");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("dashboard");
      return;
    }

    // Demo users
    if (password === "Demo2026") {
      if (email === "candidato@astris.org") {
        window.localStorage.setItem("astris_demo_user", email);
        setRole("candidate");
        setUserName("Bryan Gonzalez");
        setUserVocation("Ingeniero de Sistemas y Computación");
        setQuizCompleted(true);
        window.localStorage.setItem("astris_quiz_completed", "true");
        setLoggedIn(true);
        setModalStep("none");
        setScreen("profile");
        return;
      }
      if (email === "empresa@astris.org") {
        window.localStorage.setItem("astris_demo_user", email);
        setRole("company");
        setUserName("Vibra Latina");
        setLoggedIn(true);
        setModalStep("none");
        setScreen("candidates");
        return;
      }
      if (email === "mentor@astris.org") {
        window.localStorage.setItem("astris_demo_user", email);
        setRole("mentor");
        setUserName("Elena Vargas");
        setUserVocation("Especialista en Inclusión Laboral y Coaching Neurodivergente");
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
      if (resolvedRole === "candidate" && !quizCompleted) {
        setScreen("onboarding");
      } else {
        setScreen(resolvedRole === "candidate" ? "vacancies" : resolvedRole === "company" ? "candidates" : "dashboard");
      }
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
    quizCompleted,
    setQuizCompleted,
    setPendingRole,
    setRequirePasswordUpdate,
    handleCompleteGoogleRegistration,
    handleRegister,
    handleLogin,
    handleLogout
  };
}
