import { useEffect, useState } from "react";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";
import vibralatinaImg from "@/assets/vibralatina.png";
import closerImg from "@/assets/closertothestarscircle.png";

interface Collaborator {
  name: string;
  url: string;
  imgSrc: string;
}

const COLLABORATORS: Collaborator[] = [
  {
    name: "Closer To The Stars",
    url: "https://closertothestars.org/",
    imgSrc: closerImg,
  },
  {
    name: "Vibra Latina",
    url: "https://www.vibralatinatx.com/",
    imgSrc: vibralatinaImg,
  },
];

export function CollaboratorCarousel({ lang, darkMode }: { lang: Lang; darkMode: boolean }) {
  const t = useT(lang);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COLLABORATORS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [paused, reducedMotion]);

  return (
    <div
      className="w-full select-none overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label={t("landing.supported")}
      style={{ perspective: "1200px" }}
    >
      <div className="relative flex items-center justify-center min-h-[180px] md:min-h-[200px]">
        {COLLABORATORS.map((item, idx) => {
          const offset = (idx - activeIndex + COLLABORATORS.length) % COLLABORATORS.length;
          
          let translateX = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 10;
          let filter = "none";
          let rotateY = 0;

          if (offset === 0) {
            translateX = 0;
            scale = 1.3;
            opacity = 1;
            zIndex = 30;
            rotateY = 0;
            filter = "none";
          } else if (offset === 1) {
            translateX = 200;
            scale = 0.85;
            opacity = 0.4;
            zIndex = 20;
            rotateY = -15;
            filter = "grayscale(0.5) blur(1px)";
          } else if (offset === 3) {
            translateX = -200;
            scale = 0.85;
            opacity = 0.4;
            zIndex = 20;
            rotateY = 15;
            filter = "grayscale(0.5) blur(1px)";
          } else {
            translateX = 0;
            scale = 0.5;
            opacity = 0;
            zIndex = 0;
            rotateY = 0;
          }

          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title={item.name}
              className="absolute flex items-center justify-center rounded-3xl border-2 transition-all duration-700 ease-in-out hover:!opacity-100 hover:!filter-none"
              style={{
                width: 224,
                height: 140,
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                filter,
                boxShadow: offset === 0
                  ? darkMode ? "0 20px 40px -10px rgba(0,0,0,0.5)" : "0 20px 40px -10px rgba(0,0,0,0.2)"
                  : "none",
                backgroundColor: "transparent",
                borderColor: offset === 0 ? "var(--primary)" : "var(--border)",
              }}
              tabIndex={offset === 0 ? 0 : -1}
              aria-hidden={offset !== 0}
            >
                <img
                  src={item.imgSrc}
                  alt={item.name}
                  className="object-contain transition-transform duration-500"
                  style={{ maxWidth: "90%", maxHeight: "90%" }}
                />
            </a>
          );
        })}
      </div>
    </div>
  );
}
