import { useState, useEffect } from "react";
import { Calendar, MessageSquare, ShieldAlert } from "lucide-react";
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
    { date: "Jun 18, 2025", cand: "Bryan Gonzalez", company: "Vibra Latina", type: C(lang, "mentor.checkin.onboardingWeek2") as string, time: "10:00 AM" },
    { date: "Jun 20, 2025", cand: "Candidato Diseñador", company: "Vibra Latina", type: C(lang, "mentor.checkin.interviewPrep") as string, time: "2:00 PM" },
    { date: "Jun 24, 2025", cand: "Candidato SysAdmin", company: "Closer To The Stars Foundation", type: C(lang, "mentor.checkin.review30") as string, time: "11:30 AM" },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-8 sm:py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground ">{C(lang, "checkinPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "checkinPageSub") as string}</p>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 lg:px-20 py-8 sm:py-10 flex flex-col gap-4 sm:gap-5">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : !isDemoUser ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
              <ShieldAlert size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay check-ins programados</h3>
            <p className="text-muted-foreground max-w-sm">Aún no tienes sesiones programadas con candidatos.</p>
          </div>
        ) : DEMO_CHECKINS.map((item) => (
          <article key={item.cand} className="rounded-2xl border border-border p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }}>
              <Calendar size={20} aria-hidden="true" style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground">{item.cand} × {item.company}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{item.type}</div>
              <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "DM Mono, monospace" }}>{item.date} · {item.time}</div>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <MessageSquare size={14} aria-hidden="true" />
              {C(lang, "scheduleSession") as string}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
