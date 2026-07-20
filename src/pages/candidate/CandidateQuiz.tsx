import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Check, BarChart3, Sparkles } from "lucide-react";
import { Lang, QuizAnswers } from "@/types";
import { useT, computeRadar } from "@/i18n/useT";
import { QUIZ_AXES } from "@/i18n/content";
import { RadarViz } from "@/components/common/RadarViz";

export function CandidateQuiz({ lang, axisIndex, answers, onAnswer, onPrev, onNext }: {
  lang: Lang; axisIndex: number; answers: QuizAnswers;
  onAnswer: (ai: number, qi: number, val: number | number[]) => void;
  onPrev: () => void; onNext: () => void;
}) {
  const t = useT(lang);
  const [questionIndex, setQuestionIndex] = useState(0);
  const axis = QUIZ_AXES[axisIndex];
  const axisAnswers = answers[axisIndex] ?? {};
  const radarData = useMemo(() => computeRadar(answers, lang), [answers, lang]);
  const AXIS_KEYS = ["quiz.axis1", "quiz.axis2", "quiz.axis3", "quiz.axis4"];
  const BAR_COLORS = ["#3D7A56", "#4CAF70", "#2E86AB", "#C9830A"];

  const totalAnswered = useMemo(() =>
    Object.keys(answers).filter(
      k => answers[Number(k)] && Object.keys(answers[Number(k)]).length > 0
    ).length,
    [answers]
  );
  const progressPct = Math.round((totalAnswered / QUIZ_AXES.length) * 100);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background">
      {/* ── Progress header ── */}
      <div className="px-4 md:px-8 lg:px-12 py-5 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "DM Mono, monospace" }}>
              {t("quiz.step")} {axisIndex + 1} {t("quiz.of")} {QUIZ_AXES.length}
            </span>
            <div className="flex gap-1.5 flex-1 max-w-xs" role="progressbar" aria-valuenow={axisIndex + 1} aria-valuemax={QUIZ_AXES.length}>
              {QUIZ_AXES.map((_, i) => (
                <div
                  key={i}
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === axisIndex ? "48px" : "24px",
                    backgroundColor: i <= axisIndex ? "var(--primary)" : "var(--muted)",
                    opacity: i === axisIndex ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={20} className="hidden sm:inline" style={{ color: "var(--primary)" }} />
            {t(AXIS_KEYS[axisIndex])}
          </h1>
        </div>
      </div>

      {/* ── Main content: question + radar ── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── Questions column ── */}
        <div key={axisIndex} className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-8 lg:py-12 overflow-y-auto">
          <div className="max-w-2xl mx-auto lg:mx-0">
            {(() => {
              const q = axis.questions[questionIndex];
              const qi = questionIndex;
              const ans = axisAnswers[qi];
              const opts = q.opts[lang] ?? q.opts.es;
              return (
                <div key={qi}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm font-bold px-4 py-1.5 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
                      {questionIndex + 1} / {axis.questions.length}
                    </span>
                  </div>
                  <p className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-8 leading-relaxed">
                    {q.stems[lang] ?? q.stems.es}
                  </p>
                  {q.type === "single" ? (
                    <div className="flex flex-col gap-3" role="radiogroup">
                      {opts.map((opt, oi) => {
                        const sel = ans === oi;
                        return (
                          <button
                            key={oi}
                            onClick={() => onAnswer(axisIndex, qi, oi)}
                            className="group flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                            style={{
                              borderColor: sel ? "var(--primary)" : "var(--border)",
                              backgroundColor: sel ? "color-mix(in srgb, var(--primary) 8%, var(--background))" : "var(--background)",
                              boxShadow: sel ? "0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)" : "none",
                            }}
                            role="radio"
                            aria-checked={sel}
                          >
                            <div
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                              style={{
                                borderColor: sel ? "var(--primary)" : "var(--muted-foreground)",
                                backgroundColor: sel ? "var(--primary)" : "transparent",
                              }}
                              aria-hidden="true"
                            >
                              {sel && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--primary-foreground)" }} />}
                            </div>
                            <span className="text-foreground text-sm md:text-base lg:text-lg leading-snug font-medium">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {opts.map((opt, oi) => {
                        const selected = Array.isArray(ans) ? (ans as number[]).includes(oi) : false;
                        const isNone = oi === opts.length - 1;
                        const toggleMulti = () => {
                          const prev = Array.isArray(ans) ? ans : [];
                          let next: number[];
                          if (isNone) {
                            next = selected ? [] : [oi];
                          } else {
                            const withoutNone = prev.filter((x) => x !== opts.length - 1);
                            next = selected ? withoutNone.filter((x) => x !== oi) : [...withoutNone, oi];
                          }
                          onAnswer(axisIndex, qi, next);
                        };
                        return (
                          <button
                            key={oi}
                            onClick={toggleMulti}
                            className="group flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                            style={{
                              borderColor: selected ? "var(--primary)" : "var(--border)",
                              backgroundColor: selected ? "color-mix(in srgb, var(--primary) 8%, var(--background))" : "var(--background)",
                              boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)" : "none",
                            }}
                          >
                            <div
                              className="w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                              style={{
                                borderColor: selected ? "var(--primary)" : "var(--muted-foreground)",
                                backgroundColor: selected ? "var(--primary)" : "transparent",
                              }}
                              aria-hidden="true"
                            >
                              {selected && <Check size={14} style={{ color: "var(--primary-foreground)" }} />}
                            </div>
                            <span className="text-foreground text-sm md:text-base lg:text-lg leading-snug font-medium">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Nav buttons ── */}
            <div className="flex gap-4 mt-10 pt-6 border-t border-border">
              <button
                onClick={() => {
                  if (questionIndex > 0) {
                    setQuestionIndex(questionIndex - 1);
                  } else if (axisIndex > 0) {
                    onPrev();
                    setQuestionIndex(0);
                  }
                }}
                disabled={axisIndex === 0 && questionIndex === 0}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 font-bold cursor-pointer transition-all text-sm md:text-base hover:bg-secondary/50"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card)",
                  color: "var(--foreground)",
                  opacity: (axisIndex === 0 && questionIndex === 0) ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={18} aria-hidden="true" />{t("back")}
              </button>

              <button
                onClick={() => {
                  if (questionIndex < axis.questions.length - 1) {
                    setQuestionIndex(questionIndex + 1);
                  } else {
                    onNext();
                    setQuestionIndex(0);
                  }
                }}
                disabled={axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && (axisAnswers[questionIndex] as number[]).length === 0)}
                className="flex-1 flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 font-bold transition-all text-sm md:text-base hover:opacity-90"
                style={{
                  borderColor: "var(--primary)",
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  cursor: (axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && (axisAnswers[questionIndex] as number[]).length === 0)) ? "not-allowed" : "pointer",
                  opacity: (axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && (axisAnswers[questionIndex] as number[]).length === 0)) ? 0.5 : 1,
                }}
              >
                {questionIndex === axis.questions.length - 1 && axisIndex === 3 ? t("quiz.complete_profile") : t("next")}
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Radar panel — wide card, radar has large SVG margins so labels aren't clipped ── */}
        <div className="w-full lg:w-[900px] xl:w-[1100px] shrink-0 px-4 md:px-6 lg:px-0 lg:pr-6 xl:pr-8 py-8 lg:py-12">
          <div className="w-full rounded-3xl border-2 border-border/60 shadow-2xl shadow-primary/5" style={{ backgroundColor: "var(--card)" }}>
            <div className="relative h-3 w-full overflow-hidden rounded-t-3xl" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent), #6366F1, #8B5CF6, var(--primary))", backgroundSize: "400% 100%" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", animation: "shimmer 3.5s infinite" }} />
            </div>

            <div className="p-5 md:p-6 lg:p-8">
              {/* Title row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                    <Sparkles size={18} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight">{t("quiz.radar.title")}</h3>
                    <p className="text-[11px] text-muted-foreground tracking-wide">{t("quiz.radar.sub")}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {BAR_COLORS.map((c, i) => (
                    <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.35 }} />
                  ))}
                </div>
              </div>

              {/* Radar pushed left, bars on the right */}
              <div className="flex flex-col md:flex-row items-center md:items-start">
                {/* Radar chart — shifted left with margin-right auto */}
                <div className="w-full max-w-[480px] shrink-0 mr-auto">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-[60px] opacity-20" style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} aria-hidden="true" />
                    <RadarViz data={radarData} height={360} outerRadius={125} fontSize={14} />
                  </div>
                </div>

                {/* Progress bars */}
                <div className="w-full max-w-[280px] shrink-0 space-y-4">
                  {radarData.map((d, i) => {
                    const answered = answers[i] && Object.keys(answers[i]).length > 0;
                    const c = BAR_COLORS[i % BAR_COLORS.length];
                    return (
                      <div key={d.axis}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-foreground tracking-tight">{d.axis}</span>
                          <span
                            className="text-sm font-bold font-mono tabular-nums ml-2"
                            style={{ color: answered ? c : "var(--muted-foreground)", minWidth: "2.5ch", textAlign: "right" }}
                          >
                            {answered ? `${d.value}%` : "—"}
                          </span>
                        </div>
                        <div className="h-3.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-200 ease-out"
                            style={{
                              width: answered ? `${d.value}%` : "0%",
                              background: answered ? `linear-gradient(90deg, ${c}, ${c}dd)` : "none",
                              opacity: answered ? 1 : 0.15,
                              boxShadow: answered ? `inset 0 1.5px 0 rgba(255,255,255,0.35)` : "none",
                            }}
                          >
                            {answered && (
                              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent 50%)" }} aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--primary)", opacity: 0.4 }} />
                <span className="text-xs text-muted-foreground/60 uppercase tracking-[0.15em] font-semibold">
                  {t("quiz.of")} {QUIZ_AXES.length} ejes · perfil en {progressPct}%
                </span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)", opacity: 0.4 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
