import { useState, useEffect } from "react";
import { MessageSquare, ShieldAlert } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { getCurrentUser, isDemoUser } from "@/services/supabase";
import { MENTOR_COMPANIES } from "@/services/demoData";

export function MentorCompanies({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [companies, setCompanies] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      const demo = user ? isDemoUser(user.id) : false;
      setCompanies(demo ? MENTOR_COMPANIES : []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{C(lang, "companiesPageTitle") as string}</h1>
        <p className="text-muted-foreground mt-2">{C(lang, "companiesPageSub") as string}</p>
      </div>
      <div className="w-[95%] md:w-full md:max-w-4xl mx-auto w-full px-4 lg:px-20 py-10">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
              <ShieldAlert size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay empresas vinculadas</h3>
            <p className="text-muted-foreground max-w-sm">Aún no tienes empresas asociadas a tu perfil de mentor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {companies.map((co) => (
              <article key={co.name} className="rounded-2xl border border-border p-6 flex flex-col gap-4" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-foreground">{co.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{co.contact}</div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: co.color + "22", color: co.color }}>{co.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{co.processes} {C(lang, "mentor.co.activeProcess") as string}</div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold cursor-pointer text-sm border border-border" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
                  <MessageSquare size={13} aria-hidden="true" />
                  {C(lang, "compPostHireSendMsg") as string}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
