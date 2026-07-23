import { Save, AlertCircle } from "lucide-react";
import { AvatarUpload } from "@/components/common/AvatarUpload";

export interface ProfileSettingsProps {
  t: (key: string) => string;
  name: string;
  setName: (v: string) => void;
  vocation: string;
  setVocation: (v: string) => void;
  avatarUrl: string;
  setAvatarUrl: (v: string) => void;
  userId?: string;
  userName?: string;
  isDemo?: boolean;
  handleSaveProfile: () => void;
  saving: boolean;
}

export function ProfileSettings({
  t,
  name,
  setName,
  vocation,
  setVocation,
  avatarUrl,
  setAvatarUrl,
  userId,
  userName,
  isDemo = false,
  handleSaveProfile,
  saving,
}: ProfileSettingsProps) {
  return (
    <section
      className="p-6 md:p-8 rounded-[2rem] border border-border"
      style={{
        backgroundColor: "var(--card)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
      }}
    >
      <h2 className="text-lg font-bold text-foreground mb-5">
        {t("settings.personal")}
      </h2>

      {/* Avatar upload section */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">
          {t("settings.avatar") || "Foto de perfil"}
        </p>
        <AvatarUpload
          currentUrl={avatarUrl}
          userName={userName || name}
          userId={userId || ""}
          onAvatarChange={(url) => setAvatarUrl(url)}
          isDemo={isDemo}
        />
      </div>

      <div className="max-w-md space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="settings-name"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("settings.name")}
          </label>
          <input
            id="settings-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base"
            style={{ backgroundColor: "var(--input-background)" }}
          />
        </div>

        {/* Vocation */}
        <div>
          <label
            htmlFor="settings-vocation"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            {t("comp.post.techReq")}
          </label>
          <input
            id="settings-vocation"
            name="vocation"
            type="text"
            value={vocation}
            onChange={(e) => setVocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base"
            style={{ backgroundColor: "var(--input-background)" }}
            placeholder={t("settings.vocationPlaceholder") || "Ej: Desarrollador Frontend"}
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          <Save size={16} />
          {saving ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin inline-block" />
              {t("common.loading")}
            </span>
          ) : (
            t("save")
          )}
        </button>
      </div>
    </section>
  );
}
