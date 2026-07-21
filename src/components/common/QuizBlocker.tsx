import { AlertTriangle } from "lucide-react";

export function QuizBlocker({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-4" role="alert" aria-labelledby="quiz-blocker-title">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: "rgba(245,158,11,0.15)" }}
        aria-hidden="true"
      >
        <AlertTriangle size={32} className="text-amber-500" />
      </div>
      <h2 id="quiz-blocker-title" className="text-2xl font-bold text-foreground">Perfil incompleto</h2>
      <p className="text-muted-foreground max-w-md">
        Para acceder al dashboard completa primero tu perfil de compatibilidad.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 rounded-xl font-bold cursor-pointer transition-transform hover:scale-105"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        Ir a caracterización
      </button>
    </div>
  );
}
