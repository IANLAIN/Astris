import { useState, useEffect } from "react";
import { MessageSquare, Calendar, Activity, BarChart2, ShieldAlert, CheckCircle2, Clock, Users, ArrowRight, UserCircle } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { getCurrentUser, isDemoUserUser } from "@/services/dataSource";
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
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background pb-12">
      {/* Premium Header / Banner */}
      <div className="w-full h-40 md:h-56 relative overflow-hidden bg-primary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.5 }} />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-card border-4 border-background shadow-xl flex items-center justify-center shrink-0 overflow-hidden relative">
            <UserCircle size={60} className="text-primary/50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <div className="flex-1 pb-2">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{t("mentor.dash.title")}</div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Elena Vargas</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">Entornos laborales diversos y funciones ejecutivas</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {([
            { val: "3", label: C(lang, "mentorProcesses"), color: "text-primary", bg: "bg-primary/10", icon: Users },
            { val: "2", label: C(lang, "mentor.dash.pendingSessions"), color: "text-accent", bg: "bg-accent/10", icon: Clock },
            { val: "12", label: C(lang, "mentor.dash.completed"), color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2 },
            { val: "91%", label: C(lang, "mentor.dash.retention"), color: "text-blue-500", bg: "bg-blue-500/10", icon: Activity }
          ] as const).map(({ val, label, color, bg, icon: Icon }) => (
            <div key={label as string} className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-bold mb-1 ${color}`} style={{ fontFamily: "DM Mono, monospace" }}>{val}</div>
              <div className="text-xs sm:text-sm font-semibold text-muted-foreground">{label as string}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">{C(lang, "mentorProcesses") as string}</h3>
          </div>
          
          <div className="flex flex-col gap-5">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
            ) : processes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4 border-2 border-dashed border-border rounded-3xl">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-500/10">
                  <ShieldAlert size={32} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No hay procesos activos</h3>
                <p className="text-muted-foreground max-w-sm">Aún no tienes procesos de acompañamiento asignados.</p>
              </div>
            ) : processes.map((proc) => (
              <article key={proc.cid} className="rounded-3xl border border-border p-5 sm:p-7 transition-all duration-300 hover:shadow-xl hover:border-primary/40 group bg-card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: proc.stageColor + "15", color: proc.stageColor }}>{proc.stage}</span>
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "DM Mono, monospace" }}>{proc.cid}</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">{proc.role}</h4>
                    <div className="text-muted-foreground font-medium text-sm mt-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary/50 transition-colors" /> {proc.company}
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0 bg-background rounded-2xl p-3 border border-border">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{C(lang, "mentor.dash.activeSince") as string}</div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{proc.days}d</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl mb-5 border border-border/50 bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-muted-foreground" />
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{C(lang, "sessionNotes") as string}</div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium">{proc.notes}</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pt-4 border-t border-border">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{C(lang, "nextAction") as string}</div>
                    <div className="text-sm font-semibold text-foreground bg-background px-3 py-1.5 rounded-lg border border-border inline-block">{proc.action}</div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto shrink-0">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer text-sm border-2 border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <MessageSquare size={16} />{C(lang, "notes") as string}
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold cursor-pointer text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                      <Calendar size={16} />{C(lang, "scheduleSession") as string}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-6">
          {/* Upcoming Checkins */}
          <div className="rounded-3xl border border-border p-6 bg-card shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar size={16} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base">{C(lang, "mentorCheckins") as string}</h3>
              </div>
              <button className="text-xs font-bold text-primary hover:underline cursor-pointer">Ver todos</button>
            </div>
            
            <div className="flex flex-col gap-3">
              {[["Jun 18", "Bryan Gonzalez", "Vibra Latina", "Onboarding"], ["Jun 20", "Cand. Diseñador", "Vibra Latina", "Entrevista"], ["Jun 24", "Cand. SysAdmin", "Closer To Stars", "Revisión 30d"]].map(([date, cand, comp, type]) => (
                <div key={date as string} className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-background hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="text-xs font-bold shrink-0 pt-0.5 text-primary" style={{ fontFamily: "DM Mono, monospace" }}>{date}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{cand as string}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-border" />{comp as string}</div>
                    <div className="text-xs font-medium text-foreground mt-1.5 px-2 py-0.5 rounded-md bg-secondary inline-block">{type as string}</div>
                  </div>
                  <ChevronRightIcon className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Impact */}
          <div className="rounded-3xl border border-border p-6 bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Activity size={16} className="text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-base">{C(lang, "mentorImpact") as string}</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {([[t("mentor.accompanied_interviews"), "5", "100%"], [t("mentor.completed_onboardings"), "2", "66%"], [t("mentor.negotiated_adjustments"), "8", "80%"]] as const).map(([label, val, pct]) => (
                <div key={label as string} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{label as string}</span>
                    <span className="font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{val as string}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: pct as string }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats Report */}
          <div className="rounded-3xl border border-border p-6 bg-card shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart2 size={16} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-foreground text-base">{t("mentor.dash.report")}</h3>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">{t("mentor.dash.accompaniment_hours")}</span>
                <span className="font-bold text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>24h</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">{t("mentor.dash.completed_sessions")}</span>
                <span className="font-bold text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>12</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">{t("mentor.dash.active_candidates")}</span>
                <span className="font-bold text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>3</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-muted-foreground">{t("mentor.dash.linked_organizations")}</span>
                <span className="font-bold text-foreground text-sm" style={{ fontFamily: "DM Mono, monospace" }}>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
