import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";

interface WordTiming {
  text: string;
  sub: string;
  range: [number, number, number];
  yRange: [number, number, number];
}

const WORDS: WordTiming[] = [
  { 
    text: "Sonhe.", 
    sub: "CONCEBIDO NO FERRO FRIO",
    range: [0.0, 0.12, 0.25], 
    yRange: [50, 0, -50] 
  },
  { 
    text: "Construa.", 
    sub: "FORJADO NOS TEMPLOS ERGUIDOS",
    range: [0.25, 0.38, 0.5], 
    yRange: [50, 0, -50] 
  },
  { 
    text: "Levante-se.", 
    sub: "ESTENDIDO ALÉM DA ESTRATOSFERA",
    range: [0.5, 0.62, 0.75], 
    yRange: [50, 0, -50] 
  },
  { 
    text: "Conquiste.", 
    sub: "ETERNAZIDO NA LUZ SOBERANA",
    range: [0.75, 0.88, 1.0], 
    yRange: [50, 0, -50] 
  }
];

export default function TypographyScene({ progress }: { progress: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const smoothScroll = useSmoothProgress(progress, { stiffness: 50, damping: 22 });

  return (
    <div 
      ref={sectionRef} 
      id="typography-story-container" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Sticky viewport content container */}
      <div id="typography-sticky" className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center bg-black select-none">
        
        {/* Subtle grid pattern background accent */}
        <div id="typography-grid-decor" className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
        <div id="typography-top-fog" className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div id="typography-bottom-fog" className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        {/* Word stack container */}
        <div id="typography-words-wrap" className="relative w-full max-w-5xl h-64 md:h-96 flex items-center justify-center px-6">
          {WORDS.map((word, index) => {
            // Compute word-specific transformations matching their active range
            const opacity = useTransform(smoothScroll, word.range, [0, 1, 0]);
            const y = useTransform(smoothScroll, word.range, word.yRange);
            const scale = useTransform(smoothScroll, word.range, [0.93, 1.0, 1.05]);
            const blur = useTransform(
              smoothScroll, 
              word.range, 
              ["blur(20px)", "blur(0px)", "blur(15px)"]
            );

            return (
              <motion.div
                key={word.text}
                id={`typography-word-${index}`}
                style={{ 
                  opacity,
                  y,
                  scale,
                  filter: blur
                }}
                className="absolute flex flex-col items-center justify-center text-center w-full"
              >
                {/* Floating category text */}
                <span id={`typography-sub-${index}`} className="text-zinc-500 font-mono text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 md:mb-6 block">
                  {word.sub}
                </span>

                {/* Massive single word */}
                <h3 
                  id={`typography-heading-${index}`}
                  className="text-5xl md:text-[9rem] font-black tracking-[0.05em] text-white leading-none uppercase"
                  style={{ textShadow: "0 0 60px rgba(255,255,255,0.08)" }}
                >
                  {word.text}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* Elegant documentary side-index to show scroll indicator */}
        <div id="typography-index-tracker" className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center z-10 hidden md:flex">
          {WORDS.map((word, i) => {
            const dotOpacity = useTransform(
              smoothScroll,
              [word.range[0], word.range[1], word.range[2]],
              [0.2, 1, 0.2]
            );
            const dotScale = useTransform(
              smoothScroll,
              [word.range[0], word.range[1], word.range[2]],
              [1, 1.4, 1]
            );

            return (
              <div key={word.text} className="flex flex-col items-end gap-1 group">
                <motion.div
                  style={{ opacity: dotOpacity, scale: dotScale }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              </div>
            );
          })}
        </div>

        {/* Document marker tag */}
        <div id="typography-bottom-decor" className="absolute bottom-12 font-mono text-[10px] tracking-[0.4em] text-zinc-500 pointer-events-none">
          CRÔNICAS DA ASCENSÃO
        </div>

      </div>
    </div>
  );
}
