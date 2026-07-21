import { Sparkles } from "lucide-react";
import { RadarViz } from "@/components/common/RadarViz";
import { QUIZ_AXES } from "@/i18n/content";

const BAR_COLORS = ["#3D7A56", "#4CAF70", "#2E86AB", "#C9830A"] as const;

export function QuizRadarPanel({ t, radarData, answers, progressPct }: any) {
  return (
    <div className="w-full shrink-0 px-4 md:px-6 lg:px-0 lg:pr-6 xl:pr-8 py-2 lg:py-0 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto">
      <div className="w-full rounded-3xl border-2 border-border/60 bg-card shadow-lg">
        <div className="pt-1.5 md:pt-2 lg:pt-2 px-4 md:px-6 lg:px-8 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)" }}
              >
                <Sparkles size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {t("quiz.radar.title")}
                </h3>
                <p className="text-[11px] text-muted-foreground tracking-wide">
                  {t("quiz.radar.sub")}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {BAR_COLORS.map((c, i) => (
                <span key={i} className="w-2 h-2 rounded-full opacity-35" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-center gap-x-6 lg:gap-x-10">
            <div className="w-full max-w-full lg:max-w-[520px] shrink-0">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-[60px] opacity-20 pointer-events-none"
                  style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
                  aria-hidden="true"
                />
                <RadarViz data={radarData} height={320} outerRadius={110} fontSize={11} />
              </div>
            </div>

            <div className="w-full lg:max-w-[300px] shrink-0 flex flex-col justify-between self-stretch">
              <div className="space-y-0.5">
                {radarData.map((d: any, i: number) => {
                  const answered = answers[i] && Object.keys(answers[i]).length > 0;
                  const c = BAR_COLORS[i % BAR_COLORS.length];
                  return (
                    <div key={d.axis}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-foreground tracking-tight">
                          {d.axis}
                        </span>
                        <span
                          className="text-sm font-bold font-mono tabular-nums ml-2 text-right"
                          style={{
                            color: answered ? c : "var(--muted-foreground)",
                            minWidth: "2.5ch",
                          }}
                        >
                          {answered ? `${d.value}%` : "—"}
                        </span>
                      </div>
                      <div className="h-3.5 rounded-full overflow-hidden bg-muted">
                        <div
                          className="h-full rounded-full transition-all duration-200 ease-out"
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
              <div className="flex items-center justify-center gap-2 pt-0.5 border-t border-border/50">
                <div className="w-2 h-2 rounded-full bg-primary opacity-40" aria-hidden="true" />
                <span className="text-xs text-muted-foreground/60 uppercase tracking-[0.15em] font-semibold">
                  {t("quiz.of")} {QUIZ_AXES.length} {t("quiz.progressLabel")} {progressPct}%
                </span>
                <div className="w-2 h-2 rounded-full bg-accent opacity-40" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
