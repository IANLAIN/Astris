import { ArrowRight } from "lucide-react";
import { Lang, Role, PublicView } from "../../types";
import { useT } from "../../i18n/useT";
import { PublicPageShell } from "./PublicPageShell";
import genuineImg from "../../../imports/genuine.png";
import vibralatinaImg from "../../../imports/vibralatina.png";

export function SupportPage({ lang, onNavigate, onOpenAuth, onLang }: { lang: Lang; onNavigate: (view: PublicView) => void; onOpenAuth: (preRole?: Role, step?: "auth" | "login" | "register") => void; onLang: () => void }) {
  const t = useT(lang);
  const orgs = [
    { name: "Vibra Latina", description: "Acompañamiento y visibilidad para iniciativas de impacto social y talento inclusivo.", href: "https://www.vibralatinatx.com/", icon: <img src={vibralatinaImg} alt="Vibra Latina" className="h-10 w-10 object-contain" /> },
    { name: "Microsoft", description: "Soporte técnico, infraestructura y recursos de innovación para experiencias accesibles.", href: "https://support.microsoft.com/es-us/contactus/", icon: <svg width="24" height="24" viewBox="0 0 21 21" aria-hidden="true" className="shrink-0"><rect x="1" y="1" width="9" height="9" fill="#F25022" /><rect x="11" y="1" width="9" height="9" fill="#7FBA00" /><rect x="1" y="11" width="9" height="9" fill="#00A4EF" /><rect x="11" y="11" width="9" height="9" fill="#FFB900" /></svg> },
    { name: "The Genuine Foundation", description: "Aliada en la agenda de inclusión, comunidad y oportunidades de conexión real.", href: "https://genuinecup.org/", icon: <img src={genuineImg} alt="The Genuine Foundation" className="h-10 w-10 object-contain" /> },
  ];

  return (
    <PublicPageShell lang={lang} currentView="support" onNavigate={onNavigate} onOpenAuth={onOpenAuth} onLang={onLang} title={t("landing.nav.support")} subtitle="Recursos de contacto y apoyo para quienes quieren conocer más sobre Astris, trabajar con nosotros o participar de la red.">
      <div className="grid gap-3 md:gap-6 md:grid-cols-1 lg:grid-cols-3">
        {orgs.map((org) => (
          <div key={org.name} className="rounded-3xl border border-border bg-card p-7">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              {org.icon}
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">{org.name}</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{org.description}</p>
            <a href={org.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              <ArrowRight size={14} /> Ver enlace
            </a>
          </div>
        ))}
      </div>
    </PublicPageShell>
  );
}
