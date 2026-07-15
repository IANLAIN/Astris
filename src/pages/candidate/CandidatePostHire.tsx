import { useState } from "react";
import { Activity, TrendingUp, CheckCircle, Sparkles } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { supabase } from "@/services/supabase";

const STATUS_CONFIG = [
  { Icon: Activity, labelKey: "statusLabels.0", descKey: "statusDesc.0", color: "#F59E0B" },
  { Icon: TrendingUp, labelKey: "statusLabels.1", descKey: "statusDesc.1", color: "#10B981" },
  { Icon: CheckCircle, labelKey: "statusLabels.2", descKey: "statusDesc.2", color: "#3B82F6" },
];

export function CandidatePostHire({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [status, setStatus] = useState(1);
  const STATUS_LABELS = C(lang, "statusLabels") as string[];
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [history, setHistory] = useState(C(lang, "postHireHistory") as any[]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!q1.trim() && !q2.trim()) return;
    setSending(true);
    const newEntry = {
      date: new Date().toLocaleDateString(),
      note: `${q1 ? 'Q1: ' + q1 : ''} ${q2 ? '| Q2: ' + q2 : ''}`
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
         await supabase.from("checkins").insert({ user_id: session.user.id, role: "candidate", note: newEntry.note });
      }
    } catch (e) {}
    setHistory([newEntry, ...history]);
    setQ1("");
    setQ2("");
    setSending(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("posthire.title")}</h1>
        <p className="text-muted-foreground mt-1">Veritas Analytics · {t("vacancy.data_analyst")} · {t("vacancy.day_14_of_60")}</p>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-4 md:gap-8">
        {/* Status — Professional icon cards */}
        <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-6">{t("posthire.status")}</h2>
          <div className="flex gap-4 flex-col sm:flex-row">
            {STATUS_LABELS.map((label, i) => {
              const { Icon, color } = STATUS_CONFIG[i] || { Icon: Activity, color: "#6366F1" };
              const active = status === i;
              return (
                <button
                  key={i}
                  onClick={() => setStatus(i)}
                  className="flex-1 flex flex-col items-center gap-3 py-5 px-4 rounded-xl border-2 text-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: active ? color : "var(--border)",
                    backgroundColor: active ? `${color}10` : "var(--background)",
                    color: active ? color : "var(--muted-foreground)",
                    boxShadow: active ? `0 4px 20px ${color}25` : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: active ? `${color}18` : "var(--muted)",
                      color: active ? color : "var(--muted-foreground)",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5 uppercase tracking-wider">
                      {i === 0 ? "En proceso" : i === 1 ? "Estable" : "Completado"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Report */}
        <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{t("posthire.this_week_report")}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{C(lang, "postHireQ1") as string}</label>
              <textarea 
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground outline-none focus:border-primary resize-y min-h-[80px]" 
                style={{ backgroundColor: "var(--input-background)" }} 
                placeholder={C(lang, "postHireTextPlaceholder") as string}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{C(lang, "postHireQ2") as string}</label>
              <textarea 
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm text-foreground outline-none focus:border-primary resize-y min-h-[80px]" 
                style={{ backgroundColor: "var(--input-background)" }} 
                placeholder={C(lang, "postHireTextPlaceholder") as string}
              />
            </div>
            <button onClick={handleSend} disabled={sending || (!q1.trim() && !q2.trim())} className="self-start px-6 py-3 rounded-xl font-semibold cursor-pointer text-sm disabled:opacity-50" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
              {sending ? "Enviando..." : (C(lang, "postHireSend") as string)}
            </button>
          </div>
        </div>
        {/* History */}
        <div className="rounded-2xl border border-border p-4 md:p-8" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{C(lang, "postHireCheckins") as string}</h2>
          {history.map((h, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5" style={{ fontFamily: "DM Mono, monospace" }}>{h.date}</span>
              <p className="text-sm text-foreground leading-relaxed">{h.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
