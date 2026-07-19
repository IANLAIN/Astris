import { useState, useEffect } from "react";
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
  const radarData = computeRadar(answers);
  const AXIS_KEYS = ["quiz.axis1", "quiz.axis2", "quiz.axis3", "quiz.axis4"];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
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

      {/* ── Main content: question + radar side by side ── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── Questions column ── */}
        <div key={axisIndex} className="flex-1 px-4 md:px-8 lg:px-12 py-8 lg:py-12 overflow-y-auto">
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

        {/* ── Radar panel: desktop right column, mobile below ── */}
        <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 lg:border-l border-t lg:border-t-0 border-border" style={{ backgroundColor: "var(--background)" }}>
          <div className="p-5 lg:p-8 lg:py-12 lg:sticky lg:top-24">
            {/* Card container */}
            <div className="rounded-3xl border-2 border-border overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("quiz.radar.title")}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("quiz.radar.sub")}</p>
              </div>

              {/* Radar chart — bigger */}
              <div className="px-4 pt-6 pb-2 flex justify-center">
                <div className="w-full max-w-[300px]">
                  <RadarViz data={radarData} height={260} outerRadius={90} fontSize={10} />
                </div>
              </div>

              {/* Bar stats — clean horizontal bars */}
              <div className="px-6 pb-6 space-y-3">
                {radarData.map((d, i) => {
                  const answered = answers[i] && Object.keys(answers[i]).length > 0;
                  const colors = ["#3D7A56", "#4CAF70", "#2E86AB", "#C9830A"];
                  return (
                    <div key={d.axis} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-foreground">{d.axis}</span>
                        <span
                          className="text-xs font-bold font-mono tabular-nums transition-all duration-300"
                          style={{
                            color: answered ? colors[i % colors.length] : "var(--muted-foreground)",
                            opacity: answered ? 1 : 0.4,
                          }}
                        >
                          {answered ? `${d.value}%` : "—"}
                        </span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: answered ? `${d.value}%` : "0%",
                            backgroundColor: colors[i % colors.length],
                            opacity: answered ? 1 : 0.15,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
