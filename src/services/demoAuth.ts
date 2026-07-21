import { ADMIN_CREDENTIALS } from "@/services/demoData";
import { Role } from "@/types";

export function handleDemoRegister(
  email: string,
  password: string,
  name: string,
  selectedRole: Role,
  vocation: string,
  setRole: any,
  setUserName: any,
  setUserVocation: any,
  setLoggedIn: any,
  setModalStep: any,
  setQuizCompleted: any,
  setScreen: any
) {
  if (email === ADMIN_CREDENTIALS.email) {
    setRole("admin");
    setUserName("Admin Astris");
    window.localStorage.setItem("astris_admin_session", "true");
    setLoggedIn(true);
    setModalStep("none");
    setScreen("dashboard");
    return true;
  }

  const userId = `user-${Date.now()}`;
  const localUser = {
    id: userId,
    email,
    name,
    role: selectedRole,
    password,
    avatarUrl: "",
    vocation,
    completedOnboarding: false,
  };
  window.localStorage.setItem("astris_local_user", JSON.stringify(localUser));
  window.localStorage.removeItem("astris_demo_user");
  window.localStorage.removeItem("astris_admin_session");
  window.localStorage.removeItem("astris_quiz_completed");

  setRole(selectedRole);
  setUserName(name);
  setUserVocation(vocation);
  setLoggedIn(true);
  setModalStep("none");
  setQuizCompleted(false);

  if (selectedRole === "candidate") {
    setScreen("onboarding");
  } else {
    setScreen(selectedRole === "company" ? "org-profile" : "dashboard");
  }

  return true;
}

export function handleDemoLogin(
  email: string,
  password: string,
  setRole: any,
  setUserName: any,
  setUserVocation: any,
  setQuizCompleted: any,
  setLoggedIn: any,
  setModalStep: any,
  setScreen: any
) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    setRole("admin");
    setUserName("Admin Astris");
    window.localStorage.setItem("astris_admin_session", "true");
    setLoggedIn(true);
    setModalStep("none");
    setScreen("dashboard");
    return true;
  }

  if (password === "Demo2026") {
    if (email === "candidato@astris.org") {
      window.localStorage.setItem("astris_demo_user", email);
      window.localStorage.removeItem("astris_local_user");
      setRole("candidate");
      setUserName("Bryan Gonzalez");
      setUserVocation("Ingeniero de Sistemas y Computación");
      setQuizCompleted(true);
      window.localStorage.setItem("astris_quiz_completed", "true");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("profile");
      return true;
    }
    if (email === "empresa@astris.org") {
      window.localStorage.setItem("astris_demo_user", email);
      window.localStorage.removeItem("astris_local_user");
      setRole("company");
      setUserName("Vibra Latina");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("candidates");
      return true;
    }
    if (email === "mentor@astris.org") {
      window.localStorage.setItem("astris_demo_user", email);
      window.localStorage.removeItem("astris_local_user");
      setRole("mentor");
      setUserName("Elena Vargas");
      setUserVocation("Especialista en Inclusión Laboral y Coaching Neurodivergente");
      setLoggedIn(true);
      setModalStep("none");
      setScreen("dashboard");
      return true;
    }
  }

  return false;
}
