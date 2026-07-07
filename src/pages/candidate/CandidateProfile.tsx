import { Shield, User, Briefcase, HeartHandshake, CheckCircle } from "lucide-react";
import { Lang, QuizAnswers } from "@/types";
import { useT, computeRadar } from "@/i18n/useT";
import { CANDIDATE_RADAR_FINAL } from "@/mock";
import { RadarViz } from "@/components/common/RadarViz";
import { QUIZ_AXES } from "@/i18n/content";

export function CandidateProfile({ lang, answers, userName, userAvatar, vocation }: { lang: Lang; answers: QuizAnswers, userName?: string, userAvatar?: string, vocation?: string }) {
  const t = useT(lang);
  const radarData = Object.keys(answers).length > 0 ? computeRadar(answers) : CANDIDATE_RADAR_FINAL;
  const firstName = userName ? userName.split(" ")[0] : t("role.candidate");

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      {/* ── Dashboard Header ── */}
      <div className="px-4 lg:px-12 py-8 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 border-background shadow-sm shrink-0 flex items-center justify-center bg-secondary">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("dash.welcome")} <span style={{ color: "var(--primary)" }}>{firstName}</span>
              </h1>
              {vocation && <p className="text-muted-foreground mt-1 text-sm md:text-base font-medium">{vocation}</p>}
            </div>
          </div>
        </div>

        {/* ── Quick Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-xl border border-border p-5 flex items-center gap-4 transition-transform hover:-translate-y-1" style={{ backgroundColor: "var(--background)", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Briefcase size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted-foreground truncate">{t("dash.suggested")}</div>
              <div className="text-2xl font-bold text-foreground mt-1">3</div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-5 flex items-center gap-4 transition-transform hover:-translate-y-1" style={{ backgroundColor: "var(--background)", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(245,196,66,0.15)", color: "#F5C442" }}>
              <CheckCircle size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted-foreground truncate">{t("dash.matches")}</div>
              <div className="text-2xl font-bold text-foreground mt-1">12</div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-5 flex items-center gap-4 transition-transform hover:-translate-y-1" style={{ backgroundColor: "var(--background)", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981" }}>
              <HeartHandshake size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-muted-foreground truncate">{t("dash.mentor")}</div>
              <div className="text-lg font-bold text-foreground mt-1 text-emerald-500 truncate">{t("dash.active")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="flex-1 px-4 lg:px-12 py-10 flex flex-col lg:flex-row gap-8 max-w-[1600px] w-full mx-auto">
        
        {/* Left Column: Radar (Smaller) */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-6">
          <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">Perfil Cognitivo</h2>
            <div className="flex justify-center items-center w-full overflow-hidden">
              <RadarViz data={radarData} height={280} outerRadius={85} fontSize={10} />
            </div>
          </div>
        </div>

        {/* Right Column: Adjustments & Activity */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="rounded-[2rem] border border-border p-6 md:p-8" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <h2 className="text-xl font-bold text-foreground mb-6">{t("profile.adjustments")}</h2>
            <div>
              {(() => {
                const active: string[] = [];
                const axis = QUIZ_AXES[3];
                if (answers[3] && Object.keys(answers[3]).length > 0) {
                  [0, 1].forEach((qi) => {
                    const ans = answers[3][qi];
                    if (Array.isArray(ans)) {
                      ans.forEach((oi) => {
                        const oText = axis.questions[qi].opts[lang]?.[oi] ?? axis.questions[qi].opts.es[oi];
                        if (oText && oi !== axis.questions[qi].opts.es.length - 1) {
                          active.push(oText);
                        }
                      });
                    }
                  });
                }
                if (active.length === 0) {
                  active.push("Horarios flexibles", "Comunicación asíncrona", "Entorno silencioso");
                }
                
                return active.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {active.map((adj, idx) => (
                      <span key={idx} className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">{adj}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                );
              })()}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border p-6 md:p-8" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <h2 className="text-xl font-bold text-foreground mb-4">Actividad Reciente</h2>
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border rounded-xl">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3">
                <Shield className="text-muted-foreground" size={24} aria-hidden="true" />
              </div>
              <p className="text-foreground font-semibold">Todo está al día</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">Explora la sección de vacantes para encontrar oportunidades adaptadas a tu perfil.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
