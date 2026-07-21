import { useState, useEffect } from "react";
import { Role, QuizAnswers } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser, USE_REAL_BACKEND, isDemoUserUser, getCandidateQuizAnswers } from "@/services/supabase";
import { handleDemoLogin, handleDemoRegister } from "@/services/demoAuth";

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
  const [loadedQuizAnswers, setLoadedQuizAnswers] = useState<QuizAnswers>({});
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const stored = window.localStorage.getItem("astris_quiz_completed");
    if (stored === "true") setQuizCompleted(true);
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
          setUserId(user.id);
          setModalStep("none");

          const demo = isDemoUserUser(user.id);

          if (user.role === "candidate") {
            const savedAnswers = await getCandidateQuizAnswers(user.id);
            if (savedAnswers && Object.keys(savedAnswers).length > 0) {
              setLoadedQuizAnswers(savedAnswers);
              try { window.localStorage.setItem("astris_quiz_answers", JSON.stringify(savedAnswers)); } catch { /* ignore */ }
            }
          }

          if (user.role === "candidate") {
            if (demo) {
              setQuizCompleted(true);
              window.localStorage.setItem("astris_quiz_completed", "true");
              setScreen("profile");
            } else if (!quizCompleted) {
              setScreen("onboarding");
            } else {
              setScreen("vacancies");
            }
          } else if (user.role === "organization") {
            setScreen(demo ? "candidates" : "org-profile");
          } else if (user.role === "mentor") {
            setScreen(demo ? "dashboard" : "dashboard");
          } else if (user.role === "admin") {
            window.localStorage.setItem("astris_admin_session", "true");
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
          : googleAuthUser.role === "organization" ? "org-profile" : "dashboard";
        setScreen(first);
      }
      setGoogleAuthUser(null);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, selectedRole: Role, vocation: string) => {
    if (!USE_REAL_BACKEND) {
      const handled = handleDemoRegister(email, password, name, selectedRole, vocation, setRole, setUserName, setUserVocation, setLoggedIn, setModalStep, setQuizCompleted, setScreen);
      if (handled) return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerUser(email, password, name, selectedRole, vocation);
      setAuthMessage("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      setTimeout(() => {
        setAuthMessage(null);
        setModalStep("login");
      }, 4000);
    } catch (err: any) {
      setAuthError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email?: string, password?: string) => {
    if (!USE_REAL_BACKEND && email && password) {
      const handled = handleDemoLogin(email, password, setRole, setUserName, setUserVocation, setQuizCompleted, setLoggedIn, setModalStep, setScreen);
      if (handled) return;
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
      setUserId(user?.id ?? "");
      setLoggedIn(true);
      setModalStep("none");

      if (resolvedRole === "candidate" && user?.id) {
        const savedAnswers = await getCandidateQuizAnswers(user.id);
        if (savedAnswers && Object.keys(savedAnswers).length > 0) {
          setLoadedQuizAnswers(savedAnswers);
          try { window.localStorage.setItem("astris_quiz_answers", JSON.stringify(savedAnswers)); } catch { /* ignore */ }
        }
      }

      if (resolvedRole === "candidate" && !quizCompleted) {
        setScreen("onboarding");
      } else {
        setScreen(resolvedRole === "candidate" ? "vacancies" : resolvedRole === "organization" ? "candidates" : "dashboard");
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
    setQuizCompleted(false);
    setScreen("home");
    setPublicView("landing");
    setModalStep("none");
  };

  return {
    role, pendingRole, loggedIn, authLoading, authError, appReady, authMessage, googleAuthUser, requirePasswordUpdate, userName, userAvatar, userVocation, userId, quizCompleted, loadedQuizAnswers,
    setQuizCompleted, setPendingRole, setRequirePasswordUpdate, handleCompleteGoogleRegistration, handleRegister, handleLogin, handleLogout
  };
}
