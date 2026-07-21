import { Sun, Moon, Check, ArrowRight } from "lucide-react";
import { Lang, PaletteKey, FontKey } from "@/types";
import { getPaletteName, getPaletteDesc } from "@/i18n/useT";
import { PALETTES } from "@/i18n/content";

export function OnboardingControls({
  lang,
  palette,
  darkMode,
  font,
  onPalette,
  onDark,
  onFont,
  onContinue,
  t,
}: {
  lang: Lang;
  palette: PaletteKey;
  darkMode: boolean;
  font: FontKey;
  onPalette: (p: PaletteKey) => void;
  onDark: (d: boolean) => void;
  onFont: (f: FontKey) => void;
  onContinue: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="w-full lg:w-[420px] shrink-0 border-r border-border px-5 md:px-10 py-10 flex flex-col gap-6 md:gap-8 overflow-y-auto">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
          <Sun size={14} aria-hidden="true" />
          {t("onboarding.darkLabel")}
        </h3>
        <button
          onClick={() => onDark(!darkMode)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-border bg-card text-foreground cursor-pointer hover:border-primary/40"
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span className="font-semibold">
              {darkMode ? t("common.dark_mode") : t("common.light_mode")}
            </span>
          </div>
          <div
            className={`w-12 h-6 rounded-full relative shrink-0 transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}
            aria-hidden="true"
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${darkMode ? "left-[calc(100%-22px)]" : "left-0.5"}`}
            />
          </div>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" aria-hidden="true" />
          {t("onboarding.paletteLabel")}
        </h3>
        <div className="flex flex-col gap-2.5">
          {(Object.keys(PALETTES) as PaletteKey[]).map((key) => {
            const p = PALETTES[key];
            const selected = palette === key;
            return (
              <button
                key={key}
                onClick={() => onPalette(key)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer text-left transition-colors ${
                  selected
                    ? "border-primary bg-card shadow-sm"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl shrink-0 border-2"
                  style={{ backgroundColor: p.bg, borderColor: p.border }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">
                    {getPaletteName(key, lang)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {getPaletteDesc(key, lang)}
                  </div>
                </div>
                {selected && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary text-primary-foreground shrink-0">
                    <Check size={11} aria-hidden="true" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 p-4 rounded-2xl border-2 border-border bg-card">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={font === "opendyslexic"}
            onChange={(e) => onFont(e.target.checked ? "opendyslexic" : "inter")}
            className="mt-1 w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary accent-primary"
          />
          <div className="flex-1">
            <div className="font-bold text-foreground text-sm">
              {t("onboarding.dyslexia_font_title")}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t("onboarding.dyslexia_font_desc")}
            </div>
          </div>
        </label>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base bg-primary text-primary-foreground hover:opacity-90 shadow-lg cursor-pointer"
        >
          {t("onboarding.continue")}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
