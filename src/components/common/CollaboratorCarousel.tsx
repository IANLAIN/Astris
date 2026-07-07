import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Lang } from "@/types";
import { useT } from "@/i18n/useT";
import genuineImg from "@/assets/genuine.png";
import vibralatinaImg from "@/assets/vibralatina.png";
import closerImg from "/closertothestars.png";

interface Collaborator {
  name: string;
  url: string;
  isSvg?: boolean;
  svgContent?: ReactNode;
  imgSrc?: string;
}

const COLLABORATORS: Collaborator[] = [
  {
    name: "The Genuine Foundation",
    url: "https://genuinecup.org/",
    imgSrc: genuineImg,
  },
  {
    name: "Microsoft",
    url: "https://support.microsoft.com/",
    isSvg: true,
    svgContent: (
      <svg width="60" height="60" viewBox="0 0 21 21" aria-hidden="true">
        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
    ),
  },
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

export function CollaboratorCarousel({ lang }: { lang: Lang }) {
  const t = useT(lang);

  // Triple the array to ensure smooth infinite scrolling without gaps
  const duplicatedCollaborators = [...COLLABORATORS, ...COLLABORATORS, ...COLLABORATORS, ...COLLABORATORS, ...COLLABORATORS];

  return (
    <div
      className="w-full select-none overflow-hidden"
      role="region"
      aria-label={t("landing.supported")}
      style={{ perspective: "1000px" }}
    >
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 5)); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: fit-content;
            animation: infinite-scroll 40s linear infinite;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="relative min-h-[160px] flex items-center overflow-hidden">
        <div className="animate-infinite-scroll gap-8 md:gap-12 py-4 px-4">
          {duplicatedCollaborators.map((item, idx) => (
            <motion.a
              key={`${item.name}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title={item.name}
              className="flex items-center justify-center rounded-3xl border-2 border-border shadow-md bg-card p-6 shrink-0"
              style={{
                width: 180,
                height: 120,
              }}
              whileHover={{ 
                scale: 1.1, 
                rotateY: 15, 
                rotateX: 5, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
              }}
              initial={{ 
                rotateY: idx % 2 === 0 ? 10 : -10, 
                y: idx % 2 === 0 ? -4 : 4 
              }}
              animate={{
                rotateY: [idx % 2 === 0 ? 10 : -10, idx % 2 === 0 ? -10 : 10, idx % 2 === 0 ? 10 : -10],
                y: [idx % 2 === 0 ? -4 : 4, idx % 2 === 0 ? 4 : -4, idx % 2 === 0 ? -4 : 4]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: idx * 0.2
              }}
            >
              {item.isSvg ? (
                <div className="w-16 h-16 flex items-center justify-center">{item.svgContent}</div>
              ) : (
                <img
                  src={item.imgSrc}
                  alt={item.name}
                  className="object-contain w-full h-full max-h-16"
                />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
