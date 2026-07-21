import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Lang } from "@/types";

export function QuizQuestionArea({
  lang,
  axisIndex,
  questionIndex,
  axis,
  ans,
  opts,
  isFirstQuestion,
  isLastQuestion,
  isAnswered,
  onAnswer,
  goBack,
  goForward,
  t,
}: any) {
  const q = axis.questions[questionIndex];
  
  return (
    <div key={axisIndex} className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-8 lg:py-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto lg:mx-0">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-sm font-bold px-4 py-1.5 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
            >
              {questionIndex + 1} / {axis.questions.length}
            </span>
          </div>

          <p className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-8 leading-relaxed">
            {(q.stems[lang] ?? q.stems.es) as string}
          </p>

          {q.type === "single" ? (
            <div className="flex flex-col gap-3" role="radiogroup">
              {opts.map((opt: string, oi: number) => {
                const selected = ans === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => onAnswer(axisIndex, questionIndex, oi)}
                    className={`group flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-colors ${
                      selected ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                    style={{
                      backgroundColor: selected ? "color-mix(in srgb, var(--primary) 8%, var(--background))" : "var(--background)",
                      boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)" : "none",
                    }}
                    role="radio"
                    aria-checked={selected}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground bg-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className="text-foreground text-sm md:text-base lg:text-lg leading-snug font-medium">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {opts.map((opt: string, oi: number) => {
                const selected = Array.isArray(ans) ? (ans as number[]).includes(oi) : false;
                const isNone = oi === opts.length - 1;

                const toggleMulti = () => {
                  const prev = Array.isArray(ans) ? (ans as number[]) : [];
                  let next: number[];
                  if (isNone) {
                    next = selected ? [] : [oi];
                  } else {
                    const withoutNone = prev.filter((x) => x !== opts.length - 1);
                    next = selected ? withoutNone.filter((x) => x !== oi) : [...withoutNone, oi];
                  }
                  onAnswer(axisIndex, questionIndex, next);
                };

                return (
                  <button
                    key={oi}
                    onClick={toggleMulti}
                    className={`group flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-colors ${
                      selected ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                    style={{
                      backgroundColor: selected ? "color-mix(in srgb, var(--primary) 8%, var(--background))" : "var(--background)",
                      boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)" : "none",
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground bg-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <Check size={14} className="text-primary-foreground" />}
                    </div>
                    <span className="text-foreground text-sm md:text-base lg:text-lg leading-snug font-medium">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-10 pt-6 border-t border-border">
          <button
            onClick={goBack}
            disabled={isFirstQuestion}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 font-bold text-sm md:text-base cursor-pointer transition-colors ${
              isFirstQuestion ? "border-border bg-card text-foreground opacity-40 cursor-not-allowed" : "border-border bg-card text-foreground hover:bg-secondary/50"
            }`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            {t("back")}
          </button>

          <button
            onClick={goForward}
            disabled={!isAnswered}
            className={`flex-1 flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 font-bold text-sm md:text-base transition-colors ${
              isAnswered ? "border-primary bg-primary text-primary-foreground hover:opacity-90 cursor-pointer" : "border-primary bg-primary text-primary-foreground opacity-50 cursor-not-allowed"
            }`}
          >
            {isLastQuestion ? t("quiz.complete_profile") : t("next")}
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
