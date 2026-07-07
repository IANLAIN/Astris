import { useState, useEffect } from "react";
import { Clock, MapPin, Check, X, ArrowRight, ChevronLeft } from "lucide-react";
import { Lang, VacancyItem } from "@/types";
import { useT } from "@/i18n/useT";
import { supabase, getMatchesForCandidate } from "@/services/supabase";
import { MatchBadge } from "@/components/common/MatchBadge";
import { VACANCIES_FALLBACK } from "@/mock";

export function VacancyDetail({ lang, vacancyId, onStart, onBack }: { lang: Lang; vacancyId: string; onStart: () => void; onBack: () => void }) {
  const t = useT(lang);
  const [v, setV] = useState<VacancyItem | null>(null);

  useEffect(() => {
    async function loadData() {
      let currentMatch = 90;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const matches = await getMatchesForCandidate(session.user.id);
        const m = matches.find((x: any) => x.jobId === vacancyId);
        if (m) currentMatch = m.matchPercentage;
      }

      if (vacancyId.startsWith("V-")) {
        setV(VACANCIES_FALLBACK.find((x) => x.id === vacancyId) ?? { ...VACANCIES_FALLBACK[0], match: currentMatch });
        return;
      }

      const { data } = await supabase
        .from("jobs")
        .select(`id, title, description, company_id, work_modality, location_text, contract_type, offered_accommodations`)
        .eq("id", vacancyId)
        .single();

      if (data) {
        const j: any = data;
        let companyName = "Empresa";
        let companyPhilosophy = "";
        if (j.company_id) {
          const { data: comp } = await supabase.from("companies").select("user_id, company_name, philosophy").eq("user_id", j.company_id).single();
          if (comp) {
            companyName = comp.company_name ?? companyName;
            companyPhilosophy = comp.philosophy ?? "";
          }
        }
        setV({
          id: j.id,
          title: j.title,
          company: companyName,
          sector: "-",
          modality: j.work_modality === "remote" ? (t("auto.remoto._6")) : j.work_modality === "hybrid" ? (t("auto.h_brido._7")) : (t("auto.presencial._8")),
          type: j.contract_type ?? (t("auto.tiempo_completo._9")),
          match: currentMatch,
          socialLevel: "Bajo",
          adjustments: j.offered_accommodations ?? [],
          desc: j.description ?? "",
          companyDesc: companyPhilosophy,
        });
      } else {
        setV({ ...VACANCIES_FALLBACK[0], match: currentMatch });
      }
    }
    loadData();
  }, [vacancyId, lang]);

  const COMPAT = [{ label: "Modalidad de trabajo", match: true }, { label: "Comunicación asíncrona", match: true }, { label: "Instrucciones escritas", match: true }, { label: "Espacio individual silencioso", match: false }, { label: "Horario flexible", match: true }];

  if (!v) return <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center text-muted-foreground">{t("auto.cargando___._10")}</div>;

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-4 md:py-8 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer mb-4"><ChevronLeft size={15} aria-hidden="true" />{t("back")}</button>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{v.title}</h1>
            <p className="text-muted-foreground mt-0.5">{v.company} · {v.sector}</p>
          </div>
          <MatchBadge value={v.match} size="lg" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col lg:flex-row gap-5 md:gap-10">
        <div className="flex-1">
          <div className="rounded-2xl border border-border p-4 md:p-8 mb-6" style={{ backgroundColor: "var(--card)" }}>
            <h2 className="font-bold text-foreground mb-3">{t("auto.sobre_la_empres._11")}</h2>
            <p className="text-muted-foreground leading-relaxed">{v.companyDesc}</p>
          </div>
          <div className="rounded-2xl border border-border p-4 md:p-8 mb-6" style={{ backgroundColor: "var(--card)" }}>
            <h2 className="font-bold text-foreground mb-3">{t("auto.el_cargo._12")}</h2>
            <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            <div className="flex gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock size={13} aria-hidden="true" />{v.type}</span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={13} aria-hidden="true" />{v.modality}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
            <h2 className="font-bold text-foreground mb-4">{t("vacancy.why")}</h2>
            <div className="flex flex-col gap-2.5">
              {COMPAT.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: c.match ? "var(--accent)" : "var(--muted)" }} aria-hidden="true">
                    {c.match ? <Check size={11} style={{ color: "var(--accent-foreground)" }} /> : <X size={11} style={{ color: "var(--muted-foreground)" }} />}
                  </div>
                  <span className="text-sm text-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-4 text-sm">{t("auto.ajustes_ofrecid._13")}</h3>
            <div className="flex flex-col gap-2">
              {v.adjustments.map((a) => (
                <div key={a} className="flex items-center gap-2.5">
                  <Check size={12} aria-hidden="true" style={{ color: "var(--accent)" }} />
                  <span className="text-sm text-foreground">{a}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onStart} className="w-full flex items-center justify-center gap-2 py-5 rounded-xl font-bold text-base cursor-pointer border-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <ArrowRight size={18} aria-hidden="true" />{t("vacancy.start")}
          </button>
        </div>
      </div>
    </div>
  );
}
