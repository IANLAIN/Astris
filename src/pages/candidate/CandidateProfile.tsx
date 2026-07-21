import { useState, useEffect } from "react";
import { User, Briefcase, CheckCircle, HeartHandshake, Loader2 } from "lucide-react";
import { Lang, QuizAnswers } from "@/types";
import { useT, computeRadar } from "@/i18n/useT";
import { getCurrentUser, getCandidateDashboardStats, CandidateDashboardStats } from "@/services/supabase";
import { CANDIDATE_RADAR_FINAL } from "@/services/demoData";
import { RadarViz } from "@/components/common/RadarViz";
import { QUIZ_AXES } from "@/i18n/content";

export function CandidateProfile({
  lang,
  answers,
  userName,
  userAvatar,
  vocation,
  userId,
}: {
  lang: Lang;
  answers: QuizAnswers;
  userName?: string;
  userAvatar?: string;
  vocation?: string;
  userId?: string;
}) {
  const t = useT(lang);
  const [isDemoUser, setIsDemo] = useState(false);
  const [stats, setStats] = useState<CandidateDashboardStats>({ vacancies: 0, matches: 0, accompanimentActive: false });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setIsDemo(
        u?.id === "demo-cand" ||
          u?.id === "demo-comp" ||
          u?.id === "demo-ment" ||
          u?.id === "admin-backdoor"
      );
    });
  }, []);

  // Fetch live dashboard stats
  useEffect(() => {
    if (!userId) return;
    getCandidateDashboardStats(userId).then((s) => {
      setStats(s);
      setStatsLoading(false);
    }).catch(() => {
      setStatsLoading(false);
    });
  }, [userId]);

  const hasQuizAnswers = Object.keys(answers).length > 0;
  const radarData = hasQuizAnswers
    ? computeRadar(answers)
    : isDemoUser
      ? CANDIDATE_RADAR_FINAL
      : computeRadar(answers);

  const firstName = userName ? userName.split(" ")[0] : t("role.candidate");

  // Compute active adjustments from axis 4
  const adjustments: string[] = (() => {
    const axis = QUIZ_AXES[3];
    const active: string[] = [];
    if (answers[3]) {
      Object.entries(answers[3]).forEach(([qi, ans]) => {
        const qIdx = Number(qi);
        if (Array.isArray(ans) && qIdx < axis.questions.length) {
          ans.forEach((oi: number) => {
            const oText =
              axis.questions[qIdx].opts[lang]?.[oi] ??
              axis.questions[qIdx].opts.es[oi];
            if (oText && oi !== axis.questions[qIdx].opts.es.length - 1) {
              active.push(oText);
            }
          });
        }
      });
    }
    if (active.length === 0) {
      active.push(
        t("profile.flexible_hours"),
        t("profile.async_comm"),
        t("profile.quiet_environment")
      );
    }
    return active;
  })();

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background">
      {/* Dashboard Header */}
      <div className="px-4 lg:px-12 py-8 border-b border-border bg-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 border-background shadow-sm shrink-0 bg-secondary flex items-center justify-center">
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("dash.welcome")}{" "}
                <span className="text-primary">{firstName}</span>
              </h1>
              {vocation && (
                <p className="text-muted-foreground mt-1 text-sm md:text-base font-medium">
                  {vocation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-xl border border-border bg-background p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary text-primary-foreground shrink-0">
              <Briefcase size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted-foreground truncate">
                {t("dash.suggested")}
              </div>
              {statsLoading ? (
                <Loader2 size={20} className="mt-2 text-muted-foreground animate-spin" />
              ) : (
                <div className="text-2xl font-bold text-foreground mt-1">{stats.vacancies}</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(245,196,66,0.15)", color: "#F5C442" }}
            >
              <CheckCircle size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted-foreground truncate">
                {t("dash.matches")}
              </div>
              {statsLoading ? (
                <Loader2 size={20} className="mt-2 text-muted-foreground animate-spin" />
              ) : (
                <div className="text-2xl font-bold text-foreground mt-1">{stats.matches}</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981" }}
            >
              <HeartHandshake size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted-foreground truncate">
                {t("dash.mentor")}
              </div>
              {statsLoading ? (
                <Loader2 size={20} className="mt-2 text-muted-foreground animate-spin" />
              ) : (
                <div className="text-lg font-bold mt-1 text-emerald-500 truncate">
                  {stats.accompanimentActive ? t("dash.active") : t("dash.inactive")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 px-4 lg:px-12 py-10 flex flex-col lg:flex-row gap-8 max-w-[1600px] w-full mx-auto">
        {/* Left: Radar */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">
              {t("profile.cognitive_profile")}
            </h2>
            <div className="flex justify-center items-center w-full overflow-hidden">
              <RadarViz data={radarData} height={280} outerRadius={85} fontSize={10} />
            </div>
          </div>
        </div>

        {/* Right: Adjustments & Activity */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              {t("profile.adjustments")}
            </h2>
            {adjustments.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {adjustments.map((adj, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"
                  >
                    {adj}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("profile.recent_activity")}
            </h2>
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border rounded-xl">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3">
                <User className="text-muted-foreground" size={24} aria-hidden="true" />
              </div>
              <p className="text-foreground font-semibold">{t("profile.up_to_date")}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {t("profile.explore_vacancies")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
