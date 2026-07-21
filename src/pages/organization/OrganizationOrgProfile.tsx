import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { DEMO_USERS } from "@/services/demoData";

export function OrganizationOrgProfile({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [open, setOpen] = useState<Record<string, boolean>>({ general: true });
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  const sectionTitles = C(lang, "orgSections") as string[];
  const sectionIds = C(lang, "orgSectionIds") as string[];
  const SECTIONS = sectionTitles.map((title, i) => ({ id: sectionIds[i], title }));
  const PRESTACIONES: string[] = ["Audífonos con cancelación de ruido", "Teclados especializados", "Pantallas anti-reflejo", "Rampas y ascensores", "Salas de descanso sensorial", "Modalidad remota e híbrida disponible"];
  const POLITICAS: string[] = ["Pausas activas programadas", "Flexibilidad de horario"];

  // Load Vibra Latina demo data
  const demoProfile: any = DEMO_USERS["empresa@astris.org"]?.profile;
  const [formData, setFormData] = useState<Record<string, any>>({
    organization_name: demoProfile?.organization_name || "Vibra Latina",
    industry: demoProfile?.industry || "Audiovisual / Producción",
    organization_size: demoProfile?.organization_size || "10-50 empleados",
    country: demoProfile?.country || "Estados Unidos",
    city: demoProfile?.city || "Austin, TX",
    philosophy: demoProfile?.philosophy || "",
    noise: demoProfile?.noise || "Moderado (ambiente creativo controlado)",
    light: demoProfile?.light || "Luz LED ajustable + luz natural",
    layout: demoProfile?.layout || "Espacios abiertos con zonas de enfoque individual",
    accommodations: demoProfile?.accommodations || PRESTACIONES.slice(0, 3),
    policies: demoProfile?.policies || POLITICAS,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: string, val: string) => setFormData(p => ({ ...p, [field]: val }));

  const toggleArray = (field: "accommodations" | "policies", item: string) => {
    setFormData(p => ({
      ...p,
      [field]: p[field].includes(item) ? p[field].filter((x: string) => x !== item) : [...p[field], item]
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setMessage("");
    // Demo: simulate save
    setTimeout(() => {
      setSaving(false);
      setMessage(t("comp.org.saveSuccess"));
      setTimeout(() => setMessage(""), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col pb-20">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("comp.org.title")}</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">{t("comp.org.sub")}</p>
      </div>
      <div className="w-[95%] md:w-full md:max-w-4xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
            <button onClick={() => toggle(s.id)} className="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer">
              <span className="font-bold text-foreground">{s.title}</span>
              <ChevronDown size={18} aria-hidden="true" className="text-muted-foreground" style={{ transform: open[s.id] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {open[s.id] && (
              <div className="px-7 pb-7 border-t border-border anim-slide-down">
                {s.id === "general" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
                    {[
                      { label: "Nombre de la organización", field: "organization_name" },
                      { label: "Sector de actividad", field: "industry" },
                      { label: "Tamaño de la organización", field: "organization_size" },
                      { label: "País", field: "country" },
                      { label: "Ciudad", field: "city" }
                    ].map((f) => (
                      <div key={f.field}>
                        <label htmlFor={`org-${f.field}`} className="block text-sm font-semibold text-foreground mb-2">{f.label}</label>
                        <input
                          id={`org-${f.field}`}
                          name={f.field}
                          type="text"
                          value={(formData as any)[f.field]}
                          onChange={(e) => handleChange(f.field, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                          placeholder={f.label}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {s.id === "cultura" && (
                  <div className="pt-5">
                    <label htmlFor="org-philosophy" className="sr-only">Cultura de la organización</label>
                    <textarea
                      id="org-philosophy"
                      name="philosophy"
                      value={formData.philosophy}
                      onChange={(e) => handleChange("philosophy", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary min-h-[100px] resize-y"
                      style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                      placeholder="Describe la filosofía y cultura de tu organización..."
                    />
                  </div>
                )}
                {s.id === "entorno" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
                    {[
                      { label: "Nivel de ruido habitual", field: "noise", placeholder: "Ej. Bajo (oficina silenciosa)" },
                      { label: "Tipo de iluminación", field: "light", placeholder: "Ej. Luz natural + LED" },
                      { label: "Distribución de espacios", field: "layout", placeholder: "Ej. Individual" }
                    ].map((f) => (
                      <div key={f.field}>
                        <label htmlFor={`org-${f.field}`} className="block text-sm font-semibold text-foreground mb-2">{f.label}</label>
                        <input
                          id={`org-${f.field}`}
                          name={f.field}
                          type="text"
                          value={(formData as any)[f.field]}
                          onChange={(e) => handleChange(f.field, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {s.id === "prestaciones" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-5">
                    {PRESTACIONES.map((p) => {
                      const offered = formData.accommodations.includes(p);
                      return (
                        <button key={p} onClick={() => toggleArray("accommodations", p)} className="flex items-center gap-3 p-3.5 rounded-xl border border-border cursor-pointer text-left transition-colors" style={{ backgroundColor: offered ? "var(--secondary)" : "var(--background)" }}>
                          <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors" style={{ borderColor: offered ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: offered ? "var(--primary)" : "transparent" }} aria-hidden="true">
                            {offered && <Check size={11} style={{ color: "var(--primary-foreground)" }} />}
                          </div>
                          <span className="text-sm text-foreground">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {s.id === "politicas" && (
                  <div className="flex flex-col gap-4 pt-5">
                    {POLITICAS.map((pol) => {
                      const active = formData.policies.includes(pol);
                      return (
                        <div key={pol} className="flex items-center justify-between cursor-pointer" onClick={() => toggleArray("policies", pol)}>
                          <span className="text-sm font-semibold text-foreground">{pol}</span>
                          <div className="w-12 h-6 rounded-full relative transition-colors" style={{ backgroundColor: active ? "var(--primary)" : "var(--muted)" }} aria-hidden="true">
                            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: active ? "calc(100% - 22px)" : "2px" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center justify-end gap-4 mt-2">
          {message && <span className="text-sm text-green-500 font-medium">{message}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 md:px-8 py-4 rounded-xl font-bold cursor-pointer disabled:opacity-70"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {saving ? "Guardando..." : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
