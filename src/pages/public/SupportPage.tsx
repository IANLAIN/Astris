import { ArrowRight } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT } from "@/i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import vibralatinaImg from "@/assets/vibralatina.png";
import closerImg from "@/assets/closertothestarscircle.png";

export function SupportPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle, font, onFontToggle }: {
  lang: Lang;
  onNavigate: (view: PublicView) => void;
  onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void;
  onLang: () => void;
  darkMode: boolean;
  onDarkToggle: () => void;
  font: any;
  onFontToggle: () => void;
}) {
  const t = useT(lang);
  const orgs = [
    { name: "Vibra Latina", href: "https://www.vibralatinatx.com/", icon: <img src={vibralatinaImg} alt="Vibra Latina" className="h-[77px] w-[77px] object-contain" /> },
    { name: "Closer To The Stars", href: "https://closertothestars.org/", icon: <img src={closerImg} alt="Closer To The Stars" className="h-[200px] w-[200px] object-contain" /> },
  ];

  return (
    <PublicPageShell lang={lang} currentView="support" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} font={font} onFontToggle={onFontToggle} title={t("landing.nav.support")}>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto py-8">
        {orgs.map((org) => (
          <div key={org.name} className="flex flex-col items-center justify-center text-center rounded-[2.5rem] border-2 border-border bg-card p-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
              {org.icon}
            </div>
            <h3 className="mb-6 text-2xl font-extrabold text-foreground">{org.name}</h3>
            <a href={org.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-base font-bold text-primary hover:bg-primary/20 transition-colors">
              {t("support.seeLink")} <ArrowRight size={18} />
            </a>
          </div>
        ))}
      </div>
    </PublicPageShell>
  );
}
