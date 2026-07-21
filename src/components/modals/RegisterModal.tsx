import { useState } from "react";
import { User, Building2, Users, Shield } from "lucide-react";
import { Lang, Role } from "@/types";
import { useT } from "@/i18n/useT";
import { GoogleAuthStep } from "./register/GoogleAuthStep";
import { RoleSelectStep } from "./register/RoleSelectStep";
import { CredentialsStep } from "./register/CredentialsStep";

const ROLE_ICON = { candidate: User, organization: Building2, mentor: Users, admin: Shield } as const;

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

  const initialStep: "select_role" | "credentials" = googleAuthUser ? "credentials" : role ? "credentials" : "select_role";
  const [step, setStep] = useState<"select_role" | "credentials">(initialStep);
  const [selectedRole, setSelectedRole] = useState<Role | null>(googleAuthUser?.role ?? role ?? null);

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

  if (googleAuthUser && onCompleteGoogle && selectedRole) {
    return (
      <GoogleAuthStep
        selectedRole={selectedRole}
        Icon={Icon}
        t={t}
        onCompleteGoogle={onCompleteGoogle}
      />
    );
  }

  if (step === "select_role") {
    return (
      <RoleSelectStep
        onBack={onBack}
        handleRoleSelect={handleRoleSelect}
        t={t}
      />
    );
  }

  return (
    <CredentialsStep
      handleBack={handleBack}
      Icon={Icon}
      t={t}
      error={error}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      vocation={vocation}
      setVocation={setVocation}
      handleKeyDown={handleKeyDown}
      onRegister={onRegister}
      selectedRole={selectedRole}
      loading={loading}
    />
  );
}
