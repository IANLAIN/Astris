import { useState, useEffect } from "react";
import { MessageSquare, ShieldAlert, Building2, MapPin } from "lucide-react";
import { Lang } from "@/types";
import { useT, C } from "@/i18n/useT";
import { getCurrentUser, isDemoUserUser } from "@/services/supabase";
import { MENTOR_ORGANIZATIONS } from "@/services/demoData";

export function MentorOrganizations({ lang }: { lang: Lang }) {
  const t = useT(lang);
  const [companies, setCompanies] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      const demo = user ? isDemoUserUser(user.id) : false;
      setCompanies(demo ? MENTOR_ORGANIZATIONS : []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-background pb-12">
      {/* Premium Header / Banner */}
      <div className="w-full h-40 md:h-56 relative overflow-hidden bg-primary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.5 }} />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-card border-4 border-background shadow-xl flex items-center justify-center shrink-0 overflow-hidden relative">
            <Building2 size={60} className="text-primary/50" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">{C(lang, "organizationsPageTitle") as string}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 font-medium">{C(lang, "organizationsPageSub") as string}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.loading")}</div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4 border-2 border-dashed border-border rounded-3xl max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-500/10">
              <ShieldAlert size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay organizaciones vinculadas</h3>
            <p className="text-muted-foreground max-w-sm">Aún no tienes organizaciones asociadas a tu perfil de mentor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((co) => (
              <article key={co.name} className="rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-6 bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-300 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 size={24} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: co.color + "15", color: co.color }}>{co.status}</span>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="text-xl font-bold text-foreground break-words group-hover:text-primary transition-colors">{co.name}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-2">
                    <MapPin size={14} /> Contacto: {co.contact}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 group-hover:bg-secondary/60 transition-colors text-center">
                  <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{co.processes}</div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{C(lang, "mentor.co.activeProcess") as string}</div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold cursor-pointer text-sm border-2 border-border bg-background text-foreground hover:border-primary hover:bg-primary/5 transition-colors">
                  <MessageSquare size={16} aria-hidden="true" />
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
