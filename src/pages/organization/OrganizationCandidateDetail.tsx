import { useState, useEffect } from "react";
import { ChevronLeft, Shield, Users, Check, X } from "lucide-react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";
import { getMatchesForOrganization, getCurrentUser } from "@/services/supabase";
import { CANDIDATE_RADAR_FINAL } from "@/services/demoData";
import { MatchBadge } from "@/components/common/MatchBadge";
import { RadarViz } from "@/components/common/RadarViz";

export function OrganizationCandidateDetail({ lang, candidateId, onBack, onStart }: { lang: Lang; candidateId: string; onBack: () => void; onStart: () => void }) {
  const t = useT(lang);
  const [match, setMatch] = useState(85);
  const [radar, setRadar] = useState(CANDIDATE_RADAR_FINAL);
  const [env, setEnv] = useState<Array<{req: string; met: boolean}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      const companyId = user?.id || "demo-comp";
      const matches = await getMatchesForOrganization(companyId);
      const found = matches.find((m: any) => m.candidateId === candidateId);
      if (found) {
        setMatch(found.matchPercentage);
        setRadar(found.radar || CANDIDATE_RADAR_FINAL);
        setEnv(found.env || []);
      }
      setLoading(false);
    })();
  }, [candidateId]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-4 md:py-8 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4"><ChevronLeft size={15} aria-hidden="true" />{t("back")}</button>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{t("comp.detail.title")}</div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{candidateId.substring(0, 8)}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Shield size={13} aria-hidden="true" style={{ color: "var(--accent)" }} />{"Perfil anónimo"}
            </div>
          </div>
          <MatchBadge value={match} size="lg" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 lg:px-20 py-10 flex gap-5 md:gap-10">
        <div className="flex-1">
          <h2 className="font-bold text-foreground mb-2">{"Perfil de compatibilidad"}</h2>
          <RadarViz data={radar} height={300} outerRadius={100} fontSize={12} />
        </div>
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-4 text-sm">{"Entorno requerido"}</h3>
            <div className="flex flex-col gap-2.5">
              {env.map((e: any) => (
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
            <Users size={16} aria-hidden="true" />{t("vacancy.start")}
          </button>
        </div>
      </div>
    </div>
  );
}
