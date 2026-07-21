import { Save } from "lucide-react";

export function ProfileSettings({
  t,
  name,
  setName,
  vocation,
  setVocation,
  avatarUrl,
  setAvatarUrl,
  handleSaveProfile,
  saving,
}: any) {
  return (
    <section className="p-6 md:p-8 rounded-[2rem] border border-border" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      <h2 className="text-lg font-bold text-foreground mb-5">{t("settings.personal")}</h2>
      <div className="max-w-md">
        <label htmlFor="settings-name" className="block text-sm font-semibold text-foreground mb-2">{t("settings.name")}</label>
        <input 
          id="settings-name"
          name="name"
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base mb-4" 
          style={{ backgroundColor: "var(--input-background)" }} 
        />
        
        <label htmlFor="settings-vocation" className="block text-sm font-semibold text-foreground mb-2">{t("comp.post.techReq")}</label>
        <input 
          id="settings-vocation"
          name="vocation"
          type="text" 
          value={vocation} 
          onChange={(e) => setVocation(e.target.value)} 
          className="w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base mb-4" 
          style={{ backgroundColor: "var(--input-background)" }} 
          placeholder={"Ej: Desarrollador Frontend"}
        />

        <label htmlFor="settings-avatarUrl" className="block text-sm font-semibold text-foreground mb-2">{"URL de foto de perfil"}</label>
        <div className="flex gap-4 items-center mb-6">
          {avatarUrl && (
            <img src={avatarUrl} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover shrink-0 border border-border" />
          )}
          <input 
            id="settings-avatarUrl"
            name="avatarUrl"
            type="text" 
            value={avatarUrl} 
            onChange={(e) => setAvatarUrl(e.target.value)} 
            className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-border text-foreground text-base" 
            style={{ backgroundColor: "var(--input-background)" }} 
            placeholder="https://..."
          />
        </div>

        <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-[1.02]" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
          <Save size={16} /> {saving ? "..." : (t("save"))}
        </button>
      </div>
    </section>
  );
}
