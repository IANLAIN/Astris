import { useState, useEffect } from "react";
import { Calendar, MessageSquare, ShieldAlert, CalendarDays, Clock, Video } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { getCurrentUser, isDemoUserUser } from "@/services/supabase";

export function MentorCheckins({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [isDemoUser, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setIsDemo(user ? isDemoUserUser(user.id) : false);
      setLoading(false);
    })();
  }, []);

  const DEMO_CHECKINS = [
    { date: "Jun 18, 2025", cand: "Bryan Gonzalez", company: "Vibra Latina", type: C(lang, "mentor.checkin.onboardingWeek2") as string, time: "10:00 AM", duration: "45 min" },
    { date: "Jun 20, 2025", cand: "Candidato Diseñador", company: "Vibra Latina", type: C(lang, "mentor.checkin.interviewPrep") as string, time: "2:00 PM", duration: "60 min" },
    { date: "Jun 24, 2025", cand: "Candidato SysAdmin", company: "Closer To The Stars Foundation", type: C(lang, "mentor.checkin.review30") as string, time: "11:30 AM", duration: "30 min" },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background pb-12">
      {/* Premium Header / Banner */}
      <div className="w-full h-40 md:h-56 relative overflow-hidden bg-primary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.5 }} />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-card border-4 border-background shadow-xl flex items-center justify-center shrink-0 overflow-hidden relative">
            <CalendarDays size={60} className="text-primary/50" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">{C(lang, "checkinPageTitle") as string}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">{C(lang, "checkinPageSub") as string}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : !isDemoUser ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4 border-2 border-dashed border-border rounded-3xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-500/10">
              <ShieldAlert size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay check-ins programados</h3>
            <p className="text-muted-foreground max-w-sm">Aún no tienes sesiones programadas con candidatos.</p>
          </div>
        ) : DEMO_CHECKINS.map((item) => (
          <article key={item.cand} className="rounded-3xl border border-border p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-300 group">
            
            {/* Calendar Box */}
            <div className="w-24 h-24 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center justify-center shrink-0 overflow-hidden group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
              <div className="bg-primary w-full py-1.5 text-center text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                {item.date.split(" ")[0]}
              </div>
              <div className="flex-1 flex flex-col items-center justify-center pt-1">
                <span className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-none">{item.date.split(" ")[1].replace(",", "")}</span>
                <span className="text-xs font-semibold text-muted-foreground mt-1">{item.date.split(" ")[2]}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-secondary text-foreground">{item.type}</span>
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-border" /> {item.company}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.cand}</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground bg-background px-4 py-2.5 rounded-xl border border-border/50 inline-flex w-fit">
                <span className="flex items-center gap-1.5 text-foreground"><Clock size={16} className="text-primary/70" /> {item.time}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">{item.duration}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5"><Video size={16} /> Videollamada</span>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex flex-col gap-3">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold cursor-pointer text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                <Video size={16} aria-hidden="true" /> Iniciar Sesión
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold cursor-pointer text-sm border-2 border-border bg-background text-foreground hover:bg-secondary transition-colors">
                <MessageSquare size={16} aria-hidden="true" />
                {C(lang, "compPostHireSendMsg") as string}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
