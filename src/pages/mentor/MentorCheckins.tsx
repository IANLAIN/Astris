import { useState, useEffect } from "react";
import { Calendar, MessageSquare, ShieldAlert } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { getCurrentUser, isDemoUser } from "@/services/supabase";

export function MentorCheckins({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setIsDemo(user ? isDemoUser(user.id) : false);
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
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{C(lang, "checkinPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "checkinPageSub") as string}</p>
      </div>
      <div className="w-[95%] md:w-full md:max-w-4xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-5">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : !isDemo ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
              <ShieldAlert size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay check-ins programados</h3>
            <p className="text-muted-foreground max-w-sm">Aún no tienes sesiones programadas con candidatos.</p>
          </div>
        ) : DEMO_CHECKINS.map((item) => (
          <article key={item.cand} className="rounded-2xl border border-border p-6 flex items-center gap-3 md:gap-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }}>
              <Calendar size={24} aria-hidden="true" style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground">{item.cand} × {item.company}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{item.type}</div>
              <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "DM Mono, monospace" }}>{item.date} · {item.time}</div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <MessageSquare size={14} aria-hidden="true" />
              {C(lang, "scheduleSession") as string}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
