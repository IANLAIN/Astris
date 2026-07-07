export function HeroStatsSection({ stat, quote }: { stat: any, quote: string }) {
  return (
    <section className="mb-16 md:mb-24 flex justify-center pt-4 md:pt-8">
      <div className="w-full flex flex-col items-center text-center p-10 md:p-16 rounded-[2rem] border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent shadow-sm">
        <div className="font-bold text-primary mb-6 text-[5rem] md:text-[8rem] leading-none tracking-tighter" style={{ fontFamily: "DM Mono, monospace" }}>
          {stat.value}
        </div>
        <p className="text-foreground font-semibold mb-8 text-2xl md:text-4xl leading-snug max-w-4xl">
          {stat.text}
        </p>
        {quote && (
          <p className="text-xl md:text-3xl text-muted-foreground font-medium max-w-3xl mb-10 italic leading-relaxed">
            “{quote}”
          </p>
        )}
        <span className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-medium opacity-80">{stat.source}</span>
      </div>
    </section>
  );
}
