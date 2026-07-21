import { Check } from "lucide-react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";

export function OrganizationPostVacancy({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const SKILLS = ["Mecanografía", "Ofimática avanzada", "Lectura intensiva", "Redacción técnica", "Análisis de datos", "Diseño visual", "Comunicación verbal"];
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("comp.vacancy.title")}</h1>
      </div>
      <div className="max-w-3xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-7">
        {[["Título del cargo", "Analista de Datos Junior"], ["Descripción de funciones", ""], ["Tipo de comunicación predominante", "Escrita — asíncrona"]].map(([label, val]) => (
          <div key={label as string}>
            <label className="block text-sm font-semibold text-foreground mb-2">{label as string}</label>
            {label === "Descripción de funciones" ? (
              <div className="w-full px-4 py-4 rounded-xl border border-border text-sm text-muted-foreground min-h-[80px]" style={{ backgroundColor: "var(--input-background)" }}>Análisis y visualización de bases de datos para reportes semanales del equipo...</div>
            ) : (
              <div className="w-full px-4 py-3 rounded-xl border border-border text-sm" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}>{val as string}</div>
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">{t("comp.post.socialReq")}</label>
          <div className="flex gap-3">
            {["Bajo", "Medio", "Alto"].map((lvl, i) => (
              <button key={lvl} className="flex-1 py-3 rounded-xl border-2 text-sm font-semibold cursor-pointer" style={{ borderColor: i === 0 ? "var(--primary)" : "var(--border)", backgroundColor: i === 0 ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}>{lvl}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">{t("comp.post.techReq")}</label>
          <div className="flex flex-wrap gap-2.5">
            {SKILLS.map((sk, i) => {
              const checked = [0, 1, 3, 4].includes(i);
              return (
                <div key={sk} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer" style={{ borderColor: checked ? "var(--primary)" : "var(--border)", backgroundColor: checked ? "var(--secondary)" : "var(--background)" }}>
                  <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: checked ? "var(--primary)" : "var(--muted-foreground)", backgroundColor: checked ? "var(--primary)" : "transparent" }} aria-hidden="true">
                    {checked && <Check size={9} style={{ color: "var(--primary-foreground)" }} />}
                  </div>
                  <span className="text-sm text-foreground">{sk}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("comp.post.modality")}</label>
            <div className="px-4 py-3 rounded-xl border border-border text-sm" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}>100% Remoto</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t("comp.post.schedule")}</label>
            <div className="px-4 py-3 rounded-xl border border-border text-sm" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}>Flexible — 8h diarias</div>
          </div>
        </div>
        <button className="self-end px-4 md:px-8 py-4 rounded-xl font-bold cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("comp.post.submit")}</button>
      </div>
    </div>
  );
}
