import { useState, useEffect } from "react";
import { MessageSquare, Calendar, Activity, BarChart2, ShieldAlert } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { getCurrentUser, isDemoUserUser } from "@/services/supabase";
import { MENTOR_PROCESSES } from "@/services/demoData";

export function MentorDashboard({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      const demo = user ? isDemoUserUser(user.id) : false;
      if (demo) {
        setProcesses(MENTOR_PROCESSES);
      } else {
        setProcesses([]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-4 lg:px-20 py-8 sm:py-10 max-w-7xl mx-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("mentor.dash.title")}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Elena Vargas</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Entornos laborales diversos y funciones ejecutivas</p>
        </div>
      </div>
      <div className="border-b border-border" style={{ backgroundColor: "var(--background)" }}>
        <div className="px-4 lg:px-20 py-5 max-w-7xl mx-auto grid grid-cols-2 gap-4 md:gap-6 lg:gap-10">
          {([["3", C(lang, "mentorProcesses"), "var(--primary)"], ["2", C(lang, "mentor.dash.pendingSessions"), "var(--accent)"], ["12", C(lang, "mentor.dash.completed"), "var(--muted-foreground)"], ["91%", C(lang, "mentor.dash.retention"), "var(--accent)"]] as const).map(([val, label, color]) => (
            <div key={label as string} className="flex flex-col gap-1">
              <div className="text-xl sm:text-2xl font-bold" style={{ color: color as string, fontFamily: "DM Mono, monospace" }}>{val}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{label as string}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 lg:px-20 py-6 md:py-10 flex-col lg:flex-row gap-6 md:gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">{C(lang, "mentorProcesses") as string}</h3>
          <div className="flex flex-col gap-4 sm:gap-5">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
            ) : processes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
                  <ShieldAlert size={32} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No hay procesos activos</h3>
                <p className="text-muted-foreground max-w-sm">Aún no tienes procesos de acompañamiento asignados.</p>
              </div>
            ) : processes.map((proc) => (
              <article key={proc.cid} className="rounded-2xl border border-border p-4 sm:p-5 md:p-7 transition-all duration-300 hover:shadow-xl hover:border-primary group" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: proc.stageColor + "22", color: proc.stageColor }}>{proc.stage}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "DM Mono, monospace" }}>{proc.cid}</span>
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors break-words">{proc.role}</h4>
                    <div className="text-muted-foreground text-sm break-words">{proc.company}</div>
                  </div>
                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                    <div className="text-xs text-muted-foreground">{C(lang, "mentor.dash.activeSince") as string}</div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{proc.days}d</div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl mb-4 border border-border group-hover:border-primary/30 transition-colors" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">{C(lang, "sessionNotes") as string}</div>
                  <p className="text-sm text-foreground leading-relaxed">{proc.notes}</p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">{C(lang, "nextAction") as string}</div>
                    <div className="text-sm font-semibold text-foreground break-words">{proc.action}</div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border transition-colors hover:bg-secondary hover:border-primary/50" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}><MessageSquare size={14} aria-hidden="true" />{C(lang, "notes") as string}</button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-transform hover:scale-105" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}><Calendar size={14} aria-hidden="true" />{C(lang, "scheduleSession") as string}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-5 sm:p-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4"><Calendar size={15} aria-hidden="true" style={{ color: "var(--primary)" }} /><h3 className="font-bold text-foreground text-sm">{C(lang, "mentorCheckins") as string}</h3></div>
            <div className="flex flex-col gap-3">
              {[["Jun 18", "Bryan Gonzalez × Vibra Latina", "Onboarding semana 2"], ["Jun 20", "Candidato Diseñador × Vibra Latina", "Preparación entrevista"], ["Jun 24", "Candidato SysAdmin × Closer To The Stars", "Revisión de 30 días"]].map(([date, cand, type]) => (
                <div key={date as string} className="flex items-start gap-3 p-3 rounded-xl border border-border" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-xs font-bold shrink-0 pt-0.5" style={{ color: "var(--primary)", fontFamily: "DM Mono, monospace" }}>{date}</div>
                  <div className="min-w-0"><div className="text-xs font-semibold text-foreground leading-tight">{cand as string}</div><div className="text-xs text-muted-foreground mt-0.5">{type as string}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border p-5 sm:p-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4"><Activity size={15} aria-hidden="true" style={{ color: "var(--accent)" }} /><h3 className="font-bold text-foreground text-sm">{C(lang, "mentorImpact") as string}</h3></div>
            {([[t("mentor.accompanied_interviews"), "5"], [t("mentor.completed_onboardings"), "2"], [t("mentor.negotiated_adjustments"), "8"]] as const).map(([label, val]) => (
              <div key={label as string} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{label as string}</span>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{val as string}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border p-5 sm:p-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4"><BarChart2 size={15} aria-hidden="true" style={{ color: "var(--primary)" }} /><h3 className="font-bold text-foreground text-sm">{t("mentor.dash.report")}</h3></div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-foreground">{t("mentor.dash.accompaniment_hours")}</span>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>24h</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-foreground">{t("mentor.dash.completed_sessions")}</span>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>12</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-foreground">{t("mentor.dash.active_candidates")}</span>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>3</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{t("mentor.dash.linked_organizations")}</span>
                <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
