import { useState, useEffect } from "react";
import { ChevronLeft, Shield, Users, Check, X } from "lucide-react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";
import { supabase, getMatchesForCompany } from "@/services/supabase";
import { MatchBadge } from "@/components/common/MatchBadge";
import { RadarViz } from "@/components/common/RadarViz";

export function CompanyCandidateDetail({ lang, candidateId, onBack, onStart }: { lang: Lang; candidateId: string; onBack: () => void; onStart: () => void }) {
  const t = useT(lang);
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidate() {
      let currentMatch = 80;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const matches = await getMatchesForCompany(session.user.id);
        const m = matches.find((x: any) => x.candidateId === candidateId);
        if (m) currentMatch = m.matchPercentage;
      }

      const { data } = await supabase
        .from("users_profiles")
        .select("*, candidates(*)")
        .eq("id", candidateId)
        .single();

      if (data) {
        setCandidate({ ...data, profile: data.candidates?.[0] ?? {}, match: currentMatch });
      }
      setLoading(false);
    }
    loadCandidate();
  }, [candidateId]);

  if (loading) return <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center text-muted-foreground">Cargando...</div>;
  if (!candidate) return <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center text-muted-foreground">Candidato no encontrado.</div>;

  const profile = candidate.profile || {};
  const radar = [
    { axis: "Procesamiento", value: profile.work_preference ? 80 : 55 },
    { axis: "T. Ambiental", value: profile.ideal_environment ? 70 : 50 },
    { axis: "Ejecución", value: profile.interests ? 75 : 45 },
    { axis: "Ajustes", value: profile.accessibility_theme || profile.accessibility_font ? 85 : 50 },
  ];
  const env = [
    { req: profile.ideal_environment ? profile.ideal_environment : "Entorno ideal no definido", met: !!profile.ideal_environment },
    { req: profile.interests ? `Intereses: ${profile.interests}` : "Intereses no definidos", met: !!profile.interests },
    { req: profile.accessibility_theme ? `Tema accesible: ${profile.accessibility_theme}` : "Tema accesible no definido", met: !!profile.accessibility_theme },
    { req: profile.accessibility_font ? `Fuente accesible: ${profile.accessibility_font}` : "Fuente accesible no definida", met: !!profile.accessibility_font },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-4 md:py-8 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4"><ChevronLeft size={15} aria-hidden="true" />{t("back")}</button>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{t("comp.detail.title")}</div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{candidate.id}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Shield size={13} aria-hidden="true" style={{ color: "var(--accent)" }} />{t("auto.perfil_an_nimo_._50")}
            </div>
          </div>
          <MatchBadge value={Math.floor(Math.random() * 20) + 80} size="lg" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 lg:px-20 py-10 flex gap-5 md:gap-10">
        <div className="flex-1">
          <h2 className="font-bold text-foreground mb-2">{t("auto.perfil_de_compa._51")}</h2>
          <RadarViz data={radar} height={300} outerRadius={100} fontSize={12} />
        </div>
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-4 text-sm">{t("auto.entorno_requeri._52")}</h3>
            <div className="flex flex-col gap-2.5">
              {env.map((e) => (
                <div key={e.req} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: e.met ? "var(--accent)" : "var(--muted)" }} aria-hidden="true">
                    {e.met ? <Check size={11} style={{ color: "var(--accent-foreground)" }} /> : <X size={11} style={{ color: "var(--muted-foreground)" }} />}
                  </div>
                  <span className="text-sm text-foreground leading-snug">{e.req}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onStart} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Users size={16} aria-hidden="true" />{t("auto.iniciar_proceso._53")}
          </button>
        </div>
      </div>
    </div>
  );
}
