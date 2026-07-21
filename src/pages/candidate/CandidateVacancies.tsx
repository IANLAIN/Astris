import { useState, useEffect } from "react";
import { Clock, MapPin, Check, ArrowRight, ShieldAlert, SlidersHorizontal, X } from "lucide-react";
import { Lang, VacancyItem } from "@/types";
import { useT } from "@/i18n/useT";
import { getMatchesForCandidate, getCurrentUser } from "@/services/supabase";
import { MatchBadge } from "@/components/common/MatchBadge";

export function CandidateVacancies({ lang, onSelect }: { lang: Lang; onSelect: (id: string) => void }) {
  const t = useT(lang);
  const [modalityFilter, setModalityFilter] = useState("all");
  const [socialFilter, setSocialFilter] = useState("all");
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [loadingVac, setLoadingVac] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      const user = await getCurrentUser();
      const candidateId = user?.id || "demo-cand";
      const matches = await getMatchesForCandidate(candidateId);
      
      if (matches.length > 0) {
        const mapped: VacancyItem[] = matches.map((m: any) => ({
          id: m.jobId,
          title: m.title,
          company: m.company,
          sector: m.sector || "Tecnología",
          modality: m.modality || t("modality.remote"),
          type: m.type || t("vacancy.full_time"),
          match: m.matchPercentage,
          socialLevel: m.socialLevel || "Bajo",
          adjustments: m.adjustments || [],
          desc: m.desc || "",
          companyDesc: m.companyDesc || "",
        }));
        setVacancies(mapped.sort((a: any, b: any) => b.match - a.match));
      } else {
        setVacancies([]);
      }
      setLoadingVac(false);
    }
    loadJobs();
  }, [lang, t]);

  const filtered = vacancies.filter((v) => {
    if (modalityFilter !== "all" && !v.modality.toLowerCase().includes(modalityFilter)) return false;
    if (socialFilter !== "all" && v.socialLevel.toLowerCase() !== socialFilter) return false;
    return true;
  });

  const SOCIAL_LEVELS = ["Bajo", "Medio", "Alto"];
  const MODALITY_OPTIONS = [
    ["all", t("common.all")],
    ["remote", t("modality.remote")],
    ["hybrid", t("modality.hybrid")],
    ["in_person", t("modality.in_person")],
  ];

  const filterContent = (
    <div className="rounded-2xl border border-border p-5 md:p-6" style={{ backgroundColor: "var(--card)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground text-sm">{t("vacancies.filters")}</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="lg:hidden p-1 rounded-md text-muted-foreground cursor-pointer hover:bg-secondary border-0"
          aria-label="Cerrar filtros"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mb-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("vacancies.modality")}</div>
        <div className="flex flex-col gap-1.5">
          {MODALITY_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setModalityFilter(val)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-left bg-transparent border-0 transition-colors"
              style={{
                backgroundColor: modalityFilter === val ? "var(--secondary)" : "transparent",
                color: "var(--foreground)",
                fontWeight: modalityFilter === val ? 600 : 400,
              }}
            >
              {modalityFilter === val && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("vacancies.social")}</div>
        <div className="flex flex-col gap-1.5">
          {[["all", t("common.all")], ...SOCIAL_LEVELS.map((s) => [s, s])].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSocialFilter(val)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-left bg-transparent border-0 transition-colors"
              style={{
                backgroundColor: socialFilter === val ? "var(--secondary)" : "transparent",
                color: "var(--foreground)",
                fontWeight: socialFilter === val ? 600 : 400,
              }}
            >
              {socialFilter === val && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("vacancies.title")}</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} {t("vacancy.compatible_vacancies")}</p>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-20 py-6 md:py-10">
        {/* Mobile filter toggle */}
        <div className="flex lg:hidden items-center gap-2 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold cursor-pointer bg-card text-foreground hover:bg-secondary transition-colors"
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            {t("vacancies.filters")}
            {(modalityFilter !== "all" || socialFilter !== "all") && (
              <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            )}
          </button>
          {(modalityFilter !== "all" || socialFilter !== "all") && (
            <button
              onClick={() => { setModalityFilter("all"); setSocialFilter("all"); }}
              className="text-xs text-muted-foreground underline cursor-pointer bg-transparent border-0"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="lg:hidden mb-4">
            {filterContent}
          </div>
        )}

        <div className="flex gap-4 md:gap-8">
          {/* Desktop filters sidebar */}
          <div className="hidden lg:block w-60 shrink-0">
            {filterContent}
          </div>

          {/* Vacancy cards */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-5">
            {loadingVac ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">{t("common.loading")}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
                  <ShieldAlert size={32} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No hay vacantes disponibles</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Aún no hay vacantes sugeridas para tu perfil. Completa tu caracterización para recibir recomendaciones.
                </p>
              </div>
            ) : filtered.map((v) => (
              <article
                key={v.id}
                className="rounded-2xl border border-border p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-7 transition-all duration-300 hover:shadow-xl hover:border-primary group"
                style={{ backgroundColor: "var(--card)" }}
              >
                <MatchBadge value={v.match} size="lg" />
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors break-words">
                        {v.title}
                      </h3>
                      <div className="text-sm text-muted-foreground break-words">
                        {v.company} · {v.sector}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground shrink-0 flex-wrap">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Clock size={13} aria-hidden="true" />{v.type}
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin size={13} aria-hidden="true" />{v.modality}
                      </span>
                    </div>
                  </div>
                  {v.adjustments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {v.adjustments.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] md:text-xs font-medium border border-border"
                          style={{ backgroundColor: "var(--secondary)" }}
                        >
                          <Check size={9} aria-hidden="true" style={{ color: "var(--accent)" }} />
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onSelect(v.id)}
                  className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold cursor-pointer text-sm border-0 transition-transform hover:scale-105"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  {t("common.view_detail")}
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
