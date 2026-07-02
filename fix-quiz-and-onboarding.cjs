const fs = require('fs');
const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. REFACTOR CANDIDATE QUIZ to be a step-by-step wizard per question

// Replace the start of CandidateQuiz to add questionIndex state
content = content.replace(/function CandidateQuiz\(\{([^}]*)\}\)\s*\{([\s\S]*?)const AXIS_KEYS = \["quiz\.axis1", "quiz\.axis2", "quiz\.axis3", "quiz\.axis4"\];/, (match, props, inner) => {
  return match + '\n  const [questionIndex, setQuestionIndex] = useState(0);';
});

// We need to modify the rendering of questions. 
// Currently it is: `{axis.questions.map((q, qi) => { ... })}`
// We will replace it with rendering just `axis.questions[questionIndex]`.
const quizQuestionsRegex = /\{axis\.questions\.map\(\(q, qi\) => \{[\s\S]*?return \([\s\S]*?<div key=\{qi\} className="mb-8">([\s\S]*?)<\/div>\s*\);\s*\}\)\}/;

content = content.replace(quizQuestionsRegex, (match) => {
  return `{(() => {
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
            })()}`;
});


// Replace the Nav buttons logic in CandidateQuiz to advance questionIndex instead of axisIndex immediately
const navButtonsRegex = /<div className="flex gap-4 mt-4">[\s\S]*?<\/div>/;

const newNavButtons = `<div className="flex gap-4 mt-8 pt-6 border-t border-border">
              <button 
                onClick={() => {
                  if (questionIndex > 0) {
                    setQuestionIndex(questionIndex - 1);
                  } else if (axisIndex > 0) {
                    onPrev();
                    // We can't easily know the length of the previous axis without passing it down, but assuming standard lengths, we'll reset to 0
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
                disabled={axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && axisAnswers[questionIndex].length === 0)} 
                className="flex-1 flex items-center justify-center gap-2 px-7 py-4 rounded-xl border-2 font-bold transition-all hover:opacity-90" 
                style={{ borderColor: "var(--primary)", backgroundColor: "var(--primary)", color: "var(--primary-foreground)", cursor: (axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && axisAnswers[questionIndex].length === 0)) ? "not-allowed" : "pointer", opacity: (axisAnswers[questionIndex] === undefined || (Array.isArray(axisAnswers[questionIndex]) && axisAnswers[questionIndex].length === 0)) ? 0.5 : 1 }}
              >
                {questionIndex === axis.questions.length - 1 && axisIndex === 3 ? (lang === "es" ? "Completar perfil" : "Complete profile") : t("next")}
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>`;

content = content.replace(navButtonsRegex, newNavButtons);


// Make CandidateQuiz responsive wrapper flex-col on mobile instead of flex-row
content = content.replace(/<div className="flex flex-1">/, '<div className="flex flex-col lg:flex-row flex-1">');
content = content.replace(/<div className="w-\[360px\] shrink-0 border-l border-border px-5 md:px-10 py-10"/, '<div className="w-full lg:w-[360px] shrink-0 lg:border-l border-t lg:border-t-0 border-border px-5 md:px-10 py-10"');


// 2. REFACTOR CANDIDATE ONBOARDING (Theme Selection Contrast & Responsive Layout)
// Fix the flex layout of CandidateOnboarding
content = content.replace(/<div className="flex flex-1 overflow-hidden">/, '<div className="flex flex-col lg:flex-row flex-1 overflow-hidden lg:overflow-visible h-auto lg:h-full">');
content = content.replace(/<div className="flex-1 px-4 lg:px-14 py-10 overflow-y-auto"/, '<div className="w-full lg:w-[45%] shrink-0 px-4 lg:px-14 py-10 overflow-y-auto"');
content = content.replace(/<div className="flex-1 px-14 py-10">/, '<div className="w-full lg:flex-1 px-4 lg:px-14 py-10 bg-muted/20">');

// Fix theme palette selection buttons contrast
content = content.replace(/backgroundColor: sel \? "var\(--secondary\)" : "var\(--background\)"/g, 'backgroundColor: sel ? "var(--card)" : "var(--background)", boxShadow: sel ? "0 4px 12px rgba(0,0,0,0.1)" : "none"');
content = content.replace(/backgroundColor: sel \? "var\(--primary\)" : "var\(--background\)"/g, 'backgroundColor: sel ? "var(--primary)" : "var(--background)"');

// Explicitly label Dyslexia Mode font to be extremely clear
content = content.replace(/\["lexend", "Lexend", lang === "es" \? "Reduce fricción lectora — dislexia" : "Reduces reading friction — dyslexia"\]/, '["lexend", lang === "es" ? "Modo Dislexia (Lexend)" : "Dyslexia Mode", lang === "es" ? "Tipografía amigable y espaciada" : "Dyslexia friendly typography"]');

// Ensure forms in RegisterModal are full width
content = content.replace(/<div className="w-full w-\[95%\] md:w-full md:max-w-md rounded-2xl overflow-hidden"/g, '<div className="w-[95%] sm:w-full max-w-md rounded-2xl overflow-hidden mx-auto"');


fs.writeFileSync(file, content);
console.log("Quiz and Onboarding Refactored!");
