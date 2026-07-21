import { Lang, PaletteKey, FontKey } from "@/types";
import { useT } from "@/i18n/useT";
import { PALETTES } from "@/i18n/content";
import { PreviewPanel } from "./onboarding/PreviewPanel";
import { OnboardingControls } from "./onboarding/OnboardingControls";

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
  const fontFamily = font === "opendyslexic" ? "'OpenDyslexic', 'Inter', sans-serif" : "'Inter', sans-serif";

  const previewNav = ["Mi perfil", "Vacantes", "Mi mentor"];
  const previewTitle = "Vacantes sugeridas para ti";
  const previewSubtitle = "3 vacantes compatibles esta semana";

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background">
      <div className="px-4 lg:px-20 py-10 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("onboarding.title")}
        </h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xl">
          {t("onboarding.sub")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        <OnboardingControls
          lang={lang}
          palette={palette}
          darkMode={darkMode}
          font={font}
          onPalette={onPalette}
          onDark={onDark}
          onFont={onFont}
          onContinue={onContinue}
          t={t}
        />

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
