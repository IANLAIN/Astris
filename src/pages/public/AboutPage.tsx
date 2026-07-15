import { useState } from "react";
import { ArrowRight, Activity, Users, Shield, Zap, BarChart3, Check, ChevronRight } from "lucide-react";
import { Lang, Role, PublicView } from "@/types";
import { useT, C } from "@/i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import { motion, AnimatePresence } from "framer-motion";
import { RadarViz } from "@/components/common/RadarViz";

import prepararImg from '@/assets/preparar.webp';
import adaptarImg from '@/assets/adaptar.webp';
import acompanarImg from '@/assets/acompanar.webp';
import conectarImg from '@/assets/conectar.webp';

const RADAR_DEMO = [
  { axis: "Procesamiento", value: 81 },
  { axis: "T. Ambiental", value: 22 },
  { axis: "Ejecución", value: 78 },
  { axis: "Ajustes", value: 65 },
];

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
  const [activePillar, setActivePillar] = useState(0);

  type Pillar = {
    key: string; icon: typeof Activity; color: string; title: string; tagline: string;
    body: string; img: string; stat: { value: string; text: string; source: string }; values: string[];
  };

  const PILLARS: Pillar[] = [
    {
      key: "preparar", icon: Activity, color: "#2563A8", title: t("about.pillarPreparar"),
      tagline: t("about.pillarPrepararTag"), body: t("about.pillarPrepararBody"),
      img: prepararImg,
      stat: { value: t("about.heroStat.85value"), text: t("about.heroStat.85text"), source: t("about.heroStat.85source") },
      values: [t("about.pillarVal1a"), t("about.pillarVal1b"), t("about.pillarVal1c")],
    },
    {
      key: "adaptar", icon: Zap, color: "#3D7A56", title: t("about.pillarAdaptar"),
      tagline: t("about.pillarAdaptarTag"), body: t("about.pillarAdaptarBody"),
      img: adaptarImg,
      stat: { value: t("about.stat90"), text: t("about.stat90text"), source: t("about.stat90source") },
      values: [t("about.pillarVal2a"), t("about.pillarVal2b"), t("about.pillarVal2c")],
    },
    {
      key: "acompanar", icon: Users, color: "#8B5C3A", title: t("about.pillarAcompanar"),
      tagline: t("about.pillarAcompanarTag"), body: t("about.pillarAcompanarBody"),
      img: acompanarImg,
      stat: { value: t("about.stat140"), text: t("about.stat140text"), source: t("about.stat140source") },
      values: [t("about.pillarVal3a"), t("about.pillarVal3b"), t("about.pillarVal3c")],
    },
    {
      key: "conectar", icon: Shield, color: "#1B4B7A", title: t("about.pillarConectar"),
      tagline: t("about.pillarConectarTag"), body: t("about.pillarConectarBody"),
      img: conectarImg,
      stat: { value: t("about.stat15"), text: t("about.stat15text"), source: t("about.stat15source") },
      values: [t("about.pillarVal4a"), t("about.pillarVal4b"), t("about.pillarVal4c")],
    },
  ];

  const pillar = PILLARS[activePillar];

  return (
    <PublicPageShell lang={lang} currentView="about" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} darkMode={darkMode} onDarkToggle={onDarkToggle} font={font} onFontToggle={onFontToggle}
      title={about.heroTitle ?? t("landing.nav.about")}
      subtitle={about.heroSub}>

      {/* ── Hero stat ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 md:mb-16 flex justify-center pt-2 md:pt-4"
      >
        <div className="w-full flex flex-col items-center text-center p-8 md:p-12 rounded-[2rem] border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
          <div className="font-bold text-primary mb-4 text-[4rem] md:text-[7rem] leading-none tracking-tighter" style={{ fontFamily: "DM Mono, monospace" }}>
            {t("about.heroStat.85value")}
          </div>
          <p className="text-foreground font-semibold mb-6 text-xl md:text-3xl leading-snug max-w-3xl">
            {t("about.heroStat.85text")}
          </p>
          <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest opacity-70">{t("about.heroStat.85source")}</span>
        </div>
      </motion.section>

      {/* ── Mission cards (short) ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 md:mb-16 grid gap-4 md:grid-cols-3"
      >
        {[
          { icon: BarChart3, title: about.purposeTitle, body: t("about.missionBody1") },
          { icon: Activity, title: about.missionTitle, body: t("about.missionBody2") },
          { icon: Shield, title: about.visionTitle, body: t("about.missionBody3") },
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

      {/* ── Interactive Pillars Selector ── */}
      <section className="mb-12 md:mb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2">{about.pillarsEyebrow}</p>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">{about.pillarsTitle}</h2>
        </div>

        {/* Pillar tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {PILLARS.map((p, i) => {
            const active = i === activePillar;
            const Icon = p.icon;
            return (
              <motion.button
                key={p.key}
                onClick={() => setActivePillar(i)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl border-2 font-bold text-sm cursor-pointer transition-all"
                style={{
                  borderColor: active ? p.color : "var(--border)",
                  backgroundColor: active ? `${p.color}18` : "var(--card)",
                  color: active ? p.color : "var(--foreground)",
                  boxShadow: active ? `0 4px 20px ${p.color}30` : "none",
                }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{p.title}</span>
                <span className="sm:hidden">{p.title.substring(0, 4)}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Active pillar content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 shrink-0">
                <div className="rounded-[2rem] border-2 border-border overflow-hidden shadow-lg bg-card">
                  <img src={pillar.img} alt={pillar.title} className="w-full h-auto object-cover" style={{ aspectRatio: "4/3", maxHeight: "400px" }} />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">0{activePillar + 1}</span>
                <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "DM Mono, monospace" }}>{pillar.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground italic mb-4">{pillar.tagline}</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">{pillar.body}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {pillar.values.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20" style={{ backgroundColor: `color-mix(in srgb, ${pillar.color} 10%, transparent)`, color: pillar.color }}>
                      <Check size={10} />{v}
                    </span>
                  ))}
                </div>
                <div className="rounded-xl border border-border p-4 flex items-center gap-4" style={{ backgroundColor: "var(--background)" }}>
                  <div className="text-2xl font-bold shrink-0" style={{ color: pillar.color, fontFamily: "DM Mono, monospace" }}>{pillar.stat.value}</div>
                  <div>
                    <p className="text-xs text-foreground font-medium">{pillar.stat.text}</p>
                    <p className="text-[10px] text-muted-foreground">{pillar.stat.source}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Radar / Profile Preview ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 md:mb-16"
      >
        <div className="rounded-[2rem] border-2 border-border bg-card overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col items-center justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{t("about.radarTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t("about.radarSub")}</p>
              <div className="w-full max-w-[280px]">
                <RadarViz data={RADAR_DEMO} height={240} outerRadius={85} fontSize={10} />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center" style={{ backgroundColor: "var(--background)" }}>
              <div className="space-y-4">
                {RADAR_DEMO.map((d, i) => (
                  <div key={d.axis} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-32 shrink-0">{d.axis}</span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: i < 2 ? `${d.value}%` : "2%", backgroundColor: "var(--primary)", opacity: i < 2 ? 1 : 0.3 }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right font-mono" style={{ color: i < 2 ? "var(--foreground)" : "var(--muted-foreground)" }}>{i < 2 ? d.value : "—"}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">{t("about.radarHint")}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-[2rem] border-2 border-primary/20 p-8 md:p-12 text-center bg-card shadow-sm"
      >
        <h2 className="mb-3 text-2xl md:text-3xl font-bold text-foreground">{about.ctaTitle}</h2>
        <p className="mb-6 max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">{about.ctaBody}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => onOpenAuth(undefined, "register")} className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold cursor-pointer border-0 transition-transform hover:scale-[1.02]" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            {about.ctaCandidate}<ArrowRight size={16} />
          </button>
          <button onClick={() => onOpenAuth("company", "register")} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-bold cursor-pointer transition-transform hover:scale-[1.02]" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", borderColor: "var(--border)" }}>
            {about.ctaCompany}<ChevronRight size={16} />
          </button>
        </div>
      </motion.section>

    </PublicPageShell>
  );
}
