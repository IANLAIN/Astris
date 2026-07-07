import { AlertTriangle, Home } from "lucide-react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";

export function NotFoundPage({ lang, onGoHome }: { lang: Lang; onGoHome: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground mb-8">
        {t("auto.p_gina_no_encon._66")}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t("auto.lo_sentimos__la._67")}
      </p>
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base cursor-pointer transition-all hover:scale-[1.02]" 
        style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <Home size={18} />
        {t("auto.volver_al_inici._68")}
      </button>
    </div>
  );
}
