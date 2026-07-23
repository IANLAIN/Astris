import { useState, useEffect } from "react";
import { Lang, PaletteKey, FontKey, Role } from "@/types";
import { useT } from "@/i18n/useT";
import { getCurrentUser, updateProfile, deleteAccount, isDemoUserId } from "@/services/dataSource";
import { ProfileSettings } from "./settings/ProfileSettings";
import { VisualSettings } from "./settings/VisualSettings";
import { DangerZoneSettings } from "./settings/DangerZoneSettings";

export function SettingsPage({
  lang,
  palette,
  darkMode,
  font,
  onPalette,
  onDark,
  onFont,
  onLogout,
}: {
  lang: Lang;
  palette: PaletteKey;
  darkMode: boolean;
  font: FontKey;
  onPalette: (p: PaletteKey) => void;
  onDark: (d: boolean) => void;
  onFont: (f: FontKey) => void;
  onLogout: () => void;
}) {
  const t = useT(lang);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [vocation, setVocation] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        setName(user.name);
        setAvatarUrl((user as any).avatarUrl || "");
        setVocation((user as any).vocation || "");
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!userId || !name.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(userId, name, avatarUrl, vocation);
      setMessage({ text: t("settings.saveSuccess"), type: "success" });
    } catch (e: any) {
      setMessage({ text: e.message || "Error al actualizar perfil.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await deleteAccount();
      onLogout();
    } catch (e: any) {
      console.error(e);
      setMessage({ text: t("settings.deleteError"), type: "error" });
      setShowDeleteConfirm(false);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-muted-foreground">...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("settings.title")}</h1>

      {message && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center gap-2 font-medium"
          style={{
            backgroundColor: message.type === "success" ? "#F0FDF4" : "#FEF2F2",
            color: message.type === "success" ? "#166534" : "#C0392B",
          }}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        <ProfileSettings
          t={t}
          name={name}
          setName={setName}
          vocation={vocation}
          setVocation={setVocation}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          userId={userId || undefined}
          userName={name}
          isDemo={isDemoUserId(userId || "")}
          handleSaveProfile={handleSaveProfile}
          saving={saving}
        />

        <VisualSettings
          t={t}
          lang={lang}
          darkMode={darkMode}
          onDark={onDark}
          font={font}
          onFont={onFont}
          palette={palette}
          onPalette={onPalette}
        />

        <DangerZoneSettings
          t={t}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDeleteAccount={handleDeleteAccount}
          saving={saving}
        />
      </div>
    </div>
  );
}
