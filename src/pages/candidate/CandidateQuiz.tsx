import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
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
      {/* Progress */}
      <div className="px-4 lg:px-20 py-4 md:py-8 border-b border-border">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm font-semibold text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{t("quiz.step")} {axisIndex + 1} {t("quiz.of")} {QUIZ_AXES.length}</span>
          <div className="flex gap-2" role="progressbar" aria-valuenow={axisIndex + 1} aria-valuemax={QUIZ_AXES.length}>
            {QUIZ_AXES.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full"
                style={{
                  width: i === axisIndex ? 44 : i < axisIndex ? 36 : 22,
                  backgroundColor: i <= axisIndex ? "var(--primary)" : "var(--muted)",
                  transition: "width 250ms ease, background-color 250ms ease",
                }}
              />
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t(AXIS_KEYS[axisIndex])}</h1>
      </div>

      <div className="flex flex-1">
        {/* Questions — key forces remount + fade on every axis change */}
        <div key={axisIndex} className="flex-1 px-4 lg:px-20 py-10 overflow-y-auto anim-slide-up">
          <div className="max-w-xl">
            {(() => {
              const q = axis.questions[questionIndex];
              const qi = questionIndex;
              const ans = axisAnswers[qi];
              const opts = q.opts[lang] ?? q.opts.es;
              return (
                <div key={qi} className="mb-8 anim-slide-up">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">Pregunta {questionIndex + 1} de {axis.questions.length}</span>
                  </div>
                  <p className="text-xl md:text-2xl font-semibold text-foreground mb-8 leading-relaxed">{q.stems[lang] ?? q.stems.es}</p>
                  {q.type === "single" ? (
                    <div className="flex flex-col gap-3" role="radiogroup">
                      {opts.map((opt, oi) => {
                        const sel = ans === oi;
                        return (
                          <button key={oi} onClick={() => onAnswer(axisIndex, qi, oi)} className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all hover:scale-[1.01]" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--card)" : "var(--background)", boxShadow: sel ? "0 4px 14px rgba(0,0,0,0.05)" : "none" }} role="radio" aria-checked={sel}>
                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: sel ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: sel ? "var(--primary)" : "transparent" }} aria-hidden="true">
                              {sel && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-foreground text-base md:text-lg leading-snug font-medium">{opt}</span>
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
                          const prev = Array.isArray(ans) ? (ans) : [];
                          let next;
                          if (isNone) { next = selected ? [] : [oi]; }
                          else {
                            const withoutNone = prev.filter((x) => x !== opts.length - 1);
                            next = selected ? withoutNone.filter((x) => x !== oi) : [...withoutNone, oi];
                          }
                          onAnswer(axisIndex, qi, next);
                        };
                        return (
                          <button key={oi} onClick={toggleMulti} className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all hover:scale-[1.01]" style={{ borderColor: selected ? "var(--primary)" : "var(--border)", backgroundColor: selected ? "var(--card)" : "var(--background)", boxShadow: selected ? "0 4px 14px rgba(0,0,0,0.05)" : "none" }}>
                            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 border-2" style={{ borderColor: selected ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: selected ? "var(--primary)" : "transparent" }} aria-hidden="true">
                              {selected && <Check size={14} style={{ color: "var(--primary-foreground)" }} />}
                            </div>
                            <span className="text-foreground text-base md:text-lg leading-snug font-medium">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Nav buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
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
                className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 font-bold cursor-pointer transition-all" 
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)", opacity: (axisIndex === 0 && questionIndex === 0) ? 0.4 : 1 }}
              >
                <ChevronLeft size={20} aria-hidden="true" />{t("back")}
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
                className="flex-1 flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-2 font-bold transition-all hover:opacity-90" 
                style={{ borderColor: "var(--primary)", backgroundColor: "var(--primary)", color: "var(--primary-foreground)", cursor: (axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && (axisAnswers[questionIndex] as number[]).length === 0)) ? "not-allowed" : "pointer", opacity: (axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && (axisAnswers[questionIndex] as number[]).length === 0)) ? 0.5 : 1 }}
              >
                {questionIndex === axis.questions.length - 1 && axisIndex === 3 ? (t("quiz.complete_profile")) : t("next")}
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="w-full lg:w-[360px] shrink-0 lg:border-l border-t lg:border-t-0 border-border px-5 md:px-10 py-10" style={{ backgroundColor: "var(--card)" }}>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("quiz.radar.title")}</div>
          <p className="text-xs text-muted-foreground mb-4">{t("quiz.radar.sub")}</p>
          <RadarViz data={radarData} height={260} outerRadius={85} fontSize={10} />
          <div className="mt-4 flex flex-col gap-3">
            {radarData.map((d, i) => (
              <div key={d.axis} className="flex items-center gap-3">
                <span className="text-xs text-foreground w-28 shrink-0">{d.axis}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.value}%`,
                      backgroundColor: answers[i] && Object.keys(answers[i]).length > 0 ? "var(--primary)" : "var(--muted-foreground)",
                      opacity: answers[i] && Object.keys(answers[i]).length > 0 ? 1 : 0.3,
                      transition: "width 450ms ease, background-color 300ms ease, opacity 300ms ease",
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right" style={{ fontFamily: "DM Mono, monospace" }}>{answers[i] && Object.keys(answers[i]).length > 0 ? d.value : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
