import { useState, useEffect } from "react";
import { User, Star, MapPin, Check } from "lucide-react";
import { Lang, MentorItem } from "../../types";
import { useT } from "../../i18n/useT";
import { supabase } from "../../../lib/supabase";

export function MentorSelect({ lang, onSelect }: { lang: Lang; onSelect: () => void }) {
  const t = useT(lang);
  const [chosen, setChosen] = useState<string | null>(null);
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [loadingMent, setLoadingMent] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        const { data: mentorsData, error: mentorsErr } = await supabase
          .from("mentors")
          .select("user_id, full_name, specialty, years_experience, modality, bio");

        if (mentorsErr || !mentorsData || mentorsData.length === 0) {
          setMentors([]);
          setLoadingMent(false);
          return;
        }

        const mapped: MentorItem[] = mentorsData.map((m: any) => ({
          id: m.user_id,
          name: m.full_name ?? "Mentor",
          specialty: m.specialty ?? "",
          years: m.years_experience ?? 5,
          modality: m.modality ?? "Virtual",
          bio: m.bio ?? "",
        }));
        setMentors(mapped);
      } catch (e) {
        setMentors([]);
      } finally {
        setLoadingMent(false);
      }
    }
    loadMentors();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <div className="px-4 lg:px-20 py-10 border-b border-border" style={{ backgroundColor: "var(--card)" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("mentor.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("mentor.sub")}</p>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-20 py-10">
        {loadingMent ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">{lang === "es" ? "Cargando mentores..." : "Loading mentors..."}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {mentors.map((m) => (
              <article key={m.id} className="rounded-3xl border-2 flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1" style={{ borderColor: chosen === m.id ? "var(--primary)" : "var(--border)", backgroundColor: "var(--card)" }}>
                <div className="px-6 pt-8 pb-5">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm" style={{ backgroundColor: "var(--secondary)" }} aria-hidden="true">
                    <User size={32} style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-tight">{m.specialty}</div>
                  </div>
                </div>
                <div className="px-6 pb-5 flex flex-col gap-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Star size={12} aria-hidden="true" style={{ color: "var(--accent)" }} />{m.years} {lang === "es" ? "años de experiencia" : "years experience"}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin size={12} aria-hidden="true" />{m.modality}</div>
                  {m.bio && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{m.bio}</p>}
                </div>
                <div className="px-6 pb-6 mt-auto">
                  <button onClick={() => { setChosen(m.id); setTimeout(onSelect, 300); }} className="w-full py-4 rounded-2xl font-bold cursor-pointer text-sm border-0 transition-all hover:scale-[1.02]" style={{ backgroundColor: chosen === m.id ? "var(--primary)" : "var(--secondary)", color: chosen === m.id ? "var(--primary-foreground)" : "var(--foreground)" }}>
                    {chosen === m.id ? <span className="flex items-center justify-center gap-1.5"><Check size={16} aria-hidden="true" /> {lang === "es" ? "Seleccionado" : "Selected"}</span> : t("mentor.choose")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
