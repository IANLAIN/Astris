import { Sparkles } from "lucide-react";
import { RadarViz } from "@/components/common/RadarViz";
import { QUIZ_AXES } from "@/i18n/content";

const BAR_COLORS = ["#3D7A56", "#4CAF70", "#2E86AB", "#C9830A"] as const;

export function QuizRadarPanel({ t, radarData, answers, progressPct }: any) {
  return (
    <div className="w-full lg:flex-1 xl:flex-[1.2] shrink-0 px-4 md:px-6 lg:px-8 xl:px-12 py-8 lg:py-0 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto flex items-center justify-center">
      <div className="w-full max-w-[850px] rounded-[2rem] border-2 border-border/60 bg-card shadow-xl p-6 md:p-8 xl:p-10 transition-all">
        <div className="flex items-center justify-between mb-8 xl:mb-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)" }}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight">
                {t("quiz.radar.title")}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground tracking-wide mt-0.5">
                {t("quiz.radar.sub")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {BAR_COLORS.map((c, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full opacity-35" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-x-8 gap-y-10 xl:gap-x-12">
          <div className="w-full xl:w-[480px] shrink-0">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-[90px] opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
                aria-hidden="true"
              />
              <RadarViz data={radarData} height={440} outerRadius={150} fontSize={14} />
            </div>
          </div>

          <div className="w-full xl:w-[320px] shrink-0 flex flex-col justify-between self-stretch gap-6 xl:gap-0">
            <div className="space-y-4 xl:space-y-6 mt-4 xl:mt-0">
              {radarData.map((d: any, i: number) => {
                const answered = answers[i] && Object.keys(answers[i]).length > 0;
                const c = BAR_COLORS[i % BAR_COLORS.length];
                return (
                  <div key={d.axis}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm md:text-base font-bold text-foreground tracking-tight">
                        {d.axis}
                      </span>
                      <span
                        className="text-sm md:text-base font-bold font-mono tabular-nums ml-2 mr-3.5 text-right"
                        style={{
                          color: answered ? c : "var(--muted-foreground)",
                          minWidth: "2.5ch",
                        }}
                      >
                        {answered ? `${d.value}%` : "—"}
                      </span>
                    </div>
                    <div className="h-4 md:h-5 rounded-full overflow-hidden bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: answered ? `${d.value}%` : "0%",
                          background: answered
                            ? `linear-gradient(90deg, ${c}, ${c}dd)`
                            : "none",
                          opacity: answered ? 1 : 0.15,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-6 xl:pt-4 border-t border-border/50 mt-4 xl:mt-0">
              <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-40" aria-hidden="true" />
              <span className="text-xs md:text-sm text-muted-foreground/80 uppercase tracking-[0.15em] font-bold">
                {t("quiz.of")} {QUIZ_AXES.length} {t("quiz.progressLabel")} {progressPct}%
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-accent opacity-40" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
