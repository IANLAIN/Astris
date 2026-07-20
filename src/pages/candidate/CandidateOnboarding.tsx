import { Sun, Moon, Check, ArrowRight, Type } from "lucide-react";
import { Lang, PaletteKey, FontKey } from "@/types";
import { useT, getPaletteName, getPaletteDesc } from "@/i18n/useT";
import { PALETTES } from "@/i18n/content";

/**
 * Renders a live preview card that reflects the selected palette + dark mode + font.
 * Uses a CSS custom properties trick: we set them on a wrapper div so children
 * resolve --preview-bg / --preview-fg / etc. from the active palette.
 */
function PreviewPanel({
  palette,
  darkMode,
  fontFamily,
  lang,
  previewNav,
  previewTitle,
  previewSubtitle,
  t,
}: {
  palette: (typeof PALETTES)[PaletteKey];
  darkMode: boolean;
  fontFamily: string;
  lang: Lang;
  previewNav: string[];
  previewTitle: string;
  previewSubtitle: string;
  t: (key: string) => string;
}) {
  const bg = darkMode ? "#1A1A2E" : palette.bg;
  const fg = darkMode ? "#F0EFEA" : palette.fg;
  const card = darkMode ? "#252535" : palette.card;
  const accent = palette.accent;
  const border = darkMode ? "rgba(255,255,255,0.1)" : palette.border;
  const accentText = palette.accent === "#FFE600" ? "#1A1A04" : "#fff";

  const previewVacancies = [
    { title: "Analista de Datos Junior", co: "Veritas Analytics", pct: 94 },
    { title: "Diseñadora UX", co: "Forma Studio", pct: 87 },
    { title: "Redactor/a Técnico/a", co: "Kestrel Systems", pct: 81 },
  ];

  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t("onboarding.previewLabel")}
          </span>
        </div>
        <div
          className="rounded-3xl border overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: bg,
            borderColor: border,
            color: fg,
            fontFamily,
            boxShadow: darkMode
              ? "0 10px 40px rgba(0,0,0,0.3)"
              : "0 10px 40px rgba(27,75,122,0.12)",
          }}
        >
          {/* Nav bar */}
          <div
            className="px-4 md:px-8 py-4 border-b flex items-center justify-between"
            style={{ borderColor: border, backgroundColor: card }}
          >
            <span className="font-bold text-base" style={{ color: fg }}>
              Astris
            </span>
            <div className="flex gap-5">
              {previewNav.map((item) => (
                <span key={item} className="text-[13px] opacity-60" style={{ color: fg }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8">
            <div className="font-bold text-[22px] mb-1" style={{ color: fg }}>
              {previewTitle}
            </div>
            <div className="text-sm opacity-55 mb-5" style={{ color: fg }}>
              {previewSubtitle}
            </div>

            {previewVacancies.map((v) => (
              <div
                key={v.title}
                className="mb-4 rounded-2xl p-5 border-2 flex items-center justify-between"
                style={{ backgroundColor: card, borderColor: border }}
              >
                <div>
                  <div className="font-semibold text-sm" style={{ color: fg }}>
                    {v.title}
                  </div>
                  <div className="text-xs opacity-55" style={{ color: fg }}>
                    {v.co}
                  </div>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full text-sm font-bold"
                  style={{ backgroundColor: accent, color: accentText }}
                >
                  {v.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CandidateOnboarding({
  lang,
  palette,
  darkMode,
  font,
  onPalette,
  onDark,
  onFont,
  onContinue,
}: {
  lang: Lang;
  palette: PaletteKey;
  darkMode: boolean;
  font: FontKey;
  onPalette: (p: PaletteKey) => void;
  onDark: (d: boolean) => void;
  onFont: (f: FontKey) => void;
  onContinue: () => void;
}) {
  const t = useT(lang);
  const activePalette = PALETTES[palette];
  const fontFamily =
    font === "opendyslexic" ? "'OpenDyslexic', 'Inter', sans-serif" : "'Inter', sans-serif";

  const previewNav = ["Mi perfil", "Vacantes", "Mi mentor"];
  const previewTitle = "Vacantes sugeridas para ti";
  const previewSubtitle = "3 vacantes compatibles esta semana";

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 lg:px-20 py-10 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("onboarding.title")}
        </h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xl">
          {t("onboarding.sub")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Controls column */}
        <div className="w-full lg:w-[420px] shrink-0 border-r border-border px-5 md:px-10 py-10 flex flex-col gap-6 md:gap-8 overflow-y-auto">
          {/* Dark mode toggle */}
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

          {/* Palette selection */}
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

          {/* Dyslexia font toggle */}
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

          {/* Continue button */}
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

        {/* Preview column */}
        <div className="w-full lg:flex-1 px-4 lg:px-14 py-10 bg-muted/20">
          <PreviewPanel
            palette={activePalette}
            darkMode={darkMode}
            fontFamily={fontFamily}
            lang={lang}
            previewNav={previewNav}
            previewTitle={previewTitle}
            previewSubtitle={previewSubtitle}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
