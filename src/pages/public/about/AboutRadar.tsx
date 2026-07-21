import { motion } from "framer-motion";
import { RadarViz } from "@/components/common/RadarViz";
import { useT } from "@/i18n/useT";
import { Lang } from "@/types";

export function AboutRadar({ lang }: { lang: Lang }) {
  const t = useT(lang);

  const RADAR_DEMO = [
    { axis: t("about.radarAxes.processing"), value: 81 },
    { axis: t("about.radarAxes.environment"), value: 22 },
    { axis: t("about.radarAxes.execution"), value: 78 },
    { axis: t("about.radarAxes.adjustments"), value: 65 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 md:mb-16"
    >
      <div className="rounded-[1.5rem] md:rounded-[2rem] border-2 border-border bg-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-5 md:p-10 flex flex-col items-center justify-center">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1">{t("about.radarTitle")}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">{t("about.radarSub")}</p>
            <div className="w-full max-w-[330px] md:max-w-[420px]">
              <RadarViz data={RADAR_DEMO} height={300} outerRadius={112} fontSize={10} />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-5 md:p-10 flex flex-col justify-center" style={{ backgroundColor: "var(--background)" }}>
            <div className="space-y-3 md:space-y-4">
              {RADAR_DEMO.map((d) => (
                <div key={d.axis} className="flex items-center gap-2 md:gap-3">
                  <span className="text-[11px] md:text-sm font-medium text-foreground w-24 md:w-32 shrink-0">{d.axis}</span>
                  <div className="flex-1 h-2 md:h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: "var(--primary)", opacity: 0.8 }} />
                  </div>
                  <span className="text-[11px] md:text-sm font-bold w-6 md:w-8 text-right font-mono text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-4 md:mt-6 text-center">{t("about.radarHint")}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
