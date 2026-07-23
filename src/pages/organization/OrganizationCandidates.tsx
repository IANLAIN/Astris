import { useState, useEffect } from "react";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";
import { getMatchesForOrganization, getCurrentUser } from "@/services/dataSource";
import { MatchBadge } from "@/components/common/MatchBadge";

export function OrganizationCandidates({ lang, onSelect }: { lang: Lang; onSelect: (id: string) => void }) {
  const t = useT(lang);
  const [candidates, setCandidates] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      const companyId = user?.id || "demo-comp";
      const matches = await getMatchesForOrganization(companyId);
      setCandidates(matches.map((m: any) => ({
        id: m.candidateId,
        match: m.matchPercentage,
        strengths: m.strengths,
      })));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("comp.candidates.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("comp.candidates.sub")}</p>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-20 py-10">
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="grid border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide px-7 py-4" style={{ gridTemplateColumns: "1fr 2fr 100px 160px", backgroundColor: "var(--muted)" }}>
            <span>Identificador</span><span>Resumen de fortalezas</span><span className="text-center">Compatibilidad</span><span />
          </div>
          {loading ? (
            <div className="px-7 py-12 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-7 py-16 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
                <ShieldAlert size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No hay candidatos</h3>
              <p className="text-muted-foreground max-w-sm">
                Aún no hay perfiles sugeridos para tu organización. Publica una vacante para comenzar a recibir candidatos.
              </p>
            </div>
          ) : candidates.map((c, i) => (
            <div key={c.id} className="grid items-center px-7 py-5 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors group" style={{ gridTemplateColumns: "1fr 2fr 100px 160px", backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--card)" }}>
              <div className="font-mono text-sm font-bold group-hover:text-primary transition-colors" style={{ color: "var(--primary)", fontFamily: "DM Mono, monospace" }}>{c.id.substring(0, 8)}</div>
              <div className="text-sm text-muted-foreground leading-relaxed pr-4">{c.strengths}</div>
              <div className="flex justify-center"><MatchBadge value={c.match} size="sm" /></div>
              <button onClick={() => onSelect(c.id)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-transform hover:scale-105" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                {t("comp.cand.viewProfile")}<ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
