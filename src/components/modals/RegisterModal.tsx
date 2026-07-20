import { useState } from "react";
import { ChevronLeft, AlertCircle, User, Building2, Users, Shield, ArrowRight } from "lucide-react";
import { Lang, Role } from "@/types";
import { useT, C } from "@/i18n/useT";
import { Overlay } from "@/components/common/Overlay";
import { signInWithGoogle } from "@/services/supabase";
import { PasswordInput } from "@/components/ui/PasswordInput";

const ROLE_ICON = { candidate: User, company: Building2, mentor: Users, admin: Shield } as const;

const ROLE_ROUTES: { role: Role; icon: typeof User; tKey: string; tSubKey: string }[] = [
  { role: "candidate", icon: User, tKey: "role.candidate", tSubKey: "role.candidate.sub" },
  { role: "company", icon: Building2, tKey: "role.company", tSubKey: "role.company.sub" },
  { role: "mentor", icon: Users, tKey: "role.mentor", tSubKey: "role.mentor.sub" },
];

export function RegisterModal({
  lang,
  role,
  onRegister,
  onBack,
  error,
  loading,
  googleAuthUser,
  onCompleteGoogle,
}: {
  lang: Lang;
  role: Role | null;
  onRegister: (email: string, password: string, name: string, selectedRole: Role, vocation: string) => void;
  onBack: () => void;
  error?: string | null;
  loading?: boolean;
  googleAuthUser?: { name: string; role: Role } | null;
  onCompleteGoogle?: () => void;
}) {
  const t = useT(lang);

  const initialStep: "select_role" | "credentials" =
    googleAuthUser ? "credentials" : role ? "credentials" : "select_role";
  const [step, setStep] = useState<"select_role" | "credentials">(initialStep);
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    googleAuthUser?.role ?? role ?? null
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [vocation, setVocation] = useState("");

  const Icon = selectedRole ? ROLE_ICON[selectedRole] : User;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && email && password && selectedRole) {
      onRegister(email, password, name, selectedRole, vocation);
    }
  };

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
    setStep("credentials");
  };

  const handleBack = () => {
    if (step === "credentials" && !role) {
      setStep("select_role");
      setSelectedRole(null);
    } else {
      onBack();
    }
  };

  // ── Google Auth confirmation view ──
  if (googleAuthUser && onCompleteGoogle) {
    const roleLabel = selectedRole === "candidate"
      ? t("role.candidate")
      : selectedRole === "company"
        ? t("role.company")
        : t("role.mentor");

    return (
      <Overlay>
        <div className="w-[95%] sm:w-full max-w-md rounded-2xl mx-auto bg-card border border-border">
          <div className="px-4 md:px-8 py-7 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground">
                <Icon size={18} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t("register.completeTitle")}</h2>
            </div>
          </div>

          <div className="p-4 md:p-8 flex flex-col gap-5 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border border-border bg-secondary">
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-foreground">
              {t("register.completeBody")} <strong>{roleLabel}</strong>
            </h3>

            <button
              onClick={onCompleteGoogle}
              className="w-full mt-4 py-4 rounded-xl font-bold text-base bg-primary text-primary-foreground hover:opacity-90"
            >
              {t("register.completeButton")}
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  // ── Role selection step ──
  if (step === "select_role") {
    return (
      <Overlay>
        <div className="w-[95%] sm:w-full max-w-lg rounded-2xl mx-auto bg-card border border-border">
          <div className="px-4 md:px-8 py-7 border-b border-border relative">
            <button
              onClick={onBack}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
              aria-label={t("register.back")}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <h2 className="text-xl font-bold text-foreground text-center px-12 md:px-16">
              {t("register.roleQuestion")}
            </h2>
          </div>

          <div className="p-4 md:p-8 flex flex-col gap-4">
            {ROLE_ROUTES.map(({ role: r, icon: RoleIcon, tKey, tSubKey }) => (
              <button
                key={r}
                onClick={() => handleRoleSelect(r)}
                className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border bg-background cursor-pointer text-left hover:border-primary group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <RoleIcon size={24} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground">{t(tKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(tSubKey)}</p>
                </div>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </Overlay>
    );
  }

  // ── Credentials step ──
  return (
    <Overlay>
      <div className="w-[95%] sm:w-full max-w-md rounded-2xl mx-auto bg-card border border-border">
        <div className="px-4 md:px-8 py-7 border-b border-border">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4 hover:text-foreground"
          >
            <ChevronLeft size={15} aria-hidden="true" />{t("register.back")}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground">
              <Icon size={18} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{t("register.title")}</h2>
          </div>
        </div>

        <div className="p-4 md:p-8 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertCircle size={15} aria-hidden="true" />{error}
            </div>
          )}

          <div>
            <label htmlFor="register-name" className="block text-sm font-semibold text-foreground mb-2">
              {t("register.name")}
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input-background text-foreground text-base"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-semibold text-foreground mb-2">
              {t("register.email")}
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input-background text-foreground text-base"
              placeholder="nombre@correo.com"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-semibold text-foreground mb-2">
              {t("register.password")}
            </label>
            <PasswordInput
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input-background text-foreground text-base"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="register-vocation" className="block text-sm font-semibold text-foreground mb-2">
              {t("register.vocation")}
            </label>
            <input
              id="register-vocation"
              type="text"
              value={vocation}
              onChange={(e) => setVocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input-background text-foreground text-base"
              placeholder={t("register.vocationPlaceholder")}
            />
          </div>

          <button
            onClick={() => onRegister(email, password, name, selectedRole!, vocation)}
            disabled={loading || !email || !password || !selectedRole}
            className="w-full py-4 rounded-xl font-bold text-base bg-primary text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
          >
            {loading ? "..." : t("register.submit")}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border" aria-hidden="true" />
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">
              {t("register.or")}
            </span>
            <div className="flex-grow border-t border-border" aria-hidden="true" />
          </div>

          <button
            onClick={async () => {
              try {
                await signInWithGoogle(selectedRole!, "register");
              } catch {
                /* handled by parent */
              }
            }}
            disabled={loading || !selectedRole}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 border-2 border-border bg-card text-foreground hover:bg-secondary disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("register.google")}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
