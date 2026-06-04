import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";

export default function ZoomRevealScene({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const smoothScroll = useSmoothProgress(progress, { stiffness: 45, damping: 20 });

  // Transform image scale down from 1.8x to 1.02x
  const imageScale = useTransform(smoothScroll, [0, 0.8], [1.8, 1.02]);
  
  // Combined filter: blur + brightness + contrast as we zoom in
  const imageFilter = useTransform(
    smoothScroll,
    [0, 0.75],
    ["blur(15px) brightness(0.2) contrast(1.15)", "blur(0px) brightness(0.7) contrast(1.0)"]
  );

  // Typography animations - reveal once the details are sharp
  const textOpacity = useTransform(smoothScroll, [0.15, 0.55], [0, 1]);
  const textY = useTransform(smoothScroll, [0.15, 0.55], [60, 0]);
  const textScale = useTransform(smoothScroll, [0.15, 0.55], [0.96, 1]);

  return (
    <div 
      ref={containerRef} 
      id="zoom-reveal-section" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Sticky presentation frame */}
      <div id="zoom-reveal-sticky" className="relative h-full w-full overflow-hidden flex items-center justify-center">
        
        {/* Fullscreen Map Grid Image */}
        <motion.div
          id="zoom-image-canvas"
          style={{ 
            scale: imageScale,
            filter: imageFilter,
            backgroundImage: "url('https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?auto=format&fit=crop&w=2000&q=80')"
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center origin-center pointer-events-none"
        />

        {/* Cinematic Vignette */}
        <div id="zoom-frame-vignette" className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10" />

        {/* Text Reveal Layer */}
        <motion.div
          id="zoom-typography-container"
          style={{ 
            opacity: textOpacity, 
            y: textY,
            scale: textScale
          }}
          className="relative z-15 text-center px-4 max-w-4xl select-none"
        >
          <span id="zoom-tag-micro" className="text-xs md:text-sm font-mono tracking-[0.5em] uppercase text-zinc-400 block mb-4">
            O PORTAL DA AMBIÇÃO
          </span>
          <h2 id="zoom-headline-main" className="text-5xl md:text-[7rem] font-bold tracking-tight text-white uppercase leading-none">
            O mundo
            <br />
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-white to-zinc-500">
              chega aqui.
            </span>
          </h2>
          <div id="zoom-heading-bottom-divider" className="w-16 h-[1px] bg-white/20 mx-auto mt-8" />
        </motion.div>

        {/* Technical documentary labels in border margins */}
        <div id="zoom-panel-tags" className="absolute top-12 left-12 right-12 z-20 flex justify-between items-center text-[10px] font-mono tracking-[0.3em] text-zinc-500 pointer-events-none">
          <span>RECONHECIMENTO AÉREO</span>
          <span>[ NY-CEN-06 ]</span>
        </div>
        
      </div>
    </div>
  );
}
