import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";
import { RefreshCw } from "lucide-react";

export default function FinalScene({ progress, onReplay }: { progress: number; onReplay: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const smoothScroll = useSmoothProgress(progress, { stiffness: 45, damping: 20 });

  // Soft zoom on the skyline as we settle
  const scale = useTransform(smoothScroll, [0, 1], [1.02, 1.15]);
  
  // Fade-in at start, fade-out to black at absolute end of the website
  const containerOpacity = useTransform(smoothScroll, [0, 0.2, 0.82, 1], [0.3, 1, 1, 0]);

  // Text parallax and opacity reveals
  const textOpacity = useTransform(smoothScroll, [0.1, 0.4, 1.0], [0, 1, 1]);
  const textY = useTransform(smoothScroll, [0.1, 0.4], [50, 0]);

  // Method to return to start
  const handleReplay = () => {
    onReplay();
  };

  return (
    <div 
      ref={containerRef} 
      id="final-scene-container" 
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Sticky presentation frame */}
      <div id="final-sticky" className="relative h-full w-full overflow-hidden flex flex-col justify-between p-8 md:p-24 selection:bg-white/10 selection:text-white">
        
        {/* Night Skyline Backdrop */}
        <motion.div
          id="final-skyline-bg"
          style={{ 
            scale,
            opacity: containerOpacity,
            backgroundImage: "url('https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=2000&q=80')"
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center origin-center pointer-events-none"
        />

        {/* Global Dark Overlays */}
        <div id="final-gradient-overlay" className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black pointer-events-none z-10" />

        {/* Cinematic letterbox bars */}
        <div id="final-letterbox-top" className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none opacity-80" />
        <div id="final-letterbox-bottom" className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

        {/* Top brand stamp */}
        <div id="final-brand" className="relative z-25 flex justify-between items-center w-full font-mono text-[10px] tracking-[0.4em] text-zinc-500 pointer-events-none select-none">
        </div>

        {/* Center Typography Block */}
        <div id="final-content" className="relative z-25 flex-grow flex flex-col justify-center items-center select-none text-center px-4">
          <motion.div
            id="final-text-group"
            style={{ 
              opacity: textOpacity,
              y: textY 
            }}
            className="flex flex-col items-center"
          >
            {/* Category marker */}
            <span id="final-marker-text" className="text-zinc-500 font-mono text-xs tracking-[0.6em] uppercase block mb-6">
              A METRÓPOLE SOBERANA
            </span>

            {/* Massive Display Title */}
            <h2 id="final-hero-title" className="text-5xl md:text-9xl font-black text-white tracking-[0.2em] uppercase leading-none mb-8">
              NOVA YORK
            </h2>

            {/* Cinematic Ending Message */}
            <p id="final-message-line1" className="text-lg md:text-3xl font-light text-zinc-300 tracking-[0.25em] mb-3 leading-relaxed">
              Mais que uma cidade.
            </p>
            <p id="final-message-line2" className="text-lg md:text-3xl font-extralight italic text-zinc-400 tracking-[0.25em] leading-relaxed">
              Uma história viva.
            </p>

            {/* End credit marker divider */}
            <div id="final-credit-line" className="w-16 h-[1px] bg-white/20 my-10" />

            {/* Elegant, interactive Replay Cue */}
            <button
              id="replay-button"
              onClick={handleReplay}
              className="group flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-white/30 rounded-full bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-500 cursor-pointer text-zinc-400 hover:text-white pointer-events-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[1.5] transition-transform duration-700 group-hover:rotate-180" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Repetir Jornada</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom meta stats block */}
        <div id="final-footing-meta" className="relative z-25 flex justify-between items-center w-full font-mono text-[10px] tracking-[0.3em] text-zinc-500 select-none pb-4">
          <span>©fago</span>
        </div>

      </div>
    </div>
  );
}
