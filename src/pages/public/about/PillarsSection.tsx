import { Check } from "lucide-react";

export function PillarsSection({ about, pillars }: { about: any, pillars: any[] }) {
  return (
    <>
      <section className="mb-12 md:mb-16">
        <h2 className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{about.pillarsEyebrow}</h2>
        <p className="text-center text-2xl md:text-4xl font-bold text-foreground">{about.pillarsTitle}</p>
      </section>

      {pillars.map((pillar, i) => {
        const data = about[pillar.key] as { title: string; body: string; values?: string[] };
        const isEven = i % 2 === 0;
        
        return (
          <div key={pillar.key}>
            {i > 0 && (
              <section className="mb-16 mt-8 flex justify-center">
                <div className="w-full md:w-8/12 lg:w-6/12 flex flex-col items-center text-center p-8 md:p-10 rounded-3xl border border-border bg-card shadow-sm">
                  <div className="font-bold text-primary mb-4 text-6xl md:text-7xl" style={{ fontFamily: "DM Mono, monospace" }}>
                    {pillar.stat.value}
                  </div>
                  <p className="text-foreground font-medium mb-3 text-lg md:text-xl leading-relaxed">
                    {pillar.stat.text}
                  </p>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider opacity-70 mt-1">{pillar.stat.source}</span>
                </div>
              </section>
            )}

            <section className="mb-16 md:mb-24 last:mb-0">
              <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}>
                <div className="w-full md:w-1/2 shrink-0">
                  <div className="rounded-[2rem] border-2 border-border overflow-hidden shadow-lg bg-card p-2 md:p-4">
                    <img
                      src={pillar.img}
                      alt={data.title}
                      className="w-full h-auto object-cover rounded-2xl"
                      style={{ aspectRatio: "4/3", maxHeight: "450px" }}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                  <h3 className="mb-4 text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                    {data.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">{data.body}</p>
                  {data.values && data.values.length > 0 && (
                    <ul className="space-y-3">
                      {data.values.map((val: string, vi: number) => (
                        <li key={vi} className="flex items-start gap-3 text-sm font-medium text-foreground">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check size={12} className="text-primary" aria-hidden="true" />
                          </span>
                          {val}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </>
  );
}
