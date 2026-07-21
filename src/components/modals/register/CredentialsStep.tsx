import { ChevronLeft, AlertCircle } from "lucide-react";
import { Overlay } from "@/components/common/Overlay";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { signInWithGoogle } from "@/services/supabase";
import { Role } from "@/types";

export function CredentialsStep({
  handleBack,
  Icon,
  t,
  error,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  vocation,
  setVocation,
  handleKeyDown,
  onRegister,
  selectedRole,
  loading,
}: any) {
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
          <div role="alert" aria-live="assertive" aria-atomic="true">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                <AlertCircle size={15} aria-hidden="true" />{error}
              </div>
            )}
          </div>

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
              try { await signInWithGoogle(selectedRole!, "register"); } catch {}
            }}
            disabled={loading || !selectedRole}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 border-2 border-border bg-card text-foreground hover:bg-secondary disabled:opacity-60 cursor-pointer"
            aria-label="Registrarse con Google"
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
