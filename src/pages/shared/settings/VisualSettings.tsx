import { Moon, Sun, Type, Check } from "lucide-react";
import { PaletteKey } from "@/types";
import { getPaletteName } from "@/i18n/useT";
import { PALETTES } from "@/i18n/content";

export function VisualSettings({
  t,
  lang,
  darkMode,
  onDark,
  font,
  onFont,
  palette,
  onPalette,
}: any) {
  return (
    <section className="p-6 md:p-8 rounded-[2rem] border border-border" style={{ backgroundColor: "var(--card)", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      <h2 className="text-lg font-bold text-foreground mb-5">{t("settings.visual")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
            <Sun size={14} aria-hidden="true" /> {t("palette.dark")}
          </h3>
          <button onClick={() => onDark(!darkMode)} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02]" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
              <span className="font-semibold text-foreground">{darkMode ? (t("settings.dark")) : (t("settings.light"))}</span>
            </div>
            <div className="w-12 h-6 rounded-full relative shrink-0" style={{ backgroundColor: darkMode ? "var(--primary)" : "var(--muted)" }}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: darkMode ? "calc(100% - 22px)" : "2px", transition: "left 200ms ease" }} />
            </div>
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
            <Type size={14} aria-hidden="true" /> {t("palette.font")}
          </h3>
          {([["inter", "Inter (Default)"], ["opendyslexic", "OpenDyslexic (Dislexia)"]] as const).map(([fk, fname]) => {
            const sel = font === fk;
            const ff = fk === "opendyslexic" ? "'OpenDyslexic', 'Inter', sans-serif" : "'Inter', sans-serif";
            return (
              <button key={fk} onClick={() => onFont(fk)} className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer text-left mb-2 transition-all hover:scale-[1.02]" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--background)" : "transparent" }}>
                <div className="flex-1 font-semibold text-sm" style={{ fontFamily: ff }}>{fname}</div>
                {sel && <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary)" }}><Check size={10} style={{ color: "var(--primary-foreground)" }} /></div>}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" /> {t("settings.palette")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(PALETTES) as PaletteKey[]).map((key) => {
              const p = PALETTES[key];
              const sel = palette === key;
              return (
                <button key={key} onClick={() => onPalette(key)} className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer text-left transition-all hover:scale-[1.02]" style={{ borderColor: sel ? "var(--primary)" : "var(--border)", backgroundColor: sel ? "var(--background)" : "transparent" }}>
                  <div className="w-8 h-8 rounded-lg shrink-0 border" style={{ backgroundColor: p.bg, borderColor: p.border }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm leading-tight">{getPaletteName(key, lang)}</div>
                  </div>
                  {sel && <Check size={14} style={{ color: "var(--primary)" }} />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
