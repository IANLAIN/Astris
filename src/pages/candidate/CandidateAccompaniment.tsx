import { User, MessageSquare, Calendar, Check } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";

export function CandidateAccompaniment({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const STAGES = C(lang, "accompStages") as Array<{ label: string; done: boolean; current: boolean }>;
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("accomp.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("accomp.sub")}</p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 lg:px-20 py-6 md:py-12 flex flex-col md:flex-row gap-12">
        {/* Timeline */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
            {STAGES.map((s, i) => (
              <div key={i} className="relative flex gap-3 md:gap-6 pb-8 last:pb-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 relative z-10" style={{ borderColor: s.current ? "var(--accent)" : s.done ? "var(--primary)" : "var(--muted)", backgroundColor: s.current ? "var(--accent)" : s.done ? "var(--primary)" : "var(--background)" }}>
                  {s.done ? <Check size={16} aria-hidden="true" style={{ color: "var(--primary-foreground)" }} /> : s.current ? <div className="w-3 h-3 rounded-full bg-white" aria-hidden="true" /> : <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--muted)" }} aria-hidden="true" />}
                </div>
                <div className="flex-1 pt-1.5 pb-4">
                  <div className="font-semibold text-foreground flex items-center gap-3">
                    {s.label}
                    {s.current && <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--accent)" + "22", color: "var(--accent)" }}>{lang === "es" ? "En curso" : lang === "pt" ? "Em andamento" : lang === "fr" ? "En cours" : "In progress"}</span>}
                    {s.done && <span className="text-xs text-muted-foreground">{lang === "es" ? "Completado" : lang === "pt" ? "Concluído" : lang === "fr" ? "Terminé" : "Completed"}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Mentor info */}
        <div className="w-full md:w-72 shrink-0">
          <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="font-bold text-foreground mb-5 text-sm">{C(lang, "mentorAssigned")}</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }} aria-hidden="true">
                <User size={22} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <div className="font-bold text-foreground">Carmen Ruiz</div>
                <div className="text-xs text-muted-foreground">Inclusión laboral y funciones ejecutivas</div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold cursor-pointer text-sm border border-border mb-2.5" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
              <MessageSquare size={14} aria-hidden="true" />{C(lang, "openNotes")}
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Calendar size={14} aria-hidden="true" />{C(lang, "scheduleCheckin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
