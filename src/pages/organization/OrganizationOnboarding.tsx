import { useState, useRef, useCallback, useMemo } from "react";
import { Building2, Upload, X, MapPin, Globe, Check, Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { SplitScreenLayout } from "@/components/common/SplitScreenLayout";
import { SelectableCard } from "@/components/common/SelectableCard";
import { SelectableChip } from "@/components/common/SelectableChip";
import { CustomSlider } from "@/components/common/CustomSlider";
import { RadarViz } from "@/components/common/RadarViz";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ──
export type OrgOnboardingData = {
  logo: string | null;
  name: string;
  sector: string;
  size: string;
  country: string;
  city: string;
};

export type AxisValues = {
  axis1: number; // Procesamiento — async(0) ↔ sync(100)
  axis2: number; // Ejecución — strict(0) ↔ autonomy(100)
  axis3: number; // Entorno — quiet(0) ↔ dynamic(100)
  axis4: number; // Flexibilidad — standardized(0) ↔ personalized(100)
};

export type WizardStep = "welcome" | 1 | 2 | 3 | 4;

const TOTAL_STEPS = 4;

const SIZE_OPTIONS = [
  { key: "1_20", tKey: "orgOnboarding.size_1_20" },
  { key: "21_100", tKey: "orgOnboarding.size_21_100" },
  { key: "101_500", tKey: "orgOnboarding.size_101_500" },
  { key: "500plus", tKey: "orgOnboarding.size_500plus" },
];

const ADJUSTMENT_ITEMS = [
  "orgOnboarding.adjustment_flexible_hours",
  "orgOnboarding.adjustment_cameras_off",
  "orgOnboarding.adjustment_silence_zones",
  "orgOnboarding.adjustment_software_licenses",
  "orgOnboarding.adjustment_written_comm",
  "orgOnboarding.adjustment_no_meeting_days",
] as const;

const AXIS_CONFIG = [
  { key: "axis1", tLabel: "orgOnboarding.axis1Label", tQ: "orgOnboarding.axis1Question", tHint: "orgOnboarding.axis1Hint", tLeft: "orgOnboarding.axis1Left", tRight: "orgOnboarding.axis1Right" },
  { key: "axis2", tLabel: "orgOnboarding.axis2Label", tQ: "orgOnboarding.axis2Question", tHint: "orgOnboarding.axis2Hint", tLeft: "orgOnboarding.axis2Left", tRight: "orgOnboarding.axis2Right" },
  { key: "axis3", tLabel: "orgOnboarding.axis3Label", tQ: "orgOnboarding.axis3Question", tHint: "orgOnboarding.axis3Hint", tLeft: "orgOnboarding.axis3Left", tRight: "orgOnboarding.axis3Right" },
  { key: "axis4", tLabel: "orgOnboarding.axis4Label", tQ: "orgOnboarding.axis4Question", tHint: "orgOnboarding.axis4Hint", tLeft: "orgOnboarding.axis4Left", tRight: "orgOnboarding.axis4Right" },
] as const;

// ── Labels for radar axes (short form) ──
const RADAR_AXIS_KEYS = ["about.radarAxes.processing", "about.radarAxes.execution", "about.radarAxes.environment", "about.radarAxes.adjustments"];

// ── Component ──
export function OrganizationOnboarding({
  lang,
  onComplete,
}: {
  lang: Lang;
  onComplete?: (data: OrgOnboardingData & { axes: AxisValues; adjustments: string[] }) => void;
}) {
  const t = useT(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wizard state
  const [step, setStep] = useState<WizardStep>("welcome");

  // Step 1 — Identity
  const [form, setForm] = useState<OrgOnboardingData>({
    logo: null,
    name: "",
    sector: "",
    size: "",
    country: "",
    city: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Step 2 — Axis values (defaults at center = 50)
  const [axes, setAxes] = useState<AxisValues>({ axis1: 50, axis2: 50, axis3: 50, axis4: 50 });

  // Step 3 — Adjustments
  const [adjustments, setAdjustments] = useState<string[]>([]);

  // Step 4 — Generated
  const [generated, setGenerated] = useState(false);

  const sectors = C(lang, "orgOnboarding.sectors") as string[];

  // ── Radar data derived from axis values ──
  const radarData = useMemo(() => {
    const shortAxes = RADAR_AXIS_KEYS.map((k) => t(k));
    return [
      { axis: shortAxes[0], value: axes.axis1 },
      { axis: shortAxes[1], value: axes.axis2 },
      { axis: shortAxes[2], value: axes.axis3 },
      { axis: shortAxes[3], value: axes.axis4 },
    ];
  }, [axes, lang, t]);

  // ── Helpers ──
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setLogoPreview(dataUrl);
      setForm((prev) => ({ ...prev, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
  }, []);

  const clearLogo = useCallback(() => {
    setLogoPreview(null);
    setForm((prev) => ({ ...prev, logo: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const setField = useCallback(<K extends keyof OrgOnboardingData>(key: K, val: OrgOnboardingData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  const setAxis = useCallback((key: keyof AxisValues, val: number) => {
    setAxes((prev) => ({ ...prev, [key]: val }));
  }, []);

  const toggleAdjustment = useCallback((adjKey: string) => {
    setAdjustments((prev) =>
      prev.includes(adjKey) ? prev.filter((a) => a !== adjKey) : [...prev, adjKey],
    );
  }, []);

  const canProceedStep1 = form.name.trim() && form.sector && form.size && form.country.trim() && form.city.trim();
  const canProceedStep3 = adjustments.length > 0;

  const stepLabel = (s: number) => `${t("orgOnboarding.step")} ${s} ${t("orgOnboarding.of")} ${TOTAL_STEPS}`;

  // ── Generate summary text ──
  const summaryText = useMemo(() => {
    const axis2val = axes.axis2 <= 33 ? "estructurado" : axes.axis2 <= 66 ? "balanceado" : "autónomo";
    const axis1val = axes.axis1 <= 33 ? "asíncrono" : axes.axis1 <= 66 ? "mixto" : "síncrono";
    return t("orgOnboarding.step4Summary", { axis2: axis2val, axis1: axis1val });
  }, [axes, t]);

  // ══════════════════════════════════════════
  //  WELCOME SCREEN (Step 0)
  // ══════════════════════════════════════════
  if (step === "welcome") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FDECE8] via-white to-[#F5F0EB] dark:from-[#1E1412] dark:via-[#0F0F0F] dark:to-[#1A1412] px-6">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Building2 size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-5">
            {t("orgOnboarding.welcomeTitle")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto">
            {t("orgOnboarding.welcomeSub")}
          </p>
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-base bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 transition-all cursor-pointer"
          >
            {t("orgOnboarding.welcomeCTA")}
            <Building2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  //  WIZARD CONTENT
  // ══════════════════════════════════════════
  const leftPanel = (
    <div className="max-w-lg mx-auto w-full">
      {/* ── Progress bar ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex gap-1.5 flex-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: i === (step as number) - 1 ? "48px" : "24px",
                backgroundColor: i <= (step as number) - 1 ? "var(--primary)" : "var(--muted)",
                opacity: i <= (step as number) - 1 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">
          {stepLabel(step as number)}
        </span>
      </div>

      {/* ── Back button (except step 1) ── */}
      {(step as number) > 1 && (
        <button
          onClick={() => setStep((step as number) - 1 as WizardStep)}
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer bg-transparent border-0"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </button>
      )}

      {/* ========================================
          STEP 1 — IDENTIDAD BASE
      ======================================== */}
      {step === 1 && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t("orgOnboarding.step1Title")}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {t("orgOnboarding.step1Sub")}
          </p>

          {/* Logo */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-foreground mb-2">{t("orgOnboarding.logoLabel")}</label>
            <p className="text-xs text-muted-foreground mb-3">{t("orgOnboarding.logoHint")}</p>
            {logoPreview ? (
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-2xl border-2 border-border overflow-hidden bg-card">
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                </div>
                <button onClick={clearLogo} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md cursor-pointer border-0"><X size={14} /></button>
                <button onClick={() => fileInputRef.current?.click()} className="ml-3 mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-0">{t("orgOnboarding.logoReplace")}</button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-28 h-28 rounded-2xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Upload size={22} className="text-muted-foreground" />
                <span className="text-[11px] font-semibold text-muted-foreground">{t("orgOnboarding.logoUpload")}</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>

          {/* Name */}
          <div className="mb-6">
            <label htmlFor="org-name" className="block text-sm font-bold text-foreground mb-1.5">{t("orgOnboarding.nameLabel")}</label>
            <p className="text-xs text-muted-foreground mb-2">{t("orgOnboarding.nameHint")}</p>
            <input id="org-name" type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-input-background text-foreground text-base focus:border-primary focus:outline-none transition-colors" placeholder={t("orgOnboarding.namePlaceholder")} autoFocus />
          </div>

          {/* Sector */}
          <div className="mb-6">
            <label htmlFor="org-sector" className="block text-sm font-bold text-foreground mb-1.5">{t("orgOnboarding.sectorLabel")}</label>
            <p className="text-xs text-muted-foreground mb-2">{t("orgOnboarding.sectorHint")}</p>
            <Select value={form.sector} onValueChange={(val) => setField("sector", val)}>
              <SelectTrigger className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-input-background text-foreground h-auto text-base">
                <SelectValue placeholder={t("orgOnboarding.sectorPlaceholder")} />
              </SelectTrigger>
              <SelectContent>{sectors.map((s: string) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          {/* Size */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-foreground mb-1.5">{t("orgOnboarding.sizeLabel")}</label>
            <p className="text-xs text-muted-foreground mb-3">{t("orgOnboarding.sizeHint")}</p>
            <div className="grid grid-cols-2 gap-3">
              {SIZE_OPTIONS.map((opt) => (
                <SelectableCard key={opt.key} selected={form.size === opt.key} onClick={() => setField("size", opt.key)} className="p-4">
                  <span className="font-semibold text-sm">{t(opt.tKey)}</span>
                </SelectableCard>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-2"><MapPin size={14} className="text-muted-foreground" />{t("orgOnboarding.locationLabel")}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">{t("orgOnboarding.countryHint")}</p>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input id="org-country" type="text" value={form.country} onChange={(e) => setField("country", e.target.value)} className="w-full pl-9 pr-4 py-3.5 rounded-xl border-2 border-border bg-input-background text-foreground text-base focus:border-primary focus:outline-none transition-colors" placeholder={t("orgOnboarding.countryPlaceholder")} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">{t("orgOnboarding.cityHint")}</p>
                <input id="org-city" type="text" value={form.city} onChange={(e) => setField("city", e.target.value)} className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-input-background text-foreground text-base focus:border-primary focus:outline-none transition-colors" placeholder={t("orgOnboarding.cityPlaceholder")} />
              </div>
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!canProceedStep1} className="w-full py-4 rounded-2xl font-bold text-base bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shadow-lg shadow-primary/20 transition-all cursor-pointer">
            {t("orgOnboarding.next")} <span className="ml-2">→</span>
          </button>
        </>
      )}

      {/* ========================================
          STEP 2 — MATRIZ OPERATIVA (4 Sliders)
      ======================================== */}
      {step === 2 && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("orgOnboarding.step2Title")}</h2>
          <p className="text-muted-foreground text-sm mb-8">{t("orgOnboarding.step2Sub")}</p>

          <div className="space-y-8">
            {AXIS_CONFIG.map((ax) => {
              const val = axes[ax.key];
              return (
                <div key={ax.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-foreground">{t(ax.tLabel)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{t(ax.tQ)}</p>
                  <CustomSlider
                    value={val}
                    onChange={(v) => setAxis(ax.key, v)}
                    labelLeft={t(ax.tLeft)}
                    labelRight={t(ax.tRight)}
                  />
                  <p className="text-[11px] text-muted-foreground/60 italic mt-1.5">{t(ax.tHint)}</p>
                </div>
              );
            })}
          </div>

          <button onClick={() => setStep(3)} className="w-full py-4 mt-8 rounded-2xl font-bold text-base bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all cursor-pointer">
            {t("orgOnboarding.next")} <span className="ml-2">→</span>
          </button>
        </>
      )}

      {/* ========================================
          STEP 3 — CATÁLOGO DE AJUSTES
      ======================================== */}
      {step === 3 && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("orgOnboarding.step3Title")}</h2>
          <p className="text-muted-foreground text-sm mb-6">{t("orgOnboarding.step3Sub")}</p>
          <p className="text-xs font-semibold text-muted-foreground mb-4">{t("orgOnboarding.step3Hint")}</p>

          <div className="flex flex-wrap gap-3">
            {ADJUSTMENT_ITEMS.map((adjKey) => (
              <SelectableChip
                key={adjKey}
                selected={adjustments.includes(adjKey)}
                onClick={() => toggleAdjustment(adjKey)}
                label={t(adjKey)}
              />
            ))}
          </div>

          <button
            onClick={() => setStep(4)}
            disabled={!canProceedStep3}
            className="w-full py-4 mt-8 rounded-2xl font-bold text-base bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shadow-lg shadow-primary/20 transition-all cursor-pointer"
          >
            {t("orgOnboarding.next")} <span className="ml-2">→</span>
          </button>
        </>
      )}

      {/* ========================================
          STEP 4 — CONSOLIDACIÓN
      ======================================== */}
      {step === 4 && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("orgOnboarding.step4Title")}</h2>
          <p className="text-muted-foreground text-sm mb-8">{t("orgOnboarding.step4Sub")}</p>

          {!generated ? (
            <div className="space-y-6">
              {/* Selected adjustments summary */}
              <div className="p-5 rounded-2xl border-2 border-border bg-card">
                <h3 className="text-sm font-bold text-foreground mb-3">{t("orgOnboarding.step4AdjustmentsLabel")}</h3>
                {adjustments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {adjustments.map((adjKey) => (
                      <span key={adjKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <Check size={10} />{t(adjKey)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("orgOnboarding.step4EmptyAdjustments")}</p>
                )}
              </div>

              <button
                onClick={() => setGenerated(true)}
                className="w-full py-5 rounded-2xl font-bold text-lg bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <Sparkles size={20} />
                {t("orgOnboarding.step4Generate")}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border-2 border-primary/30 bg-primary/5">
                <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                  <Check size={16} />
                  {t("orgOnboarding.step4Generated")}
                </h3>
                <p className="text-sm text-foreground leading-relaxed">{summaryText}</p>
              </div>

              <button
                onClick={() => onComplete?.({ ...form, axes, adjustments })}
                className="w-full py-5 rounded-2xl font-bold text-lg bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 transition-all cursor-pointer"
              >
                {t("orgOnboarding.finish")} <span className="ml-2">→</span>
              </button>

              <button
                onClick={() => { setGenerated(false); }}
                className="w-full py-3 rounded-2xl font-bold text-sm border-2 border-border bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                {t("orgOnboarding.step4BackToStart")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ── Right panel — Live preview (themed) ──
  const rightPanel = (
    <div className="p-8 md:p-10 flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Step 1: Organization Identity Preview */}
      {step === 1 && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-4">
            {t("orgOnboarding.previewTitle")}
          </span>
          <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-8 shadow-md shadow-primary/5 text-center">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center overflow-hidden bg-muted/50">
              {logoPreview ? (
                <img src={logoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={32} className="text-muted-foreground/50" />
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {form.name || (
                <span className="text-muted-foreground/50 font-normal">{t("orgOnboarding.previewDefaultName")}</span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground/70 mb-1">
              {form.sector || (
                <span className="text-muted-foreground/40">{t("orgOnboarding.previewDefaultSector")}</span>
              )}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
              <MapPin size={12} />
              <span>{form.country && form.city ? `${form.country}, ${form.city}` : t("orgOnboarding.previewDefaultLocation")}</span>
            </div>
            {form.size && (
              <div className="mt-4 inline-flex px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {SIZE_OPTIONS.find((o) => o.key === form.size) ? t(SIZE_OPTIONS.find((o) => o.key === form.size)!.tKey) : form.size}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground/50 text-center mt-4">{t("orgOnboarding.previewSub")}</p>
        </div>
      )}

      {/* Steps 2, 3, 4: Radar + Adjustments Preview */}
      {(step === 2 || step === 3 || step === 4) && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-4">
            {t("orgOnboarding.step4RadarLabel")}
          </span>

          {/* Radar card — themed */}
          <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-md shadow-primary/5">
            <RadarViz data={radarData} height={320} outerRadius={110} fontSize={12} />

            {/* Axis values below radar */}
            <hr className="border-border/40 my-5" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {AXIS_CONFIG.map((ax, i) => (
                <div key={ax.key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground/70 font-semibold">{t(ax.tLabel)}</span>
                  <span className="font-bold font-mono tabular-nums text-primary">
                    {axes[ax.key]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Adjustments chips (only step 4) */}
          {step === 4 && adjustments.length > 0 && (
            <div className="w-full max-w-sm mt-5">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 block mb-3">
                {t("orgOnboarding.step4AdjustmentsLabel")}
              </span>
              <div className="flex flex-wrap gap-2">
                {adjustments.map((adjKey) => (
                  <span
                    key={adjKey}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-secondary/60 text-secondary-foreground border border-border/50"
                  >
                    <Check size={9} />
                    {t(adjKey)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return <SplitScreenLayout left={leftPanel} right={rightPanel} />;
}
