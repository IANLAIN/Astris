import { useState } from "react";
import { User, MessageSquare } from "lucide-react";
import { Lang } from "../../types";
import { useT, C } from "../../i18n/useT";
import { supabase } from "../../../lib/supabase";

export function CompanyPostHire({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [obs, setObs] = useState("");
  const [sending, setSending] = useState(false);
  const [sentObs, setSentObs] = useState<string[]>([]);

  const handleSend = async () => {
    if (!obs.trim()) return;
    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
         await supabase.from("checkins").insert({ user_id: session.user.id, role: "company", note: obs });
      }
    } catch (e) {}
    setSentObs([obs, ...sentObs]);
    setObs("");
    setSending(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("comp.posthire.title")}</h1>
        <p className="text-muted-foreground mt-1">CAND-A7X2 · {lang === "es" ? "Analista de Datos Junior · Día 14 de 60" : "Junior Data Analyst · Day 14 of 60"}</p>
      </div>
      <div className="w-[95%] md:w-full md:max-w-4xl mx-auto w-full px-4 lg:px-20 py-10 flex flex-col gap-3 md:gap-6">
        <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-5">{C(lang, "compPostHireStatus") as string}</h2>
          <div className="flex gap-3 mb-6">
            {(C(lang, "statusLabels") as string[]).map((s, i) => (
              <div key={s} className="flex-1 py-4 rounded-xl border-2 text-center text-sm font-semibold" style={{ borderColor: i === 1 ? "var(--primary)" : "var(--border)", backgroundColor: i === 1 ? "var(--secondary)" : "var(--background)", color: "var(--foreground)" }}>{s}</div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{lang === "es" ? "El colaborador se encuentra en estado estable. Las herramientas asíncronas están configuradas correctamente. Se identificó un punto de fricción: reuniones sin agenda previa. El mentor está trabajando con RRHH para implementar un formato estructurado." : "The collaborator is in stable status. Async tools are correctly configured. One friction point identified: meetings without prior agenda. The mentor is working with HR to implement a structured format."}</p>
        </div>
        <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{C(lang, "compPostHireObs") as string}</h2>
          <textarea 
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="w-full px-4 py-4 rounded-xl border border-border text-sm text-foreground outline-none focus:border-primary min-h-[80px] resize-y" 
            style={{ backgroundColor: "var(--input-background)" }} 
            placeholder={C(lang, "compPostHireObsPlaceholder") as string}
          />
          <button onClick={handleSend} disabled={sending || !obs.trim()} className="mt-4 px-6 py-3 rounded-xl font-semibold cursor-pointer text-sm disabled:opacity-50" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            {sending ? "Enviando..." : (C(lang, "compPostHireSend") as string)}
          </button>
          
          {sentObs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-bold text-sm mb-3">Observaciones enviadas</h3>
              <div className="flex flex-col gap-3">
                {sentObs.map((o, i) => (
                   <div key={i} className="text-sm text-muted-foreground p-3 rounded-lg border border-border" style={{ backgroundColor: "var(--background)" }}>{o}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border p-7" style={{ backgroundColor: "var(--card)" }}>
          <h2 className="font-bold text-foreground mb-4">{C(lang, "compPostHireContact") as string}</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)" }} aria-hidden="true"><User size={22} style={{ color: "var(--primary)" }} /></div>
            <div><div className="font-bold text-foreground">Carmen Ruiz</div><div className="text-sm text-muted-foreground">carmen.ruiz@astris.co</div></div>
            <button className="ml-auto px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}><MessageSquare size={14} aria-hidden="true" className="inline mr-2" />{C(lang, "compPostHireSendMsg") as string}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
