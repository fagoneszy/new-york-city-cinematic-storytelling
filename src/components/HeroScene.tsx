import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";
import { ArrowDown } from "lucide-react";

export default function HeroScene({ progress, onNext }: { progress: number; onNext: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const springScroll = useSmoothProgress(progress, { stiffness: 45, damping: 20 });
  const scale = useTransform(springScroll, [0, 1], [1.02, 1.15]);
  const opacity = useTransform(springScroll, [0, 0.8], [1, 0]);
  const blurProgress = useTransform(springScroll, [0, 0.5], ["blur(0px)", "blur(10px)"]);
  const yText = useTransform(springScroll, [0, 1], [0, -100]);

  return (
    <div 
      ref={containerRef}
      id="hero-scene-container"
      className="relative h-screen w-full bg-black overflow-hidden flex flex-col justify-between"
    >
      {/* Background Cinematic Image with gradual load / zoom effects */}
      <motion.div 
        id="hero-bg-wrapper"
        style={{ 
          scale,
          filter: blurProgress,
          opacity,
          backgroundImage: `url('https://images.unsplash.com/photo-1522083165195-3427ec02927a?auto=format&fit=crop&w=2000&q=80')`,
          backgroundPosition: "center 30%",
        }}
        initial={{ scale: 1.1, filter: "blur(20px)", opacity: 0 }}
        animate={{ scale: 1.02, filter: "blur(0px)", opacity: 0.55 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
      />

      {/* Dynamic cinematic letterbox bars for high-end cinematic aspect-ratio feeling */}
      <div id="letterbox-top" className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none opacity-80" />
      <div id="letterbox-bottom" className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

      {/* Elegant dark overlay */}
      <div id="hero-vignette" className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80 pointer-events-none z-10" />

      {/* Main typographic content */}
      <div id="hero-content" className="relative z-10 flex-grow flex flex-col items-center justify-center px-6">
        <motion.div
          id="hero-title-group"
          style={{ y: yText }}
          className="text-center select-none"
        >

          
          {/* Massive Display Title */}
          <h1 className="overflow-hidden py-2">
            <motion.span
              id="hero-title"
              initial={{ y: "100%", filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="block text-7xl md:text-[11rem] font-bold tracking-[0.15em] text-white select-none leading-none"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.05)" }}
            >
              NOVA YORK
            </motion.span>
          </h1>

          {/* Impactful tagline */}
          <div className="overflow-hidden mt-6">
            <motion.p
              id="hero-subtitle"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-2xl font-light tracking-[0.25em] text-zinc-300 antialiased"
            >
              A Cidade Que Nunca Dorme
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Bottom breathing scroll indicator */}
      <div id="hero-footer" className="relative z-10 flex flex-col items-center justify-end pb-12">
        <motion.div
          id="hero-scroll-prompt"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 1.0 }}
          className="flex flex-col items-center gap-2 cursor-pointer text-zinc-400"
          onClick={onNext}
        >
          <span className="text-[10px] uppercase tracking-[0.5em] font-mono select-none">SCROLL PARA ENTRAR</span>
          <ArrowDown className="w-4 h-4 stroke-[1.2]" />
        </motion.div>
      </div>
    </div>
  );
}
