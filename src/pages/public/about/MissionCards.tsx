export function MissionCards({ about }: { about: any }) {
  return (
    <section className="mb-16 md:mb-24 grid gap-6 md:grid-cols-3">
      {(["purpose", "mission", "vision"] as const).map((key) => (
        <div key={key} className="rounded-3xl border border-border bg-card p-6 md:p-8 hover:shadow-lg transition-shadow">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{about[`${key}Label`]}</h3>
          <h4 className="mb-3 text-lg font-bold text-foreground">{about[`${key}Title`]}</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">{about[`${key}Body`]}</p>
        </div>
      ))}
    </section>
  );
}
