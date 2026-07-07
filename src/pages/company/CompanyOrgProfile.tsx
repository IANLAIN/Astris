import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { supabase } from "@/services/supabase";

export function CompanyOrgProfile({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [open, setOpen] = useState<Record<string, boolean>>({ general: true });
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  const sectionTitles = C(lang, "orgSections") as string[];
  const sectionIds = C(lang, "orgSectionIds") as string[];
  const SECTIONS = sectionTitles.map((title, i) => ({ id: sectionIds[i], title }));
  const PRESTACIONES = ["Audífonos con cancelación de ruido", "Teclados especializados", "Pantallas anti-reflejo", "Rampas y ascensores", "Salas de descanso sensorial", "Modalidad remota e híbrida disponible"];
  const POLITICAS = ["Pausas activas programadas", "Flexibilidad de horario"];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    country: "",
    city: "",
    philosophy: "",
    noise: "",
    light: "",
    layout: "",
    accommodations: [] as string[],
    policies: [] as string[],
  });

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from("companies").select("*").eq("user_id", session.user.id).single();
      if (data) {
        let env: any = {};
        try { env = JSON.parse(data.work_environment || "{}"); } catch (e) { }
        setFormData({
          company_name: data.company_name || "",
          industry: data.industry || "",
          company_size: env.company_size || "",
          country: env.country || "",
          city: env.city || "",
          philosophy: data.philosophy || "",
          noise: env.noise || "",
          light: env.light || "",
          layout: env.layout || "",
          accommodations: data.accommodations || [],
          policies: env.policies || [],
        });
      } else {
        if (session.user.id === "demo-comp" || session.user.email === "empresa@astris.org") {
          setFormData({
            company_name: "Veritas Analytics (Demo)",
            industry: "Análisis de Datos",
            company_size: "50-200 empleados",
            country: "España",
            city: "Madrid",
            philosophy: "Creemos fervientemente en el talento sin barreras. Nos esforzamos por crear un entorno inclusivo donde la neurodiversidad sea vista como nuestra mayor fortaleza competitiva.",
            noise: "Bajo (oficina silenciosa)",
            light: "Luz natural abundante",
            layout: "Cubículos individuales y zonas silenciosas",
            accommodations: ["Modalidad remota e híbrida disponible", "Salas de descanso sensorial"],
            policies: ["Flexibilidad de horario", "Pausas activas programadas"],
          });
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (field: string, val: string) => setFormData(p => ({ ...p, [field]: val }));

  const toggleArray = (field: "accommodations" | "policies", item: string) => {
    setFormData(p => ({
      ...p,
      [field]: p[field].includes(item) ? p[field].filter(x => x !== item) : [...p[field], item]
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !saving) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const env = JSON.stringify({
      noise: formData.noise,
      light: formData.light,
      layout: formData.layout,
      policies: formData.policies,
      company_size: formData.company_size,
      country: formData.country,
      city: formData.city
    });

    const { error } = await supabase.from("companies").upsert({
      user_id: session.user.id,
      company_name: formData.company_name || "Sin nombre",
      industry: formData.industry,
      philosophy: formData.philosophy,
      work_environment: env,
      accommodations: formData.accommodations
    });

    setSaving(false);
    if (!error) {
      setMessage(t("comp.org.saveSuccess"));
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(t("comp.org.saveError"));
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center text-muted-foreground">Cargando...</div>;

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
                      { label: "Nombre de la organización", field: "company_name" },
                      { label: "Sector de actividad", field: "industry" },
                      { label: "Tamaño de la organización", field: "company_size" },
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
                          onKeyDown={handleKeyDown}
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
                    <label htmlFor="org-philosophy" className="sr-only">Cultura de la empresa</label>
                    <textarea
                      id="org-philosophy"
                      name="philosophy"
                      value={formData.philosophy}
                      onChange={(e) => handleChange("philosophy", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey && !saving) {
                          handleSave();
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary min-h-[100px] resize-y"
                      style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
                      placeholder="Describe la filosofía y cultura de tu empresa..."
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
                          onKeyDown={handleKeyDown}
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
