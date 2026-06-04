import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";

export default function ImageRevealSection({ progress }: { progress: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const smoothProgress = useSmoothProgress(progress, { stiffness: 60, damping: 25 });

  // Map the scroll progress to the elegant clip path
  const clipPathValue = useTransform(
    smoothProgress,
    [0, 0.65],
    [
      "inset(25% 35% 25% 35% round 16px)", // Starts as a cinematic letterbox rectangle
      "inset(0% 0% 0% 0% round 0px)"       // Spans to fill the entire viewport
    ]
  );

  // Text Animations mapped to progress after the reveal is largely complete
  const textOpacity = useTransform(smoothProgress, [0.15, 0.45], [0, 1]);
  const textY = useTransform(smoothProgress, [0.15, 0.45], [50, 0]);
  const textScale = useTransform(smoothProgress, [0.15, 0.45], [0.95, 1]);

  // Image brightness and scale adjustments as it reveals
  const imageScale = useTransform(smoothProgress, [0, 1], [1.1, 1.02]);
  const overlayOpacity = useTransform(smoothProgress, [0, 0.65, 1], [0.7, 0.4, 0.6]);

  return (
    <div 
      ref={sectionRef} 
      id="img-reveal-container" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Absolute center viewport frame */}
      <div id="img-reveal-sticky" className="relative h-full w-full overflow-hidden flex items-center justify-center">
        
        {/* Cinematic Clip Path Mask Container */}
        <motion.div 
          id="reveal-mask-container"
          style={{ clipPath: clipPathValue }}
          className="absolute inset-0 w-full h-full bg-zinc-950 flex items-center justify-center"
        >
          {/* Panoramic NYC Nighttime Skyline */}
          <motion.div
            id="reveal-bg"
            style={{ 
              scale: imageScale,
              backgroundImage: "url('https://images.unsplash.com/photo-1546436836-07a91091f119?auto=format&fit=crop&w=2000&q=80')" 
            }}
            className="absolute inset-0 bg-cover bg-center"
          />

          {/* Moody vignette overlay on image */}
          <motion.div 
            id="reveal-overlay"
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/90 pointer-events-none" 
          />
          
        </motion.div>

        {/* Cinematic subtle letterbox bars overlay to reinforce documentary-series rhythm */}
        <div id="reveal-safe-border" className="absolute inset-6 border border-white/5 pointer-events-none z-20" />

        {/* Overlay Content - revealed via scroll progress */}
        <motion.div 
          id="reveal-typography-overlay"
          style={{ 
            opacity: textOpacity, 
            y: textY,
            scale: textScale
          }}
          className="relative z-30 text-center px-4 max-w-4xl select-none"
        >
          <p id="reveal-tagline-small" className="text-sm md:text-base font-mono uppercase tracking-[0.4em] text-zinc-400 mb-4">
            O Monólito Vivo
          </p>
          <h2 id="reveal-heading" className="text-4xl md:text-8xl font-black tracking-tight leading-tight text-white mb-6">
            8 Milhões de Histórias.<br />
            <span className="text-zinc-300 font-light italic">Uma Cidade.</span>
          </h2>
          <div id="reveal-bottom-accent" className="w-12 h-[1px] bg-white/20 mx-auto mt-8" />
        </motion.div>
      </div>
    </div>
  );
}
