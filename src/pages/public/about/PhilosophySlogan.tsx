import { motion } from "framer-motion";

export function PhilosophySlogan({ quote }: { quote: string }) {
  if (!quote) return null;

  return (
    <section className="mb-20 md:mb-32 flex justify-center mt-12 md:mt-24">
      <motion.div 
        className="mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-3xl md:text-5xl font-bold text-foreground leading-tight italic" style={{ fontFamily: "DM Mono, monospace" }}>
          “{quote}”
        </p>
      </motion.div>
    </section>
  );
}
