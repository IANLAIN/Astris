import { useState } from "react";
import { Activity, Shield, Users, Zap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/i18n/useT";
import { Lang } from "@/types";

import prepararImg from "@/assets/preparar.webp";
import adaptarImg from "@/assets/adaptar.webp";
import acompanarImg from "@/assets/acompanar.webp";
import conectarImg from "@/assets/conectar.webp";

type Pillar = {
  key: string; icon: any; color: string; title: string; tagline: string;
  body: string; img: string; stat: { value: string; text: string; source: string }; values: string[];
};

export function AboutPillars({ lang, about }: { lang: Lang, about: any }) {
  const t = useT(lang);
  const [activePillar, setActivePillar] = useState(0);

  const PILLARS: Pillar[] = [
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
      key: "preparar", icon: Activity, color: "#2563A8", title: t("about.pillarPreparar"),
      tagline: t("about.pillarPrepararTag"), body: t("about.pillarPrepararBody"),
      img: prepararImg,
      stat: { value: t("about.heroStat.85value"), text: t("about.heroStat.85text"), source: t("about.heroStat.85source") },
      values: [t("about.pillarVal1a"), t("about.pillarVal1b"), t("about.pillarVal1c")],
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
    <section className="mb-10 md:mb-16">
      <div className="text-center mb-6 md:mb-8">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2">{about.pillarsEyebrow}</p>
        <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-foreground">{about.pillarsTitle}</h2>
      </div>

      <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 md:pb-0 scrollbar-none" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        {PILLARS.map((p, i) => {
          const active = i === activePillar;
          const Icon = p.icon;
          return (
            <motion.button
              key={p.key}
              onClick={() => setActivePillar(i)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl border-2 font-bold text-[11px] md:text-sm cursor-pointer transition-all shrink-0 whitespace-nowrap"
              style={{
                borderColor: active ? p.color : "var(--border)",
                backgroundColor: active ? `${p.color}18` : "var(--card)",
                color: active ? p.color : "var(--foreground)",
                boxShadow: active ? `0 4px 20px ${p.color}30` : "none",
              }}
            >
              <Icon size={14} className="md:w-4 md:h-4" />
              <span>{p.title}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePillar}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="w-full md:w-1/2 shrink-0">
              <div className="rounded-[1.5rem] md:rounded-[2rem] border-2 border-border overflow-hidden shadow-lg bg-card">
                <img
                  src={pillar.img}
                  alt={pillar.title}
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: "4/3", maxHeight: "400px" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">0{activePillar + 1}</span>
              <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "DM Mono, monospace" }}>{pillar.title}</h3>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground italic mb-3 md:mb-4">{pillar.tagline}</p>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">{pillar.body}</p>
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                {pillar.values.map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-primary/20" style={{ backgroundColor: `color-mix(in srgb, ${pillar.color} 10%, transparent)`, color: pillar.color }}>
                    <Check size={8} className="md:w-2.5 md:h-2.5" />{v}
                  </span>
                ))}
              </div>
              <div className="rounded-xl border border-border p-3 md:p-4 flex items-center gap-3 md:gap-4" style={{ backgroundColor: "var(--background)" }}>
                <div className="text-xl md:text-2xl font-bold shrink-0" style={{ color: pillar.color, fontFamily: "DM Mono, monospace" }}>{pillar.stat.value}</div>
                <div>
                  <p className="text-[11px] md:text-xs text-foreground font-medium">{pillar.stat.text}</p>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground">{pillar.stat.source}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
