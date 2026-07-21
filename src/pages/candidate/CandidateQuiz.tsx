import { useState, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Lang, QuizAnswers } from "@/types";
import { useT, computeRadar } from "@/i18n/useT";
import { QUIZ_AXES } from "@/i18n/content";
import { QuizQuestionArea } from "./quiz/QuizQuestionArea";
import { QuizRadarPanel } from "./quiz/QuizRadarPanel";

const AXIS_KEYS = ["quiz.axis1", "quiz.axis2", "quiz.axis3", "quiz.axis4"] as const;

export function CandidateQuiz({
  lang,
  axisIndex,
  answers,
  onAnswer,
  onPrev,
  onNext,
}: {
  lang: Lang;
  axisIndex: number;
  answers: QuizAnswers;
  onAnswer: (axis: number, question: number, value: number | number[]) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const t = useT(lang);
  const [questionIndex, setQuestionIndex] = useState(0);
  const axis = QUIZ_AXES[axisIndex];
  const axisAnswers = answers[axisIndex] ?? {};
  const radarData = useMemo(() => computeRadar(answers, lang), [answers, lang]);

  const totalAnswered = useMemo(
    () => Object.keys(answers).filter((k) => answers[Number(k)] && Object.keys(answers[Number(k)]).length > 0).length,
    [answers]
  );
  const progressPct = Math.round((totalAnswered / QUIZ_AXES.length) * 100);

  const isAnswered = axisAnswers[questionIndex] !== undefined && (!Array.isArray(axisAnswers[questionIndex]) || (axisAnswers[questionIndex] as number[]).length > 0);
  const isFirstQuestion = axisIndex === 0 && questionIndex === 0;
  const isLastQuestion = questionIndex === axis.questions.length - 1 && axisIndex === QUIZ_AXES.length - 1;

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else if (axisIndex > 0) {
      onPrev();
      setQuestionIndex(0);
    }
  };

  const goForward = () => {
    if (questionIndex < axis.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      onNext();
      setQuestionIndex(0);
    }
  };

  const q = axis.questions[questionIndex];
  const qi = questionIndex;
  const ans = axisAnswers[qi];
  const opts = (q.opts[lang] ?? q.opts.es) as string[];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background">
      <div className="sticky top-0 z-20 px-4 md:px-8 lg:px-12 py-5 border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {t("quiz.step")} {axisIndex + 1} {t("quiz.of")} {QUIZ_AXES.length}
            </span>
            <div className="flex gap-1.5 flex-1 max-w-xs" role="progressbar" aria-valuenow={axisIndex + 1} aria-valuemax={QUIZ_AXES.length}>
              {QUIZ_AXES.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === axisIndex ? "w-[48px]" : "w-[24px]"}`}
                  style={{ backgroundColor: i <= axisIndex ? "var(--primary)" : "var(--muted)", opacity: i === axisIndex ? 1 : 0.6 }}
                />
              ))}
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={20} className="hidden sm:inline text-primary" />
            {t(AXIS_KEYS[axisIndex])}
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <QuizQuestionArea
          lang={lang}
          axisIndex={axisIndex}
          questionIndex={questionIndex}
          axis={axis}
          ans={ans}
          opts={opts}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          isAnswered={isAnswered}
          onAnswer={onAnswer}
          goBack={goBack}
          goForward={goForward}
          t={t}
        />
        <QuizRadarPanel t={t} radarData={radarData} answers={answers} progressPct={progressPct} />
      </div>
    </div>
  );
}
