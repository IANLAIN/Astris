import { ArrowRight, Activity, Shield, BarChart3, ChevronRight } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT, C } from "@/i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import { motion } from "framer-motion";

import { AboutPillars } from "./about/AboutPillars";
import { AboutRadar } from "./about/AboutRadar";

export function AboutPage({ lang, onNavigate, onOpenAuth, onLang, darkMode, onDarkToggle, font, onFontToggle }: {
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
  const about = C(lang, "aboutPage") as any;

  return (
    <PublicPageShell lang={lang} currentView="about" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} font={font} onFontToggle={onFontToggle}
      title={about.heroTitle ?? t("landing.nav.about")}
      subtitle={about.heroSub}>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-16 flex justify-center pt-2 md:pt-4"
      >
        <div className="w-full flex flex-col items-center text-center p-6 sm:p-8 md:p-12 rounded-[2rem] border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
          <div
            className="font-bold text-primary mb-3 md:mb-4 leading-none tracking-tighter"
            style={{ fontFamily: "DM Mono, monospace", fontSize: "clamp(3rem, 12vw, 7rem)" }}
          >
            {t("about.heroStat.85value")}
          </div>
          <p className="text-foreground font-semibold mb-4 md:mb-6 leading-snug max-w-3xl" style={{ fontSize: "clamp(1.125rem, 4vw, 1.875rem)" }}>
            {t("about.heroStat.85text")}
          </p>
          <span className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-widest opacity-70">{t("about.heroStat.85source")}</span>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 md:mb-16 grid gap-4 md:grid-cols-3"
      >
        {[
          { icon: BarChart3, title: about.purposeLabel, body: t("about.missionBody1") },
          { icon: Activity, title: about.missionLabel, body: t("about.missionBody2") },
          { icon: Shield, title: about.visionLabel, body: about.visionBody },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-5 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              <item.icon size={20} />
            </div>
            <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
          </motion.div>
        ))}
      </motion.section>

      <AboutPillars lang={lang} about={about} />

      <AboutRadar lang={lang} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-[1.5rem] md:rounded-[2rem] border-2 border-primary/20 p-6 md:p-12 text-center bg-card shadow-sm"
      >
        <h2 className="mb-3 text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{about.ctaTitle}</h2>
        <p className="mb-5 md:mb-6 max-w-xl mx-auto text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">{about.ctaBody}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => onOpenAuth(undefined, "register")} className="inline-flex items-center justify-center gap-2 rounded-xl px-5 md:px-6 py-3 text-xs md:text-sm font-bold cursor-pointer border-0 transition-transform hover:scale-[1.02]" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            {about.ctaCandidate}<ArrowRight size={14} className="md:w-4 md:h-4" />
          </button>
          <button onClick={() => onOpenAuth("organization", "register")} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 px-5 md:px-6 py-3 text-xs md:text-sm font-bold cursor-pointer transition-transform hover:scale-[1.02]" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", borderColor: "var(--border)" }}>
            {about.ctaOrganization}<ChevronRight size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </motion.section>

    </PublicPageShell>
  );
}
