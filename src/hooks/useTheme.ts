import { useState, useEffect } from "react";
import { PaletteKey, FontKey } from "@/types";
import { PALETTES } from "@/i18n/content";

type CSSVars = Record<string, string>;

export function useTheme() {
  const [palette, setPaletteState] = useState<PaletteKey>(
    () => (typeof window !== "undefined" && window.localStorage.getItem("astris_palette") as PaletteKey) || "verde"
  );
  const [darkMode, setDarkModeState] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("astris_dark") === "true"
  );
  const [font, setFontState] = useState<FontKey>(
    () => (typeof window !== "undefined" && window.localStorage.getItem("astris_font") as FontKey) || "inter"
  );

  const setPalette = (p: PaletteKey) => {
    setPaletteState(p);
    window.localStorage.setItem("astris_palette", p);
  };

  const setDarkMode = (d: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const next = typeof d === "function" ? d(prev) : d;
      window.localStorage.setItem("astris_dark", String(next));
      return next;
    });
  };

  const setFont = (f: FontKey) => {
    setFontState(f);
    window.localStorage.setItem("astris_font", f);
  };

  const fontFamily =
    font === "lexend" ? "'Lexend', 'Inter', sans-serif" :
    font === "opendyslexic" ? "'OpenDyslexic', 'Lexend', 'Inter', sans-serif" :
    "'Inter', sans-serif";

  // Apply font to <html> so it cascades everywhere
  useEffect(() => {
    document.documentElement.style.fontFamily = fontFamily;
  }, [fontFamily]);

  // Sync .dark class on <html> for Tailwind dark: variants and shadcn/ui
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Combined CSS variables: palette base + dark mode overrides
  const pal = PALETTES[palette];

  const rootStyle: CSSVars = darkMode
    ? {
        // Dark mode — sober matte pastel palette
        "--background": "#1A1A1A",
        "--foreground": "#E8E4DF",
        "--card": "#242424",
        "--card-foreground": "#E8E4DF",
        "--popover": "#242424",
        "--popover-foreground": "#E8E4DF",
        "--primary": pal.accent,
        "--primary-foreground": palette === "contraste" ? "#1A1A04" : "#FFFFFF",
        "--secondary": "#2A2A2A",
        "--secondary-foreground": "#E8E4DF",
        "--border": "rgba(255,255,255,0.08)",
        "--muted": "#2A2A2A",
        "--muted-foreground": "#ABA7A2",
        "--accent": pal.accent,
        "--accent-foreground": "#FFFFFF",
        "--input-background": "#2A2A2A",
        "--ring": pal.accent,
        "--input": "#2A2A2A",
        "--switch-background": "#3A3A3A",
        "--destructive": "#b71c1c",
        "--destructive-foreground": "#FFFFFF",
        "--sidebar": "#1E1E1E",
        "--sidebar-foreground": "#E8E4DF",
        "--sidebar-primary": pal.accent,
        "--sidebar-primary-foreground": "#FFFFFF",
        "--sidebar-accent": "#2A2A2A",
        "--sidebar-accent-foreground": "#E8E4DF",
        "--sidebar-border": "rgba(255,255,255,0.08)",
        "--sidebar-ring": pal.accent,
        "--chart-1": pal.accent,
        "--chart-2": "#8BA7C4",
        "--chart-3": "#C4A88B",
        "--chart-4": "#A0C4A8",
        "--chart-5": "#C4A0B8",
      }
    : {
        // Light mode — from palette
        "--background": pal.bg,
        "--foreground": pal.fg,
        "--card": pal.card,
        "--card-foreground": pal.fg,
        "--popover": pal.card,
        "--popover-foreground": pal.fg,
        "--primary": pal.accent,
        "--primary-foreground": palette === "contraste" ? "#1A1A04" : "#FFFFFF",
        "--secondary": pal.border,
        "--secondary-foreground": pal.fg,
        "--border": pal.border,
        "--muted": pal.bg,
        "--muted-foreground": "#6A6A66",
        "--accent": pal.accent,
        "--accent-foreground": "#FFFFFF",
        "--input-background": pal.card,
        "--ring": pal.accent,
        "--input": "transparent",
        "--switch-background": "#86B39A",
        "--destructive": "#b71c1c",
        "--destructive-foreground": "#FFFFFF",
        "--sidebar": "#EEF3FA",
        "--sidebar-foreground": "#1A1A2E",
        "--sidebar-primary": "#1B4B7A",
        "--sidebar-primary-foreground": "#F7FAFC",
        "--sidebar-accent": "#DDE9F4",
        "--sidebar-accent-foreground": "#1A1A2E",
        "--sidebar-border": "rgba(27, 75, 122, 0.13)",
        "--sidebar-ring": "#2E86AB",
        "--chart-1": "#1B4B7A",
        "--chart-2": "#2E86AB",
        "--chart-3": "#C9830A",
        "--chart-4": "#4A7A61",
        "--chart-5": "#6B7E9A",
      };

  return {
    palette,
    darkMode,
    font,
    setPalette,
    setDarkMode,
    setFont,
    fontFamily,
    rootStyle,
  };
}
