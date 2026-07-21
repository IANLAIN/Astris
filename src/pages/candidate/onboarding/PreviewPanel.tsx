import { Lang, PaletteKey } from "@/types";
import { PALETTES } from "@/i18n/content";

export function PreviewPanel({
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
