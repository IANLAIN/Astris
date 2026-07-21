import { Globe } from "lucide-react";
import { Lang } from "@/types";
import { Overlay } from "../common/Overlay";

export function LanguageModal({ onSelect }: { onSelect: (l: Lang) => void }) {
  const LANGS: Array<{ code: Lang; label: string; flag: string }> = [
    { code: "es", label: "Español", flag: "ES" },
    { code: "en", label: "English", flag: "EN" },
    { code: "pt", label: "Português", flag: "PT" },
    { code: "fr", label: "Français", flag: "FR" },
  ];
  return (
    <Overlay label="Select language / Selecciona tu idioma">
      <div className="w-[95%] sm:w-full max-w-md rounded-2xl overflow-hidden mx-auto" style={{ backgroundColor: "var(--card)" }}>
        <div className="px-5 md:px-10 pt-10 pb-6 text-center border-b border-border">
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">Astris</div>
          <div className="flex items-center justify-center gap-2 mt-4 mb-2">
            <Globe size={18} aria-hidden="true" className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Select your language / Selecciona tu idioma</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelect(l.code)}
              className="flex items-center gap-3 p-5 rounded-xl border-2 cursor-pointer text-left"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              aria-label={l.label}
              lang={l.code}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{l.flag}</div>
              <span className="font-semibold text-foreground text-base">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Overlay>
  );
}
